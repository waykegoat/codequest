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
          ],
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
  ],
}
