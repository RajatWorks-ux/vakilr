<template>
  <div class="page">
    <div class="page-bg"></div>

    <!-- Header -->
    <div class="browse-header">
      <router-link to="/client" class="back-btn">←</router-link>
      <div class="browse-search">
        <span class="bs-icon">🔍</span>
        <input v-model="searchQuery" placeholder="Search lawyers..." @input="doSearch" />
      </div>
      <button class="filter-btn" @click="showFilters = !showFilters">
        ⚙️
      </button>
    </div>

    <!-- Filters Panel -->
    <transition name="slide-down">
      <div v-if="showFilters" class="filters-panel">
        <div class="filter-row">
          <div class="filter-group">
            <label>Specialization</label>
            <select v-model="filters.specialization" @change="doSearch">
              <option value="">All</option>
              <option v-for="s in specs" :key="s">{{ s }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Status</label>
            <select v-model="filters.status" @change="doSearch">
              <option value="">All</option>
              <option value="online">Online</option>
              <option value="busy">Busy</option>
            </select>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-group">
            <label>Language</label>
            <select v-model="filters.language" @change="doSearch">
              <option value="">All</option>
              <option v-for="l in languages" :key="l">{{ l }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Min Rating</label>
            <select v-model.number="filters.minRating" @change="doSearch">
              <option :value="0">Any</option>
              <option :value="3">3★+</option>
              <option :value="4">4★+</option>
              <option :value="4.5">4.5★+</option>
            </select>
          </div>
        </div>
        <button class="clear-filters" @click="clearFilters">Clear Filters</button>
      </div>
    </transition>

    <!-- Results -->
    <div class="results-header" v-if="!loading">
      <span class="results-count">{{ lawyers.length }} lawyers found</span>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div><p>Finding lawyers...</p>
    </div>

    <div v-else class="lawyers-grid">
      <router-link
        v-for="l in lawyers" :key="l.id"
        :to="'/client/lawyer/' + l.id"
        class="lawyer-card"
      >
        <div class="lc-top">
          <div class="lc-av" :style="{ background: getColor(l.profiles?.full_name) }">
            {{ getInitials(l.profiles?.full_name) }}
            <div class="lc-status" :class="l.availability_status"></div>
          </div>
          <div class="lc-info">
            <div class="lc-name">{{ l.profiles?.full_name || 'Lawyer' }}</div>
            <div class="lc-spec">{{ l.specializations?.slice(0,2).join(' · ') }}</div>
            <div class="lc-city">📍 {{ l.city }}</div>
          </div>
          <div class="lc-rate-wrap">
            <span class="lc-rate">₹{{ getMinRate(l) }}</span>
            <span class="lc-rate-unit">/min</span>
          </div>
        </div>
        <div class="lc-stats">
          <div class="lcs"><span>⭐ {{ l.rating || '—' }}</span><small>Rating</small></div>
          <div class="lcs"><span>{{ l.total_cases || 0 }}</span><small>Cases</small></div>
          <div class="lcs"><span>{{ l.experience_years }}yr</span><small>Exp.</small></div>
          <div class="lcs"><span>{{ l.avg_response_minutes || 10 }}m</span><small>Resp.</small></div>
        </div>
        <div class="lc-langs" v-if="l.languages?.length">
          <span v-for="lang in l.languages.slice(0,3)" :key="lang" class="lang-tag">{{ lang }}</span>
        </div>
        <button class="lc-consult">Consult Now →</button>
      </router-link>

      <div v-if="lawyers.length === 0" class="empty-state">
        <span>🔍</span><p>No lawyers found. Try different filters.</p>
      </div>
    </div>

    <div style="height:80px"></div>
    <ClientBottomNav />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import ClientBottomNav from '@/components/ClientBottomNav.vue'

const route       = useRoute()
const clientStore = useClientStore()

const lawyers     = ref([])
const loading     = ref(false)
const showFilters = ref(false)
const searchQuery = ref('')

const filters = reactive({ specialization:'', language:'', status:'', minRating: 0 })

const specs     = ['Family Law','Criminal Defense','Property Law','Corporate Law','Labour Law','Cyber Law','Tax Law','Immigration','Consumer Law']
const languages = ['Hindi','English','Tamil','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati']

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

async function doSearch() {
  loading.value = true
  lawyers.value = await clientStore.browseLawyers({
    specialization: filters.specialization || undefined,
    language:       filters.language       || undefined,
    status:         filters.status         || undefined,
    minRating:      filters.minRating      || undefined,
    search:         searchQuery.value      || undefined,
  })
  loading.value = false
}

function clearFilters() {
  filters.specialization = ''; filters.language = ''
  filters.status = ''; filters.minRating = 0
  searchQuery.value = ''
  doSearch()
}

onMounted(() => {
  if (route.query.spec) filters.specialization = route.query.spec
  if (route.query.status) filters.status = route.query.status
  doSearch()
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.browse-header{position:relative;z-index:1;display:flex;align-items:center;gap:0.75rem;padding:1.25rem 1.25rem 0.75rem}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08);flex-shrink:0}
.browse-search{flex:1;display:flex;align-items:center;gap:0.6rem;background:rgba(22,29,63,0.8);border:1.5px solid rgba(255,255,255,0.08);border-radius:12px;padding:0 0.875rem;height:44px}
.bs-icon{font-size:0.9rem;opacity:0.5}
.browse-search input{flex:1;background:none;border:none;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none}
.browse-search input::placeholder{color:rgba(240,244,255,0.3)}
.filter-btn{width:44px;height:44px;border-radius:12px;border:1.5px solid rgba(255,255,255,0.1);background:rgba(22,29,63,0.8);font-size:1rem;cursor:pointer;flex-shrink:0}
.filters-panel{position:relative;z-index:1;background:rgba(13,21,56,0.98);border-bottom:1px solid rgba(255,255,255,0.08);padding:1rem 1.25rem}
.filter-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem}
.filter-group label{font-size:0.68rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:0.3rem}
.filter-group select{width:100%;height:38px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:8px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.82rem;padding:0 0.75rem;outline:none;appearance:none}
.clear-filters{background:none;border:1px solid rgba(255,255,255,0.1);color:rgba(240,244,255,0.5);padding:0.4rem 1rem;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer}
.results-header{position:relative;z-index:1;padding:0.5rem 1.25rem}
.results-count{font-size:0.78rem;color:rgba(240,244,255,0.4)}
.loading-state{text-align:center;padding:3rem;color:rgba(240,244,255,0.5)}
.spinner{width:36px;height:36px;border:3px solid rgba(201,168,76,0.3);border-top-color:#C9A84C;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 1rem}
@keyframes spin{to{transform:rotate(360deg)}}
.lawyers-grid{position:relative;z-index:1;padding:0 1.25rem;display:flex;flex-direction:column;gap:0.875rem}
.lawyer-card{display:flex;flex-direction:column;gap:0.875rem;background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:1.1rem;text-decoration:none;transition:all 0.2s}
.lawyer-card:hover{border-color:rgba(201,168,76,0.25)}
.lc-top{display:flex;align-items:center;gap:0.875rem}
.lc-av{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#fff;position:relative;flex-shrink:0}
.lc-status{position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;border:2px solid #0d1538}
.lc-status.online{background:#10b981}.lc-status.busy{background:#f59e0b}.lc-status.offline{background:#64748b}
.lc-info{flex:1;min-width:0}
.lc-name{font-weight:700;font-size:0.9rem;color:#f0f4ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lc-spec{font-size:0.72rem;color:#C9A84C;margin-top:0.1rem}
.lc-city{font-size:0.68rem;color:rgba(240,244,255,0.38);margin-top:0.1rem}
.lc-rate-wrap{text-align:right;flex-shrink:0}
.lc-rate{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#C9A84C;display:block}
.lc-rate-unit{font-size:0.65rem;color:rgba(240,244,255,0.35)}
.lc-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);padding:0.6rem 0}
.lcs{text-align:center}
.lcs span{display:block;font-weight:700;font-size:0.82rem;color:#f0f4ff}
.lcs small{font-size:0.6rem;color:rgba(240,244,255,0.35);text-transform:uppercase;letter-spacing:0.04em}
.lc-langs{display:flex;flex-wrap:wrap;gap:0.3rem}
.lang-tag{background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);color:#60a5fa;padding:0.15rem 0.55rem;border-radius:100px;font-size:0.65rem;font-weight:600}
.lc-consult{width:100%;padding:0.7rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s}
.lc-consult:hover{background:#e0b84a}
.empty-state{text-align:center;padding:3rem;color:rgba(240,244,255,0.4)}
.empty-state span{font-size:2.5rem;display:block;margin-bottom:0.75rem}
.empty-state p{font-size:0.88rem}
.slide-down-enter-active,.slide-down-leave-active{transition:all 0.3s ease}
.slide-down-enter-from,.slide-down-leave-to{opacity:0;transform:translateY(-8px)}
</style>