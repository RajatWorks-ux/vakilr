<template>
  <div class="session-page">
    <div class="session-bg"></div>

    <!-- Header -->
    <div class="session-header">
      <div class="sh-client">
        <div class="sh-avatar">{{ clientInitials }}</div>
        <div>
          <div class="sh-name">{{ clientName }}</div>
          <div class="sh-type">{{ typeLabels[session?.session_type] }}</div>
        </div>
      </div>
      <div class="sh-timer">
        <div class="timer-ring">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(201,168,76,0.15)" stroke-width="4"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#C9A84C" stroke-width="4"
              stroke-linecap="round" stroke-dasharray="175.9"
              :stroke-dashoffset="175.9 * (1 - (sessionStore.timerSeconds % 60) / 60)"
              transform="rotate(-90 32 32)" style="transition:stroke-dashoffset 1s linear"/>
          </svg>
          <div class="timer-text">{{ sessionStore.formattedTime }}</div>
        </div>
        <div class="sh-cost">{{ sessionStore.formattedCost }}</div>
      </div>
    </div>

    <!-- Chat Session -->
    <template v-if="session?.session_type === 'chat'">
      <div class="chat-messages" ref="messagesEl">
        <div
          v-for="msg in sessionStore.messages" :key="msg.id"
          :class="['message', msg.sender_id === myId ? 'mine' : 'theirs']"
        >
          <div class="msg-bubble">{{ msg.content }}</div>
          <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
        </div>
      </div>
      <div class="chat-input-bar">
        <input
          v-model="chatInput"
          placeholder="Type your message..."
          @keydown.enter="sendMessage"
          class="chat-input"
        />
        <button class="send-btn" @click="sendMessage">→</button>
      </div>
    </template>

    <!-- Voice/Video Call -->
    <template v-else-if="['voice','video'].includes(session?.session_type)">
      <div class="call-area">
        <video v-if="session?.session_type === 'video'" ref="remoteVideo" class="remote-video" autoplay playsinline></video>
        <div v-else class="voice-call-ui">
          <div class="vc-avatar">{{ clientInitials }}</div>
          <p class="vc-status">{{ callStatus }}</p>
        </div>
        <video v-if="session?.session_type === 'video'" ref="localVideo" class="local-video" autoplay playsinline muted></video>
        <div class="call-controls">
          <button class="call-btn" @click="toggleAudio" :class="{ off: !audioOn }">
            {{ audioOn ? '🎙️' : '🔇' }}
          </button>
          <button v-if="session?.session_type === 'video'" class="call-btn" @click="toggleVideo" :class="{ off: !videoOn }">
            {{ videoOn ? '📷' : '📷' }}
          </button>
          <button class="call-btn end-call" @click="endSession">📵</button>
        </div>
      </div>
    </template>

    <!-- Document Session -->
    <template v-else-if="session?.session_type === 'document'">
      <div class="doc-area">
        <div class="doc-card">
          <span class="doc-icon">📄</span>
          <h3>Document Review Session</h3>
          <p>Review the client's document and provide your legal assessment.</p>
          <div v-if="session?.notes" class="doc-brief">
            <label>Client Brief</label>
            <p>{{ session.notes }}</p>
          </div>
          <button class="doc-submit-btn" @click="markDocComplete">
            ✓ Mark as Complete
          </button>
        </div>
      </div>
    </template>

    <!-- End Session Button -->
    <div class="end-session-bar">
      <button class="end-btn" @click="confirmEnd">End Session</button>
    </div>

    <!-- End Confirmation Modal -->
    <div v-if="showEndModal" class="modal-overlay" @click.self="showEndModal = false">
      <div class="modal">
        <h3 class="modal-title">End Session?</h3>
        <p class="modal-msg">Total: <strong>{{ sessionStore.formattedCost }}</strong><br/>Duration: <strong>{{ sessionStore.formattedTime }}</strong></p>
        <div class="modal-actions">
          <button class="modal-cancel" @click="showEndModal = false">Continue Session</button>
          <button class="modal-end" @click="endSession">End & Collect</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSessionStore } from '@/stores/session'
