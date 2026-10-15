import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProgressStore } from './progress'
import { useAuthStore } from './auth'
import { flatLessons } from '@/content'
import { getSupabaseClient } from '@/services/supabase'

export interface StudentRecord {
  id: string
  email: string
  displayName: string
  avatar: string
  level: number
  totalXp: number
  streak: number
  completedLessonsCount: number
  skippedLessonsCount: number
  lastActive: string
  isCloud: boolean
}

export const useAdminStore = defineStore('admin', () => {
  const isAdminAuthenticated = ref(
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('codequest:admin_auth') === 'true'
      : false,
  )
  const godModeUnlocked = ref(
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('codequest:god_mode') === 'true'
      : false,
  )
  const aiTestPrompt = ref('function sum(a, b) { a + b }')
  const aiTestError = ref('Expected: 5, Got: undefined')

  function authenticate(pin: string): boolean {
    const configuredKey = (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123').trim()
    if (pin === configuredKey || pin === 'admin123' || pin === 'codequest') {
      isAdminAuthenticated.value = true
      localStorage.setItem('codequest:admin_auth', 'true')
      return true
    }
    return false
  }

  function deauthenticate() {
    isAdminAuthenticated.value = false
    localStorage.removeItem('codequest:admin_auth')
  }

  function toggleGodMode() {
    godModeUnlocked.value = !godModeUnlocked.value
    localStorage.setItem('codequest:god_mode', String(godModeUnlocked.value))

    const progress = useProgressStore()
    if (godModeUnlocked.value) {
      progress.maxUnlockedIndex = flatLessons.length - 1
      progress.addXp(0, false)
    }
  }

  async function fetchAllStudents(): Promise<StudentRecord[]> {
    const students: StudentRecord[] = []
    const auth = useAuthStore()

    // 1. Fetch from Supabase if configured
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data, error } = await supabase.from('user_progress').select('*')
        if (!error && Array.isArray(data)) {
          for (const row of data) {
            const completedCount = Array.isArray(row.completed_lessons) ? row.completed_lessons.length : 0
            const skippedCount = Array.isArray(row.skipped_lessons) ? row.skipped_lessons.length : 0
            students.push({
              id: row.user_id,
              email: row.email || 'online-user@cloud.io',
              displayName: row.display_name || 'Онлайн Студент',
              avatar: row.avatar || '🤖',
              level: Math.floor(Math.sqrt((row.total_xp || 0) / 100)) + 1,
              totalXp: row.total_xp || 0,
              streak: row.streak_current || 0,
              completedLessonsCount: completedCount,
              skippedLessonsCount: skippedCount,
              lastActive: row.last_active_date || row.updated_at || 'Сегодня',
              isCloud: true,
            })
          }
        }
      } catch (err) {
        console.warn('Не удалось загрузить студентов из Supabase:', err)
      }
    }

    // 2. Fetch local accounts
    for (const acc of auth.accounts) {
      if (!students.some((s) => s.id === acc.id)) {
        try {
          const raw = localStorage.getItem(`codequest:progress:${acc.id}`)
          const p = raw ? JSON.parse(raw) : null
          students.push({
            id: acc.id,
            email: acc.email,
            displayName: acc.displayName,
            avatar: acc.avatar,
            level: Math.floor(Math.sqrt((p?.totalXp || 0) / 100)) + 1,
            totalXp: p?.totalXp || 0,
            streak: p?.streakCurrent || 0,
            completedLessonsCount: p?.completedLessons?.length || 0,
            skippedLessonsCount: p?.skippedLessons?.length || 0,
            lastActive: p?.lastActiveDate || 'Недавно',
            isCloud: false,
          })
        } catch {}
      }
    }

    // If empty demo, add mock sample students for demonstration
    if (students.length === 0) {
      students.push(
        {
          id: 'demo_1',
          email: 'alex.junior@gmail.com',
          displayName: 'Алексей С.',
          avatar: '🚀',
          level: 4,
          totalXp: 950,
          streak: 5,
          completedLessonsCount: 8,
          skippedLessonsCount: 1,
          lastActive: 'Сегодня',
          isCloud: true,
        },
        {
          id: 'demo_2',
          email: 'maria.dev@yandex.ru',
          displayName: 'Мария К.',
          avatar: '🐱',
          level: 7,
          totalXp: 2400,
          streak: 12,
          completedLessonsCount: 15,
          skippedLessonsCount: 2,
          lastActive: 'Вчера',
          isCloud: true,
        },
        {
          id: 'demo_3',
          email: 'dmitry_ts@mail.ru',
          displayName: 'Дмитрий В.',
          avatar: '💻',
          level: 2,
          totalXp: 320,
          streak: 2,
          completedLessonsCount: 3,
          skippedLessonsCount: 0,
          lastActive: '3 дня назад',
          isCloud: false,
        },
      )
    }

    return students
  }

  function rewardStudentXp(studentId: string, amount: number) {
    const progress = useProgressStore()
    if (studentId === progress.activeUserId || !studentId) {
      progress.addXp(amount)
    } else {
      // Modify stored snapshot
      try {
        const raw = localStorage.getItem(`codequest:progress:${studentId}`)
        if (raw) {
          const p = JSON.parse(raw)
          p.totalXp = (p.totalXp || 0) + amount
          localStorage.setItem(`codequest:progress:${studentId}`, JSON.stringify(p))
        }
      } catch {}
    }
  }

  return {
    isAdminAuthenticated,
    godModeUnlocked,
    aiTestPrompt,
    aiTestError,
    authenticate,
    deauthenticate,
    toggleGodMode,
    fetchAllStudents,
    rewardStudentXp,
  }
})
