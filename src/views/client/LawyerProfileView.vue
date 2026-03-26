<template>
  <div class="page">
    <div class="page-bg"></div>

    <div v-if="loading" class="loading-full">
      <div class="spinner"></div>
    </div>

    <template v-else-if="lawyer">
      <!-- Hero -->
      <div class="profile-hero">
        <button class="back-btn" @click="$router.back()">←</button>
        <div class="hero-avatar" :style="{ background: getColor(lawyer.profiles?.full_name) }">
          <img v-if="lawyer.profiles?.avatar_url" :src="lawyer.profiles.avatar_url" class="avatar-img" />
          <span v-else>{{ getInitials(lawyer.profiles?.full_name) }}</span>
          <div class="hero-status" :class="lawyer.availability_status"></div>
        </div>
        <h1 class="hero-name">{{ lawyer.profiles?.full_name }}</h1>
        <div class="hero-specs">
          <span v-for="s in lawyer.specializations?.slice(0,3)" :key="s" class="spec-tag">{{ s }}</span>
        </div>
        <div class="hero-meta">
          <span>📍 {{ lawyer.city }}</span>
          <span>·</span>
          <span>{{ lawyer.experience_years }} years exp.</span>
          <span>·</span>
          <span>⭐ {{ lawyer.rating || '—' }}</span>
        </div>
        <div class="hero-badges">
          <span v-if="lawyer.profiles?.is_verified" class="badge-verified">✓ Verified</span>
          <span class="badge-cases">{{ lawyer.total_cases || 0 }} Cases</span>
          <span class="badge-response">~{{ lawyer.avg_response_minutes || 10 }}m response</span>
        </div>
      </div>

      <!-- Save Button -->
      <div class="action-bar">
        <button class="save-btn" @click="toggleSave">
          {{ isSaved ? '❤️ Saved' : '🤍 Save' }}
        </button>
        <button class="share-btn" @click="copyLink">📤 Share</button>
      </div>

      <!-- Bio -->
      <div class="section-card" v-if="lawyer.bio">
        <h3 class="sc-title">About</h3>
        <p class="sc-text">{{ lawyer.bio }}</p>
      </div>

      <!-- Services -->
      <div class="section-card" v-if="activeServices.length">
        <h3 class="sc-title">Services & Pricing</h3>
        <div class="services-list">
          <div class="service-row" v-for="svc in activeServices" :key="svc.id">
            <div class="sr-left">
              <span class="sr-icon">{{ typeIcons[svc.service_type] || '⚖️' }}</span>
              <div>
                <div class="sr-name">{{ svc.service_name }}</div>
                <div class="sr-type">{{ typeLabels[svc.service_type] }}</div>
              </div>
            </div>
            <div class="sr-right">
              <span class="sr-price">₹{{ svc.price_amount }}{{ unitLabels[svc.price_unit] }}</span>
              <button class="sr-book" @click="selectService(svc)">Book</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Court Cases Info -->
      <div class="section-card court-info">
        <h3 class="sc-title">🏛️ Court Representation</h3>
        <p class="sc-text">This lawyer accepts long-term court cases. Vakilr charges a one-time placement fee. After that, you negotiate directly.</p>
        <div class="court-fee-info">
          <div class="cfi-item">
            <span class="cfi-label">Placement Fee</span>
            <span class="cfi-val">{{ getPlacementFee() }}</span>
          </div>
          <div class="cfi-item">
            <span class="cfi-label">Avg Per Hearing</span>
            <span class="cfi-val">₹{{ lawyer.avg_hearing_fee || '—' }}</span>
          </div>
        </div>
        <p class="court-note">⚠️ Price can bargain per hearing. Can increase or decrease based on case complexity. Normal case average is ₹{{ lawyer.avg_hearing_fee || '—' }}.</p>
        <button class="court-hire-btn" @click="selectCourtCase">Hire for Court Case</button>
      </div>

      <!-- Languages -->
      <div class="section-card" v-if="lawyer.languages?.length">
        <h3 class="sc-title">Languages</h3>
        <div class="langs-wrap">
          <span v-for="l in lawyer.languages" :key="l" class="lang-tag">{{ l }}</span>
        </div>
      </div>

      <!-- Availability -->
      <div class="section-card" v-if="lawyer.availability?.length">
        <h3 class="sc-title">Availability</h3>
        <div class="avail-list">
          <div class="avail-row" v-for="a in lawyer.availability.filter(x=>x.is_available)" :key="a.day_of_week">
            <span class="avail-day">{{ dayNames[a.day_of_week] }}</span>
            <span class="avail-time">{{ a.start_time }} — {{ a.end_time }}</span>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="section-card">
        <div class="sc-header-row">
          <h3 class="sc-title">Reviews</h3>
          <span class="sc-rating">⭐ {{ lawyer.rating || '—' }} ({{ reviews.length }})</span>
        </div>
        <div v-if="reviews.length === 0" class="empty-mini">No reviews yet</div>
        <div class="review-item" v-for="r in reviews.slice(0,5)" :key="r.id">
          <div class="ri-top">
            <div class="ri-av">{{ getInitials(r.profiles?.full_name) }}</div>
            <div>
              <div class="ri-name">{{ r.profiles?.full_name || 'Client' }}</div>
              <div class="ri-stars">{{ '★'.repeat(r.rating) }}</div>
            </div>
            <span class="ri-date">{{ formatDate(r.created_at) }}</span>
          </div>
          <p class="ri-comment" v-if="r.comment">{{ r.comment }}</p>
        </div>
      </div>

      <!-- Sticky CTA -->
      <div class="sticky-cta">
        <div class="cta-price">
          From ₹{{ getMinRate() }}<span>/min</span>
        </div>
        <button
          class="cta-btn"
          @click="quickConsult"
          :disabled="lawyer.availability_status === 'offline'"
        >
          {{ lawyer.availability_status === 'offline' ? 'Currently Offline' : 'Consult Now →' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'

const route       = useRoute()
const router      = useRouter()
const auth        = useAuthStore()
const clientStore = useClientStore()

const lawyer   = ref(null)
const reviews  = ref([])
const loading  = ref(true)
const isSaved  = ref(false)

const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const typeIcons  = { chat:'💬', voice:'📞', video:'🎥', document_review:'📄', will_draft:'📜', nda:'🤝', custom:'⚙️' }
const typeLabels = { chat:'Chat Consultation', voice:'Voice Call', video:'Video Call', document_review:'Document Review', will_draft:'Will Drafting', nda:'NDA', custom:'Custom' }
const unitLabels = { per_minute:'/min', flat:' flat', per_document:'/doc' }

const activeServices = computed(() => lawyer.value?.lawyer_services?.filter(s => s.is_active) || [])

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
function getColor(name) {
  let h = 0; for (const c of (name||'')) h = (h*31 + c.charCodeAt(0)) % colors.length
  return `linear-gradient(135deg, ${colors[h]}, ${colors[(h+1)%colors.length]})`
}
function getInitials(name) { return (name||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
function getMinRate() {
  const svcs = activeServices.value.filter(s => s.price_unit === 'per_minute')
  if (svcs.length) return Math.min(...svcs.map(s => s.price_amount))
  return '—'
}
function getPlacementFee() {
  const exp = lawyer.value?.experience_years || 0
  if (exp < 5)  return '₹999'
  if (exp < 10) return '₹2,499'
  if (exp < 20) return '₹3,999'
  return '₹4,999'
}
function formatDate(ts) { return new Date(ts).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) }

function toggleSave() {
  if (!auth.user?.id) return
  isSaved.value = clientStore.toggleSaveLawyer(auth.user.id, route.params.id)
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  alert('Link copied!')
}

function selectService(svc) {
  router.push(`/client/service-select?lawyerId=${route.params.id}&serviceId=${svc.id}`)
}

function selectCourtCase() {
  router.push(`/client/service-select?lawyerId=${route.params.id}&type=court_case`)
}

function quickConsult() {
  const chatSvc = activeServices.value.find(s => s.service_type === 'chat')
  if (chatSvc) selectService(chatSvc)
  else router.push(`/client/service-select?lawyerId=${route.params.id}`)
}

onMounted(async () => {
  const id = route.params.id
  lawyer.value = await clientStore.getLawyerProfile(id)
  reviews.value = await clientStore.getReviewsForLawyer(id)
  if (auth.user?.id) isSaved.value = clientStore.isSaved(auth.user.id, id)
  loading.value = false
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative;padding-bottom:80px}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.loading-full{height:100vh;display:flex;align-items:center;justify-content:center}
.spinner{width:40px;height:40px;border:3px solid rgba(201,168,76,0.3);border-top-color:#C9A84C;border-radius:50%;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.profile-hero{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;padding:1.5rem 1.25rem 1.25rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{position:absolute;top:1.25rem;left:1.25rem;color:#C9A84C;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:0.4rem 0.75rem;font-size:1.1rem;font-weight:700;cursor:pointer}
.hero-avatar{width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#fff;position:relative;border:3px solid rgba(201,168,76,0.4);box-shadow:0 0 24px rgba(201,168,76,0.2);margin-bottom:1rem;overflow:hidden}
.avatar-img{width:100%;height:100%;object-fit:cover}
.hero-status{position:absolute;bottom:3px;right:3px;width:16px;height:16px;border-radius:50%;border:2px solid #04071a}
.hero-status.online{background:#10b981;box-shadow:0 0 8px #10b981}
.hero-status.busy{background:#f59e0b}
.hero-status.offline{background:#64748b}
.hero-name{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#f0f4ff;margin-bottom:0.6rem}
.hero-specs{display:flex;flex-wrap:wrap;gap:0.4rem;justify-content:center;margin-bottom:0.6rem}
.spec-tag{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.22);color:#C9A84C;padding:0.22rem 0.65rem;border-radius:100px;font-size:0.72rem;font-weight:600}
.hero-meta{display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:rgba(240,244,255,0.5);margin-bottom:0.75rem;flex-wrap:wrap;justify-content:center}
.hero-badges{display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center}
.badge-verified{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#10b981;padding:0.2rem 0.65rem;border-radius:100px;font-size:0.7rem;font-weight:700}
.badge-cases,.badge-response{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(240,244,255,0.6);padding:0.2rem 0.65rem;border-radius:100px;font-size:0.7rem;font-weight:600}
.action-bar{position:relative;z-index:1;display:flex;gap:0.75rem;padding:0.875rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.save-btn,.share-btn{flex:1;padding:0.6rem;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(22,29,63,0.8);color:rgba(240,244,255,0.7);font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.2s}
.save-btn:hover,.share-btn:hover{border-color:rgba(201,168,76,0.3);color:#C9A84C}
.section-card{position:relative;z-index:1;margin:0.75rem 1.25rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.25rem}
.court-info{border-color:rgba(201,168,76,0.2)}
.sc-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#C9A84C;margin-bottom:0.875rem}
.sc-text{font-size:0.85rem;color:rgba(240,244,255,0.65);line-height:1.7}
.sc-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.875rem}
.sc-rating{font-size:0.82rem;color:rgba(240,244,255,0.5)}
.services-list{display:flex;flex-direction:column;gap:0.75rem}
.service-row{display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:rgba(10,15,44,0.5);border-radius:10px}
.sr-left{display:flex;align-items:center;gap:0.65rem}
.sr-icon{font-size:1.3rem}
.sr-name{font-weight:600;font-size:0.85rem;color:#f0f4ff}
.sr-type{font-size:0.68rem;color:#C9A84C;margin-top:0.1rem}
.sr-right{display:flex;align-items:center;gap:0.6rem}
.sr-price{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:#C9A84C}
.sr-book{background:#C9A84C;color:#0A0F2C;border:none;border-radius:8px;padding:0.35rem 0.875rem;font-weight:700;font-size:0.78rem;cursor:pointer}
.court-fee-info{display:flex;gap:1.5rem;margin:0.875rem 0}
.cfi-item{flex:1}
.cfi-label{display:block;font-size:0.68rem;color:#C9A84C;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.2rem}
.cfi-val{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0d080}
.court-note{font-size:0.72rem;color:rgba(240,244,255,0.4);line-height:1.5;margin:0.5rem 0 0.875rem;font-style:italic}
.court-hire-btn{width:100%;padding:0.75rem;border-radius:12px;border:1px solid rgba(201,168,76,0.3);background:rgba(201,168,76,0.1);color:#C9A84C;font-family:'DM Sans',sans-serif;font-size:0.88rem;font-weight:700;cursor:pointer}
.langs-wrap{display:flex;flex-wrap:wrap;gap:0.4rem}
.lang-tag{background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);color:#60a5fa;padding:0.22rem 0.65rem;border-radius:100px;font-size:0.72rem;font-weight:600}
.avail-list{display:flex;flex-direction:column;gap:0.5rem}
.avail-row{display:flex;justify-content:space-between;font-size:0.83rem}
.avail-day{color:rgba(240,244,255,0.7);font-weight:600}
.avail-time{color:#C9A84C}
.empty-mini{font-size:0.82rem;color:rgba(240,244,255,0.35);font-style:italic}
.review-item{padding:0.875rem 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.review-item:last-child{border-bottom:none}
.ri-top{display:flex;align-items:center;gap:0.65rem;margin-bottom:0.5rem}
.ri-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#fff;flex-shrink:0}
.ri-name{font-weight:600;font-size:0.82rem;color:#f0f4ff}
.ri-stars{color:#C9A84C;font-size:0.72rem;margin-top:0.1rem}
.ri-date{font-size:0.68rem;color:rgba(240,244,255,0.35);margin-left:auto}
.ri-comment{font-size:0.8rem;color:rgba(240,244,255,0.6);line-height:1.6;font-style:italic}
.sticky-cta{position:fixed;bottom:0;left:0;right:0;z-index:50;display:flex;align-items:center;gap:1rem;padding:0.875rem 1.25rem;background:rgba(4,7,26,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.08)}
.cta-price{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:900;color:#C9A84C;flex-shrink:0}
.cta-price span{font-family:'DM Sans',sans-serif;font-size:0.75rem;color:rgba(240,244,255,0.4);font-weight:400}
.cta-btn{flex:1;padding:0.875rem;border-radius:14px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.2s}
.cta-btn:disabled{opacity:0.35;cursor:not-allowed}
.cta-btn:not(:disabled):hover{background:#e0b84a}
</style>