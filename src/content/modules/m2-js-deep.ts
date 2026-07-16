import type { Module } from '../types'

export const m2JsDeep: Module = {
  id: 'js-deep',
  title: 'JavaScript: глубже',
  description:
    'Стрелочные функции, map / filter / reduce, деструктуризация, spread и JSON — код становится выразительным.',
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
    {
      id: 'l4-destructuring',
      title: 'Деструктуризация и spread',
      subtitle: 'Распаковка данных',
      xp: 55,
      icon: '🎁',
      steps: [
        {
          kind: 'theory',
          title: 'Распаковываем и раскладываем',
          blocks: [
            {
              type: 'text',
              md: '**Деструктуризация** вытаскивает значения из объектов и массивов в переменные. **Spread** `...` раскладывает элементы — так копируют и объединяют данные.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const user = { name: 'Аня', age: 20 }\nconst { name, age } = user\n\nconst [first, ...rest] = [1, 2, 3]\nconst copy = { ...user, city: 'Москва' }",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: '`{ ...a, ...b }` объединяет объекты: при совпадении ключей побеждает правый.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Что получится: `{ ...{ a: 1, b: 2 }, b: 9 }`?",
          options: ['{ a: 1, b: 2 }', '{ a: 1, b: 9 }', '{ b: 9 }', 'ошибка'],
          answer: 1,
          explanation: 'Правое значение перекрывает левое: b станет 9.',
        },
        {
          kind: 'blank',
          title: 'Распакуй объект',
          prompt: 'Впиши имена полей, чтобы вытащить их из объекта.',
          lang: 'js',
          template: "const user = { name: 'Лео', role: 'admin' }\nconst { ___, ___ } = user\nconsole.log(name, role)",
          blanks: [{ answer: 'name' }, { answer: 'role' }],
          hints: ['Имена в фигурных скобках должны совпадать с ключами объекта.'],
        },
        {
          kind: 'code',
          title: 'Объедини настройки',
          lang: 'js',
          prompt:
            'Напиши функцию `withDefaults(options)`, которая возвращает объект с настройками по умолчанию `{ theme: "dark", lang: "ru" }`, перекрытыми переданными `options`. Используй spread.',
          entry: 'withDefaults',
          starter: 'function withDefaults(options) {\n  \n}',
          mustUse: ['...'],
          tests: [
            {
              name: 'пусто → значения по умолчанию',
              args: [{}],
              expected: { theme: 'dark', lang: 'ru' },
            },
            {
              name: 'перекрываем тему',
              args: [{ theme: 'light' }],
              expected: { theme: 'light', lang: 'ru' },
            },
            {
              name: 'добавляем новое поле',
              args: [{ fontSize: 16 }],
              expected: { theme: 'dark', lang: 'ru', fontSize: 16 },
            },
          ],
          hints: ["return { theme: 'dark', lang: 'ru', ...options }"],
          solution:
            "function withDefaults(options) {\n  return { theme: 'dark', lang: 'ru', ...options }\n}",
        },
        {
          kind: 'code',
          title: 'Голова и хвост',
          lang: 'js',
          prompt:
            'Напиши функцию `headTail(arr)`, возвращающую объект `{ head, tail }`: первый элемент и массив остальных. Используй деструктуризацию с rest.',
          entry: 'headTail',
          starter: 'function headTail(arr) {\n  \n}',
          mustUse: ['...'],
          tests: [
            { name: '[1,2,3] → {head:1, tail:[2,3]}', args: [[1, 2, 3]], expected: { head: 1, tail: [2, 3] } },
            { name: '[7] → {head:7, tail:[]}', args: [[7]], expected: { head: 7, tail: [] } },
          ],
          hints: ['const [head, ...tail] = arr', 'return { head, tail }'],
          solution: 'function headTail(arr) {\n  const [head, ...tail] = arr\n  return { head, tail }\n}',
        },
      ],
    },
    {
      id: 'l5-array-tools',
      title: 'find, some, every, sort',
      subtitle: 'Инструменты на каждый день',
      xp: 60,
      icon: '🧰',
      steps: [
        {
          kind: 'theory',
          title: 'Ещё четыре метода',
          blocks: [
            {
              type: 'text',
              md: '- `find` — первый подходящий элемент (или `undefined`)\n- `some` — хоть один подходит? → boolean\n- `every` — все подходят? → boolean\n- `sort` — сортировка; для чисел нужен компаратор `(a, b) => a - b`',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const nums = [5, 12, 8]\nnums.find((n) => n > 6)   // 12\nnums.some((n) => n > 10)  // true\nnums.every((n) => n > 0)  // true\n[...nums].sort((a, b) => a - b) // [5, 8, 12]',
            },
            {
              type: 'callout',
              tone: 'warning',
              md: '`sort` **меняет исходный массив**! Хорошая привычка — сортировать копию: `[...arr].sort(...)`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Почему числа нельзя сортировать простым `arr.sort()`?',
          options: [
            'можно, всё сработает',
            'sort сравнивает как строки: 10 окажется раньше 9',
            'sort работает только со строками',
            'sort удаляет дубликаты',
          ],
          answer: 1,
          explanation: "Без компаратора sort сравнивает строки: '10' < '9'. Нужен (a, b) => a - b.",
        },
        {
          kind: 'code',
          title: 'Отсортируй не ломая',
          lang: 'js',
          prompt:
            'Напиши функцию `sorted(arr)`, возвращающую НОВЫЙ массив чисел по возрастанию. Исходный массив меняться не должен — сортируй копию.',
          entry: 'sorted',
          starter: 'function sorted(arr) {\n  \n}',
          mustUse: ['...'],
          tests: [
            { name: 'sorted([3,1,2]) → [1,2,3]', args: [[3, 1, 2]], expected: [1, 2, 3] },
            { name: 'sorted([10,9]) → [9,10]', args: [[10, 9]], expected: [9, 10] },
            { name: 'sorted([]) → []', args: [[]], expected: [] },
          ],
          hints: ['Копия через spread: [...arr]', '[...arr].sort((a, b) => a - b)'],
          solution: 'function sorted(arr) {\n  return [...arr].sort((a, b) => a - b)\n}',
        },
        {
          kind: 'code',
          title: 'Все взрослые?',
          lang: 'js',
          prompt:
            'Дан массив пользователей `{ name, age }`. Напиши функцию `allAdults(users)`, возвращающую `true`, если ВСЕ старше 17. Используй `every`.',
          entry: 'allAdults',
          starter: 'function allAdults(users) {\n  \n}',
          mustUse: ['every'],
          tests: [
            {
              name: '18 и 25 → true',
              args: [[{ name: 'а', age: 18 }, { name: 'б', age: 25 }]],
              expected: true,
            },
            {
              name: '18 и 15 → false',
              args: [[{ name: 'а', age: 18 }, { name: 'б', age: 15 }]],
              expected: false,
            },
            { name: 'пусто → true', args: [[]], expected: true },
          ],
          hints: ['users.every((u) => u.age >= 18)'],
          solution: 'function allAdults(users) {\n  return users.every((u) => u.age >= 18)\n}',
        },
      ],
    },
    {
      id: 'l6-json',
      title: 'JSON',
      subtitle: 'Язык обмена данными',
      xp: 60,
      icon: '📨',
      steps: [
        {
          kind: 'theory',
          title: 'Данные как текст',
          blocks: [
            {
              type: 'text',
              md: 'Серверы и приложения обмениваются данными в формате **JSON** — это текстовая запись объектов. Два метода:\n\n- `JSON.stringify(obj)` — объект → строка\n- `JSON.parse(text)` — строка → объект',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'JSON.stringify({ id: 1 })   // \'{"id":1}\'\nJSON.parse(\'{"id":1}\')      // { id: 1 }',
            },
            {
              type: 'callout',
              tone: 'warning',
              md: 'В JSON ключи и строки — только в **двойных** кавычках. `JSON.parse` кривой строки бросает ошибку — оборачивай в try/catch.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт `JSON.parse(\'{"a": 2}\').a`?',
          options: ['"2"', '2', 'undefined', 'ошибку'],
          answer: 1,
          explanation: 'parse превращает строку в объект, поле a — число 2.',
        },
        {
          kind: 'code',
          title: 'Безопасный парсер',
          lang: 'js',
          prompt:
            'Напиши функцию `safeParse(text)`, возвращающую результат `JSON.parse(text)`, а при ошибке разбора — `null`.',
          entry: 'safeParse',
          starter: 'function safeParse(text) {\n  \n}',
          tests: [
            { name: 'корректный JSON', args: ['{"id":1}'], expected: { id: 1 } },
            { name: 'массив', args: ['[1,2]'], expected: [1, 2] },
            { name: 'мусор → null', args: ['не json'], expected: null },
          ],
          hints: ['try { return JSON.parse(text) } catch { return null }'],
          solution:
            'function safeParse(text) {\n  try {\n    return JSON.parse(text)\n  } catch (err) {\n    return null\n  }\n}',
        },
      ],
    },
  ],
}
