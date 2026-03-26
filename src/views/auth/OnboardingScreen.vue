<template>
  <div class="onboarding">
    <div class="ob-bg">
      <div class="ob-orb" :style="{ background: slides[current].orb }"></div>
    </div>

    <!-- Skip -->
    <button class="skip-btn" @click="finish">Skip</button>

    <!-- Slides -->
    <div class="slides-wrapper">
      <transition :name="transDir" mode="out-in">
        <div class="slide" :key="current">
          <div class="slide-illustration">
            <div class="illus-circle">
              <span class="illus-icon">{{ slides[current].icon }}</span>
            </div>
            <div class="illus-ring r1"></div>
            <div class="illus-ring r2"></div>
          </div>
          <div class="slide-text">
            <span class="slide-num">{{ String(current + 1).padStart(2,'0') }} / 03</span>
            <h2 class="slide-title">{{ slides[current].title }}</h2>
            <p class="slide-body">{{ slides[current].body }}</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Dots -->
    <div class="ob-dots">
      <button
        v-for="(_, i) in slides" :key="i"
        :class="['dot', { active: i === current }]"
        @click="goTo(i)"
      ></button>
    </div>

    <!-- Actions -->
    <div class="ob-actions">
      <button v-if="current > 0" class="ob-back" @click="prev">← Back</button>
      <div v-else></div>
      <button class="ob-next" @click="next">
        {{ current === slides.length - 1 ? 'Get Started' : 'Next' }}
        <span>→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const current = ref(0)
const transDir = ref('slide-left')

const slides = [
  {
    icon: '😟',
    title: 'Legal Help is Broken',
    body: 'Most people in India have no idea where to find a trusted lawyer. They either get cheated, overpay, or simply give up on their legal rights.',
    orb: 'radial-gradient(circle at 30% 40%, rgba(239,68,68,0.15), transparent 60%)',
  },
  {
    icon: '⚖️',
    title: 'Vakilr Changes Everything',
    body: 'Find verified lawyers in seconds. Chat, call, or video consult. Get documents drafted. All at transparent, upfront prices. No surprises ever.',
    orb: 'radial-gradient(circle at 70% 30%, rgba(201,168,76,0.15), transparent 60%)',
  },
  {
    icon: '🚀',
    title: 'Your Legal Team. Always Ready.',
    body: 'Whether you need a 10-minute consultation or full court representation — Vakilr connects you with the right lawyer, right now.',
    orb: 'radial-gradient(circle at 50% 60%, rgba(16,185,129,0.12), transparent 60%)',
  },
]

function next() {
  if (current.value < slides.length - 1) {
    transDir.value = 'slide-left'
    current.value++
  } else {
    finish()
  }
}

function prev() {
  if (current.value > 0) {
    transDir.value = 'slide-right'
    current.value--
  }
}

function goTo(i) {
  transDir.value = i > current.value ? 'slide-left' : 'slide-right'
  current.value = i
}

function finish() {
  localStorage.setItem('vakilr_onboarded', '1')
  router.push('/role')
}
</script>

<style scoped>
.onboarding {
  min-height: 100vh; display: flex; flex-direction: column;
  background: #0A0F2C; position: relative; overflow: hidden;
  padding: 1.5rem;
}
.ob-bg { position: absolute; inset: 0; }
.ob-orb {
  position: absolute; width: 100%; height: 100%;
  transition: background 0.8s ease; pointer-events: none;
}
.skip-btn {
  align-self: flex-end; background: none; border: none;
  color: #4a5578; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
  cursor: pointer; padding: 0.5rem; z-index: 1;
  transition: color 0.2s;
}
.skip-btn:hover { color: #8892b0; }
.slides-wrapper {
  flex: 1; display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
}
.slide {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 1rem; max-width: 380px; width: 100%;
}
.slide-illustration {
  position: relative; display: flex; align-items: center;
  justify-content: center; width: 180px; height: 180px; margin-bottom: 2.5rem;
}
.illus-circle {
  width: 110px; height: 110px; border-radius: 50%;
  background: rgba(201,168,76,0.1);
  border: 2px solid rgba(201,168,76,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; z-index: 1;
  animation: float-icon 3s ease-in-out infinite;
}
.illus-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(201,168,76,0.12); animation: ring-pulse 3s ease-in-out infinite;
}
.r1 { width: 140px; height: 140px; animation-delay: 0.3s; }
.r2 { width: 175px; height: 175px; animation-delay: 0.6s; }
.slide-num {
  font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 700;
  color: #C9A84C; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem;
  display: block;
}
.slide-title {
  font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 6vw, 2.4rem);
  font-weight: 900; color: #f0f4ff; line-height: 1.2; margin-bottom: 1rem;
}
.slide-body {
  font-family: 'DM Sans', sans-serif; font-size: 1rem; color: #8892b0;
  line-height: 1.7; max-width: 320px;
}
.ob-dots {
  display: flex; justify-content: center; gap: 0.5rem;
  margin-bottom: 1.5rem; z-index: 1;
}
.dot {
  height: 6px; border-radius: 3px; border: none; cursor: pointer;
  background: rgba(255,255,255,0.15); transition: all 0.3s ease;
  width: 6px;
}
.dot.active { background: #C9A84C; width: 24px; }
.ob-actions {
  display: flex; justify-content: space-between; align-items: center;
  z-index: 1; padding-bottom: 1rem;
}
.ob-back {
  background: none; border: none; color: #4a5578; font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; font-weight: 500; cursor: pointer; padding: 0.6rem 1rem;
  transition: color 0.2s;
}
.ob-back:hover { color: #8892b0; }
.ob-next {
  display: flex; align-items: center; gap: 0.5rem;
  background: #C9A84C; color: #0A0F2C;
  border: none; border-radius: 12px;
  padding: 0.8rem 1.8rem; font-family: 'DM Sans', sans-serif;
  font-size: 1rem; font-weight: 700; cursor: pointer;
  box-shadow: 0 0 24px rgba(201,168,76,0.35);
  transition: all 0.2s;
}
.ob-next:hover { background: #e0b84a; transform: translateY(-1px); }

/* Transitions */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to  { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to  { opacity: 0; transform: translateX(40px); }

@keyframes float-icon {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes ring-pulse {
  0%,100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.03); }
}
</style>