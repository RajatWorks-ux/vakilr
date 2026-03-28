
<template>
  <div class="page">
    <div class="page-bg"><div class="orb o1"></div></div>
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="page-title">Document Service</h1>
      <div class="session-type-badge">{{ docType }}</div>
    </div>

    <div class="pricing-card">
      <div class="pc-left">
        <div class="pc-label">Price per page</div>
        <div class="pc-price">₹{{ pricePerPage }}</div>
      </div>
      <div class="pc-divider"></div>
      <div class="pc-right">
        <div class="pc-item"><span>Platform takes</span><span class="gold">20%</span></div>
        <div class="pc-item"><span>Lawyer earns</span><span class="green">80%</span></div>
      </div>
    </div>

    <div class="doc-content">
      <!-- Step 1 -->
      <div class="step-card" :class="{ done: briefSubmitted }">
        <div class="step-num" :class="{ done: briefSubmitted }">{{ briefSubmitted ? '✓' : '01' }}</div>
        <div class="step-content">
          <h3 class="step-title">{{ docType === 'Review' ? 'Upload Document for Review' : 'Describe What You Need' }}</h3>
          <p class="step-desc">{{ docType === 'Review' ? 'Upload your document and describe what needs reviewing.' : 'Describe the document you want created. Be specific.' }}</p>
          <div v-if="!briefSubmitted">
            <textarea v-model="brief" rows="4" class="brief-input"
              :placeholder="docType === 'Review' ? 'E.g. Please review this NDA...' : 'E.g. Draft an NDA for a 2-year software partnership...'">
            </textarea>
            <div class="file-upload-area" @click="fileInput?.click()">
              <input ref="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.png" @change="handleFile" style="display:none" />
              <span class="fu-icon">{{ uploadedFile ? '✅' : '📎' }}</span>
              <span class="fu-label">{{ uploadedFile ? uploadedFile.name : (docType === 'Review' ? 'Upload your document (required)' : 'Attach reference (optional)') }}</span>
            </div>
            <div class="page-estimate">
              <label class="field-label">Estimated pages</label>
              <div class="page-stepper">
                <button class="step-btn" @click="estPages = Math.max(1, estPages - 1)">−</button>
                <span class="page-count">{{ estPages }}</span>
                <button class="step-btn" @click="estPages++">+</button>
              </div>
              <div class="estimate-cost">
                Est. total: <strong>₹{{ estPages * pricePerPage }}</strong>
                <span class="cost-note">(final bill after lawyer completes)</span>
              </div>
            </div>
            <div v-if="walletStore.balance < estPages * pricePerPage" class="wallet-warning">
              ⚠️ Your wallet balance (₹{{ walletStore.balance }}) may be insufficient.
              <router-link to="/client/wallet">Add funds →</router-link>
            </div>
            <button class="submit-btn"
              :disabled="!brief.trim() || (docType === 'Review' && !uploadedFile) || submittingBrief"
              @click="submitBrief">
              {{ submittingBrief ? 'Submitting...' : 'Submit Brief →' }}
            </button>
          </div>
          <div v-else class="brief-preview">
            <p>{{ brief }}</p>
            <div v-if="uploadedFile" class="attached-file">📎 {{ uploadedFile.name }}</div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="step-card" :class="{ active: briefSubmitted && !docReceived, done: docReceived }">
        <div class="step-num" :class="{ done: docReceived, active: briefSubmitted && !docReceived }">{{ docReceived ? '✓' : '02' }}</div>
        <div class="step-content">
          <h3 class="step-title">{{ docType === 'Review' ? 'Lawyer Reviewing' : 'Lawyer Drafting' }}</h3>
          <p class="step-desc">The lawyer is working on your document. Usually takes 15–60 minutes.</p>
          <div v-if="briefSubmitted && !docReceived" class="working-indicator">
            <div class="wi-dots"><span></span><span></span><span></span></div>
            <span>{{ docType === 'Review' ? 'Reviewing your document...' : 'Drafting your document...' }}</span>
          </div>
          <button v-if="briefSubmitted && !docReceived" class="simulate-btn" @click="simulateCompletion">
            🧪 Simulate Completion (Test)
          </button>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="step-card" :class="{ active: docReceived && !paid, done: paid }">
        <div class="step-num" :class="{ done: paid, active: docReceived && !paid }">{{ paid ? '✓' : '03' }}</div>
        <div class="step-content">
          <h3 class="step-title">Review & Pay</h3>
          <div v-if="docReceived && !paid" class="payment-step">
            <div class="final-bill">
              <div class="fb-header">Final Invoice</div>
              <div class="fb-row"><span>Pages completed</span><span>{{ completedPages }}</span></div>
              <div class="fb-row"><span>Price per page</span><span>₹{{ pricePerPage }}</span></div>
              <div class="fb-row platform"><span>Platform fee (20%)</span><span>₹{{ Math.floor(completedPages * pricePerPage * 0.2) }}</span></div>
              <div class="fb-row total"><span>Total</span><span>₹{{ completedPages * pricePerPage }}</span></div>
            </div>
            <div class="doc-preview-card">
              <span class="dp-icon">📄</span>
              <div>
                <div class="dp-name">{{ docName || 'Your Document.pdf' }}</div>
                <div class="dp-sub">{{ completedPages }} pages · Ready to download after payment</div>
              </div>
            </div>
            <button class="pay-btn"
              :disabled="paying || walletStore.balance < completedPages * pricePerPage"
              @click="payAndDownload">
              {{ paying ? 'Processing...' : `Pay ₹${completedPages * pricePerPage} & Download` }}
            </button>
          </div>

          <div v-if="paid" class="paid-section">
            <div class="paid-badge">✅ Paid · ₹{{ completedPages * pricePerPage }}</div>
            <div class="doc-download-card" @click="downloadDoc">
              <span>📄</span>
              <div>
                <div class="dd-name">{{ docName }}</div>
                <div class="dd-sub">Tap to download</div>
              </div>
              <span class="dl-icon">⬇</span>
            </div>
            <div v-if="!rated" class="rating-section">
              <p class="rate-prompt">Rate this service</p>
              <div class="stars-row">
                <button v-for="n in 5" :key="n" :class="['star-btn', { active: rating >= n }]" @click="rating = n">★</button>
              </div>
              <textarea v-model="reviewText" rows="2" placeholder="How was the document quality?" class="review-input"></textarea>
              <button class="submit-review-btn" @click="submitReview">Submit Review</button>
            </div>
            <div v-else class="rated-badge">⭐ Thank you for your review!</div>
            <button class="dispute-link" @click="$router.push('/client/dispute/' + sessionId)">
              ⚖️ Not satisfied? File a dispute
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const route       = useRoute()
const router      = useRouter()
const walletStore = useWalletStore()
const authStore   = useAuthStore()

