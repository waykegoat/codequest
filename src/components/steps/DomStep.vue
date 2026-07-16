<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DomStep } from '@/content/types'
import {
  buildDomSrcdoc,
  getDomError,
  runDomActions,
  runMarkupChecks,
  type MarkupCheckResult,
} from '@/engine/markupRunner'
import CodeMirrorEditor from '@/components/CodeMirrorEditor.vue'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: DomStep }>()
const emit = defineEmits<{ solved: [firstTry: boolean] }>()

const { t } = useI18n()

const jsCode = ref(props.step.starter)
const iframe = ref<HTMLIFrameElement>()
const results = ref<MarkupCheckResult[]>([])
const runtimeError = ref('')
const solved = ref(false)
const shownHints = ref(0)
const showSolution = ref(false)
const usedSolution = ref(false)

let checkPending = false
let timer: ReturnType<typeof setTimeout> | undefined

function render() {
  if (iframe.value) iframe.value.srcdoc = buildDomSrcdoc(props.step.html, jsCode.value)
}

function onFrameLoad() {
  const win = iframe.value?.contentWindow as unknown as Window | undefined
  if (!win) return
  if (!checkPending) {
    runtimeError.value = getDomError(win)
    return
  }
  checkPending = false
  runDomActions(win, props.step.actions)
  runtimeError.value = getDomError(win)
  results.value = runMarkupChecks(win, props.step.checks)
  if (results.value.every((r) => r.passed) && !solved.value) {
    solved.value = true
    emit('solved', !usedSolution.value)
  }
}

function check() {
  checkPending = true
  render()
}

function resetCode() {
  jsCode.value = props.step.starter
  results.value = []
  runtimeError.value = ''
}

function revealHint() {
  if (props.step.hints && shownHints.value < props.step.hints.length) shownHints.value++
}

function toggleSolution() {
  showSolution.value = !showSolution.value
  if (showSolution.value) {
    usedSolution.value = true
    if (props.step.solution !== undefined) jsCode.value = props.step.solution
  }
}

watch(jsCode, () => {
  clearTimeout(timer)
  timer = setTimeout(render, 300)
})

onMounted(render)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="dom">
    <h2>{{ step.title }}</h2>
    <MarkdownBlock :source="step.prompt" class="dom__prompt" />

    <details class="dom__markup">
      <summary>HTML страницы (только для чтения)</summary>
      <pre>{{ step.html }}</pre>
    </details>

    <div class="dom__workspace">
      <div class="dom__editor card">
        <div class="dom__tabs"><span class="dom__tab dom__tab--active">JavaScript</span></div>
        <div class="dom__editor-body">
          <CodeMirrorEditor v-model="jsCode" lang="js" placeholder="Управляй страницей здесь…" />
        </div>
      </div>

      <div class="dom__preview card">
        <div class="dom__preview-bar">
          <span class="dom__dot" /><span class="dom__dot" /><span class="dom__dot" />
          <span class="dom__preview-title">Живая страница</span>
        </div>
        <iframe
          ref="iframe"
          class="dom__frame"
          title="Живая страница"
          sandbox="allow-same-origin allow-scripts"
          @load="onFrameLoad"
        />
      </div>
    </div>

    <div class="dom__actions">
      <button class="btn btn--primary" @click="check">✓ {{ t('lesson.checkAnswer') }}</button>
      <button class="btn btn--ghost" @click="resetCode">↺ {{ t('lesson.reset') }}</button>
      <button
        v-if="step.hints && shownHints < step.hints.length"
        class="btn btn--ghost"
        @click="revealHint"
      >
        💡 {{ t('lesson.showHint') }}
      </button>
      <button v-if="step.solution !== undefined" class="btn btn--ghost" @click="toggleSolution">
        {{ showSolution ? t('lesson.hideSolution') : t('lesson.showSolution') }}
      </button>
    </div>

    <div v-if="shownHints > 0" class="dom__hints">
      <div v-for="i in shownHints" :key="i" class="dom__hint">
        <span>💡</span><MarkdownBlock :source="step.hints![i - 1]" />
      </div>
    </div>

    <div v-if="runtimeError" class="dom__error">⚠ {{ runtimeError }}</div>

    <div
      v-if="results.length"
      class="checks"
      :class="{ 'checks--ok': results.every((r) => r.passed) }"
    >
      <div class="checks__banner" :class="results.every((r) => r.passed) ? 'is-ok' : 'is-bad'">
        {{
          results.every((r) => r.passed) ? t('lesson.allTestsPassed') : t('lesson.someTestsFailed')
        }}
      </div>
      <div
        v-for="(r, i) in results"
        :key="i"
        class="checks__item"
        :class="r.passed ? 'checks__item--pass' : 'checks__item--fail'"
      >
        <span class="checks__icon">{{ r.passed ? '✓' : '✗' }}</span>
        <div>
          <div class="checks__name">{{ r.name }}</div>
          <div v-if="!r.passed && r.detail" class="checks__detail">{{ r.detail }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dom {
  animation: fade-up var(--dur) var(--ease);
}
.dom__prompt {
  margin-bottom: var(--sp-3);
  font-size: 1.02rem;
}
.dom__markup {
  margin-bottom: var(--sp-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--bg-elevated);
  overflow: hidden;
}
.dom__markup summary {
  padding: var(--sp-2) var(--sp-3);
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}
.dom__markup pre {
  margin: 0;
  padding: var(--sp-3);
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  white-space: pre-wrap;
  color: var(--text-muted);
}
.dom__workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
  min-height: 520px;
}
.dom__editor,
.dom__preview {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}
.dom__tabs {
  display: flex;
  gap: 2px;
  padding: 6px 6px 0;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}
