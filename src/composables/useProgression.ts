import { computed } from 'vue'
import { flatLessons, totalLessons, type FlatLesson } from '@/content'
import { useProgressStore } from '@/stores/progress'

export function useProgression() {
  const progress = useProgressStore()

  const isCompleted = (f: FlatLesson) => progress.isLessonComplete(f.fullId)
  const isSkipped = (f: FlatLesson) => progress.isLessonSkipped(f.fullId)

  const isUnlocked = (f: FlatLesson): boolean => {
    // First lesson is always accessible
    if (f.index === 0) return true

    // Unlocked explicitly via jumpForward (+5 lessons ahead)
    if (f.index <= progress.maxUnlockedIndex) return true

    // Unlocked because previous lesson was completed or skipped
    const prev = flatLessons[f.index - 1]
    if (prev && (progress.isLessonComplete(prev.fullId) || progress.isLessonSkipped(prev.fullId))) {
      return true
    }

    return false
  }

  const completedCount = computed(
    () => flatLessons.filter((f) => progress.isLessonComplete(f.fullId)).length,
  )

  const skippedCount = computed(
    () => flatLessons.filter((f) => progress.isLessonSkipped(f.fullId)).length,
  )

  const percentDone = computed(() =>
    totalLessons === 0 ? 0 : Math.round((completedCount.value / totalLessons) * 100),
  )

  const currentLesson = computed<FlatLesson | undefined>(() => {
    for (const f of flatLessons) {
      if (isUnlocked(f) && !isCompleted(f) && !isSkipped(f)) return f
    }
    // If all unlocked are completed or skipped, find first uncompleted
    for (const f of flatLessons) {
      if (!isCompleted(f)) return f
    }
    return flatLessons[flatLessons.length - 1]
  })

  const hasStarted = computed(() => completedCount.value > 0 || skippedCount.value > 0)

  function skip5LessonsAhead() {
    const curIdx = currentLesson.value?.index ?? 0
    const newTarget = Math.min(flatLessons.length - 1, Math.max(progress.maxUnlockedIndex, curIdx) + 5)
    progress.maxUnlockedIndex = newTarget
    progress.jumpForward(5)
  }

  return {
    isCompleted,
    isSkipped,
    isUnlocked,
    completedCount,
    skippedCount,
    percentDone,
    currentLesson,
    hasStarted,
    skip5LessonsAhead,
  }
}
