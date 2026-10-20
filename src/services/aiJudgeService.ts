import type { BossRubric } from '@/content/types'

export interface BossEvaluationContext {
  title: string
  bossName: string
  bossRole: string
  prompt: string
  rubrics: BossRubric[]
  code: string
  lang?: string
}

export interface BossRubricResult {
  id: string
  title: string
  met: boolean
  feedback: string
}

export interface BossEvaluationResult {
  passed: boolean
  score: number
  bossHpRemaining: number
  title: string
  feedback: string
  rubricResults: BossRubricResult[]
  suggestions: string[]
  source: 'ai' | 'offline'
}

/**
 * Heuristic offline evaluator for boss challenges.
 * Used when offline, during network failure, or timeout.
 */
export function evaluateLocally(ctx: BossEvaluationContext): BossEvaluationResult {
  const code = (ctx.code || '').trim()

  if (code.length < 20) {
    return {
      passed: false,
      score: 10,
      bossHpRemaining: 90,
      title: `${ctx.bossName} не заметил удара!`,
      feedback: 'Код решения слишком короткий или не написан. Ознакомься с условием задачи и напиши реализацию.',
      rubricResults: ctx.rubrics.map((r) => ({
        id: r.id,
        title: r.title,
        met: false,
        feedback: 'Требование не реализовано.',
      })),
      suggestions: ['Начни с написания каркаса решения согласно заданию.'],
      source: 'offline',
    }
  }

  const codeLower = code.toLowerCase()
  const rubricResults: BossRubricResult[] = []
  let metCount = 0

  for (const rubric of ctx.rubrics) {
    const rId = rubric.id.toLowerCase()
    const rDesc = (rubric.description + ' ' + rubric.title).toLowerCase()
    let met = false
    let feedback = ''

    // Dynamic heuristic detection per rubric criteria
    if (rId.includes('vue') || rDesc.includes('vue') || rDesc.includes('composition') || rDesc.includes('setup')) {
      met = codeLower.includes('setup') || codeLower.includes('ref(') || codeLower.includes('reactive(') || codeLower.includes('definecomponent')
      feedback = met ? 'Использован Composition API / реактивность Vue.' : 'Не обнаружено использование ref, reactive или <script setup>.'
    } else if (rId.includes('computed') || rDesc.includes('computed')) {
      met = codeLower.includes('computed(') || codeLower.includes('computed')
      feedback = met ? 'Корректно применено вычисляемое свойство (computed).' : 'Рекомендуется использовать computed() для производных данных.'
    } else if (rId.includes('watch') || rDesc.includes('watch')) {
      met = codeLower.includes('watch(') || codeLower.includes('watcheffect')
      feedback = met ? 'Применён наблюдатель (watch).' : 'Не найден вызов watch/watchEffect.'
    } else if (rId.includes('prop') || rDesc.includes('emit') || rDesc.includes('компонент')) {
      met = codeLower.includes('props') || codeLower.includes('emits') || codeLower.includes('defineprops') || codeLower.includes('defineemits') || codeLower.includes('component')
      feedback = met ? 'Спроектированы входные параметры или события.' : 'Опиши параметры (props) или события (emits).'
    } else if (rId.includes('pinia') || rDesc.includes('pinia') || rDesc.includes('store')) {
      met = codeLower.includes('definestore') || codeLower.includes('store') || codeLower.includes('state')
      feedback = met ? 'Реализовано хранилище состояний (Store).' : 'Используй defineStore для управления состоянием.'
    } else if (rId.includes('async') || rDesc.includes('async') || rDesc.includes('await') || rDesc.includes('promise')) {
      met = (codeLower.includes('async') && codeLower.includes('await')) || codeLower.includes('promise')
      feedback = met ? 'Присутствует асинхронный код с async/await или Promise.' : 'Требуется использовать асинхронные конструкции async/await.'
    } else if (rId.includes('error') || rDesc.includes('ошиб') || rDesc.includes('try') || rDesc.includes('catch')) {
      met = codeLower.includes('try') && codeLower.includes('catch') || codeLower.includes('error') || codeLower.includes('throw')
      feedback = met ? 'Предусмотрена обработка ошибок и исключений.' : 'Добавь блок try...catch для безопасной обработки ошибок.'
    } else if (rId.includes('event') || rDesc.includes('событ') || rDesc.includes('listener')) {
      met = codeLower.includes('addeventlistener') || codeLower.includes('emit') || codeLower.includes('on(') || codeLower.includes('@')
      feedback = met ? 'Обработка событий реализована.' : 'Добавь слушатели или отправку событий.'
    } else if (rId.includes('semantic') || rDesc.includes('семантик') || rDesc.includes('тег')) {
      const hasSemanticTags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'].some((tag) => codeLower.includes(`<${tag}`) || codeLower.includes(`</${tag}>`))
      met = hasSemanticTags
      feedback = met ? 'Использованы семантические теги разметки.' : 'Используй теги <header>, <main>, <section>, <footer> вместо сплошных <div>.'
    } else if (rId.includes('style') || rDesc.includes('css') || rDesc.includes('стил') || rDesc.includes('адаптив')) {
      met = codeLower.includes('display') || codeLower.includes('grid') || codeLower.includes('flex') || codeLower.includes('border') || codeLower.includes('@media')
      feedback = met ? 'Стили и оформление применены.' : 'Задай стили через Flexbox/Grid и media-запросы.'
    } else if (rId.includes('sql') || rDesc.includes('sql') || rDesc.includes('запрос')) {
      met = codeLower.includes('select') && (codeLower.includes('from') || codeLower.includes('join'))
      feedback = met ? 'SQL-запрос сформирован с ключевыми конструкциями.' : 'Напиши SQL-запрос с операторами SELECT, FROM и фильтрацией/JOIN.'
    } else {
      // General heuristic: check if code length is sufficient and mentions any words from rubric title
      const words = rubric.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
      const hasWordMatch = words.some((w) => codeLower.includes(w))
      met = code.length > 50 && (hasWordMatch || code.length > 120)
      feedback = met ? 'Требование реализовано в коде.' : 'Удели внимание реализации этого пункта.'
    }

    if (met) metCount++
    rubricResults.push({
      id: rubric.id,
      title: rubric.title,
      met,
      feedback,
    })
  }

  const rawScore = Math.round((metCount / Math.max(1, ctx.rubrics.length)) * 100)
  // Give minimum baseline for effort if code is extensive
  const score = Math.max(code.length > 200 ? 50 : 25, rawScore)
  const passed = score >= 70
  const bossHpRemaining = passed ? 0 : Math.max(10, 100 - score)

  return {
    passed,
    score,
    bossHpRemaining,
    title: passed ? `Победа! ${ctx.bossName} повержен!` : `${ctx.bossName} устоял под натиском!`,
    feedback: passed
      ? `Отличная работа! Твой проект успешно соответствует ключевым критериям. Все важные требования выполнены.`
      : `Решение на верном пути, но ещё не все требования закрыты. Ознакомься со списком критериев ниже и дополни код.`,
    rubricResults,
    suggestions: passed
      ? ['Код готов к внедрению в реальный проект. Отличная архитектура!']
      : ['Доработай пункты, отмеченные красным, и повтори вызов босса.'],
    source: 'offline',
  }
}

