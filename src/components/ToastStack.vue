<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
const progress = useProgressStore()
</script>

<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in progress.toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        <span class="toast__icon">{{ toast.icon }}</span>
        <span class="toast__text">{{ toast.text }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: var(--sp-5);
  bottom: var(--sp-5);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: flex-end;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 10px 16px;
  border-radius: var(--r-full);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  font-weight: 700;
  font-size: 0.95rem;
}
.toast__icon {
  font-size: 1.2rem;
}
.toast--xp {
  border-color: var(--xp);
  color: var(--xp);
}
.toast--badge {
  border-color: var(--brand-500);
  color: var(--brand-400);
  box-shadow: var(--shadow-glow);
}
.toast--level {
  border-color: var(--success);
  color: var(--success);
}

.toast-enter-active {
  animation: pop var(--dur) var(--ease);
}
.toast-leave-active {
  transition:
    opacity var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
