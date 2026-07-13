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
  ],
}
