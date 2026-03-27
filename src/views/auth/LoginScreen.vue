<template>
  <div class="login-page">
    <div class="login-bg"><div class="orb o1"></div><div class="orb o2"></div></div>

    <div class="login-content">
      <div class="login-logo">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
          <rect x="48" y="20" width="4" height="60" rx="2" fill="#C9A84C"/>
          <rect x="20" y="26" width="60" height="4" rx="2" fill="#C9A84C"/>
          <rect x="34" y="74" width="32" height="4" rx="2" fill="#C9A84C"/>
          <line x1="26" y1="30" x2="20" y2="50" stroke="#C9A84C" stroke-width="3"/>
          <line x1="26" y1="30" x2="32" y2="50" stroke="#C9A84C" stroke-width="3"/>
          <path d="M17 50 Q26 60 35 50" stroke="#C9A84C" stroke-width="3" fill="none" stroke-linecap="round"/>
          <line x1="74" y1="30" x2="68" y2="50" stroke="#C9A84C" stroke-width="3"/>
          <line x1="74" y1="30" x2="80" y2="50" stroke="#C9A84C" stroke-width="3"/>
          <path d="M65 50 Q74 60 83 50" stroke="#C9A84C" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
        <span class="logo-text">Vakilr</span>
      </div>

      <h2 class="login-title">Welcome back</h2>
      <p class="login-sub">Sign in to continue</p>

      <!-- Form -->
      <div class="login-form" :class="{ shake: shaking }">
        <div class="float-field" :class="{ filled: email, focused: focusEmail, error: emailError }">
          <input v-model="email" type="email" id="email"
            @focus="focusEmail = true" @blur="focusEmail = false; validateEmail()"
            @input="emailError = ''" autocomplete="email" />
          <label for="email">Email address</label>
          <div class="field-border"></div>
        </div>
        <p v-if="emailError" class="field-error">{{ emailError }}</p>

        <div class="float-field" :class="{ filled: password, focused: focusPass, error: passwordError }" style="margin-top:1rem">
          <input v-model="password" :type="showPass ? 'text' : 'password'" id="password"
            @focus="focusPass = true" @blur="focusPass = false"
            @input="passwordError = ''" autocomplete="current-password"
            @keyup.enter="doLogin" />
          <label for="password">Password</label>
          <div class="field-border"></div>
          <button class="pass-toggle" @click="showPass = !showPass" type="button">
            {{ showPass ? '🙈' : '👁' }}
          </button>
        </div>
        <p v-if="passwordError" class="field-error">{{ passwordError }}</p>

        <div class="login-meta">
          <router-link to="/forgot-password" class="forgot-link">Forgot password?</router-link>
        </div>

        <p v-if="authError" class="auth-error">{{ authError }}</p>

        <button class="login-btn" :class="{ loading: loading }" :disabled="loading" @click="doLogin">
          <span v-if="!loading">Sign In</span>
          <div v-else class="btn-spinner"></div>
        </button>
      </div>

      <div class="divider"><span>or</span></div>

      <p class="signup-prompt">
        New to Vakilr?
        <router-link to="/role" class="signup-link">Create account →</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWalletStore } from '@/stores/wallet'

const router      = useRouter()
const authStore   = useAuthStore()
const walletStore = useWalletStore()

const email = ref(''), password = ref('')
const focusEmail = ref(false), focusPass = ref(false)
const showPass = ref(false)
const emailError = ref(''), passwordError = ref(''), authError = ref('')
const loading = ref(false), shaking = ref(false)

function validateEmail() {
  if (!email.value) emailError.value = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) emailError.value = 'Enter a valid email'
  else emailError.value = ''
}

function doShake() {
  shaking.value = true
  setTimeout(() => { shaking.value = false }, 600)
}

async function doLogin() {
  validateEmail()
  if (!password.value) passwordError.value = 'Password is required'
  if (emailError.value || passwordError.value) { doShake(); return }

  loading.value = true; authError.value = ''
  const result = await authStore.signIn({ email: email.value, password: password.value })
  loading.value = false

  if (!result.success) {
    authError.value = result.error || 'Invalid email or password'
    doShake()
    return
  }

  // Init wallet if needed
  await walletStore.initTestWallet(authStore.user.id)

  const destMap = { client: '/client', lawyer: '/lawyer', firm: '/firm' }
  router.push(destMap[authStore.role] || '/login')
}
</script>

<style scoped>
.login-page { position: fixed; inset: 0; background: #04071a; display: flex; align-items: center; justify-content: center; overflow-y: auto; }
.login-bg { position: fixed; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
.o1 { width: 300px; height: 300px; background: #C9A84C; top: -80px; right: -80px; }
.o2 { width: 200px; height: 200px; background: #1a3a8f; bottom: 100px; left: -60px; }
.login-content { position: relative; z-index: 1; width: 100%; max-width: 420px; padding: 3rem 2rem 2rem; }
.login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; }
.logo-text { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #C9A84C; }
.login-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #f0f4ff; margin: 0 0 6px; }
.login-sub { font-family: 'DM Sans', sans-serif; color: rgba(240,244,255,0.45); font-size: 0.9rem; margin: 0 0 2rem; }

/* Floating label fields */
.login-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 1.5rem; backdrop-filter: blur(10px); }
.login-form.shake { animation: shake 0.5s ease; }
@keyframes shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-8px); } 40%,80% { transform: translateX(8px); } }

.float-field { position: relative; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 20px 14px 8px; }
.float-field input { width: 100%; background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 1rem; color: #f0f4ff; box-sizing: border-box; }
.float-field input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #0d1233 inset; -webkit-text-fill-color: #f0f4ff; }
.float-field label {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: rgba(240,244,255,0.35);
  transition: all 0.2s cubic-bezier(0.4,0,0.2,1); pointer-events: none;
}
.float-field.focused label, .float-field.filled label {
  top: 8px; transform: none; font-size: 0.72rem; color: #C9A84C;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.float-field.error { background: rgba(239,68,68,0.06); }
.float-field.error label { color: #f87171; }
.field-border { position: absolute; bottom: 0; left: 14px; right: 14px; height: 1px; background: rgba(255,255,255,0.1); border-radius: 1px; }
.float-field.focused .field-border { background: #C9A84C; box-shadow: 0 0 8px rgba(201,168,76,0.4); }
.float-field.error .field-border { background: #f87171; }
.pass-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; padding: 4px; }
.field-error { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; color: #f87171; margin: 6px 0 0 4px; }
.login-meta { display: flex; justify-content: flex-end; margin: 1rem 0 0; }
.forgot-link { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: #C9A84C; text-decoration: none; }
.auth-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 10px 12px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: #f87171; margin: 1rem 0 0; }
.login-btn { width: 100%; margin-top: 1.5rem; padding: 15px; background: linear-gradient(135deg, #C9A84C, #a8893d); border: none; border-radius: 14px; color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; min-height: 52px; transition: opacity 0.2s; }
.login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.login-btn:not(:disabled):active { transform: scale(0.98); }
.btn-spinner { width: 22px; height: 22px; border: 3px solid rgba(4,7,26,0.3); border-top-color: #04071a; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.divider { display: flex; align-items: center; gap: 12px; margin: 1.5rem 0; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
.divider span { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: rgba(240,244,255,0.25); }
.signup-prompt { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: rgba(240,244,255,0.45); text-align: center; margin: 0; }
.signup-link { color: #C9A84C; text-decoration: none; font-weight: 700; }
</style>