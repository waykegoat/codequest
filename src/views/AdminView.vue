<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAdminStore, type StudentRecord } from '@/stores/admin'
import { course, flatLessons } from '@/content'
import { requestAiHint, type HintResult } from '@/services/aiHintService'
import { useSettingsStore } from '@/stores/settings'

const admin = useAdminStore()
const settings = useSettingsStore()

const pinInput = ref('')
const pinError = ref('')
const activeTab = ref<'metrics' | 'students' | 'aiLab' | 'course'>('metrics')

const students = ref<StudentRecord[]>([])
const loadingStudents = ref(false)
const studentSearch = ref('')

// AI Lab fields
const testCode = ref('function calculateTotal(items) {\n  return items.map(i => i.price);\n}')
const testPrompt = ref('Напиши функцию calculateTotal(items), возвращающую сумму цен всех товаров.')
const testError = ref('Expected: 150, Got: [50, 100]')
const aiTesting = ref(false)
const aiTestResult = ref<HintResult | null>(null)

interface LabPreset {
  name: string
  prompt: string
  code: string
  error: string
}

const labPresets: LabPreset[] = [
  {
    name: '🛒 Сумма корзины',
    prompt: 'Напиши функцию calculateTotal(items), возвращающую суммарную стоимость всех товаров.',
    code: 'function calculateTotal(items) {\n  return items.map(i => i.price);\n}',
    error: 'Expected: 150, Got: [50, 100]',
  },
  {
    name: '🔁 Off-by-one в цикле',
    prompt: 'Напиши функцию sumNumbers(n), суммирующую числа от 1 до n включительно.',
    code: 'function sumNumbers(n) {\n  let total = 0;\n  for (let i = 1; i < n; i++) {\n    total += i;\n  }\n  return total;\n}',
    error: 'Expected: 15 (для n=5), Got: 10',
  },
  {
    name: '🗄️ SQL: пропущен GROUP BY',
    prompt: 'Посчитай количество заказов для каждого клиента из таблицы orders.',
    code: 'SELECT user_id, COUNT(*) FROM orders;',
    error: 'column "orders.user_id" must appear in the GROUP BY clause or be used in an aggregate function',
  },
  {
    name: '⚡ TypeError: null property',
    prompt: 'Получи email пользователя из объекта профиля.',
    code: 'function getEmail(user) {\n  return user.contacts.email;\n}',
    error: 'TypeError: Cannot read properties of undefined (reading "email")',
  },
]

function applyPreset(p: LabPreset) {
  testPrompt.value = p.prompt
  testCode.value = p.code
  testError.value = p.error
  aiTestResult.value = null
}

onMounted(async () => {
  if (admin.isAdminAuthenticated) {
    loadStudents()
  }
})

async function loadStudents() {
  loadingStudents.value = true
  students.value = await admin.fetchAllStudents()
  loadingStudents.value = false
}

function handleLogin() {
  if (admin.authenticate(pinInput.value.trim())) {
    pinError.value = ''
    pinInput.value = ''
    loadStudents()
  } else {
    pinError.value = 'Неверный секретный пароль администратора'
  }
}

const filteredStudents = computed(() => {
  if (!studentSearch.value.trim()) return students.value
  const q = studentSearch.value.toLowerCase()
  return students.value.filter(
    (s) => s.displayName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
  )
})

// Metrics calculations (strictly real data)
const totalPlatformXp = computed(() => students.value.reduce((sum, s) => sum + s.totalXp, 0))
const avgStreak = computed(() =>
  students.value.length ? Math.round(students.value.reduce((sum, s) => sum + s.streak, 0) / students.value.length) : 0,
)
const juniorReadyCount = computed(() => students.value.filter((s) => s.level >= 13).length)

