<template>
  <div class="auth-screen">
    <div class="auth-bg"></div>
    <div class="auth-inner">
      <button class="back-btn" @click="step > 1 ? step-- : router.back()">← Back</button>
      <div class="auth-header">
        <span class="auth-step">Step {{ step }} of 2</span>
        <div class="step-bar"><div class="step-fill" :style="{width:(step/2*100)+'%'}"></div></div>
        <h1 class="auth-title">{{ step === 1 ? 'Firm Account' : 'Firm Details' }}</h1>
      </div>

      <form v-if="step === 1" class="auth-form" @submit.prevent="step = 2">
        <div class="field"><label>Admin Name</label><input v-model="form.name" placeholder="Managing Partner Name" required /></div>
        <div class="field"><label>Email</label><input v-model="form.email" type="email" placeholder="admin@firmname.com" required /></div>
        <div class="field"><label>Phone</label><input v-model="form.phone" type="tel" placeholder="98765 43210" required /></div>
        <div class="field"><label>Password</label><input v-model="form.password" type="password" placeholder="Min. 8 characters" required minlength="8" /></div>
        <button class="submit-btn" type="submit">Next →</button>
      </form>

      <form v-else class="auth-form" @submit.prevent="submitFirm">
        <div class="field"><label>Firm Name</label><input v-model="form.firmName" placeholder="e.g. Mehta & Associates" required /></div>
        <div class="field"><label>Registration Number</label><input v-model="form.regNumber" placeholder="e.g. MAH/FIRM/2008/001" required /></div>
        <div class="field"><label>Number of Lawyers in Team</label><input v-model.number="form.teamSize" type="number" min="1" max="500" placeholder="e.g. 12" required /></div>
        <div class="field"><label>Office Address</label><input v-model="form.address" placeholder="Full office address" required /></div>
        <div class="field"><label>City</label><input v-model="form.city" placeholder="Delhi" required /></div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button class="submit-btn" type="submit" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register Firm →' }}
        </button>
      </form>

      <p class="login-link">Already registered? <router-link to="/login">Log in</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const step = ref(1)
const loading = ref(false)
const error = ref('')
const form = reactive({ name:'', email:'', phone:'', password:'', firmName:'', regNumber:'', teamSize:'', address:'', city:'' })

async function submitFirm() {
  loading.value = true
  error.value = ''
  const result = await auth.signUp({ email:form.email, password:form.password, full_name:form.name, phone:form.phone, role:'firm' })
  if (!result.success) { error.value = result.error; loading.value = false; return }
  await auth.createFirmProfile({ firm_name:form.firmName, registration_number:form.regNumber, team_size:form.teamSize, address:form.address, city:form.city })
  loading.value = false
  router.push('/verification-pending')
}
</script>

<style scoped>
.auth-screen{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;background:#0A0F2C;position:relative;overflow-y:auto;padding:1.5rem}
.auth-bg{position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,168,76,0.08),transparent 60%);pointer-events:none}
.auth-inner{position:relative;z-index:1;width:100%;max-width:420px;padding-top:1rem;padding-bottom:3rem}
.back-btn{background:none;border:none;color:#4a5578;font-family:'DM Sans',sans-serif;font-size:0.9rem;cursor:pointer;padding:0.4rem 0;margin-bottom:1.5rem;display:block}
.auth-header{margin-bottom:2rem}
.auth-step{font-family:'DM Sans',sans-serif;font-size:0.72rem;font-weight:700;color:#C9A84C;letter-spacing:0.12em;text-transform:uppercase}
.step-bar{height:2px;background:rgba(255,255,255,0.1);border-radius:1px;margin:0.75rem 0 1.25rem;overflow:hidden}
.step-fill{height:100%;background:#C9A84C;transition:width 0.4s ease}
.auth-title{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#f0f4ff;margin-bottom:0.5rem}
.auth-form{display:flex;flex-direction:column;gap:1.1rem}
.field{display:flex;flex-direction:column;gap:0.4rem}
label{font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em}
input{width:100%;height:48px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.95rem;padding:0 1rem;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,0.12)}
.error-msg{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;padding:0.75rem 1rem;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.85rem}
.submit-btn{width:100%;padding:1rem;border-radius:14px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 0 24px rgba(201,168,76,0.3);transition:all 0.2s}
.submit-btn:disabled{opacity:0.35;cursor:not-allowed;box-shadow:none}
.submit-btn:not(:disabled):hover{background:#e0b84a;transform:translateY(-1px)}
.login-link{text-align:center;font-family:'DM Sans',sans-serif;font-size:0.85rem;color:#4a5578;margin-top:2rem}
.login-link a{color:#C9A84C;text-decoration:none;font-weight:600}
</style>