import type { Course, Lesson, Module } from './types'
import { m0Html } from './modules/m0-html'
import { m0bCss } from './modules/m0b-css'
import { m1JsBasics } from './modules/m1-js-basics'
import { m2JsDeep } from './modules/m2-js-deep'
import { m3Algorithms } from './modules/m3-algorithms'
import { m4TypeScript } from './modules/m4-typescript'
import { m5Async } from './modules/m5-async'
import { m6Frontend } from './modules/m6-frontend'
import { m7Backend } from './modules/m7-backend'
import { m8Databases } from './modules/m8-databases'
import { m9Interview } from './modules/m9-interview'
import { roadmapModules } from './modules/roadmap'

const [restApi, tools, capstone] = roadmapModules

export const course: Course = {
  id: 'fullstack-3m',
  title: 'Фулл-стек: от нуля до первой работы',
  description: 'Путь от полного новичка до Junior, который проходит собеседование и получает оффер.',
  modules: [
    m0Html,
    m0bCss,
    m1JsBasics,
    m2JsDeep,
    m3Algorithms,
    m4TypeScript,
    m5Async,
    m6Frontend,
    m7Backend,
    m8Databases,
    restApi,
    tools,
    m9Interview,
    capstone,
  ],
}

export interface FlatLesson {
  fullId: string
  lesson: Lesson
  module: Module

  index: number
  moduleIndex: number
  lessonIndex: number
}

export function lessonKey(moduleId: string, lessonId: string): string {
  return `${moduleId}/${lessonId}`
}

export const flatLessons: FlatLesson[] = (() => {
  const out: FlatLesson[] = []
  let index = 0
  course.modules.forEach((module, moduleIndex) => {
    module.lessons.forEach((lesson, lessonIndex) => {
      out.push({
        fullId: lessonKey(module.id, lesson.id),
        lesson,
        module,
        index,
        moduleIndex,
        lessonIndex,
      })
      index++
    })
  })
  return out
})()

export function findLesson(moduleId: string, lessonId: string): FlatLesson | undefined {
  const key = lessonKey(moduleId, lessonId)
  return flatLessons.find((f) => f.fullId === key)
}

export function findByFullId(fullId: string): FlatLesson | undefined {
  return flatLessons.find((f) => f.fullId === fullId)
}

export function nextLesson(moduleId: string, lessonId: string): FlatLesson | undefined {
  const cur = findLesson(moduleId, lessonId)
  if (!cur) return undefined
  return flatLessons[cur.index + 1]
}

export const totalLessons = flatLessons.length
export const totalXpAvailable = flatLessons.reduce((sum, f) => sum + f.lesson.xp, 0)

export type { Course, Lesson, Module }
