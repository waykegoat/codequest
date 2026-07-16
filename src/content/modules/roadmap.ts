import type { Module } from '../types'

export const roadmapModules: Module[] = [
  {
    id: 'rest-api',
    title: 'REST API и архитектура',
    description: 'Ресурсы, HTTP-методы, статус-коды и связка фронтенда с бэкендом.',
    color: '#f43f5e',
    icon: '🔌',
    lessons: [
      {
        id: 'l1-rest',
        title: 'Как устроен REST',
        subtitle: 'Ресурсы и методы',
        xp: 55,
        icon: '🔌',
        steps: [
          {
            kind: 'theory',
            title: 'Ресурсы и глаголы',
            blocks: [
              {
                type: 'text',
                md: 'REST описывает данные как **ресурсы** с адресами (URL), а действия — через HTTP-методы: `GET` (получить), `POST` (создать), `PUT` (обновить), `DELETE` (удалить).',
              },
              {
                type: 'code',
                lang: 'js',
                code: 'GET    /api/tasks      получить список\nPOST   /api/tasks      создать задачу\nGET    /api/tasks/42   одна задача\nDELETE /api/tasks/42   удалить',
              },
            ],
          },
          {
            kind: 'quiz',
            question: 'Каким HTTP-методом создают новый ресурс?',
            options: ['GET', 'POST', 'DELETE', 'HEAD'],
            answer: 1,
            explanation: '`POST` используется для создания новых ресурсов.',
          },
          {
            kind: 'order',
            title: 'Жизненный цикл запроса',
            prompt: 'Расставь этапы: что происходит между кликом пользователя и появлением данных.',
            lang: 'js',
            lines: [
              'клиент отправляет GET /api/tasks',
              'сервер находит обработчик маршрута',
              'обработчик читает данные из базы',
              'сервер отвечает JSON со статусом 200',
              'клиент рисует список задач',
            ],
            hints: ['Запрос → маршрут → данные → ответ → отрисовка.'],
          },
          {
            kind: 'code',
            title: 'Метод → действие',
            lang: 'js',
            prompt:
              'Напиши функцию `restAction(method)`: `GET` → `"read"`, `POST` → `"create"`, `PUT` → `"update"`, `DELETE` → `"delete"`, любой другой → `"unknown"`.',
            entry: 'restAction',
            starter: 'function restAction(method) {\n  \n}',
            tests: [
              { name: 'GET → read', args: ['GET'], expected: 'read' },
              { name: 'POST → create', args: ['POST'], expected: 'create' },
              { name: 'PUT → update', args: ['PUT'], expected: 'update' },
              { name: 'DELETE → delete', args: ['DELETE'], expected: 'delete' },
              { name: 'PATCH → unknown', args: ['PATCH'], expected: 'unknown' },
            ],
            hints: ['Словарь методов и `map[method] || "unknown"`.'],
            solution:
              'function restAction(method) {\n  const map = { GET: "read", POST: "create", PUT: "update", DELETE: "delete" }\n  return map[method] || "unknown"\n}',
          },
        ],
      },
      {
        id: 'l2-design',
        title: 'Проектируем API',
        subtitle: 'Адреса ресурсов',
        xp: 60,
        icon: '📐',
        steps: [
          {
            kind: 'theory',
            title: 'Хорошие URL',
            blocks: [
              {
                type: 'text',
                md: 'Правила именования ресурсов:\n\n- существительные во множественном числе: `/tasks`, а не `/getTask`\n- конкретный ресурс — через id: `/tasks/42`\n- вложенность — через путь: `/users/7/orders`\n- фильтры — в query-параметрах: `/tasks?done=true`',
              },
              {
                type: 'code',
                lang: 'js',
                code: 'GET /api/users            список\nGET /api/users/7          один\nGET /api/users/7/orders   заказы пользователя\nGET /api/tasks?done=true  фильтр',
              },
            ],
          },
          {
            kind: 'quiz',
            question: 'Какой URL правильный для получения одного товара с id 5?',
            options: ['/api/getProduct?x=5', '/api/products/5', '/api/product_five', '/api/products/get/5'],
            answer: 1,
            explanation: 'Ресурс во множественном числе + id в пути: /api/products/5.',
          },
          {
            kind: 'code',
            title: 'Построй URL',
            lang: 'js',
            prompt:
              'Напиши функцию `resourceUrl(resource, id)`: без `id` возвращает `/api/RESOURCE`, с `id` — `/api/RESOURCE/ID`.',
            entry: 'resourceUrl',
            starter: 'function resourceUrl(resource, id) {\n  \n}',
            tests: [
              { name: "resourceUrl('tasks') → '/api/tasks'", args: ['tasks'], expected: '/api/tasks' },
              { name: "resourceUrl('tasks', 42) → '/api/tasks/42'", args: ['tasks', 42], expected: '/api/tasks/42' },
              { name: "resourceUrl('users', 7) → '/api/users/7'", args: ['users', 7], expected: '/api/users/7' },
            ],
            hints: [
              'Проверь id на undefined.',
              'if (id === undefined) return `/api/${resource}`',
            ],
            solution:
              'function resourceUrl(resource, id) {\n  if (id === undefined) return `/api/${resource}`\n  return `/api/${resource}/${id}`\n}',
          },
          {
            kind: 'blank',
            title: 'CRUD для заметок',
            prompt: 'Впиши HTTP-методы для операций над заметками.',
            lang: 'js',
            template: '___    /api/notes      список заметок\n___   /api/notes      создать заметку\n___    /api/notes/3    обновить\n___ /api/notes/3    удалить',
            blanks: [{ answer: 'GET' }, { answer: 'POST' }, { answer: 'PUT' }, { answer: 'DELETE' }],
            hints: ['Чтение — GET, создание — POST.', 'Обновление — PUT, удаление — DELETE.'],
          },
        ],
      },
      {
        id: 'l3-client',
        title: 'Фронт вызывает бэк',
        subtitle: 'fetch и JSON-ответы',
        xp: 65,
        icon: '🤝',
        steps: [
          {
            kind: 'theory',
            title: 'Связка через fetch',
            blocks: [
              {
                type: 'text',
                md: 'Фронтенд запрашивает API через `fetch`. Тело запроса и ответа — JSON. Типичный ответ сервера: `{ data: ..., error: null }` либо `{ data: null, error: "текст" }`.',
              },
              {
                type: 'code',
                lang: 'js',
                code: "const res = await fetch('/api/tasks', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ title: 'Новая' }),\n})\nconst json = await res.json()",
              },
              {
                type: 'callout',
                tone: 'tip',
                md: 'Заголовок `Content-Type: application/json` говорит серверу, в каком формате пришло тело.',
              },
            ],
          },
          {
            kind: 'quiz',
            question: 'Каким заголовком фронтенд сообщает, что шлёт JSON?',
            options: [
              'Accept: text/html',
              'Content-Type: application/json',
              'X-Format: json',
              'Body: json',
            ],
            answer: 1,
            explanation: 'Content-Type описывает формат тела запроса.',
          },
          {
            kind: 'code',
            title: 'Разбери ответ сервера',
            lang: 'js',
            prompt:
              'Сервер вернул JSON-строку вида `{"data": ..., "error": ...}`. Напиши функцию `unwrap(json)`: распарси строку и верни `data`, а если `error` не `null` — верни строку `"Ошибка: ТЕКСТ"`.',
            entry: 'unwrap',
            starter: 'function unwrap(json) {\n  \n}',
            tests: [
              {
                name: 'успех → данные',
                args: ['{"data": [1, 2], "error": null}'],
                expected: [1, 2],
              },
              {
                name: 'ошибка → сообщение',
                args: ['{"data": null, "error": "нет доступа"}'],
                expected: 'Ошибка: нет доступа',
              },
            ],
            hints: [
              'const res = JSON.parse(json)',
              'if (res.error !== null) return `Ошибка: ${res.error}`',
            ],
            solution:
              'function unwrap(json) {\n  const res = JSON.parse(json)\n  if (res.error !== null) return `Ошибка: ${res.error}`\n  return res.data\n}',
          },
        ],
      },
    ],
  },
  {
    id: 'tools',
    title: 'Git, тесты, деплой',
    description: 'Инструменты профи: контроль версий, тестирование и выкладка проекта.',
    color: '#06b6d4',
    icon: '🛠️',
    lessons: [
      {
        id: 'l1-git',
        title: 'Git и версии',
        subtitle: 'История кода',
        xp: 50,
        icon: '🛠️',
        steps: [
          {
            kind: 'theory',
            title: 'Сохраняем историю',
            blocks: [
              {
                type: 'text',
                md: 'Git запоминает историю изменений. Каждый **коммит** — снимок проекта, к которому можно вернуться. Версии часто нумеруют по схеме `major.minor.patch`.',
              },
              { type: 'code', lang: 'js', code: 'git add .\ngit commit -m "Добавил логин"\ngit push' },
            ],
          },
          {
            kind: 'quiz',
            question: 'Что делает `git commit`?',
            options: [
              'удаляет проект',
              'создаёт снимок изменений в истории',
              'запускает сервер',
              'скачивает библиотеки',
            ],
            answer: 1,
            explanation: 'Коммит фиксирует текущее состояние кода как точку в истории.',
          },
          {
            kind: 'blank',
            title: 'Сохрани изменения',
            prompt: 'Впиши команды: добавить файлы в индекс и зафиксировать снимок.',
            lang: 'js',
            template: 'git ___ .\ngit ___ -m "Добавил регистрацию"',
            blanks: [{ answer: 'add' }, { answer: 'commit' }],
            hints: ['Сначала add, потом commit.'],
          },
          {
            kind: 'code',
            title: 'Повышаем версию',
            lang: 'js',
            prompt:
              'Версия выглядит как `"major.minor.patch"`. Напиши функцию `bumpPatch(version)`, которая увеличивает последнее число на 1. Например, `"1.2.3"` → `"1.2.4"`.',
            entry: 'bumpPatch',
            starter: 'function bumpPatch(version) {\n  \n}',
            tests: [
              { name: '"1.2.3" → "1.2.4"', args: ['1.2.3'], expected: '1.2.4' },
              { name: '"0.0.9" → "0.0.10"', args: ['0.0.9'], expected: '0.0.10' },
              { name: '"2.5.0" → "2.5.1"', args: ['2.5.0'], expected: '2.5.1' },
            ],
            hints: [
              'Разбей строку по точке: version.split(".").',
              'Увеличь третий элемент (число) и склей обратно через join(".").',
            ],
            solution:
              'function bumpPatch(version) {\n  const parts = version.split(".")\n  parts[2] = String(Number(parts[2]) + 1)\n  return parts.join(".")\n}',
          },
        ],
      },
      {
        id: 'l2-branches',
        title: 'Ветки и pull request',
        subtitle: 'Совместная работа',
        xp: 55,
        icon: '🌿',
        steps: [
          {
            kind: 'theory',
            title: 'Работа в команде',
            blocks: [
              {
                type: 'text',
                md: 'Новую фичу делают в отдельной **ветке**, чтобы не ломать основную. Когда готово — открывают **pull request** (PR): коллеги смотрят код и вливают его в main.',
              },
              {
                type: 'code',
                lang: 'js',
                code: 'git checkout -b feature/login\ngit add .\ngit commit -m "Форма логина"\ngit push -u origin feature/login',
              },
              {
                type: 'callout',
                tone: 'tip',
                md: 'Маленькие частые PR ревьюят быстро, огромные — лежат неделями. Это правило №1 командной работы.',
              },
            ],
          },
          {
            kind: 'quiz',
            question: 'Зачем делать фичу в отдельной ветке?',
            options: [
              'так код работает быстрее',
              'main остаётся рабочим, пока фича не готова и не проверена',
              'git не разрешает коммитить в main',
              'чтобы было больше веток',
            ],
            answer: 1,
            explanation: 'Ветка изолирует незаконченную работу от стабильной основной версии.',
          },
          {
            kind: 'order',
            title: 'Порядок работы над фичей',
            prompt: 'Расставь шаги рабочего процесса по порядку.',
            lang: 'js',
            lines: [
              'git checkout -b feature/search',
              'правим код в редакторе',
              'git add .',
              'git commit -m "Поиск по сайту"',
              'git push -u origin feature/search',
              'открываем pull request',
            ],
            hints: ['Сначала ветка, потом изменения, потом фиксация и отправка.'],
          },
          {
            kind: 'blank',
            title: 'Создай ветку',
            prompt: 'Впиши команды: создать ветку и зафиксировать изменения.',
            lang: 'js',
            template: 'git ___ -b feature/dark-theme\ngit add .\ngit ___ -m "Тёмная тема"',
            blanks: [{ answer: 'checkout' }, { answer: 'commit' }],
            hints: ['Создание и переключение: checkout -b.', 'Фиксация: commit.'],
          },
        ],
      },
      {
        id: 'l3-npm',
        title: 'npm и тесты',
        subtitle: 'Пакеты и страховка',
        xp: 60,
        icon: '📦',
        steps: [
          {
            kind: 'theory',
            title: 'Экосистема пакетов',
            blocks: [
              {
                type: 'text',
                md: '`package.json` — паспорт проекта: зависимости и **скрипты**. `npm install` скачивает пакеты в `node_modules` (эту папку не коммитят). Автотесты — страховка: сломал что-то — тест сразу покраснел.',
              },
              {
                type: 'code',
                lang: 'js',
                code: '{\n  "scripts": {\n    "dev": "vite",\n    "test": "vitest",\n    "build": "vite build"\n  }\n}',
              },
              {
                type: 'callout',
                tone: 'info',
                md: 'Запуск скрипта: `npm run dev`. Тест обычно выглядит так: `expect(sum(2, 2)).toBe(4)`.',
              },
            ],
          },
          {
            kind: 'quiz',
            question: 'Почему node_modules не хранят в git?',
            options: [
              'git запрещает большие папки',
              'она восстанавливается из package.json командой npm install',
              'там секретные данные',
              'её хранят, это нормально',
            ],
            answer: 1,
            explanation: 'Зависимости описаны в package.json — любой может восстановить их одной командой.',
          },
          {
            kind: 'code',
            title: 'Отчёт по тестам',
            lang: 'js',
            prompt:
              'Дан массив результатов тестов `{ name, passed }`. Напиши функцию `failedNames(results)`, возвращающую массив имён упавших тестов.',
            entry: 'failedNames',
            starter: 'function failedNames(results) {\n  \n}',
            tests: [
              {
                name: 'два упали',
                args: [[
                  { name: 'логин', passed: true },
                  { name: 'поиск', passed: false },
                  { name: 'оплата', passed: false },
                ]],
                expected: ['поиск', 'оплата'],
              },
              {
                name: 'все зелёные',
                args: [[{ name: 'логин', passed: true }]],
                expected: [],
              },
            ],
            hints: ['Сначала filter по !r.passed, потом map в имена.'],
            solution:
              'function failedNames(results) {\n  return results.filter((r) => !r.passed).map((r) => r.name)\n}',
          },
        ],
      },
    ],
  },
  {
    id: 'capstone',
    title: 'Финальный проект',
    description: 'Собери всё вместе: фронтенд + API + данные. Портфолио джуна готово.',
    color: '#ffcb45',
    icon: '🏁',
    lessons: [
      {
        id: 'l0-plan',
        title: 'План проекта',
        subtitle: 'От идеи к MVP',
        xp: 55,
        icon: '🗺️',
        steps: [
          {
            kind: 'theory',
            title: 'Сначала скелет, потом мясо',
            blocks: [
              {
                type: 'text',
                md: 'Проекты падают не от сложного кода, а от размытого плана. Рабочий порядок:\n\n1. **MVP** — минимальная версия, которая уже полезна\n2. Данные: какие сущности и поля\n3. API: какие адреса и методы\n4. Интерфейс: какие экраны\n5. Полировка и деплой',
              },
              {
                type: 'callout',
                tone: 'warning',
                md: 'Ловушка новичка — начать с «красивой темы оформления» и не дойти до логики. Интерфейс — после данных и API.',
              },
            ],
          },
          {
            kind: 'quiz',
            question: 'Что такое MVP?',
            options: [
              'самая красивая версия продукта',
              'минимальная версия, которой уже можно пользоваться',
              'версия для инвесторов',
              'план на месяц',
            ],
            answer: 1,
            explanation: 'Minimum Viable Product — минимум функций, максимум пользы: точка старта.',
          },
          {
            kind: 'order',
            title: 'Расставь этапы проекта',
            prompt: 'В каком порядке строить приложение списка задач?',
            lang: 'js',
            lines: [
              'описать сущность: задача { id, title, done }',
              'спроектировать API: GET/POST/PUT/DELETE /api/tasks',
              'сделать бэкенд с хранением в базе',
              'сверстать интерфейс списка',
              'связать интерфейс с API через fetch',
              'задеплоить и показать в портфолио',
            ],
            hints: ['Данные → API → бэкенд → интерфейс → связка → деплой.'],
          },
        ],
      },
      {
        id: 'l1-capstone',
        title: 'Твоё приложение',
        subtitle: 'Всё вместе',
        xp: 70,
        icon: '🏁',
        steps: [
          {
            kind: 'theory',
            title: 'Диплом фулл-стека',
            blocks: [
              {
                type: 'text',
                md: 'Финал — собственное приложение: интерфейс на компонентах, REST API на Node, данные в базе. Это и есть твой проект в портфолио.',
              },
              {
                type: 'callout',
                tone: 'tip',
                md: 'Пройдя все модули, ты собираешь полноценное фулл-стек приложение — уверенный уровень Junior с заявкой на Middle. 🚀',
              },
            ],
          },
          {
            kind: 'quiz',
            question: 'Фулл-стек разработчик работает...',
            options: [
              'только с дизайном',
              'и с фронтендом, и с бэкендом, и с базой данных',
              'только с серверами',
              'только с базами данных',
            ],
            answer: 1,
            explanation: 'Full-stack = вся вертикаль: интерфейс, серверная логика и хранение данных.',
          },
          {
            kind: 'code',
            title: 'Сводка по задачам',
            lang: 'js',
            prompt:
              'Финальная задача на всё сразу. Дан массив задач `{ done: boolean }`. Напиши функцию `summary(tasks)`, которая возвращает объект `{ total, done }` — сколько задач всего и сколько выполнено.',
            entry: 'summary',
            starter: 'function summary(tasks) {\n  \n}',
            tests: [
              {
                name: '3 задачи, 2 готовы → {total:3, done:2}',
                args: [[{ done: true }, { done: false }, { done: true }]],
                expected: { total: 3, done: 2 },
              },
              { name: 'пусто → {total:0, done:0}', args: [[]], expected: { total: 0, done: 0 } },
              {
                name: 'все готовы → {total:2, done:2}',
                args: [[{ done: true }, { done: true }]],
                expected: { total: 2, done: 2 },
              },
            ],
            hints: [
              'total — это tasks.length.',
              'done — tasks.filter((t) => t.done).length.',
            ],
            solution:
              'function summary(tasks) {\n  return {\n    total: tasks.length,\n    done: tasks.filter((t) => t.done).length,\n  }\n}',
          },
          {
            kind: 'markup',
            title: 'Витрина проекта',
            prompt:
              'Сверстай страницу-витрину своего приложения: `<header>` с `<h1>` **TaskFlow**, `<main>` с карточкой `<div class="card">` (внутри — абзац), `<footer>` с текстом **Сделано на CodeQuest**. Карточке задай белый фон, отступ `20px` и скругление `12px`.',
            editors: ['html', 'css'],
            starterHtml: '<header>\n  \n</header>\n<main>\n  \n</main>\n<footer></footer>',
            starterCss: '.card {\n  \n}',
            checks: [
              { name: 'Заголовок h1 «TaskFlow»', kind: 'text', selector: 'header h1', equals: 'TaskFlow' },
              { name: 'Карточка внутри main', kind: 'exists', selector: 'main .card' },
              { name: 'В карточке есть абзац', kind: 'exists', selector: '.card p' },
              { name: 'Подвал «Сделано на CodeQuest»', kind: 'text', selector: 'footer', equals: 'Сделано на CodeQuest' },
              { name: 'Белый фон карточки', kind: 'style', selector: '.card', prop: 'background-color', equals: 'white' },
              { name: 'Отступ 20px', kind: 'style', selector: '.card', prop: 'padding-top', equals: '20px' },
              { name: 'Скругление 12px', kind: 'style', selector: '.card', prop: 'border-radius', equals: '12px' },
            ],
            hints: [
              'Каркас: header → main → footer, карточка в main.',
              '.card { background-color: white; padding: 20px; border-radius: 12px; }',
            ],
            solutionHtml:
              '<header>\n  <h1>TaskFlow</h1>\n</header>\n<main>\n  <div class="card">\n    <p>Список задач с API и базой данных.</p>\n  </div>\n</main>\n<footer>Сделано на CodeQuest</footer>',
            solutionCss:
              '.card {\n  background-color: white;\n  padding: 20px;\n  border-radius: 12px;\n}',
          },
        ],
      },
    ],
  },
]
