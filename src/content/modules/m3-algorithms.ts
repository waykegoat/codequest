import type { Module } from '../types'

export const m3Algorithms: Module = {
  id: 'algorithms',
  title: 'Алгоритмы: разминка',
  description: 'FizzBuzz, палиндромы, поиск — задачи, которые спрашивают на собеседованиях.',
  color: '#ff7a45',
  icon: '🧩',
  lessons: [
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
  ],
}
