<template>
  <div class="page">
    <div class="page-bg"></div>

    <!-- Header -->
    <div class="firm-header">
      <div class="fh-left">
        <div class="firm-logo">⚖️</div>
        <div>
          <h1 class="firm-name">{{ firmProfile?.firm_name || 'Your Firm' }}</h1>
          <div class="firm-location">📍 {{ firmProfile?.city || 'India' }}</div>
        </div>
      </div>
      <span v-if="profile?.is_verified" class="verified-badge">✓ Verified</span>
    </div>

    <!-- Stats Row -->
    <div class="firm-stats">
      <div class="fs-item">
        <span class="fs-val">{{ firmProfile?.team_size || 0 }}</span>
        <span class="fs-label">Lawyers</span>
      </div>
      <div class="fs-div"></div>
      <div class="fs-item">
        <span class="fs-val">₹{{ fmt(walletBalance) }}</span>
        <span class="fs-label">Balance</span>
      </div>
      <div class="fs-div"></div>
      <div class="fs-item">
        <span class="fs-val">{{ totalCases }}</span>
        <span class="fs-label">Total Cases</span>
      </div>
      <div class="fs-div"></div>
      <div class="fs-item">
        <span class="fs-val">{{ avgRating }}★</span>
        <span class="fs-label">Avg Rating</span>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <router-link to="/firm/dashboard" class="qa-card">
        <span>📊</span><div class="qa-label">Dashboard</div>
      </router-link>
      <router-link to="/firm/add-lawyer" class="qa-card">
        <span>➕</span><div class="qa-label">Add Lawyer</div>
      </router-link>
      <router-link to="/firm/services" class="qa-card">
        <span>⚖️</span><div class="qa-label">Services</div>
      </router-link>
      <router-link to="/firm/profile" class="qa-card">
        <span>✏️</span><div class="qa-label">Edit Profile</div>
      </router-link>
    </div>

    <!-- Team Section -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Your Team</h2>
        <router-link to="/firm/add-lawyer" class="see-all">+ Add</router-link>
      </div>
      <div v-if="teamLawyers.length === 0" class="empty-state">
        <span>👥</span>
        <p>No lawyers added yet. Add your first team member!</p>
        <router-link to="/firm/add-lawyer" class="add-btn">Add Lawyer →</router-link>
      </div>
      <div v-else class="team-list">
        <div class="team-card" v-for="l in teamLawyers" :key="l.id">
          <div class="tc-av" :style="{ background: getColor(l.profiles?.full_name) }">
            {{ getInitials(l.profiles?.full_name) }}
            <div class="tc-status" :class="l.availability_status"></div>
          </div>
          <div class="tc-info">
            <div class="tc-name">{{ l.profiles?.full_name }}</div>
            <div class="tc-spec">{{ l.specializations?.[0] }}</div>
          </div>
          <div class="tc-stats">
            <span>⭐ {{ l.rating || '—' }}</span>
            <span>{{ l.total_cases || 0 }} cases</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Firm Specializations -->
    <div class="section">
      <h2 class="section-title">Practice Areas</h2>
      <div class="spec-tags">
        <span v-for="s in firmProfile?.specializations || []" :key="s" class="spec-tag">{{ s }}</span>
        <span v-if="!firmProfile?.specializations?.length" class="empty-spec">No specializations set. <router-link to="/firm/profile">Edit Profile</router-link></span>
      </div>
    </div>

    <div style="height:80px"></div>
    <FirmBottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth = useAuthStore()

const firmProfile  = ref(null)
const teamLawyers  = ref([])
const walletBalance = ref(0)

