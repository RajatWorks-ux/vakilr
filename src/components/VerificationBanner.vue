<template>
  <transition name="banner-slide">
    <div v-if="show" :class="['banner', `banner-${type}`]">
      <span class="banner-icon">{{ icons[type] }}</span>
      <div class="banner-content">
        <div class="banner-title">{{ titles[type] }}</div>
        <div class="banner-msg">{{ message }}</div>
      </div>
      <button v-if="dismissible" class="banner-close" @click="$emit('dismiss')">✕</button>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  type: { default: 'info' },
  message: String,
  dismissible: { default: true },
})
defineEmits(['dismiss'])

const icons  = { pending:'⏳', approved:'✅', rejected:'❌', warning:'⚠️', info:'ℹ️', rate:'💡' }
const titles = { pending:'Verification In Progress', approved:'Profile Verified!', rejected:'Verification Issue', warning:'Action Required', info:'Information', rate:'Rate Suggestion' }
</script>

<style scoped>
.banner {
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 0.875rem 1rem; border-radius: 12px; margin: 0.75rem 1rem;
  position: relative;
}
.banner-pending  { background: rgba(245,158,11,0.1);  border: 1px solid rgba(245,158,11,0.25); }
.banner-approved { background: rgba(16,185,129,0.1);  border: 1px solid rgba(16,185,129,0.25); }
.banner-rejected { background: rgba(239,68,68,0.1);   border: 1px solid rgba(239,68,68,0.25); }
.banner-warning  { background: rgba(245,158,11,0.1);  border: 1px solid rgba(245,158,11,0.25); }
.banner-info     { background: rgba(59,130,246,0.1);  border: 1px solid rgba(59,130,246,0.25); }
.banner-rate     { background: rgba(201,168,76,0.1);  border: 1px solid rgba(201,168,76,0.25); }
.banner-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
.banner-content { flex: 1; }
.banner-title { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.85rem; color: #f0f4ff; margin-bottom: 2px; }
.banner-msg { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: rgba(240,244,255,0.65); line-height: 1.5; }
.banner-close { background: none; border: none; color: rgba(240,244,255,0.4); cursor: pointer; font-size: 0.75rem; flex-shrink: 0; padding: 2px; }
.banner-slide-enter-active, .banner-slide-leave-active { transition: all 0.3s ease; }
.banner-slide-enter-from, .banner-slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>