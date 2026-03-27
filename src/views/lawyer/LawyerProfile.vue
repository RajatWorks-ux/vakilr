<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/lawyer" class="back-btn">←</router-link>
      <h1 class="page-title">Edit Profile</h1>
      <button class="save-btn" @click="saveProfile" :disabled="saving">
        {{ saving ? '...' : 'Save' }}
      </button>
    </div>

    <div class="profile-content">
      <div class="photo-section">
        <div class="photo-wrap" @click="triggerPhotoUpload">
          <img v-if="avatarUrl" :src="avatarUrl" class="photo-img" alt="avatar" />
          <div v-else class="photo-placeholder">
            <span>{{ initials }}</span>
          </div>
          <div class="photo-overlay">📷</div>
        </div>
        <input ref="photoInput" type="file" accept="image/*" @change="handlePhotoUpload" style="display:none" />
        <p class="photo-hint">Tap to upload photo</p>
      </div>

      <div class="form-section">
        <h3 class="form-section-title">Basic Information</h3>
        <div class="field">
          <label>Full Name</label>
          <input v-model="form.full_name" placeholder="Adv. Your Name" />
        </div>
        <div class="field">
          <label>Phone</label>
          <input v-model="form.phone" placeholder="+91 98765 43210" type="tel" />
        </div>
        <div class="field">
          <label>City</label>
          <input v-model="form.city" placeholder="Mumbai" />
        </div>
        <div class="field">
          <label>Years of Experience</label>
          <input v-model.number="form.experience_years" type="number" min="0" max="60" placeholder="8" />
        </div>
      </div>

      <div class="form-section">
        <h3 class="form-section-title">Professional Bio</h3>
        <div class="field">
          <label>Bio</label>
          <textarea v-model="form.bio" rows="4" placeholder="Tell clients about your expertise, approach, and notable cases..."></textarea>
        </div>
      </div>

      <div class="form-section">
        <h3 class="form-section-title">Specializations</h3>
        <div class="spec-grid">
          <button
            v-for="s in allSpecs" :key="s" type="button"
            :class="['spec-btn', { selected: form.specializations.includes(s) }]"
            @click="toggleSpec(s)"
          >{{ s }}</button>
        </div>
      </div>

      <div class="form-section">
        <h3 class="form-section-title">Languages Spoken</h3>
        <div class="spec-grid">
          <button
            v-for="l in allLanguages" :key="l" type="button"
            :class="['spec-btn', { selected: form.languages.includes(l) }]"
            @click="toggleLang(l)"
          >{{ l }}</button>
        </div>
      </div>

      <div class="form-section">
        <h3 class="form-section-title">Bar Council Details</h3>
        <div class="readonly-field">
          <label>Bar Council Number</label>
          <div class="readonly-val">{{ lawyerStore.profile?.bar_council_number || '—' }}</div>
          <p class="readonly-note">Contact support to update bar council number</p>
        </div>
      </div>

      <div v-if="successMsg" class="success-banner">✓ {{ successMsg }}</div>
      <div v-if="errorMsg" class="error-banner">✗ {{ errorMsg }}</div>

      <div class="logout-section">
        <button class="logout-btn" @click="doLogout">
          <span>🚪</span> Sign Out
        </button>
        <div class="legal-links">
          <router-link to="/privacy">Privacy Policy</router-link>
          <span>·</span>
          <router-link to="/terms">Terms of Service</router-link>
        </div>
        <p class="version">Vakilr v1.0.0 · Test Build</p>
      </div>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLawyerStore } from '@/stores/lawyer'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'

const auth = useAuthStore()
const lawyerStore = useLawyerStore()
const router = useRouter()

const photoInput = ref(null)
const saving     = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

