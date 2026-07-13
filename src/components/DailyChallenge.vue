<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { flatLessons } from '@/content'
import { useProgressStore } from '@/stores/progress'

const router = useRouter()
const progress = useProgressStore()

const challengeLessons = flatLessons.filter((f) =>
  f.lesson.steps.some((s) => s.kind === 'code' || s.kind === 'markup'),
)

const dayIndex = computed(() => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
})

const daily = computed(() =>
  challengeLessons.length
    ? challengeLessons[dayIndex.value % challengeLessons.length]
    : flatLessons[0],
)

const done = computed(() => (daily.value ? progress.isLessonComplete(daily.value.fullId) : false))

function open() {
  if (!daily.value) return
  router.push({
    name: 'lesson',
    params: { moduleId: daily.value.module.id, lessonId: daily.value.lesson.id },
  })
}
</script>

<template>
  <div v-if="daily" v-tilt="{ max: 4 }" class="daily panel-3d">
    <div class="daily__glyph" aria-hidden="true">&lt;/&gt;</div>
    <div class="daily__body">
      <div class="eyebrow">// челлендж дня</div>
      <h3 class="daily__title">{{ daily.lesson.icon }} {{ daily.lesson.title }}</h3>
      <p class="daily__sub">{{ daily.module.title }} · +{{ daily.lesson.xp }} XP</p>
    </div>
    <div class="daily__action">
      <span v-if="done" class="daily__done">✓ решено</span>
      <button v-else class="btn btn--primary" @click="open">Решить →</button>
    </div>
  </div>
</template>

<style scoped>
.daily {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5);
  margin-top: var(--sp-6);
}
.daily__glyph {
  position: absolute;
  right: 28%;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 6rem;
  font-weight: 800;
  color: var(--text-faint);
  pointer-events: none;
  user-select: none;
}
.daily__body {
  position: relative;
  flex: 1;
}
.daily__title {
  margin: 6px 0 2px;
  font-size: 1.3rem;
}
.daily__sub {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.daily__action {
  position: relative;
  flex: 0 0 auto;
}
.daily__done {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text);
  padding: 0.5em 1em;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
}
@media (max-width: 620px) {
  .daily {
    flex-direction: column;
    align-items: flex-start;
  }
  .daily__glyph {
    display: none;
  }
}
</style>
