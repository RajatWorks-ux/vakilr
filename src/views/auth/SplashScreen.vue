<template>
  <div class="splash">
    <div class="splash-bg">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>
    </div>
    <div class="splash-content" :class="{ visible: show }">
      <div class="logo-ring">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke="#C9A84C" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="4 4"/>
          <circle cx="50" cy="50" r="36" stroke="#C9A84C" stroke-width="0.5" stroke-opacity="0.15"/>
          <rect x="48" y="22" width="4" height="56" rx="2" fill="#C9A84C"/>
          <rect x="20" y="28" width="60" height="4" rx="2" fill="#C9A84C"/>
          <rect x="32" y="74" width="36" height="4" rx="2" fill="#C9A84C"/>
          <rect x="38" y="70" width="24" height="4" rx="2" fill="#C9A84C" opacity="0.6"/>
          <line x1="26" y1="32" x2="20" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <line x1="26" y1="32" x2="32" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <path d="M18 50 Q26 58 34 50" stroke="#C9A84C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <line x1="74" y1="32" x2="68" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <line x1="74" y1="32" x2="80" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <path d="M66 50 Q74 58 82 50" stroke="#C9A84C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="50" cy="28" r="4" fill="#C9A84C"/>
        </svg>
        <div class="ring-glow"></div>
      </div>
      <h1 class="splash-title">Vakilr</h1>
      <p class="splash-tagline">Justice for Everyone</p>
      <div class="splash-loader">
        <div class="loader-track">
          <div class="loader-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const show = ref(false)
const progress = ref(0)

onMounted(() => {
  setTimeout(() => { show.value = true }, 100)

  // Animate progress bar
  const interval = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        const visited = localStorage.getItem('vakilr_onboarded')
        router.push(visited ? '/login' : '/onboarding')
      }, 400)
    }
  }, 50)
})
</script>

<style scoped>
.splash {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #04071a; position: relative; overflow: hidden;
}
.splash-bg { position: absolute; inset: 0; }
.orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none;
}
.orb1 {
  width: 400px; height: 400px; top: -100px; left: -100px;
  background: radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%);
  animation: drift1 8s ease-in-out infinite;
}
.orb2 {
  width: 300px; height: 300px; bottom: -80px; right: -80px;
  background: radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%);
  animation: drift2 10s ease-in-out infinite;
}
.orb3 {
  width: 200px; height: 200px; top: 50%; left: 50%; transform: translate(-50%,-50%);
  background: radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%);
}
.splash-content {
  position: relative; z-index: 1; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.splash-content.visible { opacity: 1; transform: translateY(0); }
.logo-ring { position: relative; display: flex; align-items: center; justify-content: center; }
.ring-glow {
  position: absolute; width: 140px; height: 140px; border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.2), transparent 70%);
  animation: pulse-glow 2s ease-in-out infinite;
}
.splash-title {
  font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900;
  font-style: italic; color: #C9A84C; letter-spacing: -0.02em; margin-top: 0.5rem;
}
.splash-tagline {
  font-family: 'DM Sans', sans-serif; font-size: 1rem; color: #8892b0;
  letter-spacing: 0.15em; text-transform: uppercase; font-weight: 300;
}
.splash-loader { margin-top: 3rem; width: 160px; }
.loader-track {
  height: 2px; background: rgba(255,255,255,0.1); border-radius: 1px; overflow: hidden;
}
.loader-fill {
  height: 100%; background: linear-gradient(90deg, #C9A84C, #f0d080);
  border-radius: 1px; transition: width 0.05s linear;
  box-shadow: 0 0 8px rgba(201,168,76,0.8);
}
@keyframes pulse-glow {
  0%,100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
@keyframes drift1 {
  0%,100% { transform: translate(0,0); }
  50% { transform: translate(30px, 20px); }
}
@keyframes drift2 {
  0%,100% { transform: translate(0,0); }
  50% { transform: translate(-20px, -30px); }
}
</style>