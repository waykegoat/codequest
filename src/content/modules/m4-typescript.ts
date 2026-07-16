import type { Module } from '../types'

export const m4TypeScript: Module = {
  id: 'typescript',
  title: 'TypeScript',
  description: 'Типобезопасность: аннотации, интерфейсы, объединения и дженерики.',
  color: '#3b82f6',
  icon: '🛡️',
  lessons: [
    {
      id: 'l1-intro',
      title: 'Зачем нужны типы',
      subtitle: 'Введение в TypeScript',
      xp: 40,
      icon: '🛡️',
      steps: [
        {
          kind: 'theory',
          title: 'TypeScript = JavaScript + типы',
          blocks: [
            {
              type: 'text',
              md: 'TypeScript добавляет к JavaScript **статические типы**. Ошибки видны ещё до запуска — прямо в редакторе.',
            },
            {
              type: 'code',
              lang: 'ts',
              code: 'function greet(name: string): string {\n  return `Привет, ${name}!`\n}\n\ngreet(42) // ❌ ошибка: ожидалась строка',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Именно этот стек — Vue + TypeScript — используется в самом приложении CodeQuest, которое ты сейчас проходишь.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что добавляет TypeScript к JavaScript?',
          options: ['новый синтаксис циклов', 'статическую типизацию', 'базу данных', 'сервер'],
          answer: 1,
          explanation: 'Главное преимущество — статические типы, которые ловят ошибки заранее.',
        },
        {
          kind: 'blank',
          title: 'Первые аннотации',
          prompt: 'Впиши типы: возраст — число, имя — строка.',
          lang: 'ts',
          template: "let age: ___ = 25\nlet name: ___ = 'Аня'",
          blanks: [{ answer: 'number' }, { answer: 'string' }],
          hints: ['Типы пишутся с маленькой буквы: number, string.'],
        },
      ],
    },
    {
      id: 'l2-annotations',
      title: 'Аннотации типов',
      subtitle: 'string, number, boolean, массивы',
      xp: 45,
      icon: '🏷️',
      steps: [
        {
          kind: 'theory',
          title: 'Как аннотировать типы',
          blocks: [
            {
              type: 'text',
              md: 'Тип указывается через двоеточие после имени. Так подписываются переменные, параметры и возвращаемое значение.',
            },
            {
              type: 'code',
              lang: 'ts',
              code: 'let age: number = 25\nlet name: string = "Аня"\nlet active: boolean = true\nlet scores: number[] = [10, 20, 30]',
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Часто тип можно **не** писать — TypeScript выведет его сам (inference). `let x = 5` уже имеет тип `number`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Как аннотировать массив чисел?',
          options: ['array<number>', 'number[]', 'list(number)', 'numbers'],
          answer: 1,
          explanation: '`number[]` — массив чисел. Ещё есть форма `Array<number>`.',
        },
        {
          kind: 'code',
          title: 'Проверка типа во время выполнения',
          lang: 'js',
          prompt:
            'Типы TS исчезают при компиляции — во время выполнения тип проверяют через `typeof`. Напиши функцию `typeName(value)`, которая возвращает строку `typeof value` (например `"number"`, `"string"`, `"boolean"`).',
          entry: 'typeName',
          starter: 'function typeName(value) {\n  \n}',
          tests: [
            { name: 'typeName(42) → "number"', args: [42], expected: 'number' },
            { name: 'typeName("hi") → "string"', args: ['hi'], expected: 'string' },
            { name: 'typeName(true) → "boolean"', args: [true], expected: 'boolean' },
          ],
          hints: ['Оператор typeof возвращает строку с названием типа.', 'return typeof value'],
          solution: 'function typeName(value) {\n  return typeof value\n}',
        },
      ],
    },
    {
      id: 'l3-interfaces',
      title: 'Интерфейсы',
      subtitle: 'Описываем форму объекта',
      xp: 50,
      icon: '📐',
      steps: [
        {
          kind: 'theory',
          title: 'Форма объекта',
          blocks: [
            {
              type: 'text',
              md: '**Интерфейс** описывает, какие поля и каких типов есть у объекта. Это контракт, который проверяет компилятор.',
            },
            {
              type: 'code',
              lang: 'ts',
              code: 'interface User {\n  firstName: string\n  lastName: string\n  age?: number // необязательное поле\n}\n\nfunction fullName(u: User): string {\n  return u.firstName + " " + u.lastName\n}',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Знак `?` делает поле необязательным. Без него поле обязано присутствовать.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что означает `age?: number` в интерфейсе?',
          options: [
            'возраст всегда число',
            'поле age необязательное',
            'возраст — строка',
            'синтаксическая ошибка',
          ],
          answer: 1,
          explanation: '`?` помечает поле как необязательное (optional).',
        },
        {
          kind: 'code',
          title: 'Полное имя из объекта',
          lang: 'js',
          prompt:
            'Дан объект пользователя со свойствами `firstName` и `lastName`. Напиши функцию `fullName(user)`, которая возвращает имя и фамилию через пробел.',
          entry: 'fullName',
          starter: 'function fullName(user) {\n  \n}',
          tests: [
            {
              name: 'fullName({firstName:"Аня", lastName:"Кот"}) → "Аня Кот"',
              args: [{ firstName: 'Аня', lastName: 'Кот' }],
              expected: 'Аня Кот',
            },
            {
              name: 'fullName({firstName:"Иван", lastName:"Петров"}) → "Иван Петров"',
              args: [{ firstName: 'Иван', lastName: 'Петров' }],
              expected: 'Иван Петров',
            },
          ],
          hints: ['Доступ к полю: user.firstName', 'return `${user.firstName} ${user.lastName}`'],
          solution: 'function fullName(user) {\n  return `${user.firstName} ${user.lastName}`\n}',
        },
      ],
    },
    {
      id: 'l4-unions',
      title: 'Объединения и сужение',
      subtitle: 'union types и narrowing',
      xp: 50,
      icon: '🔗',
      steps: [
        {
          kind: 'theory',
          title: 'Тип может быть одним из нескольких',
          blocks: [
            {
              type: 'text',
              md: '**Объединение** (`|`) говорит: значение одного из типов. Перед использованием тип **сужают** проверкой.',
            },
            {
              type: 'code',
              lang: 'ts',
              code: 'function format(id: string | number): string {\n  if (typeof id === "number") {\n    return "#" + id.toFixed(0)\n  }\n  return id.toUpperCase()\n}',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что описывает тип `string | number`?',
          options: [
            'строку и число одновременно',
            'значение, которое либо строка, либо число',
            'массив строк и чисел',
            'ошибку',
          ],
          answer: 1,
          explanation: 'Union — значение принимает один из перечисленных типов.',
        },
        {
          kind: 'code',
          title: 'Форматирование по типу',
          lang: 'js',
          prompt:
            'Напиши функцию `format(id)`: если `id` — число, верни строку с `#` впереди (`format(7)` → `"#7"`); если строка — верни её в верхнем регистре (`format("abc")` → `"ABC"`).',
          entry: 'format',
          starter: 'function format(id) {\n  \n}',
          tests: [
            { name: 'format(7) → "#7"', args: [7], expected: '#7' },
            { name: 'format("abc") → "ABC"', args: ['abc'], expected: 'ABC' },
            { name: 'format(0) → "#0"', args: [0], expected: '#0' },
          ],
          hints: [
            'Проверь тип через typeof id === "number".',
            'Строку в верхний регистр: id.toUpperCase()',
          ],
          solution:
            'function format(id) {\n  if (typeof id === "number") return "#" + id\n  return id.toUpperCase()\n}',
        },
      ],
    },
    {
      id: 'l5-generics',
      title: 'Дженерики',
      subtitle: 'Переиспользуемые типы',
      xp: 55,
      icon: '🧬',
      steps: [
        {
          kind: 'theory',
          title: 'Тип как параметр',
          blocks: [
            {
              type: 'text',
              md: '**Дженерик** — тип-параметр `<T>`, который подставляется при вызове. Так функция работает с любым типом, но не теряет типобезопасность.',
            },
            {
              type: 'code',
              lang: 'ts',
              code: 'function first<T>(arr: T[]): T | undefined {\n  return arr[0]\n}\n\nfirst<number>([1, 2, 3]) // тип number\nfirst(["a", "b"])       // тип string (выведен)',
            },
            {
              type: 'callout',
              tone: 'info',
              md: '`Array<T>`, `Promise<T>`, `Map<K, V>` — всё это дженерики из стандартной библиотеки.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Зачем нужны дженерики?',
          options: [
            'ускорить код',
            'писать переиспользуемые типобезопасные функции для любого типа',
            'создавать базы данных',
            'заменить циклы',
          ],
          answer: 1,
          explanation: 'Дженерик сохраняет связь типов вход↔выход для любого T.',
        },
        {
          kind: 'code',
          title: 'Первый элемент',
          lang: 'js',
          prompt:
            'Реализуй «дженерик»-функцию `first(arr)`, которая возвращает первый элемент массива любого типа, или `undefined` для пустого массива.',
          entry: 'first',
          starter: 'function first(arr) {\n  \n}',
          tests: [
            { name: 'first([1,2,3]) → 1', args: [[1, 2, 3]], expected: 1 },
            { name: 'first(["a","b"]) → "a"', args: [['a', 'b']], expected: 'a' },
            { name: 'first([]) → undefined', args: [[]], expected: undefined },
          ],
          hints: ['Первый элемент — arr[0]. Для пустого массива он уже undefined.'],
          solution: 'function first(arr) {\n  return arr[0]\n}',
        },
      ],
    },
    {
      id: 'l6-fn-types',
      title: 'Типизация функций',
      subtitle: 'Параметры и возврат',
      xp: 55,
      icon: '✒️',
      steps: [
        {
          kind: 'theory',
          title: 'Контракт функции',
          blocks: [
            {
              type: 'text',
              md: 'У функции типизируют параметры и возвращаемое значение. `void` — «ничего не возвращает». Необязательный параметр помечают `?`.',
            },
            {
              type: 'code',
              lang: 'ts',
              code: 'function area(w: number, h: number): number {\n  return w * h\n}\n\nfunction log(msg: string, tag?: string): void {\n  console.log(tag ? `[${tag}] ${msg}` : msg)\n}',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Тип возврата TS чаще выводит сам, но у публичных функций его пишут явно — это документация и защита от случайных изменений.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какой тип возврата у функции, которая только печатает в консоль?',
          options: ['null', 'undefined', 'void', 'never'],
          answer: 2,
          explanation: '`void` означает «возвращаемое значение отсутствует и не используется».',
        },
        {
          kind: 'blank',
          title: 'Типизируй функцию',
          prompt: 'Впиши типы: функция принимает ширину и высоту, возвращает число.',
          lang: 'ts',
          template: 'function area(w: ___, h: ___): ___ {\n  return w * h\n}',
          blanks: [{ answer: 'number' }, { answer: 'number' }, { answer: 'number' }],
          hints: ['Все три — number.'],
        },
        {
          kind: 'code',
          title: 'Сужение union-параметра',
          lang: 'js',
          prompt:
            'В TS параметр мог бы иметь тип `number | string`. Напиши функцию `describeId(id)`: для числа верни `"num:ЧИСЛО"`, для строки — `"str:СТРОКА"`. Проверяй через `typeof`.',
          entry: 'describeId',
          starter: 'function describeId(id) {\n  \n}',
          mustUse: ['typeof'],
          tests: [
            { name: 'describeId(42) → "num:42"', args: [42], expected: 'num:42' },
            { name: 'describeId("abc") → "str:abc"', args: ['abc'], expected: 'str:abc' },
          ],
          hints: ["if (typeof id === 'number') return `num:${id}`"],
          solution:
            "function describeId(id) {\n  if (typeof id === 'number') return `num:${id}`\n  return `str:${id}`\n}",
        },
      ],
    },
    {
      id: 'l7-literals',
      title: 'Алиасы и литеральные типы',
      subtitle: 'type и союзы строк',
      xp: 55,
      icon: '🏷️',
      steps: [
        {
          kind: 'theory',
          title: 'Имя для типа и точные значения',
          blocks: [
            {
              type: 'text',
              md: '`type` даёт имя типу, чтобы не повторяться. А **литеральный тип** ограничивает значение конкретным набором строк — это ловит опечатки на этапе компиляции.',
            },
            {
              type: 'code',
              lang: 'ts',
              code: "type Status = 'active' | 'done' | 'archived'\n\nfunction label(s: Status): string {\n  if (s === 'active') return 'В работе'\n  if (s === 'done') return 'Готово'\n  return 'В архиве'\n}\n\nlabel('active')   // ок\nlabel('actve')    // ❌ ошибка компиляции — опечатка",
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Так типизируют статусы, роли, размеры кнопок (`\'sm\' | \'md\' | \'lg\'`). Редактор сам подскажет допустимые значения.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "Что разрешает тип `type Role = 'admin' | 'user'`?",
          options: [
            'любую строку',
            'только строки «admin» или «user»',
            'массив ролей',
            'число',
          ],
          answer: 1,
          explanation: 'Литеральный союз ограничивает значение точным набором строк.',
        },
        {
          kind: 'blank',
          title: 'Объяви тип-союз',
          prompt: 'Впиши ключевое слово алиаса и разделитель вариантов.',
          lang: 'ts',
          template: "___ Size = 'sm' ___ 'md' ___ 'lg'",
          blanks: [{ answer: 'type' }, { answer: '|' }, { answer: '|' }],
          hints: ['Алиас типа — type.', 'Варианты объединяют вертикальной чертой |.'],
        },
        {
          kind: 'code',
          title: 'Переведи статус',
          lang: 'js',
          prompt:
            'Статус задачи — одно из значений `"todo"`, `"doing"`, `"done"` (в TS это был бы литеральный союз). Напиши функцию `statusLabel(s)`: `todo` → `"К выполнению"`, `doing` → `"В работе"`, `done` → `"Готово"`.',
          entry: 'statusLabel',
          starter: 'function statusLabel(s) {\n  \n}',
          tests: [
            { name: 'todo → К выполнению', args: ['todo'], expected: 'К выполнению' },
            { name: 'doing → В работе', args: ['doing'], expected: 'В работе' },
            { name: 'done → Готово', args: ['done'], expected: 'Готово' },
          ],
          hints: ['Три ветки if или объект-словарь.', "const map = { todo: 'К выполнению', ... }"],
          solution:
            "function statusLabel(s) {\n  const map = { todo: 'К выполнению', doing: 'В работе', done: 'Готово' }\n  return map[s]\n}",
        },
      ],
    },
  ],
}
