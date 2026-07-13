<script setup lang="ts">
import MascotBot from './MascotBot.vue'

withDefaults(
  defineProps<{
    mood?: 'idle' | 'happy' | 'thinking' | 'sad' | 'wave'
    message?: string
    size?: number
    compact?: boolean
  }>(),
  { mood: 'idle', message: '', size: 72, compact: false },
)
</script>

<template>
  <div class="coach" :class="{ 'coach--compact': compact }">
    <MascotBot :mood="mood" :size="size" />
    <Transition name="bubble" mode="out-in">
      <div v-if="message" :key="message" class="coach__bubble">
        {{ message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.coach {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.coach--compact {
  gap: var(--sp-2);
}
.coach__bubble {
  position: relative;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  border-top-left-radius: 4px;
  padding: var(--sp-3) var(--sp-4);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
  box-shadow: var(--shadow-sm);
  max-width: 42ch;
}
.coach__bubble::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 16px;
  width: 14px;
  height: 14px;
  background: var(--surface-2);
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transform: rotate(45deg);
}
.coach--compact .coach__bubble {
  font-size: 0.88rem;
  padding: var(--sp-2) var(--sp-3);
}

.bubble-enter-active,
.bubble-leave-active {
  transition:
    opacity var(--dur) var(--ease),
    transform var(--dur) var(--ease-spring);
}
.bubble-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
}
.bubble-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
