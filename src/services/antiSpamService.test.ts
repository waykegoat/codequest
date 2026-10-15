import { describe, it, expect, beforeEach } from 'vitest'
import { isDisposableEmail, checkClientRateLimit } from './antiSpamService'

describe('antiSpamService', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('определяет одноразовые временные email адреса', () => {
    expect(isDisposableEmail('test@mailinator.com')).toBe(true)
    expect(isDisposableEmail('bot@tempmail.com')).toBe(true)
    expect(isDisposableEmail('spammer@10minutemail.com')).toBe(true)
    expect(isDisposableEmail('student@gmail.com')).toBe(false)
    expect(isDisposableEmail('dev@yandex.ru')).toBe(false)
    expect(isDisposableEmail('')).toBe(false)
  })

  it('ограничивает частоту попыток регистрации (клиентский rate limit)', () => {
    // 5 attempts allowed
    for (let i = 0; i < 5; i++) {
      const res = checkClientRateLimit()
      expect(res.allowed).toBe(true)
    }

    // 6th attempt should be blocked
    const blocked = checkClientRateLimit()
    expect(blocked.allowed).toBe(false)
    expect(blocked.waitSeconds).toBeGreaterThan(0)
  })
})
