<script setup lang="ts">
import { computed } from 'vue'
import { BADGES } from '@/engine/gamification'
import { useProgressStore } from '@/stores/progress'

const progress = useProgressStore()
const earned = computed(() => BADGES.filter((b) => progress.hasBadge(b.id)).length)
const pct = computed(() => Math.round((earned.value / BADGES.length) * 100))
</script>

<template>
  <div class="ach container">
    <div class="ach__head">
      <div>
        <div class="eyebrow">// достижения</div>
        <h1 class="ach__title">Твои бейджи</h1>
      </div>
      <div class="ach__progress">
        <div class="ach__count mono">{{ earned }}/{{ BADGES.length }}</div>
        <div class="ach__meter">
          <div class="ach__meter-fill" :style="{ width: pct + '%' }" />
        </div>
      </div>
    </div>

    <div class="ach__grid">
      <div
        v-for="badge in BADGES"
        :key="badge.id"
        class="badge"
        :class="{ 'badge--earned': progress.hasBadge(badge.id) }"
      >
        <div class="badge__icon">{{ badge.icon }}</div>
        <div class="badge__title">{{ badge.title }}</div>
        <div class="badge__desc">{{ badge.description }}</div>
        <div class="badge__status mono">
          {{ progress.hasBadge(badge.id) ? '✓ получено' : 'закрыто' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ach {
  padding-top: var(--sp-6);
  padding-bottom: var(--sp-8);
  max-width: 960px;
}
.ach__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
  flex-wrap: wrap;
}
.ach__title {
  margin: 4px 0 0;
}
.ach__progress {
  min-width: 200px;
}
.ach__count {
  text-align: right;
  font-weight: 700;
  margin-bottom: 6px;
}
.ach__meter {
  height: 6px;
  background: var(--surface-3);
  border-radius: var(--r-full);
  overflow: hidden;
}
.ach__meter-fill {
  height: 100%;
  background: var(--ink);
  transition: width var(--dur-slow) var(--ease);
}
.ach__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
  gap: var(--sp-4);
}
.badge {
  text-align: center;
  padding: var(--sp-5) var(--sp-4);
  border-radius: var(--r-lg);
  background: var(--surface);
  border: 1px solid var(--line);
  opacity: 0.5;
  transition: all var(--dur) var(--ease);
}
.badge--earned {
  opacity: 1;
  border-color: var(--line-bright);
  box-shadow: var(--glow-white);
}
.badge__icon {
  font-size: 2.8rem;
  filter: grayscale(1);
}
.badge--earned .badge__icon {
  filter: grayscale(1) brightness(1.15);
  animation: pop var(--dur-slow) var(--ease);
}
.badge__title {
  font-weight: 750;
  margin-top: var(--sp-2);
}
.badge__desc {
  font-size: 0.84rem;
  color: var(--text-muted);
  margin-top: 4px;
  min-height: 2.6em;
}
.badge__status {
  margin-top: var(--sp-3);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-dim);
}
.badge--earned .badge__status {
  color: var(--text);
}
</style>