// Funnel calculations derived purely from actual student completions
const funnelData = computed(() => {
  const totalStudents = students.value.length
  return course.modules.map((m) => {
    if (totalStudents === 0) {
      return {
        title: m.title,
        icon: m.icon,
        count: m.lessons.length,
        completionRate: 0,
      }
    }

    let completedInModule = 0
    for (const s of students.value) {
      if (s.completedLessons && Array.isArray(s.completedLessons)) {
        for (const lessonId of s.completedLessons) {
          if (m.lessons.some((l) => l.id === lessonId || `${m.id}:${l.id}` === lessonId)) {
            completedInModule++
          }
        }
      }
    }

    const totalPossible = totalStudents * m.lessons.length
    const rate = totalPossible > 0 ? Math.round((completedInModule / totalPossible) * 100) : 0
    return {
      title: m.title,
      icon: m.icon,
      count: m.lessons.length,
      completionRate: rate,
    }
  })
})

// Hardest lessons analytics calculated strictly from real skips
interface HardestLessonItem {
  id: string
  title: string
  module: string
  difficulty: string
  skips: number
}

const hardestLessons = computed<HardestLessonItem[]>(() => {
  const skipCounts = new Map<string, number>()
  for (const s of students.value) {
    if (s.skippedLessons && Array.isArray(s.skippedLessons)) {
      for (const lessonId of s.skippedLessons) {
        skipCounts.set(lessonId, (skipCounts.get(lessonId) || 0) + 1)
      }
    }
  }

  const result: HardestLessonItem[] = []
  for (const [key, count] of skipCounts.entries()) {
    const parts = key.includes(':') ? key.split(':') : ['', key]
    const found = flatLessons.find((fl) => fl.lesson.id === parts[1] || fl.lesson.id === key)
    if (found) {
      result.push({
        id: key,
        title: found.lesson.title,
        module: found.module.title,
        difficulty:
          found.lesson.xp >= 150
            ? 'Высокая'
            : found.lesson.xp >= 80
              ? 'Средняя'
              : 'Базовая',
        skips: count,
      })
    } else {
      result.push({
        id: key,
        title: key,
        module: parts[0] || 'Курс',
        difficulty: 'Средняя',
        skips: count,
      })
    }
  }

  return result.sort((a, b) => b.skips - a.skips).slice(0, 10)
})

async function runAiLabTest() {
  aiTesting.value = true
  aiTestResult.value = null
  try {
    aiTestResult.value = await requestAiHint(
      {
        code: testCode.value,
        prompt: testPrompt.value,
        compileError: testError.value.includes('Error') ? testError.value : undefined,
        failedTests: [
          {
            name: 'Проверка условия задачи',
            expected: 'Корректный результат',
            actual: testError.value,
          },
        ],
      },
      settings.geminiApiKey,
      settings.aiProvider,
    )
  } catch {
    aiTestResult.value = null
  } finally {
    aiTesting.value = false
  }
}

function giveReward(student: StudentRecord, amount: number) {
  admin.rewardStudentXp(student.id, amount)
  student.totalXp += amount
  student.level = Math.floor(Math.sqrt(student.totalXp / 100)) + 1
  alert(`Начислено +${amount} XP пользователю ${student.displayName}!`)
}

function exportPlatformReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    metrics: {
      totalStudents: students.value.length,
      totalXp: totalPlatformXp.value,
      avgStreak: avgStreak.value,
      juniorReady: juniorReadyCount.value,
    },
    funnel: funnelData.value,
    hardestLessons: hardestLessons.value,
    students: students.value,
  }
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `codequest-admin-report-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function exportStudentsCsv() {
  const headers = ['ID', 'Email', 'Имя', 'Уровень', 'XP', 'Стрик', 'Пройдено уроков', 'Пропущено', 'Облако']
  const rows = students.value.map((s) => [
    s.id,
    s.email,
    s.displayName,
    s.level,
    s.totalXp,
    s.streak,
    s.completedLessonsCount,
    s.skippedLessonsCount,
    s.isCloud ? 'Да' : 'Нет',
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'students.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="admin container">
    <!-- Login Screen if not authenticated -->
    <div v-if="!admin.isAdminAuthenticated" class="admin__gate card panel-3d">
      <div class="admin__gate-icon">🛡️</div>
      <h1 class="admin__gate-title">Панель управления CodeQuest</h1>
      <p class="admin__gate-desc">
        Вход для преподавателей, методистов и администраторов платформы
      </p>

      <form class="admin__gate-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Секретный пароль администратора</label>
          <input
            v-model="pinInput"
            type="password"
            placeholder="••••••••"
            class="form-input"
            required
            autofocus
          />
        </div>
        <div v-if="pinError" class="admin__gate-err">{{ pinError }}</div>
        <button type="submit" class="btn btn--primary btn--lg full-w">
          Войти в панель администратора
        </button>
      </form>
    </div>

    <!-- Authenticated Dashboard -->
    <div v-else class="admin__dashboard">
      <header class="admin__header">
        <div class="admin__header-info">
          <div class="eyebrow">// security clearance: level 5</div>
          <h1 class="admin__title">Панель администратора CodeQuest</h1>
        </div>

        <div class="admin__header-actions">
          <button
            class="btn btn--sm"
            :class="admin.godModeUnlocked ? 'btn--accent' : 'btn--ghost'"
            @click="admin.toggleGodMode"
            title="Открывает доступ ко всем урокам сразу для проверки контента"
          >
            {{ admin.godModeUnlocked ? '⚡ Режим Бога: ВКЛ' : '🔓 Режим Бога: ВЫКЛ' }}
          </button>
          <button class="btn btn--ghost btn--sm" @click="admin.deauthenticate">
            🚪 Выйти
          </button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <nav class="admin__nav">
        <button
          class="admin__tab"
          :class="{ active: activeTab === 'metrics' }"
          @click="activeTab = 'metrics'"
        >
          📊 Метрики платформы
        </button>
        <button
          class="admin__tab"
          :class="{ active: activeTab === 'students' }"
          @click="activeTab = 'students'"
        >
          👥 Студенты ({{ students.length }})
        </button>
        <button
          class="admin__tab"
          :class="{ active: activeTab === 'aiLab' }"
          @click="activeTab = 'aiLab'"
        >
          🤖 Лаборатория Байта
        </button>
        <button
          class="admin__tab"
          :class="{ active: activeTab === 'course' }"
          @click="activeTab = 'course'"
        >
          🗺️ Уроки и экспорт
        </button>
      </nav>

      <!-- TAB 1: METRICS -->
      <section v-if="activeTab === 'metrics'" class="admin__section">
        <div class="kpi-grid">
          <div class="card kpi">
            <div class="kpi__icon">👥</div>
            <div class="kpi__num">{{ students.length }}</div>
            <div class="kpi__label">Всего студентов</div>
          </div>
          <div class="card kpi">
            <div class="kpi__icon">✨</div>
            <div class="kpi__num">{{ totalPlatformXp.toLocaleString() }}</div>
            <div class="kpi__label">Суммарный XP платформы</div>
          </div>
          <div class="card kpi">
            <div class="kpi__icon">🔥</div>
            <div class="kpi__num">{{ avgStreak }} дн.</div>
            <div class="kpi__label">Средний стрик</div>
          </div>
          <div class="card kpi">
            <div class="kpi__icon">🎓</div>
            <div class="kpi__num">{{ juniorReadyCount }}</div>
            <div class="kpi__label">Готовы к первой работе</div>
          </div>
        </div>

        <!-- Course Funnel -->
        <div class="card admin__card">
          <div class="admin__card-head">
            <h2 class="admin__card-title">📈 Воронка прохождения модулей курса</h2>
            <span class="mono admin__card-meta">{{ course.modules.length }} миров · Реальные данные</span>
          </div>
          <div class="funnel">
            <div v-for="(m, i) in funnelData" :key="i" class="funnel__row">
              <div class="funnel__name">
                <span class="funnel__icon">{{ m.icon }}</span>
                <span>{{ m.title }}</span>
              </div>
              <div class="funnel__bar-bg">
                <div class="funnel__bar-fill" :style="{ width: m.completionRate + '%' }" />
              </div>
              <div class="funnel__pct mono">{{ m.completionRate }}%</div>
            </div>
          </div>
        </div>

        <!-- Hardest & Skipped Lessons -->
        <div class="card admin__card">
          <div class="admin__card-head">
            <h2 class="admin__card-title">⚠️ Аналитика трудностей: уроки с наибольшим числом пропусков</h2>
            <span class="mono admin__card-meta">Сигналы для методистов</span>
          </div>

          <div v-if="hardestLessons.length > 0" class="table-responsive">
            <table class="admin__table">
              <thead>
                <tr>
                  <th>Урок</th>
                  <th>Модуль</th>
                  <th>Сложность</th>
                  <th>Пропусков (Skip)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(l, i) in hardestLessons" :key="i">
                  <td class="font-bold">{{ l.title }}</td>
                  <td>{{ l.module }}</td>
                  <td>
                    <span class="badge badge--warn">{{ l.difficulty }}</span>
                  </td>
                  <td class="mono font-bold">{{ l.skips }} ⏩</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin__empty-state">
            <div class="admin__empty-icon">✨</div>
            <div class="admin__empty-title">Пропусков уроков пока не зафиксировано</div>
            <p class="admin__empty-desc">
              Здесь появится реальный рейтинг уроков, когда ученики начнут пропускать сложные темы через кнопку «Пропустить урок».
            </p>
          </div>
        </div>
      </section>

      <!-- TAB 2: STUDENTS -->
      <section v-else-if="activeTab === 'students'" class="admin__section">
        <div class="admin__toolbar">
          <input
            v-model="studentSearch"
            type="text"
            placeholder="🔍 Поиск по имени или email…"
            class="form-input admin__search"
          />
          <button class="btn btn--ghost btn--sm" @click="loadStudents">
            ↺ Обновить
          </button>
          <button class="btn btn--primary btn--sm" @click="exportStudentsCsv">
            ⬇ Экспорт в CSV
          </button>
        </div>

        <div class="card admin__card no-pad">
          <div v-if="filteredStudents.length > 0" class="table-responsive">
            <table class="admin__table">
              <thead>
                <tr>
                  <th>Ученик</th>
                  <th>Уровень & XP</th>
                  <th>Стрик</th>
                  <th>Пройдено</th>
                  <th>Пропущено</th>
                  <th>Синхронизация</th>
                  <th>Действия наставника</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in filteredStudents" :key="s.id">
                  <td>
                    <div class="student-cell">
                      <span class="student-cell__avatar">{{ s.avatar }}</span>
                      <div>
                        <div class="student-cell__name">{{ s.displayName }}</div>
                        <div class="student-cell__email mono">{{ s.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="mono font-bold">lvl {{ s.level }}</div>
                    <div class="text-dim text-xs mono">{{ s.totalXp }} XP</div>
                  </td>
                  <td class="mono font-bold">{{ s.streak }} 🔥</td>
                  <td class="mono">{{ s.completedLessonsCount }}</td>
                  <td class="mono">{{ s.skippedLessonsCount }} ⏩</td>
                  <td>
                    <span class="badge" :class="s.isCloud ? 'badge--cloud' : 'badge--local'">
                      {{ s.isCloud ? '☁️ Онлайн' : '💻 Локально' }}
                    </span>
                  </td>
                  <td>
                    <div class="student-actions">
                      <button class="btn btn--xs" @click="giveReward(s, 100)">
                        +100 XP
                      </button>
                      <button class="btn btn--xs" @click="giveReward(s, 500)">
                        +500 XP
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin__empty-state">
            <div class="admin__empty-icon">👥</div>
            <div class="admin__empty-title">Ученики не найдены</div>
            <p class="admin__empty-desc">
              {{
                studentSearch
                  ? 'По запросу ничего не найдено. Попробуйте изменить параметры поиска.'
                  : 'Зарегистрированных пользователей пока нет. Они появятся здесь при регистрации или первом сохранении прогресса.'
              }}
            </p>
          </div>
        </div>
      </section>

      <!-- TAB 3: AI LAB (REDESIGNED) -->
      <section v-else-if="activeTab === 'aiLab'" class="admin__section">
        <div class="card admin__card">
          <div class="ai-lab__head">
            <div class="ai-lab__intro">
              <span class="ai-lab__mascot-badge">🤖</span>
              <div>
                <h2 class="admin__card-title">Лаборатория Байта: симулятор Сократических подсказок</h2>
                <p class="ai-lab__subtitle">
                  Проверьте, как ИИ-наставник формулирует наводящие подсказки к ошибкам учеников без раскрытия готового кода
                </p>
              </div>
            </div>
            <div class="ai-lab__provider-pill mono">
              ⚡ Активен: {{ settings.aiProvider === 'gemini' ? 'Google Gemini API' : 'Pollinations AI (Бесплатный)' }}
            </div>
          </div>

          <!-- Quick Presets -->
          <div class="ai-lab__presets-wrap">
            <span class="ai-lab__presets-label">Готовые кейсы для проверки:</span>
            <div class="ai-lab__presets">
              <button
                v-for="(p, idx) in labPresets"
                :key="idx"
                class="ai-lab__preset-chip"
                @click="applyPreset(p)"
              >
                {{ p.name }}
              </button>
            </div>
          </div>

          <!-- 2-Column Playground -->
          <div class="ai-lab__grid">
            <!-- Left Column: Input workbench -->
            <div class="ai-lab__col card ai-lab__workbench">
              <div class="ai-lab__col-header">
                <span class="mono eyebrow">INPUT WORKBENCH</span>
                <span class="text-xs text-dim">Симуляция проблемы студента</span>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span>📝</span>
                  <span>Условие задачи для ученика:</span>
                </label>
                <input
                  v-model="testPrompt"
                  class="form-input"
                  placeholder="Опишите, что требовалось сделать..."
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span>⌨️</span>
                  <span>Код студента с ошибкой:</span>
                </label>
                <div class="code-editor-box">
                  <div class="code-editor-box__bar">
                    <span class="dot-red" />
                    <span class="dot-yellow" />
                    <span class="dot-green" />
                    <span class="code-editor-box__filename mono">solution.js</span>
                    <span class="code-editor-box__lang mono">js</span>
                  </div>
                  <textarea
                    v-model="testCode"
                    class="code-editor-box__textarea mono"
                    rows="8"
                    placeholder="// Вставьте код с ошибкой..."
                    spellcheck="false"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span>⚠</span>
                  <span>Ошибка тестов или вывод консоли:</span>
                </label>
                <input
                  v-model="testError"
                  class="form-input mono"
                  placeholder="Expected: ..., Got: ..."
                />
              </div>

              <button
                class="btn btn--primary btn--lg full-w ai-lab__run-btn"
                :disabled="aiTesting"
                @click="runAiLabTest"
              >
                <span v-if="aiTesting" class="spinner-sm" />
                <span v-else>▶</span>
                <span>{{ aiTesting ? 'Байт формулирует наводку…' : 'Запустить симуляцию ответа Байта' }}</span>
              </button>
            </div>

            <!-- Right Column: Byte's Preview -->
            <div class="ai-lab__col card ai-lab__preview">
              <div class="ai-lab__col-header">
                <span class="mono eyebrow">BYTE SOCRATIC RESPONSE</span>
                <span class="text-xs text-dim">Результат работы наставника</span>
              </div>

              <div v-if="aiTesting" class="ai-lab__waiting">
                <div class="ai-lab__waiting-mascot">🤖</div>
                <div class="ai-lab__waiting-title">Байт анализирует код и ошибку…</div>
                <p class="ai-lab__waiting-desc">
                  Ищем корень проблемы, выстраиваем педагогическую логику и формулируем сократический вопрос без прямого ответа.
                </p>
                <div class="spinner-sm" style="margin: var(--sp-3) auto 0;" />
              </div>

              <div v-else-if="aiTestResult" class="ai-bubble">
                <div class="ai-bubble__head">
                  <div class="ai-bubble__author">
                    <span class="ai-bubble__avatar">🤖</span>
                    <div>
                      <div class="ai-bubble__name">Байт (AI Coach)</div>
                      <div class="ai-bubble__source mono">
                        {{
                          aiTestResult.source === 'ai'
                            ? '✨ Ответ получен от онлайн-ИИ'
                            : '⚡ Автономный эвристический анализ'
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ai-bubble__content">
                  <h3 class="ai-bubble__title">{{ aiTestResult.title }}</h3>

                  <div class="ai-bubble__section">
                    <div class="ai-bubble__label">📌 В чем суть проблемы:</div>
                    <p class="ai-bubble__text">{{ aiTestResult.explanation }}</p>
                  </div>

                  <div v-if="aiTestResult.cause" class="ai-bubble__section">
                    <div class="ai-bubble__label">🔍 Возможная причина:</div>
                    <p class="ai-bubble__text">{{ aiTestResult.cause }}</p>
                  </div>

                  <div class="ai-bubble__tip-box">
                    <div class="ai-bubble__tip-label">💡 Сократическая подсказка (без спойлера ответа):</div>
                    <p class="ai-bubble__tip-text">{{ aiTestResult.socraticHint }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="ai-lab__placeholder">
                <div class="ai-lab__placeholder-mascot">🤖</div>
                <h3 class="ai-lab__placeholder-title">Готов к проверке</h3>
                <p class="ai-lab__placeholder-desc">
                  Выберите один из пресетов сверху или измените код слева, затем нажмите «Запустить симуляцию ответа Байта».
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 4: COURSE & EXPORT -->
      <section v-else class="admin__section">
        <div class="card admin__card">
          <div class="admin__card-head">
            <h2 class="admin__card-title">🗺️ Структура курса CodeQuest</h2>
            <span class="mono admin__card-meta">{{ flatLessons.length }} уроков в программе</span>
          </div>

          <div class="admin__export-btns">
            <button class="btn btn--primary" @click="exportPlatformReport">
              ⬇ Скачать полный аналитический отчёт (JSON)
            </button>
            <button class="btn btn--ghost" @click="exportStudentsCsv">
              ⬇ Экспорт базы студентов (CSV)
            </button>
          </div>

          <div class="course-tree">
            <div v-for="m in course.modules" :key="m.id" class="course-tree__module card">
              <div class="course-tree__module-head">
                <span class="course-tree__icon">{{ m.icon }}</span>
                <strong>{{ m.title }}</strong>
                <span class="mono text-dim text-xs">({{ m.lessons.length }} ур.)</span>
              </div>
              <ul class="course-tree__lessons">
                <li v-for="l in m.lessons" :key="l.id" class="course-tree__lesson">
                  <span>{{ l.icon }} {{ l.title }}</span>
                  <span class="mono text-dim text-xs">+{{ l.xp }} XP · {{ l.steps.length }} шагов</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin {
  padding-top: var(--sp-6);
  padding-bottom: var(--sp-8);
  max-width: 1140px;
}

.admin__gate {
  max-width: 480px;
  margin: var(--sp-8) auto;
  text-align: center;
  padding: var(--sp-6);
}

.admin__gate-icon {
  font-size: 3rem;
  margin-bottom: var(--sp-2);
}

.admin__gate-title {
  margin: 0 0 var(--sp-1);
  font-size: 1.5rem;
}

.admin__gate-desc {
  margin: 0 0 var(--sp-5);
  font-size: 0.9rem;
  color: var(--text-muted);
}

.admin__gate-form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  text-align: left;
}

.admin__gate-err {
  color: var(--danger);
  font-size: 0.85rem;
}

.admin__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-5);
  flex-wrap: wrap;
  gap: var(--sp-3);
}

.admin__title {
  margin: 4px 0 0;
  font-size: 1.6rem;
}

.admin__header-actions {
  display: flex;
  gap: var(--sp-2);
  flex-wrap: wrap;
}

.admin__nav {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-5);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--sp-2);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.admin__tab {
  background: none;
  border: none;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--text-muted);
  border-radius: var(--r-sm);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--dur-fast) var(--ease);
}

.admin__tab:hover {
  color: var(--text);
  background: var(--surface-2);
}

.admin__tab.active {
  color: var(--ink-inverse);
  background: var(--ink);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
}

.kpi {
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi__icon {
  font-size: 1.6rem;
}

.kpi__num {
  font-size: 1.8rem;
  font-family: var(--font-mono);
  font-weight: 700;
}

.kpi__label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.admin__card {
  padding: var(--sp-5);
  margin-bottom: var(--sp-5);
}

.admin__card.no-pad {
  padding: 0;
  overflow: hidden;
}

.admin__card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-4);
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.admin__card-title {
  margin: 0;
  font-size: 1.15rem;
}

.admin__card-meta {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.funnel {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.funnel__row {
  display: grid;
  grid-template-columns: 220px 1fr 60px;
  align-items: center;
  gap: var(--sp-3);
}

.funnel__name {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 0.9rem;
  font-weight: 500;
}

.funnel__bar-bg {
  height: 10px;
  background: var(--surface-3);
  border-radius: var(--r-full);
  overflow: hidden;
}

.funnel__bar-fill {
  height: 100%;
  background: var(--accent, var(--text));
  border-radius: var(--r-full);
  transition: width var(--dur-slow) var(--ease);
}

.funnel__pct {
  text-align: right;
  font-size: 0.85rem;
  color: var(--text-dim);
}

.admin__table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
  white-space: nowrap;
}

.admin__table th {
  padding: 10px 14px;
  background: var(--surface-2);
  color: var(--text-dim);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.admin__table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.admin__empty-state {
  padding: var(--sp-7) var(--sp-4);
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
}

.admin__empty-icon {
  font-size: 2.2rem;
  margin-bottom: var(--sp-2);
}

.admin__empty-title {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: var(--sp-1);
}

.admin__empty-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--r-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--warn {
  background: var(--warning-soft);
  color: var(--warning);
}

.badge--cloud {
  background: var(--success-soft);
  color: var(--success);
}

.badge--local {
  background: var(--surface-3);
  color: var(--text-dim);
}

.admin__toolbar {
  display: flex;
  gap: var(--sp-2);
  align-items: center;
  margin-bottom: var(--sp-3);
  flex-wrap: wrap;
}

.admin__search {
  flex: 1;
  min-width: 220px;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.student-cell__avatar {
  font-size: 1.5rem;
}

.student-cell__name {
  font-weight: 600;
}

.student-cell__email {
  font-size: 0.78rem;
  color: var(--text-dim);
}

.student-actions {
  display: flex;
  gap: 4px;
}

/* AI LAB STYLES (REDESIGNED) */
.ai-lab__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--sp-4);
  gap: var(--sp-3);
  flex-wrap: wrap;
}

.ai-lab__intro {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.ai-lab__mascot-badge {
  font-size: 2.2rem;
  padding: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.ai-lab__subtitle {
  margin: 2px 0 0;
  font-size: 0.88rem;
  color: var(--text-muted);
  max-width: 600px;
}

.ai-lab__provider-pill {
  font-size: 0.76rem;
  padding: 4px 10px;
  background: var(--surface-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--r-full);
  color: var(--text-dim);
}

.ai-lab__presets-wrap {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
  padding: var(--sp-2) var(--sp-3);
  background: var(--surface-2);
  border-radius: var(--r-md);
  flex-wrap: wrap;
}

.ai-lab__presets-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.ai-lab__presets {
  display: flex;
  gap: var(--sp-2);
  flex-wrap: wrap;
}

.ai-lab__preset-chip {
  background: var(--surface-3);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--r-full);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease);
}

.ai-lab__preset-chip:hover {
  background: var(--surface-hover);
  border-color: var(--line-bright);
}

.ai-lab__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
  align-items: stretch;
}

.ai-lab__col {
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
}

.ai-lab__col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-3);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border);
}

.code-editor-box {
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--bg-3);
}

.code-editor-box__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.dot-red,
.dot-yellow,
.dot-green {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.dot-red {
  background: #ff5f57;
}
.dot-yellow {
  background: #febc2e;
}
.dot-green {
  background: #28c840;
}

.code-editor-box__filename {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: 6px;
}

.code-editor-box__lang {
  margin-left: auto;
  font-size: 0.7rem;
  color: var(--text-dim);
  text-transform: uppercase;
}

.code-editor-box__textarea {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text);
  padding: 12px 14px;
  font-size: 0.88rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 180px;
  outline: none;
}

.ai-lab__run-btn {
  margin-top: auto;
  padding: 12px;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border);
  border-top-color: var(--text);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.ai-lab__waiting {
  margin: auto 0;
  text-align: center;
  padding: var(--sp-6) var(--sp-4);
}

.ai-lab__waiting-mascot {
  font-size: 2.8rem;
  animation: float 2s ease-in-out infinite;
}

.ai-lab__waiting-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin: var(--sp-2) 0 var(--sp-1);
}

.ai-lab__waiting-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  max-width: 380px;
  margin: 0 auto;
}

.ai-bubble {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.ai-bubble__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border);
}

.ai-bubble__author {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.ai-bubble__avatar {
  font-size: 1.8rem;
}

.ai-bubble__name {
  font-weight: 700;
  font-size: 0.95rem;
}

.ai-bubble__source {
  font-size: 0.72rem;
  color: var(--text-dim);
}

.ai-bubble__content {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.ai-bubble__title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text);
}

.ai-bubble__section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-bubble__label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ai-bubble__text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--text);
}

.ai-bubble__tip-box {
  margin-top: var(--sp-2);
  padding: var(--sp-3) var(--sp-4);
  background: color-mix(in srgb, var(--warning) 12%, var(--surface-3));
  border-left: 3px solid var(--warning);
  border-radius: var(--r-sm);
}

.ai-bubble__tip-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--warning);
  margin-bottom: 4px;
}

.ai-bubble__tip-text {
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.5;
  color: var(--text);
}

.ai-lab__placeholder {
  margin: auto 0;
  text-align: center;
  padding: var(--sp-6) var(--sp-4);
}

.ai-lab__placeholder-mascot {
  font-size: 3rem;
  margin-bottom: var(--sp-2);
  opacity: 0.8;
}

.ai-lab__placeholder-title {
  margin: 0 0 var(--sp-1);
  font-size: 1.15rem;
}

.ai-lab__placeholder-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  max-width: 360px;
  margin: 0 auto;
  line-height: 1.5;
}

.admin__export-btns {
  display: flex;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
  flex-wrap: wrap;
}

.course-tree {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--sp-3);
}

.course-tree__module {
  padding: var(--sp-3);
}

.course-tree__module-head {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
}

.course-tree__lessons {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.82rem;
}

.course-tree__lesson {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  border-top: 1px solid var(--border);
}

.full-w {
  width: 100%;
}

@media (max-width: 880px) {
  .ai-lab__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .admin__header {
    flex-direction: column;
    align-items: flex-start;
  }
  .funnel__row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .funnel__pct {
    text-align: left;
  }
}
</style>
