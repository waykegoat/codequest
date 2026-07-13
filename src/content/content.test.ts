import { describe, it, expect } from 'vitest'
import { course, flatLessons, findLesson, nextLesson } from './index'
import type { CodeStep } from './types'

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

describe('аргументы тестов совместимы с воркером (structuredClone)', () => {
  for (const f of flatLessons) {
    for (const step of f.lesson.steps) {
      if (step.kind !== 'code') continue
      it(`${f.fullId} · ${step.title}`, () => {
        for (const t of step.tests) {
          expect(() => structuredClone(t.args)).not.toThrow()
          expect(() => structuredClone(t.expected)).not.toThrow()
        }
      })
    }
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
      const factory = new Function(`"use strict";\n${step.solution}\n;return (${step.entry});`)
      const fn = factory() as (...args: unknown[]) => unknown
      expect(typeof fn).toBe('function')
      for (const t of step.tests) {
        expect(await fn(...t.args)).toEqual(t.expected)
      }
    })
  }
})
