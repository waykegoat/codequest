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
        {
          kind: 'blank',
          title: 'Собери запрос',
          prompt: 'Впиши ключевые слова: выбрать имена совершеннолетних пользователей.',
          lang: 'sql',
          template: 'SELECT name\n___ users\n___ age >= 18;',
          blanks: [{ answer: 'FROM' }, { answer: 'WHERE' }],
          hints: ['Источник данных — FROM.', 'Условие — WHERE.'],
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
          kind: 'blank',
          title: 'Свяжи таблицы',
          prompt: 'Впиши ключевые слова соединения таблиц по ключу.',
          lang: 'sql',
          template: 'SELECT users.name, orders.item\nFROM orders\n___ users ___ orders.userId = users.id;',
          blanks: [{ answer: 'JOIN' }, { answer: 'ON' }],
          hints: ['Соединение — JOIN, условие соединения — ON.'],
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
          kind: 'blank',
          title: 'Сгруппируй строки',
          prompt: 'Впиши два слова, которые собирают строки в группы по статусу.',
          lang: 'sql',
          template: 'SELECT status, COUNT(*) AS n\nFROM tasks\n___ ___ status;',
          blanks: [{ answer: 'GROUP' }, { answer: 'BY' }],
          hints: ['Группировка — GROUP BY.'],
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
    {
      id: 'l5-crud',
      title: 'INSERT, UPDATE, DELETE',
      subtitle: 'Меняем данные',
      xp: 60,
      icon: '✍️',
      steps: [
        {
          kind: 'theory',
          title: 'Три команды изменений',
          blocks: [
            {
              type: 'text',
              md: '- `INSERT INTO` — добавить строку\n- `UPDATE ... SET` — изменить строки\n- `DELETE FROM` — удалить строки\n\nУ `UPDATE` и `DELETE` почти всегда должен быть `WHERE`.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: "INSERT INTO users (name, age) VALUES ('Аня', 20);\nUPDATE users SET age = 21 WHERE id = 7;\nDELETE FROM users WHERE id = 7;",
            },
            {
              type: 'callout',
              tone: 'warning',
              md: '`UPDATE users SET age = 21` **без WHERE** изменит ВСЕ строки таблицы. Легендарная ошибка, роняющая продакшены.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что сделает `DELETE FROM users` без WHERE?',
          options: [
            'удалит одну строку',
            'удалит все строки таблицы',
            'удалит таблицу целиком',
            'ничего, это ошибка синтаксиса',
          ],
          answer: 1,
          explanation: 'Без условия команда применяется ко всем строкам. Таблица останется, но пустая.',
        },
        {
          kind: 'blank',
          title: 'Дополни команды',
          prompt: 'Впиши ключевые слова: добавить пользователя и поднять ему возраст.',
          lang: 'sql',
          template: "INSERT ___ users (name) VALUES ('Ким');\nUPDATE users ___ age = 16 ___ name = 'Ким';",
          blanks: [{ answer: 'INTO' }, { answer: 'SET' }, { answer: 'WHERE' }],
          hints: ['INSERT INTO таблица ...', 'UPDATE таблица SET поле = значение WHERE условие.'],
        },
        {
          kind: 'code',
          title: 'UPDATE на JavaScript',
          lang: 'js',
          prompt:
            'Смоделируем UPDATE. Напиши функцию `updateRow(rows, id, fields)`: верни НОВЫЙ массив, где строка с данным `id` объединена с полями `fields` (spread), остальные не тронуты.',
          entry: 'updateRow',
          starter: 'function updateRow(rows, id, fields) {\n  \n}',
          mustUse: ['...'],
          tests: [
            {
              name: 'обновляем age у id=1',
              args: [[{ id: 1, name: 'Аня', age: 20 }], 1, { age: 21 }],
              expected: [{ id: 1, name: 'Аня', age: 21 }],
            },
            {
              name: 'чужие строки не трогаем',
              args: [
                [
                  { id: 1, name: 'Аня' },
                  { id: 2, name: 'Ким' },
                ],
                2,
                { name: 'Лео' },
              ],
              expected: [
                { id: 1, name: 'Аня' },
                { id: 2, name: 'Лео' },
              ],
            },
          ],
          hints: ['rows.map((r) => (r.id === id ? { ...r, ...fields } : r))'],
          solution:
            'function updateRow(rows, id, fields) {\n  return rows.map((r) => (r.id === id ? { ...r, ...fields } : r))\n}',
        },
      ],
    },
    {
      id: 'l6-schema',
      title: 'Проектирование схемы',
      subtitle: 'Ключи и связи',
      xp: 65,
      icon: '🏛️',
      steps: [
        {
          kind: 'theory',
          title: 'Как связывают таблицы',
          blocks: [
            {
              type: 'text',
              md: '- **Первичный ключ** (PRIMARY KEY) — уникальный id строки\n- **Внешний ключ** (FOREIGN KEY) — ссылка на строку другой таблицы\n\nСвязь «один ко многим»: у пользователя много заказов → в `orders` хранится `user_id`.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  item TEXT NOT NULL,\n  user_id INTEGER REFERENCES users(id)\n);',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Вопрос с собеседования: где хранить связь? Всегда на стороне «многих»: у заказа один владелец — user_id живёт в orders.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'У поста в блоге много комментариев. Где хранить связь?',
          options: [
            'в таблице posts — массив comment_ids',
            'в таблице comments — поле post_id',
            'в отдельном файле',
            'связь не нужна',
          ],
          answer: 1,
          explanation: 'Сторона «многих» (comments) хранит внешний ключ на «одного» (post_id).',
        },
        {
          kind: 'order',
          title: 'Собери CREATE TABLE',
          prompt: 'Расставь строки объявления таблицы комментариев.',
          lang: 'sql',
          lines: [
            'CREATE TABLE comments (',
            '  id INTEGER PRIMARY KEY,',
            '  text TEXT NOT NULL,',
            '  post_id INTEGER REFERENCES posts(id)',
            ');',
          ],
          hints: ['Сначала имя таблицы, потом первичный ключ, поля, внешний ключ, закрывающая скобка.'],
        },
        {
          kind: 'quiz',
          question: 'Зачем таблице PRIMARY KEY?',
          options: [
            'для красоты',
            'уникально идентифицировать каждую строку',
            'ускорять все запросы в 100 раз',
            'шифровать данные',
          ],
          answer: 1,
          explanation: 'Первичный ключ гарантирует уникальность и позволяет ссылаться на строку.',
        },
      ],
    },
  ],
}
