<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { QuizStep } from '@/content/types'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: QuizStep }>()
const emit = defineEmits<{ solved: [] }>()

const { t } = useI18n()
const selected = ref<number | null>(null)
const checked = ref(false)
const isCorrect = ref(false)

function pick(i: number) {
  if (checked.value && isCorrect.value) return
  selected.value = i
  checked.value = false
}

function check() {
  if (selected.value === null) return
  checked.value = true
  isCorrect.value = selected.value === props.step.answer
  if (isCorrect.value) emit('solved')
}

function optionClass(i: number) {
  if (!checked.value) return { 'quiz__opt--selected': selected.value === i }
  if (i === props.step.answer) return { 'quiz__opt--correct': true }
  if (i === selected.value) return { 'quiz__opt--wrong': true }
  return {}
}
</script>

<template>
  <div class="quiz">
    <h2 class="quiz__q">{{ step.question }}</h2>

    <div class="quiz__opts">
      <button
        v-for="(opt, i) in step.options"
        :key="i"
        class="quiz__opt"
        :class="optionClass(i)"
        :disabled="checked && isCorrect"
        @click="pick(i)"
      >
        <span class="quiz__marker">{{ String.fromCharCode(65 + i) }}</span>
        <span class="quiz__text">{{ opt }}</span>
      </button>
    </div>

    <div v-if="checked" class="quiz__feedback" :class="isCorrect ? 'is-ok' : 'is-bad'">
      <strong>{{ isCorrect ? t('lesson.correct') : t('lesson.incorrect') }}</strong>
      <MarkdownBlock v-if="isCorrect && step.explanation" :source="step.explanation" />
    </div>

    <button
      class="btn btn--primary btn--lg quiz__check"
      :disabled="selected === null || (checked && isCorrect)"
      @click="check"
    >
      {{ t('lesson.checkAnswer') }}
    </button>
  </div>
</template>

<style scoped>
.quiz {
  animation: fade-up var(--dur) var(--ease);
}
.quiz__q {
  margin-bottom: var(--sp-5);
}
.quiz__opts {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}
.quiz__opt {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-align: left;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
  font-weight: 500;
  transition:
    border-color var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease);
}
.quiz__opt:hover:not(:disabled) {
  border-color: var(--brand-500);
  transform: translateX(3px);
}
.quiz__marker {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.85rem;
  flex: 0 0 auto;
}
.quiz__opt--selected {
  border-color: var(--brand-500);
  background: var(--brand-glow);
}
.quiz__opt--correct {
  border-color: var(--success);
  background: var(--success-soft);
}
.quiz__opt--correct .quiz__marker {
  background: var(--success);
  color: #04160c;
}
.quiz__opt--wrong {
  border-color: var(--danger);
  background: var(--danger-soft);
}
.quiz__opt--wrong .quiz__marker {
  background: var(--danger);
  color: #fff;
}
.quiz__feedback {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  margin-bottom: var(--sp-4);
}
.quiz__feedback.is-ok {
  background: var(--success-soft);
  color: var(--success);
}
.quiz__feedback.is-bad {
  background: var(--danger-soft);
  color: var(--danger);
}
.quiz__feedback :deep(p) {
  color: var(--text);
  margin: var(--sp-2) 0 0;
}
</style>
