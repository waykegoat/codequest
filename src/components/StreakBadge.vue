<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
const progress = useProgressStore()
</script>

<template>
  <div
    class="streak"
    :title="`Стрик: ${progress.streakCurrent} дн. (рекорд ${progress.streakLongest})`"
  >
    <span class="streak__flame" :class="{ 'streak__flame--cold': progress.streakCurrent === 0 }">
      🔥
    </span>
    <span class="streak__count">{{ progress.streakCurrent }}</span>
  </div>
</template>

<style scoped>
.streak {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--r-full);
  background: var(--warning-soft);
  border: 1px solid transparent;
  font-weight: 700;
}
.streak__flame {
  filter: drop-shadow(0 0 6px var(--streak));
}
.streak__flame--cold {
  filter: grayscale(1);
  opacity: 0.5;
}
.streak__count {
  color: var(--streak);
  font-variant-numeric: tabular-nums;
}
</style>
