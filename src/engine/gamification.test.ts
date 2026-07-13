import { describe, it, expect } from 'vitest'
import { levelFromXp, xpForLevel, rankForLevel, RANKS } from './gamification'

describe('xpForLevel', () => {
  it('уровень 1 требует 0 XP', () => {
    expect(xpForLevel(1)).toBe(0)
  })
  it('кривая монотонно растёт', () => {
    for (let l = 1; l < 30; l++) {
      expect(xpForLevel(l + 1)).toBeGreaterThan(xpForLevel(l))
    }
  })
})

describe('levelFromXp', () => {
  it('0 XP → уровень 1, прогресс 0', () => {
    const info = levelFromXp(0)
    expect(info.level).toBe(1)
    expect(info.xpIntoLevel).toBe(0)
  })

  it('прогресс всегда в диапазоне [0, 1]', () => {
    for (const xp of [0, 10, 55, 120, 999, 5000]) {
      const info = levelFromXp(xp)
      expect(info.progress).toBeGreaterThanOrEqual(0)
      expect(info.progress).toBeLessThanOrEqual(1)
    }
  })

  it('накопленный XP согласован с порогом уровня', () => {
    const xp = 500
    const info = levelFromXp(xp)
    expect(xpForLevel(info.level)).toBeLessThanOrEqual(xp)
    expect(xpForLevel(info.level + 1)).toBeGreaterThan(xp)
  })
})

describe('rankForLevel', () => {
  it('уровень 1 — первый ранг', () => {
    expect(rankForLevel(1).key).toBe(RANKS[0].key)
  })
  it('на уровне 13 достигается Junior', () => {
    expect(rankForLevel(13).key).toBe('junior')
  })
  it('высокий уровень — последний ранг', () => {
    expect(rankForLevel(999).key).toBe(RANKS[RANKS.length - 1].key)
  })
})
