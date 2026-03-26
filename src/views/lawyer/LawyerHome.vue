<template>
  <div class="lawyer-home">
    <div class="lh-bg"></div>

    <!-- Verification Banner -->
    <VerificationBanner
      :show="showVerifyBanner"
      :type="verifyBannerType"
      :message="verifyBannerMsg"
      @dismiss="showVerifyBanner = false"
    />

    <!-- Rate Suggestion Banner -->
    <VerificationBanner
      :show="!!lawyerStore.rateSuggestion && showRateBanner"
      type="rate"
      :message="lawyerStore.rateSuggestion"
      @dismiss="showRateBanner = false"
    />

    <!-- Header -->
    <div class="lh-header">
      <div class="lh-greeting">
        <div class="lh-avatar" :style="avatarStyle">{{ initials }}</div>
        <div>
          <p class="lh-hello">Good {{ timeOfDay }},</p>
          <h1 class="lh-name">{{ displayName }}</h1>
        </div>
      </div>
      <div class="lh-status-wrap">
        <button
          v-for="s in statusOptions" :key="s.value"
          :class="['status-btn', { active: currentStatus === s.value }]"
          @click="setStatus(s.value)"
        >
          <span class="status-dot" :class="s.value"></span>
          {{ s.label }}
        </button>
      </div>
    </div>

    <!-- Earnings Card -->
    <div class="earnings-card">
      <div class="ec-glow"></div>
      <div class="ec-top">
        <div>
          <p class="ec-label">Available Balance</p>
          <p class="ec-amount">₹{{ formatNum(walletStore.balance) }}</p>
        </div>
        <div class="ec-right">
          <p class="ec-label">Locked (7d)</p>
          <p class="ec-locked">₹{{ formatNum(walletStore.lockedBalance) }}</p>
        </div>
      </div>
      <div class="ec-stats">
        <div class="ec-stat">
          <span class="ec-stat-val">₹{{ formatNum(walletStore.totalEarned) }}</span>
          <span class="ec-stat-label">Total Earned</span>
        </div>
        <div class="ec-stat-div"></div>
        <div class="ec-stat">
          <span class="ec-stat-val">{{ todaySessions }}</span>
          <span class="ec-stat-label">Today's Sessions</span>
        </div>
        <div class="ec-stat-div"></div>
        <div class="ec-stat">
          <span class="ec-stat-val">{{ lawyerStore.profile?.rating || '–' }}★</span>
          <span class="ec-stat-label">Your Rating</span>
        </div>
      </div>
      <router-link to="/lawyer/wallet" class="ec-withdraw-btn">
        Withdraw Funds →
      </router-link>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="qs-card" v-for="q in quickStats" :key="q.label">
        <span class="qs-icon">{{ q.icon }}</span>
        <span class="qs-val">{{ q.val }}</span>
        <span class="qs-label">{{ q.label }}</span>
      </div>
    </div>

    <!-- Pending Requests -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Incoming Requests</h2>
        <router-link to="/lawyer/requests" class="section-see-all">See All</router-link>
      </div>
      <div v-if="lawyerStore.pendingRequests.length === 0" class="empty-state">
        <span>📭</span>
        <p>No pending requests</p>
      </div>
      <div v-else class="requests-list">
        <RequestCard
          v-for="req in lawyerStore.pendingRequests.slice(0,2)"
          :key="req.id"
          :request="req"
          @accept="acceptReq(req.id)"
          @decline="declineReq(req.id)"
        />
      </div>
    </div>

    <!-- Recent Reviews -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Recent Reviews</h2>
        <router-link to="/lawyer/reviews" class="section-see-all">See All</router-link>
      </div>
      <div v-if="lawyerStore.reviews.length === 0" class="empty-state">
        <span>⭐</span><p>No reviews yet</p>
      </div>
      <div v-else class="reviews-preview">
        <div class="review-item" v-for="r in lawyerStore.reviews.slice(0,3)" :key="r.id">
          <div class="ri-top">
            <div class="ri-avatar">{{ getInitials(r.profiles?.full_name) }}</div>
            <div>
              <div class="ri-name">{{ r.profiles?.full_name || 'Client' }}</div>
              <div class="ri-stars">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5-r.rating) }}</div>
            </div>
          </div>
          <p class="ri-comment">{{ r.comment }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <router-link to="/lawyer/services" class="qa-btn">
        <span>⚖️</span> My Services
      </router-link>
      <router-link to="/lawyer/schedule" class="qa-btn">
        <span>📅</span> Schedule
      </router-link>
      <router-link to="/lawyer/cases" class="qa-btn">
        <span>🏛️</span> Court Cases
      </router-link>
      <router-link to="/lawyer/profile" class="qa-btn">
        <span>✏️</span> Edit Profile
      </router-link>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLawyerStore } from '@/stores/lawyer'
import { useWalletStore } from '@/stores/wallet'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'
import VerificationBanner from '@/components/VerificationBanner.vue'

