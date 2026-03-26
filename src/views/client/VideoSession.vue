<template>
  <div class="video-page">
    <div class="video-bg"></div>

    <!-- Remote Video -->
    <video ref="remoteVideoEl" class="remote-video" autoplay playsinline></video>

    <!-- No Video Placeholder -->
    <div v-if="!remoteStream" class="video-placeholder">
      <div class="vp-avatar" :style="{ background: getColor(lawyerName) }">{{ getInitials(lawyerName) }}</div>
      <p class="vp-status">{{ callStatus }}</p>
    </div>

    <!-- Local Video (picture-in-picture) -->
    <div class="local-pip">
      <video ref="localVideoEl" class="local-video" autoplay playsinline muted></video>
      <div v-if="!videoOn" class="pip-off">📷 Off</div>
    </div>

    <!-- Header Overlay -->
    <div class="video-header">
      <div class="vh-info">
        <span class="vh-name">{{ lawyerName }}</span>
        <span class="vh-timer">{{ sessionStore.formattedTime }}</span>
      </div>
      <span class="vh-cost">{{ sessionStore.formattedCost }}</span>
    </div>

    <!-- Controls -->
    <div class="video-controls">
      <button :class="['vc-btn', { off: !audioOn }]" @click="toggleAudio">{{ audioOn ? '🎙️' : '🔇' }}</button>
      <button :class="['vc-btn', { off: !videoOn }]" @click="toggleVideo">{{ videoOn ? '📹' : '📷' }}</button>
      <button class="vc-btn end" @click="confirmEnd = true">📵</button>
      <button class="vc-btn chat-tog" @click="showChat = !showChat">💬</button>
    </div>

    <!-- Side Chat -->
    <transition name="chat-slide">
      <div v-if="showChat" class="side-chat">
        <div class="sc-msgs" ref="chatMsgEl">
          <div v-for="m in sessionStore.messages" :key="m.id" :class="['sc-msg', m.sender_id === myId ? 'mine' : 'theirs']">
            <div class="scm-bubble">{{ m.content }}</div>
          </div>
        </div>
        <div class="sc-input-row">
          <input v-model="chatText" class="sc-input" placeholder="Message..." @keydown.enter="sendChat" />
          <button class="sc-send" @click="sendChat">→</button>
        </div>
      </div>
    </transition>

    <!-- Confirm End -->
    <div v-if="confirmEnd" class="modal-overlay" @click.self="confirmEnd = false">
      <div class="modal">
        <h3 class="modal-title">End Video Call?</h3>
        <p class="modal-msg">Duration: <strong>{{ sessionStore.formattedTime }}</strong> · Cost: <strong>{{ sessionStore.formattedCost }}</strong></p>
        <div class="modal-actions">
          <button class="m-cancel" @click="confirmEnd = false">Continue</button>
          <button class="m-end" @click="endCall">End Call</button>
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

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sessionStore = useSessionStore()

const remoteVideoEl = ref(null)
const localVideoEl  = ref(null)
const chatMsgEl     = ref(null)
const confirmEnd    = ref(false)
const showChat      = ref(false)
const chatText      = ref('')
const audioOn       = ref(true)
const videoOn       = ref(true)
const remoteStream  = ref(false)
const callStatus    = ref('Connecting...')
let vakilrCall      = null

