<template>
  <div class="page">
    <div class="page-bg"></div>

    <!-- Header -->
    <div class="page-header">
      <router-link to="/" class="back-btn">←</router-link>
      <h1 class="page-title">Moderator Panel</h1>
      <div class="admin-badge">Admin</div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="sb-item" v-for="s in panelStats" :key="s.label">
        <span class="sb-val" :style="{color:s.color}">{{ s.val }}</span>
        <span class="sb-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        v-for="tab in tabs" :key="tab.key"
        :class="['tab-btn', activeTab===tab.key&&'active']"
        @click="activeTab=tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Content -->
    <div class="content">
      <div v-if="loading" class="loading-col">
        <div class="skel" v-for="i in 4" :key="i"></div>
      </div>

      <div v-else-if="filteredDisputes.length===0" class="empty-state">
        <span>✅</span>
        <p>No disputes in this category.</p>
      </div>

      <div v-else class="disputes-list">
        <div class="dispute-card" v-for="d in filteredDisputes" :key="d.id" @click="openDispute(d)">
          <div class="dc-top">
            <div class="dc-tier" :class="'tier-'+d.tier">T{{ d.tier }}</div>
            <div :class="['dc-status',d.status]">{{ statusLabel[d.status]||d.status }}</div>
            <div class="dc-time">{{ timeAgo(d.created_at) }}</div>
          </div>
          <div class="dc-ref">#{{ d.id?.slice(0,8).toUpperCase() }}</div>
          <div class="dc-reason">{{ reasonLabels[d.reason]||d.reason }}</div>
          <div class="dc-meta">
            <span>Filed by: {{ d.profiles?.full_name || 'Client' }}</span>
            <span>₹{{ fmt(d.amount_disputed) }}</span>
            <span>{{ d.sessions?.session_type }}</span>
          </div>
          <div v-if="d.ai_decision" class="dc-ai">
            <span>🤖</span>
            <span :class="['ai-v',d.ai_decision]">{{ verdictLabel[d.ai_decision] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Panel -->
    <div v-if="selected" class="modal-overlay" @click.self="selected=null">
      <div class="detail-modal">
        <div class="dm-header">
          <div>
            <div class="dm-ref">#{{ selected.id?.slice(0,8).toUpperCase() }}</div>
            <h2 class="dm-title">{{ reasonLabels[selected.reason]||selected.reason }}</h2>
          </div>
          <button class="dm-close" @click="selected=null">✕</button>
        </div>

        <div class="detail-chips">
          <span :class="['chip','tier-'+selected.tier]">Tier {{ selected.tier }}</span>
          <span :class="['chip-status',selected.status]">{{ statusLabel[selected.status] }}</span>
          <span class="chip-amount">₹{{ fmt(selected.amount_disputed) }}</span>
        </div>

        <div class="detail-section">
          <div class="ds-label">Parties</div>
          <div class="ds-row">
            <span class="ds-key">Filed By</span>
            <span class="ds-val">{{ selected.profiles?.full_name || selected.filed_by?.slice(0,8) }}</span>
          </div>
          <div class="ds-row">
            <span class="ds-key">Against</span>
            <span class="ds-val">{{ selected.against?.slice(0,8) }}...</span>
          </div>
          <div class="ds-row">
            <span class="ds-key">Session Type</span>
            <span class="ds-val">{{ selected.sessions?.session_type }}</span>
          </div>
          <div class="ds-row">
            <span class="ds-key">Session Amount</span>
            <span class="ds-val gold">₹{{ fmt(selected.sessions?.total_amount) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <div class="ds-label">Client's Claim</div>
          <p class="ds-text">{{ selected.description }}</p>
        </div>

        <!-- AI Judgment -->
        <div v-if="selected.ai_decision" class="ai-section">
          <div class="ai-header">
            <span>🤖</span>
            <div class="ai-header-text">
              <div class="ai-title">AI Judgment</div>
              <div :class="['ai-verdict',selected.ai_decision]">{{ verdictLabel[selected.ai_decision] }}</div>
            </div>
          </div>
          <p class="ai-reasoning">{{ selected.ai_reasoning }}</p>
          <div v-if="selected.final_decision" class="ai-final">{{ selected.final_decision }}</div>
        </div>

        <!-- Moderator Override -->
        <div v-if="selected.status !== 'closed'" class="override-section">
          <div class="os-title">Moderator Decision Override</div>
          <div class="override-btns">
            <button class="ov-btn refund" @click="moderatorDecide(selected.id,'full_refund')" :disabled="deciding">
              Full Refund
            </button>
            <button class="ov-btn partial" @click="moderatorDecide(selected.id,'partial_refund')" :disabled="deciding">
              50% Refund
            </button>
            <button class="ov-btn no-refund" @click="moderatorDecide(selected.id,'no_refund')" :disabled="deciding">
              No Refund
            </button>
            <button class="ov-btn close" @click="moderatorDecide(selected.id,'close')" :disabled="deciding">
              Close
            </button>
          </div>
          <div v-if="overrideMsg" class="override-msg">{{ overrideMsg }}</div>
        </div>

        <div v-else class="closed-badge">Dispute Closed</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDisputeStore } from '@/stores/dispute'
import { supabase } from '@/lib/supabase'

const disputeStore = useDisputeStore()
const allDisputes = ref([])
const loading = ref(true)
const selected = ref(null)
const deciding = ref(false)
const overrideMsg = ref('')
const activeTab = ref('all')

const statusLabel = { filed:'Filed', under_review:'Under Review', decided:'Decided', closed:'Closed', escalated:'Escalated' }
const verdictLabel = { full_refund:'Full Refund', partial_refund:'Partial Refund', no_refund:'No Refund', in_favor_of_lawyer:'Lawyer Wins', in_favor_of_client:'Client Wins' }
const reasonLabels = { no_service:"Lawyer didn't respond", poor_quality:'Poor quality', wrong_advice:'Wrong advice', technical_issue:'Technical issue', overcharged:'Overcharged', other:'Other' }

const tabs = computed(()=>[
  { key:'all', label:'All', count: allDisputes.value.length },
  { key:'pending', label:'Pending', count: allDisputes.value.filter(d=>d.status==='filed'||d.status==='under_review').length },
  { key:'tier3', label:'Tier 3', count: allDisputes.value.filter(d=>d.tier===3).length },
  { key:'decided', label:'Decided', count: allDisputes.value.filter(d=>d.status==='decided').length },
])

const filteredDisputes = computed(()=>{
  if (activeTab.value==='all') return allDisputes.value
  if (activeTab.value==='pending') return allDisputes.value.filter(d=>d.status==='filed'||d.status==='under_review')
  if (activeTab.value==='tier3') return allDisputes.value.filter(d=>d.tier===3)
  if (activeTab.value==='decided') return allDisputes.value.filter(d=>d.status==='decided')
  return allDisputes.value
})

const panelStats = computed(()=>[
  { val: allDisputes.value.length, label:'Total', color:'#f0f4ff' },
  { val: allDisputes.value.filter(d=>d.status==='filed'||d.status==='under_review').length, label:'Pending', color:'#C9A84C' },
  { val: allDisputes.value.filter(d=>d.tier===3).length, label:'Tier 3', color:'#f87171' },
  { val: allDisputes.value.filter(d=>d.status==='decided').length, label:'Decided', color:'#10b981' },
])

function fmt(n){return Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0})}
function timeAgo(d){if(!d)return '';const diff=Date.now()-new Date(d).getTime();const h=Math.floor(diff/3600000);if(h<1)return 'Just now';if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago'}
function openDispute(d){selected.value=d;overrideMsg.value=''}

async function moderatorDecide(disputeId, verdict) {
  deciding.value = true
  overrideMsg.value = ''

  const updates = {
    status: verdict === 'close' ? 'closed' : 'decided',
    final_decision: verdict === 'close' ? 'Closed by moderator' : `Moderator decision: ${verdictLabel[verdict] || verdict}`,
    decided_at: new Date().toISOString(),
  }
  if (verdict !== 'close') updates.ai_decision = verdict

  const { error } = await supabase.from('disputes').update(updates).eq('id', disputeId)

  if (!error) {
    overrideMsg.value = '✅ Decision applied successfully.'
    // Update local
    const idx = allDisputes.value.findIndex(d=>d.id===disputeId)
    if (idx !== -1) Object.assign(allDisputes.value[idx], updates)
    if (selected.value?.id === disputeId) Object.assign(selected.value, updates)
  } else {
    overrideMsg.value = '❌ Failed: ' + error.message
  }
  deciding.value = false
}

onMounted(async () => {
  allDisputes.value = await disputeStore.getAllDisputes()
  loading.value = false
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;padding-bottom:2rem}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(239,68,68,0.05),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:0.75rem;padding:1.25rem}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.25rem;font-weight:700;padding:0.25rem}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:#f0f4ff;flex:1}
.admin-badge{background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#f87171;padding:0.25rem 0.7rem;border-radius:100px;font-size:0.72rem;font-weight:800}
.stats-bar{position:relative;z-index:1;display:flex;align-items:center;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;margin:0 1.25rem 1rem;padding:0.875rem}
.sb-item{flex:1;text-align:center}
.sb-val{display:block;font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700}
.sb-label{font-size:0.6rem;color:rgba(240,244,255,0.35);text-transform:uppercase;letter-spacing:0.06em}
.filter-tabs{position:relative;z-index:1;display:flex;gap:0.4rem;padding:0 1.25rem;margin-bottom:1rem;overflow-x:auto}
.filter-tabs::-webkit-scrollbar{display:none}
.tab-btn{background:rgba(22,29,63,0.6);border:1px solid rgba(255,255,255,0.08);color:rgba(240,244,255,0.5);padding:0.4rem 0.875rem;border-radius:100px;font-size:0.78rem;font-family:'DM Sans',sans-serif;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:0.35rem}
.tab-btn.active{background:rgba(201,168,76,0.12);border-color:rgba(201,168,76,0.3);color:#C9A84C}
.tab-count{background:rgba(255,255,255,0.1);border-radius:100px;padding:0.05rem 0.4rem;font-size:0.68rem}
.tab-btn.active .tab-count{background:rgba(201,168,76,0.2)}
.content{position:relative;z-index:1;padding:0 1.25rem}
.loading-col{display:flex;flex-direction:column;gap:0.6rem}
.skel{height:100px;border-radius:14px;background:rgba(255,255,255,0.04);animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
.empty-state{text-align:center;padding:2.5rem;background:rgba(22,29,63,0.6);border-radius:12px}
.empty-state span{font-size:2rem;display:block;margin-bottom:0.5rem}
.empty-state p{font-size:0.83rem;color:rgba(240,244,255,0.4)}
.disputes-list{display:flex;flex-direction:column;gap:0.6rem}
.dispute-card{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:0.875rem;cursor:pointer;transition:border-color 0.2s}
.dispute-card:hover{border-color:rgba(201,168,76,0.2)}
.dc-top{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem}
.dc-tier{font-size:0.68rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px}
.tier-1{background:rgba(16,185,129,0.12);color:#10b981}
.tier-2{background:rgba(201,168,76,0.12);color:#C9A84C}
.tier-3{background:rgba(239,68,68,0.12);color:#f87171}
.dc-status{font-size:0.68rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:100px}
.dc-status.filed{background:rgba(148,163,184,0.1);color:#94a3b8}
.dc-status.under_review{background:rgba(201,168,76,0.1);color:#C9A84C}
.dc-status.decided{background:rgba(16,185,129,0.1);color:#10b981}
.dc-time{margin-left:auto;font-size:0.68rem;color:rgba(240,244,255,0.3)}
.dc-ref{font-size:0.68rem;color:rgba(240,244,255,0.28);font-family:monospace;margin-bottom:0.25rem}
.dc-reason{font-weight:700;font-size:0.87rem;color:#f0f4ff;margin-bottom:0.4rem}
.dc-meta{display:flex;gap:0.875rem;font-size:0.7rem;color:rgba(240,244,255,0.4);margin-bottom:0.4rem;flex-wrap:wrap}
.dc-ai{display:flex;align-items:center;gap:0.4rem;font-size:0.75rem}
.ai-v{font-weight:700}
.ai-v.full_refund,.ai-v.in_favor_of_client{color:#10b981}
.ai-v.no_refund,.ai-v.in_favor_of_lawyer{color:#f87171}
.ai-v.partial_refund{color:#C9A84C}
/* Modal */
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.75);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)}
.detail-modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem 1.25rem 2rem;width:100%;max-width:480px;max-height:88vh;overflow-y:auto}
.dm-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem}
.dm-ref{font-size:0.68rem;color:rgba(240,244,255,0.3);font-family:monospace;margin-bottom:0.2rem}
.dm-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:#f0f4ff}
.dm-close{background:none;border:none;color:rgba(240,244,255,0.4);font-size:1.1rem;cursor:pointer}
.detail-chips{display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem}
.chip{font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:6px}
.chip.tier-1{background:rgba(16,185,129,0.12);color:#10b981}
.chip.tier-2{background:rgba(201,168,76,0.12);color:#C9A84C}
.chip.tier-3{background:rgba(239,68,68,0.12);color:#f87171}
.chip-status{font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:100px;background:rgba(201,168,76,0.1);color:#C9A84C}
.chip-amount{font-size:0.78rem;font-weight:700;color:#C9A84C}
.detail-section{margin-bottom:1rem}
.ds-label{font-size:0.68rem;font-weight:700;color:rgba(240,244,255,0.38);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem}
.ds-row{display:flex;justify-content:space-between;align-items:center;padding:0.45rem 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.82rem}
.ds-key{color:rgba(240,244,255,0.45)}
.ds-val{color:#f0f4ff;font-weight:600}
.gold{color:#C9A84C!important}
.ds-text{font-size:0.83rem;color:rgba(240,244,255,0.65);line-height:1.6}
.ai-section{background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.15);border-radius:14px;padding:1rem;margin-bottom:1rem}
.ai-header{display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.75rem;font-size:1.3rem}
.ai-title{font-size:0.7rem;font-weight:700;color:rgba(240,244,255,0.4);text-transform:uppercase;letter-spacing:0.06em}
.ai-verdict{font-weight:800;font-size:0.92rem;margin-top:0.15rem}
.ai-verdict.full_refund,.ai-verdict.in_favor_of_client{color:#10b981}
.ai-verdict.no_refund,.ai-verdict.in_favor_of_lawyer{color:#f87171}
.ai-verdict.partial_refund{color:#C9A84C}
.ai-reasoning{font-size:0.82rem;color:rgba(240,244,255,0.6);line-height:1.6;margin-bottom:0.5rem}
.ai-final{font-size:0.8rem;color:#f0f4ff;background:rgba(255,255,255,0.04);border-radius:8px;padding:0.5rem}
.override-section{border:1px solid rgba(239,68,68,0.15);border-radius:14px;padding:1rem}
.os-title{font-size:0.78rem;font-weight:700;color:rgba(240,244,255,0.5);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.75rem}
.override-btns{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem}
.ov-btn{border:none;border-radius:10px;padding:0.7rem;font-size:0.83rem;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:opacity 0.2s}
.ov-btn:disabled{opacity:0.5}
.ov-btn.refund{background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.25)}
.ov-btn.partial{background:rgba(201,168,76,0.12);color:#C9A84C;border:1px solid rgba(201,168,76,0.2)}
.ov-btn.no-refund{background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2)}
.ov-btn.close{background:rgba(255,255,255,0.05);color:rgba(240,244,255,0.5);border:1px solid rgba(255,255,255,0.1)}
.override-msg{font-size:0.82rem;text-align:center;padding:0.5rem;border-radius:8px;background:rgba(255,255,255,0.04);color:rgba(240,244,255,0.7)}
.closed-badge{text-align:center;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:#10b981;padding:0.75rem;border-radius:10px;font-weight:700;font-size:0.88rem}
</style>
