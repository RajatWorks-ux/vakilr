<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/firm" class="back-btn">←</router-link>
      <h1 class="page-title">Firm Profile</h1>
      <button class="save-btn" @click="save" :disabled="saving">{{ saving ? '...' : 'Save' }}</button>
    </div>

    <div class="body" v-if="loaded">
      <div class="form-card">
        <h3 class="card-title">Firm Details</h3>
        <div class="field"><label>Firm Name</label>
          <input v-model="form.firm_name" placeholder="e.g. Sharma & Associates" /></div>
        <div class="field"><label>Registration Number</label>
          <input v-model="form.registration_number" placeholder="e.g. MH-LLP-2015-001" /></div>
        <div class="field"><label>City</label>
          <input v-model="form.city" placeholder="Mumbai" /></div>
        <div class="field"><label>Office Address</label>
          <input v-model="form.address" placeholder="Full office address" /></div>
        <div class="field"><label>Team Size</label>
          <input v-model.number="form.team_size" type="number" min="1" placeholder="10" /></div>
      </div>

      <div class="form-card">
        <h3 class="card-title">Practice Areas</h3>
        <div class="spec-grid">
          <button v-for="s in allSpecs" :key="s" type="button"
            :class="['spec-btn', { selected: form.specializations?.includes(s) }]"
            @click="toggleSpec(s)">{{ s }}</button>
        </div>
      </div>

      <div v-if="toast" class="toast" :class="toastType">{{ toast }}</div>
    </div>
    <div v-else class="loading"><div class="spin"></div></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth   = useAuthStore()
const saving = ref(false)
const loaded = ref(false)
const toast  = ref(''); const toastType = ref('success')

const allSpecs = ['Family Law','Criminal Defense','Property Law','Corporate Law','Labour Law','Cyber Law','Tax Law','Banking Law','Intellectual Property','Constitutional Law']

const form = reactive({ firm_name:'', registration_number:'', city:'', address:'', team_size:1, specializations:[] })

onMounted(async () => {
  const { data } = await supabase.from('firm_profiles').select('*').eq('id', auth.user.id).single()
  if (data) Object.assign(form, { ...data, specializations: data.specializations || [] })
  loaded.value = true
})

function toggleSpec(s) {
  if (!form.specializations) form.specializations = []
  const i = form.specializations.indexOf(s)
  if (i === -1) form.specializations.push(s)
  else form.specializations.splice(i, 1)
}

async function save() {
  saving.value = true
  const { error } = await supabase.from('firm_profiles').update({
    firm_name: form.firm_name, registration_number: form.registration_number,
    city: form.city, address: form.address, team_size: form.team_size,
    specializations: form.specializations,
  }).eq('id', auth.user.id)
  saving.value = false
  showToast(error ? 'Save failed' : 'Saved ✓', error ? 'error' : 'success')
}

function showToast(msg, type = 'success') { toast.value = msg; toastType.value = type; setTimeout(() => toast.value = '', 3000) }
</script>

<style scoped>
.page { min-height:100vh; background:#04071a; padding-bottom:3rem; }
.page-bg { position:fixed; inset:0; background:radial-gradient(ellipse 60% 30% at 50% 0%, rgba(201,168,76,0.06), transparent 60%); pointer-events:none; }
.page-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem; position:sticky; top:0; z-index:10; background:rgba(4,7,26,0.96); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.06); }
.back-btn { color:#8892b0; text-decoration:none; font-size:1.2rem; }
.page-title { font-family:'Playfair Display',serif; font-size:1.25rem; color:#f0f4ff; }
.save-btn { background:#C9A84C; color:#0A0F2C; border:none; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.85rem; padding:0.5rem 1.25rem; border-radius:10px; cursor:pointer; }
.body { padding:1.25rem; display:flex; flex-direction:column; gap:1.25rem; }
.form-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:1.25rem; display:flex; flex-direction:column; gap:1rem; }
.card-title { font-family:'Playfair Display',serif; font-size:1rem; color:#C9A84C; margin-bottom:0.25rem; }
.field { display:flex; flex-direction:column; gap:0.4rem; }
label { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; color:#8892b0; text-transform:uppercase; letter-spacing:0.08em; }
input { width:100%; height:46px; background:rgba(4,7,26,0.8); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; color:#f0f4ff; font-family:'DM Sans',sans-serif; font-size:0.92rem; padding:0 1rem; outline:none; box-sizing:border-box; }
input:focus { border-color:#C9A84C; }
.spec-grid { display:flex; flex-wrap:wrap; gap:0.5rem; }
.spec-btn { padding:0.4rem 0.9rem; border-radius:100px; border:1.5px solid rgba(255,255,255,0.1); background:transparent; color:#8892b0; font-family:'DM Sans',sans-serif; font-size:0.78rem; cursor:pointer; transition:all 0.2s; }
.spec-btn.selected { background:rgba(201,168,76,0.12); border-color:#C9A84C; color:#C9A84C; }
.loading { display:flex; justify-content:center; padding:4rem; }
.spin { width:28px; height:28px; border:2px solid rgba(201,168,76,0.2); border-top-color:#C9A84C; border-radius:50%; animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); padding:0.75rem 1.5rem; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:600; z-index:100; }
.toast.success { background:#10b981; color:#fff; }
.toast.error { background:#ef4444; color:#fff; }
</style>