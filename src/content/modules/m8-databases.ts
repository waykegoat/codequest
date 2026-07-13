import type { Module } from '../types'

export const m8Databases: Module = {
  id: 'databases',
  title: 'Базы данных и SQL',
  description: 'Таблицы, SELECT / WHERE, JOIN и агрегация. Мыслим как база данных.',
  color: '#eab308',
  icon: '🗄️',
  lessons: [
    {
      id: 'l1-intro',
      title: 'Язык запросов SQL',
      subtitle: 'Данные в таблицах',
      xp: 40,
      icon: '🗄️',
      steps: [
        {
          kind: 'theory',
          title: 'Данные в таблицах',
          blocks: [
            {
              type: 'text',
              md: 'Реляционная БД хранит данные в **таблицах** (строки и столбцы). SQL — язык, которым мы их запрашиваем.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT name, age\nFROM users\nWHERE age >= 18\nORDER BY age DESC;',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какая команда SQL достаёт данные из таблицы?',
          options: ['GET', 'SELECT', 'FETCH', 'READ'],
          answer: 1,
          explanation: '`SELECT` — основная команда для выборки данных.',
        },
      ],
    },
    {
      id: 'l2-where',
      title: 'SELECT ... WHERE',
      subtitle: 'Фильтрация строк',
      xp: 55,
      icon: '🔎',
      steps: [
        {
          kind: 'theory',
          title: 'Выбираем нужные строки',
          blocks: [
            {
              type: 'text',
              md: '`WHERE` оставляет только строки, удовлетворяющие условию. В JS это прямой аналог `Array.filter`.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT name FROM users WHERE age >= 18;\n\n-- В JS это эквивалентно:\n-- users.filter(u => u.age >= 18).map(u => u.name)',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Аналогом SQL `WHERE` в JavaScript является...',
          options: ['.map()', '.filter()', '.reduce()', '.sort()'],
          answer: 1,
          explanation: '`WHERE` фильтрует строки — как `Array.filter`.',
        },
        {
          kind: 'code',
          title: 'SELECT name WHERE age',
          lang: 'js',
          prompt:
            'Дана «таблица» — массив пользователей `{ name, age }`. Напиши функцию `adultsOver(rows, minAge)`, возвращающую массив **имён** тех, у кого `age >= minAge` (порядок сохраняется).',
          entry: 'adultsOver',
          starter: 'function adultsOver(rows, minAge) {\n  \n}',
          tests: [
            {
              name: 'порог 18 → ["Аня","Лео"]',
              args: [
                [
                  { name: 'Аня', age: 20 },
                  { name: 'Ким', age: 15 },
                  { name: 'Лео', age: 30 },
                ],
                18,
              ],
              expected: ['Аня', 'Лео'],
            },
            {
              name: 'порог 100 → []',
              args: [[{ name: 'Аня', age: 20 }], 100],
              expected: [],
            },
          ],
          hints: [
            'Сначала filter по age, потом map в name.',
            'rows.filter(r => r.age >= minAge).map(r => r.name)',
          ],
          solution:
            'function adultsOver(rows, minAge) {\n  return rows.filter((r) => r.age >= minAge).map((r) => r.name)\n}',
        },
      ],
    },
    {
      id: 'l3-join',
      title: 'JOIN',
      subtitle: 'Связываем таблицы',
      xp: 60,
      icon: '🧷',
      steps: [
        {
          kind: 'theory',
          title: 'Соединение по ключу',
          blocks: [
            {
              type: 'text',
              md: '`JOIN` связывает строки двух таблиц по общему ключу (например, `orders.userId = users.id`). Так к заказу подтягивается имя покупателя.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT users.name, orders.item\nFROM orders\nJOIN users ON orders.userId = users.id;',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'JOIN нужен, чтобы...',
          options: [
            'удалить строки',
            'связать данные из двух таблиц по ключу',
            'отсортировать данные',
            'создать таблицу',
          ],
          answer: 1,
          explanation: 'JOIN объединяет строки таблиц по совпадению ключей.',
        },
        {
          kind: 'code',
          title: 'Соедини заказы с именами',
          lang: 'js',
          prompt:
            'Даны `users` (`{ id, name }`) и `orders` (`{ userId, item }`). Напиши функцию `joinOrders(users, orders)`, возвращающую для каждого заказа строку `"Имя: товар"` (по порядку заказов).',
          entry: 'joinOrders',
          starter: 'function joinOrders(users, orders) {\n  \n}',
          tests: [
            {
              name: 'заказы → ["Аня: Книга","Лео: Кофе"]',
              args: [
                [
                  { id: 1, name: 'Аня' },
                  { id: 2, name: 'Лео' },
                ],
                [
                  { userId: 1, item: 'Книга' },
                  { userId: 2, item: 'Кофе' },
                ],
              ],
              expected: ['Аня: Книга', 'Лео: Кофе'],
            },
            {
              name: 'нет заказов → []',
              args: [[{ id: 1, name: 'Аня' }], []],
              expected: [],
            },
          ],
          hints: [
            'Пройди orders через map. Для каждого найди пользователя users.find(u => u.id === o.userId).',
            'return `${user.name}: ${o.item}`',
          ],
          solution:
            'function joinOrders(users, orders) {\n  return orders.map((o) => {\n    const user = users.find((u) => u.id === o.userId)\n    return `${user.name}: ${o.item}`\n  })\n}',
        },
      ],
    },
    {
      id: 'l4-aggregate',
      title: 'Агрегация',
      subtitle: 'GROUP BY и COUNT',
      xp: 60,
      icon: '📊',
      steps: [
        {
          kind: 'theory',
          title: 'Группируем и считаем',
          blocks: [
            {
              type: 'text',
              md: '`GROUP BY` собирает строки в группы, а агрегатные функции (`COUNT`, `SUM`, `AVG`) считают по каждой группе.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT status, COUNT(*) AS n\nFROM tasks\nGROUP BY status;',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'В JS это удобно делать через `reduce`, накапливая счётчики в объекте.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает COUNT(*) с GROUP BY status?',
          options: [
            'сортирует по статусу',
            'считает количество строк в каждой группе статуса',
            'удаляет дубликаты',
            'меняет статус',
          ],
          answer: 1,
          explanation: 'COUNT(*) возвращает число строк в каждой группе.',
        },
        {
          kind: 'code',
          title: 'Посчитай по статусу',
          lang: 'js',
          prompt:
            'Дан массив задач `{ status }`. Напиши функцию `countByStatus(rows)`, возвращающую объект «статус → количество». Например, две `active` и одна `done` → `{ active: 2, done: 1 }`.',
          entry: 'countByStatus',
          starter: 'function countByStatus(rows) {\n  \n}',
          tests: [
            {
              name: '2 active + 1 done → {active:2, done:1}',
              args: [[{ status: 'active' }, { status: 'active' }, { status: 'done' }]],
              expected: { active: 2, done: 1 },
            },
            { name: 'пусто → {}', args: [[]], expected: {} },
          ],
          hints: ['Заведи пустой объект-аккумулятор.', 'acc[r.status] = (acc[r.status] || 0) + 1'],
          solution:
            'function countByStatus(rows) {\n  return rows.reduce((acc, r) => {\n    acc[r.status] = (acc[r.status] || 0) + 1\n    return acc\n  }, {})\n}',
        },
      ],
    },
  ],
}
