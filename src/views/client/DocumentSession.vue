<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="page-title">Document Session</h1>
    </div>

    <div class="doc-content">
      <div class="status-card" :class="statusClass">
        <span class="status-icon">{{ statusIcon }}</span>
        <div>
          <div class="status-title">{{ statusTitle }}</div>
          <div class="status-sub">{{ statusSub }}</div>
        </div>
      </div>

      <!-- Step 1: Upload Brief -->
      <div class="step-card" :class="{ done: briefSubmitted }">
        <div class="step-num">01</div>
        <div class="step-content">
          <h3 class="step-title">Submit Your Brief</h3>
          <p class="step-desc">Describe what you need. Be as detailed as possible.</p>
          <textarea
            v-if="!briefSubmitted"
            v-model="brief"
            rows="5"
            placeholder="E.g. I need an NDA for a software development partnership. Both parties are Indian companies. Duration 2 years. Includes IP clauses..."
            class="brief-input"
          ></textarea>
          <div v-else class="brief-submitted">
            <p>{{ brief }}</p>
          </div>

          <!-- File Upload -->
          <div v-if="!briefSubmitted" class="file-upload-area" @click="fileInput?.click()">
            <input ref="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.png" @change="handleFile" style="display:none" />
            <span class="fu-icon">{{ uploadedFile ? '✅' : '📎' }}</span>
            <span class="fu-label">{{ uploadedFile ? uploadedFile.name : 'Attach document (optional)' }}</span>
          </div>

          <button v-if="!briefSubmitted" class="submit-brief-btn" :disabled="!brief.trim()" @click="submitBrief">
            Submit Brief →
          </button>
        </div>
      </div>

      <!-- Step 2: Lawyer Working -->
      <div class="step-card" :class="{ active: briefSubmitted && !docReceived, done: docReceived }">
        <div class="step-num">02</div>
        <div class="step-content">
          <h3 class="step-title">Lawyer Reviewing</h3>
          <p class="step-desc">The lawyer is working on your document. You'll be notified when it's ready.</p>
          <div v-if="briefSubmitted && !docReceived" class="working-indicator">
            <div class="wi-spinner"></div>
            <span>Lawyer is working on your request...</span>
          </div>
        </div>
      </div>

      <!-- Step 3: Download Document -->
      <div class="step-card" :class="{ active: docReceived }">
        <div class="step-num">03</div>
        <div class="step-content">
          <h3 class="step-title">Download Your Document</h3>
          <p class="step-desc">Your document is ready. Review and download.</p>
          <div v-if="docReceived" class="doc-download-card">
            <span class="dd-icon">📄</span>
            <div>
              <div class="dd-name">{{ completedDoc?.name || 'Your Document.pdf' }}</div>
              <div class="dd-size">Prepared by {{ lawyerName }}</div>
            </div>
            <a :href="completedDoc?.url || '#'" class="dd-btn" download>⬇ Download</a>
          </div>

          <!-- Review & Rate -->
          <div v-if="docReceived && !rated" class="rating-section">
            <p class="rate-prompt">Rate your experience</p>
            <div class="stars-row">
              <button v-for="n in 5" :key="n" :class="['star-btn', { active: rating >= n }]" @click="rating = n">★</button>
            </div>
            <textarea v-model="reviewText" rows="2" placeholder="Leave a comment (optional)" class="review-input"></textarea>
            <button class="submit-review-btn" @click="submitReview">Submit Review</button>
          </div>

          <!-- Dispute Option -->
          <div v-if="docReceived" class="dispute-option">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const clientStore = useClientStore()

const brief = ref('')
const briefSubmitted = ref(false)
const docReceived    = ref(false)
const completedDoc   = ref(null)
const uploadedFile   = ref(null)
const fileInput      = ref(null)
const rating         = ref(0)
const reviewText     = ref('')
const rated          = ref(false)
const sessionId      = route.params.id
const lawyerName     = ref('Lawyer')

const statusClass = computed(() => briefSubmitted.value ? (docReceived.value ? 'status-done' : 'status-progress') : 'status-waiting')
const statusIcon  = computed(() => briefSubmitted.value ? (docReceived.value ? '✅' : '⏳') : '📄')
const statusTitle = computed(() => briefSubmitted.value ? (docReceived.value ? 'Document Ready!' : 'In Progress') : 'Awaiting Your Brief')
const statusSub   = computed(() => briefSubmitted.value ? (docReceived.value ? 'Your document has been prepared' : 'Lawyer is working on your request') : 'Submit your brief to get started')

function handleFile(e) { uploadedFile.value = e.target.files[0] }

async function submitBrief() {
  await supabase.from('sessions').update({
    status: 'active',
    notes: brief.value,
    started_at: new Date().toISOString(),
  }).eq('id', sessionId)
  briefSubmitted.value = true

  // Poll for completion
  const poll = setInterval(async () => {
    const { data } = await supabase.from('sessions').select('status,notes').eq('id', sessionId).single()
    if (data?.status === 'completed') {
      docReceived.value = true
      completedDoc.value = { name: 'Document.pdf', url: '#' }
      clearInterval(poll)
    }
  }, 5000)
}

