<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/firm" class="back-btn">←</router-link>
      <h1 class="page-title">Dashboard</h1>
      <div class="header-period">
        <button :class="['period-btn', period==='week'&&'active']" @click="period='week'">Week</button>
        <button :class="['period-btn', period==='month'&&'active']" @click="period='month'">Month</button>
      </div>
    </div>

    <div class="dash-content">
      <!-- Revenue Card -->
      <div class="revenue-card">
        <div class="rc-glow"></div>
        <div class="rc-top">
          <div>
            <p class="rc-label">Total Revenue</p>
            <p class="rc-amount">₹{{ fmt(stats.totalRevenue) }}</p>
          </div>
          <div class="rc-change positive">↑ {{ stats.revenueGrowth }}%</div>
        </div>
        <div class="rc-bar-row">
          <div class="rc-bar" v-for="(b,i) in barData" :key="i">
            <div class="rc-bar-fill" :style="{height: (b/maxBar*100)+'%', opacity: i===barData.length-1?1:0.5}"></div>
          </div>
        </div>
        <div class="rc-sub-row">
          <div class="rc-sub-item">
            <span class="rs-val">₹{{ fmt(stats.platformFees) }}</span>
            <span class="rs-label">Platform Fees</span>
          </div>
          <div class="rs-div"></div>
          <div class="rc-sub-item">
            <span class="rs-val">₹{{ fmt(stats.netEarnings) }}</span>
            <span class="rs-label">Net Earnings</span>
          </div>
          <div class="rs-div"></div>
          <div class="rc-sub-item">
            <span class="rs-val">{{ stats.totalSessions }}</span>
            <span class="rs-label">Sessions</span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in quickStats" :key="s.label">
          <span class="sc-icon">{{ s.icon }}</span>
          <span class="sc-val">{{ s.val }}</span>
          <span class="sc-label">{{ s.label }}</span>
        </div>
      </div>

      <!-- Top Performers -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Top Performers</h2>
          <span class="section-sub">{{ period==='week'?'This week':'This month' }}</span>
        </div>
        <div v-if="loading" class="loading-row">
          <div class="skel" v-for="i in 3" :key="i"></div>
        </div>
        <div v-else-if="teamLawyers.length===0" class="empty-state">
          <span>👥</span><p>No lawyers added yet.</p>
        </div>
        <div v-else class="lawyers-list">
          <div class="lawyer-row" v-for="(l,idx) in sortedLawyers" :key="l.id">
            <div class="lr-rank" :class="'rank-'+idx">{{ idx+1 }}</div>
            <div class="lr-av" :style="{background:getColor(l.profiles?.full_name)}">
              {{ getInitials(l.profiles?.full_name) }}
              <div class="lr-status" :class="l.availability_status"></div>
            </div>
            <div class="lr-info">
              <div class="lr-name">{{ l.profiles?.full_name||'Lawyer' }}</div>
              <div class="lr-spec">{{ l.specializations?.[0]||'General' }}</div>
            </div>
            <div class="lr-metrics">
              <span class="lm-cases">{{ l.total_cases||0 }} cases</span>
              <span class="lm-rating">⭐ {{ l.rating||'—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Breakdown -->
      <div class="section">
        <h2 class="section-title" style="margin-bottom:0.875rem">Session Types</h2>
        <div class="breakdown-list">
          <div class="breakdown-row" v-for="t in sessionTypes" :key="t.type">
            <div class="br-left">
              <span class="br-icon">{{ t.icon }}</span>
              <span class="br-label">{{ t.label }}</span>
            </div>
            <div class="br-bar-wrap">
              <div class="br-bar-fill" :style="{width:t.pct+'%'}"></div>
            </div>
            <span class="br-count">{{ t.count }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Sessions -->
      <div class="section">
        <h2 class="section-title" style="margin-bottom:0.875rem">Recent Sessions</h2>
        <div v-if="recentSessions.length===0" class="empty-state">
          <span>📋</span><p>No sessions yet.</p>
        </div>
        <div v-else class="sessions-list">
          <div class="session-row" v-for="s in recentSessions" :key="s.id">
            <div class="sr-type">{{ typeIcon(s.session_type) }}</div>
            <div class="sr-info">
              <div class="sr-client">{{ s.profiles?.full_name||'Client' }}</div>
              <div class="sr-date">{{ formatDate(s.created_at) }}</div>
            </div>
            <div class="sr-right">
              <span :class="['sr-status',s.status]">{{ s.status }}</span>
              <span class="sr-amount">₹{{ fmt(s.total_amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="height:80px"></div>
    </div>
    <FirmBottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth = useAuthStore()
const period = ref('week')
const loading = ref(true)
const teamLawyers = ref([])
const recentSessions = ref([])

const stats = ref({ totalRevenue:0, revenueGrowth:0, platformFees:0, netEarnings:0, totalSessions:0 })
const barData = ref([18,32,24,41,38,52,60])
const maxBar = computed(()=>Math.max(...barData.value))

const quickStats = computed(()=>[
  { icon:'👥', val:teamLawyers.value.length, label:'Lawyers' },
  { icon:'⚖️', val:teamLawyers.value.reduce((s,l)=>s+(l.total_cases||0),0), label:'Cases' },
  { icon:'⭐', val:(()=>{const r=teamLawyers.value.filter(l=>l.rating);return r.length?(r.reduce((s,l)=>s+l.rating,0)/r.length).toFixed(1)+'★':'—'})(), label:'Avg Rating' },
  { icon:'🟢', val:teamLawyers.value.filter(l=>l.availability_status==='online').length, label:'Online' },
])

const sortedLawyers = computed(()=>[...teamLawyers.value].sort((a,b)=>(b.total_cases||0)-(a.total_cases||0)).slice(0,5))

const sessionTypes = computed(()=>{
  const total=recentSessions.value.length||1
  const c={chat:0,call:0,video:0,document:0}
  recentSessions.value.forEach(s=>{if(c[s.session_type]!==undefined)c[s.session_type]++})
  return [
    {type:'chat',icon:'💬',label:'Chat',count:c.chat,pct:Math.round(c.chat/total*100)},
    {type:'call',icon:'📞',label:'Voice Call',count:c.call,pct:Math.round(c.call/total*100)},
    {type:'video',icon:'📹',label:'Video',count:c.video,pct:Math.round(c.video/total*100)},
    {type:'document',icon:'📄',label:'Document',count:c.document,pct:Math.round(c.document/total*100)},
  ]
})

const colors=['#C9A84C','#3b82f6','#10b981','#f59e0b','#8b5cf6']
function getColor(n){let h=0;for(const c of(n||''))h=(h*31+c.charCodeAt(0))%colors.length;return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`}
function getInitials(n){return(n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
function fmt(n){return Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0})}
function formatDate(d){if(!d)return '';return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
function typeIcon(t){return{chat:'💬',call:'📞',video:'📹',document:'📄',court:'⚖️'}[t]||'📋'}

onMounted(async()=>{
  const uid=auth.user?.id
  if(!uid)return
  const {data:team}=await supabase.from('lawyer_profiles').select('*,profiles(full_name,avatar_url)').eq('firm_id',uid)
  teamLawyers.value=team||[]
  const ids=teamLawyers.value.map(l=>l.id)
  if(ids.length){
    const {data:sessions}=await supabase.from('sessions').select('*,profiles:client_id(full_name)').in('lawyer_id',ids).order('created_at',{ascending:false}).limit(20)
    recentSessions.value=sessions||[]
    const done=(sessions||[]).filter(s=>s.status==='completed')
    const rev=done.reduce((s,x)=>s+(x.total_amount||0),0)
    stats.value={totalRevenue:rev,revenueGrowth:12,platformFees:rev*0.2,netEarnings:rev*0.8,totalSessions:done.length}
  }
  loading.value=false
})

const FirmBottomNav=defineComponent({setup(){return()=>h('nav',{style:'position:fixed;bottom:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-around;background:rgba(4,7,26,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.08);padding:0.5rem 0;height:60px'},[[{to:'/firm',icon:'🏢',label:'Home'},{to:'/firm/dashboard',icon:'📊',label:'Dashboard'},{to:'/firm/add-lawyer',icon:'➕',label:'Add'},{to:'/firm/services',icon:'⚖️',label:'Services'}].map(item=>h('a',{href:item.to,key:item.to,style:'display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;min-width:52px'},[h('span',{style:'font-size:1.2rem'},item.icon),h('span',{style:'font-size:0.6rem;font-family:DM Sans,sans-serif;font-weight:600;color:rgba(240,244,255,0.4);letter-spacing:0.03em'},item.label)]))])}})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:0.75rem;padding:1.25rem 1.25rem 0.75rem}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.25rem;font-weight:700;padding:0.25rem}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:#f0f4ff;flex:1}
.header-period{display:flex;gap:0.3rem}
.period-btn{background:transparent;border:1px solid rgba(255,255,255,0.12);color:rgba(240,244,255,0.5);padding:0.25rem 0.6rem;border-radius:100px;font-size:0.72rem;font-family:'DM Sans',sans-serif;cursor:pointer}
.period-btn.active{background:rgba(201,168,76,0.15);border-color:rgba(201,168,76,0.35);color:#C9A84C}
.dash-content{position:relative;z-index:1;padding:0 1.25rem}
.revenue-card{position:relative;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:20px;padding:1.25rem;margin-bottom:1rem;overflow:hidden}
.rc-glow{position:absolute;top:-60px;right:-60px;width:140px;height:140px;border-radius:50%;background:rgba(201,168,76,0.12);filter:blur(40px)}
.rc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem}
.rc-label{font-size:0.72rem;color:rgba(240,244,255,0.45);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.25rem}
.rc-amount{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:#C9A84C}
.rc-change{font-size:0.78rem;font-weight:700;padding:0.3rem 0.6rem;border-radius:8px}
.rc-change.positive{background:rgba(16,185,129,0.12);color:#10b981}
.rc-bar-row{display:flex;align-items:flex-end;gap:4px;height:44px;margin-bottom:1rem}
.rc-bar{flex:1;display:flex;align-items:flex-end;height:100%}
.rc-bar-fill{width:100%;border-radius:3px 3px 0 0;background:linear-gradient(to top,#C9A84C,rgba(201,168,76,0.4))}
.rc-sub-row{display:flex;align-items:center}
.rc-sub-item{flex:1;text-align:center}
.rs-val{display:block;font-weight:700;font-size:0.9rem;color:#f0f4ff}
.rs-label{font-size:0.62rem;color:rgba(240,244,255,0.38);text-transform:uppercase;letter-spacing:0.05em}
.rs-div{width:1px;height:28px;background:rgba(255,255,255,0.08)}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;margin-bottom:1rem}
.stat-card{display:flex;flex-direction:column;align-items:center;gap:0.25rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:0.875rem 0.3rem}
.sc-icon{font-size:1.2rem}
.sc-val{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#C9A84C}
.sc-label{font-size:0.57rem;color:rgba(240,244,255,0.38);text-transform:uppercase;letter-spacing:0.04em;text-align:center}
.section{margin-bottom:1.25rem}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.875rem}
.section-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff}
.section-sub{font-size:0.72rem;color:rgba(240,244,255,0.38)}
.loading-row{display:flex;flex-direction:column;gap:0.6rem}
.skel{height:60px;border-radius:12px;background:rgba(255,255,255,0.04);animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
.lawyers-list{display:flex;flex-direction:column;gap:0.6rem}
.lawyer-row{display:flex;align-items:center;gap:0.75rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:0.8rem}
.lr-rank{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;background:rgba(255,255,255,0.06);color:rgba(240,244,255,0.45);flex-shrink:0}
.rank-0{background:rgba(201,168,76,0.2)!important;color:#C9A84C!important}
.rank-1{background:rgba(148,163,184,0.2)!important;color:#94a3b8!important}
.rank-2{background:rgba(180,100,50,0.2)!important;color:#b46432!important}
.lr-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;color:#fff;position:relative;flex-shrink:0}
.lr-status{position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;border:2px solid #0d1538}
.lr-status.online{background:#10b981}.lr-status.busy{background:#f59e0b}.lr-status.offline{background:#64748b}
.lr-info{flex:1}
.lr-name{font-weight:700;font-size:0.85rem;color:#f0f4ff}
.lr-spec{font-size:0.68rem;color:#C9A84C;margin-top:0.1rem}
.lr-metrics{display:flex;flex-direction:column;align-items:flex-end;gap:0.15rem}
.lm-cases{font-size:0.72rem;color:rgba(240,244,255,0.55);font-weight:600}
.lm-rating{font-size:0.7rem;color:rgba(240,244,255,0.4)}
.breakdown-list{display:flex;flex-direction:column;gap:0.6rem}
.breakdown-row{display:flex;align-items:center;gap:0.75rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:0.7rem 0.875rem}
.br-left{display:flex;align-items:center;gap:0.5rem;min-width:100px}
.br-icon{font-size:1rem}
.br-label{font-size:0.8rem;font-weight:600;color:rgba(240,244,255,0.7)}
.br-bar-wrap{flex:1;height:6px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden}
.br-bar-fill{height:100%;background:linear-gradient(90deg,#C9A84C,rgba(201,168,76,0.5));border-radius:3px}
.br-count{font-size:0.8rem;font-weight:700;color:#C9A84C;min-width:24px;text-align:right}
.sessions-list{display:flex;flex-direction:column;gap:0.5rem}
.session-row{display:flex;align-items:center;gap:0.75rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:0.7rem 0.875rem}
.sr-type{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.sr-info{flex:1}
.sr-client{font-size:0.83rem;font-weight:600;color:#f0f4ff}
.sr-date{font-size:0.7rem;color:rgba(240,244,255,0.38);margin-top:0.1rem}
.sr-right{display:flex;flex-direction:column;align-items:flex-end;gap:0.2rem}
.sr-status{font-size:0.67rem;font-weight:700;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:100px}
.sr-status.completed{background:rgba(16,185,129,0.12);color:#10b981}
.sr-status.active{background:rgba(201,168,76,0.12);color:#C9A84C}
.sr-status.pending{background:rgba(148,163,184,0.1);color:#94a3b8}
.sr-amount{font-size:0.82rem;font-weight:700;color:#C9A84C}
.empty-state{text-align:center;padding:1.5rem;background:rgba(22,29,63,0.6);border-radius:12px}
.empty-state span{font-size:1.8rem;display:block;margin-bottom:0.4rem}
.empty-state p{font-size:0.83rem;color:rgba(240,244,255,0.38)}
</style>
