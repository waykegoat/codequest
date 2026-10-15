<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import XpBar from './XpBar.vue'
import StreakBadge from './StreakBadge.vue'

const { t } = useI18n()
const settings = useSettingsStore()
const auth = useAuthStore()
const admin = useAdminStore()
</script>

<template>
  <header class="hd">
    <div class="hd__inner container">
      <RouterLink to="/" class="hd__brand">
        <span class="hd__mark">&lt;/&gt;</span>
        <span class="hd__name">CodeQuest</span>
      </RouterLink>

      <nav class="hd__nav">
        <RouterLink to="/" class="hd__link">{{ t('nav.map') }}</RouterLink>
        <RouterLink to="/playground" class="hd__link">Песочница</RouterLink>
        <RouterLink to="/achievements" class="hd__link">{{ t('nav.achievements') }}</RouterLink>
        <RouterLink to="/profile" class="hd__link">{{ t('nav.profile') }}</RouterLink>
        <RouterLink
          v-if="admin.isAdminAuthenticated"
          to="/admin"
          class="hd__link hd__link--admin"
          title="Панель администратора"
        >
          🛡️ Админка
        </RouterLink>
      </nav>

      <div class="hd__stats">
        <StreakBadge />
        <XpBar />
        <button class="hd__theme btn btn--ghost" @click="settings.toggleTheme" title="Мазо мод">
          {{ settings.theme === 'dark' ? '◐' : '◑' }}
        </button>

        <RouterLink
          v-if="auth.currentUser"
          to="/profile"
          class="hd__user-pill"
          :title="`Профиль: ${auth.currentUser.displayName}`"
        >
          <span class="hd__user-avatar">{{ auth.currentUser.avatar }}</span>
          <span class="hd__user-name">{{ auth.currentUser.displayName }}</span>
        </RouterLink>
        <button
          v-else
          class="btn btn--sm btn--primary hd__login-btn"
          @click="auth.openAuthModal('login')"
        >
          👤 Войти
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hd {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-h);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.1);
  -webkit-backdrop-filter: blur(14px) saturate(1.1);
  border-bottom: 1px solid var(--line);
}
.hd__inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.hd__brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--text);
}
.hd__mark {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 1rem;
  padding: 4px 8px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--surface-2);
}
.hd__name {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}
.hd__nav {
  display: flex;
  gap: var(--sp-1);
  margin-left: var(--sp-3);
}
.hd__link {
  padding: 6px 12px;
  border-radius: var(--r-sm);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.86rem;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.hd__link:hover {
  background: var(--surface-2);
  color: var(--text);
}
.hd__link.router-link-exact-active {
  background: var(--ink);
  color: var(--ink-inverse);
}
.hd__stats {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-left: auto;
}
.hd__theme {
  padding: 6px 10px;
  font-size: 1rem;
}
.hd__user-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text);
  transition: all var(--dur-fast) var(--ease);
}
.hd__user-pill:hover {
  background: var(--surface-3);
  border-color: var(--accent);
}
.hd__user-avatar {
  font-size: 1.1rem;
}
.hd__user-name {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hd__login-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
}
@media (max-width: 820px) {
  .hd__nav {
    display: none;
  }
}
</style>
