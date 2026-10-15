import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminStore } from './admin'
import { flatLessons } from '@/content'

describe('admin store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('по умолчанию не авторизован в админке', () => {
    const admin = useAdminStore()
    expect(admin.isAdminAuthenticated).toBe(false)
  })

  it('авторизует по PIN-коду admin123', () => {
    const admin = useAdminStore()
    const wrong = admin.authenticate('0000')
    expect(wrong).toBe(false)
    expect(admin.isAdminAuthenticated).toBe(false)

    const ok = admin.authenticate('admin123')
    expect(ok).toBe(true)
    expect(admin.isAdminAuthenticated).toBe(true)
  })

  it('режим Бога (God Mode) разблокирует доступ ко всем урокам', () => {
    const admin = useAdminStore()
    expect(admin.godModeUnlocked).toBe(false)
    admin.toggleGodMode()
    expect(admin.godModeUnlocked).toBe(true)
  })

  it('возвращает список студентов с метриками', async () => {
    const admin = useAdminStore()
    const students = await admin.fetchAllStudents()
    expect(students.length).toBeGreaterThan(0)
    expect(students[0].totalXp).toBeDefined()
    expect(students[0].level).toBeDefined()
  })
})
