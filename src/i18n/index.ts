import { createI18n } from 'vue-i18n'
import ru from './locales/ru'
import en from './locales/en'

function initialLocale(): 'ru' | 'en' {
  try {
    const raw = localStorage.getItem('codequest:settings:v1')
    if (raw) {
      const parsed = JSON.parse(raw) as { locale?: 'ru' | 'en' }
      if (parsed.locale) return parsed.locale
    }
  } catch {}
  return 'ru'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'ru',
  messages: { ru, en },
})
