<template>
  <div class="auth-screen">
    <div class="auth-bg"></div>
    <div class="auth-inner">
      <button class="back-btn" @click="router.push('/login')">← Back to Login</button>
      <div class="auth-header">
        <div class="fp-icon">🔐</div>
        <h1 class="auth-title">Reset Password</h1>
        <p class="auth-sub">Enter your email and we'll send you a reset link</p>
      </div>
      <div v-if="!sent" class="auth-form">
        <div class="field">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="you@example.com" required />
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button class="submit-btn" @click="send" :disabled="loading || !email">
          {{ loading ? 'Sending...' : 'Send Reset Link →' }}
        </button>
      </div>
      <div v-else class="success-card">
        <div class="success-icon">✉️</div>
        <h3>Check your email</h3>
        <p>We sent a password reset link to <strong>{{ email }}</strong>. Check your inbox and spam folder.</p>
        <button class="submit-btn" @click="router.push('/login')" style="margin-top:1.5rem">Back to Login</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)
async function send() {
  loading.value = true
  const result = await auth.forgotPassword(email.value)
  loading.value = false
  if (result.success) sent.value = true
  else error.value = result.error
}
</script>

<style scoped>
.auth-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0A0F2C;position:relative;padding:1.5rem}
.auth-bg{position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,168,76,0.08),transparent 60%);pointer-events:none}
.auth-inner{position:relative;z-index:1;width:100%;max-width:400px}
.back-btn{background:none;border:none;color:#4a5578;font-family:'DM Sans',sans-serif;font-size:0.9rem;cursor:pointer;padding:0.4rem 0;margin-bottom:1.5rem;display:block}
.auth-header{text-align:center;margin-bottom:2rem}
.fp-icon{font-size:3rem;margin-bottom:1rem}
.auth-title{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#f0f4ff;margin-bottom:0.5rem}
.auth-sub{font-family:'DM Sans',sans-serif;font-size:0.9rem;color:#8892b0}
.auth-form{display:flex;flex-direction:column;gap:1.1rem}
.field{display:flex;flex-direction:column;gap:0.4rem}
label{font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em}
input{width:100%;height:48px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.95rem;padding:0 1rem;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,0.12)}
.error-msg{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;padding:0.75rem 1rem;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.85rem}
.submit-btn{width:100%;padding:1rem;border-radius:14px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 0 24px rgba(201,168,76,0.3);transition:all 0.2s}
.submit-btn:disabled{opacity:0.35;cursor:not-allowed;box-shadow:none}
.success-card{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:16px;padding:2rem;text-align:center}
.success-icon{font-size:3rem;margin-bottom:1rem}
.success-card h3{font-family:'Playfair Display',serif;font-size:1.4rem;color:#f0f4ff;margin-bottom:0.75rem}
.success-card p{font-family:'DM Sans',sans-serif;font-size:0.9rem;color:#8892b0;line-height:1.6}
.success-card strong{color:#f0f4ff}
</style>