import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const KEY = 'codequest:settings:v1'

type Theme = 'dark' | 'light'
type Locale = 'ru' | 'en'

interface Shape {
  theme: Theme
  locale: Locale
}

function load(): Shape {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Shape
  } catch {}
  return { theme: 'dark', locale: 'ru' }
}

export const useSettingsStore = defineStore('settings', () => {
  const initial = load()
  const theme = ref<Theme>(initial.theme)
  const locale = ref<Locale>(initial.locale)

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    [theme, locale],
    () => {
      applyTheme()
      try {
        localStorage.setItem(KEY, JSON.stringify({ theme: theme.value, locale: locale.value }))
      } catch {}
    },
    { immediate: true },
  )

  return { theme, locale, toggleTheme, applyTheme }
})
