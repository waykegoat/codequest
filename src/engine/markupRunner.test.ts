import { describe, it, expect, beforeEach } from 'vitest'
import { runMarkupChecks, buildSrcdoc } from './markupRunner'

describe('runMarkupChecks', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('exists / text / count / attr работают по DOM', () => {
    document.body.innerHTML =
      '<h1>Привет, мир!</h1><ul><li>a</li><li>b</li><li>c</li></ul><a href="https://example.com">Тык</a>'

    const results = runMarkupChecks(window, [
      { name: 'h1 есть', kind: 'exists', selector: 'h1' },
      { name: 'текст h1', kind: 'text', selector: 'h1', equals: 'Привет, мир!' },
      { name: '3 пункта', kind: 'count', selector: 'ul li', equals: 3 },
      { name: 'href', kind: 'attr', selector: 'a', attr: 'href', equals: 'https://example.com' },
    ])

    expect(results.every((r) => r.passed)).toBe(true)
  })

  it('сообщает о непройденных проверках с деталями', () => {
    document.body.innerHTML = '<h1>Не то</h1>'
    const results = runMarkupChecks(window, [
      { name: 'нет абзаца', kind: 'exists', selector: 'p' },
      { name: 'текст', kind: 'text', selector: 'h1', equals: 'Привет' },
    ])
    expect(results[0].passed).toBe(false)
    expect(results[1].passed).toBe(false)
    expect(results[1].detail).toContain('Привет')
  })

  it('buildSrcdoc вставляет разметку и стили', () => {
    const doc = buildSrcdoc('<h1>Hi</h1>', 'h1 { color: red; }')
    expect(doc).toContain('<h1>Hi</h1>')
    expect(doc).toContain('color: red')
  })
})
