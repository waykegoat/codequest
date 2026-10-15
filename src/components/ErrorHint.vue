<script setup lang="ts">
import { ref, watch } from 'vue'
import { requestAiHint, type HintResult } from '@/services/aiHintService'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{
  code: string
  prompt?: string
  lang?: string
  compileError?: string
  runtimeError?: string
  logs?: string[]
  failedTests?: Array<{ name: string; expected?: string; actual?: string; error?: string }>
}>()

const settings = useSettingsStore()
const loading = ref(false)
const hint = ref<HintResult | null>(null)
const expanded = ref(false)

// Reset hint when user changes code or error clears
watch(
  () => [props.compileError, props.runtimeError, props.failedTests],
  () => {
    hint.value = null
    expanded.value = false
  },
)

async function getExplanation() {
  loading.value = true
  expanded.value = true
  try {
    const res = await requestAiHint(
      {
        code: props.code,
        prompt: props.prompt,
        lang: props.lang,
        compileError: props.compileError,
        runtimeError: props.runtimeError,
        logs: props.logs,
        failedTests: props.failedTests,
      },
      (settings as unknown as { geminiApiKey?: string }).geminiApiKey,
      (settings as unknown as { aiProvider?: string }).aiProvider || 'pollinations',
    )
    hint.value = res
  } catch {
    hint.value = null
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="err-hint">
    <div v-if="!expanded" class="err-hint__bar">
      <button class="btn btn--accent btn--sm err-hint__trigger" :disabled="loading" @click="getExplanation">
        <span class="err-hint__robot">🤖</span>
        <span>Байт, объясни ошибку</span>
        <span class="err-hint__badge">без прямого ответа</span>
      </button>
    </div>

    <div v-else class="err-hint__card">
      <div class="err-hint__head">
        <div class="err-hint__title">
          <span class="err-hint__robot">🤖</span>
          <strong>{{ hint ? hint.title : 'Байт анализирует код…' }}</strong>
        </div>
        <div class="err-hint__meta">
          <span v-if="hint" class="err-hint__source" :class="hint.source === 'ai' ? 'source-ai' : 'source-offline'">
            {{ hint.source === 'ai' ? '✨ ИИ-наставник' : '⚡ Байт-анализ' }}
          </span>
          <button class="btn btn--ghost btn--xs" @click="expanded = false" title="Свернуть">✕</button>
        </div>
      </div>

      <div v-if="loading" class="err-hint__loading">
        <div class="err-hint__spinner" />
        <span>Ищу причину проблемы и формулирую подсказку…</span>
      </div>

      <div v-else-if="hint" class="err-hint__body">
        <div class="err-hint__section">
          <div class="err-hint__label">Что произошло:</div>
          <p class="err-hint__text">{{ hint.explanation }}</p>
        </div>

        <div v-if="hint.cause" class="err-hint__section">
          <div class="err-hint__label">В чём причина:</div>
          <p class="err-hint__text">{{ hint.cause }}</p>
        </div>

        <div class="err-hint__section err-hint__section--tip">
          <div class="err-hint__label">💡 Наводящая подсказка:</div>
          <p class="err-hint__text err-hint__text--tip">{{ hint.socraticHint }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.err-hint {
  margin-top: var(--sp-3);
}

.err-hint__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--surface-2);
  border: 1px solid var(--accent);
  color: var(--text);
  font-weight: 600;
  transition: all var(--dur-fast) var(--ease);
}

.err-hint__trigger:hover {
  background: var(--surface-3);
  transform: translateY(-1px);
}

.err-hint__robot {
  font-size: 1.1rem;
}

.err-hint__badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  border-radius: var(--r-full);
  color: var(--text-dim);
  font-weight: 500;
}

.err-hint__card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  animation: fade-up 0.25s var(--ease);
}

.err-hint__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-2);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border);
}

.err-hint__title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 0.95rem;
}

.err-hint__meta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.err-hint__source {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: var(--r-sm);
  background: var(--surface-3);
  color: var(--text-muted);
}

.source-ai {
  color: var(--accent-cyan);
  border: 1px solid color-mix(in srgb, var(--accent-cyan) 30%, transparent);
}

.source-offline {
  color: var(--warning);
  border: 1px solid color-mix(in srgb, var(--warning) 30%, transparent);
}

.err-hint__loading {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) 0;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.err-hint__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.err-hint__body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.err-hint__section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.err-hint__section--tip {
  margin-top: 4px;
  padding: var(--sp-2) var(--sp-3);
  background: color-mix(in srgb, var(--warning) 8%, var(--surface-3));
  border-radius: var(--r-sm);
  border-left: 2px solid var(--warning);
}

.err-hint__label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.err-hint__text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--text);
}

.err-hint__text--tip {
  color: var(--text-bright, #fff);
  font-weight: 500;
}
</style>
