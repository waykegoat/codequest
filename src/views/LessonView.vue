<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { findLesson, lessonKey, nextLesson } from '@/content'
import { useProgressStore } from '@/stores/progress'
import { XP_REWARDS } from '@/engine/gamification'
import TheoryStep from '@/components/steps/TheoryStep.vue'
import QuizStep from '@/components/steps/QuizStep.vue'
import CodeStep from '@/components/steps/CodeStep.vue'
import MarkupStep from '@/components/steps/MarkupStep.vue'
import BlankStep from '@/components/steps/BlankStep.vue'
import OrderStep from '@/components/steps/OrderStep.vue'
import MascotCoach from '@/components/MascotCoach.vue'

type StepKind = 'theory' | 'quiz' | 'code' | 'markup' | 'blank' | 'order'

const STEP_ICON: Record<StepKind, string> = {
  theory: '📖',
  quiz: '❓',
  code: '⌨️',
  markup: '🎨',
  blank: '▢',
  order: '↕',
}

const SOLVED_LINES = [
  'Отлично! Идём дальше 🎉',
  'Красота! Ты справился 💪',
  'Чисто сработано! 🚀',
  'Вот это уровень! ⭐',
]

const props = defineProps<{ moduleId: string; lessonId: string }>()

const router = useRouter()
const { t } = useI18n()
const progress = useProgressStore()

const flat = computed(() => findLesson(props.moduleId, props.lessonId))
const fullId = computed(() => lessonKey(props.moduleId, props.lessonId))

const currentIndex = ref(0)
const stepSolved = ref(false)
const finished = ref(false)

const steps = computed(() => flat.value?.lesson.steps ?? [])
const currentStep = computed(() => steps.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === steps.value.length - 1)
const canProceed = computed(() => currentStep.value?.kind === 'theory' || stepSolved.value)

watch(
  [currentIndex, flat],
  () => {
    stepSolved.value = currentStep.value?.kind === 'theory'
  },
  { immediate: true },
)

watch(fullId, () => {
  currentIndex.value = 0
  finished.value = false
})

function onQuizSolved() {
  progress.markStepComplete(fullId.value, currentIndex.value, XP_REWARDS.quizCorrect)
  progress.checkAchievements()
  stepSolved.value = true
}

function onExerciseSolved() {
  progress.markStepComplete(fullId.value, currentIndex.value, XP_REWARDS.quizCorrect)
  progress.checkAchievements()
  stepSolved.value = true
}

function onCodeSolved(firstTry: boolean) {
  const firstTime = progress.markStepComplete(
    fullId.value,
    currentIndex.value,
    XP_REWARDS.codeSolved,
  )
  if (firstTime) {
    progress.markCodeSolved()
    if (firstTry) progress.addXp(XP_REWARDS.firstTry)
  }
  progress.checkAchievements()
  stepSolved.value = true
}

