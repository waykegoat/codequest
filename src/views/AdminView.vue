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
    pinError.value = 'Неверный PIN-код (попробуйте admin123 или codequest)'
  }
}

const filteredStudents = computed(() => {
  if (!studentSearch.value.trim()) return students.value
  const q = studentSearch.value.toLowerCase()
  return students.value.filter(
    (s) => s.displayName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
  )
})

// Metrics calculations
const totalPlatformXp = computed(() => students.value.reduce((sum, s) => sum + s.totalXp, 0))
const avgStreak = computed(() =>
  students.value.length ? Math.round(students.value.reduce((sum, s) => sum + s.streak, 0) / students.value.length) : 0,
)
const juniorReadyCount = computed(() => students.value.filter((s) => s.level >= 13).length)

// Funnel calculations
const funnelData = computed(() =>
  course.modules.map((m, idx) => {
    // Progress drop-off model
    const pct = Math.max(12, Math.round(100 - idx * 7.5))
    return {
      title: m.title,
      icon: m.icon,
      count: m.lessons.length,
      completionRate: pct,
    }
  }),
)

// Hardest lessons analytics
const hardestLessons = [
  { title: 'Асинхронность и Event Loop', module: 'Асинхронность', difficulty: 'Высокая', skips: 18, aiHints: 34 },
  { title: 'Замыкания и области видимости', module: 'JS: глубже', difficulty: 'Высокая', skips: 14, aiHints: 29 },
  { title: 'SQL: JOIN и агрегатные функции', module: 'Базы данных', difficulty: 'Средняя', skips: 11, aiHints: 22 },
  { title: 'Рекурсия и структуры данных', module: 'Алгоритмы', difficulty: 'Высокая', skips: 9, aiHints: 19 },
  { title: 'TypeScript: Дженерики', module: 'TypeScript', difficulty: 'Высокая', skips: 8, aiHints: 17 },
]

async function runAiLabTest() {
  aiTesting.value = true
  aiTestResult.value = null
  try {
    aiTestResult.value = await requestAiHint(
      {
        code: testCode.value,
        prompt: testPrompt.value,
        failedTests: [
          {
            name: 'Сумма корзины',
            expected: '150',
            actual: '[50, 100]',
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
          <label class="form-label">PIN-код администратора</label>
          <input
            v-model="pinInput"
            type="password"
            placeholder="например: admin123"
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
      <div class="admin__gate-hint">
        Подсказка для тестирования: PIN <code>admin123</code> или <code>codequest</code>
      </div>
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
            <span class="mono admin__card-meta">{{ course.modules.length }} миров</span>
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
            <h2 class="admin__card-title">⚠️ Аналитика трудностей: топ уроков по числу подсказок и пропусков</h2>
            <span class="mono admin__card-meta">Метрики внимания авторов</span>
          </div>
          <table class="admin__table">
            <thead>
              <tr>
                <th>Урок</th>
                <th>Модуль</th>
                <th>Сложность</th>
                <th>Пропусков (Skip)</th>
                <th>Запросов к Байту</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(l, i) in hardestLessons" :key="i">
                <td class="font-bold">{{ l.title }}</td>
                <td>{{ l.module }}</td>
                <td>
                  <span class="badge badge--warn">{{ l.difficulty }}</span>
                </td>
                <td class="mono font-bold">{{ l.skips }}</td>
                <td class="mono font-bold">{{ l.aiHints }}</td>
              </tr>
            </tbody>
          </table>
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
            ↺ Обновить список
          </button>
          <button class="btn btn--primary btn--sm" @click="exportStudentsCsv">
            ⬇ Экспорт в CSV
          </button>
        </div>

        <div class="card admin__card no-pad">
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
      </section>

      <!-- TAB 3: AI LAB -->
      <section v-else-if="activeTab === 'aiLab'" class="admin__section">
        <div class="card admin__card">
          <div class="admin__card-head">
            <h2 class="admin__card-title">🤖 Лаборатория Байта: проверка Сократических подсказок</h2>
            <span class="mono admin__card-meta">Симуляция ошибки ученика</span>
          </div>
          <p class="text-muted">
            Здесь вы можете проверить, как Байт реагирует на типичные ошибки новичков, и убедиться, что он объясняет суть проблемы, не спойлеря готовое решение.
          </p>

          <div class="ai-lab-form">
            <div class="form-group">
              <label class="form-label">Условие задачи:</label>
              <input v-model="testPrompt" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Код студента с ошибкой:</label>
              <textarea v-model="testCode" class="form-input form-textarea" rows="4" />
            </div>

            <div class="form-group">
              <label class="form-label">Ошибка или результат тестов:</label>
              <input v-model="testError" class="form-input" />
            </div>

            <button class="btn btn--primary" :disabled="aiTesting" @click="runAiLabTest">
              {{ aiTesting ? 'Байт думает…' : '▶ Проверить ответ Байта' }}
            </button>
          </div>

          <div v-if="aiTestResult" class="ai-lab-result card">
            <div class="ai-lab-result__badge mono">
              {{ aiTestResult.source === 'ai' ? '✨ Ответ получен от онлайн-ИИ' : '⚡ Автономный эвристический анализ' }}
            </div>
            <h3 class="ai-lab-result__title">{{ aiTestResult.title }}</h3>
            <p><strong>Суть:</strong> {{ aiTestResult.explanation }}</p>
            <p v-if="aiTestResult.cause"><strong>Причина:</strong> {{ aiTestResult.cause }}</p>
            <p class="ai-lab-result__tip"><strong>💡 Подсказка:</strong> {{ aiTestResult.socraticHint }}</p>
          </div>
        </div>
      </section>

      <!-- TAB 4: COURSE & EXPORT -->
      <section v-else class="admin__section">
        <div class="card admin__card">
          <div class="admin__card-head">
            <h2 class="admin__card-title">🗺️ Структура курса CodeQuest</h2>
            <span class="mono admin__card-meta">{{ flatLessons.length }} уроков</span>
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
  max-width: 1100px;
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

.admin__gate-hint {
  margin-top: var(--sp-4);
  font-size: 0.8rem;
  color: var(--text-dim);
}

.admin__gate-hint code {
  font-family: var(--font-mono);
  background: var(--surface-3);
  padding: 2px 6px;
  border-radius: var(--r-sm);
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
  font-size: 1.7rem;
}

.admin__header-actions {
  display: flex;
  gap: var(--sp-2);
}

.admin__nav {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-5);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--sp-2);
  overflow-x: auto;
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
  background: var(--accent);
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

.ai-lab-form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-top: var(--sp-3);
}

.form-textarea {
  font-family: var(--font-mono);
  font-size: 0.86rem;
  resize: vertical;
}

.ai-lab-result {
  margin-top: var(--sp-4);
  padding: var(--sp-4);
  background: var(--surface-2);
  border-left: 3px solid var(--accent);
}

.ai-lab-result__badge {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-bottom: var(--sp-1);
}

.ai-lab-result__title {
  margin: 0 0 var(--sp-2);
  font-size: 1.05rem;
}

.ai-lab-result__tip {
  margin-top: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--warning-soft);
  border-radius: var(--r-sm);
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
</style>
