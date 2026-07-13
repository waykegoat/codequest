<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import { useProgression } from '@/composables/useProgression'
import { RANKS } from '@/engine/gamification'
import { course, lessonKey, totalLessons } from '@/content'
import MascotBot from '@/components/MascotBot.vue'

const progress = useProgressStore()
const settings = useSettingsStore()
const { completedCount, percentDone } = useProgression()

const level = computed(() => progress.level)
const toNext = computed(() => level.value.xpForNext - level.value.xpIntoLevel)
const nextRank = computed(() => RANKS.find((r) => r.minLevel > level.value.level))

function moduleDone(id: string) {
  const m = course.modules.find((mod) => mod.id === id)
  return !!m && m.lessons.every((l) => progress.isLessonComplete(lessonKey(id, l.id)))
}

const readiness = computed(() => [
  { label: 'Вёрстка: HTML и CSS', done: moduleDone('html-basics') && moduleDone('css-basics') },
  { label: 'JavaScript и TypeScript', done: moduleDone('js-basics') && moduleDone('js-deep') },
  { label: 'Бэкенд: Node и базы данных', done: moduleDone('backend') && moduleDone('databases') },
  { label: 'Алгоритмы и собеседование', done: moduleDone('interview') },
])

const jobReady = computed(() => readiness.value.every((r) => r.done))
const readyCount = computed(() => readiness.value.filter((r) => r.done).length)

const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

function resetProgress() {
  if (confirm('Точно сбросить весь прогресс? Это действие необратимо.')) progress.reset()
}
function printCert() {
  window.print()
}
</script>

<template>
  <div class="profile container">
    <div class="profile__id panel-3d">
      <MascotBot :mood="jobReady ? 'happy' : 'idle'" :size="86" />
      <div class="profile__id-body">
        <div class="eyebrow">$ whoami</div>
        <h1 class="profile__rank">{{ progress.rank.title }}</h1>
        <div class="profile__level mono">
          level {{ level.level }} · {{ progress.totalXp }} XP
          <template v-if="nextRank"> · next: {{ nextRank.title }} ({{ toNext }} XP)</template>
        </div>
        <div class="profile__bar">
          <div class="profile__fill" :style="{ width: level.progress * 100 + '%' }" />
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="card stat">
        <div class="stat__num">{{ progress.totalXp }}</div>
        <div class="stat__label">всего XP</div>
      </div>
      <div class="card stat">
        <div class="stat__num">{{ progress.streakCurrent }}</div>
        <div class="stat__label">стрик, дней</div>
      </div>
      <div class="card stat">
        <div class="stat__num">{{ progress.streakLongest }}</div>
        <div class="stat__label">рекорд стрика</div>
      </div>
      <div class="card stat">
        <div class="stat__num">{{ progress.streakFreezes }}</div>
        <div class="stat__label">заморозки ❄</div>
      </div>
      <div class="card stat">
        <div class="stat__num">{{ progress.solvedCode }}</div>
        <div class="stat__label">решено задач</div>
      </div>
      <div class="card stat">
        <div class="stat__num">{{ completedCount }}/{{ totalLessons }}</div>
        <div class="stat__label">уроков пройдено</div>
      </div>
    </div>

    <section class="ready panel-3d">
      <div class="ready__head">
        <h2 class="ready__title">// готовность к первой работе</h2>
        <span class="ready__count mono">{{ readyCount }}/{{ readiness.length }}</span>
      </div>
      <ul class="ready__list">
        <li v-for="(r, i) in readiness" :key="i" class="ready__item" :class="{ 'ready__item--done': r.done }">
          <span class="ready__box">{{ r.done ? '✓' : '' }}</span>
          <span>{{ r.label }}</span>
        </li>
      </ul>
      <div class="ready__meter">
        <div class="ready__meter-fill" :style="{ width: percentDone + '%' }" />
      </div>
      <p class="ready__hint mono">
        {{ jobReady ? '// статус: готов к собеседованию' : `// пройдено ${percentDone}% пути` }}
      </p>
    </section>

    <section v-if="jobReady" class="cert" id="certificate">
      <div class="cert__frame">
        <div class="cert__mark">&lt;/&gt;</div>
        <div class="eyebrow">CodeQuest · сертификат</div>
        <h2 class="cert__title">Junior Full-Stack Developer</h2>
        <p class="cert__text">Курс «от нуля до первой работы» пройден полностью.</p>
        <div class="cert__meta mono">{{ today }}</div>
      </div>
      <button class="btn btn--primary cert__print" @click="printCert">🖨 Распечатать</button>
    </section>

    <h2 class="profile__sub">// карьерная лестница</h2>
    <div class="ladder">
      <div
        v-for="r in RANKS"
        :key="r.key"
        class="ladder__item"
        :class="{ 'ladder__item--reached': level.level >= r.minLevel }"
      >
        <div class="ladder__icon">{{ r.icon }}</div>
        <div class="ladder__name">{{ r.title }}</div>
        <div class="ladder__lvl mono">lvl {{ r.minLevel }}</div>
      </div>
    </div>

    <div class="settings">
      <button class="btn" @click="settings.toggleTheme">
        {{ settings.theme === 'dark' ? '◑ Светлая тема' : '◐ Тёмная тема' }}
      </button>
      <button class="btn profile__reset" @click="resetProgress">🗑 Сбросить прогресс</button>
    </div>
  </div>
