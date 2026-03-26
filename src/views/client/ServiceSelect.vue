<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="page-title">Select Service</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="service-content">
      <!-- Lawyer Mini Card -->
      <div class="lawyer-mini" v-if="lawyer">
        <div class="lm-av" :style="{ background: getColor(lawyer.profiles?.full_name) }">
          {{ getInitials(lawyer.profiles?.full_name) }}
          <div class="lm-status" :class="lawyer.availability_status"></div>
        </div>
        <div class="lm-info">
          <div class="lm-name">{{ lawyer.profiles?.full_name }}</div>
          <div class="lm-spec">{{ lawyer.specializations?.[0] }} · {{ lawyer.city }}</div>
        </div>
        <div class="lm-rating">⭐ {{ lawyer.rating || '—' }}</div>
      </div>

      <!-- Service Options -->
      <h2 class="choose-title">Choose a Service</h2>
      <div class="services-list">
        <button
          v-for="svc in availableServices" :key="svc.id"
          :class="['svc-card', { selected: selectedService?.id === svc.id }]"
          @click="selectedService = svc"
        >
          <div class="svc-left">
            <span class="svc-icon">{{ typeIcons[svc.service_type] }}</span>
            <div>
              <div class="svc-name">{{ svc.service_name }}</div>
              <div class="svc-type">{{ typeDesc[svc.service_type] }}</div>
            </div>
          </div>
          <div class="svc-right">
            <div class="svc-price">₹{{ svc.price_amount }}<span>{{ unitLabels[svc.price_unit] }}</span></div>
            <div class="svc-check" :class="{ active: selectedService?.id === svc.id }">✓</div>
          </div>
        </button>

        <!-- Court Case Option -->
        <button
          v-if="showCourtCase"
          :class="['svc-card court-card', { selected: selectedType === 'court_case' }]"
          @click="selectedType = 'court_case'; selectedService = null"
        >
          <div class="svc-left">
            <span class="svc-icon">🏛️</span>
            <div>
              <div class="svc-name">Court Representation</div>
              <div class="svc-type">Long-term case handling</div>
            </div>
          </div>
          <div class="svc-right">
            <div class="svc-price">{{ placementFee }}<span class="svc-fee-note">one-time</span></div>
            <div class="svc-check" :class="{ active: selectedType === 'court_case' }">✓</div>
          </div>
        </button>
      </div>

      <!-- Court Case Note -->
      <div v-if="selectedType === 'court_case'" class="court-note-box">
        <p>After paying the placement fee, you negotiate directly with the lawyer. Platform takes no further commission.</p>
        <p style="margin-top:0.5rem">⚠️ Avg per hearing: ₹{{ lawyer?.avg_hearing_fee || '—' }} — price can vary based on case complexity.</p>
      </div>

      <!-- Session Note for timed services -->
      <div v-if="selectedService?.price_unit === 'per_minute'" class="timed-note">
        <span>⏱️</span>
        <p>Timer starts when lawyer accepts. You'll see live cost during session. You can extend or end anytime.</p>
      </div>

      <!-- Initial Amount for timed -->
      <div v-if="selectedService?.price_unit === 'per_minute'" class="prepay-section">
        <label class="prepay-label">Pre-pay for (minutes)</label>
        <div class="prepay-row">
          <button v-for="m in [10,20,30,60]" :key="m"
            :class="['prepay-btn', { active: prepayMinutes === m }]"
            @click="prepayMinutes = m">{{ m }}m</button>
        </div>
        <p class="prepay-total">
          You'll pay: <strong>₹{{ selectedService ? selectedService.price_amount * prepayMinutes : 0 }}</strong>
          for {{ prepayMinutes }} minutes
        </p>
      </div>

      <button
        class="proceed-btn"
        :disabled="!selectedService && selectedType !== 'court_case'"
        @click="proceed"
      >
        Proceed to Payment →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientStore } from '@/stores/client'

const route       = useRoute()
const router      = useRouter()
const clientStore = useClientStore()

const lawyer          = ref(null)
const loading         = ref(true)
const selectedService = ref(null)
const selectedType    = ref('')
const prepayMinutes   = ref(10)

const showCourtCase = computed(() => route.query.type === 'court_case' || true)

const availableServices = computed(() =>
  lawyer.value?.lawyer_services?.filter(s => s.is_active && s.service_type !== 'custom') || []
)

const placementFee = computed(() => {
  const exp = lawyer.value?.experience_years || 0
  if (exp < 5)  return '₹999'
  if (exp < 10) return '₹2,499'
  if (exp < 20) return '₹3,999'
  return '₹4,999'
})