// Inline RequestCard component
import { defineComponent, h } from 'vue'
const RequestCard = defineComponent({
  props: ['request'],
  emits: ['accept','decline'],
  setup(props, { emit }) {
    const timer = ref(30)
    const interval = setInterval(() => {
      timer.value--
      if (timer.value <= 0) { clearInterval(interval); emit('decline') }
    }, 1000)
    const typeIcons = { chat:'💬', voice:'📞', video:'🎥', document:'📄', court_case:'🏛️' }
    return () => h('div', { style:'background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:1rem;margin-bottom:0.75rem' }, [
      h('div', { style:'display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem' }, [
        h('div', { style:'width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#a8882a);display:flex;align-items:center;justify-content:center;font-weight:700;color:#0A0F2C;font-size:0.9rem' },
          props.request.profiles?.full_name?.split(' ').map(w=>w[0]).join('').slice(0,2) || 'C'),
        h('div', { style:'flex:1' }, [
          h('div', { style:'font-weight:700;font-size:0.9rem;color:#f0f4ff;font-family:DM Sans,sans-serif' }, props.request.profiles?.full_name || 'Client'),
          h('div', { style:'font-size:0.75rem;color:#C9A84C' }, `${typeIcons[props.request.session_type] || '📋'} ${props.request.session_type?.replace('_',' ')} · ₹${props.request.rate_per_minute || props.request.flat_rate}/min`),
        ]),
        h('div', { style:`width:32px;height:32px;border-radius:50%;border:2px solid ${timer.value > 10 ? '#10b981' : '#ef4444'};display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:${timer.value > 10 ? '#10b981' : '#ef4444'};font-family:DM Sans,sans-serif` }, String(timer.value)),
      ]),
      h('div', { style:'display:flex;gap:0.5rem' }, [
        h('button', { onClick:()=>emit('accept'), style:'flex:1;padding:0.55rem;border-radius:10px;border:none;background:#C9A84C;color:#0A0F2C;font-weight:700;font-size:0.82rem;cursor:pointer;font-family:DM Sans,sans-serif' }, '✓ Accept'),
        h('button', { onClick:()=>emit('decline'), style:'flex:1;padding:0.55rem;border-radius:10px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.1);color:#ef4444;font-weight:600;font-size:0.82rem;cursor:pointer;font-family:DM Sans,sans-serif' }, '✗ Decline'),
      ]),
    ])
  }
})

const auth        = useAuthStore()
const lawyerStore = useLawyerStore()
const walletStore = useWalletStore()

const showVerifyBanner = ref(false)
const showRateBanner   = ref(true)

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'
})

const displayName = computed(() => {
  const name = lawyerStore.profile?.full_name || auth.profile?.full_name || 'Lawyer'
  return name.replace(/^Adv\. ?/, '')
})

