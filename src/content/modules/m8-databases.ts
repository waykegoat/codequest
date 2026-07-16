import type { Module } from '../types'

const usersSeed = `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, city TEXT);
INSERT INTO users (id, name, age, city) VALUES
  (1, 'Аня', 28, 'Москва'),
  (2, 'Борис', 17, 'Казань'),
  (3, 'Вера', 34, 'Москва'),
  (4, 'Глеб', 22, 'Сочи'),
  (5, 'Дина', 19, 'Казань');`

const shopSeed = `${usersSeed}
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, item TEXT, price INTEGER);
INSERT INTO orders (id, user_id, item, price) VALUES
  (1, 1, 'Книга', 500),
  (2, 1, 'Кофе', 300),
  (3, 3, 'Ноутбук', 60000),
  (4, 4, 'Мышь', 1200);`

export const m8Databases: Module = {
  id: 'databases',
  title: 'Базы данных и SQL',
  description:
    'Настоящий SQLite прямо в браузере: SELECT, WHERE, ORDER BY, JOIN, GROUP BY и изменение данных.',
  color: '#eab308',
  icon: '🗄️',
  lessons: [
    {
      id: 'l1-select',
      title: 'Первый запрос',
      subtitle: 'SELECT и таблицы',
      xp: 45,
      icon: '🗄️',
      steps: [
        {
          kind: 'theory',
          title: 'Данные живут в таблицах',
          blocks: [
            {
              type: 'text',
              md: 'База данных хранит данные в **таблицах** — строки и столбцы, как в Excel. `SELECT` выбирает нужные столбцы из таблицы. Здесь ты пишешь настоящий SQL — он выполняется в SQLite прямо в браузере.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT name, age FROM users;',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: '`SELECT *` выбирает все столбцы. Но лучше перечислять нужные — так запрос понятнее и быстрее. Раскрой «Схему и данные», чтобы видеть таблицу.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какая команда достаёт данные из таблицы?',
          options: ['GET', 'SELECT', 'FETCH', 'SHOW'],
          answer: 1,
          explanation: 'SELECT — основная команда выборки данных в SQL.',
        },
        {
          kind: 'blank',
          title: 'Собери запрос',
          prompt: 'Впиши команду выборки и ключевое слово источника.',
          lang: 'sql',
          template: '___ name ___ users;',
          blanks: [{ answer: 'SELECT' }, { answer: 'FROM' }],
          hints: ['Выборка — SELECT, источник — FROM.'],
        },
        {
          kind: 'sql',
          title: 'Выбери имена и города',
          prompt:
            'Из таблицы `users` выбери два столбца: `name` и `city` — всех пользователей.',
          schema: usersSeed,
          starter: 'SELECT ... FROM users;',
          solution: 'SELECT name, city FROM users;',
          hints: ['Перечисли столбцы через запятую: SELECT name, city', 'Источник: FROM users'],
        },
      ],
    },
    {
      id: 'l2-where',
      title: 'Фильтрация',
      subtitle: 'WHERE',
      xp: 55,
      icon: '🔎',
      steps: [
        {
          kind: 'theory',
          title: 'Отбираем нужные строки',
          blocks: [
            {
              type: 'text',
              md: '`WHERE` оставляет только строки, удовлетворяющие условию. Операторы сравнения: `= > < >= <=`, `!=`. Условия комбинируют через `AND` и `OR`.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: "SELECT name FROM users WHERE age >= 18;\nSELECT name FROM users WHERE city = 'Москва' AND age > 30;",
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Текст в SQL — в одинарных кавычках: `\'Москва\'`. Это прямой аналог `Array.filter` в JavaScript.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Как в SQL сравнивают на равенство?',
          options: ['==', '===', '=', 'EQ'],
          answer: 2,
          explanation: 'В SQL равенство — один знак «=», в отличие от JavaScript.',
        },
        {
          kind: 'blank',
          title: 'Добавь условие',
          prompt: 'Впиши ключевое слово фильтра и оператор «больше или равно».',
          lang: 'sql',
          template: 'SELECT name FROM users ___ age ___ 18;',
          blanks: [{ answer: 'WHERE' }, { answer: '>=' }],
          hints: ['Фильтр — WHERE.', 'Больше или равно — >=.'],
        },
        {
          kind: 'sql',
          title: 'Совершеннолетние из Казани',
          prompt:
            'Выбери столбцы `name` и `age` пользователей, которым **18 или больше** И город `Казань`.',
          schema: usersSeed,
          starter: 'SELECT name, age FROM users\nWHERE ...;',
          solution: "SELECT name, age FROM users WHERE age >= 18 AND city = 'Казань';",
          hints: ['Два условия через AND.', "city = 'Казань' — текст в одинарных кавычках."],
        },
      ],
    },
    {
      id: 'l3-order',
      title: 'Сортировка и лимит',
      subtitle: 'ORDER BY, LIMIT',
      xp: 55,
      icon: '🔃',
      steps: [
        {
          kind: 'theory',
          title: 'Упорядочиваем результат',
          blocks: [
            {
              type: 'text',
              md: '`ORDER BY столбец` сортирует результат. `ASC` — по возрастанию (по умолчанию), `DESC` — по убыванию. `LIMIT n` оставляет только первые `n` строк — так делают топы и постраничную выдачу.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT name, age FROM users\nORDER BY age DESC\nLIMIT 3;',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает `ORDER BY price DESC`?',
          options: [
            'сортирует по цене от меньшей к большей',
            'сортирует по цене от большей к меньшей',
            'оставляет только дорогие товары',
            'удаляет столбец price',
          ],
          answer: 1,
          explanation: 'DESC — убывание: сначала самые большие значения.',
        },
        {
          kind: 'sql',
          title: 'Топ-2 самых молодых',
          prompt:
            'Выбери `name` и `age` двух **самых молодых** пользователей — отсортируй по возрасту и ограничь двумя строками. Порядок строк важен.',
          schema: usersSeed,
          starter: 'SELECT name, age FROM users\nORDER BY ...\nLIMIT ...;',
          solution: 'SELECT name, age FROM users ORDER BY age ASC LIMIT 2;',
          orderMatters: true,
          hints: ['Самые молодые — по возрастанию: ORDER BY age ASC', 'Ограничь: LIMIT 2'],
        },
      ],
    },
    {
      id: 'l4-join',
      title: 'Связываем таблицы',
      subtitle: 'JOIN',
      xp: 65,
      icon: '🧷',
      steps: [
        {
          kind: 'theory',
          title: 'Соединение по ключу',
          blocks: [
            {
              type: 'text',
              md: '`JOIN` связывает строки двух таблиц по общему ключу. В таблице `orders` есть `user_id` — он указывает на `users.id`. JOIN подтягивает к заказу имя покупателя.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT users.name, orders.item\nFROM orders\nJOIN users ON orders.user_id = users.id;',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Когда столбцы из разных таблиц, пиши `таблица.столбец` — чтобы не было путаницы, у какой таблицы брать поле.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что указывает после `ON` в JOIN?',
          options: [
            'какие столбцы показать',
            'условие связи строк двух таблиц',
            'сортировку',
            'фильтр по цене',
          ],
          answer: 1,
          explanation: 'ON задаёт, как строки одной таблицы соответствуют строкам другой (по ключу).',
        },
        {
          kind: 'blank',
          title: 'Собери JOIN',
          prompt: 'Впиши ключевые слова соединения таблиц по ключу.',
          lang: 'sql',
          template:
            'SELECT users.name, orders.item\nFROM orders\n___ users ___ orders.user_id = users.id;',
          blanks: [{ answer: 'JOIN' }, { answer: 'ON' }],
          hints: ['Соединение — JOIN, условие — ON.'],
        },
        {
          kind: 'sql',
          title: 'Кто что купил',
          prompt:
            'Для каждого заказа выведи два столбца: имя покупателя (`users.name`) и товар (`orders.item`). Соедини таблицы `orders` и `users` по ключу.',
          schema: shopSeed,
          starter: 'SELECT users.name, orders.item\nFROM orders\nJOIN users ON ...;',
          solution:
            'SELECT users.name, orders.item FROM orders JOIN users ON orders.user_id = users.id;',
          hints: ['Ключ связи: orders.user_id = users.id'],
        },
      ],
    },
    {
      id: 'l5-aggregate',
      title: 'Группировка и подсчёты',
      subtitle: 'GROUP BY, COUNT, SUM',
      xp: 65,
      icon: '📊',
      steps: [
        {
          kind: 'theory',
          title: 'Считаем по группам',
          blocks: [
            {
              type: 'text',
              md: '`GROUP BY` собирает строки в группы, а агрегатные функции считают по каждой:\n\n- `COUNT(*)` — сколько строк\n- `SUM(x)` — сумма\n- `AVG(x)` — среднее\n- `MAX(x)` / `MIN(x)`',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'SELECT city, COUNT(*) AS people\nFROM users\nGROUP BY city;',
            },
            {
              type: 'callout',
              tone: 'info',
              md: '`AS имя` даёт столбцу читаемое название. Результат: по строке на каждый уникальный город с числом жителей.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт `COUNT(*)` с `GROUP BY city`?',
          options: [
            'общее число всех пользователей',
            'число пользователей в каждом городе',
            'список городов без чисел',
            'самый населённый город',
          ],
          answer: 1,
          explanation: 'COUNT(*) считает строки внутри каждой группы — по числу на город.',
        },
        {
          kind: 'sql',
          title: 'Сумма заказов по пользователям',
          prompt:
            'Посчитай, на какую сумму заказал каждый пользователь. Выведи `user_id` и сумму цен (`SUM(price)`), сгруппировав заказы по `user_id`.',
          schema: shopSeed,
          starter: 'SELECT user_id, SUM(price)\nFROM orders\n...;',
          solution: 'SELECT user_id, SUM(price) FROM orders GROUP BY user_id;',
          hints: ['Группировка: GROUP BY user_id', 'Сумма: SUM(price)'],
        },
      ],
    },
    {
      id: 'l6-insert',
      title: 'Добавляем данные',
      subtitle: 'INSERT',
      xp: 60,
      icon: '➕',
      steps: [
        {
          kind: 'theory',
          title: 'Новая строка в таблице',
          blocks: [
            {
              type: 'text',
              md: '`INSERT INTO таблица (столбцы) VALUES (значения)` добавляет строку. Порядок значений должен совпадать с порядком столбцов.',
            },
            {
              type: 'code',
              lang: 'sql',
              code: "INSERT INTO users (id, name, age, city)\nVALUES (6, 'Ева', 25, 'Москва');",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'После запуска мы сами сделаем `SELECT`, чтобы проверить, что новая строка появилась в таблице.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что идёт после `VALUES`?',
          options: [
            'имена столбцов',
            'значения новой строки в скобках',
            'условие WHERE',
            'имя таблицы',
          ],
          answer: 1,
          explanation: 'VALUES (...) перечисляет значения в порядке указанных столбцов.',
        },
        {
          kind: 'sql',
          title: 'Добавь пользователя',
          prompt:
            'Добавь в таблицу `users` нового пользователя: `id` 6, имя `Ева`, возраст `25`, город `Москва`. Проверка сделает SELECT по id = 6.',
          schema: usersSeed,
          starter: 'INSERT INTO users (id, name, age, city)\nVALUES (...);',
          solution: "INSERT INTO users (id, name, age, city) VALUES (6, 'Ева', 25, 'Москва');",
          verify: 'SELECT name, age, city FROM users WHERE id = 6;',
          hints: ["VALUES (6, 'Ева', 25, 'Москва')", 'Текст — в одинарных кавычках.'],
        },
      ],
    },
    {
      id: 'l7-update',
      title: 'Изменяем и удаляем',
      subtitle: 'UPDATE, DELETE',
      xp: 60,
      icon: '✏️',
      steps: [
        {
          kind: 'theory',
          title: 'Правим существующие строки',
          blocks: [
            {
              type: 'text',
              md: '- `UPDATE таблица SET столбец = значение WHERE условие` — меняет строки\n- `DELETE FROM таблица WHERE условие` — удаляет строки',
            },
            {
              type: 'code',
              lang: 'sql',
              code: 'UPDATE users SET age = 18 WHERE id = 2;\nDELETE FROM users WHERE id = 5;',
            },
            {
              type: 'callout',
              tone: 'warning',
              md: '**Всегда пиши `WHERE`!** `UPDATE users SET age = 18` без условия изменит ВСЕ строки. Это классическая авария на проде.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что сделает `DELETE FROM users` без WHERE?',
          options: [
            'удалит одну строку',
            'удалит все строки таблицы',
            'ошибка синтаксиса',
            'ничего',
          ],
          answer: 1,
          explanation: 'Без WHERE операция применяется ко всем строкам — удалит всё содержимое.',
        },
        {
          kind: 'blank',
          title: 'Собери UPDATE',
          prompt: 'Впиши ключевые слова изменения строки.',
          lang: 'sql',
          template: 'UPDATE users ___ age = 18 ___ id = 2;',
          blanks: [{ answer: 'SET' }, { answer: 'WHERE' }],
          hints: ['Новое значение — SET, выбор строки — WHERE.'],
        },
        {
          kind: 'sql',
          title: 'Борису исполнилось 18',
          prompt:
            'Обнови возраст пользователя с `id = 2` (Борис) на `18`. Не трогай остальных. Проверка сверит возраст Бориса.',
          schema: usersSeed,
          starter: 'UPDATE users SET ... WHERE ...;',
          solution: 'UPDATE users SET age = 18 WHERE id = 2;',
          verify: 'SELECT name, age FROM users WHERE id = 2;',
          hints: ['SET age = 18', 'WHERE id = 2'],
        },
      ],
    },
    {
      id: 'l8-schema',
      title: 'Проектирование схемы',
      subtitle: 'Ключи и связи',
      xp: 60,
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
              md: 'Вопрос с собеседования: где хранить связь? Всегда на стороне «многих»: у заказа один владелец — `user_id` живёт в orders.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'У поста в блоге много комментариев. Где хранить связь?',
          options: [
            'в таблице posts — массив id комментариев',
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
          hints: ['Имя таблицы → первичный ключ → поля → внешний ключ → закрывающая скобка.'],
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
