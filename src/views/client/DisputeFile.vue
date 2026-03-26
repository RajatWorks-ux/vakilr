<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="page-title">File a Dispute</h1>
    </div>

    <div v-if="submitted" class="submitted-state">
      <div class="ss-icon">⚖️</div>
      <h2 class="ss-title">Dispute Filed</h2>
      <p class="ss-sub">Our team is reviewing your case. You'll receive a decision within <strong>12 hours</strong>.</p>
      <div class="ss-ref">Reference: #{{ disputeId?.slice(0,8).toUpperCase() }}</div>
      <div class="ss-info">
        <p>The review process is fair and impartial. Both parties will be considered. Decision will include exact reasoning.</p>
      </div>
      <router-link to="/client/sessions" class="ss-btn">Back to Sessions</router-link>
    </div>

    <div v-else class="dispute-content">
      <!-- Session Info -->
      <div class="session-info-card" v-if="session">
        <div class="sic-row">
          <span>Session Type</span>
          <span>{{ typeLabels[session.session_type] }}</span>
        </div>
        <div class="sic-row">
          <span>Amount Paid</span>
          <span class="sic-val">₹{{ session.total_amount?.toFixed(2) }}</span>
        </div>
        <div class="sic-row">
          <span>Duration</span>
          <span>{{ Math.floor((session.duration_seconds||0)/60) }} minutes</span>
        </div>
      </div>

      <!-- Dispute Tier Info -->
      <div class="tier-info">
        <span class="tier-icon">{{ tierIcon }}</span>
        <div>
          <div class="tier-label">Tier {{ disputeTier }} Dispute</div>
          <div class="tier-desc">{{ tierDesc }}</div>
        </div>
      </div>

      <!-- Form -->
      <div class="form-section">
        <div class="field">
          <label>Reason for Dispute</label>
          <select v-model="form.reason">
            <option value="">Select a reason</option>
            <option value="no_service">Lawyer didn't show up / no response</option>
            <option value="poor_quality">Service quality was very poor</option>
            <option value="wrong_advice">Wrong or misleading information given</option>
            <option value="technical_issue">Technical issues prevented session</option>
            <option value="overcharged">I was overcharged</option>
            <option value="other">Other reason</option>
          </select>
        </div>

        <div class="field">
          <label>Describe Your Complaint</label>
          <textarea
            v-model="form.description"
            rows="5"
            placeholder="Please describe exactly what happened. Be as specific as possible — this helps with fair resolution..."
            class="dispute-textarea"
          ></textarea>
          <p class="char-count">{{ form.description.length }}/500 characters</p>
        </div>

        <div class="field">
          <label>Amount You Want Refunded</label>
          <div class="amount-row">
            <span class="amount-prefix">₹</span>
            <input v-model.number="form.amount" type="number" :max="session?.total_amount" placeholder="0.00" />
          </div>
          <p class="amount-hint">Maximum: ₹{{ session?.total_amount?.toFixed(2) }}</p>
        </div>

        <div class="fairness-note">
          <span>⚖️</span>
          <p>All disputes are reviewed fairly. Both your claim and the lawyer's response are considered. Decision includes exact reasons and is final within 7 days.</p>
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button class="submit-btn" @click="submitDispute" :disabled="submitting || !form.reason || !form.description.trim()">
          {{ submitting ? 'Filing...' : 'File Dispute →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDisputeStore } from '@/stores/dispute'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const disputeStore = useDisputeStore()

const session    = ref(null)
const submitted  = ref(false)
const submitting = ref(false)
const disputeId  = ref('')
const error      = ref('')

const form = reactive({ reason: '', description: '', amount: 0 })

const typeLabels = { chat:'Chat Consultation', voice:'Voice Call', video:'Video Call', document_review:'Document Review', court_case:'Court Case' }

const disputeTier = computed(() => {
  const amt = session.value?.total_amount || 0
  if (amt < 2000) return 1
  if (amt < 25000) return 2
  return 3
})

const tierIcon = computed(() => ({ 1:'🤖', 2:'👤', 3:'⚖️' }[disputeTier.value]))
const tierDesc = computed(() => ({
  1: 'Auto-reviewed by AI within 12 hours. Decision with exact reasons.',
  2: 'Reviewed by moderator within 72 hours.',
  3: 'Senior review within 7 days. Final decision.',
}[disputeTier.value]))

async function submitDispute() {
  submitting.value = true
  error.value = ''
  try {
    const result = await disputeStore.fileDispute({
      sessionId:      route.params.id,
      filedBy:        auth.user.id,
      against:        session.value?.lawyer_id,
      reason:         form.reason,
      description:    form.description,
      amountDisputed: form.amount || session.value?.total_amount,
    })
    if (result.success) {
      disputeId.value = result.dispute.id
      submitted.value = true
    } else {
      error.value = result.error
    }
  } catch (e) {
    error.value = 'Failed to file dispute. Please try again.'
  }
  submitting.value = false
}

onMounted(async () => {
  const { data } = await supabase.from('sessions').select('*').eq('id', route.params.id).single()
  if (data) {
    session.value   = data
    form.amount     = data.total_amount || 0
  }
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:0.4rem 0.75rem;font-size:1.1rem;font-weight:700;cursor:pointer}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.submitted-state{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:3rem 1.5rem;gap:1rem}
.ss-icon{font-size:4rem;animation:pulse-icon 2s ease-in-out infinite}
@keyframes pulse-icon{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
.ss-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:#f0f4ff}
.ss-sub{font-size:0.9rem;color:rgba(240,244,255,0.65);line-height:1.7;max-width:300px}
.ss-sub strong{color:#f0f4ff}
.ss-ref{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);color:#C9A84C;padding:0.4rem 1rem;border-radius:100px;font-size:0.82rem;font-weight:700;letter-spacing:0.05em}
.ss-info{background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.18);border-radius:12px;padding:1rem;max-width:320px}
.ss-info p{font-size:0.8rem;color:rgba(240,244,255,0.6);line-height:1.6}
.ss-btn{background:#C9A84C;color:#0A0F2C;padding:0.875rem 2rem;border-radius:14px;text-decoration:none;font-weight:700;font-size:0.95rem}
.dispute-content{position:relative;z-index:1;padding:1.25rem;display:flex;flex-direction:column;gap:1rem}
.session-info-card{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1rem}
.sic-row{display:flex;justify-content:space-between;font-size:0.85rem;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.sic-row:last-child{border-bottom:none}
.sic-row span:first-child{color:rgba(240,244,255,0.5)}
.sic-row span:last-child{color:#f0f4ff;font-weight:600}
.sic-val{color:#C9A84C!important;font-family:'Playfair Display',serif;font-size:1rem!important}
.tier-info{display:flex;align-items:center;gap:0.875rem;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:0.875rem}
.tier-icon{font-size:1.5rem;flex-shrink:0}
.tier-label{font-weight:700;font-size:0.88rem;color:#f0f4ff}
.tier-desc{font-size:0.75rem;color:rgba(240,244,255,0.55);margin-top:0.15rem;line-height:1.5}
.form-section{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.25rem;display:flex;flex-direction:column;gap:0.875rem}
.field{display:flex;flex-direction:column;gap:0.4rem}
label{font-size:0.72rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em}
select,.dispute-textarea{background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;transition:border-color 0.2s;width:100%}
select{height:44px;padding:0 0.875rem;appearance:none}
.dispute-textarea{padding:0.75rem 0.875rem;resize:vertical;line-height:1.55}
select:focus,.dispute-textarea:focus{border-color:#C9A84C}
.char-count{font-size:0.68rem;color:rgba(240,244,255,0.3);text-align:right}
.amount-row{display:flex;align-items:center;position:relative}
.amount-prefix{position:absolute;left:0.875rem;color:#8892b0}
.amount-row input{width:100%;height:44px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.9rem;padding:0 0.875rem 0 1.8rem;outline:none}
.amount-row input:focus{border-color:#C9A84C}
.amount-hint{font-size:0.72rem;color:rgba(240,244,255,0.35)}
.fairness-note{display:flex;align-items:flex-start;gap:0.6rem;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.18);border-radius:10px;padding:0.875rem}
.fairness-note span{font-size:0.9rem;flex-shrink:0}
.fairness-note p{font-size:0.78rem;color:rgba(240,244,255,0.6);line-height:1.5}
.error-msg{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;padding:0.75rem;border-radius:10px;font-size:0.83rem}
.submit-btn{width:100%;padding:1rem;border-radius:14px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 0 24px rgba(201,168,76,0.3);transition:all 0.2s}
.submit-btn:disabled{opacity:0.35;cursor:not-allowed;box-shadow:none}
.submit-btn:not(:disabled):hover{background:#e0b84a}
</style>