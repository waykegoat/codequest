<script setup lang="ts">
withDefaults(
  defineProps<{
    mood?: 'idle' | 'happy' | 'thinking' | 'sad' | 'wave'
    size?: number
  }>(),
  { mood: 'idle', size: 96 },
)
</script>

<template>
  <svg
    class="bot"
    :class="`bot--${mood}`"
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    fill="none"
    role="img"
    aria-label="Маскот Байт"
  >
    <defs>
      <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.6" stop-color="#d4d4d8" />
        <stop offset="1" stop-color="#a1a1aa" />
      </linearGradient>
      <radialGradient id="botGlow" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.85" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
    </defs>

    <line
      x1="60"
      y1="16"
      x2="60"
      y2="30"
      stroke="#d4d4d8"
      stroke-width="3"
      stroke-linecap="round"
    />
    <circle class="bot__antenna" cx="60" cy="13" r="5" fill="#ffffff" />

    <g class="bot__body">
      <rect x="22" y="28" width="76" height="66" rx="22" fill="url(#botBody)" />
      <rect
        x="22"
        y="28"
        width="76"
        height="66"
        rx="22"
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        stroke-width="1.5"
      />

      <rect x="32" y="40" width="56" height="42" rx="15" fill="#0a0a0c" />
      <ellipse cx="60" cy="58" rx="30" ry="16" fill="url(#botGlow)" opacity="0.3" />

      <g class="bot__eyes" fill="#ffffff">
        <template v-if="mood === 'idle' || mood === 'wave'">
          <circle class="bot__eye" cx="49" cy="58" r="5" />
          <circle class="bot__eye" cx="71" cy="58" r="5" />
        </template>

        <template v-else-if="mood === 'happy'">
          <path
            d="M43 60 q6 -9 12 0"
            stroke="#ffffff"
            stroke-width="4"
            stroke-linecap="round"
            fill="none"
          />
          <path
            d="M65 60 q6 -9 12 0"
            stroke="#ffffff"
            stroke-width="4"
            stroke-linecap="round"
            fill="none"
          />
        </template>

        <template v-else-if="mood === 'thinking'">
          <rect x="44" y="56" width="10" height="4" rx="2" />
          <circle cx="71" cy="58" r="5" />
        </template>

        <template v-else>
          <circle cx="49" cy="60" r="5" />
          <circle cx="71" cy="60" r="5" />
        </template>
      </g>

      <g class="bot__mouth" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" fill="none">
        <path v-if="mood === 'happy'" d="M50 72 q10 10 20 0" />
        <path v-else-if="mood === 'sad'" d="M50 76 q10 -9 20 0" />
        <circle
          v-else-if="mood === 'thinking'"
          cx="60"
          cy="73"
          r="3"
          fill="#ffffff"
          stroke="none"
        />
        <path v-else d="M52 73 h16" />
      </g>
    </g>

    <rect x="16" y="48" width="7" height="20" rx="3.5" fill="#6b6b73" />
    <rect x="97" y="48" width="7" height="20" rx="3.5" fill="#6b6b73" />

    <g v-if="mood === 'wave'" class="bot__hand">
      <line
        x1="98"
        y1="70"
        x2="112"
        y2="60"
        stroke="#d4d4d8"
        stroke-width="4"
        stroke-linecap="round"
      />
      <circle cx="113" cy="58" r="5" fill="#ffffff" />
    </g>
  </svg>
</template>

<style scoped>
.bot {
  overflow: visible;
}
.bot__body {
  transform-origin: 60px 60px;
  animation: float 4s var(--ease) infinite;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.5));
}
.bot--happy .bot__body {
  animation: bot-bounce 0.6s var(--ease-spring);
}
.bot--sad .bot__body {
  animation: shake 0.5s ease;
}
.bot__antenna {
  animation: bot-blink-glow 2.4s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
}
.bot__eye {
  animation: bot-blink 4.5s infinite;
  transform-origin: center;
}
.bot__hand {
  transform-origin: 100px 70px;
  animation: bot-wave 0.6s ease-in-out infinite;
}

@keyframes bot-bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-8px) scale(1.04);
  }
}
@keyframes bot-blink {
  0%,
  92%,
  100% {
    transform: scaleY(1);
  }
  96% {
    transform: scaleY(0.1);
  }
}
@keyframes bot-blink-glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
@keyframes bot-wave {
  0%,
  100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(16deg);
  }
}
</style>