.dom__tab {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--r-sm) var(--r-sm) 0 0;
}
.dom__tab--active {
  background: var(--surface);
  color: var(--accent-cyan);
}
.dom__editor-body {
  flex: 1;
  min-height: 460px;
  background: var(--bg-elevated);
}
.dom__editor-body :deep(.cm-host) {
  height: 100%;
}
.dom__preview-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}
.dom__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--surface-3);
}
.dom__dot:nth-child(1) {
  background: #ff5f57;
}
.dom__dot:nth-child(2) {
  background: #febc2e;
}
.dom__dot:nth-child(3) {
  background: #28c840;
}
.dom__preview-title {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--text-dim);
  font-weight: 600;
}
.dom__frame {
  flex: 1;
  min-height: 460px;
  border: none;
  background: #fff;
  width: 100%;
}
.dom__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin: var(--sp-4) 0 var(--sp-3);
}
.dom__hints {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}
.dom__hint {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--warning-soft);
  border-radius: var(--r-md);
  font-size: 0.95rem;
}
.dom__hint :deep(p) {
  margin: 0;
}
.dom__error {
  padding: var(--sp-3) var(--sp-4);
  margin-bottom: var(--sp-3);
  background: var(--danger-soft);
  color: var(--danger);
  border-radius: var(--r-md);
  font-family: var(--font-mono);
  font-size: 0.88rem;
}
.checks {
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.checks__banner {
  padding: var(--sp-3) var(--sp-4);
  font-weight: 700;
}
.checks__banner.is-ok {
  background: var(--success-soft);
  color: var(--success);
}
.checks__banner.is-bad {
  background: var(--warning-soft);
  color: var(--warning);
}
.checks__item {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-top: 1px solid var(--border);
}
.checks__icon {
  font-weight: 800;
  flex: 0 0 auto;
}
.checks__item--pass .checks__icon {
  color: var(--success);
}
.checks__item--fail .checks__icon {
  color: var(--danger);
}
.checks__name {
  font-size: 0.92rem;
}
.checks__detail {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 3px;
  font-family: var(--font-mono);
}
@media (max-width: 800px) {
  .dom__workspace {
    grid-template-columns: 1fr;
  }
}
</style>
