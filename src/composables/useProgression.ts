import { computed } from 'vue'
import { flatLessons, totalLessons, type FlatLesson } from '@/content'
import { useProgressStore } from '@/stores/progress'

export function useProgression() {
  const progress = useProgressStore()

  const isCompleted = (f: FlatLesson) => progress.isLessonComplete(f.fullId)

  const isUnlocked = (f: FlatLesson): boolean => {
    if (f.index === 0) return true
    const prev = flatLessons[f.index - 1]
    return progress.isLessonComplete(prev.fullId)
  }

  const completedCount = computed(
    () => flatLessons.filter((f) => progress.isLessonComplete(f.fullId)).length,
  )

  const percentDone = computed(() =>
    totalLessons === 0 ? 0 : Math.round((completedCount.value / totalLessons) * 100),
  )

  const currentLesson = computed<FlatLesson | undefined>(() => {
    for (const f of flatLessons) {
      if (isUnlocked(f) && !isCompleted(f)) return f
    }
    return flatLessons[flatLessons.length - 1]
  })

  const hasStarted = computed(() => completedCount.value > 0)

  return { isCompleted, isUnlocked, completedCount, percentDone, currentLesson, hasStarted }
}
