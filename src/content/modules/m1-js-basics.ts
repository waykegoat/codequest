import type { Module } from '../types'

export const m1JsBasics: Module = {
  id: 'js-basics',
  title: 'Основы JavaScript',
  description:
    'С абсолютного нуля: вывод, переменные, типы, условия, циклы — и только потом функции, массивы и объекты.',
  color: '#f7df1e',
  icon: '🟡',
  lessons: [
    {
      id: 'l0-reading',
      title: 'Что такое код',
      subtitle: 'Учимся читать программы',
      xp: 20,
      icon: '🔡',
      steps: [
        {
          kind: 'theory',
          title: 'Компьютер понимает буквально',
          blocks: [
            {
              type: 'text',
              md: 'Код — это инструкция для компьютера, записанная по строгим правилам. Эти правила называются **синтаксисом**. Компьютер не догадывается, что ты имел в виду — он выполняет ровно то, что написано, строка за строкой, сверху вниз.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "console.log('Привет')",
            },
            {
              type: 'text',
              md: 'Разберём эту строку по кусочкам:\n\n- `console` — объект «консоль» (окно вывода)\n- `.` — точка означает «возьми у него...»\n- `log` — команда «напечатай»\n- `(...)` — круглые скобки передают команде данные\n- `\'Привет\'` — кавычки говорят: это **текст**, а не код',
            },
            {
              type: 'callout',
              tone: 'warning',
              md: 'Регистр важен! `console.log` работает, а `Console.Log` — ошибка. Для компьютера это разные слова.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Зачем текст в коде берут в кавычки?',
          options: [
            'для красоты',
            'чтобы компьютер понял: это текст-данные, а не команды',
            'кавычки не обязательны',
            'чтобы текст был жирным',
          ],
          answer: 1,
          explanation: 'Без кавычек компьютер попытается выполнить слово как команду и упадёт с ошибкой.',
        },
        {
          kind: 'quiz',
          question: 'Что случится, если написать `Console.log(\'Привет\')` с большой буквы?',
          options: [
            'сработает как обычно',
            'ошибка: компьютер не знает слова Console',
            'напечатает ПРИВЕТ заглавными',
            'ничего не выведет, но не упадёт',
          ],
          answer: 1,
          explanation: 'JS различает регистр: объект называется console, с маленькой буквы.',
        },
        {
          kind: 'theory',
          title: 'Ошибки — твои друзья',
          blocks: [
            {
              type: 'text',
              md: 'Ошибка — не провал, а подсказка. Компьютер сообщает, **что** не так и **где**. Частые ошибки новичка:\n\n- `SyntaxError` — нарушены правила записи (забыл кавычку или скобку)\n- `ReferenceError: X is not defined` — использовал слово, которое компьютер не знает (опечатка или забыл кавычки)',
            },
            {
              type: 'code',
              lang: 'js',
              code: "console.log(Привет)\n// ReferenceError: Привет is not defined\n// компьютер ищет команду «Привет», а это был текст — нужны кавычки",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Увидел ошибку — не паникуй. Прочитай сообщение, найди строку, проверь кавычки, скобки и регистр. 90% ошибок новичка именно там.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Программа упала с ошибкой «Privet is not defined». Что это значит скорее всего?',
          options: [
            'сломался компьютер',
            'слово Privet написано без кавычек, и компьютер ищет такую команду',
            'нужно перезапустить браузер',
            'программа слишком длинная',
          ],
          answer: 1,
          explanation: '«Не определено» = компьютер не знает такого имени. Текст нужно взять в кавычки.',
        },
      ],
    },
    {
      id: 'l1-hello',
      title: 'Твоя первая программа',
      subtitle: 'Команды и вывод',
      xp: 25,
      icon: '👋',
      steps: [
        {
          kind: 'theory',
          title: 'Что такое программа',
          blocks: [
            {
              type: 'text',
              md: 'Программа — это список **команд**, которые компьютер выполняет по порядку: сверху вниз, строка за строкой.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "console.log('Привет!')\nconsole.log('Я — твоя первая программа')",
            },
            {
              type: 'text',
              md: 'Команда `console.log(...)` печатает то, что стоит в скобках, в **консоль** — специальное окно вывода. Текст берём в кавычки: `\'вот так\'`.',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Здесь не нужно ничего устанавливать: жми «Запустить» — и увидишь вывод своей программы прямо под редактором.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какая команда печатает текст в консоль?',
          options: ['print()', 'console.log()', 'echo()', 'show()'],
          answer: 1,
          explanation: 'В JavaScript за вывод отвечает `console.log(...)`.',
        },
        {
          kind: 'code',
          title: 'Поздоровайся с Байтом',
          lang: 'js',
          prompt:
            'Программа уже печатает «Привет, мир!». Поменяй текст в кавычках, чтобы она вывела `Привет, Байт!`',
          starter: "console.log('Привет, мир!')",
          expectedOutput: ['Привет, Байт!'],
          hints: ['Меняй только текст между кавычками.'],
          solution: "console.log('Привет, Байт!')",
        },
        {
          kind: 'code',
          title: 'Три строки подряд',
          lang: 'js',
          prompt:
            'Команды выполняются по порядку. Напиши программу из трёх команд, которая выведет три строки: `Я`, потом `учусь`, потом `кодить`.',
          starter: "console.log('Я')\n",
          expectedOutput: ['Я', 'учусь', 'кодить'],
          hints: [
            'Каждый console.log печатает одну строку.',
            "Добавь ещё две команды: console.log('учусь') и console.log('кодить')",
          ],
          solution: "console.log('Я')\nconsole.log('учусь')\nconsole.log('кодить')",
        },
        {
          kind: 'code',
          title: 'Почини программу',
          lang: 'js',
          prompt:
            'Эта программа падает с ошибкой `Привет is not defined` — автор забыл кавычки, и компьютер ищет команду «Привет». Почини её, чтобы она вывела `Привет`.',
          starter: 'console.log(Привет)',
          expectedOutput: ['Привет'],
          hints: [
            'Запусти и прочитай ошибку — это нормальная часть работы.',
            'Текст берётся в кавычки: console.log(\'Привет\')',
          ],
          solution: "console.log('Привет')",
        },
      ],
    },
    {
      id: 'l2-variables',
      title: 'Переменные',
      subtitle: 'Коробки для данных',
      xp: 30,
      icon: '📦',
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
              code: "let city = 'Москва'\nconst pi = 3.14\nconsole.log(city)",
            },
            {
              type: 'text',
              md: '`let` создаёт переменную, которую можно менять. `const` — постоянную, её переприсвоить нельзя. По умолчанию бери `const` — так меньше ошибок.',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Имя переменной пишется без кавычек. `console.log(city)` напечатает содержимое коробки, а `console.log(\'city\')` — просто слово «city».',
            },
            {
              type: 'text',
              md: '**Правила имён:**\n\n- латинские буквы и цифры: `score`, `user2`\n- не может начинаться с цифры: ~~`2cool`~~\n- без пробелов и дефисов: ~~`user name`~~\n- несколько слов склеивают «верблюдом»: `userName`, `totalPrice`',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какое имя переменной написано ПРАВИЛЬНО?',
          options: ['user name', '2players', 'userName', 'user-name'],
          answer: 2,
          explanation: 'camelCase без пробелов и дефисов, не начинается с цифры — userName.',
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
          title: 'Привет из переменной',
          lang: 'js',
          prompt:
            'Переменная `name` уже создана. Склей приветствие через `+` и выведи `Привет, Байт!` — не пиши имя в тексте руками, используй переменную.',
          starter: "const name = 'Байт'\n",
          expectedOutput: ['Привет, Байт!'],
          mustUse: ['name'],
          hints: [
            "Строки склеиваются плюсом: 'Привет, ' + name",
            "console.log('Привет, ' + name + '!')",
          ],
          solution: "const name = 'Байт'\nconsole.log('Привет, ' + name + '!')",
        },
        {
          kind: 'code',
          title: 'Измени значение',
          lang: 'js',
          prompt:
            'Счёт игры хранится в `score`. Увеличь его на 5 (запиши в переменную новое значение) и выведи результат — должно получиться `15`.',
          starter: 'let score = 10\n',
          expectedOutput: ['15'],
          mustUse: ['score'],
          hints: ['Новое значение: score = score + 5', 'Потом console.log(score)'],
          solution: 'let score = 10\nscore = score + 5\nconsole.log(score)',
        },
        {
          kind: 'code',
          title: 'Собери фразу из коробок',
          lang: 'js',
          prompt:
            'Даны две переменные. Склей из них фразу `кот говорит мяу` (не забудь пробелы в кавычках) и выведи её.',
          starter: "const animal = 'кот'\nconst sound = 'мяу'\n",
          expectedOutput: ['кот говорит мяу'],
          mustUse: ['animal', 'sound'],
          hints: ["Пробелы — часть текста: animal + ' говорит ' + sound"],
          solution:
            "const animal = 'кот'\nconst sound = 'мяу'\nconsole.log(animal + ' говорит ' + sound)",
        },
      ],
    },
    {
      id: 'l3-types',
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
            {
              type: 'text',
              md: 'Типы можно **преобразовывать**:\n\n- `Number(\'5\')` → число `5`\n- `String(5)` → строка `\'5\'`\n\nЭто спасает, когда число пришло в виде текста (например, из поля ввода).',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какой тип у значения `true`?',
          options: ['string', 'number', 'boolean', 'undefined'],
          answer: 2,
          explanation: 'true и false — логический тип boolean.',
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
          title: 'Определи типы',
          lang: 'js',
          prompt:
            'Первая команда уже выводит тип числа. Добавь ещё две: выведи тип строки `\'привет\'` и тип значения `true`.',
          starter: 'console.log(typeof 42)\n',
          expectedOutput: ['number', 'string', 'boolean'],
          mustUse: ['typeof'],
          hints: ["console.log(typeof 'привет')", 'console.log(typeof true)'],
          solution: "console.log(typeof 42)\nconsole.log(typeof 'привет')\nconsole.log(typeof true)",
        },
        {
          kind: 'code',
          title: 'Текст в число',
          lang: 'js',
          prompt:
            'В переменной `text` число «застряло» в строке. Преврати его в настоящее число через `Number(...)`, прибавь 5 и выведи результат — должно получиться `10`, а не `55`.',
          starter: "const text = '5'\n",
          expectedOutput: ['10'],
          mustUse: ['Number'],
          hints: ['console.log(Number(text) + 5)'],
          solution: "const text = '5'\nconsole.log(Number(text) + 5)",
        },
      ],
    },
    {
      id: 'l4-numbers',
      title: 'Числа и Math',
      subtitle: 'Арифметика и округление',
      xp: 35,
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
            {
              type: 'text',
              md: 'Порядок операций — как в математике: сначала умножение и деление, потом сложение. Скобки меняют порядок: `2 + 3 * 4` = 14, а `(2 + 3) * 4` = 20.',
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
          kind: 'quiz',
          question: 'Чему равно `2 + 3 * 4`?',
          options: ['20', '14', '24', '9'],
          answer: 1,
          explanation: 'Умножение выполняется первым: 2 + 12 = 14. Хочешь 20 — ставь скобки.',
        },
        {
          kind: 'code',
          title: 'Мини-калькулятор',
          lang: 'js',
          prompt:
            'Числа `a` и `b` уже заданы. Выведи три строки: их сумму, произведение и остаток от деления `a` на `b`.',
          starter: 'const a = 7\nconst b = 3\n',
          expectedOutput: ['10', '21', '1'],
          mustUse: ['%'],
          hints: ['Сумма: console.log(a + b)', 'Произведение: a * b, остаток: a % b'],
          solution:
            'const a = 7\nconst b = 3\nconsole.log(a + b)\nconsole.log(a * b)\nconsole.log(a % b)',
        },
        {
          kind: 'code',
          title: 'Скобки решают',
          lang: 'js',
          prompt:
            'Выведи результат выражения «два плюс три, и всё это умножить на четыре». Должно получиться `20` — без скобок выйдет 14.',
          starter: 'console.log(2 + 3 * 4)',
          expectedOutput: ['20'],
          mustUse: ['('],
          hints: ['Оберни сложение в скобки: (2 + 3) * 4'],
          solution: 'console.log((2 + 3) * 4)',
        },
        {
          kind: 'blank',
          title: 'Степень и остаток',
          prompt: 'Впиши операторы: первая строка должна вывести 8, вторая — 2.',
          lang: 'js',
          template: 'console.log(2 ___ 3)\nconsole.log(10 ___ 4)',
          blanks: [{ answer: '**' }, { answer: '%' }],
          hints: ['2 в степени 3 = 8.', 'Остаток от деления 10 на 4 равен 2.'],
        },
        {
          kind: 'code',
          title: 'Округли и выбери максимум',
          lang: 'js',
          prompt:
            'Первая команда округляет 4.7. Добавь вторую: выведи максимальное из чисел 3, 8 и 5 с помощью `Math.max`.',
          starter: 'console.log(Math.round(4.7))\n',
          expectedOutput: ['5', '8'],
          mustUse: ['Math.round', 'Math.max'],
          hints: ['console.log(Math.max(3, 8, 5))'],
          solution: 'console.log(Math.round(4.7))\nconsole.log(Math.max(3, 8, 5))',
        },
      ],
    },
    {
      id: 'l5-strings',
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
              md: 'Шаблонные строки в обратных кавычках `` `Привет, ${name}!` `` подставляют переменные прямо в текст — удобнее склеивания через `+`.',
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
          kind: 'quiz',
          question: "Что вернёт `'кот'[1]`?",
          options: ["'к'", "'о'", "'т'", 'ошибку'],
          answer: 1,
          explanation: 'Символы нумеруются с нуля: к=0, о=1, т=2.',
        },
        {
          kind: 'blank',
          title: 'Шаблонная строка',
          prompt: 'Впиши символ, который подставляет переменную в шаблонную строку.',
          lang: 'js',
          template: "const name = 'Аня'\nconsole.log(`Привет, ___{name}!`)",
          blanks: [{ answer: '$' }],
          hints: ['Подстановка выглядит так: ${переменная}'],
        },
        {
          kind: 'code',
          title: 'Исследуй слово',
          lang: 'js',
          prompt:
            'Слово уже в переменной `word`. Выведи три строки: его длину, его в ВЕРХНЕМ регистре и его первую букву.',
          starter: "const word = 'javascript'\n",
          expectedOutput: ['10', 'JAVASCRIPT', 'j'],
          mustUse: ['.length', '.toUpperCase'],
          hints: [
            'Длина: word.length, регистр: word.toUpperCase()',
            'Первая буква: word[0]',
          ],
          solution:
            "const word = 'javascript'\nconsole.log(word.length)\nconsole.log(word.toUpperCase())\nconsole.log(word[0])",
        },
        {
          kind: 'code',
          title: 'Шаблонная строка',
          lang: 'js',
          prompt:
            'Собери строку `Аня (20)` с помощью шаблонной строки в обратных кавычках — подставь обе переменные через `${...}`.',
          starter: "const name = 'Аня'\nconst age = 20\n",
          expectedOutput: ['Аня (20)'],
          mustUse: ['${'],
          hints: ['Обратные кавычки: ` `', 'console.log(`${name} (${age})`)'],
          solution: "const name = 'Аня'\nconst age = 20\nconsole.log(`${name} (${age})`)",
        },
        {
          kind: 'quiz',
          question: "Что вернёт `'программа'.includes('грамм')`?",
          options: ['true', 'false', "'грамм'", 'ошибку'],
          answer: 0,
          explanation: 'Подстрока «грамм» есть внутри слова «программа», поэтому true.',
        },
      ],
    },
    {
      id: 'l6-conditions',
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
              code: "const age = 20\nif (age >= 18) {\n  console.log('взрослый')\n} else {\n  console.log('ребёнок')\n}",
            },
            {
              type: 'text',
              md: 'Логика: `&&` (и), `||` (или), `!` (не). Несколько веток: `if ... else if ... else`.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'true && true   // true — оба условия выполнены\ntrue && false  // false — «и» требует оба\ntrue || false  // true — «или» хватает одного\n!true          // false — «не» переворачивает',
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
          kind: 'quiz',
          question: 'Чему равно `true || false`?',
          options: ['true', 'false', 'undefined', 'ошибка'],
          answer: 0,
          explanation: '«Или» истинно, если истинно хотя бы одно из условий.',
        },
        {
          kind: 'blank',
          title: 'Вход по двум условиям',
          prompt: 'На концерт пускают совершеннолетних И только с билетом. Впиши логический оператор.',
          lang: 'js',
          template: 'if (age >= 18 ___ hasTicket) {\n  console.log(\'Проходи!\')\n}',
          blanks: [{ answer: '&&' }],
          hints: ['Оба условия сразу — это «и»: &&'],
        },
        {
          kind: 'order',
          title: 'Собери проверку возраста',
          prompt: 'Расставь строки так, чтобы программа вывела «взрослый» для 18+ и «ребёнок» иначе.',
          lang: 'js',
          lines: [
            'const age = 20',
            'if (age >= 18) {',
            "  console.log('взрослый')",
            '} else {',
            "  console.log('ребёнок')",
            '}',
          ],
          hints: ['Сначала данные, потом проверка, потом обе ветки.'],
        },
        {
          kind: 'code',
          title: 'Взрослый или ребёнок',
          lang: 'js',
          prompt:
            'Возраст задан в `age`. Напиши условие: если `age` больше или равен 18 — выведи `взрослый`, иначе — `ребёнок`.',
          starter: 'const age = 15\n',
          expectedOutput: ['ребёнок'],
          mustUse: ['if', 'else'],
          hints: ['if (age >= 18) { ... } else { ... }'],
          solution:
            "const age = 15\nif (age >= 18) {\n  console.log('взрослый')\n} else {\n  console.log('ребёнок')\n}",
        },
        {
          kind: 'code',
          title: 'Прогноз погоды',
          lang: 'js',
          prompt:
            'Температура в `temp`. Выведи `жарко`, если больше 25; `тепло`, если больше 10; иначе `холодно`. Три ветки: `if / else if / else`.',
          starter: 'const temp = 30\n',
          expectedOutput: ['жарко'],
          mustUse: ['if', 'else'],
          hints: [
            'Первая ветка: if (temp > 25) { ... }',
            "else if (temp > 10) { console.log('тепло') } else { console.log('холодно') }",
          ],
          solution:
            "const temp = 30\nif (temp > 25) {\n  console.log('жарко')\n} else if (temp > 10) {\n  console.log('тепло')\n} else {\n  console.log('холодно')\n}",
        },
      ],
    },
    {
      id: 'l7-loops',
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
              code: "for (let i = 1; i <= 3; i++) {\n  console.log(i)\n}\n// выведет 1, 2, 3",
            },
            {
              type: 'callout',
              tone: 'info',
              md: '`i++` увеличивает `i` на единицу. Забудешь шаг — получишь **бесконечный цикл** (мы прервём его по таймауту).',
            },
            {
              type: 'text',
              md: 'Есть и цикл `while` — «повторяй, пока условие истинно». Его берут, когда число повторений заранее неизвестно.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'let hp = 10\nwhile (hp > 0) {\n  hp = hp - 3\n}',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Когда `while` уместнее, чем `for`?',
          options: [
            'когда повторений ровно 10',
            'когда заранее неизвестно, сколько раз повторять',
            'while всегда лучше',
            'когда нужен счётчик i',
          ],
          answer: 1,
          explanation: 'for — про известное число шагов, while — про «повторяй, пока не готово».',
        },
        {
          kind: 'quiz',
          question: 'Сколько раз выполнится тело `for (let i = 0; i < 5; i++)`?',
          options: ['4', '5', '6', 'бесконечно'],
          answer: 1,
          explanation: 'i принимает значения 0,1,2,3,4 — это 5 итераций.',
        },
        {
          kind: 'blank',
          title: 'Настрой цикл',
          prompt: 'Впиши недостающие части, чтобы программа вывела 0, 1, 2.',
          lang: 'js',
          template: 'for (let i = 0; i ___ 3; i___) {\n  console.log(i)\n}',
          blanks: [{ answer: '<' }, { answer: '++' }],
          hints: ['Продолжаем, пока i меньше 3.', 'Шаг: i++'],
        },
        {
          kind: 'code',
          title: 'Считаем до пяти',
          lang: 'js',
          prompt: 'Допиши тело цикла, чтобы программа вывела числа от 1 до 5 — каждое с новой строки.',
          starter: 'for (let i = 1; i <= 5; i++) {\n  \n}',
          expectedOutput: ['1', '2', '3', '4', '5'],
          mustUse: ['for'],
          hints: ['Внутри цикла печатай i: console.log(i)'],
          solution: 'for (let i = 1; i <= 5; i++) {\n  console.log(i)\n}',
        },
        {
          kind: 'code',
          title: 'Сумма чисел',
          lang: 'js',
          prompt:
            'Посчитай сумму чисел от 1 до 10 с помощью цикла и переменной-копилки `total`, затем выведи её. Должно получиться `55`.',
          starter: 'let total = 0\n',
          expectedOutput: ['55'],
          mustUse: ['for', 'total'],
          hints: [
            'for (let i = 1; i <= 10; i++) { total += i }',
            'После цикла: console.log(total)',
          ],
          solution:
            'let total = 0\nfor (let i = 1; i <= 10; i++) {\n  total += i\n}\nconsole.log(total)',
        },
        {
          kind: 'code',
          title: 'Обратный отсчёт',
          lang: 'js',
          prompt:
            'Запусти ракету: выведи `3`, `2`, `1` и затем `Старт!`. Цикл может идти и вниз — уменьшай счётчик через `i--`.',
          starter: '',
          expectedOutput: ['3', '2', '1', 'Старт!'],
          mustUse: ['for'],
          hints: [
            'for (let i = 3; i >= 1; i--) { console.log(i) }',
            "После цикла: console.log('Старт!')",
          ],
          solution: "for (let i = 3; i >= 1; i--) {\n  console.log(i)\n}\nconsole.log('Старт!')",
        },
      ],
    },
    {
      id: 'l8-functions',
      title: 'Функции',
      subtitle: 'Код, который можно вызывать',
      xp: 55,
      icon: '🧰',
      steps: [
        {
          kind: 'theory',
          title: 'Зачем нужны функции',
          blocks: [
            {
              type: 'text',
              md: 'Функция — это **именованный кусок программы**, который можно запускать сколько угодно раз. Написал один раз — вызывай где нужно.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "function greet(name) {\n  return 'Привет, ' + name + '!'\n}\n\nconsole.log(greet('Аня'))\nconsole.log(greet('Мир'))",
            },
            {
              type: 'text',
              md: 'Разбор по частям:\n\n- `function greet(name)` — объявление: имя функции и **параметр** (входные данные)\n- `return` — функция **возвращает** результат тому, кто её вызвал\n- `greet(\'Аня\')` — **вызов**: параметр name получает значение «Аня»',
            },
            {
              type: 'callout',
              tone: 'warning',
              md: 'Объявленная функция сама по себе ничего не делает — она ждёт, пока её **вызовут**. `return` отдаёт значение, а `console.log` только печатает.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает `return` внутри функции?',
          options: [
            'печатает значение в консоль',
            'возвращает значение и завершает функцию',
            'повторяет функцию заново',
            'удаляет функцию',
          ],
          answer: 1,
          explanation: 'return отдаёт результат наружу и сразу завершает выполнение функции.',
        },
        {
          kind: 'quiz',
          question: 'Программа объявляет функцию, но нигде её не вызывает. Что выведется?',
          options: [
            'результат функции',
            'ничего — объявление само по себе не выполняется',
            'ошибка',
            'undefined',
          ],
          answer: 1,
          explanation: 'Функция — как рецепт: пока не «приготовишь» (не вызовешь), ничего не произойдёт.',
        },
        {
          kind: 'code',
          title: 'Вызови функцию',
          lang: 'js',
          prompt:
            'Функция `double` уже написана — она удваивает число. Вызови её для чисел 5 и 8 и выведи оба результата.',
          starter: 'function double(n) {\n  return n * 2\n}\n',
          expectedOutput: ['10', '16'],
          mustUse: ['double('],
          hints: ['console.log(double(5))', 'И ещё раз для 8.'],
          solution:
            'function double(n) {\n  return n * 2\n}\nconsole.log(double(5))\nconsole.log(double(8))',
        },
        {
          kind: 'blank',
          title: 'Дострой функцию',
          prompt: 'Впиши недостающие слова: функция должна принимать имя и возвращать приветствие.',
          lang: 'js',
          template: '___ hello(name) {\n  ___ `Привет, ${name}!`\n}',
          blanks: [{ answer: 'function' }, { answer: 'return' }],
          hints: ['Объявление начинается со слова function.', 'Результат отдаёт return.'],
        },
        {
          kind: 'code',
          title: 'Первая своя функция',
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
        {
          kind: 'order',
          title: 'Собери функцию-проверку',
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
          kind: 'quiz',
          question: 'Чем `return x` отличается от `console.log(x)`?',
          options: [
            'ничем, это синонимы',
            'return отдаёт значение из функции, log только печатает',
            'console.log работает быстрее',
            'return можно писать только один раз в программе',
          ],
          answer: 1,
          explanation:
            'return передаёт результат дальше в программу, а console.log лишь показывает значение человеку.',
        },
        {
          kind: 'code',
          title: 'Чётное число?',
          lang: 'js',
          prompt:
            'Напиши функцию `isEven(n)`, возвращающую `true`, если число чётное, и `false` иначе. Чётное — делится на 2 без остатка.',
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
      id: 'l9-arrays',
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
          kind: 'blank',
          title: 'Индекс последнего',
          prompt: 'Массив из 3 элементов имеет индексы 0, 1, 2. Впиши свойство, чтобы получить последний элемент любого массива.',
          lang: 'js',
          template: 'const arr = [10, 20, 30]\nconst last = arr[arr.___ - 1]\nconsole.log(last)',
          blanks: [{ answer: 'length' }],
          hints: ['Длина массива минус один — индекс последнего элемента.'],
        },
        {
          kind: 'code',
          title: 'Пополни корзину',
          lang: 'js',
          prompt:
            'В корзине два фрукта. Добавь `киви` через `push`, затем выведи две строки: количество фруктов и весь список через `join(\', \')`.',
          starter: "const fruits = ['яблоко', 'банан']\n",
          expectedOutput: ['3', 'яблоко, банан, киви'],
          mustUse: ['push'],
          hints: ["fruits.push('киви')", "console.log(fruits.length) и console.log(fruits.join(', '))"],
          solution:
            "const fruits = ['яблоко', 'банан']\nfruits.push('киви')\nconsole.log(fruits.length)\nconsole.log(fruits.join(', '))",
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
        {
          kind: 'code',
          title: 'Считаем чётные',
          lang: 'js',
          prompt:
            'Напиши функцию `countEven(arr)`, возвращающую количество чётных чисел в массиве. Пригодятся цикл и условие.',
          entry: 'countEven',
          starter: 'function countEven(arr) {\n  \n}',
          tests: [
            { name: 'countEven([1,2,3,4]) → 2', args: [[1, 2, 3, 4]], expected: 2 },
            { name: 'countEven([1,3,5]) → 0', args: [[1, 3, 5]], expected: 0 },
            { name: 'countEven([2,4,6]) → 3', args: [[2, 4, 6]], expected: 3 },
            { name: 'countEven([]) → 0', args: [[]], expected: 0 },
          ],
          hints: [
            'Заведи счётчик, пройди циклом for..of.',
            'if (n % 2 === 0) count++',
          ],
          solution:
            'function countEven(arr) {\n  let count = 0\n  for (const n of arr) {\n    if (n % 2 === 0) count++\n  }\n  return count\n}',
        },
      ],
    },
    {
      id: 'l10-objects',
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
          title: 'Прокачай игрока',
          lang: 'js',
          prompt:
            'Игрок повысил уровень! Увеличь `player.level` на 1 и выведи строку `Байт: 2` (имя, двоеточие с пробелом, новый уровень).',
          starter: "const player = { name: 'Байт', level: 1 }\n",
          expectedOutput: ['Байт: 2'],
          mustUse: ['level'],
          hints: [
            'player.level = player.level + 1',
            "console.log(player.name + ': ' + player.level)",
          ],
          solution:
            "const player = { name: 'Байт', level: 1 }\nplayer.level = player.level + 1\nconsole.log(player.name + ': ' + player.level)",
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
      id: 'l11-functions-deep',
      title: 'Функции глубже',
      subtitle: 'Стрелки и параметры по умолчанию',
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
              md: 'Стрелочная запись `(a, b) => a * b` — короткая форма: справа от стрелки сразу возвращаемое значение.',
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
          title: 'Стрелочная функция',
          lang: 'js',
          prompt:
            'Запиши стрелочную функцию `triple`, возвращающую число, умноженное на 3.',
          entry: 'triple',
          starter: 'const triple = ',
          mustUse: ['=>'],
          tests: [
            { name: 'triple(3) → 9', args: [3], expected: 9 },
            { name: 'triple(0) → 0', args: [0], expected: 0 },
            { name: 'triple(-2) → -6', args: [-2], expected: -6 },
          ],
          hints: ['const triple = (n) => n * 3'],
          solution: 'const triple = (n) => n * 3',
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
      id: 'l12-errors',
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
          kind: 'blank',
          title: 'Каркас try/catch',
          prompt: 'Впиши ключевые слова: рискованный код — в первый блок, обработка ошибки — во второй.',
          lang: 'js',
          template: '___ {\n  console.log(data.length)\n} ___ (err) {\n  console.log(0)\n}',
          blanks: [{ answer: 'try' }, { answer: 'catch' }],
          hints: ['Сначала try, потом catch.'],
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