import { VakilrCall } from '@/lib/realtime'

const route        = useRoute()
const router       = useRouter()
const auth         = useAuthStore()
const sessionStore = useSessionStore()

const chatInput   = ref('')
const messagesEl  = ref(null)
const remoteVideo = ref(null)
const localVideo  = ref(null)
const showEndModal = ref(false)
const audioOn     = ref(true)
const videoOn     = ref(true)
const callStatus  = ref('Connecting...')
let vakilrCall    = null

const session     = computed(() => sessionStore.currentSession)
const myId        = computed(() => auth.user?.id)
const clientName  = computed(() => session.value?.client?.full_name || 'Client')
const clientInitials = computed(() => (clientName.value).split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2))

const typeLabels = { chat:'Chat Consultation', voice:'Voice Call', video:'Video Call', document:'Document Review', court_case:'Court Case' }

async function sendMessage() {
  if (!chatInput.value.trim()) return
  await sessionStore.sendChat(route.params.id, myId.value, chatInput.value.trim())
  chatInput.value = ''
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
}

function toggleAudio() {
  if (vakilrCall) audioOn.value = vakilrCall.toggleAudio()
}
function toggleVideo() {
  if (vakilrCall) videoOn.value = vakilrCall.toggleVideo()
}

function confirmEnd() { showEndModal.value = true }

async function endSession() {
  showEndModal.value = false
  if (vakilrCall) vakilrCall.end()
  await sessionStore.endSession(route.params.id)
  router.push('/lawyer')
}

async function markDocComplete() {
  const { supabase } = await import('@/lib/supabase')
  await supabase.from('sessions').update({ status:'completed', ended_at: new Date().toISOString() }).eq('id', route.params.id)
  router.push('/lawyer')
}

watch(() => sessionStore.messages.length, async () => {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
})

onMounted(async () => {
  const sid = route.params.id
  await sessionStore.loadSession(sid)
  sessionStore.startTimer()

  if (session.value?.session_type === 'chat') {
    sessionStore.subscribeMessages(sid)
  } else if (['voice','video'].includes(session.value?.session_type)) {
    const withVideo = session.value?.session_type === 'video'
    vakilrCall = new VakilrCall({
      sessionId: sid,
      userId: myId.value,
      isInitiator: false, // lawyer waits for client's offer
      onRemoteStream: (stream) => {
        if (withVideo && remoteVideo.value) remoteVideo.value.srcObject = stream
        callStatus.value = 'Connected'
      },
      onConnected: () => { callStatus.value = 'Connected' },
      onEnded: endSession,
      onError: (err) => { callStatus.value = `Error: ${err}` },
    })
    const localStream = await vakilrCall.start(withVideo)
    if (withVideo && localVideo.value) localVideo.value.srcObject = localStream
  }
})

