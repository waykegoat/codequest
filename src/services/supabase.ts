import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const STORAGE_URL_KEY = 'codequest:supabase_url'
const STORAGE_ANON_KEY = 'codequest:supabase_anon_key'

let cachedClient: SupabaseClient | null = null

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

  const localUrl = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '').trim()
  const localKey = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) || '' : '').trim()

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey,
  }
}

export function isCloudConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig()
  return Boolean(url && anonKey && url.startsWith('http'))
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient

  const { url, anonKey } = getSupabaseConfig()
  if (!url || !anonKey || !url.startsWith('http')) {
    return null
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
    return cachedClient
  } catch (err) {
    console.error('Ошибка инициализации Supabase:', err)
    return null
  }
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  const cleanUrl = url.trim()
  const cleanKey = anonKey.trim()
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, cleanUrl)
    localStorage.setItem(STORAGE_ANON_KEY, cleanKey)
  }
  cachedClient = null
}

export function clearSupabaseConfig(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY)
    localStorage.removeItem(STORAGE_ANON_KEY)
  }
  cachedClient = null
}
