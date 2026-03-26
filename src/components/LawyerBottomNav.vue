<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in items" :key="item.to"
      :to="item.to"
      :class="['nav-item', { active: isActive(item.to) }]"
    >
      <div class="nav-icon-wrap">
        <span class="nav-icon">{{ item.icon }}</span>
        <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLawyerStore } from '@/stores/lawyer'

const route = useRoute()
const lawyerStore = useLawyerStore()

const pendingCount = computed(() => lawyerStore.pendingRequests.length)

const items = computed(() => [
  { to: '/lawyer', icon: '📊', label: 'Home' },
  { to: '/lawyer/requests', icon: '📥', label: 'Requests', badge: pendingCount.value || null },
  { to: '/lawyer/services', icon: '⚖️', label: 'Services' },
  { to: '/lawyer/wallet', icon: '💰', label: 'Wallet' },
  { to: '/lawyer/profile', icon: '👤', label: 'Profile' },
])

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
  transition: all 0.2s; min-width: 52px; position: relative;
}
.nav-item.active { background: rgba(201,168,76,0.12); }
.nav-icon-wrap { position: relative; }
.nav-icon { font-size: 1.2rem; display: block; filter: grayscale(60%) opacity(0.5); transition: all 0.2s; }
.nav-item.active .nav-icon { filter: none; }
.nav-badge {
  position: absolute; top: -6px; right: -8px;
  background: #ef4444; color: #fff; font-size: 0.6rem; font-weight: 700;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #04071a;
}
.nav-label {
  font-family: 'DM Sans', sans-serif; font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.03em;
  color: rgba(240,244,255,0.4); transition: color 0.2s;
}
.nav-item.active .nav-label { color: #C9A84C; }
</style>