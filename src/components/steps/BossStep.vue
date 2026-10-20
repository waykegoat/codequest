<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BossStep } from '@/content/types'
import { evaluateBossSubmission, type BossEvaluationResult } from '@/services/aiJudgeService'
import { useSettingsStore } from '@/stores/settings'
import type { EditorLang } from '@/engine/editorSetup'
import CodeMirrorEditor from '@/components/CodeMirrorEditor.vue'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: BossStep }>()
const emit = defineEmits<{ solved: [firstTry: boolean] }>()

const settings = useSettingsStore()

const editorLang = computed<EditorLang>(() => {
  if (props.step.lang === 'ts') return 'ts'
  if (props.step.lang === 'html') return 'html'
  if (props.step.lang === 'css') return 'css'
  if (props.step.lang === 'sql') return 'sql'
  return 'js'
})

const code = ref(props.step.starter)
const evaluating = ref(false)
const evaluation = ref<BossEvaluationResult | null>(null)
const solved = ref(false)
const shownHints = ref(0)
const showSolution = ref(false)
const attempts = ref(0)

const bossHp = computed(() => {
  if (!evaluation.value) return 100
  return evaluation.value.bossHpRemaining
})

const hpPercent = computed(() => Math.max(0, Math.min(100, bossHp.value)))

async function challengeBoss() {
  if (evaluating.value) return
  evaluating.value = true
  attempts.value++

  try {
    const res = await evaluateBossSubmission(
      {
        title: props.step.title,
        bossName: props.step.bossName,
        bossRole: props.step.bossRole,
        prompt: props.step.prompt,
        rubrics: props.step.rubrics,
        code: code.value,
        lang: props.step.lang,
      },
      settings.geminiApiKey,
      settings.aiProvider,
    )

    evaluation.value = res

    if (res.passed && !solved.value) {
      solved.value = true
      emit('solved', attempts.value === 1 && !showSolution.value)
    }
  } finally {
    evaluating.value = false
  }
}

function resetCode() {
  code.value = props.step.starter
  evaluation.value = null
}

function revealHint() {
  if (props.step.hints && shownHints.value < props.step.hints.length) {
    shownHints.value++
  }
}

function toggleSolution() {
  showSolution.value = !showSolution.value
}
</script>

