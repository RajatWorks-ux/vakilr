<template>
  <div class="role-screen">
    <div class="role-bg"></div>
    <div class="role-inner">
      <div class="role-header">
        <div class="logo-mark">⚖️</div>
        <h1 class="role-title">Who are you?</h1>
        <p class="role-sub">Choose how you'll use Vakilr. You can't change this later.</p>
      </div>

      <div class="role-cards">
        <button
          v-for="r in roles" :key="r.id"
          :class="['role-card', { selected: selected === r.id }]"
          @click="selected = r.id"
        >
          <div class="role-icon">{{ r.icon }}</div>
          <div class="role-info">
            <div class="role-name">{{ r.title }}</div>
            <div class="role-desc">{{ r.desc }}</div>
          </div>
          <div class="role-check" :class="{ active: selected === r.id }">
            <span>✓</span>
          </div>
        </button>
      </div>

      <button
        class="role-cta"
        :disabled="!selected"
        @click="proceed"
      >
        Continue as {{ roles.find(r => r.id === selected)?.short || '...' }} →
      </button>

      <p class="role-login">
        Already have an account?
        <router-link to="/login">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selected = ref(null)

const roles = [
  {
    id: 'client',
    icon: '👤',
    title: 'I Need Legal Help',
    desc: 'Find lawyers, book consultations, get documents drafted',
    short: 'Client',
  },
  {
    id: 'lawyer',
    icon: '⚖️',
    title: "I'm a Lawyer",
    desc: 'List your services, get consistent clients, earn more',
    short: 'Lawyer',
  },
  {
    id: 'firm',
    icon: '🏛️',
    title: "I'm a Law Firm",
    desc: 'Register your firm, manage your team, attract big clients',
    short: 'Firm',
  },
]

function proceed() {
  if (selected.value) router.push(`/signup/${selected.value}`)
}
</script>

<style scoped>
.role-screen {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #0A0F2C; position: relative; overflow: hidden; padding: 1.5rem;
}
.role-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.1), transparent 60%);
}
.role-inner {
  position: relative; z-index: 1; width: 100%; max-width: 440px;
  display: flex; flex-direction: column; gap: 0; align-items: stretch;
}
.role-header { text-align: center; margin-bottom: 2.5rem; }
.logo-mark { font-size: 2.5rem; margin-bottom: 1rem; }
.role-title {
  font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900;
  color: #f0f4ff; margin-bottom: 0.75rem;
}
.role-sub { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: #8892b0; line-height: 1.6; }
.role-cards { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
.role-card {
  display: flex; align-items: center; gap: 1rem;
  background: rgba(22,29,63,0.8);
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 1.1rem 1.2rem;
  cursor: pointer; text-align: left; transition: all 0.25s;
}
.role-card:hover { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.05); }
.role-card.selected {
  border-color: #C9A84C;
  background: rgba(201,168,76,0.08);
  box-shadow: 0 0 0 3px rgba(201,168,76,0.1), 0 4px 20px rgba(201,168,76,0.15);
}
.role-icon { font-size: 2rem; flex-shrink: 0; }
.role-info { flex: 1; }
.role-name { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1rem; color: #f0f4ff; margin-bottom: 0.25rem; }
.role-desc { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: #8892b0; line-height: 1.4; }
.role-check {
  width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s; flex-shrink: 0;
}
.role-check span { font-size: 0.7rem; color: #0A0F2C; opacity: 0; transition: opacity 0.2s; }
.role-check.active {
  background: #C9A84C; border-color: #C9A84C;
}
.role-check.active span { opacity: 1; }
.role-cta {
  width: 100%; padding: 1rem; border-radius: 14px; border: none;
  background: #C9A84C; color: #0A0F2C;
  font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 0 24px rgba(201,168,76,0.3);
}
.role-cta:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
.role-cta:not(:disabled):hover { background: #e0b84a; transform: translateY(-1px); }
.role-login {
  text-align: center; font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem; color: #4a5578; margin-top: 1.5rem;
}
.role-login a { color: #C9A84C; text-decoration: none; font-weight: 600; }
</style>