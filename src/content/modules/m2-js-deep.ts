import type { Module } from '../types'

export const m2JsDeep: Module = {
  id: 'js-deep',
  title: 'JavaScript: глубже',
  description: 'Стрелочные функции, map / filter / reduce — код становится выразительным.',
  color: '#34d5eb',
  icon: '⚙️',
  lessons: [
    {
      id: 'l1-arrow',
      title: 'Стрелочные функции',
      subtitle: 'Короткий синтаксис',
      xp: 45,
      icon: '🏹',
      steps: [
        {
          kind: 'theory',
          title: 'Функции как значения',
          blocks: [
            {
              type: 'text',
              md: 'Функцию можно записать коротко — **стрелочной функцией**. Её можно хранить в переменной и передавать в другие функции.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const double = (x) => x * 2\ndouble(5) // 10\n\n// эквивалентно:\nfunction double2(x) {\n  return x * 2\n}',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Если тело функции — одно выражение, `return` и фигурные скобки можно опустить. Это называется «неявный возврат».',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт `const f = (a, b) => a + b; f(3, 4)`?',
          options: ['7', "'34'", 'undefined', 'ошибку'],
          answer: 0,
          explanation: 'Стрелочная функция неявно возвращает a + b = 7.',
        },
        {
          kind: 'code',
          title: 'Стрелка с неявным возвратом',
          lang: 'js',
          prompt:
            'Переведи градусы Цельсия в Фаренгейты по формуле `C × 9/5 + 32`. Напиши функцию `toF(c)` **стрелочной функцией** с неявным возвратом (без `return` и фигурных скобок).',
          entry: 'toF',
          starter: 'const toF = (c) => \n',
          tests: [
            { name: 'toF(0) → 32', args: [0], expected: 32 },
            { name: 'toF(100) → 212', args: [100], expected: 212 },
            { name: 'toF(25) → 77', args: [25], expected: 77 },
            { name: 'toF(-40) → -40', args: [-40], expected: -40 },
          ],
          hints: [
            'Тело стрелки — одно выражение, оно и есть результат.',
            'const toF = (c) => c * 9 / 5 + 32',
          ],
          solution: 'const toF = (c) => c * 9 / 5 + 32',
        },
      ],
    },
    {
      id: 'l2-map-filter',
      title: 'map и filter',
      subtitle: 'Преобразуй и фильтруй',
      xp: 55,
      icon: '🗺️',
      steps: [
        {
          kind: 'theory',
          title: 'Обработка массивов без циклов',
          blocks: [
            {
              type: 'text',
              md: '`map` создаёт **новый** массив, применяя функцию к каждому элементу. `filter` оставляет только те элементы, для которых функция вернула `true`.',
            },
            {
              type: 'code',
              lang: 'js',
              code: '[1, 2, 3].map((n) => n * 2)      // [2, 4, 6]\n[1, 2, 3, 4].filter((n) => n % 2 === 0) // [2, 4]',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Оба метода не меняют исходный массив, а возвращают новый — это важный принцип «неизменяемости» (immutability).',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт `[1, 2, 3, 4].filter(n => n > 2)`?',
          options: ['[3, 4]', '[1, 2]', '[2, 3, 4]', '[true, true]'],
          answer: 0,
          explanation: 'Остаются только элементы больше 2: 3 и 4.',
        },
        {
          kind: 'code',
          title: 'Удвой каждый',
          lang: 'js',
          prompt:
            'Напиши функцию `doubles(arr)`, которая возвращает новый массив, где каждый элемент удвоен. Используй `map`.',
          entry: 'doubles',
          starter: 'function doubles(arr) {\n  \n}',
          tests: [
            { name: 'doubles([1,2,3]) → [2,4,6]', args: [[1, 2, 3]], expected: [2, 4, 6] },
            { name: 'doubles([0,-5]) → [0,-10]', args: [[0, -5]], expected: [0, -10] },
            { name: 'doubles([]) → []', args: [[]], expected: [] },
          ],
          hints: ['arr.map((n) => n * 2)'],
          solution: 'function doubles(arr) {\n  return arr.map((n) => n * 2)\n}',
        },
      ],
    },
    {
      id: 'l3-reduce',
      title: 'reduce',
      subtitle: 'Сверни массив в одно значение',
      xp: 60,
      icon: '🎯',
      steps: [
        {
          kind: 'theory',
          title: 'Самый мощный метод',
          blocks: [
            {
              type: 'text',
              md: '`reduce` «сворачивает» массив в одно значение: сумму, произведение, объект — что угодно. Он накапливает результат от элемента к элементу.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const sum = [1, 2, 3, 4].reduce((acc, n) => acc + n, 0)\n// acc: 0→1→3→6→10, результат: 10',
            },
            {
              type: 'text',
              md: 'Второй аргумент `0` — это **начальное значение** аккумулятора. Не забывай его указывать.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает второй аргумент reduce, например `.reduce((a,b)=>a+b, 10)`?',
          options: [
            'ничего',
            'задаёт начальное значение аккумулятора',
            'ограничивает длину',
            'это индекс',
          ],
          answer: 1,
          explanation: 'Это стартовое значение аккумулятора — здесь сумма начнётся с 10.',
        },
        {
          kind: 'code',
          title: 'Сумма массива',
          lang: 'js',
          prompt:
            'Напиши функцию `total(arr)`, которая возвращает сумму всех чисел массива. Для пустого массива верни 0. Используй `reduce`.',
          entry: 'total',
          starter: 'function total(arr) {\n  \n}',
          tests: [
            { name: 'total([1,2,3,4]) → 10', args: [[1, 2, 3, 4]], expected: 10 },
            { name: 'total([10]) → 10', args: [[10]], expected: 10 },
            { name: 'total([]) → 0', args: [[]], expected: 0 },
            { name: 'total([-5, 5]) → 0', args: [[-5, 5]], expected: 0 },
          ],
          hints: ['arr.reduce((acc, n) => acc + n, 0)'],
          solution: 'function total(arr) {\n  return arr.reduce((acc, n) => acc + n, 0)\n}',
        },
      ],
    },
  ],
}
