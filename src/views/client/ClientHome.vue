<template>
  <div class="client-home">
    <div class="ch-bg"></div>

    <!-- Header -->
    <div class="ch-header">
      <div class="ch-greeting">
        <p class="ch-hello">Good {{ timeOfDay }},</p>
        <h1 class="ch-name">{{ firstName }}</h1>
      </div>
      <router-link to="/client/sessions" class="ch-notif">
        <span class="notif-icon">🔔</span>
      </router-link>
    </div>

    <!-- Search Bar -->
    <div class="search-wrap">
      <div class="search-box" @click="$router.push('/client/browse')">
        <span class="search-icon">🔍</span>
        <span class="search-placeholder">Search lawyers, specializations...</span>
      </div>
      <router-link to="/client/ai-guide" class="ai-btn">
        <span>✨</span> Ask AI
      </router-link>
    </div>

    <!-- Categories -->
    <div class="categories-scroll">
      <button
        v-for="cat in categories" :key="cat.label"
        :class="['cat-btn', { active: activeCategory === cat.label }]"
        @click="activeCategory = cat.label; $router.push('/client/browse?spec=' + cat.label)"
      >
        <span>{{ cat.icon }}</span> {{ cat.label }}
      </button>
    </div>

    <!-- Online Lawyers Now -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Online Now <span class="online-dot"></span></h2>
        <router-link to="/client/browse?status=online" class="see-all">See All</router-link>
      </div>
      <div v-if="onlineLawyers.length === 0" class="empty-mini">
        <p>No lawyers online right now</p>
      </div>
      <div class="online-scroll">
        <router-link
          v-for="l in onlineLawyers" :key="l.id"
          :to="'/client/lawyer/' + l.id"
          class="online-card"
        >
          <div class="oc-avatar" :style="{ background: getColor(l.profiles?.full_name) }">
            {{ getInitials(l.profiles?.full_name) }}
            <div class="oc-status-dot"></div>
          </div>
          <div class="oc-name">{{ l.profiles?.full_name?.replace(/^Adv\. ?/,'') || 'Lawyer' }}</div>
          <div class="oc-spec">{{ l.specializations?.[0] || 'Legal' }}</div>
          <div class="oc-rate">₹{{ getMinRate(l) }}/min</div>
        </router-link>
      </div>
    </div>

    <!-- Top Rated -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Top Rated</h2>
        <router-link to="/client/browse" class="see-all">See All</router-link>
      </div>
      <div class="lawyers-list">
        <router-link
          v-for="l in topLawyers" :key="l.id"
          :to="'/client/lawyer/' + l.id"
          class="lawyer-row"
        >
          <div class="lr-avatar" :style="{ background: getColor(l.profiles?.full_name) }">
            {{ getInitials(l.profiles?.full_name) }}
            <div class="lr-status" :class="l.availability_status"></div>
          </div>
          <div class="lr-info">
            <div class="lr-name">{{ l.profiles?.full_name || 'Lawyer' }}</div>
            <div class="lr-spec">{{ l.specializations?.slice(0,2).join(' · ') }}</div>
            <div class="lr-meta">📍 {{ l.city }} · {{ l.experience_years }}yr exp</div>
          </div>
          <div class="lr-right">
            <div class="lr-rating">⭐ {{ l.rating || '—' }}</div>
            <div class="lr-rate">₹{{ getMinRate(l) }}/m</div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- AI Guide CTA -->
    <div class="ai-cta-card" @click="$router.push('/client/ai-guide')">
      <div class="ai-cta-left">
        <div class="ai-cta-icon">✨</div>
        <div>
          <div class="ai-cta-title">Not sure where to start?</div>
          <div class="ai-cta-sub">Describe your problem in Hindi or English — AI will guide you to the right lawyer</div>
        </div>
      </div>
      <span class="ai-cta-arrow">→</span>
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

const onlineLawyers  = ref([])
const topLawyers     = ref([])
const activeCategory = ref('')

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'
})

const firstName = computed(() => {
  const name = auth.profile?.full_name || 'there'
  return name.split(' ')[0]
})

