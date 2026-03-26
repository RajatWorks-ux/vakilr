<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/firm" class="back-btn">←</router-link>
      <h1 class="page-title">Add Lawyer</h1>
    </div>

    <div class="content">
      <!-- Success State -->
      <div v-if="success" class="success-state">
        <div class="ss-icon">✅</div>
        <h2 class="ss-title">Lawyer Added!</h2>
        <p class="ss-sub">{{ addedLawyer?.profiles?.full_name || 'Lawyer' }} has been added to your firm.</p>
        <div class="added-card">
          <div class="ac-av" :style="{background:getColor(addedLawyer?.profiles?.full_name)}">
            {{ getInitials(addedLawyer?.profiles?.full_name) }}
          </div>
          <div class="ac-info">
            <div class="ac-name">{{ addedLawyer?.profiles?.full_name }}</div>
            <div class="ac-spec">{{ addedLawyer?.specializations?.[0] || 'General' }}</div>
            <div class="ac-bc">Bar #{{ addedLawyer?.bar_council_number }}</div>
          </div>
        </div>
        <button class="add-another-btn" @click="reset">Add Another</button>
        <router-link to="/firm" class="back-home-btn">Back to Home</router-link>
      </div>

      <div v-else>
        <!-- Info Banner -->
        <div class="info-banner">
          <span>ℹ️</span>
          <p>Enter the lawyer's Bar Council Number. They must have a verified Vakilr account first.</p>
        </div>

        <!-- Search Form -->
        <div class="search-section">
          <div class="field">
            <label>Bar Council Number</label>
            <div class="input-row">
              <input
                v-model="barNumber"
                placeholder="e.g. D/123/2020"
                class="text-input"
                @keyup.enter="searchLawyer"
                :disabled="searching"
              />
              <button class="search-btn" @click="searchLawyer" :disabled="!barNumber.trim() || searching">
                {{ searching ? '...' : '🔍' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Search Result -->
        <div v-if="searchError" class="error-banner">
          <span>❌</span><p>{{ searchError }}</p>
        </div>

        <div v-if="foundLawyer && !searchError" class="found-card">
          <div class="fc-header">
            <div class="fc-av" :style="{background:getColor(foundLawyer.profiles?.full_name)}">
              {{ getInitials(foundLawyer.profiles?.full_name) }}
              <div class="fc-verified" v-if="foundLawyer.profiles?.is_verified">✓</div>
            </div>
            <div class="fc-info">
              <div class="fc-name">{{ foundLawyer.profiles?.full_name || 'Unknown' }}</div>
              <div class="fc-bc">Bar #{{ foundLawyer.bar_council_number }}</div>
              <div class="fc-city">📍 {{ foundLawyer.city || 'India' }}</div>
            </div>
          </div>
          <div class="fc-tags">
            <span class="fc-tag" v-for="s in (foundLawyer.specializations||[]).slice(0,3)" :key="s">{{ s }}</span>
          </div>
          <div class="fc-meta">
            <span>{{ foundLawyer.experience_years || 0 }} yrs exp</span>
            <span>{{ foundLawyer.total_cases || 0 }} cases</span>
            <span v-if="foundLawyer.rating">⭐ {{ foundLawyer.rating }}</span>
          </div>

          <!-- Already in firm warning -->
          <div v-if="foundLawyer.firm_id === firmId" class="already-badge">
            Already in your firm
          </div>
          <div v-else-if="foundLawyer.firm_id && foundLawyer.firm_id !== firmId" class="other-firm-badge">
            Member of another firm
          </div>
          <button
            v-else
            class="add-btn"
            @click="addLawyer"
            :disabled="adding"
          >
            {{ adding ? 'Adding...' : 'Add to Firm →' }}
          </button>
        </div>

        <!-- Team Members -->
        <div class="section" v-if="teamLawyers.length > 0">
          <h2 class="section-title">Current Team ({{ teamLawyers.length }})</h2>
          <div class="team-list">
            <div class="team-row" v-for="l in teamLawyers" :key="l.id">
              <div class="tr-av" :style="{background:getColor(l.profiles?.full_name)}">
                {{ getInitials(l.profiles?.full_name) }}
                <div class="tr-status" :class="l.availability_status"></div>
              </div>
              <div class="tr-info">
                <div class="tr-name">{{ l.profiles?.full_name }}</div>
                <div class="tr-spec">{{ l.specializations?.[0] }}</div>
              </div>
              <button class="remove-btn" @click="removeLawyer(l.id)" title="Remove from firm">✕</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FirmBottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth = useAuthStore()
const barNumber = ref('')
const searching = ref(false)
const adding = ref(false)
const foundLawyer = ref(null)
const searchError = ref('')
const success = ref(false)
const addedLawyer = ref(null)
const teamLawyers = ref([])

const firmId = computed(() => auth.user?.id)

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#8b5cf6']
function getColor(n){let h=0;for(const c of(n||''))h=(h*31+c.charCodeAt(0))%colors.length;return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`}
function getInitials(n){return(n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}

async function searchLawyer() {
  if (!barNumber.value.trim()) return
  searching.value = true
  searchError.value = ''
  foundLawyer.value = null

  const { data, error } = await supabase
    .from('lawyer_profiles')
    .select('*, profiles(full_name, avatar_url, is_verified)')
    .ilike('bar_council_number', barNumber.value.trim())
    .single()

  if (error || !data) {
    searchError.value = 'No lawyer found with that Bar Council Number. Make sure they have a Vakilr account.'
  } else {
    foundLawyer.value = data
  }
  searching.value = false
}

async function addLawyer() {
  if (!foundLawyer.value) return
  adding.value = true

  const { error } = await supabase
    .from('lawyer_profiles')
    .update({ firm_id: firmId.value })
    .eq('id', foundLawyer.value.id)

  if (error) {
    searchError.value = 'Failed to add lawyer: ' + error.message
  } else {
    addedLawyer.value = foundLawyer.value
    success.value = true
    await loadTeam()
  }
  adding.value = false
}

async function removeLawyer(lawyerId) {
  const { error } = await supabase
    .from('lawyer_profiles')
    .update({ firm_id: null })
    .eq('id', lawyerId)
    .eq('firm_id', firmId.value)

  if (!error) await loadTeam()
}

function reset() {
  success.value = false
  addedLawyer.value = null
  foundLawyer.value = null
  barNumber.value = ''
  searchError.value = ''
}

async function loadTeam() {
  const { data } = await supabase
    .from('lawyer_profiles')
    .select('*, profiles(full_name, avatar_url)')
    .eq('firm_id', firmId.value)
  teamLawyers.value = data || []
}

onMounted(loadTeam)

const FirmBottomNav = defineComponent({
  setup() {
    return () => h('nav', { style:'position:fixed;bottom:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-around;background:rgba(4,7,26,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.08);padding:0.5rem 0;height:60px' },
      [[{to:'/firm',icon:'🏢',label:'Home'},{to:'/firm/dashboard',icon:'📊',label:'Dashboard'},{to:'/firm/add-lawyer',icon:'➕',label:'Add'},{to:'/firm/services',icon:'⚖️',label:'Services'}]
      .map(item => h('a', { href:item.to, key:item.to, style:'display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;min-width:52px' }, [
        h('span', { style:'font-size:1.2rem' }, item.icon),
        h('span', { style:'font-size:0.6rem;font-family:DM Sans,sans-serif;font-weight:600;color:rgba(240,244,255,0.4);letter-spacing:0.03em' }, item.label),
      ]))]
    )
  }
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:0.75rem;padding:1.25rem 1.25rem 0.75rem}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.25rem;font-weight:700;padding:0.25rem}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:#f0f4ff}
.content{position:relative;z-index:1;padding:0 1.25rem;padding-bottom:80px}
.info-banner{display:flex;align-items:flex-start;gap:0.6rem;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:0.875rem;margin-bottom:1.25rem}
.info-banner span{font-size:1rem;flex-shrink:0}
.info-banner p{font-size:0.8rem;color:rgba(240,244,255,0.6);line-height:1.5}
.search-section{margin-bottom:1rem}
.field label{display:block;font-size:0.78rem;font-weight:700;color:rgba(240,244,255,0.6);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.5rem}
.input-row{display:flex;gap:0.5rem}
.text-input{flex:1;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:#f0f4ff;padding:0.8rem 1rem;font-size:0.92rem;font-family:'DM Sans',sans-serif;outline:none}
.text-input:focus{border-color:rgba(201,168,76,0.4)}
.search-btn{background:#C9A84C;color:#0A0F2C;border:none;border-radius:12px;padding:0.8rem 1rem;font-size:1rem;cursor:pointer;font-weight:700;transition:opacity 0.2s}
.search-btn:disabled{opacity:0.5}
.error-banner{display:flex;align-items:flex-start;gap:0.6rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:0.875rem;margin-bottom:1rem}
.error-banner span{font-size:1rem;flex-shrink:0}
.error-banner p{font-size:0.8rem;color:#f87171}
.found-card{background:rgba(22,29,63,0.9);border:1px solid rgba(201,168,76,0.2);border-radius:16px;padding:1.25rem;margin-bottom:1.25rem}
.fc-header{display:flex;align-items:center;gap:0.875rem;margin-bottom:0.875rem}
.fc-av{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#fff;position:relative;flex-shrink:0}
.fc-verified{position:absolute;bottom:-2px;right:-2px;width:18px;height:18px;background:#10b981;border-radius:50%;border:2px solid #0d1538;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:800;color:#fff}
.fc-info{flex:1}
.fc-name{font-weight:700;font-size:1rem;color:#f0f4ff}
.fc-bc{font-size:0.73rem;color:#C9A84C;margin-top:0.15rem}
.fc-city{font-size:0.73rem;color:rgba(240,244,255,0.45);margin-top:0.1rem}
.fc-tags{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.75rem}
.fc-tag{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);color:#C9A84C;padding:0.2rem 0.6rem;border-radius:100px;font-size:0.72rem;font-weight:600}
.fc-meta{display:flex;gap:1rem;font-size:0.78rem;color:rgba(240,244,255,0.45);margin-bottom:1rem}
.add-btn{width:100%;background:#C9A84C;color:#0A0F2C;border:none;border-radius:12px;padding:0.875rem;font-size:0.92rem;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer;transition:opacity 0.2s}
.add-btn:disabled{opacity:0.6}
.already-badge{text-align:center;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:#10b981;padding:0.6rem;border-radius:10px;font-size:0.82rem;font-weight:700}
.other-firm-badge{text-align:center;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.15);color:#f87171;padding:0.6rem;border-radius:10px;font-size:0.82rem;font-weight:700}
.section{margin-top:1.5rem}
.section-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:#f0f4ff;margin-bottom:0.75rem}
.team-list{display:flex;flex-direction:column;gap:0.5rem}
.team-row{display:flex;align-items:center;gap:0.75rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:0.75rem}
.tr-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:#fff;position:relative;flex-shrink:0}
.tr-status{position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;border:2px solid #0d1538}
.tr-status.online{background:#10b981}.tr-status.busy{background:#f59e0b}.tr-status.offline{background:#64748b}
.tr-info{flex:1}
.tr-name{font-weight:700;font-size:0.85rem;color:#f0f4ff}
.tr-spec{font-size:0.7rem;color:#C9A84C;margin-top:0.1rem}
.remove-btn{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#f87171;width:30px;height:30px;border-radius:8px;font-size:0.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center}
/* Success */
.success-state{text-align:center;padding:2rem 0}
.ss-icon{font-size:3rem;margin-bottom:0.75rem}
.ss-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#f0f4ff;margin-bottom:0.5rem}
.ss-sub{font-size:0.88rem;color:rgba(240,244,255,0.55);margin-bottom:1.5rem}
.added-card{display:flex;align-items:center;gap:0.875rem;background:rgba(22,29,63,0.9);border:1px solid rgba(201,168,76,0.2);border-radius:16px;padding:1.25rem;margin-bottom:1.5rem;text-align:left}
.ac-av{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#fff;flex-shrink:0}
.ac-name{font-weight:700;font-size:1rem;color:#f0f4ff}
.ac-spec{font-size:0.75rem;color:#C9A84C;margin-top:0.15rem}
.ac-bc{font-size:0.72rem;color:rgba(240,244,255,0.38);margin-top:0.1rem}
.add-another-btn{width:100%;background:#C9A84C;color:#0A0F2C;border:none;border-radius:12px;padding:0.875rem;font-size:0.92rem;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer;margin-bottom:0.75rem}
.back-home-btn{display:block;text-align:center;color:rgba(240,244,255,0.55);text-decoration:none;font-size:0.85rem;font-weight:600}
</style>
