<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/client" class="back-btn">←</router-link>
      <h1 class="page-title">My Sessions</h1>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="t in tabs" :key="t.val" :class="['tab', { active: activeTab === t.val }]" @click="activeTab = t.val">
        {{ t.label }}
      </button>
    </div>

    <div class="sessions-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>
      <div v-else-if="filteredSessions.length === 0" class="empty-state">
        <span>{{ tabs.find(t=>t.val===activeTab)?.icon }}</span>
        <p>No {{ activeTab }} sessions</p>
      </div>
      <div v-else class="sessions-list">
        <div class="session-card" v-for="s in filteredSessions" :key="s.id">
          <div class="sc-top">
            <div class="sc-avatar">{{ getInitials(s.profiles?.full_name) }}</div>
            <div class="sc-info">
              <div class="sc-lawyer">{{ s.profiles?.full_name || 'Lawyer' }}</div>
              <div class="sc-type">{{ typeIcons[s.session_type] }} {{ typeLabels[s.session_type] }}</div>
              <div class="sc-date">{{ formatDate(s.created_at) }}</div>
            </div>
            <div class="sc-right">
              <span :class="['sc-status', s.status]">{{ s.status }}</span>
              <div class="sc-amount">₹{{ s.total_amount?.toFixed(2) || '—' }}</div>
            </div>
          </div>
          <div class="sc-actions" v-if="s.status === 'completed'">
            <router-link :to="'/client/dispute/' + s.id" class="sc-dispute">⚖️ File Dispute</router-link>
            <router-link :to="'/client/lawyer/' + s.lawyer_id" class="sc-book-again">Book Again →</router-link>
          </div>
          <div v-if="s.status === 'active'">
            <router-link :to="getSessionRoute(s)" class="sc-rejoin">↩ Rejoin Session</router-link>
          </div>
        </div>
      </div>
    </div>

    <div style="height:80px"></div>
    <ClientBottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import ClientBottomNav from '@/components/ClientBottomNav.vue'

const auth = useAuthStore()
const clientStore = useClientStore()

const loading   = ref(false)
const activeTab = ref('all')

const tabs = [
  { val:'all',       label:'All',       icon:'📋' },
  { val:'active',    label:'Active',    icon:'🟢' },
  { val:'completed', label:'Done',      icon:'✅' },
  { val:'disputed',  label:'Disputed',  icon:'⚖️' },
]

const typeIcons  = { chat:'💬', voice:'📞', video:'🎥', document_review:'📄', will_draft:'📜', nda:'🤝', court_case:'🏛️' }
const typeLabels = { chat:'Chat', voice:'Voice Call', video:'Video Call', document_review:'Document Review', will_draft:'Will Draft', nda:'NDA', court_case:'Court Case' }

const filteredSessions = computed(() => {
  if (activeTab.value === 'all') return clientStore.sessions
  return clientStore.sessions.filter(s => s.status === activeTab.value)
})

function getInitials(n) { return (n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
function formatDate(ts) { return new Date(ts).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) }
function getSessionRoute(s) {
  if (s.session_type === 'chat')  return `/client/chat/${s.id}`
  if (s.session_type === 'voice') return `/client/call/${s.id}`
  if (s.session_type === 'video') return `/client/video/${s.id}`
  return `/client/document/${s.id}`
}

onMounted(async () => {
  loading.value = true
  await clientStore.fetchSessions(auth.user.id)
  loading.value = false
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.tabs{position:relative;z-index:1;display:flex;gap:0;padding:0.75rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.tab{flex:1;padding:0.6rem;border-radius:10px;border:none;background:transparent;color:rgba(240,244,255,0.45);font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:600;cursor:pointer;transition:all 0.2s}
.tab.active{background:rgba(201,168,76,0.1);color:#C9A84C}
.sessions-content{position:relative;z-index:1;padding:1rem 1.25rem}
.loading-state{text-align:center;padding:3rem}
.spinner{width:36px;height:36px;border:3px solid rgba(201,168,76,0.3);border-top-color:#C9A84C;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto}
@keyframes spin{to{transform:rotate(360deg)}}
.empty-state{text-align:center;padding:3rem;color:rgba(240,244,255,0.35)}
.empty-state span{font-size:2.5rem;display:block;margin-bottom:0.75rem}
.empty-state p{font-size:0.88rem}
.sessions-list{display:flex;flex-direction:column;gap:0.875rem}
.session-card{background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.1rem}
.sc-top{display:flex;align-items:center;gap:0.875rem;margin-bottom:0.875rem}
.sc-avatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#a8882a);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;color:#0A0F2C;flex-shrink:0}
.sc-info{flex:1}
.sc-lawyer{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.sc-type{font-size:0.73rem;color:#C9A84C;margin-top:0.1rem}
.sc-date{font-size:0.68rem;color:rgba(240,244,255,0.35);margin-top:0.1rem}
.sc-right{text-align:right}
.sc-status{display:block;font-size:0.68rem;font-weight:700;text-transform:capitalize;padding:0.15rem 0.5rem;border-radius:100px;margin-bottom:0.3rem}
.sc-status.completed{background:rgba(16,185,129,0.12);color:#10b981}
.sc-status.active{background:rgba(59,130,246,0.12);color:#60a5fa}
.sc-status.pending{background:rgba(245,158,11,0.12);color:#f59e0b}
.sc-status.disputed{background:rgba(239,68,68,0.12);color:#ef4444}
.sc-status.cancelled{background:rgba(100,116,139,0.12);color:#64748b}
.sc-amount{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#C9A84C}
.sc-actions{display:flex;gap:0.6rem;border-top:1px solid rgba(255,255,255,0.05);padding-top:0.75rem}
.sc-dispute{flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(245,158,11,0.25);background:rgba(245,158,11,0.08);color:#f59e0b;text-decoration:none;font-size:0.78rem;font-weight:600;text-align:center}
.sc-book-again{flex:1;padding:0.5rem;border-radius:8px;border:none;background:rgba(201,168,76,0.12);color:#C9A84C;text-decoration:none;font-size:0.78rem;font-weight:700;text-align:center}
.sc-rejoin{display:block;padding:0.6rem;border-radius:10px;background:#C9A84C;color:#0A0F2C;text-decoration:none;font-size:0.83rem;font-weight:700;text-align:center;border-top:1px solid rgba(255,255,255,0.05);padding-top:0.875rem;margin-top:0.5rem}
</style>