const avatarUrl = computed(() => lawyerStore.profile?.avatar_url || auth.profile?.avatar_url)
const initials  = computed(() => (lawyerStore.profile?.full_name || 'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2))

const form = reactive({
  full_name: '', phone: '', city: '', experience_years: 0,
  bio: '', specializations: [], languages: [],
})

const allSpecs = ['Family Law','Criminal Defense','Property Law','Corporate Law','Labour Law','Cyber Law','Tax Law','Immigration','Consumer Law','Banking Law','Intellectual Property','Constitutional Law']
const allLanguages = ['Hindi','English','Tamil','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Urdu']

function toggleSpec(s) {
  const i = form.specializations.indexOf(s)
  if (i === -1) form.specializations.push(s)
  else form.specializations.splice(i, 1)
}
function toggleLang(l) {
  const i = form.languages.indexOf(l)
  if (i === -1) form.languages.push(l)
  else form.languages.splice(i, 1)
}

function triggerPhotoUpload() { photoInput.value?.click() }

async function handlePhotoUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  saving.value = true
  const result = await lawyerStore.uploadPhoto(auth.user.id, file)
  saving.value = false
  if (result.success) successMsg.value = 'Photo updated!'
  else errorMsg.value = result.error
}

async function saveProfile() {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''
  const result = await lawyerStore.updateProfile(auth.user.id, { ...form })
  saving.value = false
  if (result.success) { successMsg.value = 'Profile saved successfully!' }
  else { errorMsg.value = 'Failed to save. Please try again.' }
}

async function doLogout() {
  await auth.signOut()
  router.push('/login')
}

onMounted(async () => {
  if (auth.user?.id && !lawyerStore.profile) await lawyerStore.fetchProfile(auth.user.id)
  const p = lawyerStore.profile
  if (p) {
    form.full_name        = p.full_name || p.profiles?.full_name || ''
    form.phone            = p.phone || p.profiles?.phone || ''
    form.city             = p.city || ''
    form.experience_years = p.experience_years || 0
    form.bio              = p.bio || ''
    form.specializations  = p.specializations || []
    form.languages        = p.languages || []
  }
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.save-btn{background:#C9A84C;color:#0A0F2C;border:none;border-radius:10px;padding:0.5rem 1.2rem;font-weight:700;font-size:0.85rem;cursor:pointer}
.save-btn:disabled{opacity:0.5;cursor:not-allowed}
.profile-content{position:relative;z-index:1;padding:1.25rem}
.photo-section{display:flex;flex-direction:column;align-items:center;margin-bottom:1.5rem}
.photo-wrap{width:90px;height:90px;border-radius:50%;position:relative;cursor:pointer;border:3px solid rgba(201,168,76,0.4);overflow:hidden}
.photo-img{width:100%;height:100%;object-fit:cover}
.photo-placeholder{width:100%;height:100%;background:linear-gradient(135deg,#C9A84C,#a8882a);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700;color:#0A0F2C}
.photo-overlay{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);text-align:center;font-size:1.1rem;padding:0.2rem}
.photo-hint{font-size:0.75rem;color:rgba(240,244,255,0.4);margin-top:0.5rem}
.form-section{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.25rem;margin-bottom:1rem}
.form-section-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#C9A84C;margin-bottom:1rem}
.field{display:flex;flex-direction:column;gap:0.4rem;margin-bottom:0.875rem}
.field:last-child{margin-bottom:0}
label{font-size:0.72rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em}
input,textarea,select{background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.9rem;padding:0 0.875rem;outline:none;transition:border-color 0.2s}
input{height:44px}
textarea{padding:0.75rem 0.875rem;resize:vertical}
input:focus,textarea:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,0.1)}
.spec-grid{display:flex;flex-wrap:wrap;gap:0.5rem}
.spec-btn{padding:0.4rem 0.875rem;border-radius:100px;border:1.5px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:500;cursor:pointer;transition:all 0.2s}
.spec-btn.selected{background:rgba(201,168,76,0.12);border-color:#C9A84C;color:#C9A84C}
.readonly-field label{font-size:0.72rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:0.3rem}
.readonly-val{font-size:0.95rem;color:#f0f4ff;font-weight:600;margin-bottom:0.3rem}
.readonly-note{font-size:0.72rem;color:rgba(240,244,255,0.35)}
.success-banner{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#10b981;padding:0.75rem 1rem;border-radius:10px;font-size:0.85rem;margin-top:1rem}
.error-banner{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;padding:0.75rem 1rem;border-radius:10px;font-size:0.85rem;margin-top:1rem}

/* NEW LOGOUT STYLES */
.logout-section { padding: 2rem 1.5rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.logout-btn { display: flex; align-items: center; gap: 8px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; padding: 12px 24px; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.logout-btn:active { background: rgba(239,68,68,0.2); }
.legal-links { display: flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; }
.legal-links a { color: rgba(240,244,255,0.35); text-decoration: none; }
.legal-links span { color: rgba(240,244,255,0.2); }
.version { font-family: 'DM Sans', sans-serif; font-size: 0.7rem; color: rgba(240,244,255,0.2); margin: 0; }
</style>