onUnmounted(() => {
  sessionStore.stopTimer()
  sessionStore.unsubscribeMessages()
  vakilrCall?.end()
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.session-page{height:100vh;background:#04071a;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;overflow:hidden;position:relative}
.session-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,168,76,0.06),transparent 60%);pointer-events:none}
.session-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(10,15,44,0.95);flex-shrink:0}
.sh-client{display:flex;align-items:center;gap:0.75rem}
.sh-avatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;color:#fff}
.sh-name{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.sh-type{font-size:0.72rem;color:#C9A84C;margin-top:0.1rem}
.sh-timer{display:flex;flex-direction:column;align-items:center;gap:0.2rem}
.timer-ring{position:relative;width:64px;height:64px;display:flex;align-items:center;justify-content:center}
.timer-text{position:absolute;font-size:0.72rem;font-weight:700;color:#C9A84C;font-family:'DM Sans',sans-serif;letter-spacing:-0.02em}
.sh-cost{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#f0d080;text-align:center}
.chat-messages{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.5rem;position:relative;z-index:1}
.message{display:flex;flex-direction:column;max-width:80%}
.message.mine{align-self:flex-end;align-items:flex-end}
.message.theirs{align-self:flex-start;align-items:flex-start}
.msg-bubble{padding:0.6rem 0.875rem;border-radius:14px;font-size:0.9rem;line-height:1.5}
.mine .msg-bubble{background:#C9A84C;color:#0A0F2C;font-weight:500;border-bottom-right-radius:4px}
.theirs .msg-bubble{background:rgba(22,29,63,0.95);color:#f0f4ff;border:1px solid rgba(255,255,255,0.08);border-bottom-left-radius:4px}
.msg-time{font-size:0.62rem;color:rgba(240,244,255,0.35);margin-top:0.2rem}
.chat-input-bar{display:flex;gap:0.75rem;padding:1rem 1.25rem;border-top:1px solid rgba(255,255,255,0.08);background:rgba(10,15,44,0.95);flex-shrink:0;position:relative;z-index:1}
.chat-input{flex:1;height:44px;background:rgba(22,29,63,0.9);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.9rem;padding:0 1rem;outline:none}
.chat-input:focus{border-color:#C9A84C}
.send-btn{width:44px;height:44px;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-size:1.1rem;font-weight:700;cursor:pointer}
.call-area{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:1}
.remote-video{width:100%;max-height:60vh;object-fit:cover;background:#000}
.local-video{position:absolute;bottom:80px;right:16px;width:100px;height:140px;object-fit:cover;border-radius:12px;border:2px solid #C9A84C}
.voice-call-ui{text-align:center}
.vc-avatar{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:700;color:#fff;margin:0 auto 1rem;box-shadow:0 0 40px rgba(59,130,246,0.3)}
.vc-status{color:rgba(240,244,255,0.6);font-size:0.9rem}
.call-controls{display:flex;gap:1rem;margin-top:2rem}
.call-btn{width:56px;height:56px;border-radius:50%;border:none;background:rgba(255,255,255,0.1);font-size:1.3rem;cursor:pointer;transition:all 0.2s}
.call-btn.off{background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.3)}
.call-btn.end-call{background:rgba(239,68,68,0.9);color:#fff}
.doc-area{flex:1;display:flex;align-items:center;justify-content:center;padding:1.5rem;position:relative;z-index:1}
.doc-card{background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:2rem;text-align:center;max-width:360px;width:100%}
.doc-icon{font-size:3rem;display:block;margin-bottom:1rem}
.doc-card h3{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff;margin-bottom:0.75rem}
.doc-card p{font-size:0.85rem;color:rgba(240,244,255,0.6);line-height:1.6;margin-bottom:1rem}
.doc-brief{background:rgba(10,15,44,0.6);border-radius:10px;padding:0.875rem;text-align:left;margin-bottom:1rem}
.doc-brief label{font-size:0.7rem;font-weight:700;color:#C9A84C;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:0.4rem}
.doc-brief p{font-size:0.83rem;color:rgba(240,244,255,0.7);line-height:1.5}
.doc-submit-btn{width:100%;padding:0.875rem;border-radius:12px;border:none;background:#10b981;color:#fff;font-weight:700;font-size:0.9rem;cursor:pointer}
.end-session-bar{padding:0.875rem 1.25rem;border-top:1px solid rgba(255,255,255,0.08);background:rgba(10,15,44,0.95);flex-shrink:0;position:relative;z-index:1}
.end-btn{width:100%;padding:0.875rem;border-radius:14px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.1);color:#ef4444;font-weight:700;font-size:0.9rem;cursor:pointer}
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);display:flex;align-items:flex-end;justify-content:center}
.modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem;width:100%;max-width:480px}
.modal-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff;margin-bottom:0.75rem}
.modal-msg{font-size:0.9rem;color:rgba(240,244,255,0.7);line-height:1.7;margin-bottom:1.25rem}
.modal-msg strong{color:#f0f4ff}
.modal-actions{display:flex;gap:0.75rem}
.modal-cancel{flex:1;padding:0.875rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer}
.modal-end{flex:2;padding:0.875rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer}
</style>