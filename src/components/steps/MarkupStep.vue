<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MarkupStep } from '@/content/types'
import { buildSrcdoc, runMarkupChecks, type MarkupCheckResult } from '@/engine/markupRunner'
import CodeMirrorEditor from '@/components/CodeMirrorEditor.vue'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: MarkupStep }>()
const emit = defineEmits<{ solved: [firstTry: boolean] }>()

const { t } = useI18n()

const htmlCode = ref(props.step.starterHtml ?? '')
const cssCode = ref(props.step.starterCss ?? '')
const hasHtml = props.step.editors.includes('html')
const hasCss = props.step.editors.includes('css')
const activeTab = ref<'html' | 'css'>(hasHtml ? 'html' : 'css')

const iframe = ref<HTMLIFrameElement>()
const results = ref<MarkupCheckResult[]>([])
const solved = ref(false)
const shownHints = ref(0)
const showSolution = ref(false)
const usedSolution = ref(false)

let checkPending = false
let timer: ReturnType<typeof setTimeout> | undefined

function render() {
  if (iframe.value) iframe.value.srcdoc = buildSrcdoc(htmlCode.value, cssCode.value)
}

function onFrameLoad() {
  if (!checkPending) return
  checkPending = false
  const win = iframe.value?.contentWindow
  if (!win) return
  results.value = runMarkupChecks(win as unknown as Window, props.step.checks)
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
  htmlCode.value = props.step.starterHtml ?? ''
  cssCode.value = props.step.starterCss ?? ''
  results.value = []
}

function revealHint() {
  if (props.step.hints && shownHints.value < props.step.hints.length) shownHints.value++
}

function toggleSolution() {
  showSolution.value = !showSolution.value
  if (showSolution.value) {
    usedSolution.value = true
    if (props.step.solutionHtml !== undefined) htmlCode.value = props.step.solutionHtml
    if (props.step.solutionCss !== undefined) cssCode.value = props.step.solutionCss
  }
}

watch([htmlCode, cssCode], () => {
  clearTimeout(timer)
  timer = setTimeout(render, 250)
})

onMounted(render)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="markup">
    <h2>{{ step.title }}</h2>
    <MarkdownBlock :source="step.prompt" class="markup__prompt" />

    <div class="markup__workspace">
      <div class="markup__editor card">
        <div v-if="hasHtml && hasCss" class="markup__tabs">
          <button
            class="markup__tab"
            :class="{ 'markup__tab--active': activeTab === 'html' }"
            @click="activeTab = 'html'"
          >
            HTML
          </button>
          <button
            class="markup__tab"
            :class="{ 'markup__tab--active': activeTab === 'css' }"
            @click="activeTab = 'css'"
          >
            CSS
          </button>
        </div>
        <div v-else class="markup__tabs">
          <span class="markup__tab markup__tab--active">{{ hasHtml ? 'HTML' : 'CSS' }}</span>
        </div>

        <div class="markup__editor-body">
          <CodeMirrorEditor
            v-show="activeTab === 'html' && hasHtml"
            v-model="htmlCode"
            lang="html"
            placeholder="Пиши HTML здесь…"
          />
          <CodeMirrorEditor
            v-show="activeTab === 'css' && hasCss"
            v-model="cssCode"
            lang="css"
            placeholder="Пиши CSS здесь…"
          />
        </div>
      </div>

      <div class="markup__preview card">
        <div class="markup__preview-bar">
          <span class="markup__dot" /><span class="markup__dot" /><span class="markup__dot" />
          <span class="markup__preview-title">Предпросмотр</span>
        </div>
        <iframe
          ref="iframe"
          class="markup__frame"
          title="Предпросмотр вёрстки"
          sandbox="allow-same-origin"
          @load="onFrameLoad"
        />
      </div>
    </div>

    <div class="markup__actions">
      <button class="btn btn--primary" @click="check">✓ {{ t('lesson.checkAnswer') }}</button>
      <button class="btn btn--ghost" @click="resetCode">↺ {{ t('lesson.reset') }}</button>
      <button
        v-if="step.hints && shownHints < step.hints.length"
        class="btn btn--ghost"
        @click="revealHint"
      >
        💡 {{ t('lesson.showHint') }}
      </button>
      <button
        v-if="step.solutionHtml !== undefined || step.solutionCss !== undefined"
        class="btn btn--ghost"
        @click="toggleSolution"
      >
        {{ showSolution ? t('lesson.hideSolution') : t('lesson.showSolution') }}
      </button>
    </div>

    <div v-if="shownHints > 0" class="markup__hints">
      <div v-for="i in shownHints" :key="i" class="markup__hint">
        <span>💡</span><MarkdownBlock :source="step.hints![i - 1]" />
      </div>
    </div>

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
.markup {
  animation: fade-up var(--dur) var(--ease);
}
.markup__prompt {
  margin-bottom: var(--sp-4);
  font-size: 1.02rem;
}
.markup__workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
  min-height: 300px;
}
.markup__editor,
.markup__preview {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}
.markup__tabs {
  display: flex;
  gap: 2px;
  padding: 6px 6px 0;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}
.markup__tab {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--r-sm) var(--r-sm) 0 0;
  transition: all var(--dur-fast) var(--ease);
}
.markup__tab--active {
  background: var(--surface);
  color: var(--accent-cyan);
}
.markup__editor-body {
  flex: 1;
  min-height: 260px;
  background: var(--bg-elevated);
}
.markup__editor-body :deep(.cm-host) {
  height: 100%;
}
.markup__preview-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}
.markup__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--surface-3);
}
.markup__dot:nth-child(1) {
  background: #ff5f57;
}
.markup__dot:nth-child(2) {
  background: #febc2e;
}
.markup__dot:nth-child(3) {
  background: #28c840;
}
.markup__preview-title {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--text-dim);
  font-weight: 600;
}
.markup__frame {
  flex: 1;
  min-height: 260px;
  border: none;
  background: #fff;
  width: 100%;
}

.markup__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin: var(--sp-4) 0 var(--sp-3);
}
.markup__hints {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}
.markup__hint {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--warning-soft);
  border-radius: var(--r-md);
  font-size: 0.95rem;
}
.markup__hint :deep(p) {
  margin: 0;
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
  .markup__workspace {
    grid-template-columns: 1fr;
  }
}
</style>
