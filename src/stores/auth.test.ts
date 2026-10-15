import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore, hashPassword } from './auth'

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('хэширует пароль', async () => {
    const h1 = await hashPassword('secret123')
    const h2 = await hashPassword('secret123')
    const h3 = await hashPassword('other')
    expect(h1).toBeTruthy()
    expect(h1).toBe(h2)
    expect(h1).not.toBe(h3)
  })

  it('по умолчанию пользователь является гостем', () => {
    const auth = useAuthStore()
    expect(auth.isGuest).toBe(true)
    expect(auth.currentUser).toBeNull()
  })

  it('успешно регистрирует нового пользователя с email', async () => {
    const auth = useAuthStore()
    const res = await auth.register({
      email: 'artem@example.com',
      displayName: 'Артём',
      password: 'mypassword',
      avatar: '🚀',
    })

    expect(res.ok).toBe(true)
    expect(auth.isGuest).toBe(false)
    expect(auth.currentUser?.email).toBe('artem@example.com')
    expect(auth.currentUser?.displayName).toBe('Артём')
    expect(auth.currentUser?.avatar).toBe('🚀')
    expect(auth.accounts.length).toBe(1)
  })

  it('не даёт создать дубликат пользователя с тем же email', async () => {
    const auth = useAuthStore()
    await auth.register({ email: 'coder@test.io', password: 'password123' })
    const res = await auth.register({ email: 'CODER@TEST.IO', password: 'password123' })
    expect(res.ok).toBe(false)
    expect(res.error).toContain('уже существует')
    expect(auth.accounts.length).toBe(1)
  })

  it('выполняет вход по email', async () => {
    const auth = useAuthStore()
    await auth.register({ email: 'alex@code.io', password: 'correct123' })
    await auth.logout()
    expect(auth.isGuest).toBe(true)

    // Вход
    const ok = await auth.login('alex@code.io', 'correct123')
    expect(ok.ok).toBe(true)
    expect(auth.isGuest).toBe(false)
    expect(auth.currentUser?.email).toBe('alex@code.io')
  })
})
