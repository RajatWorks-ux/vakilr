<template>
  <div class="auth-screen">
    <div class="auth-bg"></div>
    <div class="auth-inner">

      <button class="back-btn" @click="router.back()">← Back</button>

      <div class="auth-header">
        <span class="auth-step">Step {{ step }} of 2</span>
        <div class="step-bar"><div class="step-fill" :style="{width: (step/2*100)+'%'}"></div></div>
        <h1 class="auth-title">{{ step === 1 ? 'Create Account' : 'Verify Phone' }}</h1>
        <p class="auth-sub">{{ step === 1 ? 'Free forever for clients' : 'Enter the OTP sent to +91 ' + form.phone }}</p>
      </div>

      <!-- Step 1 -->
      <form v-if="step === 1" class="auth-form" @submit.prevent="goStep2">
        <div class="field">
          <label>Full Name</label>
          <input v-model="form.name" placeholder="Your full name" required />
        </div>
        <div class="field">
          <label>Phone Number</label>
          <div class="input-with-prefix">
            <span class="prefix">+91</span>
            <input v-model="form.phone" placeholder="98765 43210" type="tel" required maxlength="10" />
          </div>
        </div>
        <div class="field">
          <label>Email Address</label>
          <input v-model="form.email" placeholder="you@example.com" type="email" required />
        </div>
        <div class="field">
          <label>Password</label>
          <div class="input-with-suffix">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Min. 8 characters" required minlength="8" />
            <button type="button" class="suffix-btn" @click="showPass = !showPass">{{ showPass ? '🙈' : '👁' }}</button>
          </div>
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button class="submit-btn" type="submit" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create Account →' }}
        </button>
        <p class="terms">By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
      </form>

      <!-- Step 2 — OTP (simulated) -->
      <div v-else class="otp-section">
        <div class="otp-icon">📱</div>
        <p class="otp-info">In production, OTP will be sent via SMS. For now, just continue.</p>
        <div class="otp-inputs">
          <input v-for="i in 6" :key="i" class="otp-box" maxlength="1" type="tel"
            v-model="otp[i-1]" @input="otpNext(i-1, $event)" @keydown.delete="otpPrev(i-1)" :ref="el => otpRefs[i-1] = el"
          />
        </div>
        <button class="submit-btn" @click="submitSignup" :disabled="loading">
          {{ loading ? 'Signing up...' : 'Verify & Continue →' }}
        </button>
        <button class="resend-btn" @click="step = 1">← Change details</button>
      </div>

      <p class="login-link">Already have an account? <router-link to="/login">Log in</router-link></p>
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
const showPass = ref(false)
const loading = ref(false)
const error = ref('')
const otp = ref(['','','','','',''])
const otpRefs = ref([])

const form = reactive({ name: '', phone: '', email: '', password: '' })

function goStep2() {
  if (form.password.length < 8) { error.value = 'Password must be at least 8 characters'; return }
  error.value = ''
  step.value = 2
}

function otpNext(i, e) {
  if (e.target.value && i < 5) otpRefs.value[i+1]?.focus()
}
function otpPrev(i) {
  if (!otp.value[i] && i > 0) otpRefs.value[i-1]?.focus()
}

async function submitSignup() {
  loading.value = true
  error.value = ''
  const result = await auth.signUp({
    email: form.email,
    password: form.password,
    full_name: form.name,
    phone: form.phone,
    role: 'client',
  })
  loading.value = false
  if (result.success) {
    router.push('/client')
  } else {
    error.value = result.error
    step.value = 1
  }
}
</script>

<style scoped>
.auth-screen {
  min-height: 100vh; display: flex; align-items: flex-start; justify-content: center;
  background: #0A0F2C; position: relative; overflow-y: auto; padding: 1.5rem;
}
.auth-bg {
  position: fixed; inset: 0;
  background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.08), transparent 60%);
  pointer-events: none;
}
.auth-inner {
  position: relative; z-index: 1; width: 100%; max-width: 420px;
  padding-top: 1rem; padding-bottom: 3rem;
}
.back-btn {
  background: none; border: none; color: #4a5578; font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; cursor: pointer; padding: 0.4rem 0; margin-bottom: 1.5rem;
  display: block; transition: color 0.2s;
}
.back-btn:hover { color: #8892b0; }
.auth-header { margin-bottom: 2rem; }
.auth-step {
  font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 700;
  color: #C9A84C; letter-spacing: 0.12em; text-transform: uppercase;
}
.step-bar {
  height: 2px; background: rgba(255,255,255,0.1); border-radius: 1px;
  margin: 0.75rem 0 1.25rem; overflow: hidden;
}
.step-fill {
  height: 100%; background: #C9A84C; border-radius: 1px; transition: width 0.4s ease;
}
.auth-title {
  font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900;
  color: #f0f4ff; margin-bottom: 0.5rem;
}
.auth-sub { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #8892b0; }
.auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
label {
  font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 700;
  color: #8892b0; text-transform: uppercase; letter-spacing: 0.08em;
}
input {
  width: 100%; height: 48px; background: rgba(10,15,44,0.8);
  border: 1.5px solid rgba(255,255,255,0.1); border-radius: 12px;
  color: #f0f4ff; font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
  padding: 0 1rem; outline: none; transition: border-color 0.2s;
}
input:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
.input-with-prefix, .input-with-suffix {
  display: flex; align-items: center; position: relative;
}
.prefix {
  position: absolute; left: 1rem; color: #8892b0;
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; pointer-events: none;
}
.input-with-prefix input { padding-left: 3.5rem; }
.suffix-btn {
  position: absolute; right: 0.75rem; background: none; border: none;
  cursor: pointer; font-size: 1rem; padding: 0.25rem;
}
.error-msg {
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  color: #ef4444; padding: 0.75rem 1rem; border-radius: 10px;
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
}
.submit-btn {
  width: 100%; padding: 1rem; border-radius: 14px; border: none;
  background: #C9A84C; color: #0A0F2C; font-family: 'DM Sans', sans-serif;
  font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 0.5rem;
  box-shadow: 0 0 24px rgba(201,168,76,0.3); transition: all 0.2s;
}
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.submit-btn:not(:disabled):hover { background: #e0b84a; transform: translateY(-1px); }
.terms {
  text-align: center; font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem; color: #4a5578;
}
.terms a { color: #C9A84C; text-decoration: none; }
.otp-section { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; text-align: center; }
.otp-icon { font-size: 3rem; margin-top: 1rem; }
.otp-info { font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: #8892b0; max-width: 280px; line-height: 1.6; }
.otp-inputs { display: flex; gap: 0.6rem; margin: 0.5rem 0; }
.otp-box {
  width: 46px !important; height: 56px !important; text-align: center; font-size: 1.3rem;
  font-weight: 700; padding: 0 !important; border-radius: 12px !important;
}
.resend-btn {
  background: none; border: none; color: #4a5578;
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer;
}
.login-link {
  text-align: center; font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem; color: #4a5578; margin-top: 2rem;
}
.login-link a { color: #C9A84C; text-decoration: none; font-weight: 600; }
</style>