<template>
  <div class="boss-step">
    <!-- Boss Arena Header -->
    <div class="boss-arena card" :class="{ 'boss-arena--defeated': bossHp === 0 }">
      <div class="boss-arena__header">
        <div class="boss-arena__avatar-wrap">
          <div class="boss-arena__avatar">{{ step.bossAvatar }}</div>
          <span v-if="bossHp === 0" class="boss-arena__skull">💀</span>
        </div>
        <div class="boss-arena__meta">
          <div class="boss-arena__role chip chip--danger">{{ step.bossRole }}</div>
          <h2 class="boss-arena__name">{{ step.bossName }}</h2>
          <div class="boss-arena__hp-bar">
            <div class="boss-arena__hp-track">
              <div
                class="boss-arena__hp-fill"
                :style="{ width: hpPercent + '%' }"
                :class="{ 'is-critical': hpPercent <= 30 && hpPercent > 0, 'is-zero': hpPercent === 0 }"
              />
            </div>
            <div class="boss-arena__hp-label">
              <span v-if="bossHp === 0">БОСС ПОВЕРЖЕН! 🎉</span>
              <span v-else>HP БОССА: {{ bossHp }} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brief & Rubrics -->
    <div class="boss-brief">
      <h3 class="boss-brief__title">⚔️ Испытание: {{ step.title }}</h3>
      <div class="boss-brief__prompt">
        <MarkdownBlock :source="step.prompt" />
      </div>

      <div class="boss-rubrics">
        <h4 class="boss-rubrics__heading">Критерии победы (Рубрики ИИ-проверки):</h4>
        <div class="boss-rubrics__list">
          <div
            v-for="rubric in step.rubrics"
            :key="rubric.id"
            class="boss-rubric-card"
            :class="{
              'is-met': evaluation?.rubricResults.find((r) => r.id === rubric.id)?.met,
              'is-unmet': evaluation && !evaluation?.rubricResults.find((r) => r.id === rubric.id)?.met,
            }"
          >
            <div class="boss-rubric-card__status">
              <span v-if="!evaluation">🎯</span>
              <span v-else-if="evaluation.rubricResults.find((r) => r.id === rubric.id)?.met" class="text-success">✓</span>
              <span v-else class="text-danger">✗</span>
            </div>
            <div class="boss-rubric-card__content">
              <div class="boss-rubric-card__title">{{ rubric.title }}</div>
              <div class="boss-rubric-card__desc">{{ rubric.description }}</div>
              <div
                v-if="evaluation?.rubricResults.find((r) => r.id === rubric.id)?.feedback"
                class="boss-rubric-card__feedback"
              >
                {{ evaluation.rubricResults.find((r) => r.id === rubric.id)?.feedback }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Code Editor -->
    <div class="boss-code">
      <div class="boss-code__head">
        <div class="boss-code__lang-badge">{{ step.lang.toUpperCase() }}</div>
        <div class="boss-code__actions">
          <button class="btn btn--sm btn--ghost" @click="resetCode">Сбросить</button>
          <button
            v-if="step.hints && step.hints.length > 0"
            class="btn btn--sm btn--ghost"
            :disabled="shownHints >= step.hints.length"
            @click="revealHint"
          >
            💡 Подсказка ({{ shownHints }}/{{ step.hints.length }})
          </button>
          <button v-if="step.solution" class="btn btn--sm btn--ghost" @click="toggleSolution">
            {{ showSolution ? 'Скрыть решение' : 'Показать решение' }}
          </button>
        </div>
      </div>

      <div v-if="shownHints > 0" class="boss-hints">
        <div v-for="i in shownHints" :key="i" class="boss-hint">
          <span>💡</span>
          <MarkdownBlock :source="step.hints![i - 1]" />
        </div>
      </div>

      <div v-if="showSolution && step.solution" class="boss-solution card">
        <div class="boss-solution__title">Эталонное решение босса:</div>
        <CodeMirrorEditor :model-value="step.solution" :lang="editorLang" readonly />
      </div>

      <div class="boss-editor card">
        <CodeMirrorEditor v-model="code" :lang="editorLang" />
      </div>

      <div class="boss-challenge-action">
        <button
          class="btn btn--primary btn--lg boss-challenge-btn"
          :class="{ 'btn--pulse': !evaluating && !solved }"
          :disabled="evaluating"
          @click="challengeBoss"
        >
          <span v-if="evaluating" class="boss-spinner">⏳ ИИ оценивает код проекта...</span>
          <span v-else-if="solved">🎉 Босс сокрушён! Проверить снова</span>
          <span v-else>⚔️ Бросить вызов боссу (ИИ-проверка)</span>
        </button>
      </div>
    </div>

    <!-- AI Arbiter Evaluation Banner -->
    <div
      v-if="evaluation"
      class="boss-verdict card"
      :class="evaluation.passed ? 'boss-verdict--passed' : 'boss-verdict--failed'"
    >
      <div class="boss-verdict__header">
        <div class="boss-verdict__title-group">
          <span class="boss-verdict__icon">{{ evaluation.passed ? '🏆' : '🛡️' }}</span>
          <div>
            <h3 class="boss-verdict__title">{{ evaluation.title }}</h3>
            <div class="boss-verdict__source">
              Проверено: {{ evaluation.source === 'ai' ? 'ИИ-Арбитр CodeQuest' : 'Локальный арбитр' }}
            </div>
          </div>
        </div>
        <div class="boss-verdict__score-badge" :class="evaluation.passed ? 'is-passed' : 'is-failed'">
          {{ evaluation.score }} / 100
        </div>
      </div>

      <p class="boss-verdict__feedback">{{ evaluation.feedback }}</p>

      <div v-if="evaluation.suggestions && evaluation.suggestions.length > 0" class="boss-verdict__suggestions">
        <div class="boss-verdict__sug-title">Советы по улучшению архитектуры:</div>
        <ul>
          <li v-for="(sug, sIdx) in evaluation.suggestions" :key="sIdx">{{ sug }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boss-step {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.boss-arena {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(30, 27, 75, 0.25) 100%);
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: var(--sp-5);
  border-radius: var(--r-lg);
  transition: all 0.3s var(--ease);
}
.boss-arena--defeated {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(30, 27, 75, 0.25) 100%);
  border-color: rgba(16, 185, 129, 0.5);
}

.boss-arena__header {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.boss-arena__avatar-wrap {
  position: relative;
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  background: var(--surface-2);
  border-radius: var(--r-md);
  border: 2px solid var(--line-strong);
  font-size: 2.6rem;
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.25);
}
.boss-arena--defeated .boss-arena__avatar-wrap {
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.3);
  border-color: #10b981;
}
.boss-arena__skull {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 1.2rem;
  background: var(--surface-1);
  border-radius: var(--r-full);
  padding: 2px;
}

