import { getSupabaseClient } from './supabase'
import type { PersistShape } from '@/stores/progress'

export interface CloudProgressRecord {
  user_id: string
  email?: string
  display_name?: string
  avatar?: string
  total_xp: number
  completed_lessons: string[]
  completed_steps: string[]
  skipped_lessons: string[]
  solved_code: number
  earned_badges: string[]
  streak_current: number
  streak_longest: number
  last_active_date: string | null
  streak_freezes: number
  max_unlocked_index: number
  updated_at?: string
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null

export async function fetchCloudProgress(userId: string): Promise<{
  data: PersistShape | null
  userMeta?: { displayName?: string; avatar?: string }
}> {
  const supabase = getSupabaseClient()
  if (!supabase) return { data: null }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.warn('Не удалось загрузить облачный прогресс:', error.message)
      return { data: null }
    }

    if (!data) return { data: null }

    const record = data as CloudProgressRecord
    const shape: PersistShape = {
      totalXp: record.total_xp ?? 0,
      completedLessons: Array.isArray(record.completed_lessons) ? record.completed_lessons : [],
      completedSteps: Array.isArray(record.completed_steps) ? record.completed_steps : [],
      skippedLessons: Array.isArray(record.skipped_lessons) ? record.skipped_lessons : [],
      solvedCode: record.solved_code ?? 0,
      earnedBadges: Array.isArray(record.earned_badges) ? record.earned_badges : [],
      streakCurrent: record.streak_current ?? 0,
      streakLongest: record.streak_longest ?? 0,
      lastActiveDate: record.last_active_date ?? null,
      streakFreezes: record.streak_freezes ?? 0,
      maxUnlockedIndex: record.max_unlocked_index ?? 0,
    }

    return {
      data: shape,
      userMeta: {
        displayName: record.display_name,
        avatar: record.avatar,
      },
    }
  } catch (err) {
    console.error('Ошибка обращения к облаку:', err)
    return { data: null }
  }
}

export async function saveCloudProgressDirect(
  userId: string,
  shape: PersistShape,
  userMeta?: { displayName?: string; avatar?: string; email?: string },
): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    const payload: Partial<CloudProgressRecord> = {
      user_id: userId,
      total_xp: shape.totalXp,
      completed_lessons: shape.completedLessons,
      completed_steps: shape.completedSteps,
      skipped_lessons: shape.skippedLessons || [],
      solved_code: shape.solvedCode,
      earned_badges: shape.earnedBadges,
      streak_current: shape.streakCurrent,
      streak_longest: shape.streakLongest,
      last_active_date: shape.lastActiveDate,
      streak_freezes: shape.streakFreezes,
      max_unlocked_index: shape.maxUnlockedIndex || 0,
      updated_at: new Date().toISOString(),
    }

    if (userMeta?.displayName) payload.display_name = userMeta.displayName
    if (userMeta?.avatar) payload.avatar = userMeta.avatar
    if (userMeta?.email) payload.email = userMeta.email

    const { error } = await supabase.from('user_progress').upsert(payload, { onConflict: 'user_id' })
    if (error) {
      console.warn('Ошибка сохранения в облако:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('Ошибка сохранения прогресса в Supabase:', err)
    return false
  }
}

export function queueCloudSync(
  userId: string,
  shape: PersistShape,
  userMeta?: { displayName?: string; avatar?: string; email?: string },
  delayMs = 1200,
): void {
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(() => {
    saveCloudProgressDirect(userId, shape, userMeta)
  }, delayMs)
}
