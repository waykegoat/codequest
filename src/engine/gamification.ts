export function xpForLevel(level: number): number {
  if (level <= 1) return 0

  return Math.round(50 * Math.pow(level - 1, 1.5))
}

export interface LevelInfo {
  level: number

  xpIntoLevel: number

  xpForNext: number

  progress: number
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1
  while (xpForLevel(level + 1) <= totalXp) level++

  const base = xpForLevel(level)
  const next = xpForLevel(level + 1)
  const xpIntoLevel = totalXp - base
  const xpForNext = next - base
  return {
    level,
    xpIntoLevel,
    xpForNext,
    progress: xpForNext === 0 ? 1 : Math.min(1, xpIntoLevel / xpForNext),
  }
}

export interface Rank {
  key: string
  title: string
  minLevel: number
  icon: string
}

export const RANKS: Rank[] = [
  { key: 'novice', title: 'Новичок', minLevel: 1, icon: '🥚' },
  { key: 'padawan', title: 'Падаван кода', minLevel: 4, icon: '🐣' },
  { key: 'coder', title: 'Кодер', minLevel: 8, icon: '💻' },
  { key: 'junior', title: 'Junior разработчик', minLevel: 13, icon: '🚀' },
  { key: 'strong-junior', title: 'Крепкий Junior', minLevel: 19, icon: '⚡' },
  { key: 'middle', title: 'Middle разработчик', minLevel: 26, icon: '🏆' },
  { key: 'senior-vibes', title: 'Senior на подходе', minLevel: 34, icon: '👑' },
]

export function rankForLevel(level: number): Rank {
  let current = RANKS[0]
  for (const r of RANKS) {
    if (level >= r.minLevel) current = r
  }
  return current
}

export const XP_REWARDS = {
  quizCorrect: 10,
  codeSolved: 25,
  lessonComplete: 40,
  dailyStreak: 15,
  firstTry: 10,
} as const

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
}

export const BADGES: Badge[] = [
  { id: 'first-blood', title: 'Первый шаг', description: 'Пройди первый урок', icon: '🎯' },
  { id: 'streak-3', title: 'В ритме', description: '3 дня подряд в учёбе', icon: '🔥' },
  { id: 'streak-7', title: 'Неделя силы', description: '7 дней подряд', icon: '🌟' },
  { id: 'module-1', title: 'Исследователь', description: 'Заверши первый модуль', icon: '🧭' },
  { id: 'code-10', title: 'Кодер', description: 'Реши 10 код-задач', icon: '⌨️' },
  { id: 'level-10', title: 'Двузначный', description: 'Достигни 10 уровня', icon: '🔟' },
  { id: 'junior', title: 'Junior!', description: 'Дорос до ранга Junior', icon: '🚀' },
  {
    id: 'interview-ready',
    title: 'Готов к собесу',
    description: 'Пройди модуль про собеседование',
    icon: '🧠',
  },
  { id: 'graduate', title: 'Выпускник', description: 'Заверши весь курс', icon: '🎓' },
]

export function badgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id)
}
