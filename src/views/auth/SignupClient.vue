<template>
  <div class="auth-screen">
    <div class="auth-bg"></div>
    <div class="auth-inner">
      <button class="back-btn" @click="router.back()">← Back</button>

      <div class="auth-header">
        <span class="auth-badge">FREE FOR CLIENTS</span>
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-sub">Join 50,000+ clients already on Vakilr</p>
      </div>

      <form class="auth-form" @submit.prevent="handleSignup">
        <div class="field">
          <label>Full Name</label>
          <input v-model="form.name" placeholder="Your full name" required
            :class="{ 'field-error': touched.name && !form.name }" />
        </div>

        <div class="field">
          <label>Phone Number <span class="opt">(optional)</span></label>
          <div class="input-with-prefix">
            <span class="prefix">+91</span>
            <input v-model="form.phone" placeholder="98765 43210" type="tel" maxlength="10"
              :class="{ 'field-error': touched.phone && form.phone && !validPhone }"
              @blur="touched.phone = true" />
          </div>
          <span v-if="touched.phone && form.phone && !validPhone" class="field-hint-err">
            Enter valid 10-digit mobile number
          </span>
        </div>

        <div class="field">
          <label>Email Address</label>
          <input v-model="form.email" placeholder="you@example.com" type="email" required
            :class="{ 'field-error': touched.email && !validEmail }"
            @blur="touched.email = true" />
          <span v-if="touched.email && !validEmail" class="field-hint-err">
            Enter a valid email address
          </span>
        </div>

        <div class="field">
          <label>Password</label>
          <div class="input-with-suffix">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'"
              placeholder="Min. 8 characters" required
              :class="{ 'field-error': touched.password && passwordStrength.score < 2 }"
              @blur="touched.password = true" @input="touched.password = true" />
            <button type="button" class="suffix-btn" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁' }}
            </button>
          </div>
          <!-- Password strength bar -->
          <div v-if="form.password" class="strength-wrap">
            <div class="strength-bar">
              <div class="strength-fill" :style="{ width: (passwordStrength.score / 4 * 100) + '%', background: strengthColor }"></div>
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{ passwordStrength.label }}</span>
          </div>
          <div class="password-rules" v-if="touched.password && form.password">
            <span :class="['rule', { ok: form.password.length >= 8 }]">✓ 8+ characters</span>
            <span :class="['rule', { ok: /[A-Z]/.test(form.password) }]">✓ Uppercase</span>
            <span :class="['rule', { ok: /[0-9]/.test(form.password) }]">✓ Number</span>
            <span :class="['rule', { ok: /[^A-Za-z0-9]/.test(form.password) }]">✓ Symbol</span>
          </div>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="submit-btn" type="submit" :disabled="loading || !canSubmit">
          {{ loading ? 'Creating account...' : 'Create Account →' }}
        </button>

        <p class="terms">
          By signing up you agree to our
          <router-link to="/terms">Terms of Service</router-link> and
          <router-link to="/privacy">Privacy Policy</router-link>
        </p>
      </form>

      <p class="login-link">Already have an account? <router-link to="/login">Log in</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router   = useRouter()
const auth     = useAuthStore()
const showPass = ref(false)
const loading  = ref(false)
const error    = ref('')
const touched  = reactive({ name: false, email: false, phone: false, password: false })
const form     = reactive({ name: '', phone: '', email: '', password: '' })

const validEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
const validPhone = computed(() => !form.phone || /^[6-9]\d{9}$/.test(form.phone))

const passwordStrength = computed(() => {
  const p = form.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score] || '' }
})

const strengthColor = computed(() => {
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  return colors[passwordStrength.value.score] || '#4a5578'
})

const canSubmit = computed(() =>
  form.name && validEmail.value && validPhone.value && passwordStrength.value.score >= 2
)

async function handleSignup() {
  touched.name = touched.email = touched.phone = touched.password = true
  if (!canSubmit.value) return
  loading.value = true
  error.value   = ''

  const result = await auth.signUp({
    email: form.email, password: form.password,
    full_name: form.name, phone: form.phone, role: 'client',
  })

  loading.value = false
  if (result.success) {
    router.push('/client') // email confirm is off for now; turn on before launch
  } else {
    error.value = result.error
  }
}
</script>

