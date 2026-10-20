import { describe, it, expect } from 'vitest'
import { evaluateLocally, type BossEvaluationContext } from './aiJudgeService'

describe('aiJudgeService.evaluateLocally', () => {
  const sampleContext: BossEvaluationContext = {
    title: 'Корзина покупок на Vue 3',
    bossName: 'Архитектор Реактивности',
    bossRole: 'Повелитель Composition API',
    prompt: 'Создай компонент корзины с подсчётом суммы и удалением товаров',
    lang: 'js',
    code: '',
    rubrics: [
      {
        id: 'vue-reactive',
        title: 'Реактивное состояние',
        description: 'Использован ref или reactive для хранения списка товаров',
      },
      {
        id: 'vue-computed',
        title: 'Вычисляемые свойства',
        description: 'Итоговая стоимость рассчитывается через computed',
      },
      {
        id: 'error-handling',
        title: 'Обработка ошибок',
        description: 'Предусмотрена защита от некорректных данных с try/catch',
      },
    ],
  }

  it('возвращает незачёт при слишком коротком коде', () => {
    const result = evaluateLocally({ ...sampleContext, code: 'let a = 1;' })
    expect(result.passed).toBe(false)
    expect(result.score).toBeLessThan(50)
    expect(result.bossHpRemaining).toBeGreaterThan(50)
    expect(result.rubricResults.every((r) => !r.met)).toBe(true)
  })

  it('засчитывает критерии при наличии соответствующих конструкций', () => {
    const validCode = `
      import { ref, computed } from 'vue'

      export default {
        setup() {
          const items = ref([{ id: 1, price: 100, count: 2 }])
          const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.count, 0))

          function removeItem(id) {
            try {
              items.value = items.value.filter(i => i.id !== id)
            } catch (err) {
              console.error(err)
            }
          }

          return { items, totalPrice, removeItem }
        }
      }
    `
    const result = evaluateLocally({ ...sampleContext, code: validCode })
    expect(result.passed).toBe(true)
    expect(result.score).toBeGreaterThanOrEqual(70)
    expect(result.bossHpRemaining).toBe(0)
    expect(result.rubricResults.find((r) => r.id === 'vue-reactive')?.met).toBe(true)
    expect(result.rubricResults.find((r) => r.id === 'vue-computed')?.met).toBe(true)
    expect(result.rubricResults.find((r) => r.id === 'error-handling')?.met).toBe(true)
  })
})
