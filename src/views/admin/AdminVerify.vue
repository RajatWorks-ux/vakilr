<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/admin" class="back-btn">←</router-link>
      <h1 class="page-title">Verify Lawyers</h1>
      <div class="tab-row">
        <button v-for="t in tabs" :key="t.key"
          :class="['tab-btn', { active: tab === t.key }]"
          @click="tab = t.key">
          {{ t.label }}
          <span v-if="t.count" class="tab-badge">{{ t.count }}</span>
        </button>
      </div>
    </div>

    <div class="list-wrap">
      <div v-if="loading" class="loading-state">
        <div class="spin"></div><p>Loading queue...</p>
      </div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <span>✅</span><p>No {{ tab }} applications</p>
      </div>
      <div v-else class="lawyer-cards">
        <div class="lc" v-for="item in filtered" :key="item.id">
          <div class="lc-top">
            <div class="lc-av" :style="{ background: getColor(item.profiles?.full_name) }">
              {{ getInitials(item.profiles?.full_name) }}
            </div>
            <div class="lc-info">
              <div class="lc-name">{{ item.profiles?.full_name }}</div>
              <div class="lc-email">{{ item.profiles?.email }}</div>
              <div class="lc-meta">{{ item.bar_council_number }} · {{ item.city }}</div>
            </div>
            <div :class="['lc-badge', item.availability_status === 'pending' ? 'pending' : 'done']">
              {{ item.availability_status === 'pending' ? 'Pending' : 'Reviewed' }}
            </div>
          </div>
          <div class="lc-specs">
            <span class="spec-tag" v-for="s in (item.specializations || []).slice(0,3)" :key="s">{{ s }}</span>
          </div>
          <div class="lc-details">
            <span>{{ item.experience_years }} yrs exp</span>
            <span>{{ item.city }}</span>
            <span>{{ (item.languages || []).join(', ') }}</span>
          </div>
          <div v-if="item.certificate_url" class="cert-link">
            <a :href="item.certificate_url" target="_blank">📄 View Certificate</a>
          </div>

          <div v-if="tab === 'pending'" class="lc-actions">
            <button class="btn-approve" :disabled="processing === item.id"
              @click="approve(item)">
              {{ processing === item.id ? 'Approving...' : '✓ Approve' }}
            </button>
            <button class="btn-reject" :disabled="processing === item.id"
              @click="reject(item)">
              ✕ Reject
            </button>
          </div>
          <div v-else class="lc-decision" :class="item.profiles?.verification_status">
            {{ item.profiles?.verification_status === 'approved' ? '✅ Approved' : '❌ Rejected' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-anim">
      <div v-if="toast" class="toast" :class="toast.type">{{ toast.msg }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const loading    = ref(true)
const processing = ref(null)
const tab        = ref('pending')
const queue      = ref([])
const toast      = ref(null)

const tabs = computed(() => [
  { key: 'pending',  label: 'Pending',  count: queue.value.filter(q => !q.profiles?.is_verified && q.profiles?.verification_status !== 'rejected').length },
  { key: 'approved', label: 'Approved', count: 0 },
  { key: 'rejected', label: 'Rejected', count: 0 },
])

const filtered = computed(() => {
  if (tab.value === 'pending')  return queue.value.filter(q => q.profiles?.verification_status === 'pending')
  if (tab.value === 'approved') return queue.value.filter(q => q.profiles?.verification_status === 'approved')
  return queue.value.filter(q => q.profiles?.verification_status === 'rejected')
})

onMounted(loadQueue)

async function loadQueue() {
  loading.value = true
  const { data } = await supabase
    .from('lawyer_profiles')
    .select('*, profiles(full_name, email, is_verified, verification_status)')
    .order('created_at', { ascending: false })
  queue.value   = data || []
  loading.value = false
}

async function approve(item) {
  processing.value = item.id
  // Update lawyer_profiles
  await supabase.from('lawyer_profiles').update({
    availability_status: 'approved',
    is_profile_complete: true,
  }).eq('id', item.id)
  // Update profiles table
  await supabase.from('profiles').update({
    is_verified: true,
    verification_status: 'approved',
  }).eq('id', item.id)

  // ✅ Auto-email: send approval notification via Supabase Edge Function
  // (Set up edge function 'send-approval-email' in your Supabase dashboard)
  try {
    await supabase.functions.invoke('send-approval-email', {
      body: {
        to:   item.profiles?.email,
        name: item.profiles?.full_name,
        type: 'approved',
      },
    })
  } catch (e) {
    // Edge function not set up yet — email skipped, approval still works
    console.warn('Email not sent — set up send-approval-email edge function:', e.message)
  }

  showToast(`✅ ${item.profiles?.full_name} approved & notified`, 'success')
  processing.value = null
  await loadQueue()
}

async function reject(item) {
  processing.value = item.id
  await supabase.from('profiles').update({
    is_verified: false,
    verification_status: 'rejected',
  }).eq('id', item.id)

  try {
    await supabase.functions.invoke('send-approval-email', {
      body: {
        to:   item.profiles?.email,
        name: item.profiles?.full_name,
        type: 'rejected',
      },
    })
  } catch (e) { console.warn('Email not sent:', e.message) }

  showToast(`❌ ${item.profiles?.full_name} rejected`, 'error')
  processing.value = null
  await loadQueue()
}

function showToast(msg, type = 'success') {
  toast.value = { msg, type }
  setTimeout(() => { toast.value = null }, 3000)
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
function getColor(name) {
  const colors = ['#C9A84C','#10b981','#3b82f6','#8b5cf6','#f59e0b']
  return colors[(name?.charCodeAt(0) || 0) % colors.length]
}
</script>

<style scoped>
.page { min-height:100vh; background:#04071a; padding-bottom:3rem; }
.page-bg { position:fixed; inset:0; background:radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.06), transparent 60%); pointer-events:none; }
.page-header { position:sticky; top:0; z-index:10; background:rgba(4,7,26,0.95); backdrop-filter:blur(12px); padding:1rem 1.25rem 0; border-bottom:1px solid rgba(255,255,255,0.06); }
.back-btn { color:#8892b0; text-decoration:none; font-family:'DM Sans',sans-serif; font-size:1.1rem; }
.page-title { font-family:'Playfair Display',serif; font-size:1.5rem; color:#f0f4ff; margin:0.5rem 0 1rem; }
.tab-row { display:flex; gap:0.5rem; padding-bottom:0; }
.tab-btn { background:none; border:none; color:#4a5578; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; padding:0.6rem 1rem; border-bottom:2px solid transparent; cursor:pointer; display:flex; align-items:center; gap:0.4rem; }
.tab-btn.active { color:#C9A84C; border-bottom-color:#C9A84C; }
.tab-badge { background:#C9A84C; color:#04071a; font-size:0.65rem; font-weight:800; padding:0.1rem 0.45rem; border-radius:100px; }
.list-wrap { padding:1.25rem; }
.loading-state,.empty-state { text-align:center; padding:4rem 1rem; color:#4a5578; font-family:'DM Sans',sans-serif; }
.spin { width:28px; height:28px; border:2px solid rgba(201,168,76,0.2); border-top-color:#C9A84C; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem; }
@keyframes spin { to { transform:rotate(360deg); } }
.lawyer-cards { display:flex; flex-direction:column; gap:1rem; }
.lc { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:1.25rem; }
.lc-top { display:flex; align-items:flex-start; gap:0.9rem; margin-bottom:0.9rem; }
.lc-av { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; font-weight:800; color:#04071a; font-size:0.85rem; flex-shrink:0; }
.lc-info { flex:1; min-width:0; }
.lc-name { font-family:'DM Sans',sans-serif; font-weight:700; color:#f0f4ff; font-size:0.95rem; }
.lc-email { font-size:0.78rem; color:#8892b0; margin-top:0.1rem; }
.lc-meta { font-size:0.75rem; color:#4a5578; margin-top:0.1rem; }
.lc-badge { font-size:0.65rem; font-weight:800; padding:0.2rem 0.6rem; border-radius:100px; flex-shrink:0; }
.lc-badge.pending { background:rgba(201,168,76,0.12); color:#C9A84C; }
.lc-badge.done { background:rgba(16,185,129,0.12); color:#10b981; }
.lc-specs { display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:0.75rem; }
.spec-tag { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:#8892b0; font-size:0.7rem; padding:0.2rem 0.5rem; border-radius:100px; font-family:'DM Sans',sans-serif; }
.lc-details { display:flex; gap:1rem; font-family:'DM Sans',sans-serif; font-size:0.75rem; color:#4a5578; margin-bottom:0.75rem; }
.cert-link { margin-bottom:0.9rem; }
.cert-link a { font-family:'DM Sans',sans-serif; font-size:0.8rem; color:#C9A84C; text-decoration:none; }
.lc-actions { display:flex; gap:0.75rem; }
.btn-approve { flex:1; padding:0.7rem; border-radius:10px; border:none; background:#10b981; color:#fff; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.85rem; cursor:pointer; transition:opacity 0.2s; }
.btn-approve:disabled { opacity:0.5; cursor:not-allowed; }
.btn-reject { flex:1; padding:0.7rem; border-radius:10px; border:1px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.08); color:#ef4444; font-family:'DM Sans',sans-serif; font-weight:700; font-size:0.85rem; cursor:pointer; }
.lc-decision { text-align:center; font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:700; padding:0.5rem; }
.lc-decision.approved { color:#10b981; }
.lc-decision.rejected { color:#ef4444; }
.toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); background:#1a1f3a; border-radius:12px; padding:0.8rem 1.5rem; font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:600; z-index:100; box-shadow:0 8px 32px rgba(0,0,0,0.4); white-space:nowrap; }
.toast.success { border:1px solid rgba(16,185,129,0.3); color:#10b981; }
.toast.error { border:1px solid rgba(239,68,68,0.3); color:#ef4444; }
.toast-anim-enter-active,.toast-anim-leave-active { transition:all 0.3s; }
.toast-anim-enter-from,.toast-anim-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }
</style>