<style scoped>
.auth-screen { min-height:100vh; display:flex; align-items:flex-start; justify-content:center; background:#0A0F2C; position:relative; overflow-y:auto; padding:1.5rem; }
.auth-bg { position:fixed; inset:0; background:radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.08), transparent 60%); pointer-events:none; }
.auth-inner { position:relative; z-index:1; width:100%; max-width:420px; padding-top:1rem; padding-bottom:3rem; }
.back-btn { background:none; border:none; color:#4a5578; font-family:'DM Sans',sans-serif; font-size:0.9rem; cursor:pointer; padding:0.4rem 0; margin-bottom:1.5rem; display:block; }
.auth-badge { display:inline-block; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.25); color:#10b981; font-family:'DM Sans',sans-serif; font-size:0.68rem; font-weight:800; letter-spacing:0.1em; padding:0.25rem 0.75rem; border-radius:100px; margin-bottom:1rem; }
.auth-title { font-family:'Playfair Display',serif; font-size:2.1rem; font-weight:900; color:#f0f4ff; margin-bottom:0.4rem; }
.auth-sub { font-family:'DM Sans',sans-serif; font-size:0.88rem; color:#8892b0; }
.auth-header { margin-bottom:2rem; }
.auth-form { display:flex; flex-direction:column; gap:1.1rem; }
.field { display:flex; flex-direction:column; gap:0.4rem; }
label { font-family:'DM Sans',sans-serif; font-size:0.73rem; font-weight:700; color:#8892b0; text-transform:uppercase; letter-spacing:0.08em; }
.opt { font-size:0.68rem; text-transform:none; color:#4a5578; font-weight:400; }
input { width:100%; height:48px; background:rgba(10,15,44,0.8); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; color:#f0f4ff; font-family:'DM Sans',sans-serif; font-size:0.95rem; padding:0 1rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
input:focus { border-color:#C9A84C; box-shadow:0 0 0 3px rgba(201,168,76,0.12); }
input.field-error { border-color:#ef4444; }
.field-hint-err { font-family:'DM Sans',sans-serif; font-size:0.72rem; color:#ef4444; }
.input-with-prefix,.input-with-suffix { display:flex; align-items:center; position:relative; }
.prefix { position:absolute; left:1rem; color:#8892b0; font-family:'DM Sans',sans-serif; font-size:0.95rem; pointer-events:none; }
.input-with-prefix input { padding-left:3.5rem; }
.suffix-btn { position:absolute; right:0.75rem; background:none; border:none; cursor:pointer; font-size:1rem; }
/* Strength bar */
.strength-wrap { display:flex; align-items:center; gap:0.75rem; margin-top:0.3rem; }
.strength-bar { flex:1; height:4px; background:rgba(255,255,255,0.08); border-radius:4px; overflow:hidden; }
.strength-fill { height:100%; border-radius:4px; transition:width 0.3s, background 0.3s; }
.strength-label { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; min-width:45px; }
.password-rules { display:flex; gap:0.5rem; flex-wrap:wrap; }
.rule { font-family:'DM Sans',sans-serif; font-size:0.68rem; color:#4a5578; transition:color 0.2s; }
.rule.ok { color:#10b981; }
.error-msg { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#ef4444; padding:0.75rem 1rem; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:0.85rem; }
.submit-btn { width:100%; padding:1rem; border-radius:14px; border:none; background:#C9A84C; color:#0A0F2C; font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:700; cursor:pointer; margin-top:0.5rem; box-shadow:0 0 24px rgba(201,168,76,0.3); transition:all 0.2s; }
.submit-btn:disabled { opacity:0.4; cursor:not-allowed; box-shadow:none; }
.submit-btn:not(:disabled):hover { background:#e0b84a; transform:translateY(-1px); }
.terms { text-align:center; font-family:'DM Sans',sans-serif; font-size:0.75rem; color:#4a5578; }
.terms a { color:#C9A84C; text-decoration:none; }
.login-link { text-align:center; font-family:'DM Sans',sans-serif; font-size:0.85rem; color:#4a5578; margin-top:2rem; }
.login-link a { color:#C9A84C; text-decoration:none; font-weight:600; }
</style>