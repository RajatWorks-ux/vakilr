<template>
  <div class="onboarding" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <!-- Video Background per slide -->
    <transition name="vid-fade" mode="out-in">
      <video :key="current" class="bg-video" autoplay muted loop playsinline
        :src="slides[current].video" @error="videoBg = false">
      </video>
    </transition>
    <div class="video-overlay"></div>

    <!-- Slides -->
    <div class="slides-container">
      <transition :name="slideDirection" mode="out-in">
        <div class="slide" :key="current">
          <div class="slide-icon">{{ slides[current].icon }}</div>
          <h2 class="slide-headline">{{ slides[current].headline }}</h2>
          <p class="slide-body">{{ slides[current].body }}</p>
        </div>
      </transition>
    </div>

    <!-- Dots -->
    <div class="dots-row">
      <div v-for="(_, i) in slides" :key="i" :class="['dot', { active: i === current }]" @click="goTo(i)"></div>
    </div>

    <!-- Buttons -->
    <div class="btn-row">
      <button v-if="current < slides.length - 1" class="skip-btn" @click="finish">Skip</button>
      <button v-if="current < slides.length - 1" class="next-btn" @click="next">Next →</button>
      <button v-else class="get-started-btn" @click="finish">Get Started →</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const current = ref(0)
const slideDirection = ref('slide-left')

const slides = [
  {
    icon: '⚖️',
    headline: 'Legal Help,\nInstantly.',
    body: 'Connect with verified lawyers for chat, call, or video consultations. Justice is just one tap away.',
    video: '/videos/onboard_justice.mp4',
  },
  {
    icon: '👨‍⚖️',
    headline: 'Top Lawyers,\nVerified.',
    body: 'Every lawyer on Vakilr is bar council verified. Real credentials, real expertise, real results.',
    video: '/videos/onboard_lawyer.mp4',
  },
  {
    icon: '🌐',
    headline: 'India\'s Legal\nMarketplace.',
    body: 'Thousands of lawyers across every specialization. Chat, call, video, documents, and court case support.',
    video: '/videos/onboard_connect.mp4',
  },
]

let touchX = 0
function onTouchStart(e) { touchX = e.touches[0].clientX }
function onTouchEnd(e) {
  const diff = touchX - e.changedTouches[0].clientX
  if (diff > 50 && current.value < slides.length - 1) next()
  if (diff < -50 && current.value > 0) prev()
}

function next() { slideDirection.value = 'slide-left'; current.value++ }
function prev() { slideDirection.value = 'slide-right'; current.value-- }
function goTo(i) { slideDirection.value = i > current.value ? 'slide-left' : 'slide-right'; current.value = i }
function finish() {
  localStorage.setItem('vakilr_onboarded', '1')
  router.push('/role')
}
</script>

<style scoped>
.onboarding { position: fixed; inset: 0; background: #04071a; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; overflow: hidden; }
.bg-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.video-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(4,7,26,0.3) 0%, rgba(4,7,26,0.6) 50%, rgba(4,7,26,0.95) 100%); z-index: 1; }
.slides-container { position: relative; z-index: 2; text-align: center; padding: 0 2rem; margin-bottom: 2rem; min-height: 200px; display: flex; align-items: center; justify-content: center; }
.slide { text-align: center; }
.slide-icon { font-size: 3rem; margin-bottom: 1rem; filter: drop-shadow(0 0 20px rgba(201,168,76,0.8)); }
.slide-headline { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700; color: #f0f4ff; margin: 0 0 1rem; white-space: pre-line; line-height: 1.2; }
.slide-body { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: rgba(240,244,255,0.65); line-height: 1.6; margin: 0; }
.dots-row { position: relative; z-index: 2; display: flex; gap: 8px; margin-bottom: 1.5rem; }
.dot { width: 8px; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.2); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
.dot.active { width: 28px; background: #C9A84C; box-shadow: 0 0 10px rgba(201,168,76,0.6); }
.btn-row { position: relative; z-index: 2; display: flex; gap: 12px; width: calc(100% - 3rem); margin-bottom: calc(2rem + env(safe-area-inset-bottom)); }
.skip-btn { flex: 0 0 auto; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(240,244,255,0.5); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; padding: 14px 20px; border-radius: 14px; cursor: pointer; }
.next-btn, .get-started-btn { flex: 1; background: linear-gradient(135deg, #C9A84C, #a8893d); border: none; color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; padding: 16px; border-radius: 14px; cursor: pointer; }

/* Transitions */
.vid-fade-enter-active, .vid-fade-leave-active { transition: opacity 0.8s; }
.vid-fade-enter-from, .vid-fade-leave-to { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-left-enter-from  { opacity: 0; transform: translateX(60px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-60px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-60px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(60px); }
</style>