<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'

const progress = useProgressStore()
const level = computed(() => progress.level)
</script>

<template>
  <div class="xpbar" :title="`${level.xpIntoLevel} / ${level.xpForNext} XP`">
    <div class="xpbar__level">{{ progress.rank.icon }} {{ level.level }}</div>
    <div class="xpbar__track">
      <div class="xpbar__fill" :style="{ width: level.progress * 100 + '%' }" />
    </div>
    <div class="xpbar__xp">{{ progress.totalXp }} XP</div>
  </div>
</template>

<style scoped>
.xpbar {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.xpbar__level {
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
}
.xpbar__track {
  width: 130px;
  height: 8px;
  background: var(--surface-2);
  border-radius: var(--r-full);
  overflow: hidden;
  border: 1px solid var(--border);
}
.xpbar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--xp), var(--warning));
  border-radius: var(--r-full);
  transition: width var(--dur-slow) var(--ease);
}
.xpbar__xp {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
@media (max-width: 640px) {
  .xpbar__track {
    width: 70px;
  }
  .xpbar__xp {
    display: none;
  }
}
</style>
