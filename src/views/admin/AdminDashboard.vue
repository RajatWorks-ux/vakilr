<template>
  <div class="page">
    <div class="page-bg"></div>

    <!-- Header -->
    <div class="page-header">
      <div class="header-top">
        <div>
          <div class="admin-badge">🔐 ADMIN</div>
          <h1 class="page-title">Vakilr Control</h1>
          <p class="header-sub">rajatworks1@gmail.com</p>
        </div>
        <button class="logout-btn" @click="logout">Sign out</button>
      </div>
    </div>

    <div class="dash-body">

      <!-- Stats Grid -->
      <div v-if="loading" class="loading-state">
        <div class="spin"></div><p>Loading analytics...</p>
      </div>

      <template v-else>
        <!-- Revenue Card -->
        <div class="revenue-card">
          <div class="rc-glow"></div>
          <div class="rc-label">Total Platform Revenue</div>
          <div class="rc-amount">₹{{ fmt(stats.platformRevenue) }}</div>
          <div class="rc-row">
            <div class="rc-item">
              <span class="ri-val">₹{{ fmt(stats.totalTransacted) }}</span>
              <span class="ri-label">Total Transacted</span>
            </div>
            <div class="rc-div"></div>
            <div class="rc-item">
              <span class="ri-val">{{ stats.totalSessions }}</span>
              <span class="ri-label">Sessions</span>
            </div>
            <div class="rc-div"></div>
            <div class="rc-item">
              <span class="ri-val">₹{{ fmt(stats.avgSessionValue) }}</span>
              <span class="ri-label">Avg Session</span>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <div class="stat-card" v-for="s in quickStats" :key="s.label">
            <span class="sc-icon">{{ s.icon }}</span>
            <span class="sc-val">{{ s.val }}</span>
            <span class="sc-label">{{ s.label }}</span>
            <span v-if="s.alert" class="sc-alert">{{ s.alert }}</span>
          </div>
        </div>

        <!-- Nav Cards -->
        <div class="nav-section">
          <div class="section-title">Admin Tools</div>
          <div class="nav-cards">
            <router-link to="/admin/verify" class="nav-card">
              <div class="nc-icon">⚖️</div>
              <div class="nc-info">
                <div class="nc-title">Lawyer Verification</div>
                <div class="nc-sub">{{ stats.pendingVerifications }} pending</div>
              </div>
              <div class="nc-badge pending" v-if="stats.pendingVerifications > 0">
                {{ stats.pendingVerifications }}
              </div>
              <span class="nc-arrow">→</span>
            </router-link>

            <router-link to="/admin/disputes" class="nav-card">
              <div class="nc-icon">🔨</div>
              <div class="nc-info">
                <div class="nc-title">Dispute Moderation</div>
                <div class="nc-sub">{{ stats.openDisputes }} open disputes</div>
              </div>
              <div class="nc-badge alert" v-if="stats.openDisputes > 0">
                {{ stats.openDisputes }}
              </div>
              <span class="nc-arrow">→</span>
            </router-link>
          </div>
        </div>

        <!-- Recent Signups -->
        <div class="section">
          <div class="section-header">
            <div class="section-title">Recent Signups</div>
            <span class="section-sub">Last 10 users</span>
          </div>
          <div class="user-list">
            <div class="user-row" v-for="u in recentUsers" :key="u.id">
              <div class="ur-av" :style="{ background: getColor(u.full_name) }">
                {{ getInitials(u.full_name) }}
              </div>
              <div class="ur-info">
                <div class="ur-name">{{ u.full_name }}</div>
                <div class="ur-email">{{ u.email }}</div>
              </div>
              <div :class="['ur-role', u.role]">{{ u.role }}</div>
              <div class="ur-date">{{ fmtDate(u.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="section">
          <div class="section-header">
            <div class="section-title">Recent Transactions</div>
          </div>
          <div class="txn-list">
            <div class="txn-row" v-for="t in recentTxns" :key="t.id">
              <div class="txn-icon">{{ t.type === 'credit' ? '💰' : t.type === 'lock' ? '🔒' : '💸' }}</div>
              <div class="txn-info">
                <div class="txn-desc">{{ t.description }}</div>
                <div class="txn-date">{{ fmtDate(t.created_at) }}</div>
              </div>
              <div :class="['txn-amount', t.amount > 0 ? 'pos' : 'neg']">
                {{ t.amount > 0 ? '+' : '' }}₹{{ Math.abs(t.amount) }}
              </div>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const auth   = useAuthStore()
const loading = ref(true)

const stats = ref({
  totalUsers: 0, totalClients: 0, totalLawyers: 0, totalFirms: 0,
  totalSessions: 0, platformRevenue: 0, totalTransacted: 0,
  avgSessionValue: 0, pendingVerifications: 0, openDisputes: 0,
})
const recentUsers = ref([])
const recentTxns  = ref([])

const quickStats = computed(() => [
  { icon: '👥', val: stats.value.totalUsers,      label: 'Total Users' },
  { icon: '🧑',  val: stats.value.totalClients,    label: 'Clients' },
  { icon: '⚖️', val: stats.value.totalLawyers,    label: 'Lawyers' },
  { icon: '🏛️', val: stats.value.totalFirms,      label: 'Firms' },
  { icon: '📋', val: stats.value.totalSessions,   label: 'Sessions' },
  { icon: '⏳', val: stats.value.pendingVerifications, label: 'Pending Verify',
    alert: stats.value.pendingVerifications > 0 ? 'Action needed' : null },
])

onMounted(loadData)

async function loadData() {
  loading.value = true
  try {
    // Users
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, email, role, created_at').order('created_at', { ascending: false })
    const all = profiles || []
    stats.value.totalUsers   = all.length
    stats.value.totalClients = all.filter(u => u.role === 'client').length
    stats.value.totalLawyers = all.filter(u => u.role === 'lawyer').length
    stats.value.totalFirms   = all.filter(u => u.role === 'firm').length
    recentUsers.value = all.slice(0, 10)

    // Sessions
    const { count: sessionCount } = await supabase.from('sessions').select('id', { count: 'exact', head: true })
    stats.value.totalSessions = sessionCount || 0

    // Transactions
    const { data: txns } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(20)
    recentTxns.value = txns || []
    const allCredits = (txns || []).filter(t => t.amount > 0)
    stats.value.totalTransacted = allCredits.reduce((s, t) => s + t.amount, 0)
    stats.value.platformRevenue = Math.floor(stats.value.totalTransacted * 0.2)
    stats.value.avgSessionValue = stats.value.totalSessions > 0
      ? Math.floor(stats.value.totalTransacted / stats.value.totalSessions) : 0

    // Pending verifications
    const { count: pendingCount } = await supabase
      .from('profiles').select('id', { count: 'exact', head: true })
      .eq('role', 'lawyer').eq('verification_status', 'pending')
    stats.value.pendingVerifications = pendingCount || 0

    // Open disputes
    const { count: disputeCount } = await supabase
      .from('disputes').select('id', { count: 'exact', head: true })
      .in('status', ['filed', 'under_review'])
    stats.value.openDisputes = disputeCount || 0

  } catch (e) { console.error('Admin load error:', e) }
  loading.value = false
}

async function logout() {
  await auth.signOut()
  router.push('/login')
}

const fmt = (n) => (n || 0).toLocaleString('en-IN')
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''
const getInitials = (n) => (n || '?').split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2)
const getColor = (n) => ['#C9A84C','#10b981','#3b82f6','#8b5cf6','#f59e0b'][(n?.charCodeAt(0)||0) % 5]
</script>

<style scoped>
.page { min-height:100vh; background:#04071a; padding-bottom:3rem; }
.page-bg { position:fixed; inset:0; background:radial-gradient(ellipse 60% 30% at 50% 0%, rgba(201,168,76,0.07), transparent 60%); pointer-events:none; }
.page-header { position:sticky; top:0; z-index:10; background:rgba(4,7,26,0.96); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.06); padding:1.25rem 1.25rem 1rem; }
.header-top { display:flex; justify-content:space-between; align-items:flex-start; }
.admin-badge { display:inline-block; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; font-family:'DM Sans',sans-serif; font-size:0.65rem; font-weight:800; letter-spacing:0.12em; padding:0.2rem 0.6rem; border-radius:100px; margin-bottom:0.4rem; }
.page-title { font-family:'Playfair Display',serif; font-size:1.6rem; color:#f0f4ff; margin:0 0 0.15rem; }
.header-sub { font-family:'DM Sans',sans-serif; font-size:0.75rem; color:#4a5578; }
.logout-btn { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:#f87171; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:600; padding:0.5rem 1rem; border-radius:10px; cursor:pointer; }
.dash-body { padding:1.25rem; display:flex; flex-direction:column; gap:1.25rem; }
.loading-state { text-align:center; padding:4rem 1rem; color:#4a5578; font-family:'DM Sans',sans-serif; }
.spin { width:28px; height:28px; border:2px solid rgba(201,168,76,0.2); border-top-color:#C9A84C; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem; }
@keyframes spin { to { transform:rotate(360deg); } }

/* Revenue card */
.revenue-card { position:relative; background:linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.04)); border:1px solid rgba(201,168,76,0.2); border-radius:20px; padding:1.5rem; overflow:hidden; }
.rc-glow { position:absolute; top:-40px; right:-40px; width:120px; height:120px; background:radial-gradient(circle, rgba(201,168,76,0.2), transparent 70%); }
.rc-label { font-family:'DM Sans',sans-serif; font-size:0.75rem; color:rgba(201,168,76,0.7); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.4rem; }
.rc-amount { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:700; color:#C9A84C; margin-bottom:1.25rem; }
.rc-row { display:flex; align-items:center; gap:0; }
.rc-item { flex:1; text-align:center; }
.ri-val { display:block; font-family:'DM Sans',sans-serif; font-size:0.95rem; font-weight:700; color:#f0f4ff; }
.ri-label { font-size:0.68rem; color:#4a5578; font-family:'DM Sans',sans-serif; }
.rc-div { width:1px; height:30px; background:rgba(255,255,255,0.08); }

/* Stats grid */
.stats-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem; }
.stat-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:0.9rem 0.75rem; text-align:center; position:relative; }
.sc-icon { font-size:1.3rem; display:block; margin-bottom:0.35rem; }
.sc-val { display:block; font-family:'DM Sans',sans-serif; font-size:1.1rem; font-weight:800; color:#f0f4ff; }
.sc-label { font-size:0.65rem; color:#4a5578; font-family:'DM Sans',sans-serif; }
.sc-alert { display:block; font-size:0.6rem; color:#f59e0b; font-family:'DM Sans',sans-serif; margin-top:0.2rem; }

/* Nav section */
.nav-section { }
.section-title { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:700; color:#8892b0; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.75rem; }
.nav-cards { display:flex; flex-direction:column; gap:0.75rem; }
.nav-card { display:flex; align-items:center; gap:0.9rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:1rem 1.1rem; text-decoration:none; transition:border-color 0.2s; }
.nav-card:hover { border-color:rgba(201,168,76,0.3); }
.nc-icon { font-size:1.5rem; }
.nc-info { flex:1; }
.nc-title { font-family:'DM Sans',sans-serif; font-weight:700; color:#f0f4ff; font-size:0.9rem; }
.nc-sub { font-size:0.75rem; color:#4a5578; font-family:'DM Sans',sans-serif; margin-top:0.1rem; }
.nc-badge { font-size:0.65rem; font-weight:800; padding:0.2rem 0.5rem; border-radius:100px; }
.nc-badge.pending { background:rgba(201,168,76,0.15); color:#C9A84C; }
.nc-badge.alert { background:rgba(239,68,68,0.15); color:#f87171; }
.nc-arrow { color:#4a5578; font-size:1rem; }

/* Section */
.section { }
.section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; }
.section-sub { font-family:'DM Sans',sans-serif; font-size:0.72rem; color:#4a5578; }

/* User list */
.user-list { display:flex; flex-direction:column; gap:0.6rem; }
.user-row { display:flex; align-items:center; gap:0.75rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:0.75rem; }
.ur-av { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; font-weight:800; font-size:0.75rem; color:#04071a; flex-shrink:0; }
.ur-info { flex:1; min-width:0; }
.ur-name { font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:#f0f4ff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ur-email { font-size:0.7rem; color:#4a5578; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ur-role { font-size:0.62rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:100px; flex-shrink:0; text-transform:uppercase; }
.ur-role.client { background:rgba(59,130,246,0.12); color:#60a5fa; }
.ur-role.lawyer { background:rgba(201,168,76,0.12); color:#C9A84C; }
.ur-role.firm { background:rgba(139,92,246,0.12); color:#a78bfa; }
.ur-date { font-size:0.68rem; color:#4a5578; flex-shrink:0; }

/* Transactions */
.txn-list { display:flex; flex-direction:column; gap:0.5rem; }
.txn-row { display:flex; align-items:center; gap:0.75rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:0.75rem; }
.txn-icon { font-size:1.2rem; flex-shrink:0; }
.txn-info { flex:1; min-width:0; }
.txn-desc { font-family:'DM Sans',sans-serif; font-size:0.78rem; color:#8892b0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.txn-date { font-size:0.68rem; color:#4a5578; margin-top:0.1rem; }
.txn-amount { font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:700; flex-shrink:0; }
.txn-amount.pos { color:#10b981; }
.txn-amount.neg { color:#f87171; }
</style>