</template>

<style scoped>
.profile {
  padding-top: var(--sp-6);
  padding-bottom: var(--sp-8);
  max-width: 960px;
}
.profile__id {
  display: flex;
  align-items: center;
  gap: var(--sp-5);
  padding: var(--sp-5) var(--sp-6);
  margin-bottom: var(--sp-4);
}
.profile__id-body {
  flex: 1;
}
.profile__rank {
  margin: 6px 0 4px;
  font-size: 1.8rem;
}
.profile__level {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: var(--sp-3);
}
.profile__bar {
  height: 8px;
  background: var(--surface-3);
  border-radius: var(--r-full);
  overflow: hidden;
}
.profile__fill {
  height: 100%;
  background: var(--ink);
  border-radius: var(--r-full);
  transition: width var(--dur-slow) var(--ease);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}
.stat {
  padding: var(--sp-4);
}
.stat__num {
  font-family: var(--font-mono);
  font-size: 1.7rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.stat__label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.ready {
  padding: var(--sp-5);
  margin-bottom: var(--sp-6);
}
.ready__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--sp-4);
}
.ready__title {
  font-size: 1.05rem;
  color: var(--text-dim);
  margin: 0;
}
.ready__count {
  font-weight: 700;
}
.ready__list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--sp-4);
  display: grid;
  gap: var(--sp-2);
}
.ready__item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  color: var(--text-muted);
}
.ready__item--done {
  color: var(--text);
}
.ready__box {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1px solid var(--line-strong);
  border-radius: 5px;
  font-weight: 800;
  font-size: 0.8rem;
  flex: 0 0 auto;
}
.ready__item--done .ready__box {
  background: var(--ink);
  color: var(--ink-inverse);
  border-color: var(--ink);
}
.ready__meter {
  height: 6px;
  background: var(--surface-3);
  border-radius: var(--r-full);
  overflow: hidden;
}
.ready__meter-fill {
  height: 100%;
  background: var(--ink);
  transition: width var(--dur-slow) var(--ease);
}
.ready__hint {
  margin: var(--sp-3) 0 0;
  font-size: 0.82rem;
  color: var(--text-dim);
}

.cert {
  margin-bottom: var(--sp-6);
  text-align: center;
}
.cert__frame {
  border: 2px solid var(--line-bright);
  border-radius: var(--r-lg);
  padding: var(--sp-7) var(--sp-5);
  background:
    radial-gradient(60% 60% at 50% 0%, rgba(255, 255, 255, 0.05), transparent 70%), var(--surface);
  position: relative;
}
.cert__mark {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 1.6rem;
  margin-bottom: var(--sp-3);
}
.cert__title {
  font-size: 1.9rem;
  margin: var(--sp-2) 0;
}
.cert__text {
  color: var(--text-muted);
  margin: 0;
}
.cert__meta {
  margin-top: var(--sp-4);
  color: var(--text-dim);
  font-size: 0.85rem;
}
.cert__print {
  margin-top: var(--sp-4);
}

.profile__sub {
  color: var(--text-dim);
  font-size: 1.05rem;
  margin-bottom: var(--sp-4);
}
.ladder {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(115px, 1fr));
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}
.ladder__item {
  text-align: center;
  padding: var(--sp-3);
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1px solid var(--line);
  opacity: 0.45;
  filter: grayscale(1);
  transition: all var(--dur) var(--ease);
}
.ladder__item--reached {
  opacity: 1;
  border-color: var(--line-bright);
}
.ladder__icon {
  font-size: 1.7rem;
}
.ladder__name {
  font-weight: 650;
  font-size: 0.82rem;
  margin-top: 4px;
}
.ladder__lvl {
  font-size: 0.72rem;
  color: var(--text-dim);
}

.settings {
  display: flex;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.profile__reset {
  color: var(--text-muted);
  border-color: var(--bad-line);
}

@media (max-width: 720px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media print {
  .profile > *:not(.cert),
  .cert__print {
    display: none !important;
  }
}
</style>
