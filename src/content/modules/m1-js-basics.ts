import type { Module } from '../types'

export const m1JsBasics: Module = {
  id: 'js-basics',
  title: 'Основы JavaScript',
  description: 'Переменные, типы, строки, числа, условия, циклы, массивы, объекты и функции.',
  color: '#f7df1e',
  icon: '🟡',
  lessons: [
    {
      id: 'l1-hello',
      title: 'Привет, код!',
      subtitle: 'Переменные и вывод',
      xp: 30,
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
              code: "let name = 'Аня'\nconst pi = 3.14\nconsole.log(name)",
            },
            {
              type: 'text',
              md: '`let` создаёт переменную, которую можно менять. `const` — постоянную, её переприсвоить нельзя. По умолчанию бери `const` — так меньше ошибок.',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: '`console.log(...)` печатает значение — твой главный инструмент, чтобы «заглянуть внутрь» программы.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Каким словом объявить значение, которое НЕ будет меняться?',
          options: ['var', 'let', 'const', 'fix'],
          answer: 2,
          explanation: '`const` создаёт константу — её нельзя переприсвоить.',
        },
        {
          kind: 'blank',
          title: 'Объяви переменные',
          prompt: 'Впиши подходящие ключевые слова: город можно будет менять, число π — нет.',
          lang: 'js',
          template: "___ city = 'Москва'\n___ pi = 3.14\nconsole.___(city)",
          blanks: [{ answer: 'let' }, { answer: 'const' }, { answer: 'log' }],
          hints: ['Что можно менять — `let`, что постоянно — `const`.', 'Печать: console.log'],
        },
        {
          kind: 'code',
          title: 'Первая функция',
          lang: 'js',
          prompt:
            'Напиши функцию `greet(name)`, которая возвращает строку вида `Привет, Аня!` — слово «Привет, », переданное имя и «!».',
          entry: 'greet',
          starter: 'function greet(name) {\n  \n}',
          tests: [
            { name: "greet('Аня') → 'Привет, Аня!'", args: ['Аня'], expected: 'Привет, Аня!' },
            { name: "greet('Мир') → 'Привет, Мир!'", args: ['Мир'], expected: 'Привет, Мир!' },
            { name: "greet('JS') → 'Привет, JS!'", args: ['JS'], expected: 'Привет, JS!' },
          ],
          hints: [
            'Шаблонные строки — в обратных кавычках: `` `Привет, ${name}!` ``',
            'Не забудь return.',
          ],
          solution: 'function greet(name) {\n  return `Привет, ${name}!`\n}',
        },
      ],
    },
    {
      id: 'l2-types',
      title: 'Типы данных',
      subtitle: 'Числа, строки, булевы',
      xp: 30,
      icon: '🔢',
      steps: [
        {
          kind: 'theory',
          title: 'Основные типы',
          blocks: [
            {
              type: 'text',
              md: 'В JavaScript есть базовые типы:\n\n- **number** — числа: `42`, `3.14`\n- **string** — строки: `\'привет\'`\n- **boolean** — да/нет: `true` / `false`\n- **undefined** — «значения нет»',
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
          kind: 'quiz',
          question: "Чему равно `'5' + 3`?",
          options: ['8', "'53'", "'8'", 'NaN'],
          answer: 1,
          explanation: 'Плюс со строкой склеивает: получится «53».',
        },
        {
          kind: 'code',
          title: 'Сложение чисел',
          lang: 'js',
          prompt:
            'Напиши функцию `sum(a, b)`, которая возвращает **сумму** двух чисел (именно чисел, а не строк).',
          entry: 'sum',
          starter: 'function sum(a, b) {\n  \n}',
          tests: [
            { name: 'sum(2, 3) → 5', args: [2, 3], expected: 5 },
            { name: 'sum(-4, 10) → 6', args: [-4, 10], expected: 6 },
            { name: 'sum(0, 0) → 0', args: [0, 0], expected: 0 },
          ],
          hints: ['Верни a + b.'],
          solution: 'function sum(a, b) {\n  return a + b\n}',
        },
      ],
    },
    {
      id: 'l3-strings',
      title: 'Строки',
      subtitle: 'Текст и его методы',
      xp: 40,
      icon: '🔤',
      steps: [
        {
          kind: 'theory',
          title: 'Работа со строками',
          blocks: [
            {
              type: 'text',
              md: 'У строк много встроенных возможностей:\n\n- `.length` — длина\n- `.toUpperCase()` / `.toLowerCase()` — регистр\n- `.includes(x)` — содержит ли подстроку\n- `.slice(a, b)` — вырезать кусок\n- `s[0]` — символ по индексу (с нуля)',
            },
            {
              type: 'code',
              lang: 'js',
              code: "'привет'.length          // 6\n'js'.toUpperCase()       // 'JS'\n'кодер'.includes('код')  // true\n'привет'[0]              // 'п'",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Шаблонные строки `` `...${x}...` `` удобнее склеивания через `+`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Что вернёт `'hello'.length`?",
          options: ['4', '5', '6', "'hello'"],
          answer: 1,
          explanation: 'В слове «hello» пять символов.',
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
          hints: ['Первый символ строки — s[0].', "return (first[0] + last[0]).toUpperCase()"],
          solution: 'function initials(first, last) {\n  return (first[0] + last[0]).toUpperCase()\n}',
        },
      ],
    },
    {
      id: 'l4-numbers',
      title: 'Числа и Math',
      subtitle: 'Арифметика и округление',
      xp: 40,
      icon: '➗',
      steps: [
        {
          kind: 'theory',
          title: 'Числа',
          blocks: [
            {
              type: 'text',
              md: 'Операторы: `+ - * /`, остаток `%` и степень `**`. Полезные функции объекта `Math`:\n\n- `Math.round(x)` — округление\n- `Math.floor(x)` — вниз, `Math.ceil(x)` — вверх\n- `Math.max(...)` / `Math.min(...)`',
            },
            {
              type: 'code',
              lang: 'js',
              code: '7 % 3            // 1 (остаток)\n2 ** 10          // 1024\nMath.round(4.6)  // 5\nMath.max(2, 9, 4) // 9',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Чему равно `10 % 3`?',
          options: ['1', '3', '0', '3.33'],
          answer: 0,
          explanation: '10 = 3·3 + 1, остаток равен 1.',
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
        {
          kind: 'code',
          title: 'Чётное число?',
          lang: 'js',
          prompt:
            'Напиши функцию `isEven(n)`, возвращающую `true`, если число чётное, и `false` иначе. Подсказка: чётное делится на 2 без остатка.',
          entry: 'isEven',
          starter: 'function isEven(n) {\n  \n}',
          tests: [
            { name: 'isEven(4) → true', args: [4], expected: true },
            { name: 'isEven(7) → false', args: [7], expected: false },
            { name: 'isEven(0) → true', args: [0], expected: true },
          ],
          hints: ['Остаток от деления на 2 у чётных равен 0.', 'return n % 2 === 0'],
          solution: 'function isEven(n) {\n  return n % 2 === 0\n}',
        },
      ],
    },
    {
      id: 'l5-conditions',
      title: 'Условия',
      subtitle: 'if / else и логика',
      xp: 45,
      icon: '🔀',
      steps: [
        {
          kind: 'theory',
          title: 'Ветвление программы',
          blocks: [
            {
              type: 'text',
              md: 'Оператор `if` выполняет код, только если условие истинно. Сравнения: `> < >= <= === !==`. **Всегда** используй `===`, а не `==`.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "if (age >= 18) {\n  return 'взрослый'\n} else {\n  return 'ребёнок'\n}",
            },
            {
              type: 'text',
              md: 'Логика: `&&` (и), `||` (или), `!` (не). Короткая запись — тернарный оператор: `условие ? а : б`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какой оператор проверяет строгое равенство (значение И тип)?',
          options: ['=', '==', '===', '=>'],
          answer: 2,
          explanation: '`===` сравнивает без приведения типов — правильный выбор.',
        },
        {
          kind: 'order',
          title: 'Собери проверку возраста',
          prompt: 'Расставь строки так, чтобы функция возвращала «взрослый» для 18+ и «ребёнок» иначе.',
          lang: 'js',
          lines: [
            'function category(age) {',
            "  if (age >= 18) return 'взрослый'",
            "  return 'ребёнок'",
            '}',
          ],
          hints: ['Сначала объявление, потом проверка, потом ответ по умолчанию, потом скобка.'],
        },
        {
          kind: 'code',
          title: 'Знак числа',
          lang: 'js',
          prompt:
            'Напиши функцию `sign(n)`: для положительного числа верни `"плюс"`, для отрицательного `"минус"`, для нуля `"ноль"`.',
          entry: 'sign',
          starter: 'function sign(n) {\n  \n}',
          tests: [
            { name: 'sign(5) → "плюс"', args: [5], expected: 'плюс' },
            { name: 'sign(-3) → "минус"', args: [-3], expected: 'минус' },
            { name: 'sign(0) → "ноль"', args: [0], expected: 'ноль' },
          ],
          hints: ['Три ветки: n > 0, n < 0, иначе.'],
          solution:
            "function sign(n) {\n  if (n > 0) return 'плюс'\n  if (n < 0) return 'минус'\n  return 'ноль'\n}",
        },
      ],
    },
    {
      id: 'l6-loops',
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
              md: 'Цикл повторяет код много раз. У `for` три части: старт, условие продолжения и шаг.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'let total = 0\nfor (let i = 1; i <= 3; i++) {\n  total += i\n}\n// total = 6',
            },
            {
              type: 'callout',
              tone: 'info',
              md: '`i++` увеличивает `i` на единицу. Забудешь шаг — получишь **бесконечный цикл** (мы прервём его по таймауту).',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Сколько раз выполнится тело `for (let i = 0; i < 5; i++)`?',
          options: ['4', '5', '6', 'бесконечно'],
          answer: 1,
          explanation: 'i принимает значения 0,1,2,3,4 — это 5 итераций.',
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
      id: 'l7-arrays',
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
              md: 'Массив — упорядоченный список. Элементы нумеруются с **нуля**.\n\n- `arr.length` — длина\n- `arr.push(x)` — добавить в конец\n- `arr.includes(x)` — есть ли элемент\n- `arr.join(", ")` — склеить в строку',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const fruits = ['яблоко', 'банан']\nfruits[0]        // 'яблоко'\nfruits.length    // 2\nfruits.push('киви') // теперь их 3",
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Какой индекс у 'банан' в `['яблоко', 'банан', 'киви']`?",
          options: ['0', '1', '2', '3'],
          answer: 1,
          explanation: 'Индексация с нуля: яблоко=0, банан=1, киви=2.',
        },
        {
          kind: 'order',
          title: 'Собери сумму массива',
          prompt: 'Расставь строки так, чтобы функция считала сумму чисел массива.',
          lang: 'js',
          lines: [
            'function sumArray(arr) {',
            '  let total = 0',
            '  for (const n of arr) total += n',
            '  return total',
            '}',
          ],
          hints: ['Объявление → аккумулятор → цикл → возврат → скобка.'],
        },
        {
          kind: 'code',
          title: 'Последний элемент',
          lang: 'js',
          prompt:
            'Напиши функцию `lastElement(arr)`, возвращающую последний элемент массива. Для пустого — `undefined`.',
          entry: 'lastElement',
          starter: 'function lastElement(arr) {\n  \n}',
          tests: [
            { name: 'lastElement([1,2,3]) → 3', args: [[1, 2, 3]], expected: 3 },
            { name: "lastElement(['a','b']) → 'b'", args: [['a', 'b']], expected: 'b' },
            { name: 'lastElement([]) → undefined', args: [[]], expected: undefined },
          ],
          hints: ['Последний индекс — arr.length - 1.'],
          solution: 'function lastElement(arr) {\n  return arr[arr.length - 1]\n}',
        },
      ],
    },
    {
      id: 'l8-objects',
      title: 'Объекты',
      subtitle: 'Ключ — значение',
      xp: 55,
      icon: '📦',
      steps: [
        {
          kind: 'theory',
          title: 'Объекты',
          blocks: [
            {
              type: 'text',
              md: 'Объект хранит данные парами «ключ: значение». Это основа почти всего в JS (пользователи, настройки, ответы API).',
            },
            {
              type: 'code',
              lang: 'js',
              code: "const user = { name: 'Аня', age: 20 }\nuser.name          // 'Аня'\nuser['age']        // 20\nuser.city = 'Москва' // добавили поле\nObject.keys(user)  // ['name', 'age', 'city']",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'К полю обращаются через точку `user.name` или скобки `user["name"]`. Скобки нужны, когда ключ в переменной.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Как получить значение поля `age` объекта `user`?',
          options: ['user->age', 'user.age', 'user::age', 'age(user)'],
          answer: 1,
          explanation: 'Доступ к полю — через точку: `user.age` (или `user["age"]`).',
        },
        {
          kind: 'blank',
          title: 'Заполни доступ к полям',
          prompt: 'Собери приветствие из полей объекта user.',
          lang: 'js',
          template: "const user = { name: 'Лео', age: 25 }\nconst text = 'Привет, ' + user.___\nconst years = user.___",
          blanks: [{ answer: 'name' }, { answer: 'age' }],
          hints: ['Обращайся к полям через точку: user.name, user.age'],
        },
        {
          kind: 'code',
          title: 'Опиши человека',
          lang: 'js',
          prompt:
            'Дан объект `{ name, age }`. Напиши функцию `describe(person)`, возвращающую строку вида `"Аня, 20 лет"`.',
          entry: 'describe',
          starter: 'function describe(person) {\n  \n}',
          tests: [
            {
              name: '{Аня,20} → "Аня, 20 лет"',
              args: [{ name: 'Аня', age: 20 }],
              expected: 'Аня, 20 лет',
            },
            {
              name: '{Лео,7} → "Лео, 7 лет"',
              args: [{ name: 'Лео', age: 7 }],
              expected: 'Лео, 7 лет',
            },
          ],
          hints: ['Шаблонная строка: `` `${person.name}, ${person.age} лет` ``'],
          solution: 'function describe(person) {\n  return `${person.name}, ${person.age} лет`\n}',
        },
        {
          kind: 'code',
          title: 'Сколько полей',
          lang: 'js',
          prompt:
            'Напиши функцию `countKeys(obj)`, возвращающую количество полей в объекте. Подсказка: `Object.keys(obj)` даёт массив ключей.',
          entry: 'countKeys',
          starter: 'function countKeys(obj) {\n  \n}',
          tests: [
            { name: '{a:1,b:2} → 2', args: [{ a: 1, b: 2 }], expected: 2 },
            { name: '{} → 0', args: [{}], expected: 0 },
            { name: '{x:1} → 1', args: [{ x: 1 }], expected: 1 },
          ],
          hints: ['Длина массива ключей: Object.keys(obj).length'],
          solution: 'function countKeys(obj) {\n  return Object.keys(obj).length\n}',
        },
      ],
    },
    {
      id: 'l9-functions',
      title: 'Функции глубже',
      subtitle: 'Параметры и возврат',
      xp: 55,
      icon: '🧩',
      steps: [
        {
          kind: 'theory',
          title: 'Разные способы объявить функцию',
          blocks: [
            {
              type: 'text',
              md: 'Функцию можно объявить тремя способами. У параметров бывают **значения по умолчанию**.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "function add(a, b) { return a + b }\nconst mul = (a, b) => a * b\nfunction hi(name = 'друг') {\n  return 'Привет, ' + name\n}\nhi()        // 'Привет, друг'\nhi('Аня')   // 'Привет, Аня'",
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Значение по умолчанию используется, если аргумент не передан.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Что вернёт `hi()`, если `function hi(name = 'друг') { return name }`?",
          options: ["'друг'", 'undefined', 'ошибку', "''"],
          answer: 0,
          explanation: 'Аргумент не передан → берётся значение по умолчанию «друг».',
        },
        {
          kind: 'code',
          title: 'Приветствие по умолчанию',
          lang: 'js',
          prompt:
            'Напиши функцию `welcome(name)` со значением по умолчанию `"гость"`. Возвращает `"Добро пожаловать, ИМЯ"`.',
          entry: 'welcome',
          starter: "function welcome(name = 'гость') {\n  \n}",
          tests: [
            {
              name: "welcome('Аня') → 'Добро пожаловать, Аня'",
              args: ['Аня'],
              expected: 'Добро пожаловать, Аня',
            },
            {
              name: "welcome() → 'Добро пожаловать, гость'",
              args: [],
              expected: 'Добро пожаловать, гость',
            },
          ],
          hints: ['Значение по умолчанию уже в скобках. Верни шаблонную строку.'],
          solution:
            "function welcome(name = 'гость') {\n  return `Добро пожаловать, ${name}`\n}",
        },
        {
          kind: 'code',
          title: 'Скидка',
          lang: 'js',
          prompt:
            'Напиши функцию `applyDiscount(price, percent)`, возвращающую цену со скидкой. `percent` по умолчанию `10`. Формула: `price - price * percent / 100`.',
          entry: 'applyDiscount',
          starter: 'function applyDiscount(price, percent = 10) {\n  \n}',
          tests: [
            { name: 'applyDiscount(100) → 90', args: [100], expected: 90 },
            { name: 'applyDiscount(200, 25) → 150', args: [200, 25], expected: 150 },
            { name: 'applyDiscount(50, 10) → 45', args: [50, 10], expected: 45 },
          ],
          hints: ['return price - (price * percent) / 100'],
          solution:
            'function applyDiscount(price, percent = 10) {\n  return price - (price * percent) / 100\n}',
        },
      ],
    },
    {
      id: 'l10-errors',
      title: 'Обработка ошибок',
      subtitle: 'try / catch',
      xp: 55,
      icon: '🛟',
      steps: [
        {
          kind: 'theory',
          title: 'Когда что-то идёт не так',
          blocks: [
            {
              type: 'text',
              md: 'Некоторые операции могут «упасть» с ошибкой. `try / catch` перехватывает ошибку и позволяет вернуть запасной результат вместо аварийной остановки.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "try {\n  const data = JSON.parse(text)\n  return data\n} catch (err) {\n  return null\n}",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Обращение к свойству у `null`/`undefined` бросает ошибку — частая причина падений.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что выполнится, если в блоке `try` произошла ошибка?',
          options: ['ничего', 'блок catch', 'программа падает', 'блок try повторяется'],
          answer: 1,
          explanation: 'Управление переходит в `catch`, где можно обработать ошибку.',
        },
        {
          kind: 'code',
          title: 'Безопасная длина',
          lang: 'js',
          prompt:
            'Напиши функцию `safeLength(x)`, возвращающую `x.length`. Если `x` — `null`/`undefined` (обращение упадёт), верни `0` через try/catch.',
          entry: 'safeLength',
          starter: 'function safeLength(x) {\n  \n}',
          tests: [
            { name: "safeLength('abc') → 3", args: ['abc'], expected: 3 },
            { name: 'safeLength([1,2]) → 2', args: [[1, 2]], expected: 2 },
            { name: 'safeLength(null) → 0', args: [null], expected: 0 },
          ],
          hints: ['В try верни x.length, в catch верни 0.'],
          solution:
            'function safeLength(x) {\n  try {\n    return x.length\n  } catch (err) {\n    return 0\n  }\n}',
        },
        {
          kind: 'code',
          title: 'Безопасное деление',
          lang: 'js',
          prompt:
            'Напиши функцию `safeDivide(a, b)`, возвращающую `a / b`. Если `b === 0`, верни `null` (делить на ноль бессмысленно).',
          entry: 'safeDivide',
          starter: 'function safeDivide(a, b) {\n  \n}',
          tests: [
            { name: 'safeDivide(10, 2) → 5', args: [10, 2], expected: 5 },
            { name: 'safeDivide(5, 0) → null', args: [5, 0], expected: null },
            { name: 'safeDivide(9, 3) → 3', args: [9, 3], expected: 3 },
          ],
          hints: ['Сначала проверь b === 0 и верни null, иначе верни a / b.'],
          solution: 'function safeDivide(a, b) {\n  if (b === 0) return null\n  return a / b\n}',
        },
      ],
    },
  ],
}
