import type { Module } from '../types'

export const m6Frontend: Module = {
  id: 'frontend',
  title: 'Фронтенд: компоненты',
  description: 'React / Vue: компоненты, состояние и реактивность, пропсы и события.',
  color: '#22c55e',
  icon: '⚛️',
  lessons: [
    {
      id: 'l1-intro',
      title: 'Что такое компонент',
      subtitle: 'Основа современного UI',
      xp: 40,
      icon: '⚛️',
      steps: [
        {
          kind: 'theory',
          title: 'UI из кубиков',
          blocks: [
            {
              type: 'text',
              md: 'Современный интерфейс собирается из **компонентов** — переиспользуемых кусочков UI со своим состоянием. Кнопка, карточка, форма — всё это компоненты.',
            },
            {
              type: 'code',
              lang: 'js',
              code: '// Vue-компонент (упрощённо)\nconst Counter = {\n  data: () => ({ count: 0 }),\n  template: `<button @click="count++">{{ count }}</button>`,\n}',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Само приложение CodeQuest построено из десятков Vue-компонентов — карта, карточки уроков, редактор кода.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Компонент — это...',
          options: [
            'таблица в базе данных',
            'переиспользуемый кусок интерфейса со своим состоянием',
            'запрос к серверу',
            'тип данных',
          ],
          answer: 1,
          explanation:
            'Компонент инкапсулирует разметку, логику и состояние в переиспользуемый блок.',
        },
      ],
    },
    {
      id: 'l2-state',
      title: 'Состояние и реактивность',
      subtitle: 'Данные, которые меняются',
      xp: 55,
      icon: '🔄',
      steps: [
        {
          kind: 'theory',
          title: 'Состояние → перерисовка',
          blocks: [
            {
              type: 'text',
              md: 'У компонента есть **состояние** (state). Когда оно меняется, фреймворк сам перерисовывает интерфейс — это **реактивность**.',
            },
            {
              type: 'code',
              lang: 'js',
              code: '// Изменение состояния часто описывают "редьюсером":\nfunction reducer(state, action) {\n  if (action === "inc") return state + 1\n  if (action === "dec") return state - 1\n  return state\n}',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Ключевой принцип: не меняй состояние напрямую, а вычисляй **новое** состояние из старого. Так работают React (useReducer) и Pinia/Vuex.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что происходит при изменении состояния компонента?',
          options: [
            'ничего',
            'фреймворк перерисовывает интерфейс',
            'перезагружается страница',
            'удаляется компонент',
          ],
          answer: 1,
          explanation: 'Реактивность: смена состояния автоматически обновляет UI.',
        },
        {
          kind: 'code',
          title: 'Редьюсер счётчика',
          lang: 'js',
          prompt:
            'Напиши функцию `counter(state, action)`: для `"inc"` верни `state + 1`, для `"dec"` — `state - 1`, для `"reset"` — `0`, для любого другого действия верни `state` без изменений.',
          entry: 'counter',
          starter: 'function counter(state, action) {\n  \n}',
          tests: [
            { name: 'counter(5, "inc") → 6', args: [5, 'inc'], expected: 6 },
            { name: 'counter(5, "dec") → 4', args: [5, 'dec'], expected: 4 },
            { name: 'counter(5, "reset") → 0', args: [5, 'reset'], expected: 0 },
            { name: 'counter(5, "???") → 5', args: [5, '???'], expected: 5 },
          ],
          hints: [
            'Разбери action через if или switch.',
            'Не забудь вернуть state для неизвестного действия.',
          ],
          solution:
            'function counter(state, action) {\n  if (action === "inc") return state + 1\n  if (action === "dec") return state - 1\n  if (action === "reset") return 0\n  return state\n}',
        },
      ],
    },
    {
      id: 'l3-props',
      title: 'Пропсы и рендеринг',
      subtitle: 'Данные внутрь, разметка наружу',
      xp: 55,
      icon: '📤',
      steps: [
        {
          kind: 'theory',
          title: 'Пропсы и списки',
          blocks: [
            {
              type: 'text',
              md: '**Пропсы** (props) — данные, которые родитель передаёт компоненту. Компонент превращает их в разметку. Списки рисуют перебором (`v-for` во Vue, `.map()` в React).',
            },
            {
              type: 'code',
              lang: 'js',
              code: '// React-подобный рендер списка\nfunction List({ items }) {\n  return items.map((i) => `<li>${i}</li>`).join("")\n}',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Пропсы (props) — это...',
          options: [
            'внутреннее состояние компонента',
            'данные, переданные компоненту извне (от родителя)',
            'стили компонента',
            'запросы к API',
          ],
          answer: 1,
          explanation: 'Props — входные данные компонента, задаются снаружи.',
        },
        {
          kind: 'code',
          title: 'Рендер списка тегов',
          lang: 'js',
          prompt:
            'Напиши функцию `renderTags(tags)`, которая возвращает строку из элементов массива, соединённых через запятую с пробелом. Для пустого массива верни пустую строку `""`.',
          entry: 'renderTags',
          starter: 'function renderTags(tags) {\n  \n}',
          tests: [
            {
              name: 'renderTags(["vue","ts"]) → "vue, ts"',
              args: [['vue', 'ts']],
              expected: 'vue, ts',
            },
            { name: 'renderTags(["js"]) → "js"', args: [['js']], expected: 'js' },
            { name: 'renderTags([]) → ""', args: [[]], expected: '' },
          ],
          hints: [
            'Метод массива join умеет соединять элементы разделителем.',
            'return tags.join(", ")',
          ],
          solution: 'function renderTags(tags) {\n  return tags.join(", ")\n}',
        },
      ],
    },
    {
      id: 'l4-events',
      title: 'События и формы',
      subtitle: 'Реакция на пользователя',
      xp: 55,
      icon: '🖱️',
      steps: [
        {
          kind: 'theory',
          title: 'Интерфейс слушает',
          blocks: [
            {
              type: 'text',
              md: 'Пользователь кликает, печатает, отправляет формы — это **события**. Компонент вешает обработчики (`@click` во Vue, `onClick` в React) и реагирует. Перед отправкой формы данные **валидируют**.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const errors = []\nif (!form.email.includes('@')) {\n  errors.push('Некорректный email')\n}\nif (form.password.length < 8) {\n  errors.push('Пароль короче 8 символов')\n}",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Валидируй на фронте для удобства пользователя и ОБЯЗАТЕЛЬНО дублируй на сервере: фронт легко обойти.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Почему валидации только на фронтенде недостаточно?',
          options: [
            'фронтенд медленный',
            'запрос к API можно отправить в обход интерфейса',
            'браузеры не умеют валидировать',
            'достаточно, сервер можно не проверять',
          ],
          answer: 1,
          explanation: 'Любой может дернуть API напрямую (curl, Postman) — сервер обязан проверять сам.',
        },
        {
          kind: 'code',
          title: 'Валидатор формы',
          lang: 'js',
          prompt:
            'Напиши функцию `validate(form)` для формы `{ email, password }`. Верни массив ошибок: `"email"` — если в email нет символа `@`, `"password"` — если пароль короче 8 символов. Если всё хорошо — пустой массив.',
          entry: 'validate',
          starter: 'function validate(form) {\n  \n}',
          tests: [
            {
              name: 'всё валидно → []',
              args: [{ email: 'a@b.ru', password: 'longenough' }],
              expected: [],
            },
            {
              name: 'плохой email',
              args: [{ email: 'нет-собаки', password: 'longenough' }],
              expected: ['email'],
            },
            {
              name: 'обе ошибки',
              args: [{ email: 'x', password: '123' }],
              expected: ['email', 'password'],
            },
          ],
          hints: [
            'Копилка ошибок: const errors = []',
            "if (!form.email.includes('@')) errors.push('email')",
          ],
          solution:
            "function validate(form) {\n  const errors = []\n  if (!form.email.includes('@')) errors.push('email')\n  if (form.password.length < 8) errors.push('password')\n  return errors\n}",
        },
      ],
    },
    {
      id: 'l5-todo-logic',
      title: 'Логика TODO-приложения',
      subtitle: 'Состояние без мутаций',
      xp: 60,
      icon: '✅',
      steps: [
        {
          kind: 'theory',
          title: 'Новое состояние вместо правки старого',
          blocks: [
            {
              type: 'text',
              md: 'Классика собеседований по фронтенду — логика списка задач. Правило то же: не мутируй массив состояния, а **возвращай новый** — spread и map в помощь.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const added = [...todos, newTodo]\nconst toggled = todos.map((t) =>\n  t.id === id ? { ...t, done: !t.done } : t,\n)',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Почему `todos.push(newTodo)` — плохой способ обновить состояние?',
          options: [
            'push медленный',
            'мутация старого массива: фреймворк может не заметить изменение',
            'push не добавляет элементы',
            'нормальный способ',
          ],
          answer: 1,
          explanation: 'Реактивность строится на сравнении ссылок: новое состояние — новый массив.',
        },
        {
          kind: 'code',
          title: 'Добавь задачу',
          lang: 'js',
          prompt:
            'Напиши функцию `addTodo(todos, title)`, возвращающую НОВЫЙ массив с добавленной задачей `{ id, title, done: false }`, где `id` — длина массива плюс 1. Исходный массив не меняй.',
          entry: 'addTodo',
          starter: 'function addTodo(todos, title) {\n  \n}',
          mustUse: ['...'],
          tests: [
            {
              name: 'в пустой список',
              args: [[], 'первая'],
              expected: [{ id: 1, title: 'первая', done: false }],
            },
            {
              name: 'в непустой список',
              args: [[{ id: 1, title: 'a', done: true }], 'b'],
              expected: [
                { id: 1, title: 'a', done: true },
                { id: 2, title: 'b', done: false },
              ],
            },
          ],
          hints: ['return [...todos, { id: todos.length + 1, title, done: false }]'],
          solution:
            'function addTodo(todos, title) {\n  return [...todos, { id: todos.length + 1, title, done: false }]\n}',
        },
        {
          kind: 'code',
          title: 'Переключи задачу',
          lang: 'js',
          prompt:
            'Напиши функцию `toggleTodo(todos, id)`, возвращающую новый массив, где у задачи с данным `id` поле `done` инвертировано, остальные — без изменений.',
          entry: 'toggleTodo',
          starter: 'function toggleTodo(todos, id) {\n  \n}',
          mustUse: ['map'],
          tests: [
            {
              name: 'переключаем id=1',
              args: [[{ id: 1, title: 'a', done: false }], 1],
              expected: [{ id: 1, title: 'a', done: true }],
            },
            {
              name: 'остальные не трогаем',
              args: [
                [
                  { id: 1, title: 'a', done: false },
                  { id: 2, title: 'b', done: false },
                ],
                2,
              ],
              expected: [
                { id: 1, title: 'a', done: false },
                { id: 2, title: 'b', done: true },
              ],
            },
          ],
          hints: ['todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))'],
          solution:
            'function toggleTodo(todos, id) {\n  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))\n}',
        },
      ],
    },
  ],
}
