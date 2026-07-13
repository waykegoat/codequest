<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FlatLesson } from '@/content'
import { useProgression } from '@/composables/useProgression'

const props = defineProps<{ flat: FlatLesson }>()

const router = useRouter()
const { isCompleted, isUnlocked } = useProgression()

const completed = computed(() => isCompleted(props.flat))
const unlocked = computed(() => isUnlocked(props.flat))

const kinds = computed(() => {
  const set = new Set(props.flat.lesson.steps.map((s) => s.kind))
  return [...set]
})

function open() {
  if (!unlocked.value) return
  router.push({
    name: 'lesson',
    params: { moduleId: props.flat.module.id, lessonId: props.flat.lesson.id },
  })
}
</script>

<template>
  <button
    class="node"
    :class="{ 'node--done': completed, 'node--locked': !unlocked }"
    :disabled="!unlocked"
    @click="open"
  >
    <span class="node__badge">
      <span v-if="completed" class="node__check">✓</span>
      <span v-else-if="!unlocked" class="node__lock">🔒</span>
      <span v-else class="node__icon">{{ flat.lesson.icon }}</span>
    </span>
    <span class="node__info">
      <span class="node__title">{{ flat.lesson.title }}</span>
      <span class="node__sub">{{ flat.lesson.subtitle }}</span>
    </span>
    <span class="node__meta">
      <span class="node__kinds">
        <span v-for="k in kinds" :key="k" class="node__kdot" :title="k">{{
          k === 'theory' ? '›' : k === 'quiz' ? '?' : k === 'markup' ? '#' : '/'
        }}</span>
      </span>
      <span class="node__xp">+{{ flat.lesson.xp }}</span>
    </span>
  </button>
</template>

<style scoped>
.node {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  width: 100%;
  text-align: left;
  padding: var(--sp-3);
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1px solid var(--line);
  transition:
    transform var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease);
}
.node:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--line-bright);
  background: var(--surface-2);
}
.node__badge {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: var(--r-sm);
  font-size: 1.15rem;
  background: var(--surface-3);
  border: 1px solid var(--line-strong);
}
.node__icon {
  filter: grayscale(1) contrast(1.05);
}
.node--done .node__badge {
  background: var(--ink);
  border-color: var(--ink);
}
.node__check {
  font-weight: 900;
  color: var(--ink-inverse);
}
.node__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.node__title {
  font-weight: 650;
  font-size: 0.96rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node__sub {
  font-size: 0.8rem;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node__meta {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}
.node__kinds {
  display: flex;
  gap: 3px;
}
.node__kdot {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: var(--surface-3);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-dim);
}
.node__xp {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
}
.node--locked {
  opacity: 0.5;
  cursor: not-allowed;
}
.node--locked .node__badge {
  filter: grayscale(1);
}
</style>
