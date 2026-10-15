export interface HintContext {
  lang?: string
  code: string
  prompt?: string
  compileError?: string
  runtimeError?: string
  logs?: string[]
  failedTests?: Array<{
    name: string
    expected?: string
    actual?: string
    error?: string
    passed?: boolean
  }>
}

export interface HintResult {
  title: string
  explanation: string
  cause: string
  socraticHint: string
  source: 'ai' | 'offline'
}

export function analyzeErrorLocally(ctx: HintContext): HintResult {
  const errText = (ctx.compileError || ctx.runtimeError || '').trim()
  const firstFailed = ctx.failedTests?.[0]
  const testErr = (firstFailed?.error || '').trim()
  const fullErr = `${errText}\n${testErr}`.trim()

  // 1. SyntaxError
  if (/SyntaxError/i.test(fullErr) || /Unexpected token/i.test(fullErr)) {
    let specific = 'В синтаксисе программы есть лишний или незакрытый символ.'
    if (fullErr.includes("'}'") || fullErr.includes("'{'")) {
      specific = 'Обрати внимание на фигурные скобки `{ }` — похоже, одна из них осталась без пары.'
    } else if (fullErr.includes("')'") || fullErr.includes("'('")) {
      specific = 'Проверь круглые скобки `( )` у условий `if`, циклов или вызовов функций.'
    } else if (fullErr.includes("','")) {
      specific = 'Проверь расстановку запятых в списке аргументов или элементах массива/объекта.'
    }
    return {
      title: 'Синтаксическая ошибка (SyntaxError)',
      explanation: 'Интерпретатор не смог понять структуру кода и остановился.',
      cause: specific,
      socraticHint: 'Проверь парность всех открывающих и закрывающих скобок, а также кавычек в коде.',
      source: 'offline',
    }
  }

  // 2. ReferenceError: x is not defined
  const notDefMatch = fullErr.match(/([a-zA-Z0-9_$]+) is not defined/i)
  if (notDefMatch || /ReferenceError/i.test(fullErr)) {
    const varName = notDefMatch ? notDefMatch[1] : 'переменная'
    return {
      title: `Неизвестное имя: «${varName}» (ReferenceError)`,
      explanation: `Программа пытается обратиться к имени «${varName}», но в текущей области видимости оно не существует.`,
      cause: `Возможно, в названии опечатка, имя не было объявлено через let/const, или оно объявлено внутри другого блока { } и недоступно снаружи.`,
      socraticHint: `Проверь точное написание «${varName}». Где эта переменная создаётся и передаётся ли она как аргумент функции?`,
      source: 'offline',
    }
  }

  // 3. TypeError: Cannot read properties of undefined / null
  const readPropMatch = fullErr.match(/reading ['"]?([a-zA-Z0-9_$]+)['"]?/i)
  if (/Cannot read propert/i.test(fullErr) || /is (undefined|null)/i.test(fullErr)) {
    const propName = readPropMatch ? readPropMatch[1] : 'свойство'
    return {
      title: `Обращение к свойству у пустоты (TypeError)`,
      explanation: `Ты пытаешься прочитать «.${propName}», но объект слева от точки равен undefined или null.`,
      cause: 'Значение, у которого запрашивается свойство, не существует (например, элемент массива не найден, функция ничего не вернула или объект пустой).',
      socraticHint: `Выведи через console.log значение переменной перед точкой. Точно ли там находится объект или массив в этот момент?`,
      source: 'offline',
    }
  }

  // 4. TypeError: x is not a function
  const notFnMatch = fullErr.match(/([a-zA-Z0-9_$]+) is not a function/i)
  if (notFnMatch || /is not a function/i.test(fullErr)) {
    const fnName = notFnMatch ? notFnMatch[1] : 'выражение'
    return {
      title: `Попытка вызвать не-функцию (TypeError)`,
      explanation: `Ты поставил круглые скобки ( ) после «${fnName}», ожидая функцию, но в ней лежит другой тип данных.`,
      cause: 'В этой переменной оказалось число, строка, объект или undefined вместо исполняемой функции.',
      socraticHint: `Проверь правильность названия метода (например, push, slice, map) и убедись, что тип данных поддерживает эту операцию.`,
      source: 'offline',
    }
  }

  // 5. Assignment to constant variable
  if (/Assignment to constant variable/i.test(fullErr)) {
    return {
      title: 'Перезапись константы (TypeError)',
      explanation: 'Произошла попытка изменить значение переменной, объявленной через const.',
      cause: 'Константы const защищены от переназначения знаком =.',
      socraticHint: 'Какое ключевое слово вместо const позволяет изменять значение переменной в дальнейшем?',
      source: 'offline',
    }
  }

  // 6. Timeout / Infinite loop
  if (/Превышено время выполнения/i.test(fullErr) || /бесконечный цикл/i.test(fullErr)) {
    return {
      title: 'Слишком долгое выполнение (вероятен бесконечный цикл)',
      explanation: 'Код выполнялся больше 3 секунд и был принудительно остановлен.',
      cause: 'Обычно это происходит, когда условие цикла while или for никогда не становится ложным.',
      socraticHint: 'Посмотри на шаг цикла: изменяется ли переменная-счётчик внутри тела цикла так, чтобы приближаться к условию выхода?',
      source: 'offline',
    }
  }

  // 7. Maximum call stack size exceeded
  if (/Maximum call stack size/i.test(fullErr)) {
    return {
      title: 'Переполнение стека вызовов (RangeError)',
      explanation: 'Функция вызвала саму себя слишком много раз без остановки.',
      cause: 'В рекурсивной функции отсутствует базовый случай (условие выхода) либо условие никогда не срабатывает.',
      socraticHint: 'Есть ли в самом начале функции проверка if (...) return, которая завершает рекурсию при достижении границы?',
      source: 'offline',
    }
  }

  // 8. Missing Entry Function
  if (/Не нашёл функцию/i.test(fullErr)) {
    return {
      title: 'Функция не найдена',
      explanation: 'Тестирующий модуль не смог обнаружить функцию с требуемым именем.',
      cause: 'Имя объявленной функции отличается от того, что ожидается в задании, либо она не объявлена на верхнем уровне.',
      socraticHint: 'Сверь имя функции в объявлении (function ...) с описанием в задании.',
      source: 'offline',
    }
  }

  // 9. Expected X, but got undefined (Missing return)
  if (
    firstFailed &&
    firstFailed.actual === 'undefined' &&
    firstFailed.expected &&
    firstFailed.expected !== 'undefined'
  ) {
    return {
      title: 'Функция вернула undefined',
      explanation: `Тест ожидал значение ${firstFailed.expected}, но твоя функция ничего не вернула.`,
      cause: 'В JavaScript функция возвращает undefined, если в ней забыли написать оператор return или ветка кода завершилась без возврата.',
      socraticHint: 'Проверь, есть ли в теле функции ключевое слово return перед возвращаемым результатом.',
      source: 'offline',
    }
  }

  // 10. Failed tests mismatch
  if (firstFailed && firstFailed.passed !== true) {
    let hint = 'Попробуй мысленно или на бумаге подставить аргументы теста и проследить каждый шаг вычислений.'
    if (firstFailed.expected && firstFailed.actual) {
      if (firstFailed.expected.startsWith('[') && !firstFailed.actual.startsWith('[')) {
        hint = 'Обрати внимание: тест ожидает массив значений, а твоя функция возвращает одиночное значение.'
      } else if (firstFailed.expected.startsWith('"') && !firstFailed.actual.startsWith('"')) {
        hint = 'Тест ожидает строковый результат. Проверь тип возвращаемого значения.'
      } else if (firstFailed.expected === 'true' || firstFailed.expected === 'false') {
        hint = 'Тест ожидает булево значение (true/false). Проверь логику условий сравнения.'
      }
    }
    return {
      title: `Тест «${firstFailed.name}» не прошёл`,
      explanation: `Ожидалось: ${firstFailed.expected ?? 'другое значение'}, но было получено: ${firstFailed.actual ?? '—'}.`,
      cause: 'Алгоритм обрабатывает эти входные данные не так, как задумано в условии задачи.',
      socraticHint: hint,
      source: 'offline',
    }
  }

  // 11. Generic fallback
  return {
    title: 'Подсказка по выполнению',
    explanation: 'Программа завершилась с ошибкой или не выполнила все требования тестов.',
    cause: errText || 'Одно из условий проверки вернуло отрицательный результат.',
    socraticHint: 'Проверь консольный вывод (console.log) промежуточных значений и сравни логику шагов с условием задачи.',
    source: 'offline',
  }
}

export async function requestAiHint(
  ctx: HintContext,
  apiKey?: string,
  provider = 'pollinations',
): Promise<HintResult> {
  const code = ctx.code.slice(0, 1500)
  const err = (ctx.compileError || ctx.runtimeError || '').slice(0, 500)
  const failedSummary = ctx.failedTests
    ?.filter((t) => t.passed !== true)
    .slice(0, 2)
    .map((t) => `Тест: "${t.name}", ожидалось: ${t.expected}, получено: ${t.actual}${t.error ? `, ошибка: ${t.error}` : ''}`)
    .join('\n')

  const promptText = ctx.prompt?.slice(0, 500) || ''
  const logsText = (ctx.logs || []).slice(-5).join('\n')

  const systemPrompt = `Ты — Байт, дружелюбный робот-наставник по программированию в тренажёре CodeQuest.
Ученик допустил ошибку в коде или не прошёл тест.
ТВОЯ ЗАДАЧА:
1. Объяснить человеческим языком, в чём суть возникшей ошибки.
2. Пояснить, из-за чего в данном коде это произошло.
3. Дать наводящий вопрос или вектор для размышления.

СТРОЖАЙШЕ ЗАПРЕЩЕНО:
- Давать готовый исправленный код!
- Писать готовое решение!
- Спойлерить прямой ответ!
Ученик ДОЛЖЕН догадаться и написать код САМ.

Ответь строго в формате JSON со следующими тремя полями:
{
  "title": "Краткий заголовок проблемы (до 6 слов)",
  "explanation": "Что означает эта ошибка простыми словами (1-2 предложения)",
  "cause": "В каком месте кода или логики допущен просчёт (1-2 предложения без готового кода)",
  "socraticHint": "Наводящая подсказка или вопрос, помогающий исправить самому (1-2 предложения)"
}`

  const userMessage = `Язык: ${ctx.lang || 'javascript'}
Задание: ${promptText}

Код ученика:
\`\`\`
${code}
\`\`\`

Информация об ошибке:
${err || 'Нет фатальной ошибки исполнения'}
${failedSummary ? `Упавшие тесты:\n${failedSummary}` : ''}
${logsText ? `Вывод в консоль:\n${logsText}` : ''}`

  // Timeout controller: 4.5 seconds
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4500)

  try {
    if (provider === 'gemini' && apiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
              },
            ],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
          }),
        },
      )
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          const parsed = JSON.parse(text)
          return {
            title: parsed.title || 'Разбор от Байта',
            explanation: parsed.explanation || '',
            cause: parsed.cause || '',
            socraticHint: parsed.socraticHint || '',
            source: 'ai',
          }
        }
      }
    } else {
      // Free Pollinations AI (no API key needed)
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          model: 'openai',
          jsonMode: true,
        }),
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const raw = await res.text()
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.explanation && parsed.socraticHint) {
            return {
              title: parsed.title || 'Разбор от Байта',
              explanation: parsed.explanation,
              cause: parsed.cause || '',
              socraticHint: parsed.socraticHint,
              source: 'ai',
            }
          }
        }
      }
    }
  } catch {
    // Network / timeout / CORS error: fallback immediately to local analysis
  } finally {
    clearTimeout(timeoutId)
  }

  return analyzeErrorLocally(ctx)
}