const categories = [
  { icon:'👨‍👩‍👧', label:'Family Law' },
  { icon:'🏠', label:'Property Law' },
  { icon:'💼', label:'Corporate Law' },
  { icon:'⚖️', label:'Criminal Defense' },
  { icon:'💰', label:'Tax Law' },
  { icon:'💻', label:'Cyber Law' },
  { icon:'✈️', label:'Immigration' },
  { icon:'👷', label:'Labour Law' },
]

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
function getColor(name) {
  let h = 0; for (const c of (name||'')) h = (h*31 + c.charCodeAt(0)) % colors.length
  return `linear-gradient(135deg, ${colors[h]}, ${colors[(h+1)%colors.length]})`
}
function getInitials(name) { return (name||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
function getMinRate(l) {
  const svcs = l.lawyer_services?.filter(s => s.is_active && s.price_unit === 'per_minute')
  if (svcs?.length) return Math.min(...svcs.map(s => s.price_amount))
  return '—'
}

onMounted(async () => {
  if (auth.user?.id) await clientStore.init(auth.user.id)
  onlineLawyers.value = await clientStore.browseLawyers({ status: 'online' })
  topLawyers.value    = await clientStore.browseLawyers({})
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.client-home{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative;overflow-x:hidden}
.ch-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.ch-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.25rem 0.75rem}
.ch-hello{font-size:0.78rem;color:rgba(240,244,255,0.5)}
.ch-name{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#f0f4ff}
.ch-notif{width:40px;height:40px;border-radius:12px;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.1rem}
.search-wrap{position:relative;z-index:1;display:flex;gap:0.75rem;padding:0 1.25rem 0.75rem}
.search-box{flex:1;display:flex;align-items:center;gap:0.6rem;background:rgba(22,29,63,0.8);border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;padding:0.75rem 1rem;cursor:pointer;transition:border-color 0.2s}
.search-box:hover{border-color:rgba(201,168,76,0.3)}
.search-icon{font-size:1rem;opacity:0.5}
.search-placeholder{font-size:0.85rem;color:rgba(240,244,255,0.35)}
.ai-btn{display:flex;align-items:center;gap:0.4rem;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.28);color:#C9A84C;padding:0.75rem 1rem;border-radius:14px;text-decoration:none;font-weight:700;font-size:0.82rem;white-space:nowrap;flex-shrink:0}
.categories-scroll{position:relative;z-index:1;display:flex;gap:0.5rem;overflow-x:auto;padding:0 1.25rem 1rem;scrollbar-width:none}
.categories-scroll::-webkit-scrollbar{display:none}
.cat-btn{display:flex;align-items:center;gap:0.35rem;padding:0.45rem 0.875rem;border-radius:100px;border:1.5px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:500;cursor:pointer;white-space:nowrap;transition:all 0.2s;flex-shrink:0}
.cat-btn.active,.cat-btn:hover{background:rgba(201,168,76,0.1);border-color:#C9A84C;color:#C9A84C}
.section{position:relative;z-index:1;padding:0 0 0.75rem}
.section-header{display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;margin-bottom:0.875rem}
.section-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff;display:flex;align-items:center;gap:0.5rem}
.online-dot{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse-dot 2s infinite;display:inline-block}
@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.4}}
.see-all{font-size:0.78rem;color:#C9A84C;text-decoration:none;font-weight:600}
.empty-mini{padding:0 1.25rem;font-size:0.83rem;color:rgba(240,244,255,0.35)}
.online-scroll{display:flex;gap:0.875rem;overflow-x:auto;padding:0 1.25rem;scrollbar-width:none}
.online-scroll::-webkit-scrollbar{display:none}
.online-card{display:flex;flex-direction:column;align-items:center;gap:0.4rem;text-decoration:none;flex-shrink:0;width:80px}
.oc-avatar{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;color:#fff;position:relative;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:2px solid rgba(16,185,129,0.4)}
.oc-status-dot{position:absolute;bottom:1px;right:1px;width:12px;height:12px;border-radius:50%;background:#10b981;border:2px solid #0A0F2C;box-shadow:0 0 6px #10b981}
.oc-name{font-size:0.7rem;font-weight:600;color:#f0f4ff;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}
.oc-spec{font-size:0.6rem;color:#C9A84C;text-align:center}
.oc-rate{font-size:0.65rem;color:rgba(240,244,255,0.5);text-align:center}
.lawyers-list{padding:0 1.25rem;display:flex;flex-direction:column;gap:0.75rem}
.lawyer-row{display:flex;align-items:center;gap:0.875rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:0.875rem;text-decoration:none;transition:all 0.2s}
.lawyer-row:hover{border-color:rgba(201,168,76,0.25);background:rgba(201,168,76,0.05)}
.lr-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#fff;position:relative;flex-shrink:0}
.lr-status{position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;border:2px solid #0d1538}
.lr-status.online{background:#10b981}
.lr-status.busy{background:#f59e0b}
.lr-status.offline{background:#64748b}
.lr-info{flex:1;min-width:0}
.lr-name{font-weight:700;font-size:0.9rem;color:#f0f4ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lr-spec{font-size:0.73rem;color:#C9A84C;margin-top:0.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lr-meta{font-size:0.68rem;color:rgba(240,244,255,0.4);margin-top:0.1rem}
.lr-right{text-align:right;flex-shrink:0}
.lr-rating{font-size:0.8rem;font-weight:600;color:#f0f4ff}
.lr-rate{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:#C9A84C}
.ai-cta-card{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;margin:0.75rem 1.25rem;background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05));border:1px solid rgba(201,168,76,0.25);border-radius:16px;padding:1.1rem;cursor:pointer;transition:all 0.2s}
.ai-cta-card:hover{background:linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.08));border-color:rgba(201,168,76,0.4)}
.ai-cta-left{display:flex;align-items:flex-start;gap:0.875rem}
.ai-cta-icon{font-size:1.8rem;flex-shrink:0}
.ai-cta-title{font-weight:700;font-size:0.92rem;color:#f0f4ff;margin-bottom:0.25rem}
.ai-cta-sub{font-size:0.78rem;color:rgba(240,244,255,0.55);line-height:1.5}
.ai-cta-arrow{font-size:1.2rem;color:#C9A84C;flex-shrink:0}
</style>