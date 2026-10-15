import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProgressStore } from '@/stores/progress'
import { useProgression } from './useProgression'
import { flatLessons } from '@/content'

describe('useProgression (skip and jump forward)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('первый урок открыт по умолчанию, а второй заблокирован', () => {
    const { isUnlocked } = useProgression()
    expect(isUnlocked(flatLessons[0])).toBe(true)
    expect(isUnlocked(flatLessons[1])).toBe(false)
  })

  it('позволяет прыгнуть на 5 уроков вперёд (skip5LessonsAhead)', () => {
    const progress = useProgressStore()
    const { isUnlocked, skip5LessonsAhead } = useProgression()

    expect(isUnlocked(flatLessons[1])).toBe(false)
    skip5LessonsAhead()

    expect(progress.maxUnlockedIndex).toBeGreaterThanOrEqual(5)
    expect(isUnlocked(flatLessons[0])).toBe(true)
    expect(isUnlocked(flatLessons[1])).toBe(true)
    expect(isUnlocked(flatLessons[5])).toBe(true)
  })

  it('разблокирует следующий урок при пропуске текущего (skipLesson)', () => {
    const progress = useProgressStore()
    const { isUnlocked, isSkipped } = useProgression()

    progress.skipLesson(flatLessons[0].fullId)
    expect(isSkipped(flatLessons[0])).toBe(true)
    expect(isUnlocked(flatLessons[1])).toBe(true)
  })

  it('изолирует прогресс между разными пользователями при switchUser', () => {
    const progress = useProgressStore()
    progress.switchUser('user_1')
    progress.addXp(100, false)
    progress.completeLesson(flatLessons[0].fullId, 50)
    expect(progress.totalXp).toBe(150)
    expect(progress.isLessonComplete(flatLessons[0].fullId)).toBe(true)

    // Switch to user 2
    progress.switchUser('user_2')
    expect(progress.totalXp).toBe(0)
    expect(progress.isLessonComplete(flatLessons[0].fullId)).toBe(false)

    // Switch back to user 1
    progress.switchUser('user_1')
    expect(progress.totalXp).toBe(150)
    expect(progress.isLessonComplete(flatLessons[0].fullId)).toBe(true)
  })
})
