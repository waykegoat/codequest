import type { Module } from '../types'

export const m7Backend: Module = {
  id: 'backend',
  title: 'Node.js и Express',
  description: 'Серверная сторона: маршруты, middleware-конвейер, обработка запросов.',
  color: '#84cc16',
  icon: '🖥️',
  lessons: [
    {
      id: 'l1-intro',
      title: 'Первый сервер',
      subtitle: 'Node.js и Express',
      xp: 40,
      icon: '🖥️',
      steps: [
        {
          kind: 'theory',
          title: 'JavaScript на сервере',
          blocks: [
            {
              type: 'text',
              md: 'Node.js позволяет запускать JavaScript **вне браузера** — на сервере. Express — популярный фреймворк для создания API.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const express = require("express")\nconst app = express()\n\napp.get("/hello", (req, res) => {\n  res.json({ message: "Привет!" })\n})\n\napp.listen(3000)',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Что делает `app.get('/hello', ...)`?",
          options: [
            'создаёт базу данных',
            'описывает обработчик GET-запроса по адресу /hello',
            'запускает браузер',
            'удаляет файл',
          ],
          answer: 1,
          explanation:
            'Это маршрут (route): при GET-запросе на /hello выполнится колбэк-обработчик.',
        },
        {
          kind: 'blank',
          title: 'Дострой сервер',
          prompt: 'Впиши метод маршрута и команду запуска сервера на порту 3000.',
          lang: 'js',
          template: 'app.___("/ping", (req, res) => {\n  res.json({ ok: true })\n})\n\napp.___(3000)',
          blanks: [{ answer: 'get' }, { answer: 'listen' }],
          hints: ['GET-маршрут: app.get.', 'Запуск: app.listen(порт).'],
        },
      ],
    },
    {
      id: 'l2-routes',
      title: 'Маршрутизация',
      subtitle: 'Метод + путь → обработчик',
      xp: 55,
      icon: '🚦',
      steps: [
        {
          kind: 'theory',
          title: 'Как сервер выбирает обработчик',
          blocks: [
            {
              type: 'text',
              md: 'Сервер сопоставляет пару **HTTP-метод + путь** с нужным обработчиком. Это и есть маршрутизация.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'app.get("/users", listUsers)     // GET  /users\napp.post("/users", createUser)   // POST /users\napp.get("/users/:id", getUser)   // GET  /users/42',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Если ни один маршрут не совпал — сервер отвечает 404 Not Found.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что определяет, какой обработчик вызовется?',
          options: ['только путь', 'только метод', 'пара «метод + путь»', 'время запроса'],
          answer: 2,
          explanation: 'Маршрут — это комбинация HTTP-метода и пути.',
        },
        {
          kind: 'code',
          title: 'Мини-роутер',
          lang: 'js',
          prompt:
            'Напиши функцию `route(method, path)`, возвращающую имя обработчика:\n- `GET /users` → `"listUsers"`\n- `POST /users` → `"createUser"`\n- `GET /health` → `"health"`\n- всё остальное → `"notFound"`',
          entry: 'route',
          starter: 'function route(method, path) {\n  \n}',
          tests: [
            { name: 'GET /users → listUsers', args: ['GET', '/users'], expected: 'listUsers' },
            { name: 'POST /users → createUser', args: ['POST', '/users'], expected: 'createUser' },
            { name: 'GET /health → health', args: ['GET', '/health'], expected: 'health' },
            { name: 'DELETE /users → notFound', args: ['DELETE', '/users'], expected: 'notFound' },
          ],
          hints: [
            'Составь ключ: `${method} ${path}` и сопоставь с объектом-таблицей.',
            'const table = { "GET /users": "listUsers", ... }; return table[key] || "notFound"',
          ],
          solution:
            'function route(method, path) {\n  const table = {\n    "GET /users": "listUsers",\n    "POST /users": "createUser",\n    "GET /health": "health",\n  }\n  return table[`${method} ${path}`] || "notFound"\n}',
        },
      ],
    },
    {
      id: 'l3-middleware',
      title: 'Middleware-конвейер',
      subtitle: 'Запрос проходит через цепочку',
      xp: 60,
      icon: '⛓️',
      steps: [
        {
          kind: 'theory',
          title: 'Цепочка обработчиков',
          blocks: [
            {
              type: 'text',
              md: '**Middleware** — функции, через которые последовательно проходит запрос: логирование, проверка авторизации, парсинг тела. Каждая передаёт управление дальше.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'app.use(logger)      // 1. записать в лог\napp.use(authorize)   // 2. проверить доступ\napp.use(parseBody)   // 3. разобрать тело\n// затем — обработчик маршрута',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Порядок важен: middleware выполняются в том порядке, в котором подключены.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Middleware выполняются...',
          options: [
            'в случайном порядке',
            'в порядке подключения',
            'только один раз за сервер',
            'после ответа клиенту',
          ],
          answer: 1,
          explanation: 'Цепочка middleware отрабатывает строго по порядку подключения.',
        },
        {
          kind: 'code',
          title: 'Конвейер преобразований',
          lang: 'js',
          prompt:
            'Запрос-число проходит цепочку операций. Напиши функцию `pipeline(value, ops)`, применяющую операции из массива `ops` по порядку: `"inc"` → `+1`, `"double"` → `×2`, `"square"` → в квадрат. Верни итоговое число.',
          entry: 'pipeline',
          starter: 'function pipeline(value, ops) {\n  \n}',
          tests: [
            {
              name: 'pipeline(3, ["inc","double"]) → 8',
              args: [3, ['inc', 'double']],
              expected: 8,
            },
            {
              name: 'pipeline(2, ["square","inc"]) → 5',
              args: [2, ['square', 'inc']],
              expected: 5,
            },
            { name: 'pipeline(10, []) → 10', args: [10, []], expected: 10 },
          ],
          hints: [
            'Пройди ops циклом или reduce, обновляя value.',
            'for (const op of ops) { if (op === "inc") value += 1 ... }',
          ],
          solution:
            'function pipeline(value, ops) {\n  for (const op of ops) {\n    if (op === "inc") value += 1\n    else if (op === "double") value *= 2\n    else if (op === "square") value = value * value\n  }\n  return value\n}',
        },
      ],
    },
    {
      id: 'l4-status',
      title: 'HTTP статус-коды',
      subtitle: 'Язык ответов сервера',
      xp: 50,
      icon: '📟',
      steps: [
        {
          kind: 'theory',
          title: 'Коды ответов',
          blocks: [
            {
              type: 'text',
              md: 'Сервер отвечает **статус-кодом**. Группы: `2xx` — успех, `4xx` — ошибка клиента, `5xx` — ошибка сервера.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'res.status(200) // OK\nres.status(404) // Not Found\nres.status(500) // Internal Server Error',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Код 404 означает...',
          options: ['успех', 'ресурс не найден', 'ошибка сервера', 'перенаправление'],
          answer: 1,
          explanation: '404 Not Found — запрошенный ресурс не существует.',
        },
        {
          kind: 'code',
          title: 'Расшифруй код',
          lang: 'js',
          prompt:
            'Напиши функцию `statusText(code)`: `200` → `"OK"`, `404` → `"Not Found"`, `500` → `"Server Error"`, любой другой → `"Unknown"`.',
          entry: 'statusText',
          starter: 'function statusText(code) {\n  \n}',
          tests: [
            { name: 'statusText(200) → "OK"', args: [200], expected: 'OK' },
            { name: 'statusText(404) → "Not Found"', args: [404], expected: 'Not Found' },
            { name: 'statusText(500) → "Server Error"', args: [500], expected: 'Server Error' },
            { name: 'statusText(302) → "Unknown"', args: [302], expected: 'Unknown' },
          ],
          hints: ['Используй switch или объект-словарь кодов.'],
          solution:
            'function statusText(code) {\n  const map = { 200: "OK", 404: "Not Found", 500: "Server Error" }\n  return map[code] || "Unknown"\n}',
        },
      ],
    },
    {
      id: 'l5-params',
      title: 'Параметры запроса',
      subtitle: 'params и query',
      xp: 60,
      icon: '🎛️',
      steps: [
        {
          kind: 'theory',
          title: 'Данные приходят в URL',
          blocks: [
            {
              type: 'text',
              md: 'Сервер достаёт данные из адреса двумя путями:\n\n- **params** — часть пути: `/users/:id` → `req.params.id`\n- **query** — после `?`: `/tasks?done=true&page=2` → `req.query.done`',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'app.get("/users/:id", (req, res) => {\n  const id = req.params.id\n  const full = req.query.full === "true"\n  res.json({ id, full })\n})',
            },
            {
              type: 'callout',
              tone: 'warning',
              md: 'Всё, что пришло из URL — **строки**. Числа приводи сам: `Number(req.params.id)`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Откуда сервер возьмёт `page` из запроса `GET /tasks?page=2`?',
          options: ['req.params.page', 'req.query.page', 'req.body.page', 'req.page'],
          answer: 1,
          explanation: 'Всё после «?» — query-параметры: req.query.',
        },
        {
          kind: 'code',
          title: 'Разбери query-строку',
          lang: 'js',
          prompt:
            'Напиши функцию `parseQuery(qs)`, разбирающую строку вида `"?a=1&b=2"` в объект `{ a: "1", b: "2" }`. Для пустой строки или `"?"` верни `{}`. Значения оставляй строками.',
          entry: 'parseQuery',
          starter: 'function parseQuery(qs) {\n  \n}',
          tests: [
            { name: '?a=1&b=2 → {a:"1",b:"2"}', args: ['?a=1&b=2'], expected: { a: '1', b: '2' } },
            { name: '?done=true → {done:"true"}', args: ['?done=true'], expected: { done: 'true' } },
            { name: 'пустая строка → {}', args: [''], expected: {} },
            { name: '"?" → {}', args: ['?'], expected: {} },
          ],
          hints: [
            'Убери «?» через slice(1), проверь на пустоту.',
            "Разбей по '&', каждую пару — по '='.",
          ],
          solution:
            "function parseQuery(qs) {\n  const clean = qs.startsWith('?') ? qs.slice(1) : qs\n  if (!clean) return {}\n  const result = {}\n  for (const pair of clean.split('&')) {\n    const [key, value] = pair.split('=')\n    result[key] = value\n  }\n  return result\n}",
        },
      ],
    },
    {
      id: 'l6-auth',
      title: 'Авторизация',
      subtitle: 'Токены и доступ',
      xp: 65,
      icon: '🔐',
      steps: [
        {
          kind: 'theory',
          title: 'Кто стучится в API',
          blocks: [
            {
              type: 'text',
              md: 'После логина сервер выдаёт **токен**. Клиент шлёт его в заголовке `Authorization: Bearer <токен>` с каждым запросом. Middleware проверяет токен до обработчика: нет токена — `401 Unauthorized`.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'function requireAuth(req, res, next) {\n  const header = req.headers.authorization\n  if (!header) return res.status(401).json({ error: "нет токена" })\n  next()\n}',
            },
            {
              type: 'callout',
              tone: 'info',
              md: '401 — «кто ты?» (не авторизован), 403 — «тебя знаю, но нельзя» (нет прав). Их часто путают на собеседованиях.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Пользователь залогинен, но пытается удалить чужой пост. Какой код вернуть?',
          options: ['401', '403', '404', '500'],
          answer: 1,
          explanation: '403 Forbidden: аутентификация пройдена, а прав на действие нет.',
        },
        {
          kind: 'code',
          title: 'Достань токен',
          lang: 'js',
          prompt:
            'Напиши функцию `extractToken(headers)`. В объекте заголовков может быть поле `authorization` вида `"Bearer abc123"`. Верни сам токен (`"abc123"`), а если заголовка нет или он не начинается с `"Bearer "` — верни `null`.',
          entry: 'extractToken',
          starter: 'function extractToken(headers) {\n  \n}',
          tests: [
            {
              name: 'Bearer abc123 → abc123',
              args: [{ authorization: 'Bearer abc123' }],
              expected: 'abc123',
            },
            { name: 'нет заголовка → null', args: [{}], expected: null },
            {
              name: 'не Bearer → null',
              args: [{ authorization: 'Basic xyz' }],
              expected: null,
            },
          ],
          hints: [
            'const h = headers.authorization',
            "if (!h || !h.startsWith('Bearer ')) return null",
            "return h.slice('Bearer '.length)",
          ],
          solution:
            "function extractToken(headers) {\n  const h = headers.authorization\n  if (!h || !h.startsWith('Bearer ')) return null\n  return h.slice('Bearer '.length)\n}",
        },
      ],
    },
  ],
}
