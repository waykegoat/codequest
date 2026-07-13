<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { course, flatLessons, totalLessons } from '@/content'
import { useProgression } from '@/composables/useProgression'
import { useProgressStore } from '@/stores/progress'
import { useParallax } from '@/composables/useParallax'
import LessonNode from '@/components/LessonNode.vue'
import MascotCoach from '@/components/MascotCoach.vue'
import DailyChallenge from '@/components/DailyChallenge.vue'

const router = useRouter()
const progress = useProgressStore()
const { percentDone, completedCount, currentLesson, hasStarted } = useProgression()
const { px, py } = useParallax()

const greeting = computed(() =>
  hasStarted.value
    ? 'С возвращением. Продолжаем с того места, где ты остановился.'
    : 'Привет! Я Байт. Поведу тебя от первого тега до фулл-стека 👇',
)

const glyphs = [
  { c: '{ }', x: 8, y: 22, d: 26, s: 2.4, o: 0.5 },
  { c: '</>', x: 20, y: 72, d: 40, s: 1.9, o: 0.4 },
  { c: '01', x: 34, y: 12, d: 18, s: 1.5, o: 0.35 },
  { c: '=>', x: 62, y: 20, d: 34, s: 2, o: 0.45 },
  { c: '( )', x: 82, y: 34, d: 22, s: 2.6, o: 0.5 },
  { c: '[ ]', x: 90, y: 74, d: 44, s: 1.8, o: 0.4 },
  { c: ';', x: 52, y: 82, d: 30, s: 2.8, o: 0.3 },
  { c: '&&', x: 72, y: 66, d: 16, s: 1.6, o: 0.35 },
  { c: '#', x: 14, y: 50, d: 36, s: 2.2, o: 0.4 },
  { c: '::', x: 46, y: 40, d: 12, s: 1.7, o: 0.28 },
]

const bar = computed(() => {
  const filled = Math.round((percentDone.value / 100) * 14)
  return '█'.repeat(filled) + '░'.repeat(14 - filled)
})

function continueJourney() {
  const cur = currentLesson.value
  if (cur) {
    router.push({ name: 'lesson', params: { moduleId: cur.module.id, lessonId: cur.lesson.id } })
  }
}

function lessonsOf(moduleId: string) {
  return flatLessons.filter((f) => f.module.id === moduleId)
}
function moduleProgress(moduleId: string) {
  const list = lessonsOf(moduleId)
  const done = list.filter((f) => progress.isLessonComplete(f.fullId)).length
  return { done, total: list.length }
}

const monthLabels = ['01 — Основы', '02 — Стек', '03 — Профи']
function monthFor(i: number) {
  if (i <= 2) return monthLabels[0]
  if (i <= 6) return monthLabels[1]
  return monthLabels[2]
}
function showMonthDivider(i: number) {
  return i === 0 || monthFor(i) !== monthFor(i - 1)
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero__glyphs" aria-hidden="true">
        <span
          v-for="(g, i) in glyphs"
          :key="i"
          class="glyph"
          :style="{
            left: g.x + '%',
            top: g.y + '%',
            fontSize: g.s + 'rem',
            opacity: g.o,
            transform: `translate3d(${px * g.d}px, ${py * g.d}px, 0)`,
            animationDelay: i * 0.4 + 's',
          }"
          >{{ g.c }}</span
        >
      </div>

      <div class="container hero__inner">
        <div class="hero__text">
          <div class="eyebrow hero__eyebrow">~/codequest — путь фулл-стек разработчика</div>
          <h1 class="hero__title">
            Стань<br />разработчиком<span class="hero__cursor">_</span>
          </h1>
          <p class="hero__subtitle">
            Интерактивный тренажёр в чёрно-белом коде. От первого тега до собственного фулл-стек
            приложения — шаг за шагом, с мгновенной проверкой.
          </p>
          <div class="hero__actions">
            <button class="btn btn--primary btn--lg" @click="continueJourney">
              {{ hasStarted ? '▸ Продолжить' : '▸ Начать путь' }}
            </button>
            <RouterLink to="/playground" class="btn btn--lg">⌨ Песочница</RouterLink>
          </div>
          <MascotCoach class="hero__coach" mood="wave" :message="greeting" :size="72" />
        </div>

        <div v-tilt="{ max: 6 }" class="hero__terminal terminal">
          <div class="terminal__bar">
            <span class="terminal__dot" /><span class="terminal__dot" /><span
              class="terminal__dot"
            />
            <span class="terminal__title">status.sh</span>
          </div>
          <pre class="hero__term">
