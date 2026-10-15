import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  getSupabaseClient,
  isCloudConfigured,
  setSupabaseConfig,
  clearSupabaseConfig,
  getSupabaseConfig,
} from '@/services/supabase'
import { fetchCloudProgress, saveCloudProgressDirect } from '@/services/cloudProgressService'
import { useProgressStore } from '@/stores/progress'

export interface UserAccount {
  id: string
  email: string
  displayName: string
  avatar: string
  createdAt: string
  lastLoginAt?: string
  isCloud: boolean
}

const LOCAL_ACCOUNTS_KEY = 'codequest:accounts:v1'
const CURRENT_USER_KEY = 'codequest:current_user_id:v1'

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(password)
  const subtle =
    globalThis.crypto?.subtle ??
    (typeof window !== 'undefined' ? (window.crypto as { subtle?: SubtleCrypto })?.subtle : undefined)

  if (subtle && typeof subtle.digest === 'function') {
    try {
      const hashBuffer = await subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    } catch {}
  }

  let hash = 0
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i)
    hash |= 0
  }
  return 'h_' + Math.abs(hash).toString(16)
}

function loadLocalAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as UserAccount[]) : []
  } catch {
    return []
  }
}

export const useAuthStore = defineStore('auth', () => {
  const localAccounts = ref<UserAccount[]>(loadLocalAccounts())
  const currentUserId = ref<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(CURRENT_USER_KEY) : null,
  )
  const cloudUser = ref<UserAccount | null>(null)
  const authModalOpen = ref(false)
  const authModalTab = ref<'login' | 'register' | 'cloud'>('login')
  const cloudActive = ref(isCloudConfigured())

  let initialized = false

  const currentUser = computed<UserAccount | null>(() => {
    if (cloudUser.value) return cloudUser.value
    if (!currentUserId.value) return null
    return localAccounts.value.find((a) => a.id === currentUserId.value) ?? null
  })

  const isGuest = computed(() => !currentUser.value)
  const isCloud = computed(() => cloudActive.value && !!cloudUser.value)

  watch(
    localAccounts,
    (accs) => {
      try {
        localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accs))
      } catch {}
    },
    { deep: true },
  )

  watch(currentUserId, (id) => {
    try {
      if (id) {
        localStorage.setItem(CURRENT_USER_KEY, id)
      } else {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    } catch {}
  })

  async function initAuth() {
    if (initialized) return
    initialized = true

    cloudActive.value = isCloudConfigured()
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        await handleSupabaseSession(data.session.user)
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await handleSupabaseSession(session.user)
        } else if (event === 'SIGNED_OUT') {
          cloudUser.value = null
          currentUserId.value = null
          const progress = useProgressStore()
          progress.switchUser(null)
        }
      })
    } catch (err) {
      console.warn('Ошибка при проверке онлайн-сессии Supabase:', err)
    }
  }

  async function handleSupabaseSession(user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string }) {
    const progress = useProgressStore()
    const meta = user.user_metadata || {}

    // Fetch cloud progress from Supabase
    const cloudRes = await fetchCloudProgress(user.id)

    const account: UserAccount = {
      id: user.id,
      email: user.email || '',
      displayName: (cloudRes.userMeta?.displayName || meta.displayName || user.email?.split('@')[0] || 'Пользователь') as string,
      avatar: (cloudRes.userMeta?.avatar || meta.avatar || '🤖') as string,
      createdAt: user.created_at || new Date().toISOString(),
      isCloud: true,
    }

    cloudUser.value = account
    currentUserId.value = user.id

    if (cloudRes.data) {
      progress.importData(cloudRes.data)
      progress.activeUserId = user.id
    } else {
      // First time in cloud: save current progress to cloud
      progress.switchUser(user.id)
      await saveCloudProgressDirect(user.id, progress.snapshot(), {
        displayName: account.displayName,
        avatar: account.avatar,
        email: account.email,
      })
    }
  }

  async function register(params: {
    email: string
    password?: string
    displayName?: string
    avatar?: string
  }): Promise<{ ok: boolean; error?: string; message?: string }> {
    const email = params.email.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      return { ok: false, error: 'Введите корректный email адрес' }
    }
    if (!params.password || params.password.length < 6) {
      return { ok: false, error: 'Пароль должен содержать минимум 6 символов' }
    }

    const progress = useProgressStore()
    const supabase = getSupabaseClient()

    if (supabase && cloudActive.value) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: params.password,
          options: {
            data: {
              displayName: params.displayName?.trim() || email.split('@')[0],
              avatar: params.avatar || '🤖',
            },
          },
        })

        if (error) {
          return { ok: false, error: error.message }
        }

        if (data.user) {
          if (data.session) {
            await handleSupabaseSession(data.user)
            authModalOpen.value = false
            return { ok: true }
          } else {
            authModalOpen.value = false
            return {
              ok: true,
              message: 'Регистрация успешна! Если на почту пришло письмо подтверждения, подтвердите адрес.',
            }
          }
        }
      } catch (err: unknown) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    }

    // Local fallback if cloud is not yet configured
    const existing = localAccounts.value.find((a) => a.email.toLowerCase() === email)
    if (existing) {
      return { ok: false, error: 'Пользователь с таким email уже существует' }
    }

    const now = new Date().toISOString()
    const newAccount: UserAccount = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      email,
      displayName: params.displayName?.trim() || email.split('@')[0],
      avatar: params.avatar || '🤖',
      createdAt: now,
      lastLoginAt: now,
      isCloud: false,
    }

    localAccounts.value.push(newAccount)
    currentUserId.value = newAccount.id
    progress.switchUser(newAccount.id)
    authModalOpen.value = false

    return { ok: true }
  }

  async function login(
    emailInput: string,
    passwordInput: string,
  ): Promise<{ ok: boolean; error?: string }> {
    const email = emailInput.trim().toLowerCase()
    if (!email) return { ok: false, error: 'Введите email' }

    const supabase = getSupabaseClient()

    if (supabase && cloudActive.value) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: passwordInput,
        })

        if (error) {
          return { ok: false, error: error.message }
        }

        if (data.user) {
          await handleSupabaseSession(data.user)
          authModalOpen.value = false
          return { ok: true }
        }
      } catch (err: unknown) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    }

    // Local fallback
    const account = localAccounts.value.find((a) => a.email.toLowerCase() === email)
    if (!account) {
      return { ok: false, error: 'Пользователь не найден' }
    }

    account.lastLoginAt = new Date().toISOString()
    currentUserId.value = account.id
    const progress = useProgressStore()
    progress.switchUser(account.id)
    authModalOpen.value = false

    return { ok: true }
  }

  async function logout() {
    const supabase = getSupabaseClient()
    if (supabase && cloudUser.value) {
      try {
        await supabase.auth.signOut()
      } catch {}
    }
    cloudUser.value = null
    currentUserId.value = null
    const progress = useProgressStore()
    progress.switchUser(null)
  }

  function configureCloud(url: string, anonKey: string) {
    setSupabaseConfig(url, anonKey)
    cloudActive.value = isCloudConfigured()
    initialized = false
    initAuth()
  }

  function disconnectCloud() {
    clearSupabaseConfig()
    cloudActive.value = false
    logout()
  }

  function openAuthModal(tab: 'login' | 'register' | 'cloud' = 'login') {
    authModalTab.value = tab
    authModalOpen.value = true
  }

  function closeAuthModal() {
    authModalOpen.value = false
  }

  return {
    accounts: localAccounts,
    currentUserId,
    currentUser,
    isGuest,
    isCloud,
    cloudActive,
    authModalOpen,
    authModalTab,
    initAuth,
    register,
    login,
    logout,
    configureCloud,
    disconnectCloud,
    openAuthModal,
    closeAuthModal,
    getSupabaseConfig,
  }
})
