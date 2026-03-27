<template>
  <div class="role-page">
    <div class="role-bg"><div class="orb o1"></div><div class="orb o2"></div></div>
    <div class="role-content">
      <div class="role-header">
        <h1 class="role-title">I am a...</h1>
        <p class="role-sub">Choose your role to get started</p>
      </div>
      <div class="role-cards">
        <div v-for="role in roles" :key="role.id"
          class="role-card"
          :class="{ selected: selected === role.id }"
          @click="select(role.id)"
          @mousemove="tilt($event, role.id)"
          @mouseleave="resetTilt(role.id)"
          :ref="el => cardRefs[role.id] = el"
          :style="cardStyles[role.id]">
          <div class="card-glow"></div>
          <div class="card-icon">{{ role.icon }}</div>
          <h3 class="card-title">{{ role.label }}</h3>
          <p class="card-desc">{{ role.desc }}</p>
          <div class="card-check" :class="{ visible: selected === role.id }">✓</div>
          <div v-if="selected === role.id" class="card-ripple"></div>
        </div>
      </div>
      <button class="continue-btn" :class="{ active: !!selected }" :disabled="!selected" @click="goNext">
        Continue as {{ selectedLabel }} →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selected = ref(null)
const cardRefs = {}
const cardStyles = reactive({ client: {}, lawyer: {}, firm: {} })

const roles = [
  { id: 'client', icon: '🧑‍💼', label: 'Client', desc: 'I need legal help, advice, or documents' },
  { id: 'lawyer', icon: '⚖️', label: 'Lawyer', desc: 'I want to offer legal services and earn' },
  { id: 'firm', icon: '🏛️', label: 'Law Firm', desc: 'I represent a firm with multiple lawyers' },
]

const selectedLabel = computed(() => roles.find(r => r.id === selected.value)?.label || '')

function select(id) {
  selected.value = id
  if (navigator.vibrate) navigator.vibrate(30)
}

function tilt(e, id) {
  const el = cardRefs[id]
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  cardStyles[id] = { transform: `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.02)` }
}

function resetTilt(id) {
  cardStyles[id] = { transform: 'perspective(600px) rotateX(0) rotateY(0) scale(1)', transition: 'transform 0.4s ease' }
}

function goNext() {
  if (!selected.value) return
  router.push(`/signup/${selected.value}`)
}
</script>

<style scoped>
.role-page { position: fixed; inset: 0; background: #04071a; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.role-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
.o1 { width: 350px; height: 350px; background: #C9A84C; top: -100px; right: -80px; animation: orbFloat 6s ease-in-out infinite; }
.o2 { width: 250px; height: 250px; background: #1a3a8f; bottom: -80px; left: -60px; animation: orbFloat 8s ease-in-out infinite reverse; }
@keyframes orbFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
.role-content { position: relative; z-index: 1; width: 100%; padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
.role-header { text-align: center; }
.role-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0f4ff; margin: 0 0 8px; }
.role-sub { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: rgba(240,244,255,0.45); margin: 0; }
.role-cards { display: flex; flex-direction: column; gap: 12px; }
.role-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 1.4rem; cursor: pointer; position: relative;
  overflow: hidden; transition: border-color 0.2s, background 0.2s;
  will-change: transform;
}
.role-card.selected { border-color: rgba(201,168,76,0.6); background: rgba(201,168,76,0.08); }
.card-glow { position: absolute; top: -50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%); pointer-events: none; }
.card-icon { font-size: 2rem; margin-bottom: 8px; filter: drop-shadow(0 0 10px rgba(201,168,76,0.4)); }
.card-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #f0f4ff; margin: 0 0 4px; }
.card-desc { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(240,244,255,0.5); margin: 0; line-height: 1.5; }
.card-check { position: absolute; top: 1rem; right: 1rem; width: 28px; height: 28px; border-radius: 50%; background: #C9A84C; color: #04071a; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0); transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.card-check.visible { opacity: 1; transform: scale(1); }
.card-ripple { position: absolute; inset: 0; border: 2px solid rgba(201,168,76,0.4); border-radius: 20px; animation: rippleOut 0.5s ease forwards; pointer-events: none; }
@keyframes rippleOut { from { transform: scale(0.95); opacity: 1; } to { transform: scale(1.02); opacity: 0; } }

.continue-btn {
  width: 100%; padding: 16px; border-radius: 16px; border: none;
  background: rgba(201,168,76,0.2); color: rgba(201,168,76,0.5);
  font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700;
  cursor: not-allowed; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.continue-btn.active {
  background: linear-gradient(135deg, #C9A84C, #a8893d);
  color: #04071a; cursor: pointer; box-shadow: 0 8px 24px rgba(201,168,76,0.3);
}
.continue-btn.active:active { transform: scale(0.98); }
</style>