<span class="dim">$</span> codequest --status
<span class="dim">rank</span>    {{ progress.rank.title }}
<span class="dim">level</span>   {{ progress.level.level }}
<span class="dim">xp</span>      {{ progress.totalXp }}
<span class="dim">streak</span>  {{ progress.streakCurrent }} дн.
<span class="dim">done</span>    {{ completedCount }}/{{ totalLessons }}
[{{ bar }}] {{ percentDone }}%
<span class="dim">$</span> <span class="hero__cursor">_</span></pre>
        </div>
      </div>
    </section>

    <section class="container">
      <DailyChallenge />
    </section>

    <section class="container map">
      <h2 class="map__heading">// маршрут</h2>

      <template v-for="(module, mi) in course.modules" :key="module.id">
        <div v-if="showMonthDivider(mi)" class="map__month">
          <span class="map__month-label">{{ monthFor(mi) }}</span>
          <span class="map__month-line" />
        </div>

        <div v-tilt="{ max: 3 }" class="world panel-3d">
          <div class="world__head">
            <div class="world__icon">{{ module.icon }}</div>
            <div class="world__meta">
              <h3 class="world__title">{{ module.title }}</h3>
              <p class="world__desc">{{ module.description }}</p>
            </div>
            <div class="world__count chip">
              {{ moduleProgress(module.id).done }}/{{ moduleProgress(module.id).total }}
            </div>
          </div>
          <div class="world__lessons">
            <LessonNode v-for="f in lessonsOf(module.id)" :key="f.fullId" :flat="f" />
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: var(--sp-9);
}

.hero {
  position: relative;
  overflow: hidden;
  padding: var(--sp-9) 0 var(--sp-8);
}
.hero__glyphs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.glyph {
  position: absolute;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-faint);
  animation: drift 9s var(--ease) infinite;
  will-change: transform;
}
.hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: var(--sp-7);
}
.hero__eyebrow {
  display: inline-block;
  margin-bottom: var(--sp-4);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--line);
}
.hero__title {
  font-size: clamp(2.6rem, 1.6rem + 4vw, 4.4rem);
  letter-spacing: -0.03em;
  margin-bottom: var(--sp-4);
}
.hero__cursor {
  display: inline-block;
  color: var(--text);
  animation: blink 1.1s step-end infinite;
}
.hero__subtitle {
  color: var(--text-muted);
  font-size: 1.08rem;
  max-width: 48ch;
  margin-bottom: var(--sp-5);
}
.hero__actions {
  display: flex;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.hero__coach {
  margin-top: var(--sp-6);
}
.hero__terminal {
  justify-self: end;
  width: 100%;
  max-width: 420px;
}
.hero__term {
  margin: 0;
  padding: var(--sp-5);
  border: none;
  background: transparent;
  font-size: 0.92rem;
  line-height: 1.85;
  color: var(--text);
  white-space: pre-wrap;
}
.hero__term .dim {
  color: var(--text-dim);
}

.map {
  margin-top: var(--sp-8);
}
.map__heading {
  font-size: 1.1rem;
  color: var(--text-dim);
  margin-bottom: var(--sp-5);
}
.map__month {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin: var(--sp-7) 0 var(--sp-4);
}
.map__month:first-of-type {
  margin-top: 0;
}
.map__month-label {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--text);
  padding: 4px 12px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-full);
}
.map__month-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--line-strong), transparent);
}

.world {
  margin-bottom: var(--sp-5);
  padding: var(--sp-5);
}
.world__head {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin-bottom: var(--sp-4);
}
.world__icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  border-radius: var(--r-md);
  font-size: 1.7rem;
  background: var(--surface-3);
  border: 1px solid var(--line-strong);
  filter: grayscale(1) contrast(1.05);
}
.world__meta {
  flex: 1;
}
.world__title {
  margin: 0;
  font-size: 1.2rem;
}
.world__desc {
  margin: 3px 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-family: var(--font-sans);
}
.world__count {
  font-weight: 700;
}
.world__lessons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: var(--sp-3);
}

@media (max-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: var(--sp-6);
  }
  .hero__terminal {
    justify-self: stretch;
    max-width: none;
  }
}
</style>