const typeIcons = { chat:'💬', voice:'📞', video:'🎥', document_review:'📄', will_draft:'📜', nda:'🤝', custom:'⚙️' }
const typeDesc  = { chat:'Real-time text chat', voice:'Audio call', video:'Face-to-face video', document_review:'Upload & get review', will_draft:'Professional will drafting', nda:'NDA creation', custom:'Custom service' }
const unitLabels = { per_minute:'/min', flat:' flat', per_document:'/doc' }

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6']
function getColor(name) {
  let h=0; for(const c of(name||''))h=(h*31+c.charCodeAt(0))%colors.length
  return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`
}
function getInitials(name){return(name||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}

function proceed() {
  const params = new URLSearchParams({
    lawyerId: route.query.lawyerId,
    ...(selectedService.value ? { serviceId: selectedService.value.id, serviceType: selectedService.value.service_type, rate: selectedService.value.price_amount, unit: selectedService.value.price_unit, minutes: prepayMinutes.value } : {}),
    ...(selectedType.value === 'court_case' ? { serviceType: 'court_case', rate: placementFee.value.replace('₹','').replace(',','') } : {}),
  })
  router.push(`/client/payment?${params}`)
}

onMounted(async () => {
  const lid = route.query.lawyerId
  if (lid) lawyer.value = await clientStore.getLawyerProfile(lid)
  if (route.query.serviceId) {
    selectedService.value = lawyer.value?.lawyer_services?.find(s => s.id === route.query.serviceId)
  }
  if (route.query.type === 'court_case') selectedType.value = 'court_case'
  loading.value = false
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:0.4rem 0.75rem;font-size:1.1rem;font-weight:700;cursor:pointer}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.loading-state{height:60vh;display:flex;align-items:center;justify-content:center}
.spinner{width:36px;height:36px;border:3px solid rgba(201,168,76,0.3);border-top-color:#C9A84C;border-radius:50%;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.service-content{position:relative;z-index:1;padding:1.25rem}
.lawyer-mini{display:flex;align-items:center;gap:0.75rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1rem;margin-bottom:1.5rem}
.lm-av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;color:#fff;position:relative;flex-shrink:0}
.lm-status{position:absolute;bottom:0;right:0;width:11px;height:11px;border-radius:50%;border:2px solid #0d1538}
.lm-status.online{background:#10b981}.lm-status.busy{background:#f59e0b}.lm-status.offline{background:#64748b}
.lm-info{flex:1}
.lm-name{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.lm-spec{font-size:0.72rem;color:#C9A84C;margin-top:0.1rem}
.lm-rating{font-size:0.85rem;color:rgba(240,244,255,0.6);font-weight:600}
.choose-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff;margin-bottom:1rem}
.services-list{display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem}
.svc-card{display:flex;align-items:center;justify-content:space-between;background:rgba(22,29,63,0.8);border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;padding:1rem;cursor:pointer;text-align:left;transition:all 0.2s;width:100%}
.svc-card:hover{border-color:rgba(201,168,76,0.3)}
.svc-card.selected{border-color:#C9A84C;background:rgba(201,168,76,0.08);box-shadow:0 0 0 3px rgba(201,168,76,0.08)}
.court-card{border-color:rgba(201,168,76,0.15)}
.svc-left{display:flex;align-items:center;gap:0.75rem}
.svc-icon{font-size:1.6rem}
.svc-name{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.svc-type{font-size:0.72rem;color:rgba(240,244,255,0.5);margin-top:0.1rem}
.svc-right{display:flex;align-items:center;gap:0.75rem}
.svc-price{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#C9A84C;text-align:right}
.svc-price span{font-family:'DM Sans',sans-serif;font-size:0.68rem;color:rgba(240,244,255,0.4);font-weight:400}
.svc-fee-note{display:block;font-family:'DM Sans',sans-serif;font-size:0.62rem;color:rgba(240,244,255,0.35);font-weight:400}
.svc-check{width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:transparent;transition:all 0.2s;flex-shrink:0}
.svc-check.active{background:#C9A84C;border-color:#C9A84C;color:#0A0F2C}
.court-note-box{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:0.875rem;margin-bottom:1rem}
.court-note-box p{font-size:0.8rem;color:rgba(240,244,255,0.65);line-height:1.6}
.timed-note{display:flex;gap:0.6rem;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.18);border-radius:12px;padding:0.875rem;margin-bottom:1rem}
.timed-note span{font-size:1rem;flex-shrink:0}
.timed-note p{font-size:0.8rem;color:rgba(240,244,255,0.6);line-height:1.5}
.prepay-section{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1rem;margin-bottom:1.25rem}
.prepay-label{display:block;font-size:0.72rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.75rem}
.prepay-row{display:flex;gap:0.5rem;margin-bottom:0.75rem}
.prepay-btn{flex:1;padding:0.6rem;border-radius:10px;border:1.5px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.2s}
.prepay-btn.active{background:rgba(201,168,76,0.12);border-color:#C9A84C;color:#C9A84C}
.prepay-total{font-size:0.82rem;color:rgba(240,244,255,0.6)}
.prepay-total strong{color:#C9A84C}
.proceed-btn{width:100%;padding:1rem;border-radius:14px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 0 24px rgba(201,168,76,0.3);transition:all 0.2s}
.proceed-btn:disabled{opacity:0.35;cursor:not-allowed;box-shadow:none}
.proceed-btn:not(:disabled):hover{background:#e0b84a;transform:translateY(-1px)}
</style>