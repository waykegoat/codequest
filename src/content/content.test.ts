import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import initSqlJs, { type SqlJsStatic } from 'sql.js'
import { course, flatLessons, findLesson, nextLesson } from './index'
import type { CodeStep, DomStep, SqlStep } from './types'
import { runDomActions, runMarkupChecks } from '@/engine/markupRunner'
import { runSql } from '@/engine/sqlRunner'

describe('структура курса', () => {
  it('есть модули и уроки', () => {
    expect(course.modules.length).toBeGreaterThan(0)
    expect(flatLessons.length).toBeGreaterThan(0)
  })

  it('все fullId уникальны', () => {
    const ids = flatLessons.map((f) => f.fullId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('поиск и переход по урокам работают', () => {
    const first = flatLessons[0]
    const found = findLesson(first.module.id, first.lesson.id)
    expect(found?.fullId).toBe(first.fullId)
    expect(nextLesson(first.module.id, first.lesson.id)?.fullId).toBe(flatLessons[1].fullId)
  })
})

describe('целостность интерактивных шагов', () => {
  it('в blank-шагах число пропусков совпадает с числом ответов', () => {
    for (const f of flatLessons) {
      for (const step of f.lesson.steps) {
        if (step.kind !== 'blank') continue
        const gaps = step.template.split('___').length - 1
        expect(gaps, `${f.fullId} · ${step.title}`).toBe(step.blanks.length)
      }
    }
  })

  it('order-шаги содержат минимум 2 строки', () => {
    for (const f of flatLessons) {
      for (const step of f.lesson.steps) {
        if (step.kind !== 'order') continue
        expect(step.lines.length, `${f.fullId} · ${step.title}`).toBeGreaterThanOrEqual(2)
      }
    }
  })
})

describe('каждая code-задача проверяема', () => {
  it('есть либо entry+tests, либо expectedOutput', () => {
    for (const f of flatLessons) {
      for (const step of f.lesson.steps) {
        if (step.kind !== 'code') continue
        const hasFnTests = Boolean(step.entry) && (step.tests?.length ?? 0) > 0
        const hasOutput = (step.expectedOutput?.length ?? 0) > 0
        expect(hasFnTests || hasOutput, `${f.fullId} · ${step.title}`).toBe(true)
      }
    }
  })
})

describe('аргументы тестов совместимы с воркером (structuredClone)', () => {
  for (const f of flatLessons) {
    for (const step of f.lesson.steps) {
      if (step.kind !== 'code' || !step.tests) continue
      it(`${f.fullId} · ${step.title}`, () => {
        for (const t of step.tests!) {
          expect(() => structuredClone(t.args)).not.toThrow()
          expect(() => structuredClone(t.expected)).not.toThrow()
        }
      })
    }
  }
})

describe('корректность DOM-задач (эталонные решения проходят проверки)', () => {
  const domSteps: { title: string; step: DomStep }[] = []
  for (const f of flatLessons) {
    for (const step of f.lesson.steps) {
      if (step.kind === 'dom' && step.solution) {
        domSteps.push({ title: `${f.fullId} · ${step.title}`, step })
      }
    }
  }

  for (const { title, step } of domSteps) {
    it(title, () => {
      document.body.innerHTML = step.html
      try {
        const run = new Function(step.solution as string)
        run()
        runDomActions(window as unknown as Window, step.actions)
        const results = runMarkupChecks(window as unknown as Window, step.checks)
        for (const r of results) {
          expect(r.passed, `${r.name}: ${r.detail ?? ''}`).toBe(true)
        }
      } finally {
        document.body.innerHTML = ''
      }
    })
  }
})

describe('корректность SQL-задач (эталонные решения выполняются в SQLite)', () => {
  let SQL: SqlJsStatic

  beforeAll(async () => {
    const wasmBinary = readFileSync('./node_modules/sql.js/dist/sql-wasm.wasm')
    SQL = await initSqlJs({ wasmBinary })
  })

  const sqlSteps: { title: string; step: SqlStep }[] = []
  for (const f of flatLessons) {
    for (const step of f.lesson.steps) {
      if (step.kind === 'sql') {
        sqlSteps.push({ title: `${f.fullId} · ${step.title}`, step })
      }
    }
  }

  for (const { title, step } of sqlSteps) {
    it(title, () => {
      const outcome = runSql(
        SQL,
        step.schema,
        step.solution,
        step.solution,
        step.verify,
        step.orderMatters ?? false,
      )
      expect(outcome.error, outcome.error).toBeUndefined()
      expect(outcome.passed).toBe(true)
    })
  }
})

describe('корректность код-задач (эталонные решения проходят тесты)', () => {
  const codeSteps: { title: string; step: CodeStep }[] = []
  for (const f of flatLessons) {
    for (const step of f.lesson.steps) {
      if (step.kind === 'code' && step.solution) {
        codeSteps.push({ title: `${f.fullId} · ${step.title}`, step })
      }
    }
  }

  for (const { title, step } of codeSteps) {
    it(title, async () => {
      for (const m of step.mustUse ?? []) {
        expect(step.solution, `решение должно содержать «${m}»`).toContain(m)
      }

      if (step.entry && step.tests) {
        const factory = new Function(`"use strict";\n${step.solution}\n;return (${step.entry});`)
        const fn = factory() as (...args: unknown[]) => unknown
        expect(typeof fn).toBe('function')
        for (const t of step.tests) {
          expect(await fn(...t.args)).toEqual(t.expected)
        }
        return
      }

      const logs: string[] = []
      const fmt = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v))
      const sandboxConsole = {
        log: (...args: unknown[]) => logs.push(args.map(fmt).join(' ')),
        info: (...args: unknown[]) => logs.push(args.map(fmt).join(' ')),
        warn: () => {},
        error: () => {},
        debug: () => {},
      }
      const run = new Function('console', `"use strict";\n${step.solution}`)
      await run(sandboxConsole)
      expect(logs).toEqual(step.expectedOutput)
    })
  }
})
