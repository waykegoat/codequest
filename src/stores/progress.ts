import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { levelFromXp, rankForLevel, XP_REWARDS, badgeById } from '@/engine/gamification'
import { course, lessonKey } from '@/content'
import { queueCloudSync } from '@/services/cloudProgressService'

function todayStr(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db.getTime() - da.getTime()) / 86_400_000)
}

export interface PersistShape {
  totalXp: number
  completedLessons: string[]
  completedSteps: string[]
  solvedCode: number
  earnedBadges: string[]
  streakCurrent: number
  streakLongest: number
  lastActiveDate: string | null
  streakFreezes: number
  maxUnlockedIndex?: number
  skippedLessons?: string[]
}

function getStorageKey(userId?: string | null): string {
  return userId ? `codequest:progress:${userId}` : 'codequest:progress:guest'
}

function load(userId?: string | null): PersistShape | null {
  try {
    const key = getStorageKey(userId)
    let raw = localStorage.getItem(key)
    // Legacy migration: if key is guest and nothing found, check legacy codequest:progress:v1
    if (!raw && !userId) {
      const legacy = localStorage.getItem('codequest:progress:v1')
      if (legacy) {
        raw = legacy
        try {
          localStorage.setItem(key, legacy)
        } catch {}
      }
    }
    return raw ? (JSON.parse(raw) as PersistShape) : null
  } catch {
    return null
  }
}

