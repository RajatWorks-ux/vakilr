<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/client" class="back-btn">←</router-link>
      <h1 class="page-title">Edit Profile</h1>
      <button class="save-btn" @click="save" :disabled="saving">
        {{ saving ? '...' : 'Save' }}
      </button>
    </div>

    <div class="profile-body">
      <!-- Avatar -->
      <div class="avatar-section">
        <div class="avatar-wrap" @click="photoInput?.click()">
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" />
          <div v-else class="avatar-placeholder">{{ initials }}</div>
          <div class="avatar-overlay">📷</div>
        </div>
        <input ref="photoInput" type="file" accept="image/*" @change="handlePhoto" style="display:none" />
        <p class="avatar-hint">Tap to change photo</p>
      </div>

      <!-- Form -->
      <div class="form-card">
        <h3 class="card-title">Personal Info</h3>
        <div class="field">
          <label>Full Name</label>
          <input v-model="form.full_name" placeholder="Your full name" />
        </div>
        <div class="field">
          <label>Phone</label>
          <div class="input-prefix">
            <span class="prefix">+91</span>
            <input v-model="form.phone" type="tel" maxlength="10" placeholder="98765 43210"
              :class="{ err: form.phone && !/^[6-9]\d{9}$/.test(form.phone) }" />
          </div>
          <span v-if="form.phone && !/^[6-9]\d{9}$/.test(form.phone)" class="err-hint">
            Enter valid 10-digit number
          </span>
        </div>
        <div class="field">
          <label>City</label>
          <input v-model="form.city" placeholder="e.g. Mumbai" />
        </div>
      </div>

      <div v-if="toast" class="toast" :class="toastType">{{ toast }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth      = useAuthStore()
const saving    = ref(false)
const photoInput = ref(null)
const toast     = ref('')
const toastType = ref('success')
const avatarPreview = ref(null)

const form = reactive({ full_name: '', phone: '', city: '' })

const avatarUrl = computed(() => avatarPreview.value || auth.profile?.avatar_url)
const initials  = computed(() => (form.full_name || auth.profile?.full_name || '?')
  .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2))

onMounted(() => {
  form.full_name = auth.profile?.full_name || ''
  form.phone     = auth.profile?.phone || ''
  form.city      = auth.profile?.city || ''
})

async function handlePhoto(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { showToast('Max 5MB', 'error'); return }
  avatarPreview.value = URL.createObjectURL(file)

  const ext  = file.name.split('.').pop()
  const path = `avatars/${auth.user.id}.${ext}`
  const { error } = await supabase.storage.from('vakilr').upload(path, file, { upsert: true })
  if (error) { showToast('Photo upload failed', 'error'); return }
  const { data: { publicUrl } } = supabase.storage.from('vakilr').getPublicUrl(path)
  await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', auth.user.id)
  await auth.fetchProfile()
  showToast('Photo updated ✓')
}

async function save() {
  if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
    showToast('Fix phone number first', 'error'); return
  }
  saving.value = true
  const { error } = await supabase.from('profiles').update({
    full_name: form.full_name,
    phone:     form.phone,
    city:      form.city,
  }).eq('id', auth.user.id)

  await auth.fetchProfile()
  saving.value = false
  showToast(error ? 'Save failed' : 'Profile saved ✓', error ? 'error' : 'success')
}

function showToast(msg, type = 'success') {
  toast.value = msg; toastType.value = type
  setTimeout(() => { toast.value = '' }, 3000)
}
</script>

<style scoped>
.page { min-height:100vh; background:#0A0F2C; padding-bottom:3rem; }
.page-bg { position:fixed; inset:0; background:radial-gradient(ellipse 60% 30% at 50% 0%, rgba(201,168,76,0.06), transparent 60%); pointer-events:none; }
.page-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem; position:sticky; top:0; z-index:10; background:rgba(10,15,44,0.96); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.06); }
.back-btn { color:#8892b0; text-decoration:none; font-size:1.2rem; }
.page-title { font-family:'Playfair Display',serif; font-size:1.25rem; color:#f0f4ff; }
.save-btn { background:#C9A84C; color:#0A0F2C; border:none; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.85rem; padding:0.5rem 1.25rem; border-radius:10px; cursor:pointer; }
.save-btn:disabled { opacity:0.5; }
.profile-body { padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem; }
.avatar-section { display:flex; flex-direction:column; align-items:center; gap:0.5rem; }
.avatar-wrap { position:relative; width:90px; height:90px; border-radius:50%; cursor:pointer; overflow:hidden; border:3px solid rgba(201,168,76,0.3); }
.avatar-img { width:100%; height:100%; object-fit:cover; }
.avatar-placeholder { width:100%; height:100%; background:linear-gradient(135deg,#C9A84C,#a8893d); display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; font-weight:800; font-size:1.5rem; color:#04071a; }
.avatar-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; font-size:1.4rem; opacity:0; transition:opacity 0.2s; }
.avatar-wrap:hover .avatar-overlay { opacity:1; }
.avatar-hint { font-family:'DM Sans',sans-serif; font-size:0.75rem; color:#4a5578; }
.form-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:1.25rem; display:flex; flex-direction:column; gap:1rem; }
.card-title { font-family:'Playfair Display',serif; font-size:1rem; color:#C9A84C; margin-bottom:0.25rem; }
.field { display:flex; flex-direction:column; gap:0.4rem; }
label { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; color:#8892b0; text-transform:uppercase; letter-spacing:0.08em; }
input { width:100%; height:46px; background:rgba(10,15,44,0.8); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; color:#f0f4ff; font-family:'DM Sans',sans-serif; font-size:0.92rem; padding:0 1rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
input:focus { border-color:#C9A84C; }
input.err { border-color:#ef4444; }
.input-prefix { position:relative; display:flex; align-items:center; }
.prefix { position:absolute; left:1rem; color:#8892b0; font-family:'DM Sans',sans-serif; font-size:0.9rem; pointer-events:none; }
.input-prefix input { padding-left:3.2rem; }
.err-hint { font-family:'DM Sans',sans-serif; font-size:0.72rem; color:#ef4444; }
.toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); padding:0.75rem 1.5rem; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:600; z-index:100; white-space:nowrap; }
.toast.success { background:#10b981; color:#fff; }
.toast.error { background:#ef4444; color:#fff; }
</style>