const initials = computed(() => {
  return (lawyerStore.profile?.full_name || 'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
})

const avatarStyle = computed(() => ({
  background: 'linear-gradient(135deg, #C9A84C, #a8882a)',
}))

const currentStatus = computed(() => lawyerStore.profile?.availability_status || 'offline')
const statusOptions = [
  { value:'online', label:'Online' },
  { value:'busy',   label:'Busy' },
  { value:'offline',label:'Offline' },
]

const todaySessions = computed(() => {
  const today = new Date().toDateString()
  return (lawyerStore.cases?.filter(c => new Date(c.created_at).toDateString() === today) || []).length
})

const quickStats = computed(() => [
  { icon:'⭐', val: lawyerStore.profile?.rating || '–',         label:'Rating' },
  { icon:'📋', val: lawyerStore.profile?.total_cases || 0,      label:'Total Cases' },
  { icon:'📥', val: lawyerStore.pendingRequests.length,          label:'Pending' },
  { icon:'💬', val: lawyerStore.reviews.length,                  label:'Reviews' },
])

// Verification banner logic
const verifyBannerType = computed(() => {
  const vs = lawyerStore.verificationStatus
  if (!vs) return 'info'
  if (vs.status === 'pending')   return 'pending'
  if (vs.ai_decision === 'approved') return 'approved'
  if (vs.ai_decision === 'rejected') return 'rejected'
  return 'info'
})

const verifyBannerMsg = computed(() => {
  const vs = lawyerStore.verificationStatus
  if (!vs) return ''
  if (vs.status === 'pending')       return 'Your profile is under review. This takes up to 12 hours.'
  if (vs.ai_decision === 'approved') return 'Your profile has been verified! You can now receive client requests.'
  if (vs.ai_decision === 'rejected') return vs.ai_reasoning || 'Please review your profile details and resubmit.'
  return vs.ai_reasoning || ''
})

async function setStatus(status) {
  await lawyerStore.setAvailabilityStatus(auth.user.id, status)
}

async function acceptReq(id) {
  await lawyerStore.acceptRequest(id)
}
async function declineReq(id) {
  await lawyerStore.declineRequest(id)
}

function formatNum(n) {
  return Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

function getInitials(name) {
  return (name || 'C').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
}

onMounted(async () => {
  const uid = auth.user?.id
  if (!uid) return
  await lawyerStore.init(uid)
  await walletStore.fetch(uid)
  await lawyerStore.fetchPendingRequests(uid)

  // Check verification status
  const vs = lawyerStore.verificationStatus
  if (vs && vs.status !== 'done') showVerifyBanner.value = true
  if (vs && vs.status === 'done') showVerifyBanner.value = true

  // Check rates on every login
  await lawyerStore.checkRatesOnLoginForLawyer(uid)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lawyer-home {
  min-height: 100vh; background: #0A0F2C;
  font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden;
}
.lh-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.08), transparent 60%);
}
.lh-header {
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.75rem;
  padding: 1.25rem 1.25rem 0.75rem;
}
.lh-greeting { display: flex; align-items: center; gap: 0.75rem; }
.lh-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1rem; color: #0A0F2C;
  box-shadow: 0 0 16px rgba(201,168,76,0.3);
}
.lh-hello { font-size: 0.75rem; color: rgba(240,244,255,0.5); }
.lh-name { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; color: #f0f4ff; }
.lh-status-wrap { display: flex; gap: 0.4rem; }
.status-btn {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.35rem 0.7rem; border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent; color: rgba(240,244,255,0.5);
  font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.status-btn.active { border-color: rgba(201,168,76,0.4); color: #f0f4ff; background: rgba(201,168,76,0.1); }
.status-dot { width: 7px; height: 7px; border-radius: 50%; }
.status-dot.online  { background: #10b981; box-shadow: 0 0 6px #10b981; }
.status-dot.busy    { background: #f59e0b; }
.status-dot.offline { background: #64748b; }

.earnings-card {
  position: relative; margin: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #1a1400 0%, #2a1f00 60%, #1a1400 100%);
  border: 1px solid rgba(201,168,76,0.4);
  border-radius: 18px; padding: 1.25rem; overflow: hidden;
  box-shadow: 0 8px 32px rgba(201,168,76,0.15);
  z-index: 1;
}
.ec-glow {
  position: absolute; top: -40px; right: -40px;
  width: 120px; height: 120px; border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.2), transparent 70%);
  pointer-events: none;
}
.ec-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.ec-label { font-size: 0.72rem; color: rgba(201,168,76,0.6); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.2rem; }
.ec-amount { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #f0d080; }
.ec-locked { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: rgba(201,168,76,0.6); }
.ec-right { text-align: right; }
.ec-stats { display: flex; align-items: center; gap: 0; border-top: 1px solid rgba(201,168,76,0.15); padding-top: 1rem; margin-bottom: 1rem; }
.ec-stat { flex: 1; text-align: center; }
.ec-stat-val { display: block; font-weight: 700; font-size: 0.95rem; color: #f0d080; }
.ec-stat-label { font-size: 0.62rem; color: rgba(201,168,76,0.5); text-transform: uppercase; letter-spacing: 0.06em; }
.ec-stat-div { width: 1px; height: 32px; background: rgba(201,168,76,0.15); }
.ec-withdraw-btn {
  display: block; width: 100%; padding: 0.65rem; border-radius: 10px;
  background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3);
  color: #C9A84C; text-decoration: none; text-align: center;
  font-weight: 700; font-size: 0.85rem; transition: all 0.2s;
}
.ec-withdraw-btn:hover { background: rgba(201,168,76,0.22); }

.quick-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem; margin: 0 1.25rem 0.75rem; z-index: 1; position: relative;
}
.qs-card {
  background: rgba(22,29,63,0.8); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px; padding: 0.75rem 0.5rem; text-align: center;
}
.qs-icon { font-size: 1.2rem; display: block; margin-bottom: 0.3rem; }
.qs-val { display: block; font-weight: 700; font-size: 1rem; color: #f0f4ff; }
.qs-label { font-size: 0.6rem; color: rgba(240,244,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; }

.section { position: relative; z-index: 1; padding: 0.75rem 1.25rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.section-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #f0f4ff; }
.section-see-all { font-size: 0.78rem; color: #C9A84C; text-decoration: none; font-weight: 600; }

.empty-state { text-align: center; padding: 1.5rem; color: rgba(240,244,255,0.4); }
.empty-state span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.empty-state p { font-size: 0.85rem; }

.review-item {
  background: rgba(22,29,63,0.8); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px; padding: 0.875rem; margin-bottom: 0.6rem;
}
.ri-top { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
.ri-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg,#3b82f6,#1d4ed8);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: #fff;
}
.ri-name { font-weight: 600; font-size: 0.82rem; color: #f0f4ff; }
.ri-stars { font-size: 0.72rem; color: #C9A84C; letter-spacing: 0.05em; }
.ri-comment { font-size: 0.78rem; color: rgba(240,244,255,0.6); line-height: 1.5; font-style: italic; }

.quick-actions {
  display: grid; grid-template-columns: repeat(2,1fr);
  gap: 0.75rem; margin: 0 1.25rem; position: relative; z-index: 1;
}
.qa-btn {
  display: flex; align-items: center; gap: 0.6rem;
  background: rgba(22,29,63,0.8); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 1rem 1.25rem; text-decoration: none;
  color: #f0f4ff; font-weight: 600; font-size: 0.88rem;
  transition: all 0.2s;
}
.qa-btn:hover { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.08); }
.qa-btn span { font-size: 1.2rem; }
</style>