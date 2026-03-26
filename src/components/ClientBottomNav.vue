<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in items" :key="item.to"
      :to="item.to"
      :class="['nav-item', { active: isActive(item.to) }]"
    >
      <div class="nav-icon-wrap">
        <span class="nav-icon">{{ item.icon }}</span>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { to: '/client', icon: '🏠', label: 'Home' },
  { to: '/client/browse', icon: '🔍', label: 'Browse' },
  { to: '/client/ai-guide', icon: '✨', label: 'AI Guide' },
  { to: '/client/sessions', icon: '⏱', label: 'Sessions' },
  { to: '/client/saved', icon: '❤️', label: 'Saved' },
]

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')
</script>

<style scoped>
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-around;
  background: rgba(4,7,26,0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom));
  height: calc(60px + env(safe-area-inset-bottom));
}
.nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 6px 12px; border-radius: 12px; text-decoration: none;
  transition: all 0.2s; min-width: 52px;
}
.nav-item.active { background: rgba(201,168,76,0.12); }
.nav-icon { font-size: 1.2rem; display: block; filter: grayscale(60%) opacity(0.5); transition: all 0.2s; }
.nav-item.active .nav-icon { filter: none; }
.nav-label {
  font-family: 'DM Sans', sans-serif; font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.03em; color: rgba(240,244,255,0.4); transition: color 0.2s;
}
.nav-item.active .nav-label { color: #C9A84C; }
</style>