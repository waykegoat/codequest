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
            {
              type: 'text',
              md: '**Куда писать CSS?** Есть два способа:\n\n1. Прямо в HTML внутри тега `<style>...</style>` — быстро для маленьких страниц\n2. В отдельном файле `styles.css`, подключённом через `<link>` — так делают в реальных проектах',
            },
            {
              type: 'code',
              lang: 'html',
              code: '<style>\n  h1 { color: red; }\n</style>\n<h1>Всё в одном файле</h1>',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'В наших задачах два окна — HTML и CSS — имитируют два файла, как в настоящем проекте. Но там, где доступны оба окна, можешь писать `<style>` прямо в HTML — проверки смотрят на итоговый результат, а не на способ.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что выбирает селектор `h1` в правиле `h1 { color: red; }`?',
          options: [
            'первый элемент страницы',
            'все заголовки <h1>',
            'элемент с классом h1',
            'один случайный заголовок',
          ],
          answer: 1,
          explanation: 'Селектор по имени тега применяет правило ко всем таким тегам на странице.',
        },
        {
          kind: 'blank',
          title: 'Собери правило',
          prompt: 'Впиши свойство и не забудь двоеточие со значением: текст должен стать оранжевым.',
          lang: 'css',
          template: 'p {\n  ___: orange;\n}',
          blanks: [{ answer: 'color' }],
          hints: ['Цвет текста задаёт свойство color.'],
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
          kind: 'blank',
          title: 'Задай размер',
          prompt: 'Впиши свойство размера шрифта и единицу измерения.',
          lang: 'css',
          template: 'p {\n  font-___: 24___;\n}',
          blanks: [{ answer: 'size' }, { answer: 'px' }],
          hints: ['font-size, размер в пикселях — px.'],
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
          kind: 'blank',
          title: 'Класс и селектор',
          prompt: 'Впиши атрибут класса в HTML и селектор этого класса в CSS.',
          lang: 'html',
          template: '<div ___="card">Карточка</div>\n\n<style>\n___ {\n  border-radius: 16px;\n}\n</style>',
          blanks: [{ answer: 'class' }, { answer: '.card' }],
          hints: ['Атрибут называется class.', 'В CSS класс выбирают через точку: .card'],
        },
        {
          kind: 'markup',
          title: 'Карточка с классом',
          prompt:
            'Сделай `<div>` с классом `card` и текстом внутри. Задай `.card` фиолетовый фон `#7c5cff` и скругление углов `16px`. Стили пиши где удобнее: в окне CSS или в `<style>` прямо в HTML — проверяется результат.',
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
    {
      id: 'l5-box',
      title: 'Коробочная модель',
      subtitle: 'Отступы и рамки',
      xp: 45,
      icon: '📐',
      steps: [
        {
          kind: 'theory',
          title: 'Каждый элемент — коробка',
          blocks: [
            {
              type: 'text',
              md: 'Любой элемент — прямоугольник из слоёв:\n\n- `padding` — внутренний отступ (между содержимым и рамкой)\n- `border` — рамка\n- `margin` — внешний отступ (до соседей)',
            },
            {
              type: 'code',
              lang: 'css',
              code: '.box {\n  padding: 16px;\n  border: 2px solid black;\n  margin: 24px;\n}',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Запомнить просто: padding — «подушка» внутри, margin — «личное пространство» снаружи.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какое свойство добавит воздуха МЕЖДУ рамкой элемента и его текстом?',
          options: ['margin', 'padding', 'border', 'gap'],
          answer: 1,
          explanation: 'Внутренний отступ — padding. margin работает снаружи рамки.',
        },
        {
          kind: 'blank',
          title: 'Подпиши слои',
          prompt: 'Впиши свойства: внутренний отступ 12px и внешний отступ 20px.',
          lang: 'css',
          template: '.note {\n  ___: 12px;\n  ___: 20px;\n}',
          blanks: [{ answer: 'padding' }, { answer: 'margin' }],
          hints: ['Внутри — padding, снаружи — margin.'],
        },
        {
          kind: 'markup',
          title: 'Оформи заметку',
          prompt:
            'Блок `.note` уже есть. Задай ему внутренний отступ `16px`, рамку `2px solid black` и скругление `8px`.',
          editors: ['css'],
          starterHtml: '<div class="note">Не забыть про padding!</div>',
          starterCss: '.note {\n  \n}',
          checks: [
            { name: 'Внутренний отступ 16px', kind: 'style', selector: '.note', prop: 'padding-top', equals: '16px' },
            { name: 'Рамка 2px', kind: 'style', selector: '.note', prop: 'border-top-width', equals: '2px' },
            { name: 'Скругление 8px', kind: 'style', selector: '.note', prop: 'border-radius', equals: '8px' },
          ],
          hints: ['padding: 16px;', 'border: 2px solid black;', 'border-radius: 8px;'],
          solutionCss: '.note {\n  padding: 16px;\n  border: 2px solid black;\n  border-radius: 8px;\n}',
        },
      ],
    },
    {
      id: 'l6-flex',
      title: 'Флексбокс',
      subtitle: 'Элементы в ряд',
      xp: 50,
      icon: '🧲',
      steps: [
        {
          kind: 'theory',
          title: 'Раскладка одной строкой',
          blocks: [
            {
              type: 'text',
              md: '`display: flex` у родителя выстраивает детей **в ряд**. Дальше рулят свойства родителя:\n\n- `gap` — расстояние между детьми\n- `justify-content` — распределение по горизонтали\n- `align-items` — выравнивание по вертикали',
            },
            {
              type: 'code',
              lang: 'css',
              code: '.row {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n}',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Флексбокс — главный инструмент раскладки в современном CSS. Меню, карточки, шапки — всё на нём.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какое свойство задаёт расстояние между флекс-элементами?',
          options: ['space', 'gap', 'margin-flex', 'distance'],
          answer: 1,
          explanation: '`gap` — простой и современный способ раздвинуть детей флекс-контейнера.',
        },
        {
          kind: 'markup',
          title: 'Выстрой кнопки в ряд',
          prompt:
            'Контейнер `.menu` содержит три кнопки. Сделай его флексом с расстоянием `12px` между кнопками и центрированием по горизонтали (`justify-content: center`).',
          editors: ['css'],
          starterHtml:
            '<div class="menu">\n  <button>Главная</button>\n  <button>Курсы</button>\n  <button>Профиль</button>\n</div>',
          starterCss: '.menu {\n  \n}',
          checks: [
            { name: 'display: flex', kind: 'style', selector: '.menu', prop: 'display', equals: 'flex' },
            { name: 'gap: 12px', kind: 'style', selector: '.menu', prop: 'gap', equals: '12px' },
            { name: 'Центрирование по горизонтали', kind: 'style', selector: '.menu', prop: 'justify-content', equals: 'center' },
          ],
          hints: ['display: flex; gap: 12px;', 'justify-content: center;'],
          solutionCss: '.menu {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n}',
        },
      ],
    },
    {
      id: 'l7-mini-page',
      title: 'Мини-страница',
      subtitle: 'Всё вместе',
      xp: 60,
      icon: '🏗️',
      steps: [
        {
          kind: 'theory',
          title: 'Финал модуля',
          blocks: [
            {
              type: 'text',
              md: 'Соберём страницу целиком: семантический каркас из HTML-модуля плюс стили — цвет, отступы и флексбокс. Именно так выглядит реальная вёрстка.',
            },
            {
              type: 'code',
              lang: 'css',
              code: 'header {\n  display: flex;\n  justify-content: center;\n  background-color: black;\n}\nheader h1 {\n  color: white;\n}',
            },
          ],
        },
        {
          kind: 'markup',
          title: 'Профиль разработчика',
          prompt:
            'Сверстай карточку профиля: в HTML — `<div class="profile">` с заголовком `<h2>` **Байт** и абзацем. В CSS: фон `.profile` — чёрный, текст — белый (`color: white`), внутренний отступ `24px`, скругление `12px`.',
          editors: ['html', 'css'],
          starterHtml: '<div class="profile">\n  \n</div>',
          starterCss: '.profile {\n  \n}',
          checks: [
            { name: 'Заголовок h2 «Байт» внутри .profile', kind: 'text', selector: '.profile h2', equals: 'Байт' },
            { name: 'Есть абзац в карточке', kind: 'exists', selector: '.profile p' },
            { name: 'Чёрный фон', kind: 'style', selector: '.profile', prop: 'background-color', equals: 'black' },
            { name: 'Белый текст', kind: 'style', selector: '.profile', prop: 'color', equals: 'white' },
            { name: 'Отступ 24px', kind: 'style', selector: '.profile', prop: 'padding-top', equals: '24px' },
            { name: 'Скругление 12px', kind: 'style', selector: '.profile', prop: 'border-radius', equals: '12px' },
          ],
          hints: [
            'В HTML: <h2>Байт</h2> и <p>...</p> внутри блока.',
            '.profile { background-color: black; color: white; padding: 24px; border-radius: 12px; }',
          ],
          solutionHtml: '<div class="profile">\n  <h2>Байт</h2>\n  <p>Учу людей кодить.</p>\n</div>',
          solutionCss:
            '.profile {\n  background-color: black;\n  color: white;\n  padding: 24px;\n  border-radius: 12px;\n}',
        },
      ],
    },
    {
      id: 'l8-css-boss',
      title: 'Битва с боссом: Владыка Адаптива',
      subtitle: 'Flexbox, Grid и Неоновый стиль',
      xp: 90,
      icon: '👑',
      steps: [
        {
          kind: 'boss',
          title: 'Адаптивная киберпанк-визитка разработчика',
          bossName: 'Владыка Адаптива',
          bossAvatar: '⚡',
          bossRole: 'Мастер Grid, Flexbox и Неона',
          bossHp: 100,
          prompt: `Спроектируй стили для современной адаптивной карточки профиля!

**Требования:**
1. **Современная сетка**: используй \`display: flex\` или \`display: grid\` для выравнивания элементов карточки.
2. **Визуальный стиль**: тёмный фон, яркий контрастный текст, скругление углов (\`border-radius\`) и неоновое свечение (\`box-shadow\`).
3. **Интерактивность**: добавь состояние наведения (\`:hover\`) с плавным переходом (\`transition\`) для кнопок или всей карточки.
4. **Адаптивность**: медиа-запрос \`@media (max-width: 600px)\`, меняющий направление сетки или размер шрифтов для удобного просмотра со смартфона.`,
          lang: 'css',
          rubrics: [
            {
              id: 'css-modern-layout',
              title: 'Современная сетка (Flex/Grid)',
              description: 'Компоновка построена на базе Flexbox или CSS Grid с выравниванием',
            },
            {
              id: 'css-responsive-media',
              title: 'Адаптивность через @media',
              description: 'Реализован медиа-запрос под мобильные экраны (max-width: 600px / 768px)',
            },
            {
              id: 'css-visual-effects',
              title: 'Эстетика и эффекты',
              description: 'Использованы box-shadow, border-radius и гармоничная цветовая палитра',
            },
            {
              id: 'css-interactive-transitions',
              title: 'Плавная интерактивность (:hover)',
              description: 'Настроены псевдоклассы :hover и переходы transition',
            },
          ],
          hints: [
            'display: flex; flex-direction: column; gap: 16px; align-items: center;',
            'box-shadow: 0 0 20px rgba(124, 92, 255, 0.5);',
            '@media (max-width: 600px) { ... }',
          ],
          starter: `/* ⚡ Битва с боссом: Владыка Адаптива */
/* Стилизуй карточку .profile-card под мобильные и десктопные устройства */

.profile-card {
  /* Задай фон, отступы, скругление и сетку flex/grid */
}

.profile-btn {
  /* Задай стили кнопки с :hover и transition */
}

/* Добавь медиа-запрос для мобильных устройств */
`,
          solution: `.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 480px;
  margin: 0 auto;
  padding: 32px;
  background: #0f172a;
  color: #f8fafc;
  border-radius: 16px;
  border: 1px solid #334155;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 35px rgba(56, 189, 248, 0.4);
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #38bdf8;
}

.profile-btn {
  display: inline-flex;
  padding: 10px 24px;
  background: #38bdf8;
  color: #0f172a;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease, filter 0.2s ease;
}

.profile-btn:hover {
  background: #0284c7;
  filter: brightness(1.1);
}

@media (max-width: 600px) {
  .profile-card {
    padding: 20px;
    border-radius: 12px;
    width: 90%;
  }
  .profile-btn {
    width: 100%;
    justify-content: center;
  }
}`,
        },
      ],
    },
  ],
}
