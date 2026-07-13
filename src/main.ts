import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/base.css'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import { useSettingsStore } from './stores/settings'
import { useProgressStore } from './stores/progress'
import { vTilt } from './directives/tilt'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.directive('tilt', vTilt)

const settings = useSettingsStore()
settings.applyTheme()
i18n.global.locale.value = settings.locale

useProgressStore().recordActivity()

app.mount('#app')