const sessionId    = ref(route.params.id)
const docType      = ref(route.query.type || 'Drafting')
const pricePerPage = ref(Number(route.query.pricePerPage) || 300)
const lawyerId     = ref(route.query.lawyerId || '')

const brief          = ref('')
const uploadedFile   = ref(null)
const fileInput      = ref(null)
const estPages       = ref(3)
const briefSubmitted  = ref(false)
const submittingBrief = ref(false)

const docReceived    = ref(false)
const completedPages = ref(0)
const docName        = ref('')
const paying         = ref(false)
const paid           = ref(false)

const rating     = ref(0)
const reviewText = ref('')
const rated      = ref(false)

onMounted(() => {
  if (authStore.user) walletStore.fetch(authStore.user.id)
  loadSession()
})

async function loadSession() {
  const { data: session } = await supabase
    .from('sessions').select('*').eq('id', sessionId.value).single()
  if (session?.status === 'completed') {
    briefSubmitted.value  = true
    docReceived.value     = true
    completedPages.value  = session.total_amount / pricePerPage.value || estPages.value
    docName.value         = 'Document.pdf'
    if (session.total_amount > 0) paid.value = true
  }
}

function handleFile(e) { uploadedFile.value = e.target.files[0] }

async function submitBrief() {
  if (!brief.value.trim()) return
  submittingBrief.value = true
  await supabase.from('sessions').update({
    status: 'active',
    notes: JSON.stringify({ brief: brief.value, estPages: estPages.value, docType: docType.value }),
  }).eq('id', sessionId.value)
  submittingBrief.value = false
  briefSubmitted.value  = true
}

function simulateCompletion() {
  completedPages.value = estPages.value
  docName.value        = `Vakilr_Document_${Date.now()}.pdf`
  docReceived.value    = true
}

