import type { RunRequest, TestResult, WorkerResponse } from './runnerTypes'

function fmt(v: unknown): string {
  if (typeof v === 'string') return JSON.stringify(v)
  if (typeof v === 'function') return '[function]'
  if (v === undefined) return 'undefined'
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return a === b
  if (Number.isNaN(a) && Number.isNaN(b)) return true
  if (typeof a !== 'object') return false

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false
    if (a.length !== b.length) return false
    return a.every((x, i) => deepEqual(x, b[i]))
  }

  const ka = Object.keys(a as object)
  const kb = Object.keys(b as object)
  if (ka.length !== kb.length) return false
  return ka.every((k) =>
    deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
  )
}

self.onmessage = async (e: MessageEvent<RunRequest>) => {
  const { code, entry, tests } = e.data
  const logs: string[] = []
  const capture =
    (prefix = '') =>
    (...args: unknown[]) =>
      logs.push(prefix + args.map((a) => (typeof a === 'string' ? a : fmt(a))).join(' '))
  const sandboxConsole = {
    log: capture(),
    info: capture(),
    warn: capture('⚠ '),
    error: capture('✖ '),
    debug: capture(),
  }

  const respond = (r: WorkerResponse) => self.postMessage(r)

  if (!entry) {
    try {
      const run = new Function('console', `"use strict";\n${code}`)
      await run(sandboxConsole)
      respond({ ok: true, results: [], logs })
    } catch (err) {
      respond({
        ok: false,
        compileError: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
        logs,
      })
    }
    return
  }

  try {
    const factory = new Function(
      'console',
      `"use strict";\n${code}\n;try { return (${entry}); } catch (e) { return undefined; }`,
    )
    const fn = factory(sandboxConsole) as unknown

    if (typeof fn !== 'function') {
      respond({
        ok: false,
        compileError: `Не нашёл функцию «${entry}». Убедись, что ты объявил её, например: function ${entry}(...) { ... }`,
        logs,
      })
      return
    }

    const results: TestResult[] = []
    for (const t of tests) {
      try {
        const actual = await (fn as (...a: unknown[]) => unknown)(...t.args)
        results.push({
          name: t.name,
          passed: deepEqual(actual, t.expected),
          expected: fmt(t.expected),
          actual: fmt(actual),
        })
      } catch (err) {
        results.push({
          name: t.name,
          passed: false,
          expected: fmt(t.expected),
          actual: '—',
          error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
        })
      }
    }

    respond({ ok: true, results, logs })
  } catch (err) {
    respond({
      ok: false,
      compileError: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      logs,
    })
  }
}
