import type { Module } from '../types'

export const m6Frontend: Module = {
  id: 'frontend',
  title: 'Фронтенд: живой интерфейс',
  description:
    'Настоящий DOM: находим элементы, реагируем на клики, меняем страницу, строим списки — и только потом фреймворки.',
  color: '#22c55e',
  icon: '⚛️',
  lessons: [
    {
      id: 'l1-select',
      title: 'Находим элементы',
      subtitle: 'querySelector и textContent',
      xp: 45,
      icon: '🎯',
      steps: [
        {
          kind: 'theory',
          title: 'Страница — это дерево',
          blocks: [
            {
              type: 'text',
              md: 'Браузер превращает HTML в дерево объектов — **DOM** (Document Object Model). JavaScript может его читать и менять. Так работает всё интерактивное в вебе.',
            },
            {
              type: 'text',
              md: 'Чтобы найти элемент, используют `document.querySelector(селектор)` — селектор такой же, как в CSS:\n\n- `\'#title\'` — по id\n- `\'.card\'` — по классу\n- `\'button\'` — по тегу',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const title = document.querySelector('#title')\ntitle.textContent = 'Новый текст'",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: '`.textContent` и читает, и меняет текст элемента. Присвоил — страница обновилась мгновенно.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Как найти элемент с id="menu"?',
          options: [
            "document.querySelector('menu')",
            "document.querySelector('#menu')",
            "document.querySelector('.menu')",
            "document.getName('menu')",
          ],
          answer: 1,
          explanation: 'id в селекторе пишется с решёткой: #menu (как в CSS).',
        },
        {
          kind: 'blank',
          title: 'Собери обращение к DOM',
          prompt: 'Впиши метод поиска и свойство текста.',
          lang: 'js',
          template: "document.___('#title').___ = 'Привет'",
          blanks: [{ answer: 'querySelector' }, { answer: 'textContent' }],
          hints: ['Поиск — querySelector.', 'Текст элемента — textContent.'],
        },
        {
          kind: 'dom',
          title: 'Поменяй заголовок',
          prompt:
            'На странице есть заголовок с `id="title"` и текстом «Загрузка…». Найди его и замени текст на `Привет, DOM!`.',
          html: '<h1 id="title">Загрузка…</h1>',
          starter: "// найди #title и поменяй его textContent\n",
          checks: [
            { name: 'Заголовок теперь «Привет, DOM!»', kind: 'text', selector: '#title', equals: 'Привет, DOM!' },
          ],
          hints: [
            "document.querySelector('#title')",
            "…textContent = 'Привет, DOM!'",
          ],
          solution: "document.querySelector('#title').textContent = 'Привет, DOM!'",
        },
      ],
    },
    {
      id: 'l2-events',
      title: 'Реагируем на клик',
      subtitle: 'addEventListener',
      xp: 50,
      icon: '🖱️',
      steps: [
        {
          kind: 'theory',
          title: 'Страница слушает пользователя',
          blocks: [
            {
              type: 'text',
              md: '`element.addEventListener(\'click\', функция)` говорит: «когда по элементу кликнут — выполни эту функцию». Функцию-реакцию называют **обработчиком** события.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const btn = document.querySelector('#btn')\nbtn.addEventListener('click', () => {\n  console.log('кликнули!')\n})",
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Событий много: `click`, `input` (ввод в поле), `submit` (отправка формы), `mouseover` и другие. Принцип один.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает второй аргумент addEventListener?',
          options: [
            'название кнопки',
            'функция, которая выполнится при событии',
            'цвет элемента',
            'номер клика',
          ],
          answer: 1,
          explanation: 'Второй аргумент — обработчик: функция, вызываемая при наступлении события.',
        },
        {
          kind: 'dom',
          title: 'Оживи кнопку',
          prompt:
            'Есть кнопка `#btn` и абзац `#out`. Повесь на кнопку обработчик клика, который меняет текст `#out` на `Нажато!`. Мы кликнем за тебя при проверке.',
          html: '<button id="btn">Нажми меня</button>\n<p id="out">пока тихо</p>',
          starter: "const btn = document.querySelector('#btn')\n// btn.addEventListener('click', () => { ... })\n",
          actions: [{ type: 'click', selector: '#btn' }],
          checks: [
            { name: 'После клика #out показывает «Нажато!»', kind: 'text', selector: '#out', equals: 'Нажато!' },
          ],
          hints: [
            "btn.addEventListener('click', () => {",
            "  document.querySelector('#out').textContent = 'Нажато!'",
            '})',
          ],
          solution:
            "const btn = document.querySelector('#btn')\nbtn.addEventListener('click', () => {\n  document.querySelector('#out').textContent = 'Нажато!'\n})",
        },
      ],
    },
    {
      id: 'l3-counter',
      title: 'Счётчик кликов',
      subtitle: 'Состояние в переменной',
      xp: 55,
      icon: '🔢',
      steps: [
        {
          kind: 'theory',
          title: 'Помним между кликами',
          blocks: [
            {
              type: 'text',
              md: 'Чтобы считать клики, заведи переменную **снаружи** обработчика — она живёт между вызовами. Каждый клик увеличивает её и обновляет страницу. Это и есть **состояние** интерфейса своими руками.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "let count = 0\nbtn.addEventListener('click', () => {\n  count++\n  label.textContent = count\n})",
            },
            {
              type: 'callout',
              tone: 'warning',
              md: 'Если объявить `let count = 0` ВНУТРИ обработчика — счётчик будет обнуляться на каждом клике. Переменная состояния живёт снаружи.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Почему переменную счётчика объявляют вне обработчика?',
          options: [
            'так короче',
            'чтобы её значение сохранялось между кликами',
            'внутри нельзя объявлять переменные',
            'это не важно',
          ],
          answer: 1,
          explanation: 'Переменная снаружи создаётся один раз и помнит значение; внутренняя пересоздаётся каждый клик.',
        },
        {
          kind: 'dom',
          title: 'Сделай счётчик',
          prompt:
            'Кнопка `#inc` и `<span id="count">0</span>`. Каждый клик по кнопке должен увеличивать число в `#count` на 1. При проверке мы кликнем 3 раза — должно стать `3`.',
          html: '<button id="inc">+1</button>\n<span id="count">0</span>',
          starter: "let count = 0\nconst inc = document.querySelector('#inc')\n// повесь обработчик, увеличивай count и обновляй #count\n",
          actions: [
            { type: 'click', selector: '#inc' },
            { type: 'click', selector: '#inc' },
            { type: 'click', selector: '#inc' },
          ],
          checks: [
            { name: 'После трёх кликов в #count стоит «3»', kind: 'text', selector: '#count', equals: '3' },
          ],
          hints: [
            "inc.addEventListener('click', () => {",
            '  count++',
            "  document.querySelector('#count').textContent = count",
            '})',
          ],
          solution:
            "let count = 0\nconst inc = document.querySelector('#inc')\ninc.addEventListener('click', () => {\n  count++\n  document.querySelector('#count').textContent = count\n})",
        },
      ],
    },
    {
      id: 'l4-classes',
      title: 'Меняем оформление',
      subtitle: 'classList.toggle',
      xp: 55,
      icon: '🎨',
      steps: [
        {
          kind: 'theory',
          title: 'Классы из JavaScript',
          blocks: [
            {
              type: 'text',
              md: 'Внешний вид меняют не напрямую стилями, а **переключением классов** — стили остаются в CSS, а JS только вешает и снимает класс:\n\n- `el.classList.add(\'active\')`\n- `el.classList.remove(\'active\')`\n- `el.classList.toggle(\'active\')` — есть → снять, нет → добавить',
            },
            {
              type: 'code',
              lang: 'js',
              code: "toggle.addEventListener('click', () => {\n  box.classList.toggle('dark')\n})",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Так делают переключатели тёмной темы, «лайки», раскрывающиеся меню — везде toggle класса.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает `classList.toggle("open")`?',
          options: [
            'всегда добавляет класс open',
            'всегда удаляет класс open',
            'добавляет, если класса нет, и удаляет, если есть',
            'меняет текст на open',
          ],
          answer: 2,
          explanation: 'toggle переключает класс: нет → добавит, есть → снимет.',
        },
        {
          kind: 'dom',
          title: 'Переключатель темы',
          prompt:
            'Кнопка `#toggle` и блок `#box`. По клику добавляй/снимай у блока класс `dark`. При проверке мы кликнем один раз — у `#box` должен появиться класс `dark`.',
          html: '<button id="toggle">Сменить тему</button>\n<div id="box">Коробка</div>',
          starter: "const toggle = document.querySelector('#toggle')\nconst box = document.querySelector('#box')\n// по клику переключай класс dark у box\n",
          actions: [{ type: 'click', selector: '#toggle' }],
          checks: [
            { name: 'После клика у #box есть класс dark', kind: 'attr', selector: '#box', attr: 'class', equals: 'dark' },
          ],
          hints: [
            "toggle.addEventListener('click', () => {",
            "  box.classList.toggle('dark')",
            '})',
          ],
          solution:
            "const toggle = document.querySelector('#toggle')\nconst box = document.querySelector('#box')\ntoggle.addEventListener('click', () => {\n  box.classList.toggle('dark')\n})",
        },
      ],
    },
    {
      id: 'l5-list',
      title: 'Строим список из данных',
      subtitle: 'createElement и append',
      xp: 60,
      icon: '📋',
      steps: [
        {
          kind: 'theory',
          title: 'Из массива — на страницу',
          blocks: [
            {
              type: 'text',
              md: 'Данные обычно приходят массивом, а показать их надо как элементы страницы. Для каждого элемента создают узел и добавляют его в контейнер:',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const list = document.querySelector('#list')\nfor (const item of ['A', 'B', 'C']) {\n  const li = document.createElement('li')\n  li.textContent = item\n  list.appendChild(li)\n}",
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Именно это фреймворки (Vue, React) делают за тебя, когда ты пишешь `v-for` или `.map()`. Под капотом — тот же цикл по DOM.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает `document.createElement("li")`?',
          options: [
            'находит существующий <li>',
            'создаёт новый элемент <li> (пока не на странице)',
            'удаляет <li>',
            'считает количество <li>',
          ],
          answer: 1,
          explanation: 'createElement создаёт узел в памяти; на страницу он попадёт после appendChild.',
        },
        {
          kind: 'blank',
          title: 'Добавь узел на страницу',
          prompt: 'Впиши методы: создать элемент и вложить его в список.',
          lang: 'js',
          template: "const li = document.___('li')\nli.textContent = item\nlist.___(li)",
          blanks: [{ answer: 'createElement' }, { answer: 'appendChild' }],
          hints: ['Создание — createElement, вставка — appendChild.'],
        },
        {
          kind: 'dom',
          title: 'Отрендери задачи',
          prompt:
            'Массив `tasks` уже есть. Пройди по нему и добавь в `<ul id="list">` по одному `<li>` с текстом каждой задачи. Должно получиться 3 пункта.',
          html: '<ul id="list"></ul>',
          starter:
            "const tasks = ['Купить хлеб', 'Позвонить маме', 'Выучить DOM']\nconst list = document.querySelector('#list')\n// для каждой задачи создай li и добавь в list\n",
          checks: [
            { name: 'В списке 3 пункта', kind: 'count', selector: '#list li', equals: 3 },
            { name: 'Первый пункт — «Купить хлеб»', kind: 'text', selector: '#list li', equals: 'Купить хлеб' },
          ],
          hints: [
            'for (const task of tasks) {',
            "  const li = document.createElement('li')",
            '  li.textContent = task',
            '  list.appendChild(li)',
            '}',
          ],
          solution:
            "const tasks = ['Купить хлеб', 'Позвонить маме', 'Выучить DOM']\nconst list = document.querySelector('#list')\nfor (const task of tasks) {\n  const li = document.createElement('li')\n  li.textContent = task\n  list.appendChild(li)\n}",
        },
      ],
    },
    {
      id: 'l6-form',
      title: 'Живая форма',
      subtitle: 'Читаем ввод, показываем результат',
      xp: 65,
      icon: '⌨️',
      steps: [
        {
          kind: 'theory',
          title: 'Ввод пользователя',
          blocks: [
            {
              type: 'text',
              md: 'Значение поля ввода лежит в `input.value`. По клику или отправке формы его читают, обрабатывают и показывают результат на странице.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "go.addEventListener('click', () => {\n  const name = input.value\n  output.textContent = 'Привет, ' + name + '!'\n})",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Реальные приложения так и работают: прочитали `value`, проверили, отправили на сервер или показали результат.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Где лежит текст, который пользователь ввёл в `<input>`?',
          options: ['input.text', 'input.value', 'input.content', 'input.data'],
          answer: 1,
          explanation: 'Текущее содержимое поля — в свойстве value.',
        },
        {
          kind: 'dom',
          title: 'Поприветствуй по имени',
          prompt:
            'Поле `#name`, кнопка `#go`, абзац `#greet`. По клику по кнопке прочитай имя из поля и покажи в `#greet` строку `Привет, ИМЯ!`. При проверке мы введём «Аня» и нажмём кнопку.',
          html: '<input id="name" placeholder="Имя">\n<button id="go">Поздороваться</button>\n<p id="greet"></p>',
          starter:
            "const go = document.querySelector('#go')\n// по клику: прочитай #name.value и запиши приветствие в #greet\n",
          actions: [
            { type: 'input', selector: '#name', value: 'Аня' },
            { type: 'click', selector: '#go' },
          ],
          checks: [
            { name: 'После ввода «Аня» и клика #greet = «Привет, Аня!»', kind: 'text', selector: '#greet', equals: 'Привет, Аня!' },
          ],
          hints: [
            "go.addEventListener('click', () => {",
            "  const name = document.querySelector('#name').value",
            "  document.querySelector('#greet').textContent = 'Привет, ' + name + '!'",
            '})',
          ],
          solution:
            "const go = document.querySelector('#go')\ngo.addEventListener('click', () => {\n  const name = document.querySelector('#name').value\n  document.querySelector('#greet').textContent = 'Привет, ' + name + '!'\n})",
        },
      ],
    },
    {
      id: 'l7-todo',
      title: 'Мини TODO-приложение',
      subtitle: 'Всё вместе',
      xp: 75,
      icon: '✅',
      steps: [
        {
          kind: 'theory',
          title: 'Собираем приложение',
          blocks: [
            {
              type: 'text',
              md: 'Теперь всё сразу: читаем ввод, создаём элемент, добавляем в список по клику. Это ядро любого TODO — и первый проект в портфолио джуна.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "add.addEventListener('click', () => {\n  const li = document.createElement('li')\n  li.textContent = input.value\n  list.appendChild(li)\n})",
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'В каком порядке добавляется задача по клику?',
          options: [
            'создать li → задать текст из input.value → appendChild в список',
            'appendChild → createElement → textContent',
            'сначала очистить список, потом добавить',
            'порядок не важен',
          ],
          answer: 0,
          explanation: 'Создаём узел, наполняем текстом из поля, вставляем в контейнер.',
        },
        {
          kind: 'dom',
          title: 'Добавление задач',
          prompt:
            'Поле `#task`, кнопка `#add`, список `#list`. По клику по кнопке добавляй в список новый `<li>` с текстом из поля. При проверке мы дважды введём задачу и нажмём кнопку — в списке должно стать 2 пункта, первый — «Первая».',
          html: '<input id="task" placeholder="Новая задача">\n<button id="add">Добавить</button>\n<ul id="list"></ul>',
          starter:
            "const add = document.querySelector('#add')\nconst list = document.querySelector('#list')\n// по клику создавай li из #task.value и добавляй в list\n",
          actions: [
            { type: 'input', selector: '#task', value: 'Первая' },
            { type: 'click', selector: '#add' },
            { type: 'input', selector: '#task', value: 'Вторая' },
            { type: 'click', selector: '#add' },
          ],
          checks: [
            { name: 'В списке 2 задачи', kind: 'count', selector: '#list li', equals: 2 },
            { name: 'Первая задача — «Первая»', kind: 'text', selector: '#list li', equals: 'Первая' },
          ],
          hints: [
            "add.addEventListener('click', () => {",
            "  const li = document.createElement('li')",
            "  li.textContent = document.querySelector('#task').value",
            '  list.appendChild(li)',
            '})',
          ],
          solution:
            "const add = document.querySelector('#add')\nconst list = document.querySelector('#list')\nadd.addEventListener('click', () => {\n  const li = document.createElement('li')\n  li.textContent = document.querySelector('#task').value\n  list.appendChild(li)\n})",
        },
      ],
    },
    {
      id: 'l8-frameworks',
      title: 'Зачем нужны фреймворки',
      subtitle: 'От DOM к Vue и React',
      xp: 55,
      icon: '⚛️',
      steps: [
        {
          kind: 'theory',
          title: 'Ручной DOM не масштабируется',
          blocks: [
            {
              type: 'text',
              md: 'Ты научился менять страницу руками. В больших приложениях так писать тяжело: сотни `querySelector`, легко забыть обновить кусок. **Фреймворки** (Vue, React) решают это: ты описываешь, КАК выглядит интерфейс для данных, а они сами обновляют DOM при изменении состояния.',
            },
            {
              type: 'code',
              lang: 'js',
              code: '// Ручной DOM:\ncount++\ndocument.querySelector(\'#count\').textContent = count\n\n// Vue: меняешь только данные, DOM обновится сам\ncount.value++',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Понимание «ручного» DOM — фундамент. На собеседовании спрашивают именно его: как работает event listener, чем textContent отличается от innerHTML.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что фреймворк делает за разработчика?',
          options: [
            'пишет весь код сам',
            'автоматически обновляет DOM при изменении состояния',
            'заменяет JavaScript',
            'ускоряет интернет',
          ],
          answer: 1,
          explanation: 'Главная идея: описываешь связь данные→вид, а обновлением DOM занимается фреймворк.',
        },
        {
          kind: 'code',
          title: 'Реактивное обновление вручную',
          lang: 'js',
          prompt:
            'Смоделируем реактивность. Напиши функцию `render(state)`, возвращающую строку `Задач: N (готово: M)`, где N — всего задач, M — выполненных. `state` — массив `{ done }`.',
          entry: 'render',
          starter: 'function render(state) {\n  \n}',
          tests: [
            {
              name: '3 задачи, 1 готова',
              args: [[{ done: true }, { done: false }, { done: false }]],
              expected: 'Задач: 3 (готово: 1)',
            },
            { name: 'пусто', args: [[]], expected: 'Задач: 0 (готово: 0)' },
          ],
          hints: [
            'Всего — state.length.',
            'Готово — state.filter((t) => t.done).length.',
            'Верни шаблонную строку.',
          ],
          solution:
            'function render(state) {\n  const done = state.filter((t) => t.done).length\n  return `Задач: ${state.length} (готово: ${done})`\n}',
        },
      ],
    },
  ],
}