/**
 * Sends student's code to Gemini or Pollinations AI for evaluation against rubrics.
 * Gracefully falls back to offline evaluation on timeout or error.
 */
export async function evaluateBossSubmission(
  ctx: BossEvaluationContext,
  apiKey?: string,
  provider = 'pollinations',
): Promise<BossEvaluationResult> {
  const rubricsSummary = ctx.rubrics
    .map((r, i) => `${i + 1}. [id: "${r.id}"] "${r.title}": ${r.description}`)
    .join('\n')

  const systemPrompt = `Ты — беспристрастный и опытный Технический Арбитр и Судья Испытаний Боссов на платформе CodeQuest.
Ученик выполняет сложное практическое задание («Битва с боссом» по имени ${ctx.bossName}, ${ctx.bossRole}).

ТВОЯ ЗАДАЧА:
Оценить код ученика по списку критериев (рубрик).
Помни: в реальном программировании одну и ту же задачу можно решить разными подходами. Будь гибким: если требование логически и функционально выполнено (даже другим стилем или подходом), засчитывай критерий (met: true).

КРИТЕРИИ ОЦЕНКИ:
${rubricsSummary}

ТРЕБОВАНИЯ К ОТВЕТУ:
Верни СТРОГО валидный JSON-объект без лишнего текста вокруг следующей структуры:
{
  "passed": boolean (true, если набрано от 70 баллов и основные критерии выполнены),
  "score": number (оценка от 0 до 100),
  "title": "Эпичный вердикт (например: 'Победа! Босс сокрушён' или 'Босс устоял — требуется усилить защиту')",
  "feedback": "Подробный конструктивный комментарий для ученика (2-4 предложения): что сделано круто, а что стоит усилить",
  "rubricResults": [
    {
      "id": "id критерия из списка",
      "met": boolean (выполнен ли критерий),
      "feedback": "краткое объяснение (1 предложение), почему засчитано или чего не хватило"
    }
  ],
  "suggestions": [
    "1-3 ценных практических совета по архитектуре или стилю кода"
  ]
}`

  const userMessage = `Задание: ${ctx.title}
Описание задания: ${ctx.prompt}
Язык: ${ctx.lang || 'javascript'}

Код решения ученика:
\`\`\`
${ctx.code.slice(0, 4000)}
\`\`\``

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 7500)

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
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
          }),
        },
      )
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          const parsed = JSON.parse(text)
          return normalizeAiResult(parsed, ctx)
        }
      }
    } else {
      // Free Pollinations AI JSON endpoint
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
          return normalizeAiResult(parsed, ctx)
        }
      }
    }
  } catch {
    // Network / timeout: smoothly fall back to local heuristic evaluator
  } finally {
    clearTimeout(timeoutId)
  }

  return evaluateLocally(ctx)
}

function normalizeAiResult(parsed: any, ctx: BossEvaluationContext): BossEvaluationResult {
  const score = typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 75
  const passed = typeof parsed.passed === 'boolean' ? parsed.passed : score >= 70
  const bossHpRemaining = passed ? 0 : Math.max(0, 100 - score)

  const rawRubrics: any[] = Array.isArray(parsed.rubricResults) ? parsed.rubricResults : []
  const rubricResults: BossRubricResult[] = ctx.rubrics.map((orig) => {
    const found = rawRubrics.find((r) => r.id === orig.id)
    return {
      id: orig.id,
      title: orig.title,
      met: found ? Boolean(found.met) : passed,
      feedback: found?.feedback || (passed ? 'Критерий успешно выполнен.' : 'Требует доработки.'),
    }
  })

  return {
    passed,
    score,
    bossHpRemaining,
    title: parsed.title || (passed ? `Победа над ${ctx.bossName}!` : `Битва с ${ctx.bossName}`),
    feedback: parsed.feedback || (passed ? 'Отличное решение!' : 'Требуется доработка.'),
    rubricResults,
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    source: 'ai',
  }
}
