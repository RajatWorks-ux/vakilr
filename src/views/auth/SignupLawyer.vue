<template>
  <div class="auth-screen">
    <div class="auth-bg"></div>
    <div class="auth-inner">
      <button class="back-btn" @click="step > 1 ? step-- : router.back()">← Back</button>

      <div class="auth-header">
        <span class="auth-step">Step {{ step }} of 3</span>
        <div class="step-bar"><div class="step-fill" :style="{width: (step/3*100)+'%'}"></div></div>
        <h1 class="auth-title">{{ stepTitles[step-1] }}</h1>
      </div>

      <!-- Step 1: Basic Info -->
      <form v-if="step === 1" class="auth-form" @submit.prevent="step = 2">
        <div class="field">
          <label>Full Name</label>
          <input v-model="form.name" placeholder="Adv. Priya Sharma" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="priya@example.com" required />
        </div>
        <div class="field">
          <label>Phone</label>
          <div class="input-with-prefix">
            <span class="prefix">+91</span>
            <input v-model="form.phone" type="tel" placeholder="98765 43210" required maxlength="10" />
          </div>
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="Min. 8 characters" required minlength="8" />
        </div>
        <button class="submit-btn" type="submit">Next →</button>
      </form>

      <!-- Step 2: Professional Info -->
      <form v-else-if="step === 2" class="auth-form" @submit.prevent="step = 3">
        <div class="field">
          <label>Bar Council Number</label>
          <input v-model="form.barCouncil" placeholder="e.g. MH/1234/2015" required />
          <span class="field-hint">As shown on your Bar Council certificate</span>
        </div>
        <div class="field">
          <label>Years of Experience</label>
          <input v-model.number="form.experience" type="number" min="0" max="60" placeholder="e.g. 8" required />
        </div>
        <div class="field">
          <label>City</label>
          <input v-model="form.city" placeholder="Mumbai" required />
        </div>
        <div class="field">
          <label>Specializations (select all that apply)</label>
          <div class="spec-grid">
            <button
              v-for="s in specializations" :key="s" type="button"
              :class="['spec-btn', { selected: form.specs.includes(s) }]"
              @click="toggleSpec(s)"
            >{{ s }}</button>
          </div>
        </div>
        <button class="submit-btn" type="submit" :disabled="form.specs.length === 0">Next →</button>
      </form>

      <!-- Step 3: Upload Certificate -->
      <div v-else class="auth-form">
        <div class="upload-area" @click="triggerUpload" :class="{ uploaded: certFile }">
          <input ref="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" @change="handleFile" style="display:none" />
          <div class="upload-icon">{{ certFile ? '✅' : '📄' }}</div>
          <div class="upload-title">{{ certFile ? certFile.name : 'Upload Bar Council Certificate' }}</div>
          <div class="upload-sub">{{ certFile ? 'Tap to change' : 'PDF, JPG or PNG · Max 5MB' }}</div>
        </div>
        <div class="cert-note">
          <span class="note-icon">ℹ️</span>
          <p>Our team manually verifies all lawyer certificates within 24–48 hours. You'll receive an email once approved.</p>
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button class="submit-btn" @click="submitLawyer" :disabled="loading || !certFile">
          {{ loading ? 'Submitting...' : 'Submit for Verification →' }}
        </button>
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
const loading = ref(false)
const error = ref('')
const certFile = ref(null)
const fileInput = ref(null)

const stepTitles = ['Basic Details', 'Professional Info', 'Upload Certificate']

const specializations = [
  'Family Law', 'Criminal Defense', 'Property Law', 'Corporate Law',
  'Labour Law', 'Cyber Law', 'Tax Law', 'Immigration', 'Consumer Law',
  'Banking Law', 'Intellectual Property', 'Constitutional Law',
]

const form = reactive({
  name: '', email: '', phone: '', password: '',
  barCouncil: '', experience: '', city: '', specs: [],
})

function toggleSpec(s) {
  const i = form.specs.indexOf(s)
  if (i === -1) form.specs.push(s)
  else form.specs.splice(i, 1)
}

function triggerUpload() { fileInput.value?.click() }
function handleFile(e) {
  const f = e.target.files[0]
  if (f && f.size <= 5 * 1024 * 1024) certFile.value = f
  else error.value = 'File too large. Max 5MB.'
}

async function submitLawyer() {
  loading.value = true
  error.value = ''
  const result = await auth.signUp({
    email: form.email, password: form.password,
    full_name: form.name, phone: form.phone, role: 'lawyer',
  })
  if (!result.success) { error.value = result.error; loading.value = false; return }

  await auth.createLawyerProfile({
    bar_council_number: form.barCouncil,
    specializations: form.specs,
    experience_years: form.experience,
    city: form.city,
    languages: ['Hindi', 'English'],
  })
  loading.value = false
  router.push('/verification-pending')
}
</script>

