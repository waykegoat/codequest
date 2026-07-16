import type { Module } from '../types'

export const m9Interview: Module = {
  id: 'interview',
  title: 'Собеседование и первая работа',
  description: 'Классика алгоритмов, каверзные вопросы по JS и подготовка к первому офферу.',
  color: '#e5e5e5',
  icon: '🎯',
  lessons: [
    {
      id: 'l1-reverse',
      title: 'Алгоритмы: разворот',
      subtitle: 'Что оценивают на собесе',
      xp: 60,
      icon: '🔁',
      steps: [
        {
          kind: 'theory',
          title: 'Как проходят технические собеседования',
          blocks: [
            {
              type: 'text',
              md: 'На джуниор-собесе просят решить небольшую задачу вслух. Оценивают три вещи: **корректность** (проходят ли тесты), **крайние случаи** (пустой массив, одна элемент) и то, как ты **рассуждаешь**.',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Проговаривай ход мысли вслух. Интервьюер оценивает не только результат, но и то, как ты думаешь.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const arr = [1, 2, 3]\nconst rev = [...arr].reverse()\n// [3, 2, 1] — исходный массив не изменился",
            },
          ],
        },
        {
          kind: 'order',
          title: 'Собери функцию разворота',
          prompt: 'Расставь строки так, чтобы получилась рабочая функция `reverseArray`.',
          lang: 'js',
          lines: [
            'function reverseArray(arr) {',
            '  const copy = [...arr]',
            '  return copy.reverse()',
            '}',
          ],
          hints: ['Сначала объявление функции, потом тело, в конце — закрывающая скобка.'],
        },
        {
          kind: 'code',
          title: 'Разверни массив',
          lang: 'js',
          prompt:
            'Напиши функцию `reverseArray(arr)`, которая возвращает **новый** массив в обратном порядке (исходный не меняем).',
          entry: 'reverseArray',
          starter: 'function reverseArray(arr) {\n  \n}',
          tests: [
            { name: '[1,2,3] → [3,2,1]', args: [[1, 2, 3]], expected: [3, 2, 1] },
            { name: '[42] → [42]', args: [[42]], expected: [42] },
            { name: '[] → []', args: [[]], expected: [] },
          ],
          hints: ['Скопируй массив через spread, потом reverse().', 'return [...arr].reverse()'],
          solution: 'function reverseArray(arr) {\n  return [...arr].reverse()\n}',
        },
      ],
    },
    {
      id: 'l2-anagram',
      title: 'Строки: анаграммы',
      subtitle: 'Частая задача на собесе',
      xp: 65,
      icon: '🔤',
      steps: [
        {
          kind: 'theory',
          title: 'Работа со строками',
          blocks: [
            {
              type: 'text',
              md: 'Анаграмма — слова из одних и тех же букв: «listen» и «silent». Приём: отсортировать буквы обоих слов и сравнить.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "'listen'.split('').sort().join('') // 'eilnst'\n'silent'.split('').sort().join('') // 'eilnst' → равны",
            },
          ],
        },
        {
          kind: 'blank',
          title: 'Заполни пропуски',
          prompt: 'Восстанови функцию нормализации строки: разбить на буквы, отсортировать, склеить.',
          lang: 'js',
          template: "function normalize(s) {\n  return s.___('').___().___('')\n}",
          blanks: [{ answer: 'split' }, { answer: 'sort' }, { answer: 'join' }],
          hints: [
            'split разбивает строку на массив символов.',
            'sort сортирует, join склеивает обратно.',
          ],
        },
        {
          kind: 'code',
          title: 'Проверь анаграмму',
          lang: 'js',
          prompt:
            'Напиши функцию `isAnagram(a, b)`, возвращающую `true`, если строки — анаграммы (состоят из одних и тех же букв), иначе `false`.',
          entry: 'isAnagram',
          starter: 'function isAnagram(a, b) {\n  \n}',
          tests: [
            { name: 'listen / silent → true', args: ['listen', 'silent'], expected: true },
            { name: 'abc / abd → false', args: ['abc', 'abd'], expected: false },
            { name: 'a / a → true', args: ['a', 'a'], expected: true },
            { name: 'ab / abc → false', args: ['ab', 'abc'], expected: false },
          ],
          hints: [
            'Отсортируй буквы обеих строк и сравни.',
            "const n = (s) => s.split('').sort().join(''); return n(a) === n(b)",
          ],
          solution:
            "function isAnagram(a, b) {\n  const norm = (s) => s.split('').sort().join('')\n  return norm(a) === norm(b)\n}",
        },
      ],
    },
    {
      id: 'l3-twosum',
      title: 'Two Sum',
      subtitle: 'Хэш-таблица за O(n)',
      xp: 70,
      icon: '➕',
      steps: [
        {
          kind: 'theory',
          title: 'Самая частая задача собеса',
          blocks: [
            {
              type: 'text',
              md: 'Дан массив чисел и цель. Нужно найти **индексы** двух чисел, дающих в сумме цель. Наивно — два вложенных цикла (O(n²)). Красиво — один проход с объектом-словарём (O(n)).',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const seen = {}\n// для каждого числа проверяем, встречали ли мы (target - число)\n// если да — нашли пару; если нет — запоминаем число и его индекс",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Умение свести O(n²) к O(n) через хэш-таблицу — сильный сигнал на собесе.',
            },
          ],
        },
        {
          kind: 'code',
          title: 'Реши Two Sum',
          lang: 'js',
          prompt:
            'Напиши функцию `twoSum(nums, target)`, возвращающую массив из двух индексов, числа по которым дают в сумме `target`. Гарантируется, что решение существует и единственно.',
          entry: 'twoSum',
          starter: 'function twoSum(nums, target) {\n  \n}',
          tests: [
            { name: '[2,7,11,15], 9 → [0,1]', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { name: '[3,2,4], 6 → [1,2]', args: [[3, 2, 4], 6], expected: [1, 2] },
            { name: '[3,3], 6 → [0,1]', args: [[3, 3], 6], expected: [0, 1] },
          ],
          hints: [
            'Заведи объект seen: значение → индекс.',
            'Для каждого i проверь, есть ли (target - nums[i]) в seen.',
          ],
          solution:
            'function twoSum(nums, target) {\n  const seen = {}\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i]\n    if (need in seen) return [seen[need], i]\n    seen[nums[i]] = i\n  }\n  return []\n}',
        },
      ],
    },
    {
      id: 'l4-js-trivia',
      title: 'JS на собеседовании',
      subtitle: 'Каверзные вопросы',
      xp: 55,
      icon: '🧠',
      steps: [
        {
          kind: 'theory',
          title: 'Что любят спрашивать',
          blocks: [
            {
              type: 'text',
              md: 'Джунов часто гоняют по «странностям» JavaScript: приведение типов, `typeof`, области видимости, замыкания. Разберём классику.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт `typeof null`?',
          options: ["'null'", "'object'", "'undefined'", "'number'"],
          answer: 1,
          explanation: 'Историческая особенность JS: `typeof null` возвращает «object».',
        },
        {
          kind: 'quiz',
          question: "Чему равно `'2' + 2` в JavaScript?",
          options: ['4', "'22'", 'NaN', 'ошибка'],
          answer: 1,
          explanation: 'Плюс со строкой склеивает: число 2 приводится к строке → «22».',
        },
        {
          kind: 'quiz',
          question: 'Что такое замыкание (closure)?',
          options: [
            'функция, которая помнит переменные из области, где была создана',
            'способ закрыть вкладку',
            'цикл без условия выхода',
            'тип данных',
          ],
          answer: 0,
          explanation: 'Замыкание — функция вместе с сохранённым доступом к внешним переменным.',
        },
        {
          kind: 'quiz',
          question: 'Чем `let` отличается от `var`?',
          options: [
            'ничем',
            '`let` имеет блочную область видимости, `var` — функциональную',
            '`var` нельзя переприсвоить',
            '`let` работает только в циклах',
          ],
          answer: 1,
          explanation: '`let`/`const` живут в пределах блока `{}`, `var` — в пределах функции.',
        },
      ],
    },
    {
      id: 'l4b-web',
      title: 'Веб на собеседовании',
      subtitle: 'HTTP, хранение, CORS',
      xp: 55,
      icon: '🕸️',
      steps: [
        {
          kind: 'theory',
          title: 'Вопросы «про веб вообще»',
          blocks: [
            {
              type: 'text',
              md: 'Кроме JS, джуна спрашивают про устройство веба:\n\n- Что происходит после ввода URL (DNS → запрос → HTML → рендер)\n- `cookie` vs `localStorage`: cookie летят на сервер с каждым запросом, localStorage живёт только в браузере\n- **CORS**: браузер блокирует запросы к чужому домену, пока сервер явно не разрешит их заголовками',
            },
            {
              type: 'code',
              lang: 'js',
              code: "localStorage.setItem('theme', 'dark')\nlocalStorage.getItem('theme')  // 'dark'\ndocument.cookie                // 'session=abc'",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Отвечай структурно: «есть два механизма, разница в X, использую Y, потому что Z». Это ценят больше заученных определений.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Чем cookie отличается от localStorage?',
          options: [
            'ничем',
            'cookie автоматически отправляются на сервер с каждым запросом',
            'localStorage быстрее в 10 раз',
            'cookie может хранить больше данных',
          ],
          answer: 1,
          explanation: 'Cookie участвуют в HTTP-запросах (потому там сессии), localStorage — чисто клиентское хранилище.',
        },
        {
          kind: 'quiz',
          question: 'Браузер заблокировал запрос фронтенда к API на другом домене. Это...',
          options: ['DDoS-защита', 'CORS-политика', 'ошибка 500', 'проблема DNS'],
          answer: 1,
          explanation: 'Cross-Origin Resource Sharing: сервер должен разрешить чужой origin заголовком Access-Control-Allow-Origin.',
        },
        {
          kind: 'quiz',
          question: 'GET-запрос должен...',
          options: [
            'изменять данные на сервере',
            'только читать данные, без побочных эффектов',
            'всегда требовать тело запроса',
            'использоваться для логина',
          ],
          answer: 1,
          explanation: 'GET — безопасный и идемпотентный: только чтение. Изменения — POST/PUT/DELETE.',
        },
      ],
    },
    {
      id: 'l5-offer',
      title: 'Собеседование и оффер',
      subtitle: 'Soft skills и резюме',
      xp: 60,
      icon: '🤝',
      steps: [
        {
          kind: 'theory',
          title: 'Как пройти собеседование джуна',
          blocks: [
            {
              type: 'text',
              md: 'Технику ты уже знаешь. Теперь — как подать себя. Собеседование джуна обычно состоит из трёх частей: рассказ о себе, технические вопросы и твои вопросы работодателю.',
            },
            {
              type: 'text',
              md: '**Рассказ о себе (2 минуты):** кто ты, что учил, какие проекты сделал, чего хочешь. Не читай резюме вслух — расскажи историю.',
            },
            {
              type: 'text',
              md: '**Про проект:** какую задачу решал, какой стек выбрал и **почему**, с какой сложностью столкнулся и как её преодолел. Именно проекты из этого курса — твоё портфолио.',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Не знаешь ответ — не молчи и не выдумывай. Скажи, как бы ты стал искать решение. Честность и умение гуглить ценят больше, чем зубрёжку.',
            },
            {
              type: 'text',
              md: '**Резюме джуна:** контакты, короткое «обо мне», стек (HTML/CSS/JS/TS, Vue/React, Node, SQL, Git), 2–3 проекта со ссылками на GitHub. Одна страница.',
            },
            {
              type: 'text',
              md: '**Твои вопросы работодателю:** про задачи, про команду, про наставничество и рост. Это показывает заинтересованность.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Ты не знаешь ответ на технический вопрос. Лучшая стратегия?',
          options: [
            'молча сидеть',
            'выдумать правдоподобный ответ',
            'честно сказать и объяснить, как стал бы искать решение',
            'сменить тему',
          ],
          answer: 2,
          explanation: 'Честность + умение рассуждать и искать информацию ценятся выше зазубренных фактов.',
        },
        {
          kind: 'quiz',
          question: 'Что обязательно должно быть в резюме джуна?',
          options: [
            'только образование',
            'стек технологий и 2–3 проекта со ссылками',
            'список любимых игр',
            'ожидаемая зарплата крупным шрифтом',
          ],
          answer: 1,
          explanation: 'Работодатель хочет видеть твой стек и реальные проекты, которые можно открыть.',
        },
        {
          kind: 'quiz',
          question: 'Зачем задавать вопросы работодателю в конце собеседования?',
          options: [
            'чтобы затянуть время',
            'это не нужно',
            'показать заинтересованность и понять, подходит ли тебе команда',
            'чтобы показаться умнее интервьюера',
          ],
          answer: 2,
          explanation: 'Вопросы про задачи, команду и рост показывают вовлечённость и помогают выбрать место.',
        },
      ],
    },
  ],
}
