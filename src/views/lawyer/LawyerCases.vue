<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/lawyer" class="back-btn">←</router-link>
      <h1 class="page-title">Court Cases</h1>
    </div>

    <div class="cases-content">
      <div class="info-card">
        <span>🏛️</span>
        <p>These are long-term court representation cases. Vakilr charges a one-time placement fee — after that, you deal directly with the client.</p>
      </div>

      <div v-if="lawyerStore.cases.length === 0" class="empty-state">
        <span>⚖️</span>
        <h3>No Court Cases Yet</h3>
        <p>When clients book you for court representation, cases appear here.</p>
      </div>

      <div class="case-card" v-for="c in lawyerStore.cases" :key="c.id">
        <div class="cc-header">
          <div class="cc-avatar">{{ getInitials(c.profiles?.full_name) }}</div>
          <div class="cc-info">
            <div class="cc-client">{{ c.profiles?.full_name || 'Client' }}</div>
            <div class="cc-date">Started {{ formatDate(c.created_at) }}</div>
          </div>
          <span :class="['cc-status', c.status]">{{ c.status }}</span>
        </div>
        <p class="cc-desc">{{ c.case_description || 'No description provided' }}</p>
        <div class="cc-fee-row">
          <div class="cc-fee">
            <span class="cc-fee-label">Placement Fee Paid</span>
            <span class="cc-fee-val">₹{{ c.placement_fee || '—' }}</span>
          </div>
          <div class="cc-fee">
            <span class="cc-fee-label">Avg Fee Per Hearing</span>
            <span class="cc-fee-val">₹{{ c.average_fee_per_hearing || '—' }}</span>
          </div>
        </div>
        <p class="cc-note">⚠️ Price can bargain per hearing. Can increase or decrease based on case complexity.</p>
      </div>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLawyerStore } from '@/stores/lawyer'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'

const auth = useAuthStore()
const lawyerStore = useLawyerStore()

function getInitials(name) { return (name||'C').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
function formatDate(ts) { return new Date(ts).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) }

onMounted(async () => { await lawyerStore.fetchCases(auth.user.id) })
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.cases-content{position:relative;z-index:1;padding:1.25rem}
.info-card{display:flex;align-items:flex-start;gap:0.75rem;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.18);border-radius:12px;padding:0.875rem;margin-bottom:1.25rem}
.info-card span{font-size:1.2rem;flex-shrink:0}
.info-card p{font-size:0.8rem;color:rgba(240,244,255,0.65);line-height:1.6}
.empty-state{text-align:center;padding:3rem 1rem}
.empty-state span{font-size:3rem;display:block;margin-bottom:0.75rem}
.empty-state h3{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.empty-state p{font-size:0.85rem;color:rgba(240,244,255,0.5);line-height:1.6}
.case-card{background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:1.25rem;margin-bottom:1rem}
.cc-header{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.875rem}
.cc-avatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6d28d9);display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#fff;flex-shrink:0}
.cc-info{flex:1}
.cc-client{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.cc-date{font-size:0.72rem;color:rgba(240,244,255,0.4);margin-top:0.1rem}
.cc-status{padding:0.22rem 0.65rem;border-radius:100px;font-size:0.7rem;font-weight:700;text-transform:capitalize}
.cc-status.active{background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3)}
.cc-status.completed{background:rgba(100,116,139,0.15);color:#64748b;border:1px solid rgba(100,116,139,0.3)}
.cc-desc{font-size:0.83rem;color:rgba(240,244,255,0.65);line-height:1.6;margin-bottom:0.875rem}
.cc-fee-row{display:flex;gap:1rem;background:rgba(10,15,44,0.5);border-radius:10px;padding:0.75rem;margin-bottom:0.5rem}
.cc-fee{flex:1}
.cc-fee-label{display:block;font-size:0.68rem;color:#C9A84C;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.2rem}
.cc-fee-val{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0d080}
.cc-note{font-size:0.72rem;color:rgba(240,244,255,0.35);line-height:1.5;font-style:italic}
</style>