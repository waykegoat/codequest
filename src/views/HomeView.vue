<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { course, flatLessons, totalLessons } from '@/content'
import { useProgression } from '@/composables/useProgression'
import { useProgressStore } from '@/stores/progress'
import { useAuthStore } from '@/stores/auth'
import { useParallax } from '@/composables/useParallax'
import LessonNode from '@/components/LessonNode.vue'
import MascotCoach from '@/components/MascotCoach.vue'
import DailyChallenge from '@/components/DailyChallenge.vue'
import BeforeAfterShowcase from '@/components/BeforeAfterShowcase.vue'

const router = useRouter()
const progress = useProgressStore()
const auth = useAuthStore()
const { percentDone, completedCount, currentLesson, hasStarted, skip5LessonsAhead } =
  useProgression()
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
  if (auth.isGuest) {
    auth.openAuthModal('register')
    return
  }
  const cur = currentLesson.value
  if (cur) {
    router.push({ name: 'lesson', params: { moduleId: cur.module.id, lessonId: cur.lesson.id } })
  }
}

function handleStartClick() {
  if (auth.isGuest) {
    auth.openAuthModal('register')
  } else {
    continueJourney()
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

const monthLabels = ['01 — Основы веб-разработки', '02 — Продвинутый стек & Vue 3', '03 — Профи & Full-Stack']
function monthFor(i: number) {
  if (i <= 2) return monthLabels[0]
  if (i <= 7) return monthLabels[1]
  return monthLabels[2]
}
function showMonthDivider(i: number) {
  return i === 0 || monthFor(i) !== monthFor(i - 1)
}
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
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
          <div class="hero__badges">
            <span class="chip chip--accent">⚔️ Битвы с боссами</span>
            <span class="chip chip--success">💚 Глубокий Vue 3 стек</span>
            <span class="chip chip--info">🤖 ИИ-проверка кода</span>
          </div>

          <div class="eyebrow hero__eyebrow">~/codequest — интерактивный путь full-stack инженера</div>
          <h1 class="hero__title">
            Стань<br />разработчиком<span class="hero__cursor">_</span>
          </h1>
          <p class="hero__subtitle">
            Интерактивный тренажёр без нудных видеолекций. 15 модулей практики: от первой строчки HTML
            до реактивных приложений на Vue 3, Node.js REST API и PostgreSQL. Сражайся с боссами и проверяй код через ИИ.
          </p>
          <div class="hero__actions">
            <button
              class="btn btn--primary btn--lg hero__cta"
              @click="handleStartClick"
            >
              {{ auth.isGuest ? '🚀 Начать обучение (CodeQuest ID)' : (hasStarted ? '▸ Продолжить' : '▸ Начать путь') }}
            </button>
            <button
              v-if="!auth.isGuest"
              class="btn btn--lg btn--ghost hero__skip-btn"
              title="Открыть следующие 5 уроков для пропуска"
              @click="skip5LessonsAhead"
            >
              ⏩ Вперёд на 5 уроков
            </button>
            <button
              v-else
              class="btn btn--lg btn--ghost"
              @click="auth.openAuthModal('login')"
            >
              Вход
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
<span class="dim">user</span>    {{ auth.currentUser?.displayName || 'Гость' }}
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

    <!-- Interactive Before / After CSS Showcase -->
    <section class="container">
      <BeforeAfterShowcase />
    </section>

    <!-- Key Platform Pillars -->
    <section class="container pillars">
      <div class="pillars__grid">
        <div class="pillar-card card">
          <div class="pillar-card__icon">👑</div>
          <h3 class="pillar-card__title">Битвы с Боссами & ИИ-Арбитр</h3>
          <p class="pillar-card__desc">
            В конце каждого модуля тебя ждёт объёмное испытание. ИИ-арбитр оценивает логику, обработку ошибок и архитектуру без глупых тестов на равенство строк.
          </p>
        </div>

        <div class="pillar-card card">
          <div class="pillar-card__icon">💚</div>
          <h3 class="pillar-card__title">Глубокий стек Vue 3 & Pinia</h3>
          <p class="pillar-card__desc">
            Современный Composition API, &lt;script setup&gt;, ref, reactive, computed и Pinia store. В продакшене никто не пишет на чистом DOM — учись актуальному стеку!
          </p>
        </div>

        <div class="pillar-card card">
          <div class="pillar-card__icon">⚡</div>
          <h3 class="pillar-card__title">100% Практика в браузере</h3>
          <p class="pillar-card__desc">
            Живой редактор кода, моментальный запуск в песочнице, встроенная база данных SQLite и заботливые подсказки робота-наставника Байта.
          </p>
        </div>

        <div class="pillar-card card">
          <div class="pillar-card__icon">🎓</div>
          <h3 class="pillar-card__title">Дипломный проект в портфолио</h3>
          <p class="pillar-card__desc">
            Финальный босс — проектирование полнофункционального Full-Stack сервиса TaskFlow с реактивным интерфейсом, REST API и базой данных.
          </p>
        </div>
      </div>
    </section>

    <!-- Daily Challenge (if started) -->
    <section v-if="!auth.isGuest" class="container">
      <DailyChallenge />
    </section>

    <!-- Course Map / Syllabus -->
    <section class="container map">
      <div class="map__header-row">
        <div>
          <h2 class="map__heading">// маршрут обучения и боссы</h2>
          <p class="map__subheading">15 модулей от нуля до полноценного Junior+ Full-Stack инженера</p>
        </div>
      </div>

      <!-- Guest Access Banner -->
      <div v-if="auth.isGuest" class="guest-gate card">
        <div class="guest-gate__content">
          <div class="guest-gate__icon">🔒</div>
          <div class="guest-gate__text">
            <h3 class="guest-gate__title">Доступ к урокам и боссам открывается после регистрации</h3>
            <p class="guest-gate__desc">
              Зарегистрируйся через CodeQuest ID (займёт 15 секунд). Ты получишь доступ к урокам, сможешь сражаться с боссами, сохранять прогресс в облаке и расти в рангах!
            </p>
          </div>
          <button class="btn btn--primary btn--lg guest-gate__btn" @click="auth.openAuthModal('register')">
            🚀 Получить CodeQuest ID
          </button>
        </div>
      </div>

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
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: var(--sp-7);
}
.hero__badges {
  display: flex;
  gap: var(--sp-2);
  flex-wrap: wrap;
  margin-bottom: var(--sp-3);
}
.hero__eyebrow {
  display: inline-block;
  margin-bottom: var(--sp-4);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--line);
}
.hero__title {
  font-size: clamp(2.4rem, 1.5rem + 3.8vw, 4.2rem);
  letter-spacing: -0.03em;
  margin-bottom: var(--sp-4);
  line-height: 1.1;
}
.hero__cursor {
  display: inline-block;
  color: var(--text);
  animation: blink 1.1s step-end infinite;
}
.hero__subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
  max-width: 52ch;
  line-height: 1.6;
  margin-bottom: var(--sp-5);
}
.hero__actions {
  display: flex;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.hero__cta {
  font-weight: 750;
  box-shadow: 0 0 20px rgba(124, 92, 255, 0.35);
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

/* Key Pillars */
.pillars {
  margin: var(--sp-7) auto;
}
.pillars__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--sp-4);
}
.pillar-card {
  padding: var(--sp-5);
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  transition: transform 0.2s var(--ease), border-color 0.2s var(--ease);
}
.pillar-card:hover {
  transform: translateY(-3px);
  border-color: var(--line-bright);
}
.pillar-card__icon {
  font-size: 2rem;
  margin-bottom: var(--sp-3);
}
.pillar-card__title {
  margin: 0 0 var(--sp-2);
  font-size: 1.12rem;
  font-weight: 750;
}
.pillar-card__desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.55;
}

