<template>
  <div class="auth-screen">
    <div class="auth-bg"></div>
    <div class="auth-inner">
      <div class="login-logo">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
          <rect x="48" y="22" width="4" height="56" rx="2" fill="#C9A84C"/>
          <rect x="20" y="28" width="60" height="4" rx="2" fill="#C9A84C"/>
          <rect x="32" y="74" width="36" height="4" rx="2" fill="#C9A84C"/>
          <line x1="26" y1="32" x2="20" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <line x1="26" y1="32" x2="32" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <path d="M18 50 Q26 58 34 50" stroke="#C9A84C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <line x1="74" y1="32" x2="68" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <line x1="74" y1="32" x2="80" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
          <path d="M66 50 Q74 58 82 50" stroke="#C9A84C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="50" cy="28" r="4" fill="#C9A84C"/>
        </svg>
        <span class="logo-word">Vakilr</span>
      </div>

      <div class="auth-header">
        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-sub">Log in to your Vakilr account</p>
      </div>

      <form class="auth-form" @submit.prevent="doLogin">
        <div class="field">
          <label>Email Address</label>
          <input v-model="form.email" type="email" placeholder="you@example.com" required />
        </div>
        <div class="field">
          <label>Password</label>
          <div class="input-with-suffix">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Your password" required />
            <button type="button" class="suffix-btn" @click="showPass = !showPass">{{ showPass ? '🙈' : '👁' }}</button>
          </div>
        </div>
        <div class="forgot-row">
          <router-link to="/forgot-password" class="forgot-link">Forgot password?</router-link>
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button class="submit-btn" type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log In →' }}
        </button>
      </form>

      <div class="divider"><span>or</span></div>

      <p class="signup-link">
        New to Vakilr? <router-link to="/role">Create account</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const showPass = ref(false)
const loading = ref(false)
const error = ref('')
const form = reactive({ email: '', password: '' })

async function doLogin() {
  loading.value = true
  error.value = ''
  const result = await auth.signIn({ email: form.email, password: form.password })
  loading.value = false
  if (result.success) {
    const role = auth.role
    if (role === 'client') router.push('/client')
    else if (role === 'lawyer') {
      if (auth.verificationStatus === 'approved') router.push('/lawyer')
      else router.push('/verification-pending')
    }
    else if (role === 'firm') {
      if (auth.verificationStatus === 'approved') router.push('/firm')
      else router.push('/verification-pending')
    }
  } else {
    error.value = 'Wrong email or password. Please try again.'
  }
}
</script>

<style scoped>
.auth-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0A0F2C;position:relative;padding:1.5rem}
.auth-bg{position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,168,76,0.08),transparent 60%);pointer-events:none}
.auth-inner{position:relative;z-index:1;width:100%;max-width:400px}
.login-logo{display:flex;align-items:center;gap:0.6rem;margin-bottom:2rem;justify-content:center}
.logo-word{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;font-style:italic;color:#C9A84C}
.auth-header{text-align:center;margin-bottom:2rem}
.auth-title{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#f0f4ff;margin-bottom:0.5rem}
.auth-sub{font-family:'DM Sans',sans-serif;font-size:0.9rem;color:#8892b0}
.auth-form{display:flex;flex-direction:column;gap:1.1rem}
.field{display:flex;flex-direction:column;gap:0.4rem}
label{font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em}
input{width:100%;height:48px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.95rem;padding:0 1rem;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,0.12)}
.input-with-suffix{display:flex;align-items:center;position:relative}
.input-with-suffix input{padding-right:3rem}
.suffix-btn{position:absolute;right:0.75rem;background:none;border:none;cursor:pointer;font-size:1rem;padding:0.25rem}
.forgot-row{text-align:right}
.forgot-link{font-family:'DM Sans',sans-serif;font-size:0.82rem;color:#C9A84C;text-decoration:none}
.error-msg{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;padding:0.75rem 1rem;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.85rem}
.submit-btn{width:100%;padding:1rem;border-radius:14px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 0 24px rgba(201,168,76,0.3);transition:all 0.2s}
.submit-btn:disabled{opacity:0.35;cursor:not-allowed;box-shadow:none}
.submit-btn:not(:disabled):hover{background:#e0b84a;transform:translateY(-1px)}
.divider{display:flex;align-items:center;gap:1rem;margin:1.5rem 0}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.07)}
.divider span{font-family:'DM Sans',sans-serif;font-size:0.8rem;color:#4a5578}
.signup-link{text-align:center;font-family:'DM Sans',sans-serif;font-size:0.85rem;color:#4a5578}
.signup-link a{color:#C9A84C;text-decoration:none;font-weight:600}
</style>