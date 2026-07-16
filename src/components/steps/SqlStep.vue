<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SqlStep } from '@/content/types'
import { getSql } from '@/engine/sqlEngine'
import { runSql, type SqlOutcome } from '@/engine/sqlRunner'
import CodeMirrorEditor from '@/components/CodeMirrorEditor.vue'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: SqlStep }>()
const emit = defineEmits<{ solved: [firstTry: boolean] }>()

const { t } = useI18n()

const query = ref(props.step.starter)
const outcome = ref<SqlOutcome | null>(null)
const running = ref(false)
const solved = ref(false)
const shownHints = ref(0)
const showSolution = ref(false)
const usedSolution = ref(false)
const solutionText = ref(props.step.solution)

async function run() {
  running.value = true
  outcome.value = null
  try {
    const SQL = await getSql()
    outcome.value = runSql(
      SQL,
      props.step.schema,
      query.value,
      props.step.solution,
      props.step.verify,
      props.step.orderMatters ?? false,
    )
  } catch (err) {
    outcome.value = { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
  running.value = false

  if (outcome.value.passed && !solved.value) {
    solved.value = true
    emit('solved', !usedSolution.value)
  }
}

function resetCode() {
  query.value = props.step.starter
  outcome.value = null
}

function revealHint() {
  if (props.step.hints && shownHints.value < props.step.hints.length) shownHints.value++
}

function toggleSolution() {
  showSolution.value = !showSolution.value
  if (showSolution.value) usedSolution.value = true
}
</script>

<template>
  <div class="sql">
    <h2>{{ step.title }}</h2>
    <MarkdownBlock :source="step.prompt" class="sql__prompt" />

    <details class="sql__schema">
      <summary>Схема и данные таблиц</summary>
      <pre>{{ step.schema }}</pre>
    </details>

    <div class="sql__editor card">
      <CodeMirrorEditor v-model="query" lang="sql" placeholder="Пиши SQL-запрос здесь…" />
    </div>

    <div class="sql__actions">
      <button class="btn btn--primary" :disabled="running" @click="run">
        <span v-if="running">{{ t('lesson.running') }}</span>
        <span v-else>▶ {{ t('lesson.run') }}</span>
      </button>
      <button class="btn btn--ghost" @click="resetCode">↺ {{ t('lesson.reset') }}</button>
      <button
        v-if="step.hints && shownHints < step.hints.length"
        class="btn btn--ghost"
        @click="revealHint"
      >
        💡 {{ t('lesson.showHint') }}
      </button>
      <button class="btn btn--ghost" @click="toggleSolution">
        {{ showSolution ? t('lesson.hideSolution') : t('lesson.showSolution') }}
      </button>
    </div>

    <div v-if="shownHints > 0" class="sql__hints">
      <div v-for="i in shownHints" :key="i" class="sql__hint">
        <span>💡</span><MarkdownBlock :source="step.hints![i - 1]" />
      </div>
    </div>

    <div v-if="showSolution" class="sql__solution">
      <div class="sql__solution-label">{{ t('lesson.solution') }}</div>
      <div class="sql__editor card">
        <CodeMirrorEditor v-model="solutionText" lang="sql" readonly />
      </div>
    </div>

    <div v-if="outcome" class="sql__out">
      <div v-if="outcome.error" class="sql__error">⚠ {{ outcome.error }}</div>

      <template v-else>
        <div class="sql__banner" :class="outcome.passed ? 'is-ok' : 'is-bad'">
          {{ outcome.passed ? t('lesson.allTestsPassed') : t('lesson.sqlMismatch') }}
        </div>

        <div v-if="outcome.result" class="sql__table-wrap">
          <div class="sql__table-title">{{ t('lesson.yourResult') }}</div>
          <table class="sql__table">
            <thead>
              <tr>
                <th v-for="(c, i) in outcome.result.columns" :key="i">{{ c }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ri) in outcome.result.rows" :key="ri">
                <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
              </tr>
              <tr v-if="outcome.result.rows.length === 0">
                <td :colspan="Math.max(1, outcome.result.columns.length)" class="sql__empty">
                  — пусто —
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!outcome.passed && outcome.expected" class="sql__table-wrap">
          <div class="sql__table-title">{{ t('lesson.expectedResult') }}</div>
          <table class="sql__table sql__table--expected">
            <thead>
              <tr>
                <th v-for="(c, i) in outcome.expected.columns" :key="i">{{ c }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ri) in outcome.expected.rows" :key="ri">
                <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.sql {
  animation: fade-up var(--dur) var(--ease);
}
.sql__prompt {
  margin-bottom: var(--sp-3);
  font-size: 1.02rem;
}
.sql__schema {
  margin-bottom: var(--sp-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--bg-elevated);
  overflow: hidden;
}
.sql__schema summary {
  padding: var(--sp-2) var(--sp-3);
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}
.sql__schema pre {
  margin: 0;
  padding: var(--sp-3);
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  white-space: pre-wrap;
  color: var(--text-muted);
}
.sql__editor {
  height: 240px;
  min-height: 160px;
  overflow: hidden;
  padding: 0;
  resize: vertical;
}
.sql__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin: var(--sp-3) 0;
}
.sql__hints {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}
.sql__hint {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--warning-soft);
  border-radius: var(--r-md);
  font-size: 0.95rem;
}
.sql__hint :deep(p) {
  margin: 0;
}
.sql__solution {
  margin-bottom: var(--sp-3);
}
.sql__solution-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 4px;
}
.sql__out {
  margin-top: var(--sp-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.sql__error {
  padding: var(--sp-3) var(--sp-4);
  background: var(--danger-soft);
  color: var(--danger);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  white-space: pre-wrap;
}
.sql__banner {
  padding: var(--sp-3) var(--sp-4);
  font-weight: 700;
}
.sql__banner.is-ok {
  background: var(--success-soft);
  color: var(--success);
}
.sql__banner.is-bad {
  background: var(--warning-soft);
  color: var(--warning);
}
.sql__table-wrap {
  padding: var(--sp-3) var(--sp-4);
  border-top: 1px solid var(--border);
  overflow-x: auto;
}
.sql__table-title {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: var(--sp-2);
}
.sql__table {
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  width: 100%;
}
.sql__table th,
.sql__table td {
  border: 1px solid var(--border);
  padding: 6px 12px;
  text-align: left;
}
.sql__table th {
  background: var(--bg-elevated);
  color: var(--accent-cyan);
  font-weight: 700;
}
.sql__table--expected th {
  color: var(--success);
}
.sql__empty {
  color: var(--text-dim);
  text-align: center;
}
</style>
