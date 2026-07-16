<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CodeStep } from '@/content/types'
import { runCode } from '@/engine/codeRunner'
import type { RunOutcome } from '@/engine/runnerTypes'
import type { EditorLang } from '@/engine/editorSetup'
import CodeMirrorEditor from '@/components/CodeMirrorEditor.vue'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: CodeStep }>()
const emit = defineEmits<{ solved: [firstTry: boolean] }>()

const { t } = useI18n()

const editorLang = computed<EditorLang>(() => (props.step.lang === 'ts' ? 'ts' : 'js'))
const solutionCode = ref(props.step.solution ?? '')
const code = ref(props.step.starter)
const running = ref(false)
const outcome = ref<RunOutcome | null>(null)
const shownHints = ref(0)
const showSolution = ref(false)
const usedSolution = ref(false)
const solved = ref(false)

async function run() {
  const missing = (props.step.mustUse ?? []).filter((m) => !code.value.includes(m))
  if (missing.length > 0) {
    outcome.value = {
      ok: false,
      allPassed: false,
      logs: [],
      compileError: `${t('lesson.mustUse')} ${missing.map((m) => `«${m}»`).join(', ')}`,
    }
    return
  }
  running.value = true
  outcome.value = null
  outcome.value = await runCode({
    code: code.value,
    entry: props.step.entry ?? '',
    tests: props.step.tests ?? [],
    expectedLogs: props.step.expectedOutput,
  })
  running.value = false

  if (outcome.value.allPassed && !solved.value) {
    solved.value = true
    emit('solved', !usedSolution.value)
  }
}

function resetCode() {
  code.value = props.step.starter
  outcome.value = null
}

function revealHint() {
  if (props.step.hints && shownHints.value < props.step.hints.length) {
    shownHints.value++
  }
}

function toggleSolution() {
  showSolution.value = !showSolution.value
  if (showSolution.value) usedSolution.value = true
}
</script>

<template>
  <div class="code">
    <h2>{{ step.title }}</h2>
    <MarkdownBlock :source="step.prompt" class="code__prompt" />

    <div v-if="step.expectedOutput" class="code__expected">
      <div class="code__expected-label">{{ t('lesson.expectedOutput') }}</div>
      <pre
        v-for="(line, i) in step.expectedOutput"
        :key="i"
        class="code__expected-line"
      ><span class="code__expected-arrow">›</span> {{ line }}</pre>
    </div>

    <div class="code__editor card">
      <CodeMirrorEditor v-model="code" :lang="editorLang" />
    </div>

    <div class="code__actions">
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
      <button v-if="step.solution" class="btn btn--ghost" @click="toggleSolution">
        {{ showSolution ? t('lesson.hideSolution') : t('lesson.showSolution') }}
      </button>
    </div>

    <div v-if="shownHints > 0" class="code__hints">
      <div v-for="i in shownHints" :key="i" class="code__hint">
        <span>💡</span>
        <MarkdownBlock :source="step.hints![i - 1]" />
      </div>
    </div>

    <div v-if="showSolution && step.solution" class="code__solution">
      <div class="code__solution-label">{{ t('lesson.solution') }}</div>
      <div class="code__editor card">
        <CodeMirrorEditor v-model="solutionCode" :lang="editorLang" readonly />
      </div>
    </div>

    <div v-if="outcome" class="results" :class="{ 'results--ok': outcome.allPassed }">
      <div v-if="outcome.compileError" class="results__error">
        {{ outcome.compileError }}
      </div>

      <template v-else>
        <div class="results__banner" :class="outcome.allPassed ? 'is-ok' : 'is-bad'">
          {{ outcome.allPassed ? t('lesson.allTestsPassed') : t('lesson.someTestsFailed') }}
        </div>

        <div class="results__tests">
          <div
            v-for="(r, i) in outcome.results"
            :key="i"
            class="tcase"
            :class="r.passed ? 'tcase--pass' : 'tcase--fail'"
          >
            <span class="tcase__icon">{{ r.passed ? '✓' : '✗' }}</span>
            <div class="tcase__body">
              <div class="tcase__name">{{ r.name }}</div>
              <div v-if="!r.passed && r.error" class="tcase__detail">⚠ {{ r.error }}</div>
              <div v-else-if="!r.passed" class="tcase__detail">
                {{ t('lesson.expected') }}: <code>{{ r.expected }}</code> · {{ t('lesson.got') }}:
                <code>{{ r.actual }}</code>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-if="outcome.logs && outcome.logs.length" class="results__console">
        <div class="results__console-label">{{ t('lesson.console') }}</div>
        <pre v-for="(line, i) in outcome.logs" :key="i" class="results__log">{{ line }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code {
  animation: fade-up var(--dur) var(--ease);
}
.code__prompt {
  margin-bottom: var(--sp-4);
  font-size: 1.02rem;
}
.code__expected {
  margin-bottom: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}
.code__expected-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 4px;
}
.code__expected-line {
  margin: 0;
  padding: 2px 0;
  border: none;
  background: none;
  font-size: 0.9rem;
  color: var(--text);
}
.code__expected-arrow {
  color: var(--text-dim);
}
.code__editor {
  height: 300px;
  overflow: hidden;
  padding: 0;
  resize: vertical;
}
.code__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin: var(--sp-3) 0;
}
.code__hints {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}
.code__hint {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--warning-soft);
  border-radius: var(--r-md);
  font-size: 0.95rem;
}
.code__hint :deep(p) {
  margin: 0;
}
.code__solution {
  margin-bottom: var(--sp-3);
}
.code__solution-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.results {
  margin-top: var(--sp-4);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.results__error {
  padding: var(--sp-3) var(--sp-4);
  background: var(--danger-soft);
  color: var(--danger);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  white-space: pre-wrap;
}
.results__banner {
  padding: var(--sp-3) var(--sp-4);
  font-weight: 700;
}
.results__banner.is-ok {
  background: var(--success-soft);
  color: var(--success);
}
.results__banner.is-bad {
  background: var(--warning-soft);
  color: var(--warning);
}
.results__tests {
  display: flex;
  flex-direction: column;
}
.tcase {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-top: 1px solid var(--border);
}
.tcase__icon {
  font-weight: 800;
  flex: 0 0 auto;
}
.tcase--pass .tcase__icon {
  color: var(--success);
}
.tcase--fail .tcase__icon {
  color: var(--danger);
}
.tcase__name {
  font-family: var(--font-mono);
  font-size: 0.88rem;
}
.tcase__detail {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 4px;
}
.results__console {
  border-top: 1px solid var(--border);
  padding: var(--sp-3) var(--sp-4);
  background: var(--bg-elevated);
}
.results__console-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 4px;
}
.results__log {
  margin: 0;
  padding: 2px 0;
  border: none;
  background: none;
  font-size: 0.85rem;
  color: var(--accent-cyan);
}
</style>
