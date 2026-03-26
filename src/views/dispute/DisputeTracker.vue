<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="page-title">My Disputes</h1>
    </div>

    <div class="content">
      <!-- Loading -->
      <div v-if="loading" class="loading-col">
        <div class="skel" v-for="i in 3" :key="i"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="disputes.length === 0" class="empty-state">
        <span>⚖️</span>
        <h3>No Disputes</h3>
        <p>You haven't filed any disputes yet. Sessions gone wrong? File a dispute from your session history.</p>
        <router-link to="/client/sessions" class="go-btn">View Sessions</router-link>
      </div>

      <!-- Dispute List -->
      <div v-else class="disputes-list">
        <div
          class="dispute-card"
          v-for="d in disputes"
          :key="d.id"
          @click="openDispute(d)"
          :class="d.status"
        >
          <div class="dc-top">
            <div class="dc-tier-badge" :class="'tier-'+d.tier">Tier {{ d.tier }}</div>
            <div :class="['dc-status', d.status]">{{ statusLabel[d.status] || d.status }}</div>
          </div>

          <div class="dc-ref">Ref: #{{ d.id?.slice(0,8).toUpperCase() }}</div>
          <div class="dc-reason">{{ reasonLabels[d.reason] || d.reason }}</div>

          <div class="dc-meta">
            <span>{{ d.sessions?.session_type || 'Session' }}</span>
            <span>₹{{ fmt(d.amount_disputed) }}</span>
            <span>{{ formatDate(d.created_at) }}</span>
          </div>

          <!-- AI Decision Preview -->
          <div v-if="d.ai_decision" class="dc-ai-preview">
            <span class="ai-label">🤖 AI Decision:</span>
            <span :class="['ai-verdict', d.ai_decision]">{{ verdictLabel[d.ai_decision] || d.ai_decision }}</span>
          </div>

          <!-- Timeline -->
          <div class="dc-timeline">
            <div :class="['tl-step', d.status !== 'filed' ? 'done' : 'active']">
              <div class="tl-dot"></div>
              <span>Filed</span>
            </div>
            <div class="tl-line"></div>
            <div :class="['tl-step', d.status === 'under_review' || d.status === 'decided' ? (d.status === 'decided' ? 'done' : 'active') : '']">
              <div class="tl-dot"></div>
              <span>Review</span>
            </div>
            <div class="tl-line"></div>
            <div :class="['tl-step', d.status === 'decided' ? 'done' : '']">
              <div class="tl-dot"></div>
              <span>Decided</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="selected" class="modal-overlay" @click.self="selected=null">
        <div class="detail-modal">
          <div class="dm-header">
            <h2 class="dm-title">Dispute Details</h2>
            <button class="dm-close" @click="selected=null">✕</button>
          </div>

          <div class="dm-ref">Ref: #{{ selected.id?.slice(0,8).toUpperCase() }}</div>

          <div class="dm-row">
            <span>Status</span>
            <span :class="['dm-status', selected.status]">{{ statusLabel[selected.status] }}</span>
          </div>
          <div class="dm-row">
            <span>Tier</span>
            <span>Tier {{ selected.tier }} — {{ tierDesc[selected.tier] }}</span>
          </div>
          <div class="dm-row">
            <span>Reason</span>
            <span>{{ reasonLabels[selected.reason] || selected.reason }}</span>
          </div>
          <div class="dm-row">
            <span>Amount</span>
            <span class="gold">₹{{ fmt(selected.amount_disputed) }}</span>
          </div>
          <div class="dm-row">
            <span>Filed</span>
            <span>{{ formatDate(selected.created_at) }}</span>
          </div>

          <div class="dm-desc">
            <div class="dm-desc-label">Your Description</div>
            <p>{{ selected.description }}</p>
          </div>

          <!-- AI Judgment -->
          <div v-if="selected.ai_decision" class="ai-judgment">
            <div class="aj-header">
              <span class="aj-icon">🤖</span>
              <div>
                <div class="aj-title">AI Judgment</div>
                <div :class="['aj-verdict', selected.ai_decision]">{{ verdictLabel[selected.ai_decision] }}</div>
              </div>
            </div>
            <p class="aj-reasoning">{{ selected.ai_reasoning }}</p>
            <div v-if="selected.final_decision" class="aj-final">
              <strong>Final Decision:</strong> {{ selected.final_decision }}
            </div>
            <div v-if="selected.decided_at" class="aj-date">Decided {{ formatDate(selected.decided_at) }}</div>
          </div>

          <!-- Pending -->
          <div v-else-if="selected.status !== 'decided'" class="pending-banner">
            <div class="pb-spinner"></div>
            <div>
              <div class="pb-title">Under Review</div>
              <div class="pb-sub">AI will analyze and decide within 12 hours. You'll be notified.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ClientBottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDisputeStore } from '@/stores/dispute'
