<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BlankStep } from '@/content/types'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: BlankStep }>()
const emit = defineEmits<{ solved: [firstTry: boolean]; wrong: [] }>()

const segments = computed(() => props.step.template.split('___'))
const inputs = ref<string[]>(props.step.blanks.map(() => ''))
const checked = ref(false)
const solved = ref(false)
const shownHints = ref(0)

const correct = computed(() =>
  props.step.blanks.map((b, i) => inputs.value[i].trim() === b.answer.trim()),
)

function check() {
  checked.value = true
  if (correct.value.every(Boolean)) {
    if (!solved.value) {
      solved.value = true
      emit('solved', true)
    }
  } else {
    emit('wrong')
  }
}

function onInput() {
  checked.value = false
}

function revealHint() {
  if (props.step.hints && shownHints.value < props.step.hints.length) shownHints.value++
}
</script>

<template>
  <div class="blank">
    <h2>{{ step.title }}</h2>
    <MarkdownBlock :source="step.prompt" class="blank__prompt" />

    <div class="blank__code terminal">
      <div class="terminal__bar">
        <span class="terminal__dot" /><span class="terminal__dot" /><span class="terminal__dot" />
        <span class="terminal__title">заполни пропуски</span>
      </div>
      <pre class="blank__pre"><template v-for="(seg, i) in segments" :key="i"><span class="blank__seg">{{ seg }}</span><input
          v-if="i < step.blanks.length"
          v-model="inputs[i]"
          class="blank__input"
          :class="checked ? (correct[i] ? 'blank__input--ok' : 'blank__input--bad') : ''"
          :style="{ width: (step.blanks[i].width ?? Math.max(3, step.blanks[i].answer.length)) + 'ch' }"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          @input="onInput"
        /></template></pre>
    </div>

    <div class="blank__actions">
      <button class="btn btn--primary" @click="check">✓ Проверить</button>
      <button
        v-if="step.hints && shownHints < step.hints.length"
        class="btn btn--ghost"
        @click="revealHint"
      >
        💡 Подсказка
      </button>
    </div>

    <div v-if="shownHints > 0" class="blank__hints">
      <div v-for="i in shownHints" :key="i" class="blank__hint">
        <span>💡</span><MarkdownBlock :source="step.hints![i - 1]" />
      </div>
    </div>

    <div v-if="checked" class="blank__result" :class="solved ? 'is-ok' : 'is-bad'">
      {{ solved ? 'Верно! Все пропуски заполнены правильно.' : 'Не всё верно — красные поля нужно поправить.' }}
    </div>
  </div>
</template>

<style scoped>
.blank {
  animation: fade-up var(--dur) var(--ease);
}
.blank__prompt {
  margin-bottom: var(--sp-4);
  font-size: 1.02rem;
}
.blank__pre {
  margin: 0;
  padding: var(--sp-4);
  border: none;
  background: transparent;
  font-size: 0.94rem;
  line-height: 2;
  white-space: pre-wrap;
  color: var(--text);
}
.blank__input {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.94rem;
  color: var(--text);
  background: var(--surface);
  border: none;
  border-bottom: 2px solid var(--line-bright);
  border-radius: 4px 4px 0 0;
  padding: 1px 6px;
  margin: 0 2px;
  text-align: center;
  outline: none;
  transition: border-color var(--dur-fast) var(--ease);
}
.blank__input:focus {
  border-bottom-color: var(--ink);
  background: var(--surface-2);
}
.blank__input--ok {
  border-bottom-color: var(--ok-line);
  background: var(--ok-soft);
}
.blank__input--bad {
  border-bottom-color: var(--bad);
  background: var(--bad-soft);
}
.blank__actions {
  display: flex;
  gap: var(--sp-2);
  margin: var(--sp-4) 0 var(--sp-3);
}
.blank__hints {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}
.blank__hint {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--surface-2);
  border-radius: var(--r-md);
  font-size: 0.95rem;
}
.blank__hint :deep(p) {
  margin: 0;
}
.blank__result {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  font-weight: 600;
}
.blank__result.is-ok {
  background: var(--ok-soft);
  border: 1px solid var(--ok-line);
}
.blank__result.is-bad {
  background: var(--bad-soft);
  border: 1px solid var(--bad-line);
  color: var(--text-muted);
}
</style>
