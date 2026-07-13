import type { Module } from '../types'

export const m1JsBasics: Module = {
  id: 'js-basics',
  title: 'Основы JavaScript',
  description: 'Переменные, типы, условия, циклы и массивы — фундамент всего кода.',
  color: '#7c5cff',
  icon: '🌱',
  lessons: [
    {
      id: 'l1-hello',
      title: 'Привет, код!',
      subtitle: 'Переменные и вывод',
      xp: 40,
      icon: '👋',
      steps: [
        {
          kind: 'theory',
          title: 'Переменные — коробки для данных',
          blocks: [
            {
              type: 'text',
              md: 'Программа хранит данные в **переменных**. Представь переменную как подписанную коробку: у неё есть имя и содержимое.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "let name = 'Аня'   // можно менять\nconst pi = 3.14     // нельзя менять\nconsole.log(name)   // выведет: Аня",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Используй `const` по умолчанию, а `let` — только когда значение действительно будет меняться. Так меньше ошибок.',
            },
            {
              type: 'text',
              md: '`console.log(...)` печатает значение в консоль — это твой главный инструмент, чтобы «заглянуть внутрь» программы.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Каким ключевым словом объявить значение, которое НЕ будет меняться?',
          options: ['var', 'let', 'const', 'fix'],
          answer: 2,
          explanation: '`const` создаёт константу — её нельзя переприсвоить.',
        },
        {
          kind: 'code',
          title: 'Первая функция',
          lang: 'js',
          prompt:
            'Напиши функцию `greet(name)`, которая возвращает строку вида `Привет, Аня!` — то есть слово «Привет, » плюс переданное имя и «!».',
          entry: 'greet',
          starter:
            'function greet(name) {\n  // верни приветствие с помощью шаблонной строки\n  \n}',
          tests: [
            { name: "greet('Аня') → 'Привет, Аня!'", args: ['Аня'], expected: 'Привет, Аня!' },
            { name: "greet('Мир') → 'Привет, Мир!'", args: ['Мир'], expected: 'Привет, Мир!' },
            { name: "greet('JS') → 'Привет, JS!'", args: ['JS'], expected: 'Привет, JS!' },
          ],
          hints: [
            'Шаблонные строки пишутся в обратных кавычках: `` `Привет, ${name}!` ``',
            'Не забудь ключевое слово return.',
          ],
          solution: 'function greet(name) {\n  return `Привет, ${name}!`\n}',
        },
      ],
    },
    {
      id: 'l2-types',
      title: 'Типы данных',
      subtitle: 'Числа, строки, булевы',
      xp: 40,
      icon: '🔢',
      steps: [
        {
          kind: 'theory',
          title: 'Основные типы',
          blocks: [
            {
              type: 'text',
              md: "В JavaScript есть несколько базовых типов данных:\n\n- **number** — числа: `42`, `3.14`\n- **string** — строки (текст): `'привет'`\n- **boolean** — да/нет: `true` / `false`",
            },
            {
              type: 'code',
              lang: 'js',
              code: "typeof 42        // 'number'\ntypeof 'привет'  // 'string'\ntypeof true      // 'boolean'",
            },
            {
              type: 'callout',
              tone: 'warning',
              md: "Осторожно: `'5' + 3` даст `'53'` (склеивание строк), а `5 + 3` даст `8`. Тип имеет значение!",
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт `typeof "5"`?',
          options: ["'number'", "'string'", "'text'", "'5'"],
          answer: 1,
          explanation: 'Кавычки делают значение строкой, поэтому typeof вернёт «string».',
        },
        {
          kind: 'code',
          title: 'Сложение чисел',
          lang: 'js',
          prompt:
            'Напиши функцию `sum(a, b)`, которая возвращает **сумму** двух чисел. Убедись, что складываешь именно числа, а не строки.',
          entry: 'sum',
          starter: 'function sum(a, b) {\n  \n}',
          tests: [
            { name: 'sum(2, 3) → 5', args: [2, 3], expected: 5 },
            { name: 'sum(-4, 10) → 6', args: [-4, 10], expected: 6 },
            { name: 'sum(0, 0) → 0', args: [0, 0], expected: 0 },
          ],
          hints: ['Просто верни a + b.'],
          solution: 'function sum(a, b) {\n  return a + b\n}',
        },
      ],
    },
    {
      id: 'l3-conditions',
      title: 'Условия',
      subtitle: 'if / else и сравнения',
      xp: 45,
      icon: '🔀',
      steps: [
        {
          kind: 'theory',
          title: 'Ветвление программы',
          blocks: [
            {
              type: 'text',
              md: 'Условия позволяют программе **принимать решения**. Оператор `if` выполняет код, только если условие истинно.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const age = 20\nif (age >= 18) {\n  console.log('Взрослый')\n} else {\n  console.log('Несовершеннолетний')\n}",
            },
            {
              type: 'text',
              md: 'Операторы сравнения: `>`, `<`, `>=`, `<=`, `===` (строго равно), `!==` (не равно). **Всегда** используй `===`, а не `==`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какой оператор проверяет строгое равенство (значение И тип)?',
          options: ['=', '==', '===', '=>'],
          answer: 2,
          explanation: '`===` сравнивает без приведения типов — это правильный выбор.',
        },
        {
          kind: 'code',
          title: 'Максимум из двух',
          lang: 'js',
          prompt: 'Напиши функцию `max(a, b)`, которая возвращает бо́льшее из двух чисел.',
          entry: 'max',
          starter: 'function max(a, b) {\n  \n}',
          tests: [
            { name: 'max(3, 7) → 7', args: [3, 7], expected: 7 },
            { name: 'max(10, 2) → 10', args: [10, 2], expected: 10 },
            { name: 'max(5, 5) → 5', args: [5, 5], expected: 5 },
            { name: 'max(-1, -8) → -1', args: [-1, -8], expected: -1 },
          ],
          hints: ['Сравни a и b через if, верни большее.', 'Или используй Math.max(a, b).'],
          solution: 'function max(a, b) {\n  return a > b ? a : b\n}',
        },
      ],
    },
    {
      id: 'l4-loops',
      title: 'Циклы',
      subtitle: 'Повторяем действия',
      xp: 50,
      icon: '🔁',
      steps: [
        {
          kind: 'theory',
          title: 'Цикл for',
          blocks: [
            {
              type: 'text',
              md: 'Цикл повторяет код много раз. Самый частый — `for`. У него три части: старт, условие продолжения и шаг.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'for (let i = 1; i <= 3; i++) {\n  console.log(i)\n}\n// выведет 1, 2, 3',
            },
            {
              type: 'callout',
              tone: 'info',
              md: '`i++` увеличивает `i` на единицу на каждом шаге. Если забыть про шаг — получится **бесконечный цикл**.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Сколько раз выполнится тело цикла `for (let i = 0; i < 5; i++)`?',
          options: ['4', '5', '6', 'бесконечно'],
          answer: 1,
          explanation: 'i принимает значения 0,1,2,3,4 — это 5 итераций.',
        },
        {
          kind: 'code',
          title: 'Сумма от 1 до n',
          lang: 'js',
          prompt:
            'Напиши функцию `sumTo(n)`, которая возвращает сумму всех целых чисел от 1 до n включительно. Например, `sumTo(3)` = 1 + 2 + 3 = 6.',
          entry: 'sumTo',
          starter: 'function sumTo(n) {\n  let total = 0\n  // напиши цикл\n  return total\n}',
          tests: [
            { name: 'sumTo(3) → 6', args: [3], expected: 6 },
            { name: 'sumTo(5) → 15', args: [5], expected: 15 },
            { name: 'sumTo(1) → 1', args: [1], expected: 1 },
            { name: 'sumTo(100) → 5050', args: [100], expected: 5050 },
          ],
          hints: [
            'Заведи переменную-аккумулятор и прибавляй к ней i в цикле.',
            'for (let i = 1; i <= n; i++) total += i',
          ],
          solution:
            'function sumTo(n) {\n  let total = 0\n  for (let i = 1; i <= n; i++) {\n    total += i\n  }\n  return total\n}',
        },
      ],
    },
    {
      id: 'l5-arrays',
      title: 'Массивы',
      subtitle: 'Списки значений',
      xp: 50,
      icon: '📚',
      steps: [
        {
          kind: 'theory',
          title: 'Массивы',
          blocks: [
            {
              type: 'text',
              md: 'Массив — это упорядоченный список значений. Элементы нумеруются с **нуля**.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const fruits = ['яблоко', 'банан', 'киви']\nfruits[0]        // 'яблоко'\nfruits.length    // 3\nfruits[fruits.length - 1] // 'киви' (последний)",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Последний элемент всегда имеет индекс `length - 1`, потому что счёт идёт с нуля.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Какой индекс у элемента 'банан' в массиве ['яблоко', 'банан', 'киви']?",
          options: ['0', '1', '2', '3'],
          answer: 1,
          explanation: 'Индексация с нуля: яблоко=0, банан=1, киви=2.',
        },
        {
          kind: 'code',
          title: 'Последний элемент',
          lang: 'js',
          prompt:
            'Напиши функцию `lastElement(arr)`, которая возвращает последний элемент массива. Если массив пуст — верни `undefined`.',
          entry: 'lastElement',
          starter: 'function lastElement(arr) {\n  \n}',
          tests: [
            { name: 'lastElement([1,2,3]) → 3', args: [[1, 2, 3]], expected: 3 },
            { name: "lastElement(['a','b']) → 'b'", args: [['a', 'b']], expected: 'b' },
            { name: 'lastElement([]) → undefined', args: [[]], expected: undefined },
            { name: 'lastElement([42]) → 42', args: [[42]], expected: 42 },
          ],
          hints: [
            'Последний индекс — это arr.length - 1.',
            'Для пустого массива arr[arr.length - 1] уже вернёт undefined.',
          ],
          solution: 'function lastElement(arr) {\n  return arr[arr.length - 1]\n}',
        },
      ],
    },
  ],
}
