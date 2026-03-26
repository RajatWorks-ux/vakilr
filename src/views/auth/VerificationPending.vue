<template>
  <div class="vp-screen">
    <div class="vp-bg"></div>
    <div class="vp-inner">
      <div class="vp-animation">
        <div class="vp-ring r1"></div>
        <div class="vp-ring r2"></div>
        <div class="vp-ring r3"></div>
        <div class="vp-icon-wrap">
          <span class="vp-icon">⚖️</span>
        </div>
      </div>
      <h1 class="vp-title">Verification<br/>In Progress</h1>
      <p class="vp-sub">Our team is reviewing your documents. This usually takes <strong>24–48 hours</strong>.</p>
      <div class="vp-steps">
        <div class="vp-step done"><span class="vs-dot">✓</span><span>Account created</span></div>
        <div class="vp-step done"><span class="vs-dot">✓</span><span>Documents submitted</span></div>
        <div class="vp-step active"><span class="vs-dot pulse">●</span><span>Manual review in progress</span></div>
        <div class="vp-step"><span class="vs-dot empty">○</span><span>Profile approved &amp; live</span></div>
      </div>
      <div class="vp-note">
        <p>You'll receive an email at <strong>{{ email }}</strong> once approved. Check your spam folder too.</p>
      </div>
      <button class="vp-logout" @click="logout">Log out</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const auth = useAuthStore()
const email = computed(() => auth.profile?.email || 'your email')
async function logout() {
  await auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.vp-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0A0F2C;position:relative;padding:2rem}
.vp-bg{position:fixed;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 20%,rgba(201,168,76,0.1),transparent 60%);pointer-events:none}
.vp-inner{position:relative;z-index:1;width:100%;max-width:400px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.5rem}
.vp-animation{position:relative;width:140px;height:140px;display:flex;align-items:center;justify-content:center}
.vp-ring{position:absolute;border-radius:50%;border:1px solid rgba(201,168,76,0.2);animation:vp-pulse 2.5s ease-in-out infinite}
.r1{width:100px;height:100px;animation-delay:0s}
.r2{width:125px;height:125px;animation-delay:0.4s}
.r3{width:140px;height:140px;animation-delay:0.8s}
.vp-icon-wrap{width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,0.12);border:2px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;z-index:1}
.vp-icon{font-size:2.2rem}
.vp-title{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;color:#f0f4ff;line-height:1.2}
.vp-sub{font-family:'DM Sans',sans-serif;font-size:0.95rem;color:#8892b0;line-height:1.7;max-width:320px}
.vp-sub strong{color:#f0f4ff}
.vp-steps{display:flex;flex-direction:column;gap:0.75rem;width:100%;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.25rem 1.5rem;text-align:left}
.vp-step{display:flex;align-items:center;gap:0.75rem;font-family:'DM Sans',sans-serif;font-size:0.88rem;color:#4a5578}
.vp-step.done{color:#8892b0}
.vp-step.active{color:#f0f4ff;font-weight:600}
.vs-dot{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;flex-shrink:0;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1)}
.vp-step.done .vs-dot{background:rgba(16,185,129,0.2);border-color:rgba(16,185,129,0.4);color:#10b981}
.vs-dot.pulse{background:rgba(201,168,76,0.15);border-color:#C9A84C;color:#C9A84C;animation:dot-pulse 1.5s ease-in-out infinite}
.vs-dot.empty{background:transparent;color:#4a5578}
.vp-note{background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:1rem 1.25rem}
.vp-note p{font-family:'DM Sans',sans-serif;font-size:0.83rem;color:#8892b0;line-height:1.6}
.vp-note strong{color:#f0f4ff}
.vp-logout{background:none;border:1px solid rgba(255,255,255,0.1);color:#4a5578;padding:0.6rem 1.5rem;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.vp-logout:hover{border-color:rgba(255,255,255,0.2);color:#8892b0}
@keyframes vp-pulse{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.04)}}
@keyframes dot-pulse{0%,100%{opacity:0.6}50%{opacity:1}}
</style>