.boss-arena__meta {
  flex: 1;
}
.boss-arena__role {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.boss-arena__name {
  margin: 0 0 8px;
  font-size: 1.45rem;
  font-weight: 800;
}

.boss-arena__hp-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.boss-arena__hp-track {
  height: 12px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: var(--r-full);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.boss-arena__hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f97316);
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.boss-arena__hp-fill.is-critical {
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  animation: pulse 1s infinite alternate;
}
.boss-arena__hp-fill.is-zero {
  background: #10b981;
}
.boss-arena__hp-label {
  display: flex;
  justify-content: flex-end;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
}

.boss-brief {
  background: var(--surface-2);
  border: 1px solid var(--line);
  padding: var(--sp-5);
  border-radius: var(--r-md);
}
.boss-brief__title {
  margin-top: 0;
  font-size: 1.2rem;
  margin-bottom: var(--sp-3);
}
.boss-brief__prompt {
  line-height: 1.65;
  color: var(--text);
  margin-bottom: var(--sp-4);
}

.boss-rubrics {
  margin-top: var(--sp-4);
  border-top: 1px dashed var(--line-strong);
  padding-top: var(--sp-4);
}
.boss-rubrics__heading {
  margin: 0 0 var(--sp-3);
  font-size: 0.95rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.boss-rubrics__list {
  display: grid;
  gap: var(--sp-3);
}
.boss-rubric-card {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  background: var(--surface-1);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  transition: border-color 0.2s var(--ease);
}
.boss-rubric-card.is-met {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.05);
}
.boss-rubric-card.is-unmet {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.05);
}
.boss-rubric-card__status {
  font-size: 1.2rem;
  flex: 0 0 24px;
}
.boss-rubric-card__title {
  font-weight: 700;
  font-size: 0.92rem;
  margin-bottom: 2px;
}
.boss-rubric-card__desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.boss-rubric-card__feedback {
  margin-top: 6px;
  font-size: 0.82rem;
  font-style: italic;
  color: var(--text);
}

.boss-code {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.boss-code__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.boss-code__lang-badge {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 8px;
  background: var(--surface-3);
  border-radius: var(--r-sm);
  color: var(--text-dim);
}
.boss-code__actions {
  display: flex;
  gap: var(--sp-2);
}

.boss-hints {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.boss-hint {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-3);
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: var(--r-md);
  font-size: 0.9rem;
}

.boss-solution {
  padding: var(--sp-3);
  border: 1px dashed var(--line-strong);
}
.boss-solution__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: var(--sp-2);
}

.boss-editor {
  min-height: 280px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--line-strong);
}

.boss-challenge-action {
  display: flex;
  justify-content: flex-end;
}
.boss-challenge-btn {
  min-width: 260px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.btn--pulse {
  box-shadow: 0 0 16px rgba(124, 92, 255, 0.4);
}

.boss-verdict {
  padding: var(--sp-5);
  border-radius: var(--r-lg);
  border-width: 2px;
}
.boss-verdict--passed {
  background: rgba(16, 185, 129, 0.08);
  border-color: #10b981;
}
.boss-verdict--failed {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
}

.boss-verdict__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-3);
}
.boss-verdict__title-group {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.boss-verdict__icon {
  font-size: 2rem;
}
.boss-verdict__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
}
.boss-verdict__source {
  font-size: 0.78rem;
  color: var(--text-dim);
}
.boss-verdict__score-badge {
  font-family: var(--font-mono);
  font-size: 1.3rem;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: var(--r-full);
}
.boss-verdict__score-badge.is-passed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}
.boss-verdict__score-badge.is-failed {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.boss-verdict__feedback {
  font-size: 0.98rem;
  line-height: 1.6;
  margin-bottom: var(--sp-3);
}
.boss-verdict__suggestions {
  margin-top: var(--sp-3);
  padding-top: var(--sp-3);
  border-top: 1px dashed var(--line);
  font-size: 0.88rem;
}
.boss-verdict__sug-title {
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text-muted);
}
.boss-verdict__suggestions ul {
  margin: 0;
  padding-left: 20px;
}
.boss-verdict__suggestions li {
  margin-bottom: 4px;
}
.text-success {
  color: #10b981;
  font-weight: 700;
}
.text-danger {
  color: #ef4444;
  font-weight: 700;
}
</style>