const profile = computed(() => auth.profile)
const totalCases = computed(() => teamLawyers.value.reduce((s,l)=>s+(l.total_cases||0),0))
const avgRating  = computed(() => {
  const rated = teamLawyers.value.filter(l=>l.rating)
  if (!rated.length) return '—'
  return (rated.reduce((s,l)=>s+l.rating,0)/rated.length).toFixed(1)
})

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#8b5cf6']
function getColor(n){let h=0;for(const c of(n||''))h=(h*31+c.charCodeAt(0))%colors.length;return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`}
function getInitials(n){return(n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
function fmt(n){return Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:2})}

// Inline FirmBottomNav
const FirmBottomNav = defineComponent({
  setup() {
    return () => h('nav', {
      style:'position:fixed;bottom:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-around;background:rgba(4,7,26,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.08);padding:0.5rem 0;height:60px'
    }, [
      [
        { to:'/firm', icon:'🏢', label:'Home' },
        { to:'/firm/dashboard', icon:'📊', label:'Dashboard' },
        { to:'/firm/add-lawyer', icon:'➕', label:'Add' },
        { to:'/firm/services', icon:'⚖️', label:'Services' },
        { to:'/firm/profile', icon:'✏️', label:'Profile' },
      ].map(item => h('a', {
        href: item.to, key: item.to,
        style:'display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;min-width:52px'
      }, [
        h('span', { style:'font-size:1.2rem;filter:grayscale(50%) opacity(0.6)' }, item.icon),
        h('span', { style:'font-size:0.6rem;font-family:DM Sans,sans-serif;font-weight:600;color:rgba(240,244,255,0.35);letter-spacing:0.03em' }, item.label),
      ]))
    ])
  }
})

onMounted(async () => {
  const uid = auth.user?.id
  if (!uid) return

  const { data: fp } = await supabase.from('firm_profiles').select('*').eq('id', uid).single()
  if (fp) firmProfile.value = fp

  const { data: team } = await supabase
    .from('lawyer_profiles')
    .select('*, profiles(full_name, avatar_url)')
    .eq('firm_id', uid)
    .limit(10)
  teamLawyers.value = team || []

  const { data: wallet } = await supabase.from('wallets').select('available_balance').eq('user_id', uid).single()
  if (wallet) walletBalance.value = wallet.available_balance || 0
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.firm-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1.25rem}
.fh-left{display:flex;align-items:center;gap:0.875rem}
.firm-logo{font-size:2.5rem;width:56px;height:56px;border-radius:14px;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.25);display:flex;align-items:center;justify-content:center}
.firm-name{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:#f0f4ff}
.firm-location{font-size:0.73rem;color:rgba(240,244,255,0.45);margin-top:0.15rem}
.verified-badge{background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.28);color:#10b981;padding:0.3rem 0.75rem;border-radius:100px;font-size:0.72rem;font-weight:700}
.firm-stats{position:relative;z-index:1;display:flex;align-items:center;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;margin:0 1.25rem;padding:1rem}
.fs-item{flex:1;text-align:center}
.fs-val{display:block;font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#C9A84C}
.fs-label{font-size:0.62rem;color:rgba(240,244,255,0.38);text-transform:uppercase;letter-spacing:0.06em}
.fs-div{width:1px;height:32px;background:rgba(255,255,255,0.08)}
.quick-actions{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin:1rem 1.25rem}
.qa-card{display:flex;flex-direction:column;align-items:center;gap:0.4rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:0.875rem 0.5rem;text-decoration:none;transition:all 0.2s}
.qa-card:hover{border-color:rgba(201,168,76,0.25)}
.qa-card span{font-size:1.4rem}
.qa-label{font-size:0.65rem;font-weight:600;color:rgba(240,244,255,0.6);text-align:center}
.section{position:relative;z-index:1;padding:0.75rem 1.25rem}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.875rem}
.section-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff}
.see-all{font-size:0.78rem;color:#C9A84C;text-decoration:none;font-weight:700}
.empty-state{text-align:center;padding:2rem 1rem}
.empty-state span{font-size:2.5rem;display:block;margin-bottom:0.6rem}
.empty-state p{font-size:0.83rem;color:rgba(240,244,255,0.45);margin-bottom:1rem}
.add-btn{display:inline-block;background:#C9A84C;color:#0A0F2C;padding:0.6rem 1.25rem;border-radius:10px;text-decoration:none;font-weight:700;font-size:0.85rem}
.team-list{display:flex;flex-direction:column;gap:0.6rem}
.team-card{display:flex;align-items:center;gap:0.875rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:0.875rem}
.tc-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:#fff;position:relative;flex-shrink:0}
.tc-status{position:absolute;bottom:0;right:0;width:11px;height:11px;border-radius:50%;border:2px solid #0d1538}
.tc-status.online{background:#10b981}.tc-status.busy{background:#f59e0b}.tc-status.offline{background:#64748b}
.tc-info{flex:1}
.tc-name{font-weight:700;font-size:0.88rem;color:#f0f4ff}
.tc-spec{font-size:0.7rem;color:#C9A84C;margin-top:0.1rem}
.tc-stats{display:flex;flex-direction:column;align-items:flex-end;gap:0.2rem;font-size:0.72rem;color:rgba(240,244,255,0.5)}
.spec-tags{display:flex;flex-wrap:wrap;gap:0.5rem}
.spec-tag{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);color:#C9A84C;padding:0.25rem 0.75rem;border-radius:100px;font-size:0.75rem;font-weight:600}
.empty-spec{font-size:0.82rem;color:rgba(240,244,255,0.35)}
.empty-spec a{color:#C9A84C;text-decoration:none}
</style>