const lawyerName = computed(() => sessionStore.currentSession?.profiles?.full_name || 'Lawyer')
const myId = computed(() => auth.user?.id)

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#8b5cf6']
function getColor(n){let h=0;for(const c of(n||''))h=(h*31+c.charCodeAt(0))%colors.length;return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`}
function getInitials(n){return(n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}

function toggleAudio() { if(vakilrCall) audioOn.value = vakilrCall.toggleAudio() }
function toggleVideo() { if(vakilrCall) videoOn.value = vakilrCall.toggleVideo() }

async function sendChat() {
  if (!chatText.value.trim()) return
  await sessionStore.sendChat(route.params.id, myId.value, chatText.value.trim())
  chatText.value = ''
  await nextTick()
  if (chatMsgEl.value) chatMsgEl.value.scrollTop = chatMsgEl.value.scrollHeight
}

async function endCall() {
  confirmEnd.value = false
  vakilrCall?.end()
  await sessionStore.endSession(route.params.id)
  router.push('/client/sessions')
}

watch(() => sessionStore.messages.length, async () => {
  await nextTick()
  if (chatMsgEl.value) chatMsgEl.value.scrollTop = chatMsgEl.value.scrollHeight
})

onMounted(async () => {
  await sessionStore.loadSession(route.params.id)
  sessionStore.subscribeMessages(route.params.id)
  sessionStore.startTimer()

  vakilrCall = new VakilrCall({
    sessionId: route.params.id,
    userId: myId.value,
    isInitiator: true,
    onRemoteStream: (stream) => {
      remoteStream.value = true
      callStatus.value = 'Connected'
      if (remoteVideoEl.value) remoteVideoEl.value.srcObject = stream
    },
    onConnected: () => { callStatus.value = 'Connected' },
    onEnded: endCall,
    onError: (e) => { callStatus.value = `Error: ${e}` },
  })

  try {
    const local = await vakilrCall.start(true)
    if (localVideoEl.value) localVideoEl.value.srcObject = local
    callStatus.value = 'Waiting for lawyer...'
  } catch {
    callStatus.value = 'Camera/mic access denied'
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
.video-page{height:100vh;background:#000;font-family:'DM Sans',sans-serif;position:relative;overflow:hidden}
.video-bg{position:fixed;inset:0;z-index:0;background:#04071a}
.remote-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.video-placeholder{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem}
.vp-avatar{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:700;color:#fff;box-shadow:0 0 40px rgba(201,168,76,0.2)}
.vp-status{font-size:0.9rem;color:rgba(240,244,255,0.6)}
.local-pip{position:absolute;top:80px;right:12px;z-index:10;width:96px;height:128px;border-radius:12px;overflow:hidden;border:2px solid #C9A84C;background:#000}
.local-video{width:100%;height:100%;object-fit:cover}
.pip-off{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,15,44,0.9);font-size:0.7rem;color:rgba(240,244,255,0.5)}
.video-header{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1.25rem;background:linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)}
.vh-info{display:flex;align-items:center;gap:0.75rem}
.vh-name{font-weight:700;font-size:0.9rem;color:#fff}
.vh-timer{font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.88rem;color:#C9A84C;font-variant-numeric:tabular-nums;background:rgba(0,0,0,0.4);padding:0.2rem 0.5rem;border-radius:6px}
.vh-cost{font-size:0.82rem;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.4);padding:0.2rem 0.6rem;border-radius:6px}
.video-controls{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:5;display:flex;gap:1rem}
.vc-btn{width:60px;height:60px;border-radius:50%;border:none;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);font-size:1.3rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center}
.vc-btn.off{background:rgba(239,68,68,0.25)}
.vc-btn.end{background:rgba(239,68,68,0.85);width:68px;height:68px}
.side-chat{position:absolute;top:0;right:0;bottom:0;width:260px;z-index:8;background:rgba(10,15,44,0.95);border-left:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column}
.sc-msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.5rem}
.sc-msg{display:flex}
.sc-msg.mine{justify-content:flex-end}
.scm-bubble{padding:0.5rem 0.75rem;border-radius:10px;font-size:0.8rem;max-width:85%}
.mine .scm-bubble{background:#C9A84C;color:#0A0F2C}
.theirs .scm-bubble{background:rgba(22,29,63,0.9);color:#f0f4ff;border:1px solid rgba(255,255,255,0.08)}
.sc-input-row{display:flex;gap:0.5rem;padding:0.75rem;border-top:1px solid rgba(255,255,255,0.08)}
.sc-input{flex:1;height:38px;background:rgba(22,29,63,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:8px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.82rem;padding:0 0.75rem;outline:none}
.sc-send{width:38px;height:38px;border-radius:8px;border:none;background:#C9A84C;color:#0A0F2C;font-weight:700;cursor:pointer}
.chat-slide-enter-active,.chat-slide-leave-active{transition:transform 0.3s ease,opacity 0.3s ease}
.chat-slide-enter-from,.chat-slide-leave-to{transform:translateX(100%);opacity:0}
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);display:flex;align-items:flex-end;justify-content:center}
.modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem;width:100%;max-width:480px}
.modal-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.modal-msg{font-size:0.88rem;color:rgba(240,244,255,0.65);line-height:1.7;margin-bottom:1.25rem}
.modal-msg strong{color:#C9A84C}
.modal-actions{display:flex;gap:0.75rem}
.m-cancel{flex:1;padding:0.875rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer}
.m-end{flex:2;padding:0.875rem;border-radius:12px;border:none;background:#ef4444;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer}
</style>