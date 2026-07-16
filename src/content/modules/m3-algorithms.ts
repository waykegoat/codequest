import type { Module } from '../types'

export const m3Algorithms: Module = {
  id: 'algorithms',
  title: 'Алгоритмы: разминка',
  description: 'FizzBuzz, палиндромы, поиск — задачи, которые спрашивают на собеседованиях.',
  color: '#ff7a45',
  icon: '🧩',
  lessons: [
    {
      id: 'l0-warmup',
      title: 'Разминка',
      subtitle: 'Функции-однострочники',
      xp: 50,
      icon: '🤸',
      steps: [
        {
          kind: 'theory',
          title: 'Мышечная память',
          blocks: [
            {
              type: 'text',
              md: 'Прежде чем решать задачи с собеседований, набьём руку на коротких функциях: вход → преобразование → `return`. Это тот самый навык, который проверяют в первую очередь.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "function shout(s) {\n  return s.toUpperCase() + '!'\n}\nshout('да')  // 'ДА!'",
            },
          ],
        },
        {
          kind: 'code',
          title: 'Крик',
          lang: 'js',
          prompt:
            'Напиши функцию `shout(s)`, которая возвращает строку в ВЕРХНЕМ регистре с восклицательным знаком в конце. `shout("да")` → `"ДА!"`.',
          entry: 'shout',
          starter: 'function shout(s) {\n  \n}',
          tests: [
            { name: 'shout("да") → "ДА!"', args: ['да'], expected: 'ДА!' },
            { name: 'shout("hello") → "HELLO!"', args: ['hello'], expected: 'HELLO!' },
            { name: 'shout("") → "!"', args: [''], expected: '!' },
          ],
          hints: ['toUpperCase() переводит в верхний регистр.', "return s.toUpperCase() + '!'"],
          solution: "function shout(s) {\n  return s.toUpperCase() + '!'\n}",
        },
        {
          kind: 'code',
          title: 'Инициалы',
          lang: 'js',
          prompt:
            'Напиши функцию `initials(first, last)`, возвращающую инициалы заглавными буквами. `initials("иван", "петров")` → `"ИП"`.',
          entry: 'initials',
          starter: 'function initials(first, last) {\n  \n}',
          tests: [
            { name: 'иван петров → ИП', args: ['иван', 'петров'], expected: 'ИП' },
            { name: 'anna smith → AS', args: ['anna', 'smith'], expected: 'AS' },
          ],
          hints: ['Первый символ строки — s[0].', 'return (first[0] + last[0]).toUpperCase()'],
          solution: 'function initials(first, last) {\n  return (first[0] + last[0]).toUpperCase()\n}',
        },
        {
          kind: 'code',
          title: 'Среднее трёх',
          lang: 'js',
          prompt: 'Напиши функцию `average(a, b, c)`, возвращающую среднее арифметическое трёх чисел.',
          entry: 'average',
          starter: 'function average(a, b, c) {\n  \n}',
          tests: [
            { name: 'average(2, 4, 6) → 4', args: [2, 4, 6], expected: 4 },
            { name: 'average(10, 20, 30) → 20', args: [10, 20, 30], expected: 20 },
            { name: 'average(0, 0, 0) → 0', args: [0, 0, 0], expected: 0 },
          ],
          hints: ['Сложи три числа и раздели на 3.', 'return (a + b + c) / 3'],
          solution: 'function average(a, b, c) {\n  return (a + b + c) / 3\n}',
        },
      ],
    },
    {
      id: 'l1-fizzbuzz',
      title: 'FizzBuzz',
      subtitle: 'Классика собеседований',
      xp: 60,
      icon: '🥁',
      steps: [
        {
          kind: 'theory',
          title: 'Оператор остатка %',
          blocks: [
            {
              type: 'text',
              md: 'Оператор `%` возвращает **остаток** от деления. Он делает число делимым нацело, когда остаток равен нулю.',
            },
            {
              type: 'code',
              lang: 'js',
              code: '15 % 3  // 0  → делится на 3\n15 % 5  // 0  → делится на 5\n7 % 2   // 1  → нечётное',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'FizzBuzz: для чисел, делящихся на 3 — «Fizz», на 5 — «Buzz», на оба — «FizzBuzz». Проверяй «оба» первым!',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Чему равно `12 % 5`?',
          options: ['2', '2.4', '0', '5'],
          answer: 0,
          explanation: '12 = 5·2 + 2, остаток равен 2.',
        },
        {
          kind: 'order',
          title: 'Собери FizzBuzz',
          prompt: 'Расставь проверки в правильном порядке — от самой строгой к самой слабой.',
          lang: 'js',
          lines: [
            'function fizzbuzz(n) {',
            "  if (n % 15 === 0) return 'FizzBuzz'",
            "  if (n % 3 === 0) return 'Fizz'",
            "  if (n % 5 === 0) return 'Buzz'",
            '  return n',
            '}',
          ],
          hints: ['«Делится на оба» проверяем первым, иначе до него не дойдёт.'],
        },
        {
          kind: 'code',
          title: 'Реши FizzBuzz',
          lang: 'js',
          prompt:
            'Напиши функцию `fizzbuzz(n)`, которая возвращает: `"FizzBuzz"` если n делится на 3 и на 5; `"Fizz"` если только на 3; `"Buzz"` если только на 5; иначе само число `n`.',
          entry: 'fizzbuzz',
          starter: 'function fizzbuzz(n) {\n  \n}',
          tests: [
            { name: 'fizzbuzz(3) → "Fizz"', args: [3], expected: 'Fizz' },
            { name: 'fizzbuzz(5) → "Buzz"', args: [5], expected: 'Buzz' },
            { name: 'fizzbuzz(15) → "FizzBuzz"', args: [15], expected: 'FizzBuzz' },
            { name: 'fizzbuzz(7) → 7', args: [7], expected: 7 },
            { name: 'fizzbuzz(9) → "Fizz"', args: [9], expected: 'Fizz' },
          ],
          hints: [
            'Сначала проверь делимость на 15 (или на 3 И на 5).',
            'if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz"',
          ],
          solution:
            'function fizzbuzz(n) {\n  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz"\n  if (n % 3 === 0) return "Fizz"\n  if (n % 5 === 0) return "Buzz"\n  return n\n}',
        },
      ],
    },
    {
      id: 'l2-palindrome',
      title: 'Палиндром',
      subtitle: 'Строки и разворот',
      xp: 65,
      icon: '🔄',
      steps: [
        {
          kind: 'theory',
          title: 'Работа со строками',
          blocks: [
            {
              type: 'text',
              md: 'Строку можно превратить в массив символов, развернуть и склеить обратно — частый приём в алгоритмах.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "'abc'.split('')       // ['a','b','c']\n['a','b','c'].reverse() // ['c','b','a']\n['c','b','a'].join('')  // 'cba'",
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Палиндром — слово, которое читается одинаково в обе стороны: «шалаш», «level», «radar».',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Что вернёт `'code'.split('').reverse().join('')`?",
          options: ["'edoc'", "'code'", "['c','o','d','e']", "'code'"],
          answer: 0,
          explanation: 'Разбили на символы, развернули и склеили обратно — получилось «edoc».',
        },
        {
          kind: 'blank',
          title: 'Цепочка разворота',
          prompt: 'Впиши три метода, которые разворачивают строку.',
          lang: 'js',
          template: "const reversed = s.___('')\n  .___()\n  .___('')",
          blanks: [{ answer: 'split' }, { answer: 'reverse' }, { answer: 'join' }],
          hints: ['Разбить → развернуть → склеить.'],
        },
        {
          kind: 'code',
          title: 'Проверь палиндром',
          lang: 'js',
          prompt:
            'Напиши функцию `isPalindrome(s)`, которая возвращает `true`, если строка читается одинаково в обе стороны, и `false` иначе.',
          entry: 'isPalindrome',
          starter: 'function isPalindrome(s) {\n  \n}',
          tests: [
            { name: "isPalindrome('level') → true", args: ['level'], expected: true },
            { name: "isPalindrome('code') → false", args: ['code'], expected: false },
            { name: "isPalindrome('radar') → true", args: ['radar'], expected: true },
            { name: "isPalindrome('a') → true", args: ['a'], expected: true },
          ],
          hints: [
            'Разверни строку и сравни с оригиналом.',
            "return s === s.split('').reverse().join('')",
          ],
          solution: "function isPalindrome(s) {\n  return s === s.split('').reverse().join('')\n}",
        },
      ],
    },
    {
      id: 'l3-counters',
      title: 'Циклы-счётчики',
      subtitle: 'Факториал и подсчёты',
      xp: 65,
      icon: '🧮',
      steps: [
        {
          kind: 'theory',
          title: 'Паттерн «аккумулятор»',
          blocks: [
            {
              type: 'text',
              md: 'Половина задач на циклы решается одним приёмом: заведи переменную-копилку, обнови её на каждой итерации, верни в конце.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'let result = 1\nfor (let i = 1; i <= n; i++) {\n  result *= i\n}\nreturn result',
            },
          ],
        },
        {
          kind: 'code',
          title: 'Факториал',
          lang: 'js',
          prompt:
            'Напиши функцию `factorial(n)`, возвращающую произведение всех чисел от 1 до n. `factorial(5)` = 1·2·3·4·5 = 120. По договорённости `factorial(0)` = 1.',
          entry: 'factorial',
          starter: 'function factorial(n) {\n  \n}',
          tests: [
            { name: 'factorial(5) → 120', args: [5], expected: 120 },
            { name: 'factorial(1) → 1', args: [1], expected: 1 },
            { name: 'factorial(0) → 1', args: [0], expected: 1 },
            { name: 'factorial(6) → 720', args: [6], expected: 720 },
          ],
          hints: [
            'Заведи аккумулятор = 1 и умножай на i в цикле.',
            'for (let i = 1; i <= n; i++) result *= i',
          ],
          solution:
            'function factorial(n) {\n  let result = 1\n  for (let i = 1; i <= n; i++) {\n    result *= i\n  }\n  return result\n}',
        },
        {
          kind: 'code',
          title: 'Считаем гласные',
          lang: 'js',
          prompt:
            'Напиши функцию `countVowels(s)`, считающую английские гласные (a, e, i, o, u) в строке, без учёта регистра.',
          entry: 'countVowels',
          starter: 'function countVowels(s) {\n  \n}',
          tests: [
            { name: 'countVowels("hello") → 2', args: ['hello'], expected: 2 },
            { name: 'countVowels("xyz") → 0', args: ['xyz'], expected: 0 },
            { name: 'countVowels("AEIOU") → 5', args: ['AEIOU'], expected: 5 },
          ],
          hints: [
            'Приведи строку к нижнему регистру и пройди по символам.',
            "'aeiou'.includes(c) проверит, гласная ли c.",
          ],
          solution:
            "function countVowels(s) {\n  let count = 0\n  for (const c of s.toLowerCase()) {\n    if ('aeiou'.includes(c)) count++\n  }\n  return count\n}",
        },
      ],
    },
    {
      id: 'l4-maxmin',
      title: 'Поиск максимума',
      subtitle: 'Проход по массиву',
      xp: 65,
      icon: '🏔️',
      steps: [
        {
          kind: 'theory',
          title: 'Держи лучшего кандидата',
          blocks: [
            {
              type: 'text',
              md: 'Чтобы найти максимум без `Math.max`, запомни первый элемент как «лучшего кандидата» и сравнивай с каждым следующим. Так работает поиск максимума, минимума, самой длинной строки — чего угодно.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'let best = arr[0]\nfor (const x of arr) {\n  if (x > best) best = x\n}',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'На собеседовании часто просят решить «руками», без встроенных функций — проверяют понимание, а не память.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'С чего безопаснее начать поиск максимума массива?',
          options: ['с нуля', 'с первого элемента массива', 'с -Infinity или первого элемента', 'с последнего элемента'],
          answer: 2,
          explanation: 'Старт с 0 ломается на массивах из отрицательных чисел. Берут первый элемент или -Infinity.',
        },
        {
          kind: 'code',
          title: 'Максимум без Math.max',
          lang: 'js',
          prompt: 'Напиши функцию `findMax(arr)`, возвращающую наибольшее число массива. `Math.max` использовать нельзя — только цикл.',
          entry: 'findMax',
          starter: 'function findMax(arr) {\n  \n}',
          tests: [
            { name: 'findMax([3,7,2]) → 7', args: [[3, 7, 2]], expected: 7 },
            { name: 'findMax([-5,-1,-9]) → -1', args: [[-5, -1, -9]], expected: -1 },
            { name: 'findMax([42]) → 42', args: [[42]], expected: 42 },
          ],
          hints: ['Начни с best = arr[0].', 'if (x > best) best = x'],
          solution:
            'function findMax(arr) {\n  let best = arr[0]\n  for (const x of arr) {\n    if (x > best) best = x\n  }\n  return best\n}',
        },
        {
          kind: 'code',
          title: 'Самое длинное слово',
          lang: 'js',
          prompt: 'Напиши функцию `longestWord(words)`, возвращающую самое длинное слово массива. При равной длине — первое из них.',
          entry: 'longestWord',
          starter: 'function longestWord(words) {\n  \n}',
          tests: [
            { name: "['я','мы','код'] → 'код'", args: [['я', 'мы', 'код']], expected: 'код' },
            { name: "['aa','bb'] → 'aa'", args: [['aa', 'bb']], expected: 'aa' },
            { name: "['javascript'] → 'javascript'", args: [['javascript']], expected: 'javascript' },
          ],
          hints: ['Тот же приём: сравнивай word.length > best.length.'],
          solution:
            'function longestWord(words) {\n  let best = words[0]\n  for (const w of words) {\n    if (w.length > best.length) best = w\n  }\n  return best\n}',
        },
      ],
    },
    {
      id: 'l5-search',
      title: 'Поиск в массиве',
      subtitle: 'Линейный проход',
      xp: 70,
      icon: '🔍',
      steps: [
        {
          kind: 'theory',
          title: 'Линейный поиск',
          blocks: [
            {
              type: 'text',
              md: 'Простейший поиск — проверить элементы по очереди. Нашёл — верни индекс, дошёл до конца — верни `-1`. Именно так работает встроенный `indexOf`.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'for (let i = 0; i < arr.length; i++) {\n  if (arr[i] === target) return i\n}\nreturn -1',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт линейный поиск, если элемента нет в массиве?',
          options: ['undefined', 'null', '-1', '0'],
          answer: 2,
          explanation: 'По соглашению «не найдено» — это -1: индексы начинаются с 0, и 0 занят.',
        },
        {
          kind: 'code',
          title: 'Свой indexOf',
          lang: 'js',
          prompt: 'Напиши функцию `findIndex(arr, target)`, возвращающую индекс первого вхождения `target` или `-1`, если его нет. Встроенный `indexOf` не используй.',
          entry: 'findIndex',
          starter: 'function findIndex(arr, target) {\n  \n}',
          tests: [
            { name: 'findIndex([5,3,8], 3) → 1', args: [[5, 3, 8], 3], expected: 1 },
            { name: 'findIndex([5,3,8], 9) → -1', args: [[5, 3, 8], 9], expected: -1 },
            { name: 'findIndex([7,7], 7) → 0', args: [[7, 7], 7], expected: 0 },
          ],
          hints: ['Классический for с индексом.', 'После цикла return -1.'],
          solution:
            'function findIndex(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i\n  }\n  return -1\n}',
        },
        {
          kind: 'code',
          title: 'Все совпадения',
          lang: 'js',
          prompt: 'Напиши функцию `findAll(arr, target)`, возвращающую массив ВСЕХ индексов, где встречается `target`. Если нигде — пустой массив.',
          entry: 'findAll',
          starter: 'function findAll(arr, target) {\n  \n}',
          tests: [
            { name: 'findAll([1,2,1], 1) → [0,2]', args: [[1, 2, 1], 1], expected: [0, 2] },
            { name: 'findAll([1,2,3], 9) → []', args: [[1, 2, 3], 9], expected: [] },
          ],
          hints: ['Копилка — массив: result.push(i).'],
          solution:
            'function findAll(arr, target) {\n  const result = []\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) result.push(i)\n  }\n  return result\n}',
        },
      ],
    },
    {
      id: 'l6-frequency',
      title: 'Частоты',
      subtitle: 'Объект-счётчик',
      xp: 75,
      icon: '📊',
      steps: [
        {
          kind: 'theory',
          title: 'Считаем повторения',
          blocks: [
            {
              type: 'text',
              md: 'Задачи «сколько раз встречается…» решает **объект-счётчик**: ключ — элемент, значение — количество. Этот приём лежит в основе решения анаграмм, Two Sum и десятков других задач.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const counts = {}\nfor (const c of 'банан') {\n  counts[c] = (counts[c] ?? 0) + 1\n}\n// { б: 1, а: 2, н: 2 }",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: '`counts[c] ?? 0` вернёт 0, если ключа ещё нет — так счётчик стартует с нуля.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что даст `counts[c] ?? 0`, если ключа `c` в объекте нет?',
          options: ['undefined', 'ошибку', '0', 'null'],
          answer: 2,
          explanation: '`??` подставляет правое значение вместо null/undefined.',
        },
        {
          kind: 'code',
          title: 'Счётчик символов',
          lang: 'js',
          prompt: 'Напиши функцию `charCount(s)`, возвращающую объект с количеством каждого символа строки.',
          entry: 'charCount',
          starter: 'function charCount(s) {\n  \n}',
          tests: [
            { name: "charCount('aab') → {a:2,b:1}", args: ['aab'], expected: { a: 2, b: 1 } },
            { name: "charCount('') → {}", args: [''], expected: {} },
            { name: "charCount('xxx') → {x:3}", args: ['xxx'], expected: { x: 3 } },
          ],
          hints: ['for (const c of s) и counts[c] = (counts[c] ?? 0) + 1'],
          solution:
            'function charCount(s) {\n  const counts = {}\n  for (const c of s) {\n    counts[c] = (counts[c] ?? 0) + 1\n  }\n  return counts\n}',
        },
        {
          kind: 'code',
          title: 'Самый частый элемент',
          lang: 'js',
          prompt: 'Напиши функцию `mostCommon(arr)`, возвращающую элемент, который встречается чаще всех. Гарантируется один явный лидер.',
          entry: 'mostCommon',
          starter: 'function mostCommon(arr) {\n  \n}',
          tests: [
            { name: "mostCommon(['a','b','a']) → 'a'", args: [['a', 'b', 'a']], expected: 'a' },
            { name: 'mostCommon([1,2,2,3,2]) → 2', args: [[1, 2, 2, 3, 2]], expected: 2 },
          ],
          hints: [
            'Сначала собери частоты в объект.',
            'Потом пройди по массиву и держи элемент с наибольшим счётом.',
          ],
          solution:
            'function mostCommon(arr) {\n  const counts = {}\n  for (const x of arr) {\n    counts[x] = (counts[x] ?? 0) + 1\n  }\n  let best = arr[0]\n  for (const x of arr) {\n    if (counts[x] > counts[best]) best = x\n  }\n  return best\n}',
        },
      ],
    },
  ],
}