import ClientBottomNav from '@/components/ClientBottomNav.vue'

const auth = useAuthStore()
const disputeStore = useDisputeStore()
const loading = ref(true)
const disputes = ref([])
const selected = ref(null)

const statusLabel = {
  filed: 'Filed',
  under_review: 'Under Review',
  decided: 'Decided',
  closed: 'Closed',
  escalated: 'Escalated',
}

const verdictLabel = {
  full_refund: 'Full Refund',
  partial_refund: 'Partial Refund',
  no_refund: 'No Refund',
  in_favor_of_lawyer: 'Lawyer Wins',
  in_favor_of_client: 'Client Wins',
}

const reasonLabels = {
  no_service: "Lawyer didn't respond",
  poor_quality: 'Poor quality service',
  wrong_advice: 'Wrong / misleading info',
  technical_issue: 'Technical issues',
  overcharged: 'Overcharged',
  other: 'Other',
}

const tierDesc = {
  1: 'AI auto-decides (< ₹2,000)',
  2: 'AI-assisted (₹2,000–₹25,000)',
  3: 'Senior moderator (> ₹25,000)',
}

function fmt(n){return Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0})}
function formatDate(d){if(!d)return '';return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}

function openDispute(d) { selected.value = d }

onMounted(async () => {
  await disputeStore.fetchMyDisputes(auth.user?.id)
  disputes.value = disputeStore.disputes
  loading.value = false
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:0.75rem;padding:1.25rem 1.25rem 0.75rem}
.back-btn{background:none;border:none;color:#C9A84C;font-size:1.25rem;font-weight:700;cursor:pointer;padding:0.25rem}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:#f0f4ff}
.content{position:relative;z-index:1;padding:0 1.25rem;padding-bottom:80px}
.loading-col{display:flex;flex-direction:column;gap:0.75rem}
.skel{height:130px;border-radius:16px;background:rgba(255,255,255,0.04);animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
.empty-state{text-align:center;padding:3rem 1rem}
.empty-state span{font-size:3rem;display:block;margin-bottom:0.75rem}
.empty-state h3{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.empty-state p{font-size:0.83rem;color:rgba(240,244,255,0.45);margin-bottom:1.5rem;line-height:1.6}
.go-btn{display:inline-block;background:#C9A84C;color:#0A0F2C;border-radius:12px;padding:0.75rem 1.5rem;text-decoration:none;font-weight:800;font-size:0.88rem}
.disputes-list{display:flex;flex-direction:column;gap:0.75rem}
.dispute-card{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1rem;cursor:pointer;transition:border-color 0.2s}
.dispute-card:hover{border-color:rgba(201,168,76,0.2)}
.dispute-card.decided{border-color:rgba(16,185,129,0.15)}
.dc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem}
.dc-tier-badge{font-size:0.68rem;font-weight:800;padding:0.2rem 0.6rem;border-radius:100px;letter-spacing:0.04em}
.tier-1{background:rgba(16,185,129,0.12);color:#10b981}
.tier-2{background:rgba(201,168,76,0.12);color:#C9A84C}
.tier-3{background:rgba(239,68,68,0.1);color:#f87171}
.dc-status{font-size:0.7rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:100px}
.dc-status.filed{background:rgba(148,163,184,0.1);color:#94a3b8}
.dc-status.under_review{background:rgba(201,168,76,0.12);color:#C9A84C}
.dc-status.decided{background:rgba(16,185,129,0.12);color:#10b981}
.dc-ref{font-size:0.68rem;color:rgba(240,244,255,0.3);margin-bottom:0.3rem;font-family:monospace}
.dc-reason{font-weight:700;font-size:0.9rem;color:#f0f4ff;margin-bottom:0.5rem}
.dc-meta{display:flex;gap:0.875rem;font-size:0.73rem;color:rgba(240,244,255,0.4);margin-bottom:0.75rem}
.dc-ai-preview{display:flex;align-items:center;gap:0.5rem;background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.15);border-radius:8px;padding:0.4rem 0.6rem;margin-bottom:0.75rem;font-size:0.75rem}
.ai-label{color:rgba(240,244,255,0.5)}
.ai-verdict{font-weight:700}
.ai-verdict.full_refund,.ai-verdict.in_favor_of_client{color:#10b981}
.ai-verdict.no_refund,.ai-verdict.in_favor_of_lawyer{color:#f87171}
.ai-verdict.partial_refund{color:#C9A84C}
/* Timeline */
.dc-timeline{display:flex;align-items:center;margin-top:0.25rem}
.tl-step{display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0}
.tl-step span{font-size:0.6rem;color:rgba(240,244,255,0.3);white-space:nowrap}
.tl-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.15)}
.tl-step.active .tl-dot{background:#C9A84C;border-color:#C9A84C;box-shadow:0 0 6px rgba(201,168,76,0.4)}
.tl-step.active span{color:#C9A84C}
.tl-step.done .tl-dot{background:#10b981;border-color:#10b981}
.tl-step.done span{color:#10b981}
.tl-line{flex:1;height:2px;background:rgba(255,255,255,0.08)}
/* Modal */
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)}
.detail-modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem 1.25rem 2rem;width:100%;max-width:480px;max-height:85vh;overflow-y:auto}
.dm-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem}
.dm-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#f0f4ff}
.dm-close{background:none;border:none;color:rgba(240,244,255,0.4);font-size:1.1rem;cursor:pointer}
.dm-ref{font-size:0.7rem;color:rgba(240,244,255,0.3);font-family:monospace;margin-bottom:1rem}
.dm-row{display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.83rem}
.dm-row span:first-child{color:rgba(240,244,255,0.45)}
.dm-row span:last-child{color:#f0f4ff;font-weight:600}
.dm-status{font-weight:700;padding:0.2rem 0.6rem;border-radius:100px;font-size:0.75rem!important}
.dm-status.filed{background:rgba(148,163,184,0.1);color:#94a3b8}
.dm-status.under_review{background:rgba(201,168,76,0.12);color:#C9A84C}
.dm-status.decided{background:rgba(16,185,129,0.12);color:#10b981}
.gold{color:#C9A84C!important}
.dm-desc{margin-top:1rem;margin-bottom:1rem}
.dm-desc-label{font-size:0.72rem;font-weight:700;color:rgba(240,244,255,0.45);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem}
.dm-desc p{font-size:0.85rem;color:rgba(240,244,255,0.7);line-height:1.6}
.ai-judgment{background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.15);border-radius:14px;padding:1rem;margin-top:1rem}
.aj-header{display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.75rem}
.aj-icon{font-size:1.5rem;flex-shrink:0}
.aj-title{font-size:0.72rem;font-weight:700;color:rgba(240,244,255,0.45);text-transform:uppercase;letter-spacing:0.06em}
.aj-verdict{font-weight:800;font-size:0.95rem;margin-top:0.15rem}
.aj-verdict.full_refund,.aj-verdict.in_favor_of_client{color:#10b981}
.aj-verdict.no_refund,.aj-verdict.in_favor_of_lawyer{color:#f87171}
.aj-verdict.partial_refund{color:#C9A84C}
.aj-reasoning{font-size:0.83rem;color:rgba(240,244,255,0.6);line-height:1.6;margin-bottom:0.75rem}
.aj-final{font-size:0.82rem;color:#f0f4ff;background:rgba(255,255,255,0.04);border-radius:8px;padding:0.6rem;margin-bottom:0.5rem}
.aj-date{font-size:0.7rem;color:rgba(240,244,255,0.3)}
.pending-banner{display:flex;align-items:center;gap:0.875rem;background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.15);border-radius:14px;padding:1rem;margin-top:1rem}
.pb-spinner{width:28px;height:28px;border:3px solid rgba(201,168,76,0.2);border-top-color:#C9A84C;border-radius:50%;animation:spin 1s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.pb-title{font-weight:700;font-size:0.88rem;color:#C9A84C;margin-bottom:0.2rem}
.pb-sub{font-size:0.78rem;color:rgba(240,244,255,0.45);line-height:1.5}
</style>
