<script setup lang="ts">
import { ref } from 'vue'
import type { OrderStep } from '@/content/types'
import MarkdownBlock from '@/components/MarkdownBlock.vue'

const props = defineProps<{ step: OrderStep }>()
const emit = defineEmits<{ solved: [firstTry: boolean]; wrong: [] }>()

interface Row {
  id: number
  text: string
}

function shuffled(): Row[] {
  const rows: Row[] = props.step.lines.map((text, id) => ({ id, text }))
  for (let attempt = 0; attempt < 6; attempt++) {
    for (let i = rows.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[rows[i], rows[j]] = [rows[j], rows[i]]
    }
    if (rows.some((r, idx) => r.id !== idx)) break
  }
  return rows
}

const rows = ref<Row[]>(shuffled())
const checked = ref(false)
const solved = ref(false)
const dragIndex = ref<number | null>(null)
const shownHints = ref(0)

function move(from: number, to: number) {
  if (to < 0 || to >= rows.value.length) return
  const next = rows.value.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  rows.value = next
  checked.value = false
}

function onDragStart(i: number) {
  dragIndex.value = i
}
function onDrop(i: number) {
  if (dragIndex.value !== null && dragIndex.value !== i) move(dragIndex.value, i)
  dragIndex.value = null
}

function check() {
  checked.value = true
  const ok = rows.value.every((r, idx) => r.id === idx)
  if (ok) {
    if (!solved.value) {
      solved.value = true
      emit('solved', true)
    }
  } else {
    emit('wrong')
  }
}

function rowOk(i: number) {
  return rows.value[i].id === i
}

function revealHint() {
  if (props.step.hints && shownHints.value < props.step.hints.length) shownHints.value++
}
</script>

<template>
  <div class="order">
    <h2>{{ step.title }}</h2>
    <MarkdownBlock :source="step.prompt" class="order__prompt" />

    <div class="order__list terminal">
      <div class="terminal__bar">
        <span class="terminal__dot" /><span class="terminal__dot" /><span class="terminal__dot" />
        <span class="terminal__title">перетащи строки в нужный порядок</span>
      </div>
      <div class="order__rows">
        <div
          v-for="(row, i) in rows"
          :key="row.id"
          class="order__row"
          :class="checked ? (rowOk(i) ? 'order__row--ok' : 'order__row--bad') : ''"
          draggable="true"
          @dragstart="onDragStart(i)"
          @dragover.prevent
          @drop="onDrop(i)"
        >
          <span class="order__grip">⠿</span>
          <span class="order__num">{{ i + 1 }}</span>
          <code class="order__code">{{ row.text }}</code>
          <span class="order__moves">
            <button class="order__mv" :disabled="i === 0" @click="move(i, i - 1)">▲</button>
            <button class="order__mv" :disabled="i === rows.length - 1" @click="move(i, i + 1)">
              ▼
            </button>
          </span>
        </div>
      </div>
    </div>

    <div class="order__actions">
      <button class="btn btn--primary" @click="check">✓ Проверить</button>
      <button
        v-if="step.hints && shownHints < step.hints.length"
        class="btn btn--ghost"
        @click="revealHint"
      >
        💡 Подсказка
      </button>
    </div>

    <div v-if="shownHints > 0" class="order__hints">
      <div v-for="i in shownHints" :key="i" class="order__hint">
        <span>💡</span><MarkdownBlock :source="step.hints![i - 1]" />
      </div>
    </div>

    <div v-if="checked" class="order__result" :class="solved ? 'is-ok' : 'is-bad'">
      {{ solved ? 'Порядок верный! 🎉' : 'Пока не то — строки в красном стоят не на месте.' }}
    </div>
  </div>
</template>

<style scoped>
.order {
  animation: fade-up var(--dur) var(--ease);
}
.order__prompt {
  margin-bottom: var(--sp-4);
  font-size: 1.02rem;
}
.order__rows {
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.order__row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  cursor: grab;
  transition:
    border-color var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease);
}
.order__row:hover {
  border-color: var(--line-bright);
}
.order__row:active {
  cursor: grabbing;
}
.order__row--ok {
  border-color: var(--ok-line);
  background: var(--ok-soft);
}
.order__row--bad {
  border-color: var(--bad-line);
  background: var(--bad-soft);
}
.order__grip {
  color: var(--text-dim);
  cursor: grab;
}
.order__num {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-dim);
  width: 1.5em;
  text-align: right;
}
.order__code {
  flex: 1;
  background: none;
  border: none;
  padding: 0;
  color: var(--text);
  font-size: 0.9rem;
  white-space: pre;
  overflow-x: auto;
}
.order__moves {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.order__mv {
  border: 1px solid var(--line);
  background: var(--surface-2);
  color: var(--text-muted);
  border-radius: 4px;
  font-size: 0.6rem;
  line-height: 1;
  padding: 2px 5px;
}
.order__mv:disabled {
  opacity: 0.3;
}
.order__actions {
  display: flex;
  gap: var(--sp-2);
  margin: var(--sp-4) 0 var(--sp-3);
}
.order__hints {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}
.order__hint {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--surface-2);
  border-radius: var(--r-md);
  font-size: 0.95rem;
}
.order__hint :deep(p) {
  margin: 0;
}
.order__result {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  font-weight: 600;
}
.order__result.is-ok {
  background: var(--ok-soft);
  border: 1px solid var(--ok-line);
}
.order__result.is-bad {
  background: var(--bad-soft);
  border: 1px solid var(--bad-line);
  color: var(--text-muted);
}
</style>