async function payAndDownload() {
  if (paying.value) return
  paying.value = true
  const total  = completedPages.value * pricePerPage.value
  const result = await walletStore.payForDocument(
    authStore.user.id, lawyerId.value, sessionId.value,
    completedPages.value, pricePerPage.value
  )
  if (result.success) {
    await supabase.from('sessions').update({
      status: 'completed',
      total_amount:    total,
      platform_fee:    result.platformFee,
      lawyer_earning:  result.lawyerEarning,
    }).eq('id', sessionId.value)
    paid.value = true
    if (navigator.vibrate) navigator.vibrate([50, 30, 100])
  }
  paying.value = false
}

function downloadDoc() {
  const content = `Vakilr Document\n\nDocument: ${docName.value}\nPages: ${completedPages.value}\n\n[Document content appears here in production]`
  const blob = new Blob([content], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = docName.value; a.click()
  URL.revokeObjectURL(url)
}

async function submitReview() {
  await supabase.from('reviews').insert({
    session_id: sessionId.value,
    client_id:  authStore.user.id,
    lawyer_id:  lawyerId.value,
    rating:     rating.value,
    comment:    reviewText.value,
  })
  rated.value = true
}
</script>

<style scoped>
.page { min-height: 100vh; background: #04071a; padding-bottom: 80px; }
.page-bg { position: fixed; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.1; }
.o1 { width: 300px; height: 300px; background: #C9A84C; top: 0; right: -100px; }
.page-header { display: flex; align-items: center; gap: 10px; padding: 3rem 1.5rem 1rem; position: relative; z-index: 1; }
.back-btn { color: #C9A84C; font-size: 1.4rem; background: none; border: none; cursor: pointer; }
.page-title { flex: 1; font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0f4ff; margin: 0; }
.session-type-badge { background: rgba(201,168,76,0.15); color: #C9A84C; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
.pricing-card { position: relative; z-index: 1; margin: 0 1.5rem 1.5rem; background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(10,15,44,0.9)); border: 1px solid rgba(201,168,76,0.25); border-radius: 16px; padding: 1rem 1.2rem; display: flex; align-items: center; gap: 1rem; }
.pc-left { text-align: center; }
.pc-label { font-family: 'DM Sans', sans-serif; font-size: 0.7rem; color: rgba(240,244,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
.pc-price { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #C9A84C; font-weight: 700; }
.pc-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
.pc-right { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.pc-item { display: flex; justify-content: space-between; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: rgba(240,244,255,0.6); }
.gold { color: #C9A84C !important; font-weight: 700; }
.green { color: #4ade80 !important; font-weight: 700; }
.doc-content { position: relative; z-index: 1; padding: 0 1.5rem; display: flex; flex-direction: column; gap: 12px; }
.step-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 1.2rem; display: flex; gap: 14px; transition: all 0.3s; }
.step-card.active { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.04); }
.step-card.done { border-color: rgba(34,197,94,0.2); }
.step-num { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 700; color: rgba(240,244,255,0.4); flex-shrink: 0; transition: all 0.3s; }
.step-num.active { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.4); color: #C9A84C; }
.step-num.done { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.4); color: #4ade80; }
.step-content { flex: 1; min-width: 0; }
.step-title { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700; color: #f0f4ff; margin: 0 0 4px; }
.step-desc { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: rgba(240,244,255,0.45); margin: 0 0 1rem; line-height: 1.5; }
.brief-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: #f0f4ff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; resize: vertical; margin-bottom: 10px; box-sizing: border-box; line-height: 1.5; }
.brief-input::placeholder { color: rgba(240,244,255,0.25); }
.brief-input:focus { outline: none; border-color: rgba(201,168,76,0.4); }
.file-upload-area { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.12); border-radius: 12px; padding: 12px; cursor: pointer; margin-bottom: 14px; transition: all 0.2s; }
.file-upload-area:active { border-color: rgba(201,168,76,0.4); }
.fu-icon { font-size: 1.1rem; }
.fu-label { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: rgba(240,244,255,0.5); }
.page-estimate { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 12px; margin-bottom: 12px; }
.field-label { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; color: rgba(240,244,255,0.5); text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 10px; }
.page-stepper { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
.step-btn { width: 32px; height: 32px; border-radius: 50%; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.page-count { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0f4ff; min-width: 30px; text-align: center; }
.estimate-cost { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(240,244,255,0.6); }
.estimate-cost strong { color: #C9A84C; }
.cost-note { color: rgba(240,244,255,0.35); font-size: 0.72rem; margin-left: 6px; }
.wallet-warning { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 10px 12px; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: #f87171; margin-bottom: 10px; }
.wallet-warning a { color: #C9A84C; }
.submit-btn { width: 100%; background: linear-gradient(135deg, #C9A84C, #a8893d); border: none; border-radius: 12px; padding: 13px; color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700; cursor: pointer; }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.brief-preview { background: rgba(255,255,255,0.04); border-radius: 10px; padding: 10px; }
.brief-preview p { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(240,244,255,0.7); margin: 0; line-height: 1.5; }
.attached-file { font-size: 0.75rem; color: #C9A84C; margin-top: 6px; }
.working-indicator { display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(201,168,76,0.06); border-radius: 10px; margin-bottom: 10px; }
.wi-dots { display: flex; gap: 4px; }
.wi-dots span { width: 6px; height: 6px; border-radius: 50%; background: #C9A84C; animation: dotPulse 1.2s infinite; }
.wi-dots span:nth-child(2) { animation-delay: 0.2s; }
.wi-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotPulse { 0%,80%,100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1.2); opacity: 1; } }
.working-indicator span { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(201,168,76,0.8); }
.simulate-btn { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; padding: 8px 14px; border-radius: 10px; cursor: pointer; width: 100%; }
.final-bill { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px; margin-bottom: 12px; }
.fb-header { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 700; color: rgba(240,244,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
.fb-row { display: flex; justify-content: space-between; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(240,244,255,0.6); padding: 4px 0; }
.fb-row.platform { color: rgba(240,244,255,0.4); font-size: 0.78rem; }
.fb-row.total { border-top: 1px solid rgba(255,255,255,0.08); margin-top: 6px; padding-top: 10px; color: #f0f4ff; font-weight: 700; }
.fb-row.total span:last-child { color: #C9A84C; font-size: 1rem; }
.doc-preview-card { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px; margin-bottom: 14px; }
.dp-icon { font-size: 1.8rem; }
.dp-name { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; color: #f0f4ff; }
.dp-sub { font-size: 0.72rem; color: rgba(240,244,255,0.4); margin-top: 2px; }
.pay-btn { width: 100%; background: linear-gradient(135deg, #C9A84C, #a8893d); border: none; border-radius: 14px; padding: 14px; color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700; cursor: pointer; }
.pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.paid-section { display: flex; flex-direction: column; gap: 12px; }
.paid-badge { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 700; padding: 0.5rem 1rem; border-radius: 100px; text-align: center; }
.doc-download-card { display: flex; align-items: center; gap: 12px; background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2); border-radius: 14px; padding: 14px; cursor: pointer; }
.doc-download-card span:first-child { font-size: 1.8rem; }
.dd-name { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; color: #f0f4ff; flex: 1; }
.dd-sub { font-size: 0.72rem; color: rgba(240,244,255,0.4); margin-top: 2px; }
.dl-icon { color: #C9A84C; font-size: 1.2rem; }
.rating-section { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1rem; display: flex; flex-direction: column; gap: 10px; }
.rate-prompt { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: rgba(240,244,255,0.7); margin: 0; }
.stars-row { display: flex; gap: 8px; }
.star-btn { background: none; border: none; font-size: 1.8rem; cursor: pointer; filter: grayscale(1); transition: filter 0.2s, transform 0.15s; padding: 0; }
.star-btn.active { filter: none; transform: scale(1.1); }
.review-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px; color: #f0f4ff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; resize: none; box-sizing: border-box; }
.review-input:focus { outline: none; border-color: rgba(201,168,76,0.4); }
.submit-review-btn { width: 100%; background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 700; padding: 10px; border-radius: 10px; cursor: pointer; }
.rated-badge { text-align: center; color: #10b981; font-family: 'DM Sans', sans-serif; font-weight: 700; padding: 0.75rem; background: rgba(16,185,129,0.08); border-radius: 10px; }
.dispute-link { background: none; border: 1px solid rgba(239,68,68,0.2); color: #f87171; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; padding: 10px; border-radius: 10px; cursor: pointer; width: 100%; }
</style>