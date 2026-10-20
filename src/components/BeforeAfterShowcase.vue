<script setup lang="ts">
import { ref } from 'vue'

const splitPos = ref(50) // 0 to 100
const isDragging = ref(false)
const liked = ref(false)
const likesCount = ref(128)

function toggleLike() {
  liked.value = !liked.value
  likesCount.value += liked.value ? 1 : -1
}

function setPreset(pos: number) {
  splitPos.value = pos
}
</script>

<template>
  <div class="showcase card">
    <div class="showcase__header">
      <div class="showcase__title-box">
        <span class="showcase__pill">Интерактивная магия CSS</span>
        <h3 class="showcase__title">Один и тот же HTML — две разные реальности</h3>
        <p class="showcase__sub">Потяни ползунок, чтобы увидеть, как CSS и компоненты превращают сырой текст в живой продукт.</p>
      </div>

      <div class="showcase__presets">
        <button
          class="btn btn--sm"
          :class="splitPos === 0 ? 'btn--primary' : 'btn--ghost'"
          @click="setPreset(0)"
        >
          Чистый HTML
        </button>
        <button
          class="btn btn--sm"
          :class="splitPos === 50 ? 'btn--primary' : 'btn--ghost'"
          @click="setPreset(50)"
        >
          50 / 50
        </button>
        <button
          class="btn btn--sm"
          :class="splitPos === 100 ? 'btn--primary' : 'btn--ghost'"
          @click="setPreset(100)"
        >
          Готовый UI ✨
        </button>
      </div>
    </div>

    <!-- Split Visual Arena -->
    <div class="split-view">
      <!-- Right / Full background: Styled Vue & CSS Version -->
      <div class="split-view__styled">
        <div class="styled-card">
          <div class="styled-card__badge">Full-Stack Pro</div>
          <div class="styled-card__avatar">⚡</div>
          <h4 class="styled-card__name">Алекс Романов</h4>
          <p class="styled-card__role">Vue 3 / TypeScript / Node.js</p>
          <div class="styled-card__stats">
            <div class="styled-card__stat">
              <span class="num">15</span>
              <span class="lbl">Модулей</span>
            </div>
            <div class="styled-card__stat">
              <span class="num">6</span>
              <span class="lbl">Боссов</span>
            </div>
            <div class="styled-card__stat">
              <span class="num">3.4k</span>
              <span class="lbl">XP</span>
            </div>
          </div>
          <button class="styled-card__btn" :class="{ 'is-liked': liked }" @click="toggleLike">
            {{ liked ? '❤️ В избранном' : '🤍 Поддержать проект' }} ({{ likesCount }})
          </button>
        </div>
      </div>

      <!-- Left / Clipped overlay: Raw unstyled HTML Version -->
      <div class="split-view__raw" :style="{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }">
        <div class="raw-card">
          <div>[Тэг SPAN: Full-Stack Pro]</div>
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23999'/%3E%3C/svg%3E" alt="Аватар" />
          <h4>Алекс Романов</h4>
          <p>Vue 3 / TypeScript / Node.js</p>
          <ul>
            <li>15 Модулей</li>
            <li>6 Боссов</li>
            <li>3.4k XP</li>
          </ul>
          <button @click="toggleLike">Поддержать ({{ likesCount }})</button>
        </div>
      </div>

      <!-- Divider Handle -->
      <div
        class="split-divider"
        :style="{ left: splitPos + '%' }"
        :class="{ 'is-dragging': isDragging }"
      >
        <div class="split-divider__line" />
        <div class="split-divider__handle">
          <span>‹</span>
          <span>›</span>
        </div>
      </div>

      <!-- Interactive Range Input Overlay -->
      <input
        v-model.number="splitPos"
        type="range"
        min="0"
        max="100"
        class="split-range-input"
        aria-label="Сравнение HTML и CSS"
        @mousedown="isDragging = true"
        @mouseup="isDragging = false"
        @touchstart="isDragging = true"
        @touchend="isDragging = false"
      />
    </div>

    <!-- Tags footer -->
    <div class="showcase__foot">
      <div class="showcase__tag">← Слева: браузерный HTML по умолчанию</div>
      <div class="showcase__tag">Справа: современный CSS Grid, Neomorphism & Transitions →</div>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  background: var(--surface-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--r-xl);
  padding: var(--sp-6);
  margin: var(--sp-6) 0;
  overflow: hidden;
}

