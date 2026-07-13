import type { MarkupCheck } from '@/content/types'

export interface MarkupCheckResult {
  name: string
  passed: boolean
  detail?: string
}

export function buildSrcdoc(html: string, css: string): string {
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<style>
  :root { color-scheme: light; }
  html, body { margin: 0; }
  body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; padding: 16px; color: #14151f; }
${css}
</style>
</head>
<body>
${html}
</body>
</html>`
}

function resolveStyle(win: Window, prop: string, value: string): string {
  const probe = win.document.createElement('div')
  probe.style.setProperty(prop, value)
  win.document.body.appendChild(probe)
  const resolved = win.getComputedStyle(probe).getPropertyValue(prop).trim()
  probe.remove()
  return resolved
}

function el(win: Window, selector: string): Element | null {
  try {
    return win.document.querySelector(selector)
  } catch {
    return null
  }
}

export function runMarkupChecks(win: Window, checks: MarkupCheck[]): MarkupCheckResult[] {
  return checks.map((c) => {
    try {
      switch (c.kind) {
        case 'exists': {
          const found = el(win, c.selector) !== null
          return { name: c.name, passed: found, detail: found ? '' : `не найден: ${c.selector}` }
        }
        case 'count': {
          const n = win.document.querySelectorAll(c.selector).length
          return {
            name: c.name,
            passed: n === c.equals,
            detail: n === c.equals ? '' : `найдено ${n}, ожидалось ${c.equals}`,
          }
        }
        case 'text': {
          const node = el(win, c.selector)
          const got = (node?.textContent ?? '').trim()
          return {
            name: c.name,
            passed: got === c.equals,
            detail: got === c.equals ? '' : `текст «${got}», ожидался «${c.equals}»`,
          }
        }
        case 'contains': {
          const node = el(win, c.selector)
          const got = (node?.textContent ?? '').trim()
          return {
            name: c.name,
            passed: got.includes(c.text),
            detail: got.includes(c.text) ? '' : `нет текста «${c.text}»`,
          }
        }
        case 'attr': {
          const node = el(win, c.selector)
          const got = node?.getAttribute(c.attr) ?? null
          return {
            name: c.name,
            passed: got === c.equals,
            detail:
              got === c.equals ? '' : `атрибут ${c.attr}=«${got ?? '—'}», ожидался «${c.equals}»`,
          }
        }
        case 'style': {
          const node = el(win, c.selector)
          if (!node) return { name: c.name, passed: false, detail: `не найден: ${c.selector}` }
          const got = win.getComputedStyle(node).getPropertyValue(c.prop).trim()
          const want = resolveStyle(win, c.prop, c.equals)
          return {
            name: c.name,
            passed: got === want,
            detail: got === want ? '' : `${c.prop}: «${got}», ожидалось «${want}»`,
          }
        }
        default:
          return { name: (c as MarkupCheck).name, passed: false, detail: 'неизвестная проверка' }
      }
    } catch (err) {
      return {
        name: c.name,
        passed: false,
        detail: err instanceof Error ? err.message : String(err),
      }
    }
  })
}
