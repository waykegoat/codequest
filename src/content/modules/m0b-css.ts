import type { Module } from '../types'

export const m0bCss: Module = {
  id: 'css-basics',
  title: 'Магия CSS',
  description: 'Оживляем страницу: цвета, шрифты, выравнивание и первая карточка.',
  color: '#38bdf8',
  icon: '🎨',
  lessons: [
    {
      id: 'l1-color',
      title: 'Цвет текста',
      subtitle: 'Первое правило CSS',
      xp: 35,
      icon: '🖌️',
      steps: [
        {
          kind: 'theory',
          title: 'Что такое CSS',
          blocks: [
            {
              type: 'text',
              md: 'HTML задаёт **структуру**, а CSS — **внешний вид**. Правило CSS выбирает элемент (селектор) и меняет его свойства.',
            },
            {
              type: 'code',
              lang: 'css',
              code: 'h1 {\n  color: red;\n}',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Селектор `h1` — «все заголовки h1». В фигурных скобках — свойства: `свойство: значение;`.',
            },
          ],
        },
        {
          kind: 'markup',
          title: 'Покрась заголовок',
          prompt: 'Сделай заголовок **красным**. HTML уже готов — тебе нужен только CSS.',
          editors: ['css'],
          starterHtml: '<h1>Раскрась меня</h1>',
          starterCss: 'h1 {\n  \n}',
          checks: [{ name: 'Цвет заголовка — красный', kind: 'style', selector: 'h1', prop: 'color', equals: 'red' }],
          hints: ['Свойство цвета текста — `color`.', 'h1 { color: red; }'],
          solutionCss: 'h1 {\n  color: red;\n}',
        },
      ],
    },
    {
      id: 'l2-align',
      title: 'Фон и выравнивание',
      subtitle: 'Двигаем и красим',
      xp: 40,
      icon: '🎯',
      steps: [
        {
          kind: 'theory',
          title: 'Ещё свойства',
          blocks: [
            {
              type: 'text',
              md: '`background-color` красит фон, `text-align: center` центрирует текст. Свойств у CSS сотни — принцип всегда один.',
            },
            {
              type: 'code',
              lang: 'css',
              code: 'h1 {\n  text-align: center;\n  color: blue;\n}',
            },
          ],
        },
        {
          kind: 'markup',
          title: 'Отцентрируй и покрась',
          prompt: 'Сделай заголовок **синим** (`blue`) и выровняй его по **центру** (`text-align: center`).',
          editors: ['css'],
          starterHtml: '<h1>Заголовок по центру</h1>',
          starterCss: 'h1 {\n  \n}',
          checks: [
            { name: 'Цвет — синий', kind: 'style', selector: 'h1', prop: 'color', equals: 'blue' },
            { name: 'Выравнивание по центру', kind: 'style', selector: 'h1', prop: 'text-align', equals: 'center' },
          ],
          hints: ['Два свойства внутри одного правила, каждое с `;`.', 'color: blue; и text-align: center;'],
          solutionCss: 'h1 {\n  color: blue;\n  text-align: center;\n}',
        },
      ],
    },
    {
      id: 'l3-font',
      title: 'Размер шрифта',
      subtitle: 'Крупнее и заметнее',
      xp: 40,
      icon: '🔠',
      steps: [
        {
          kind: 'theory',
          title: 'Размеры в пикселях',
          blocks: [
            {
              type: 'text',
              md: '`font-size` задаёт размер шрифта. Чаще всего его указывают в пикселях: `px`.',
            },
            { type: 'code', lang: 'css', code: 'p {\n  font-size: 28px;\n  color: green;\n}' },
          ],
        },
        {
          kind: 'markup',
          title: 'Увеличь абзац',
          prompt: 'Сделай текст абзаца размером **28px** и **зелёным** (`green`).',
          editors: ['css'],
          starterHtml: '<p>Крупный зелёный текст</p>',
          starterCss: 'p {\n  \n}',
          checks: [
            { name: 'Размер шрифта — 28px', kind: 'style', selector: 'p', prop: 'font-size', equals: '28px' },
            { name: 'Цвет — зелёный', kind: 'style', selector: 'p', prop: 'color', equals: 'green' },
          ],
          hints: ['font-size: 28px;', 'color: green;'],
          solutionCss: 'p {\n  font-size: 28px;\n  color: green;\n}',
        },
      ],
    },
    {
      id: 'l4-card',
      title: 'Собери карточку',
      subtitle: 'HTML и CSS вместе',
      xp: 55,
      icon: '🃏',
      steps: [
        {
          kind: 'theory',
          title: 'Блоки и классы',
          blocks: [
            {
              type: 'text',
              md: 'Тег `<div>` — универсальный блок-контейнер. Чтобы стилизовать конкретный блок, ему дают **класс**: `<div class="card">`, а в CSS обращаются через точку: `.card`.',
            },
            {
              type: 'code',
              lang: 'css',
              code: '.card {\n  background-color: #7c5cff;\n  border-radius: 16px;\n}',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: '`border-radius` скругляет углы. Цвет можно задавать словом (`red`) или HEX-кодом (`#7c5cff`).',
            },
          ],
        },
        {
          kind: 'markup',
          title: 'Карточка с классом',
          prompt:
            'Сделай `<div>` с классом `card` и текстом внутри. В CSS задай `.card` фиолетовый фон `#7c5cff` и скругление углов `16px`.',
          editors: ['html', 'css'],
          starterHtml: '<div class="card">Моя карточка</div>',
          starterCss: '.card {\n  \n}',
          checks: [
            { name: 'Есть блок с классом card', kind: 'exists', selector: 'div.card' },
            { name: 'Фон карточки — #7c5cff', kind: 'style', selector: '.card', prop: 'background-color', equals: '#7c5cff' },
            { name: 'Скругление углов — 16px', kind: 'style', selector: '.card', prop: 'border-radius', equals: '16px' },
          ],
          hints: [
            'HTML уже почти готов — проверь класс `card`.',
            '.card { background-color: #7c5cff; border-radius: 16px; }',
          ],
          solutionHtml: '<div class="card">Моя карточка</div>',
          solutionCss: '.card {\n  background-color: #7c5cff;\n  border-radius: 16px;\n}',
        },
      ],
    },
  ],
}
