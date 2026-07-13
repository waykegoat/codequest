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
        ],
      },
    ],
  },
]
