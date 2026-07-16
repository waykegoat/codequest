import type { Module } from '../types'

export const m0Html: Module = {
  id: 'html-basics',
  title: 'Знакомство с HTML',
  description: 'Самое начало: теги, заголовки, абзацы, списки и ссылки. Твоя первая страница.',
  color: '#ff8a4c',
  icon: '🌐',
  lessons: [
    {
      id: 'l1-first-tag',
      title: 'Первый тег',
      subtitle: 'Из чего сделан сайт',
      xp: 30,
      icon: '🏷️',
      steps: [
        {
          kind: 'theory',
          title: 'Сайт — это текст с тегами',
          blocks: [
            {
              type: 'text',
              md: 'Любая веб-страница — это обычный текст, размеченный **тегами**. Тег говорит браузеру, чем является кусочек текста: заголовком, абзацем, ссылкой.',
            },
            {
              type: 'text',
              md: 'Тег обычно парный: открывающий и закрывающий. Между ними — содержимое. Заголовок первого уровня — это `<h1>`:',
            },
            { type: 'code', lang: 'html', code: '<h1>Привет, мир!</h1>' },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Закрывающий тег отличается косой чертой: `</h1>`. Забыть её — частая ошибка новичка.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Чем закрывающий тег отличается от открывающего?',
          options: [
            'пишется заглавными буквами',
            'содержит косую черту: </h1>',
            'ставится перед содержимым',
            'ничем',
          ],
          answer: 1,
          explanation: 'Закрывающий тег начинается с косой черты: `</h1>`.',
        },
        {
          kind: 'markup',
          title: 'Создай заголовок',
          prompt:
            'Напиши заголовок первого уровня с текстом **Привет, мир!**. Справа сразу видно результат.',
          editors: ['html'],
          starterHtml: '',
          checks: [
            { name: 'На странице есть заголовок <h1>', kind: 'exists', selector: 'h1' },
            { name: 'Текст заголовка — «Привет, мир!»', kind: 'text', selector: 'h1', equals: 'Привет, мир!' },
          ],
          hints: [
            'Заголовок пишется так: `<h1>текст</h1>`',
            'Между тегами напиши: Привет, мир!',
          ],
          solutionHtml: '<h1>Привет, мир!</h1>',
        },
      ],
    },
    {
      id: 'l2-paragraph',
      title: 'Заголовок и абзац',
      subtitle: 'Текст на странице',
      xp: 30,
      icon: '📄',
      steps: [
        {
          kind: 'theory',
          title: 'Абзацы',
          blocks: [
            {
              type: 'text',
              md: 'Обычный текст оборачивают в тег абзаца `<p>` (от англ. paragraph). Заголовков уровней шесть: от `<h1>` (самый крупный) до `<h6>`.',
            },
            {
              type: 'code',
              lang: 'html',
              code: '<h1>Мой блог</h1>\n<p>Здесь я рассказываю о коде.</p>',
            },
          ],
        },
        {
          kind: 'blank',
          title: 'Дострой разметку',
          prompt: 'Впиши имена тегов: заголовок второго уровня и абзац.',
          lang: 'html',
          template: '<___>О себе</h2>\n<___>Учусь верстать сайты.</p>',
          blanks: [{ answer: 'h2' }, { answer: 'p' }],
          hints: ['Уровней заголовков шесть: h1–h6.', 'Абзац — тег p.'],
        },
        {
          kind: 'markup',
          title: 'Заголовок + абзац',
          prompt:
            'Сделай заголовок `<h1>` с текстом **Мой сайт** и под ним абзац `<p>` с любым текстом.',
          editors: ['html'],
          starterHtml: '<h1></h1>\n',
          checks: [
            { name: 'Заголовок <h1> с текстом «Мой сайт»', kind: 'text', selector: 'h1', equals: 'Мой сайт' },
            { name: 'На странице есть абзац <p>', kind: 'exists', selector: 'p' },
          ],
          hints: ['Абзац: `<p>любой текст</p>`', 'Не забудь вписать «Мой сайт» внутрь <h1>.'],
          solutionHtml: '<h1>Мой сайт</h1>\n<p>Добро пожаловать!</p>',
        },
      ],
    },
    {
      id: 'l3-lists',
      title: 'Списки',
      subtitle: 'Перечисляем по пунктам',
      xp: 35,
      icon: '📝',
      steps: [
        {
          kind: 'theory',
          title: 'Маркированный список',
          blocks: [
            {
              type: 'text',
              md: 'Список делают из двух тегов: `<ul>` — контейнер списка, а каждый пункт внутри — `<li>` (list item).',
            },
            {
              type: 'code',
              lang: 'html',
              code: '<ul>\n  <li>Яблоко</li>\n  <li>Банан</li>\n  <li>Киви</li>\n</ul>',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Есть и нумерованный список `<ol>` — пункты в нём те же `<li>`, но браузер сам проставит номера.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Каким тегом размечают один пункт списка?',
          options: ['<ul>', '<item>', '<li>', '<point>'],
          answer: 2,
          explanation: '`<li>` — list item, пункт списка. `<ul>`/`<ol>` — контейнеры.',
        },
        {
          kind: 'markup',
          title: 'Список из трёх пунктов',
          prompt: 'Сделай маркированный список `<ul>` ровно с **тремя** пунктами `<li>` — любыми.',
          editors: ['html'],
          starterHtml: '<ul>\n  \n</ul>',
          checks: [
            { name: 'Есть список <ul>', kind: 'exists', selector: 'ul' },
            { name: 'Внутри ровно 3 пункта <li>', kind: 'count', selector: 'ul li', equals: 3 },
          ],
          hints: ['Каждый пункт — отдельный `<li>...</li>`.', 'Нужно три строки <li> внутри <ul>.'],
          solutionHtml: '<ul>\n  <li>Первый</li>\n  <li>Второй</li>\n  <li>Третий</li>\n</ul>',
        },
      ],
    },
    {
      id: 'l4-links',
      title: 'Ссылки',
      subtitle: 'Соединяем страницы',
      xp: 35,
      icon: '🔗',
      steps: [
        {
          kind: 'theory',
          title: 'Тег ссылки',
          blocks: [
            {
              type: 'text',
              md: 'Ссылка — это тег `<a>`. Адрес задаётся **атрибутом** `href`. Атрибут пишется внутри открывающего тега.',
            },
            { type: 'code', lang: 'html', code: '<a href="https://ya.ru">Перейти</a>' },
            {
              type: 'callout',
              tone: 'info',
              md: 'Атрибут — это дополнительная настройка тега в формате `имя="значение"`.',
            },
          ],
        },
        {
          kind: 'blank',
          title: 'Дострой ссылку',
          prompt: 'Впиши имя тега и имя атрибута с адресом.',
          lang: 'html',
          template: '<___ ___="https://ya.ru">Поиск</a>',
          blanks: [{ answer: 'a' }, { answer: 'href' }],
          hints: ['Тег ссылки — a.', 'Адрес хранит атрибут href.'],
        },
        {
          kind: 'markup',
          title: 'Сделай ссылку',
          prompt:
            'Создай ссылку `<a>` с адресом `https://example.com` (атрибут `href`) и текстом **Тык**.',
          editors: ['html'],
          starterHtml: '',
          checks: [
            { name: 'На странице есть ссылка <a>', kind: 'exists', selector: 'a' },
            { name: 'Адрес href = https://example.com', kind: 'attr', selector: 'a', attr: 'href', equals: 'https://example.com' },
            { name: 'Текст ссылки — «Тык»', kind: 'text', selector: 'a', equals: 'Тык' },
          ],
          hints: [
            'Шаблон: `<a href="адрес">текст</a>`',
            'Подставь адрес https://example.com и текст Тык.',
          ],
          solutionHtml: '<a href="https://example.com">Тык</a>',
        },
      ],
    },
    {
      id: 'l5-images',
      title: 'Картинки',
      subtitle: 'Изображения и alt',
      xp: 35,
      icon: '🖼️',
      steps: [
        {
          kind: 'theory',
          title: 'Тег изображения',
          blocks: [
            {
              type: 'text',
              md: 'Картинку вставляет тег `<img>`. Он **одиночный** — закрывающего тега нет. Два главных атрибута:\n\n- `src` — адрес файла картинки\n- `alt` — текст-описание, если картинка не загрузилась',
            },
            { type: 'code', lang: 'html', code: '<img src="cat.png" alt="Рыжий кот">' },
            {
              type: 'callout',
              tone: 'tip',
              md: '`alt` — не формальность: его читают скринридеры и показывает браузер при ошибке загрузки. Всегда заполняй.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Зачем нужен атрибут `alt` у картинки?',
          options: [
            'задаёт размер картинки',
            'описание для скринридеров и при ошибке загрузки',
            'подпись под картинкой',
            'ссылка на автора',
          ],
          answer: 1,
          explanation: 'alt делает страницу доступной и полезен при проблемах с загрузкой файла.',
        },
        {
          kind: 'blank',
          title: 'Дополни картинку',
          prompt: 'Впиши имена атрибутов: адрес файла и текстовое описание.',
          lang: 'html',
          template: '<img ___="logo.png" ___="Логотип сайта">',
          blanks: [{ answer: 'src' }, { answer: 'alt' }],
          hints: ['Адрес — src (source).', 'Описание — alt (alternative text).'],
        },
        {
          kind: 'markup',
          title: 'Вставь изображение',
          prompt:
            'Добавь на страницу картинку с адресом `photo.jpg` и описанием **Моё фото** (атрибут `alt`).',
          editors: ['html'],
          starterHtml: '<h1>Обо мне</h1>\n',
          checks: [
            { name: 'На странице есть <img>', kind: 'exists', selector: 'img' },
            { name: 'src = photo.jpg', kind: 'attr', selector: 'img', attr: 'src', equals: 'photo.jpg' },
            { name: 'alt = «Моё фото»', kind: 'attr', selector: 'img', attr: 'alt', equals: 'Моё фото' },
          ],
          hints: ['Шаблон: `<img src="..." alt="...">`'],
          solutionHtml: '<h1>Обо мне</h1>\n<img src="photo.jpg" alt="Моё фото">',
        },
      ],
    },
    {
      id: 'l6-forms',
      title: 'Формы',
      subtitle: 'Поля ввода и кнопки',
      xp: 40,
      icon: '⌨️',
      steps: [
        {
          kind: 'theory',
          title: 'Как страница принимает данные',
          blocks: [
            {
              type: 'text',
              md: 'Формы собирают данные от пользователя:\n\n- `<input>` — поле ввода (одиночный тег)\n- `<button>` — кнопка\n- `<label>` — подпись к полю\n\nАтрибут `placeholder` показывает подсказку внутри пустого поля.',
            },
            {
              type: 'code',
              lang: 'html',
              code: '<label>Имя</label>\n<input placeholder="Как тебя зовут?">\n<button>Отправить</button>',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'У `<input>` есть типы: `type="text"`, `type="password"`, `type="checkbox"` и другие.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какой тег создаёт поле для ввода текста?',
          options: ['<field>', '<input>', '<text>', '<type>'],
          answer: 1,
          explanation: '`<input>` — универсальный тег полей ввода.',
        },
        {
          kind: 'markup',
          title: 'Форма подписки',
          prompt:
            'Собери мини-форму: поле `<input>` с подсказкой `Твой email` (атрибут `placeholder`) и кнопку `<button>` с текстом **Подписаться**.',
          editors: ['html'],
          starterHtml: '<h2>Рассылка</h2>\n',
          checks: [
            { name: 'Есть поле <input>', kind: 'exists', selector: 'input' },
            { name: 'Подсказка placeholder = «Твой email»', kind: 'attr', selector: 'input', attr: 'placeholder', equals: 'Твой email' },
            { name: 'Кнопка с текстом «Подписаться»', kind: 'text', selector: 'button', equals: 'Подписаться' },
          ],
          hints: [
            '`<input placeholder="Твой email">`',
            '`<button>Подписаться</button>`',
          ],
          solutionHtml:
            '<h2>Рассылка</h2>\n<input placeholder="Твой email">\n<button>Подписаться</button>',
        },
      ],
    },
    {
      id: 'l7-structure',
      title: 'Скелет страницы',
      subtitle: 'Семантические теги',
      xp: 45,
      icon: '🦴',
      steps: [
        {
          kind: 'theory',
          title: 'Смысловые блоки',
          blocks: [
            {
              type: 'text',
              md: 'Крупные части страницы размечают **семантическими** тегами — по смыслу:\n\n- `<header>` — шапка\n- `<nav>` — меню навигации\n- `<main>` — основное содержимое\n- `<footer>` — подвал\n\nДля блоков без особого смысла есть `<div>`.',
            },
            {
              type: 'code',
              lang: 'html',
              code: '<header>\n  <h1>Мой блог</h1>\n</header>\n<main>\n  <p>Свежая статья…</p>\n</main>\n<footer>© 2026</footer>',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Семантика помогает поисковикам и скринридерам понимать страницу. «Всё из div» — плохой тон.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Каким тегом разметить подвал сайта с копирайтом?',
          options: ['<bottom>', '<footer>', '<end>', '<div id="footer">'],
          answer: 1,
          explanation: 'Для подвала есть специальный семантический тег `<footer>`.',
        },
        {
          kind: 'order',
          title: 'Собери скелет страницы',
          prompt: 'Расставь блоки в правильном порядке: шапка, основная часть, подвал.',
          lang: 'html',
          lines: [
            '<header>',
            '  <h1>Портфолио</h1>',
            '</header>',
            '<main>',
            '  <p>Мои проекты</p>',
            '</main>',
            '<footer>© 2026</footer>',
          ],
          hints: ['header → main → footer, каждый блок закрывается перед следующим.'],
        },
        {
          kind: 'markup',
          title: 'Страница с каркасом',
          prompt:
            'Собери страницу: `<header>` с заголовком `<h1>` **Мой сайт**, `<main>` с абзацем `<p>` и `<footer>` с текстом **© 2026**.',
          editors: ['html'],
          starterHtml: '',
          checks: [
            { name: 'Есть шапка <header>', kind: 'exists', selector: 'header' },
            { name: 'В шапке — <h1> «Мой сайт»', kind: 'text', selector: 'header h1', equals: 'Мой сайт' },
            { name: 'Есть <main> с абзацем', kind: 'exists', selector: 'main p' },
            { name: 'Подвал с текстом «© 2026»', kind: 'text', selector: 'footer', equals: '© 2026' },
          ],
          hints: [
            'Три блока подряд: header, main, footer.',
            'Внутрь header вложи h1, внутрь main — p.',
          ],
          solutionHtml:
            '<header>\n  <h1>Мой сайт</h1>\n</header>\n<main>\n  <p>Добро пожаловать!</p>\n</main>\n<footer>© 2026</footer>',
        },
      ],
    },
  ],
}
