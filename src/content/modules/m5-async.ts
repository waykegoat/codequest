import type { Module } from '../types'

export const m5Async: Module = {
  id: 'async',
  title: 'Асинхронность',
  description: 'Promise, async/await, Promise.all и обработка ошибок при работе с сетью.',
  color: '#a855f7',
  icon: '⏳',
  lessons: [
    {
      id: 'l0-callbacks',
      title: 'Почему асинхронность',
      subtitle: 'Колбэки и очередь',
      xp: 40,
      icon: '⏰',
      steps: [
        {
          kind: 'theory',
          title: 'JS не умеет ждать стоя',
          blocks: [
            {
              type: 'text',
              md: 'JavaScript выполняет код в **один поток**. Долгие операции (сеть, таймеры) нельзя ждать «стоя» — страница бы зависла. Вместо этого JS оставляет **колбэк** — функцию, которую вызовут, когда результат будет готов.',
            },
            {
              type: 'code',
              lang: 'js',
              code: "console.log('старт')\nsetTimeout(() => {\n  console.log('через секунду')\n}, 1000)\nconsole.log('конец')\n// старт → конец → через секунду",
            },
            {
              type: 'callout',
              tone: 'info',
              md: 'Отложенные колбэки ждут в **очереди** и выполняются, когда основной код закончился. Поэтому «конец» печатается раньше.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: "В каком порядке выведется: `log('a'); setTimeout(() => log('b'), 0); log('c')`?",
          options: ['a, b, c', 'a, c, b', 'b, a, c', 'c, b, a'],
          answer: 1,
          explanation: 'Даже с задержкой 0 колбэк попадает в очередь и ждёт конца основного кода.',
        },
        {
          kind: 'order',
          title: 'Собери отложенный вывод',
          prompt: 'Расставь строки: программа печатает «старт», через секунду — «позже», и сразу после старта — «конец».',
          lang: 'js',
          lines: [
            "console.log('старт')",
            'setTimeout(() => {',
            "  console.log('позже')",
            '}, 1000)',
            "console.log('конец')",
          ],
          hints: ['setTimeout с колбэком стоит между двумя обычными выводами.'],
        },
      ],
    },
    {
      id: 'l1-promises',
      title: 'Промисы',
      subtitle: 'Обещание результата',
      xp: 45,
      icon: '🤝',
      steps: [
        {
          kind: 'theory',
          title: 'Что такое Promise',
          blocks: [
            {
              type: 'text',
              md: '**Промис** — обещание вернуть значение позже. У него три состояния: ожидание → выполнен (resolve) или отклонён (reject).',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const p = Promise.resolve(42)\np.then((value) => {\n  console.log(value) // 42\n})',
            },
            {
              type: 'callout',
              tone: 'info',
              md: '`Promise.resolve(x)` сразу создаёт уже выполненный промис со значением `x`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Сколько состояний у промиса?',
          options: ['1', '2', '3', 'бесконечно'],
          answer: 2,
          explanation: 'Три: pending (ожидание), fulfilled (выполнен), rejected (отклонён).',
        },
        {
          kind: 'blank',
          title: 'Получи значение промиса',
          prompt: 'Впиши метод, который вызовет колбэк, когда промис выполнится.',
          lang: 'js',
          template: 'Promise.resolve(42).___((value) => {\n  console.log(value)\n})',
          blanks: [{ answer: 'then' }],
          hints: ['Метод подписки на результат — then.'],
        },
        {
          kind: 'code',
          title: 'Верни промис',
          lang: 'js',
          prompt:
            'Напиши **async**-функцию `resolveWith(value)`, которая возвращает `value`. Так как функция помечена `async`, она автоматически вернёт промис, разрешающийся этим значением.',
          entry: 'resolveWith',
          starter: 'async function resolveWith(value) {\n  \n}',
          tests: [
            { name: 'await resolveWith(42) → 42', args: [42], expected: 42 },
            { name: 'await resolveWith("hi") → "hi"', args: ['hi'], expected: 'hi' },
          ],
          hints: ['Внутри async-функции просто верни value — обёртка в промис произойдёт сама.'],
          solution: 'async function resolveWith(value) {\n  return value\n}',
        },
      ],
    },
    {
      id: 'l2-async-await',
      title: 'async / await',
      subtitle: 'Асинхронный код как синхронный',
      xp: 50,
      icon: '⏭️',
      steps: [
        {
          kind: 'theory',
          title: 'Ждём результат читаемо',
          blocks: [
            {
              type: 'text',
              md: '`await` приостанавливает функцию до выполнения промиса и возвращает его значение. Код читается сверху вниз, как обычный.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'async function loadUser() {\n  const res = await fetch("/api/user")\n  const user = await res.json()\n  return user\n}',
            },
            {
              type: 'callout',
              tone: 'warning',
              md: '`await` можно писать только внутри `async`-функции (или на верхнем уровне модуля).',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает `await somePromise`?',
          options: [
            'отменяет промис',
            'ждёт выполнения и возвращает значение промиса',
            'создаёт новый промис',
            'выводит промис в консоль',
          ],
          answer: 1,
          explanation: '`await` разворачивает промис в его значение, приостанавливая функцию.',
        },
        {
          kind: 'code',
          title: 'Удвой асинхронно',
          lang: 'js',
          prompt:
            'Есть асинхронный источник числа. Напиши async-функцию `doubleAsync(n)`, которая возвращает `n * 2`. Пусть она будет `async`, чтобы имитировать асинхронную операцию.',
          entry: 'doubleAsync',
          starter: 'async function doubleAsync(n) {\n  \n}',
          tests: [
            { name: 'await doubleAsync(5) → 10', args: [5], expected: 10 },
            { name: 'await doubleAsync(0) → 0', args: [0], expected: 0 },
            { name: 'await doubleAsync(-3) → -6', args: [-3], expected: -6 },
          ],
          hints: ['return n * 2 внутри async-функции.'],
          solution: 'async function doubleAsync(n) {\n  return n * 2\n}',
        },
      ],
    },
    {
      id: 'l3-promise-all',
      title: 'Promise.all',
      subtitle: 'Параллельные операции',
      xp: 60,
      icon: '🔀',
      steps: [
        {
          kind: 'theory',
          title: 'Много промисов сразу',
          blocks: [
            {
              type: 'text',
              md: '`Promise.all([...])` ждёт **все** промисы и возвращает массив их результатов. Операции идут параллельно — быстрее, чем по очереди.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const results = await Promise.all([\n  Promise.resolve(1),\n  Promise.resolve(2),\n  Promise.resolve(3),\n])\n// results = [1, 2, 3]',
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Если хоть один промис отклонится, весь `Promise.all` тоже отклонится. Для «дождаться всех несмотря на ошибки» есть `Promise.allSettled`.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что вернёт `await Promise.all([Promise.resolve(1), Promise.resolve(2)])`?',
          options: ['1', '[1, 2]', '2', 'Promise'],
          answer: 1,
          explanation: 'Массив результатов всех промисов в исходном порядке.',
        },
        {
          kind: 'blank',
          title: 'Дождись всех',
          prompt: 'Впиши недостающее: ждём оба промиса параллельно.',
          lang: 'js',
          template: 'const [user, orders] = ___ Promise.___([\n  getUser(7),\n  getOrders(7),\n])',
          blanks: [{ answer: 'await' }, { answer: 'all' }],
          hints: ['Ожидание — await, параллельность — Promise.all.'],
        },
        {
          kind: 'code',
          title: 'Асинхронная сумма',
          lang: 'js',
          prompt:
            'Напиши async-функцию `sumAsync(arr)`: асинхронно удвой каждое число (заверни в `Promise.resolve(n * 2)`), дождись всех через `Promise.all` и верни сумму результатов. Для `[1, 2, 3]` → `12`.',
          entry: 'sumAsync',
          starter: 'async function sumAsync(arr) {\n  \n}',
          tests: [
            { name: 'await sumAsync([1,2,3]) → 12', args: [[1, 2, 3]], expected: 12 },
            { name: 'await sumAsync([]) → 0', args: [[]], expected: 0 },
            { name: 'await sumAsync([10]) → 20', args: [[10]], expected: 20 },
          ],
          hints: [
            'arr.map((n) => Promise.resolve(n * 2)) даёт массив промисов.',
            'const doubled = await Promise.all(...); return doubled.reduce((a, b) => a + b, 0)',
          ],
          solution:
            'async function sumAsync(arr) {\n  const doubled = await Promise.all(arr.map((n) => Promise.resolve(n * 2)))\n  return doubled.reduce((a, b) => a + b, 0)\n}',
        },
      ],
    },
    {
      id: 'l4-errors',
      title: 'Обработка ошибок',
      subtitle: 'try / catch',
      xp: 55,
      icon: '🛟',
      steps: [
        {
          kind: 'theory',
          title: 'Ловим сбои',
          blocks: [
            {
              type: 'text',
              md: 'Сеть и данные могут подвести. `try / catch` перехватывает ошибку и позволяет вернуть запасное значение вместо падения программы.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'async function loadSafe() {\n  try {\n    const res = await fetch("/api/data")\n    return await res.json()\n  } catch (err) {\n    return null // запасной вариант\n  }\n}',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Что делает блок `catch`?',
          options: [
            'повторяет запрос',
            'перехватывает возникшую ошибку',
            'создаёт промис',
            'останавливает программу',
          ],
          answer: 1,
          explanation: '`catch` выполняется, если в `try` произошла ошибка (throw).',
        },
        {
          kind: 'code',
          title: 'Безопасный разбор JSON',
          lang: 'js',
          prompt:
            'Напиши функцию `safeJson(str)`: верни результат `JSON.parse(str)`, а если строка невалидна и парсинг бросает ошибку — верни `null` (через try/catch).',
          entry: 'safeJson',
          starter: 'function safeJson(str) {\n  \n}',
          tests: [
            { name: 'safeJson(\'{"a":1}\') → {a:1}', args: ['{"a":1}'], expected: { a: 1 } },
            { name: 'safeJson("[1,2]") → [1,2]', args: ['[1,2]'], expected: [1, 2] },
            { name: 'safeJson("oops") → null', args: ['oops'], expected: null },
          ],
          hints: ['Оберни JSON.parse в try, в catch верни null.'],
          solution:
            'function safeJson(str) {\n  try {\n    return JSON.parse(str)\n  } catch (err) {\n    return null\n  }\n}',
        },
      ],
    },
    {
      id: 'l5-practice',
      title: 'Имитация API',
      subtitle: 'Всё вместе',
      xp: 65,
      icon: '🌐',
      steps: [
        {
          kind: 'theory',
          title: 'Последовательно или параллельно',
          blocks: [
            {
              type: 'text',
              md: 'Если второй запрос зависит от первого — жди их **последовательно**. Если запросы независимы — запускай **параллельно** через `Promise.all`: три запроса по 100 мс займут 100 мс, а не 300.',
            },
            {
              type: 'code',
              lang: 'js',
              code: 'const user = await getUser(7)\nconst orders = await getOrders(user.id)\n\nconst [a, b] = await Promise.all([getUser(1), getUser(2)])',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Три независимых запроса по 200 мс через Promise.all займут примерно...',
          options: ['600 мс', '200 мс', '400 мс', '0 мс'],
          answer: 1,
          explanation: 'Параллельные запросы идут одновременно — время равно самому долгому из них.',
        },
        {
          kind: 'code',
          title: 'Загрузи всех пользователей',
          lang: 'js',
          prompt:
            'Функция `getUser(id)` имитирует запрос к API. Напиши async-функцию `loadNames(ids)`: загрузи всех пользователей **параллельно** и верни массив их имён.',
          entry: 'loadNames',
          starter:
            "async function getUser(id) {\n  return { id, name: 'user' + id }\n}\n\nasync function loadNames(ids) {\n  \n}",
          mustUse: ['Promise.all'],
          tests: [
            { name: "loadNames([1,2]) → ['user1','user2']", args: [[1, 2]], expected: ['user1', 'user2'] },
            { name: "loadNames([7]) → ['user7']", args: [[7]], expected: ['user7'] },
            { name: 'loadNames([]) → []', args: [[]], expected: [] },
          ],
          hints: [
            'const users = await Promise.all(ids.map((id) => getUser(id)))',
            'return users.map((u) => u.name)',
          ],
          solution:
            "async function getUser(id) {\n  return { id, name: 'user' + id }\n}\n\nasync function loadNames(ids) {\n  const users = await Promise.all(ids.map((id) => getUser(id)))\n  return users.map((u) => u.name)\n}",
        },
        {
          kind: 'code',
          title: 'Запрос с запасным вариантом',
          lang: 'js',
          prompt:
            'Функция `getConfig(key)` бросает ошибку для неизвестных ключей. Напиши async-функцию `configOr(key, fallback)`: верни значение конфига, а при ошибке — `fallback`.',
          entry: 'configOr',
          starter:
            "async function getConfig(key) {\n  const store = { theme: 'dark', lang: 'ru' }\n  if (!(key in store)) throw new Error('нет ключа')\n  return store[key]\n}\n\nasync function configOr(key, fallback) {\n  \n}",
          tests: [
            { name: "configOr('theme', 'light') → 'dark'", args: ['theme', 'light'], expected: 'dark' },
            { name: "configOr('size', 16) → 16", args: ['size', 16], expected: 16 },
          ],
          hints: ['try { return await getConfig(key) } catch { return fallback }'],
          solution:
            "async function getConfig(key) {\n  const store = { theme: 'dark', lang: 'ru' }\n  if (!(key in store)) throw new Error('нет ключа')\n  return store[key]\n}\n\nasync function configOr(key, fallback) {\n  try {\n    return await getConfig(key)\n  } catch (err) {\n    return fallback\n  }\n}",
        },
      ],
    },
  ],
}