export const useProgressStore = defineStore('progress', () => {
  const activeUserId = ref<string | null>(
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('codequest:current_user_id:v1')
      : null,
  )

  const saved = load(activeUserId.value)

  const totalXp = ref(saved?.totalXp ?? 0)
  const completedLessons = reactive(new Set<string>(saved?.completedLessons ?? []))
  const completedSteps = reactive(new Set<string>(saved?.completedSteps ?? []))
  const solvedCode = ref(saved?.solvedCode ?? 0)
  const earnedBadges = reactive(new Set<string>(saved?.earnedBadges ?? []))
  const streakCurrent = ref(saved?.streakCurrent ?? 0)
  const streakLongest = ref(saved?.streakLongest ?? 0)
  const lastActiveDate = ref<string | null>(saved?.lastActiveDate ?? null)
  const streakFreezes = ref(saved?.streakFreezes ?? 0)
  const maxUnlockedIndex = ref<number>(saved?.maxUnlockedIndex ?? 0)
  const skippedLessons = reactive(new Set<string>(saved?.skippedLessons ?? []))

  const toasts = ref<{ id: number; type: 'xp' | 'badge' | 'level'; text: string; icon: string }[]>(
    [],
  )
  let toastId = 0
  function pushToast(type: 'xp' | 'badge' | 'level', text: string, icon: string) {
    const id = ++toastId
    toasts.value.push({ id, type, text, icon })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 3600)
  }

  const level = computed(() => levelFromXp(totalXp.value))
  const rank = computed(() => rankForLevel(level.value.level))

  function stepKey(lessonId: string, stepIndex: number) {
    return `${lessonId}#${stepIndex}`
  }

  const isLessonComplete = (lessonId: string) => completedLessons.has(lessonId)
  const isLessonSkipped = (lessonId: string) => skippedLessons.has(lessonId)
  const isStepComplete = (lessonId: string, stepIndex: number) =>
    completedSteps.has(stepKey(lessonId, stepIndex))
  const hasBadge = (id: string) => earnedBadges.has(id)

  function addXp(amount: number, showToast = true) {
    if (amount <= 0) return
    const before = level.value.level
    totalXp.value += amount
    if (showToast) pushToast('xp', `+${amount} XP`, '✨')
    const after = level.value.level
    if (after > before) pushToast('level', `Уровень ${after}!`, '🎉')
  }

  function awardBadge(id: string, icon: string, title: string) {
    if (earnedBadges.has(id)) return
    earnedBadges.add(id)
    pushToast('badge', title, icon)
  }

  function recordActivity() {
    const today = todayStr()
    if (lastActiveDate.value === today) return
    const gap = lastActiveDate.value ? daysBetween(lastActiveDate.value, today) : null

    if (gap === 1) {
      streakCurrent.value += 1
    } else if (gap === 2 && streakFreezes.value > 0) {
      streakFreezes.value -= 1
      streakCurrent.value += 1
      pushToast('badge', 'Заморозка спасла стрик', '❄️')
    } else {
      streakCurrent.value = 1
    }

    lastActiveDate.value = today
    streakLongest.value = Math.max(streakLongest.value, streakCurrent.value)

    if (streakCurrent.value % 5 === 0 && streakFreezes.value < 3) {
      streakFreezes.value += 1
      pushToast('badge', 'Заморозка стрика получена', '❄️')
    }

    addXp(XP_REWARDS.dailyStreak)
    pushToast('xp', `Стрик ${streakCurrent.value} дней`, '🔥')
  }

  function markStepComplete(lessonId: string, stepIndex: number, xp: number) {
    const key = stepKey(lessonId, stepIndex)
    if (completedSteps.has(key)) return false
    completedSteps.add(key)
    addXp(xp)
    return true
  }

  function skipStep(lessonId: string, stepIndex: number) {
    const key = stepKey(lessonId, stepIndex)
    if (!completedSteps.has(key)) {
      completedSteps.add(key)
    }
    pushToast('xp', 'Шаг пропущен', '⏩')
  }

  function markCodeSolved() {
    solvedCode.value += 1
  }

  function completeLesson(lessonId: string, xp: number) {
    if (completedLessons.has(lessonId)) return false
    completedLessons.add(lessonId)
    skippedLessons.delete(lessonId)
    addXp(xp)
    return true
  }

  function skipLesson(lessonId: string) {
    if (!completedLessons.has(lessonId)) {
      skippedLessons.add(lessonId)
      pushToast('xp', 'Урок пропущен', '⏩')
      return true
    }
    return false
  }

  function jumpForward(count = 5) {
    maxUnlockedIndex.value += count
    pushToast('xp', `Открыто +${count} уроков вперёд`, '⏩')
  }

  function checkAchievements() {
    const award = (id: string) => {
      const b = badgeById(id)
      if (b) awardBadge(b.id, b.icon, b.title)
    }
    if (completedLessons.size >= 1) award('first-blood')
    if (streakCurrent.value >= 3) award('streak-3')
    if (streakCurrent.value >= 7) award('streak-7')
    if (solvedCode.value >= 10) award('code-10')
    if (level.value.level >= 10) award('level-10')
    if (level.value.level >= 13) award('junior')

    const moduleComplete = (mod: (typeof course.modules)[number]) =>
      mod.lessons.every((l) => completedLessons.has(lessonKey(mod.id, l.id)))

    const firstModule = course.modules[0]
    if (firstModule && moduleComplete(firstModule)) award('module-1')

    const interview = course.modules.find((m) => m.id === 'interview')
    if (interview && moduleComplete(interview)) award('interview-ready')

    if (course.modules.every(moduleComplete)) award('graduate')
  }

  function reset() {
    totalXp.value = 0
    completedLessons.clear()
    completedSteps.clear()
    earnedBadges.clear()
    solvedCode.value = 0
    streakCurrent.value = 0
    streakLongest.value = 0
    lastActiveDate.value = null
    streakFreezes.value = 0
    maxUnlockedIndex.value = 0
    skippedLessons.clear()
  }

  function saveCurrent() {
    try {
      const key = getStorageKey(activeUserId.value)
      localStorage.setItem(key, JSON.stringify(snapshot()))
      if (!activeUserId.value) {
        localStorage.setItem('codequest:progress:v1', JSON.stringify(snapshot()))
      }
    } catch {}
  }

  function switchUser(newUserId: string | null) {
    saveCurrent()
    activeUserId.value = newUserId
    const data = load(newUserId)
    totalXp.value = data?.totalXp ?? 0
    completedLessons.clear()
    data?.completedLessons?.forEach((l) => completedLessons.add(l))
    completedSteps.clear()
    data?.completedSteps?.forEach((s) => completedSteps.add(s))
    earnedBadges.clear()
    data?.earnedBadges?.forEach((b) => earnedBadges.add(b))
    solvedCode.value = data?.solvedCode ?? 0
    streakCurrent.value = data?.streakCurrent ?? 0
    streakLongest.value = data?.streakLongest ?? 0
    lastActiveDate.value = data?.lastActiveDate ?? null
    streakFreezes.value = data?.streakFreezes ?? 0
    maxUnlockedIndex.value = data?.maxUnlockedIndex ?? 0
    skippedLessons.clear()
    data?.skippedLessons?.forEach((s) => skippedLessons.add(s))
  }

  function snapshot(): PersistShape {
    return {
      totalXp: totalXp.value,
      completedLessons: [...completedLessons],
      completedSteps: [...completedSteps],
      solvedCode: solvedCode.value,
      earnedBadges: [...earnedBadges],
      streakCurrent: streakCurrent.value,
      streakLongest: streakLongest.value,
      lastActiveDate: lastActiveDate.value,
      streakFreezes: streakFreezes.value,
      maxUnlockedIndex: maxUnlockedIndex.value,
      skippedLessons: [...skippedLessons],
    }
  }

  function exportData(): string {
    return JSON.stringify(snapshot(), null, 2)
  }

  function importData(rawOrJson: string | PersistShape): boolean {
    try {
      const snap: PersistShape =
        typeof rawOrJson === 'string' ? JSON.parse(rawOrJson) : rawOrJson
      totalXp.value = snap.totalXp ?? 0
      completedLessons.clear()
      snap.completedLessons?.forEach((l) => completedLessons.add(l))
      completedSteps.clear()
      snap.completedSteps?.forEach((s) => completedSteps.add(s))
      earnedBadges.clear()
      snap.earnedBadges?.forEach((b) => earnedBadges.add(b))
      solvedCode.value = snap.solvedCode ?? 0
      streakCurrent.value = snap.streakCurrent ?? 0
      streakLongest.value = snap.streakLongest ?? 0
      lastActiveDate.value = snap.lastActiveDate ?? null
      streakFreezes.value = snap.streakFreezes ?? 0
      maxUnlockedIndex.value = snap.maxUnlockedIndex ?? 0
      skippedLessons.clear()
      snap.skippedLessons?.forEach((s) => skippedLessons.add(s))
      return true
    } catch {
      return false
    }
  }

  watch(
    () => snapshot(),
    (snap) => {
      try {
        const key = getStorageKey(activeUserId.value)
        localStorage.setItem(key, JSON.stringify(snap))
        if (!activeUserId.value) {
          localStorage.setItem('codequest:progress:v1', JSON.stringify(snap))
        }
      } catch {}

      if (activeUserId.value) {
        queueCloudSync(activeUserId.value, snap)
      }
    },
    { deep: true },
  )

  return {
    activeUserId,
    totalXp,
    completedLessons,
    completedSteps,
    solvedCode,
    earnedBadges,
    streakCurrent,
    streakLongest,
    lastActiveDate,
    streakFreezes,
    maxUnlockedIndex,
    skippedLessons,
    toasts,
    level,
    rank,
    isLessonComplete,
    isLessonSkipped,
    isStepComplete,
    hasBadge,
    addXp,
    awardBadge,
    recordActivity,
    markStepComplete,
    skipStep,
    markCodeSolved,
    completeLesson,
    skipLesson,
    jumpForward,
    checkAchievements,
    reset,
    switchUser,
    exportData,
    importData,
    snapshot,
  }
})
