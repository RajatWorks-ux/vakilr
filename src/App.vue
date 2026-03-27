<template>
  <div id="app">
    <router-view v-slot="{ Component, route }">
      <transition :name="getTransition(route)" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

function getTransition(route) {
  // Auth flows: slide up
  if (['/onboarding', '/role', '/login', '/signup/client', '/signup/lawyer', '/signup/firm'].includes(route.path))
    return 'slide-up'
  // Going into session: zoom in
  if (route.path.includes('/session') || route.path.includes('/payment'))
    return 'zoom-in'
  // Default: fade
  return 'page-fade'
}
</script>

<style>
/* Page Transitions */
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.2s ease; }
.page-fade-enter-from, .page-fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from { transform: translateY(30px); opacity: 0; }
.slide-up-leave-to { transform: translateY(-20px); opacity: 0; }

.zoom-in-enter-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.zoom-in-leave-active { transition: all 0.2s ease; }
.zoom-in-enter-from { transform: scale(0.96); opacity: 0; }
.zoom-in-leave-to { transform: scale(1.02); opacity: 0; }

#app { height: 100%; }
</style>