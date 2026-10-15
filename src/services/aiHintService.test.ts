import { describe, it, expect } from 'vitest'
import { analyzeErrorLocally } from './aiHintService'

describe('aiHintService (Socratic local analyzer)', () => {
  it('определяет SyntaxError и даёт наводящую подсказку по скобкам/кавычкам', () => {
    const res = analyzeErrorLocally({
      code: 'function test() { const a = 1;',
      compileError: 'SyntaxError: Unexpected end of input',
    })
    expect(res.title).toContain('SyntaxError')
    expect(res.socraticHint).toContain('скобок')
    expect(res.source).toBe('offline')
  })

  it('определяет ReferenceError с именем неизвестной переменной', () => {
    const res = analyzeErrorLocally({
      code: 'console.log(myVar)',
      compileError: 'ReferenceError: myVar is not defined',
    })
    expect(res.title).toContain('myVar')
    expect(res.cause).toContain('let/const')
    expect(res.socraticHint).toContain('myVar')
  })

  it('определяет TypeError при чтении свойства у undefined', () => {
    const res = analyzeErrorLocally({
      code: 'function getLength(arr) { return arr.length }',
      compileError: "TypeError: Cannot read properties of undefined (reading 'length')",
    })
    expect(res.title).toContain('TypeError')
    expect(res.explanation).toContain('undefined')
    expect(res.socraticHint).toContain('console.log')
  })

  it('определяет бесконечный цикл / превышение таймаута', () => {
    const res = analyzeErrorLocally({
      code: 'while (true) {}',
      compileError: 'Превышено время выполнения (3 c). Похоже на бесконечный цикл.',
    })
    expect(res.title).toContain('бесконечный цикл')
    expect(res.socraticHint).toContain('цикл')
  })

  it('подсказывает о забытом return, если тест ожидал значение, а получил undefined', () => {
    const res = analyzeErrorLocally({
      code: 'function sum(a, b) { a + b }',
      failedTests: [
        {
          name: 'sum(2, 3)',
          expected: '5',
          actual: 'undefined',
        },
      ],
    })
    expect(res.title).toContain('undefined')
    expect(res.cause).toContain('return')
    expect(res.socraticHint).toContain('return')
  })
})