function next() {
  if (!canProceed.value) return
  if (isLast.value) {
    finish()
  } else {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function finish() {
  if (flat.value) {
    progress.completeLesson(fullId.value, flat.value.lesson.xp)
    progress.checkAchievements()
  }
  finished.value = true
}

const upcoming = computed(() => nextLesson(props.moduleId, props.lessonId))

function goNext() {
  const nx = upcoming.value
  if (nx) {
    router.push({
      name: 'lesson',
      params: { moduleId: nx.module.id, lessonId: nx.lesson.id },
    })
  } else {
    router.push('/')
  }
}

function stepDotClass(i: number) {
  return {
    'dot--done': progress.isStepComplete(fullId.value, i),
    'dot--current': i === currentIndex.value && !finished.value,
  }
}

function stepIcon(kind: string) {
  return STEP_ICON[kind as StepKind] ?? '•'
}

const coach = computed<{ mood: 'idle' | 'happy' | 'thinking'; message: string }>(() => {
  if (stepSolved.value && currentStep.value?.kind !== 'theory') {
    return { mood: 'happy', message: SOLVED_LINES[currentIndex.value % SOLVED_LINES.length] }
  }
  switch (currentStep.value?.kind) {
    case 'quiz':
      return { mood: 'thinking', message: 'Выбери верный вариант — не бойся ошибиться!' }
    case 'code':
      return { mood: 'thinking', message: 'Напиши функцию и жми «Запустить». Я проверю ✨' }
    case 'markup':
      return { mood: 'thinking', message: 'Свёрстай и нажми «Проверить» — покажу результат!' }
    case 'blank':
      return { mood: 'thinking', message: 'Заполни пропуски правильными словами 👀' }
    case 'order':
      return { mood: 'thinking', message: 'Перетащи строки в правильном порядке ↕' }
    default:
      return { mood: 'idle', message: 'Разберём тему спокойно. Читай — и жми «Дальше» 🙂' }
  }
})
</script>

<template>
  <div v-if="flat" class="lesson container">
    <div v-if="finished" class="done">
      <div class="done__burst">{{ flat.lesson.icon }}</div>
      <h1>{{ t('lesson.lessonComplete') }}</h1>
      <p class="done__lesson">{{ flat.lesson.title }}</p>
      <div class="done__xp">
        <span class="done__xp-num">+{{ flat.lesson.xp }}</span> {{ t('lesson.earnedXp') }}
      </div>
      <div class="done__actions">
        <button class="btn" @click="router.push('/')">← {{ t('lesson.backToMap') }}</button>
        <button v-if="upcoming" class="btn btn--primary btn--lg" @click="goNext">
          {{ t('lesson.nextLesson') }} →
        </button>
        <button v-else class="btn btn--primary btn--lg" @click="router.push('/')">
          🏁 {{ t('lesson.backToMap') }}
        </button>
      </div>
    </div>

    <template v-else>
      <div class="lesson__head">
        <button class="lesson__back btn btn--ghost" @click="router.push('/')">←</button>
        <div class="lesson__meta">
          <div class="lesson__crumb">{{ flat.module.icon }} {{ flat.module.title }}</div>
          <h1 class="lesson__title">{{ flat.lesson.icon }} {{ flat.lesson.title }}</h1>
        </div>
        <div class="chip lesson__xp">+{{ flat.lesson.xp }} XP</div>
      </div>

      <div class="lesson__dots">
        <div v-for="(s, i) in steps" :key="i" class="dot" :class="stepDotClass(i)">
          <span class="dot__kind">{{ stepIcon(s.kind) }}</span>
        </div>
        <div class="lesson__progress-label">
          {{ t('lesson.step') }} {{ currentIndex + 1 }} {{ t('lesson.of') }} {{ steps.length }}
        </div>
      </div>

      <div class="lesson__body card">
        <TheoryStep v-if="currentStep.kind === 'theory'" :step="currentStep" />
        <QuizStep
          v-else-if="currentStep.kind === 'quiz'"
          :key="currentIndex"
          :step="currentStep"
          @solved="onQuizSolved"
        />
        <CodeStep
          v-else-if="currentStep.kind === 'code'"
          :key="currentIndex"
          :step="currentStep"
          @solved="onCodeSolved"
        />
        <MarkupStep
          v-else-if="currentStep.kind === 'markup'"
          :key="currentIndex"
          :step="currentStep"
          @solved="onCodeSolved"
        />
        <BlankStep
          v-else-if="currentStep.kind === 'blank'"
          :key="currentIndex"
          :step="currentStep"
          @solved="onExerciseSolved"
        />
        <OrderStep
          v-else-if="currentStep.kind === 'order'"
          :key="currentIndex"
          :step="currentStep"
          @solved="onExerciseSolved"
        />
      </div>

      <MascotCoach class="lesson__coach" :mood="coach.mood" :message="coach.message" :size="60" compact />

      <div class="lesson__foot">
        <button class="btn" :disabled="currentIndex === 0" @click="prev">
          ← {{ t('lesson.back') }}
        </button>
        <button class="btn btn--primary btn--lg" :disabled="!canProceed" @click="next">
          {{ isLast ? t('lesson.finish') : t('lesson.next') }} →
        </button>
      </div>
    </template>
  </div>

  <div v-else class="container lesson__missing">
    <p>Урок не найден.</p>
    <button class="btn btn--primary" @click="router.push('/')">К карте</button>
  </div>
</template>

<style scoped>
.lesson {
  padding-top: var(--sp-6);
  padding-bottom: var(--sp-8);
  max-width: 820px;
}
.lesson__coach {
  margin-top: var(--sp-4);
}
.lesson__head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}
.lesson__back {
  font-size: 1.2rem;
  padding: 6px 12px;
}
.lesson__meta {
  flex: 1;
}
.lesson__crumb {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}
.lesson__title {
  margin: 0;
  font-size: 1.6rem;
}
.lesson__xp {
  color: var(--xp);
  border-color: color-mix(in srgb, var(--xp) 40%, transparent);
  font-weight: 700;
}

.lesson__dots {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-4);
}
.dot {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1.5px solid var(--border);
  font-size: 0.9rem;
  transition: all var(--dur) var(--ease);
}
.dot--current {
  border-color: var(--brand-500);
  box-shadow: var(--shadow-glow);
  transform: scale(1.08);
}
.dot--done {
  background: var(--success-soft);
  border-color: var(--success);
}
.lesson__progress-label {
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.lesson__body {
  padding: var(--sp-6);
  min-height: 300px;
}
.lesson__foot {
  display: flex;
  justify-content: space-between;
  margin-top: var(--sp-4);
}

.done {
  text-align: center;
  padding: var(--sp-8) var(--sp-4);
  max-width: 560px;
  margin: 0 auto;
  animation: pop var(--dur-slow) var(--ease);
}
.done__burst {
  font-size: 5rem;
  filter: drop-shadow(0 0 30px var(--brand-glow));
  animation: pop var(--dur-slow) var(--ease);
}
.done__lesson {
  color: var(--text-muted);
  font-size: 1.1rem;
}
.done__xp {
  display: inline-block;
  margin: var(--sp-4) 0 var(--sp-6);
  padding: var(--sp-3) var(--sp-5);
  border-radius: var(--r-full);
  background: var(--warning-soft);
  color: var(--xp);
  font-weight: 700;
  font-size: 1.1rem;
}
.done__xp-num {
  font-size: 1.4rem;
}
.done__actions {
  display: flex;
  gap: var(--sp-3);
  justify-content: center;
  flex-wrap: wrap;
}
.lesson__missing {
  text-align: center;
  padding: var(--sp-8);
}
@media (max-width: 640px) {
  .lesson__body {
    padding: var(--sp-4);
  }
}
</style>