.showcase__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--sp-4);
  margin-bottom: var(--sp-5);
}

.showcase__pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  background: rgba(124, 92, 255, 0.18);
  color: #a78bfa;
  border: 1px solid rgba(124, 92, 255, 0.35);
  border-radius: var(--r-full);
  margin-bottom: var(--sp-2);
}

.showcase__title {
  margin: 0 0 6px;
  font-size: 1.35rem;
  font-weight: 800;
}

.showcase__sub {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.92rem;
  max-width: 55ch;
}

.showcase__presets {
  display: flex;
  gap: var(--sp-2);
}

/* Split Visual Arena */
.split-view {
  position: relative;
  height: 380px;
  border-radius: var(--r-lg);
  overflow: hidden;
  border: 1px solid var(--line-strong);
  user-select: none;
}

/* Styled side */
.split-view__styled {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 30%, #1e1b4b 0%, #09090b 100%);
  display: grid;
  place-items: center;
  padding: var(--sp-4);
}

.styled-card {
  width: 100%;
  max-width: 320px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--r-xl);
  padding: var(--sp-5);
  text-align: center;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(99, 102, 241, 0.2);
}

.styled-card__badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: var(--r-full);
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  margin-bottom: var(--sp-3);
}

.styled-card__avatar {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--sp-3);
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  font-size: 1.8rem;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
}

.styled-card__name {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
}

.styled-card__role {
  margin: 0 0 var(--sp-4);
  font-size: 0.82rem;
  color: #94a3b8;
  font-family: var(--font-mono);
}

.styled-card__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
  margin-bottom: var(--sp-4);
  background: rgba(15, 23, 42, 0.6);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--r-md);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.styled-card__stat .num {
  display: block;
  font-weight: 800;
  font-size: 0.95rem;
  color: #38bdf8;
}
.styled-card__stat .lbl {
  display: block;
  font-size: 0.68rem;
  color: #64748b;
  text-transform: uppercase;
}

.styled-card__btn {
  width: 100%;
  padding: 10px 16px;
  border-radius: var(--r-md);
  border: none;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  color: white;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.styled-card__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.5);
}
.styled-card__btn.is-liked {
  background: #ec4899;
}

/* Raw unstyled side */
.split-view__raw {
  position: absolute;
  inset: 0;
  background: #ffffff;
  color: #000000;
  display: grid;
  place-items: center;
  padding: var(--sp-4);
  font-family: 'Times New Roman', Times, serif;
}

.raw-card {
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  color: #000000;
  padding: 16px;
  border: 1px solid black;
}
.raw-card h4 {
  margin: 8px 0 4px;
}
.raw-card p {
  margin: 0 0 8px;
}
.raw-card ul {
  padding-left: 20px;
  margin: 0 0 12px;
}
.raw-card button {
  padding: 2px 6px;
  cursor: pointer;
}

/* Divider Handle */
.split-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ffffff;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
}
.split-divider__handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffffff;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-weight: 900;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

/* Range input overlay */
.split-range-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: ew-resize;
  z-index: 20;
  margin: 0;
}

.showcase__foot {
  display: flex;
  justify-content: space-between;
  margin-top: var(--sp-3);
  font-size: 0.8rem;
  color: var(--text-dim);
  font-family: var(--font-mono);
}

@media (max-width: 700px) {
  .showcase__header {
    flex-direction: column;
  }
  .showcase__foot {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
