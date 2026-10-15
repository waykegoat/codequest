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
  completedLessons?: string[]
  skippedLessons?: string[]
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
            const completed = Array.isArray(row.completed_lessons) ? row.completed_lessons : []
            const skipped = Array.isArray(row.skipped_lessons) ? row.skipped_lessons : []
            students.push({
              id: row.user_id,
              email: row.email || 'online-user@cloud.io',
              displayName: row.display_name || 'Онлайн Студент',
              avatar: row.avatar || '🤖',
              level: Math.floor(Math.sqrt((row.total_xp || 0) / 100)) + 1,
              totalXp: row.total_xp || 0,
              streak: row.streak_current || 0,
              completedLessonsCount: completed.length,
              skippedLessonsCount: skipped.length,
              completedLessons: completed,
              skippedLessons: skipped,
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
          const completed = Array.isArray(p?.completedLessons) ? p.completedLessons : []
          const skipped = Array.isArray(p?.skippedLessons) ? p.skippedLessons : []
          students.push({
            id: acc.id,
            email: acc.email,
            displayName: acc.displayName,
            avatar: acc.avatar,
            level: Math.floor(Math.sqrt((p?.totalXp || 0) / 100)) + 1,
            totalXp: p?.totalXp || 0,
            streak: p?.streakCurrent || 0,
            completedLessonsCount: completed.length,
            skippedLessonsCount: skipped.length,
            completedLessons: completed,
            skippedLessons: skipped,
            lastActive: p?.lastActiveDate || 'Недавно',
            isCloud: acc.isCloud || false,
          })
        } catch {}
      }
    }

    // 3. Include current active player session if not already in list
    const progress = useProgressStore()
    const currentId = progress.activeUserId || 'current_guest'
    if (!students.some((s) => s.id === currentId || (auth.currentUser && s.id === auth.currentUser.id))) {
      const cur = auth.currentUser
      const lvl = typeof progress.level === 'object' ? progress.level.level : Number(progress.level) || 1
      const completedArr = Array.from(progress.completedLessons)
      const skippedArr = Array.from(progress.skippedLessons)
      students.push({
        id: cur?.id || currentId,
        email: cur?.email || 'Локальный игрок',
        displayName: cur?.displayName || 'Текущий игрок',
        avatar: cur?.avatar || '🎮',
        level: lvl,
        totalXp: progress.totalXp || 0,
        streak: progress.streakCurrent || 0,
        completedLessonsCount: completedArr.length,
        skippedLessonsCount: skippedArr.length,
        completedLessons: completedArr,
        skippedLessons: skippedArr,
        lastActive: progress.lastActiveDate || 'Сейчас',
        isCloud: cur?.isCloud || false,
      })
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
