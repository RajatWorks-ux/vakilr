<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/lawyer" class="back-btn">←</router-link>
      <h1 class="page-title">Incoming Requests</h1>
      <span class="req-count" v-if="requests.length">{{ requests.length }}</span>
    </div>

    <div class="req-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div><p>Loading requests...</p>
      </div>

      <div v-else-if="requests.length === 0" class="empty-state">
        <span>📭</span>
        <h3>No Pending Requests</h3>
        <p>New client requests will appear here. Make sure you're set to Online!</p>
        <router-link to="/lawyer" class="go-online-btn">Set Status Online →</router-link>
      </div>

      <div v-else>
        <p class="req-hint">Accept within 30 seconds or the request auto-declines.</p>
        <div class="request-card" v-for="req in requests" :key="req.id">
          <div class="rc-timer-bar">
            <div class="rc-timer-fill" :style="{ width: (timers[req.id] / 30 * 100) + '%', background: timers[req.id] > 10 ? '#10b981' : '#ef4444' }"></div>
          </div>
          <div class="rc-body">
            <div class="rc-top">
              <div class="rc-avatar">{{ getInitials(req.profiles?.full_name) }}</div>
              <div class="rc-info">
                <div class="rc-client">{{ req.profiles?.full_name || 'Client' }}</div>
                <div class="rc-service">{{ typeIcons[req.session_type] }} {{ typeLabels[req.session_type] }}</div>
                <div class="rc-rate">₹{{ req.rate_per_minute || req.flat_rate }}{{ req.rate_per_minute ? '/min' : ' flat' }}</div>
              </div>
              <div class="rc-countdown" :class="{ urgent: timers[req.id] <= 10 }">
                {{ timers[req.id] }}s
              </div>
            </div>
            <div class="rc-actions">
              <button class="rc-accept" @click="accept(req.id)">✓ Accept</button>
              <button class="rc-decline" @click="decline(req.id)">✗ Decline</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLawyerStore } from '@/stores/lawyer'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'

const auth = useAuthStore()
const lawyerStore = useLawyerStore()
const router = useRouter()

const loading  = ref(true)
const requests = ref([])
const timers   = reactive({})
let intervals  = {}

const typeIcons  = { chat:'💬', voice:'📞', video:'🎥', document:'📄', court_case:'🏛️' }
const typeLabels = { chat:'Chat Consultation', voice:'Voice Call', video:'Video Call', document:'Document Review', court_case:'Court Case' }

function getInitials(name) {
  return (name || 'C').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
}

function startTimer(reqId) {
  timers[reqId] = 30
  intervals[reqId] = setInterval(() => {
    timers[reqId]--
    if (timers[reqId] <= 0) decline(reqId)
  }, 1000)
}

function clearTimer(reqId) {
  if (intervals[reqId]) { clearInterval(intervals[reqId]); delete intervals[reqId] }
}

async function accept(reqId) {
  clearTimer(reqId)
  await lawyerStore.acceptRequest(reqId)
  requests.value = requests.value.filter(r => r.id !== reqId)
  router.push(`/lawyer/session/${reqId}`)
}

async function decline(reqId) {
  clearTimer(reqId)
  await lawyerStore.declineRequest(reqId)
  requests.value = requests.value.filter(r => r.id !== reqId)
}

async function loadRequests() {
  loading.value = true
  await lawyerStore.fetchPendingRequests(auth.user.id)
  requests.value = lawyerStore.pendingRequests
  requests.value.forEach(r => startTimer(r.id))
  loading.value = false
}

onMounted(loadRequests)
onUnmounted(() => { Object.keys(intervals).forEach(clearTimer) })
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.req-count{background:#ef4444;color:#fff;font-size:0.72rem;font-weight:700;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.req-content{position:relative;z-index:1;padding:1.25rem}
.req-hint{font-size:0.8rem;color:rgba(240,244,255,0.45);margin-bottom:1rem;text-align:center}
.loading-state{text-align:center;padding:3rem;color:rgba(240,244,255,0.5)}
.spinner{width:36px;height:36px;border:3px solid rgba(201,168,76,0.3);border-top-color:#C9A84C;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 1rem}
@keyframes spin{to{transform:rotate(360deg)}}
.empty-state{text-align:center;padding:3rem 1rem}
.empty-state span{font-size:3rem;display:block;margin-bottom:0.75rem}
.empty-state h3{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.empty-state p{font-size:0.85rem;color:rgba(240,244,255,0.5);margin-bottom:1.5rem;line-height:1.6}
.go-online-btn{display:inline-block;background:#C9A84C;color:#0A0F2C;padding:0.75rem 1.5rem;border-radius:12px;text-decoration:none;font-weight:700;font-size:0.88rem}
.request-card{background:rgba(22,29,63,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;margin-bottom:1rem;box-shadow:0 4px 20px rgba(0,0,0,0.3)}
.rc-timer-bar{height:3px;background:rgba(255,255,255,0.08)}
.rc-timer-fill{height:100%;transition:width 1s linear,background 0.3s}
.rc-body{padding:1rem}
.rc-top{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem}
.rc-avatar{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#a8882a);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#0A0F2C;flex-shrink:0}
.rc-info{flex:1}
.rc-client{font-weight:700;font-size:0.95rem;color:#f0f4ff}
.rc-service{font-size:0.78rem;color:#C9A84C;margin-top:0.15rem}
.rc-rate{font-size:0.75rem;color:rgba(240,244,255,0.5);margin-top:0.1rem}
.rc-countdown{font-family:'DM Sans',sans-serif;font-size:1.3rem;font-weight:900;color:#10b981;min-width:36px;text-align:right;transition:color 0.3s}
.rc-countdown.urgent{color:#ef4444;animation:pulse-urgent 0.5s ease-in-out infinite}
@keyframes pulse-urgent{0%,100%{opacity:1}50%{opacity:0.5}}
.rc-actions{display:flex;gap:0.75rem}
.rc-accept{flex:2;padding:0.75rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all 0.2s}
.rc-accept:hover{background:#e0b84a}
.rc-decline{flex:1;padding:0.75rem;border-radius:12px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.08);color:#ef4444;font-weight:600;font-size:0.9rem;cursor:pointer}
</style>