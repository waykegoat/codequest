import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const KEY = 'codequest:settings:v1'

type Theme = 'dark' | 'light'
type Locale = 'ru' | 'en'
type AiProvider = 'pollinations' | 'gemini' | 'offline'

interface Shape {
  theme: Theme
  locale: Locale
  aiProvider?: AiProvider
  geminiApiKey?: string
  allowSkip5Always?: boolean
}

function load(): Shape {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Shape
  } catch {}
  return { theme: 'dark', locale: 'ru', aiProvider: 'pollinations', geminiApiKey: '', allowSkip5Always: true }
}

export const useSettingsStore = defineStore('settings', () => {
  const initial = load()
  const theme = ref<Theme>(initial.theme)
  const locale = ref<Locale>(initial.locale)
  const aiProvider = ref<AiProvider>(initial.aiProvider ?? 'pollinations')
  const geminiApiKey = ref<string>(initial.geminiApiKey ?? '')
  const allowSkip5Always = ref<boolean>(initial.allowSkip5Always ?? true)

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    [theme, locale, aiProvider, geminiApiKey, allowSkip5Always],
    () => {
      applyTheme()
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            theme: theme.value,
            locale: locale.value,
            aiProvider: aiProvider.value,
            geminiApiKey: geminiApiKey.value,
            allowSkip5Always: allowSkip5Always.value,
          }),
        )
      } catch {}
    },
    { immediate: true },
  )

  return { theme, locale, aiProvider, geminiApiKey, allowSkip5Always, toggleTheme, applyTheme }
})
