<template>
  <nav class="bottom-nav">
    <div class="blob" :style="blobStyle"></div>
    <router-link v-for="(item, i) in items" :key="item.to" :to="item.to"
      :class="['nav-item', { active: isActive(item.to) }]"
      :ref="el => navRefs[i] = el"
      @click="onNavClick(i)">
      <div class="nav-icon-wrap">
        <span class="nav-icon" :class="{ bounce: bouncingIdx === i }">{{ item.icon }}</span>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const navRefs = ref([])
const bouncingIdx = ref(-1)
const blobPos = ref({ x: 0, width: 60 })

const items = [
  { to: '/client',        icon: '🏠', label: 'Home' },
  { to: '/client/browse', icon: '🔍', label: 'Browse' },
  { to: '/client/ai-guide', icon: '✨', label: 'AI Guide' },
  { to: '/client/wallet', icon: '💳', label: 'Wallet' },
  { to: '/client/sessions', icon: '⏱', label: 'Sessions' },
]

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const blobStyle = computed(() => ({
  transform: `translateX(${blobPos.value.x}px)`,
  width: blobPos.value.width + 'px',
}))

function updateBlob() {
  nextTick(() => {
    const activeIdx = items.findIndex(item => isActive(item.to))
    if (activeIdx >= 0 && navRefs.value[activeIdx]) {
      const el = navRefs.value[activeIdx]
      const navEl = el.$el || el
      blobPos.value = { x: navEl.offsetLeft, width: navEl.offsetWidth }
    }
  })
}

function onNavClick(idx) {
  bouncingIdx.value = idx
  setTimeout(() => { bouncingIdx.value = -1 }, 400)
  if (navigator.vibrate) navigator.vibrate(20)
}

onMounted(() => updateBlob())
watch(() => route.path, () => updateBlob())
</script>

<style scoped>
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-around;
  background: rgba(4,7,26,0.97); backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom));
  height: calc(64px + env(safe-area-inset-bottom));
  position: fixed; /* ensure relative for blob */
}
.blob {
  position: absolute; top: 8px; height: 44px; border-radius: 14px;
  background: rgba(201,168,76,0.12); transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s;
  pointer-events: none; z-index: 0;
}
.nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 6px 8px; border-radius: 14px; text-decoration: none;
  position: relative; z-index: 1; min-width: 52px; transition: all 0.2s;
  flex: 1;
}
.nav-icon-wrap { position: relative; }
.nav-icon { font-size: 1.2rem; display: block; filter: grayscale(60%) opacity(0.5); transition: all 0.25s; }
.nav-item.active .nav-icon { filter: none; }
.nav-icon.bounce { animation: iconBounce 0.4s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes iconBounce { 0%,100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.25) translateY(-4px); } }
.nav-label {
  font-family: 'DM Sans', sans-serif; font-size: 0.6rem; font-weight: 600;
  letter-spacing: 0.03em; color: rgba(240,244,255,0.4); transition: color 0.2s;
}
.nav-item.active .nav-label { color: #C9A84C; }
</style>