/* Guest Gate Banner */
.guest-gate {
  background: linear-gradient(135deg, rgba(124, 92, 255, 0.12) 0%, rgba(30, 27, 75, 0.25) 100%);
  border: 1px solid rgba(124, 92, 255, 0.4);
  padding: var(--sp-5);
  border-radius: var(--r-xl);
  margin-bottom: var(--sp-6);
}
.guest-gate__content {
  display: flex;
  align-items: center;
  gap: var(--sp-5);
  flex-wrap: wrap;
}
.guest-gate__icon {
  font-size: 2.4rem;
  flex: 0 0 auto;
}
.guest-gate__text {
  flex: 1;
  min-width: 260px;
}
.guest-gate__title {
  margin: 0 0 6px;
  font-size: 1.25rem;
  font-weight: 800;
}
.guest-gate__desc {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.5;
}
.guest-gate__btn {
  flex: 0 0 auto;
  white-space: nowrap;
}

/* Map */
.map {
  margin-top: var(--sp-8);
}
.map__header-row {
  margin-bottom: var(--sp-5);
}
.map__heading {
  font-size: 1.15rem;
  color: var(--text-dim);
  margin: 0 0 4px;
}
.map__subheading {
  margin: 0;
  font-size: 0.92rem;
  color: var(--text-muted);
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
  .guest-gate__content {
    flex-direction: column;
    align-items: flex-start;
  }
  .guest-gate__btn {
    width: 100%;
  }
}
</style>
