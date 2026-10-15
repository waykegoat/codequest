<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'
import { getSupabaseConfig } from '@/services/supabase'

const auth = useAuthStore()
const progress = useProgressStore()

const AVATARS = ['🤖', '💻', '🚀', '⚡', '🦊', '🐱', '👾', '🧙', '☕', '🎮', '🎯', '🔥']

const email = ref('')
const displayName = ref('')
const password = ref('')
const selectedAvatar = ref('🤖')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

// Cloud connection config fields
const cloudUrl = ref('')
const cloudKey = ref('')
const cloudSaveMsg = ref('')

onMounted(() => {
  const cfg = getSupabaseConfig()
  cloudUrl.value = cfg.url
  cloudKey.value = cfg.anonKey
})

function resetForm() {
  email.value = ''
  displayName.value = ''
  password.value = ''
  errorMsg.value = ''
  successMsg.value = ''
  cloudSaveMsg.value = ''
  loading.value = false
}

function setTab(tab: 'login' | 'register' | 'cloud') {
  auth.authModalTab = tab
  resetForm()
  if (tab === 'cloud') {
    const cfg = getSupabaseConfig()
    cloudUrl.value = cfg.url
    cloudKey.value = cfg.anonKey
  }
}

async function handleLogin() {
  if (!email.value.trim()) {
    errorMsg.value = 'Введите email'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  const res = await auth.login(email.value, password.value)
  loading.value = false
  if (!res.ok) {
    errorMsg.value = res.error || 'Ошибка входа'
  } else {
    progress.switchUser(auth.currentUserId)
    auth.closeAuthModal()
    resetForm()
  }
}

async function handleRegister() {
  if (!email.value.trim() || !email.value.includes('@')) {
    errorMsg.value = 'Введите корректный email (нужен для входа с других устройств)'
    return
  }
  if (!password.value || password.value.length < 6) {
    errorMsg.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  const res = await auth.register({
    email: email.value,
    displayName: displayName.value || email.value.split('@')[0],
    password: password.value,
    avatar: selectedAvatar.value,
  })
  loading.value = false

  if (!res.ok) {
    errorMsg.value = res.error || 'Ошибка регистрации'
  } else {
    if (res.message) {
      successMsg.value = res.message
    } else {
      progress.switchUser(auth.currentUserId)
      auth.closeAuthModal()
      resetForm()
    }
  }
}

function saveCloudSettings() {
  if (!cloudUrl.value.trim() || !cloudKey.value.trim()) {
    auth.disconnectCloud()
    cloudSaveMsg.value = 'Облако отключено. Переключено в локальный режим.'
    return
  }

  auth.configureCloud(cloudUrl.value, cloudKey.value)
  cloudSaveMsg.value = '✓ Настройки сохранены! Облако подключено.'
}

function continueAsGuest() {
  auth.logout()
  progress.switchUser(null)
  auth.closeAuthModal()
}
</script>

<template>
  <div v-if="auth.authModalOpen" class="auth-modal" @click.self="auth.closeAuthModal">
    <div class="auth-modal__dialog card">
      <button class="auth-modal__close btn btn--ghost btn--xs" @click="auth.closeAuthModal">✕</button>

      <div class="auth-modal__header">
        <div class="auth-modal__icon">☁️</div>
        <h2 class="auth-modal__title">CodeQuest Cloud ID</h2>
        <p class="auth-modal__sub">
          Онлайн-профиль: сохраняй прогресс и заходи с любого устройства (ПК, планшет, телефон).
        </p>

        <div class="auth-modal__status-pill" :class="auth.cloudActive ? 'is-cloud' : 'is-local'">
          <span class="auth-modal__status-dot" />
          <span>{{ auth.cloudActive ? 'Онлайн-облако активно (Supabase)' : 'Локальный режим (настройте облако для синхронизации)' }}</span>
        </div>
      </div>

      <div class="auth-modal__tabs">
        <button
          class="auth-modal__tab"
          :class="{ active: auth.authModalTab === 'login' }"
          @click="setTab('login')"
        >
          Вход
        </button>
        <button
          class="auth-modal__tab"
          :class="{ active: auth.authModalTab === 'register' }"
          @click="setTab('register')"
        >
          Регистрация
        </button>
        <button
          class="auth-modal__tab"
          :class="{ active: auth.authModalTab === 'cloud' }"
          @click="setTab('cloud')"
        >
          ⚙️ Облако
        </button>
      </div>

      <div v-if="errorMsg" class="auth-modal__alert auth-modal__alert--err">
        {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="auth-modal__alert auth-modal__alert--ok">
        {{ successMsg }}
      </div>

      <!-- Login Form -->
      <form v-if="auth.authModalTab === 'login'" class="auth-modal__form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email адрес</label>
          <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="developer@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div class="auth-modal__actions">
          <button type="submit" class="btn btn--primary btn--lg full-w" :disabled="loading">
            {{ loading ? 'Синхронизируем…' : 'Войти и загрузить прогресс' }}
          </button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else-if="auth.authModalTab === 'register'" class="auth-modal__form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">Аватар</label>
          <div class="avatar-picker">
            <button
              v-for="av in AVATARS"
              :key="av"
              type="button"
              class="avatar-btn"
              :class="{ selected: selectedAvatar === av }"
              @click="selectedAvatar = av"
            >
              {{ av }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email (для входа на других устройствах)</label>
          <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="developer@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Имя или никнейм</label>
          <input
            v-model="displayName"
            type="text"
            class="form-input"
            placeholder="например, Артём"
            autocomplete="nickname"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Пароль (минимум 6 символов)</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
            autocomplete="new-password"
          />
        </div>

        <div class="auth-modal__actions">
          <button type="submit" class="btn btn--primary btn--lg full-w" :disabled="loading">
            {{ loading ? 'Создаём онлайн-аккаунт…' : 'Зарегистрироваться бесплатно' }}
          </button>
        </div>
      </form>

      <!-- Cloud Configuration Tab -->
      <div v-else class="auth-modal__cloud">
        <div class="cloud-info">
          <div class="cloud-info__title">Бесплатная база данных Supabase</div>
          <p class="cloud-info__text">
            Чтобы прогресс сохранялся в реальном облаке и синхронизировался между телефоном, ноутбуком и рабочим компьютером:
          </p>
          <ol class="cloud-info__steps">
            <li>Создайте бесплатный проект на <strong>supabase.com</strong> (до 50 000 пользователей бесплатно).</li>
            <li>Выполните скрипт создания таблицы из файла <code>supabase/schema.sql</code> в SQL Editor.</li>
            <li>Вставьте сюда <strong>Project URL</strong> и <strong>anon public API key</strong> из настроек API:</li>
          </ol>
        </div>

        <div v-if="cloudSaveMsg" class="auth-modal__alert auth-modal__alert--ok">
          {{ cloudSaveMsg }}
        </div>

        <div class="form-group">
          <label class="form-label">Project URL:</label>
          <input
            v-model="cloudUrl"
            type="text"
            placeholder="https://xyzcompany.supabase.co"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Project API Anon Key:</label>
          <input
            v-model="cloudKey"
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsIn..."
            class="form-input"
          />
        </div>

        <div class="auth-modal__actions">
          <button class="btn btn--primary full-w" @click="saveCloudSettings">
            💾 Сохранить и подключить облако
          </button>
        </div>
      </div>

      <div class="auth-modal__footer">
        <button class="btn btn--ghost btn--sm" @click="continueAsGuest">
          Продолжить как гость (офлайн)
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  padding: var(--sp-3);
  animation: fade-in 0.2s ease;
}

.auth-modal__dialog {
  position: relative;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-5) var(--sp-6);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  animation: scale-up 0.2s ease;
}

@keyframes scale-up {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.auth-modal__close {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  font-size: 1.1rem;
}

.auth-modal__header {
  text-align: center;
  margin-bottom: var(--sp-4);
}

.auth-modal__icon {
  font-size: 2.2rem;
  margin-bottom: var(--sp-1);
}

.auth-modal__title {
  margin: 0 0 var(--sp-1);
  font-size: 1.4rem;
}

.auth-modal__sub {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.auth-modal__status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--sp-2);
  padding: 3px 10px;
  border-radius: var(--r-full);
  font-size: 0.76rem;
  font-family: var(--font-mono);
}

.auth-modal__status-pill.is-cloud {
  background: color-mix(in srgb, var(--success) 12%, transparent);
  color: var(--success);
  border: 1px solid color-mix(in srgb, var(--success) 30%, transparent);
}

.auth-modal__status-pill.is-local {
  background: var(--surface-3);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.auth-modal__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.auth-modal__tabs {
  display: flex;
  background: var(--surface-2);
  border-radius: var(--r-md);
  padding: 3px;
  margin-bottom: var(--sp-4);
}

.auth-modal__tab {
  flex: 1;
  border: none;
  background: none;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.88rem;
  padding: 8px;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease);
}

.auth-modal__tab.active {
  background: var(--ink);
  color: var(--ink-inverse);
}

.auth-modal__alert {
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--r-sm);
  font-size: 0.86rem;
  margin-bottom: var(--sp-3);
}

.auth-modal__alert--err {
  background: var(--danger-soft);
  color: var(--danger);
}

.auth-modal__alert--ok {
  background: var(--success-soft);
  color: var(--success);
}

.auth-modal__form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.cloud-info {
  background: var(--surface-2);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  margin-bottom: var(--sp-3);
  font-size: 0.84rem;
}

.cloud-info__title {
  font-weight: 700;
  margin-bottom: 4px;
}

.cloud-info__text {
  margin: 0 0 6px;
  color: var(--text-muted);
}

.cloud-info__steps {
  margin: 0;
  padding-left: 18px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cloud-info__steps code {
  font-family: var(--font-mono);
  background: var(--surface-3);
  padding: 1px 4px;
  border-radius: 3px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-size: 0.8rem;
  color: var(--text-dim);
  font-weight: 600;
}

.form-input {
  padding: 10px 12px;
  border-radius: var(--r-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: inherit;
  font-size: 0.92rem;
  transition: border-color var(--dur-fast) var(--ease);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
}

.avatar-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.avatar-btn {
  font-size: 1.3rem;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: var(--r-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease);
}

.avatar-btn:hover {
  transform: scale(1.1);
}

.avatar-btn.selected {
  border-color: var(--accent);
  background: var(--surface-3);
  transform: scale(1.15);
}

.full-w {
  width: 100%;
}

.auth-modal__actions {
  margin-top: var(--sp-2);
}

.auth-modal__footer {
  margin-top: var(--sp-4);
  text-align: center;
}
</style>