async function submitReview() {
  await clientStore.submitReview({
    sessionId, clientId: auth.user.id,
    lawyerId: sessionId,
    rating: rating.value,
    comment: reviewText.value,
  })
  rated.value = true
}

onMounted(async () => {
  const { data } = await supabase.from('sessions')
    .select('*, profiles:lawyer_id(full_name)')
    .eq('id', sessionId).single()
  if (data) {
    lawyerName.value = data.profiles?.full_name || 'Lawyer'
    if (data.notes) { brief.value = data.notes; briefSubmitted.value = true }
    if (data.status === 'completed') { docReceived.value = true; completedDoc.value = { name: 'Document.pdf', url: '#' } }
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
.doc-content{position:relative;z-index:1;padding:1.25rem;display:flex;flex-direction:column;gap:1rem}
.status-card{display:flex;align-items:center;gap:0.875rem;border-radius:14px;padding:1rem}
.status-waiting{background:rgba(100,116,139,0.1);border:1px solid rgba(100,116,139,0.2)}
.status-progress{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25)}
.status-done{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25)}
.status-icon{font-size:1.5rem;flex-shrink:0}
.status-title{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.status-sub{font-size:0.75rem;color:rgba(240,244,255,0.5);margin-top:0.15rem}
.step-card{background:rgba(22,29,63,0.7);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.25rem;display:flex;gap:1rem;opacity:0.5;transition:all 0.3s}
.step-card.active,.step-card.done{opacity:1;border-color:rgba(201,168,76,0.2)}
.step-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:rgba(201,168,76,0.25);flex-shrink:0;width:36px}
.step-card.done .step-num{color:#10b981}
.step-content{flex:1}
.step-title{font-weight:700;font-size:0.95rem;color:#f0f4ff;margin-bottom:0.4rem}
.step-desc{font-size:0.8rem;color:rgba(240,244,255,0.5);line-height:1.5;margin-bottom:0.875rem}
.brief-input,.review-input{width:100%;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.85rem;padding:0.75rem;outline:none;resize:vertical;line-height:1.55;margin-bottom:0.75rem}
.brief-input:focus,.review-input:focus{border-color:#C9A84C}
.brief-submitted{background:rgba(10,15,44,0.5);border-radius:10px;padding:0.875rem;font-size:0.83rem;color:rgba(240,244,255,0.7);line-height:1.6}
.file-upload-area{display:flex;align-items:center;gap:0.75rem;border:1.5px dashed rgba(255,255,255,0.12);border-radius:10px;padding:0.75rem;cursor:pointer;margin-bottom:0.75rem;transition:border-color 0.2s}
.file-upload-area:hover{border-color:rgba(201,168,76,0.3)}
.fu-icon{font-size:1.3rem}
.fu-label{font-size:0.8rem;color:rgba(240,244,255,0.5)}
.submit-brief-btn{width:100%;padding:0.875rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer}
.submit-brief-btn:disabled{opacity:0.35;cursor:not-allowed}
.working-indicator{display:flex;align-items:center;gap:0.75rem;font-size:0.82rem;color:rgba(240,244,255,0.55)}
.wi-spinner{width:18px;height:18px;border:2px solid rgba(201,168,76,0.3);border-top-color:#C9A84C;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.doc-download-card{display:flex;align-items:center;gap:0.875rem;background:rgba(10,15,44,0.6);border-radius:12px;padding:0.875rem;margin-bottom:0.875rem}
.dd-icon{font-size:2rem;flex-shrink:0}
.dd-name{font-weight:600;font-size:0.88rem;color:#f0f4ff}
.dd-size{font-size:0.72rem;color:rgba(240,244,255,0.4);margin-top:0.1rem}
.dd-btn{margin-left:auto;background:#C9A84C;color:#0A0F2C;border-radius:8px;padding:0.4rem 0.875rem;font-weight:700;font-size:0.78rem;text-decoration:none;white-space:nowrap}
.rating-section{background:rgba(10,15,44,0.5);border-radius:12px;padding:1rem;margin-top:0.75rem}
.rate-prompt{font-size:0.85rem;color:#f0f4ff;font-weight:600;margin-bottom:0.6rem}
.stars-row{display:flex;gap:0.4rem;margin-bottom:0.75rem}
.star-btn{background:none;border:none;font-size:1.5rem;cursor:pointer;color:rgba(240,244,255,0.2);transition:color 0.2s;padding:0}
.star-btn.active{color:#C9A84C}
.submit-review-btn{width:100%;padding:0.75rem;border-radius:10px;border:none;background:#10b981;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.88rem;font-weight:700;cursor:pointer;margin-top:0.5rem}
.dispute-option{margin-top:0.75rem;text-align:center}
.dispute-link{background:none;border:none;color:rgba(240,244,255,0.4);font-family:'DM Sans',sans-serif;font-size:0.78rem;cursor:pointer;text-decoration:underline}
</style>