<style scoped>
/* Reuse same base styles as SignupClient */
.auth-screen { min-height:100vh; display:flex; align-items:flex-start; justify-content:center; background:#0A0F2C; position:relative; overflow-y:auto; padding:1.5rem; }
.auth-bg { position:fixed; inset:0; background:radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.08), transparent 60%); pointer-events:none; }
.auth-inner { position:relative; z-index:1; width:100%; max-width:440px; padding-top:1rem; padding-bottom:3rem; }
.back-btn { background:none; border:none; color:#4a5578; font-family:'DM Sans',sans-serif; font-size:0.9rem; cursor:pointer; padding:0.4rem 0; margin-bottom:1.5rem; display:block; }
.auth-header { margin-bottom:2rem; }
.auth-step { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; color:#C9A84C; letter-spacing:0.12em; text-transform:uppercase; }
.step-bar { height:2px; background:rgba(255,255,255,0.1); border-radius:1px; margin:0.75rem 0 1.25rem; overflow:hidden; }
.step-fill { height:100%; background:#C9A84C; transition:width 0.4s ease; }
.auth-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:#f0f4ff; margin-bottom:0.5rem; }
.auth-form { display:flex; flex-direction:column; gap:1.1rem; }
.field { display:flex; flex-direction:column; gap:0.4rem; }
label { font-family:'DM Sans',sans-serif; font-size:0.75rem; font-weight:700; color:#8892b0; text-transform:uppercase; letter-spacing:0.08em; }
input { width:100%; height:48px; background:rgba(10,15,44,0.8); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; color:#f0f4ff; font-family:'DM Sans',sans-serif; font-size:0.95rem; padding:0 1rem; outline:none; transition:border-color 0.2s; }
input:focus { border-color:#C9A84C; box-shadow:0 0 0 3px rgba(201,168,76,0.12); }
.input-with-prefix { display:flex; align-items:center; position:relative; }
.prefix { position:absolute; left:1rem; color:#8892b0; font-family:'DM Sans',sans-serif; font-size:0.95rem; pointer-events:none; }
.input-with-prefix input { padding-left:3.5rem; }
.field-hint { font-size:0.73rem; color:#4a5578; font-family:'DM Sans',sans-serif; }
.spec-grid { display:flex; flex-wrap:wrap; gap:0.5rem; }
.spec-btn { padding:0.4rem 0.9rem; border-radius:100px; border:1.5px solid rgba(255,255,255,0.1); background:transparent; color:#8892b0; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:500; cursor:pointer; transition:all 0.2s; }
.spec-btn.selected { background:rgba(201,168,76,0.12); border-color:#C9A84C; color:#C9A84C; }
.upload-area { border:2px dashed rgba(201,168,76,0.25); border-radius:16px; padding:2.5rem 1.5rem; text-align:center; cursor:pointer; transition:all 0.2s; background:rgba(201,168,76,0.03); }
.upload-area:hover, .upload-area.uploaded { border-color:#C9A84C; background:rgba(201,168,76,0.07); }
.upload-icon { font-size:2.5rem; margin-bottom:0.75rem; }
.upload-title { font-family:'DM Sans',sans-serif; font-weight:600; color:#f0f4ff; margin-bottom:0.25rem; }
.upload-sub { font-size:0.8rem; color:#4a5578; font-family:'DM Sans',sans-serif; }
.cert-note { display:flex; gap:0.6rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:12px; padding:0.9rem 1rem; }
.note-icon { font-size:1rem; flex-shrink:0; margin-top:1px; }
.cert-note p { font-family:'DM Sans',sans-serif; font-size:0.82rem; color:#8892b0; line-height:1.6; }
.error-msg { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#ef4444; padding:0.75rem 1rem; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:0.85rem; }
.submit-btn { width:100%; padding:1rem; border-radius:14px; border:none; background:#C9A84C; color:#0A0F2C; font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:700; cursor:pointer; box-shadow:0 0 24px rgba(201,168,76,0.3); transition:all 0.2s; }
.submit-btn:disabled { opacity:0.35; cursor:not-allowed; box-shadow:none; }
.submit-btn:not(:disabled):hover { background:#e0b84a; transform:translateY(-1px); }
.login-link { text-align:center; font-family:'DM Sans',sans-serif; font-size:0.85rem; color:#4a5578; margin-top:2rem; }
.login-link a { color:#C9A84C; text-decoration:none; font-weight:600; }
</style>