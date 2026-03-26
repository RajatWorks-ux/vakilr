<template>
  <div class="call-page">
    <div class="call-bg"></div>

    <!-- Lawyer Visual -->
    <div class="call-main">
      <div class="caller-avatar" :style="{ background: getColor(lawyerName) }">
        {{ getInitials(lawyerName) }}
      </div>
      <h2 class="caller-name">{{ lawyerName }}</h2>
      <p class="call-status">{{ callStatus }}</p>
      <div class="call-timer" v-if="callConnected">{{ sessionStore.formattedTime }}</div>
      <div class="call-cost" v-if="callConnected">{{ sessionStore.formattedCost }}</div>
    </div>

    <!-- Sound Waves (decorative) -->
    <div class="sound-waves" v-if="callConnected">
      <div class="wave" v-for="i in 4" :key="i" :style="{ animationDelay: (i*0.15) + 's' }"></div>
    </div>

    <!-- Controls -->
    <div class="call-controls">
      <div class="ctrl-row">
        <button :class="['ctrl-btn', { off: !audioOn }]" @click="toggleAudio">
          <span>{{ audioOn ? '🎙️' : '🔇' }}</span>
          <small>{{ audioOn ? 'Mute' : 'Unmuted' }}</small>
        </button>
        <button class="ctrl-btn end" @click="confirmEnd = true">
          <span>📵</span>
          <small>End</small>
        </button>
        <button :class="['ctrl-btn', { off: speakerOn }]" @click="speakerOn = !speakerOn">
          <span>{{ speakerOn ? '🔊' : '🔈' }}</span>
          <small>Speaker</small>
        </button>
      </div>
    </div>

    <!-- Confirm End -->
    <div v-if="confirmEnd" class="modal-overlay" @click.self="confirmEnd = false">
      <div class="modal">
        <h3 class="modal-title">End Call?</h3>
        <p class="modal-msg">Duration: <strong>{{ sessionStore.formattedTime }}</strong><br/>Cost: <strong>{{ sessionStore.formattedCost }}</strong></p>
        <div class="modal-actions">
          <button class="m-cancel" @click="confirmEnd = false">Continue Call</button>
          <button class="m-end" @click="endCall">End Call</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSessionStore } from '@/stores/session'
import { VakilrCall } from '@/lib/realtime'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sessionStore = useSessionStore()

const callStatus = ref('Connecting...')
const callConnected = ref(false)
const confirmEnd = ref(false)
const audioOn = ref(true)
const speakerOn = ref(true)
let vakilrCall = null

const lawyerName = computed(() => sessionStore.currentSession?.profiles?.full_name || 'Lawyer')
const myId = computed(() => auth.user?.id)

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#8b5cf6']
function getColor(n){let h=0;for(const c of(n||''))h=(h*31+c.charCodeAt(0))%colors.length;return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`}
function getInitials(n){return(n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}

function toggleAudio() {
  if (vakilrCall) audioOn.value = vakilrCall.toggleAudio()
}

async function endCall() {
  confirmEnd.value = false
  vakilrCall?.end()
  await sessionStore.endSession(route.params.id)
  router.push('/client/sessions')
}

onMounted(async () => {
  await sessionStore.loadSession(route.params.id)
  sessionStore.startTimer()
  callStatus.value = 'Calling lawyer...'

  vakilrCall = new VakilrCall({
    sessionId: route.params.id,
    userId: myId.value,
    isInitiator: true,
    onRemoteStream: () => { callConnected.value = true; callStatus.value = 'Connected' },
    onConnected:   () => { callConnected.value = true; callStatus.value = 'Connected' },
    onEnded: endCall,
    onError: (e) => { callStatus.value = `Error: ${e}` },
  })

  try {
    await vakilrCall.start(false)
    callStatus.value = 'Ringing...'
  } catch (e) {
    callStatus.value = 'Could not access microphone'
  }
})

onUnmounted(() => {
  sessionStore.stopTimer()
  vakilrCall?.end()
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.call-page{height:100vh;background:#04071a;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:2rem 1.5rem;position:relative;overflow:hidden}
.call-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 60% 60% at 50% 30%,rgba(59,130,246,0.08),transparent 70%);pointer-events:none}
.call-main{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:0.75rem;margin-top:3rem}
.caller-avatar{width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:700;color:#fff;box-shadow:0 0 50px rgba(59,130,246,0.25);animation:breathe 2.5s ease-in-out infinite}
@keyframes breathe{0%,100%{box-shadow:0 0 50px rgba(59,130,246,0.2)}50%{box-shadow:0 0 80px rgba(59,130,246,0.4)}}
.caller-name{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;color:#f0f4ff}
.call-status{font-size:0.88rem;color:rgba(240,244,255,0.5)}
.call-timer{font-family:'DM Sans',sans-serif;font-size:2rem;font-weight:900;color:#C9A84C;font-variant-numeric:tabular-nums}
.call-cost{font-size:0.85rem;color:rgba(240,244,255,0.5)}
.sound-waves{position:relative;z-index:1;display:flex;gap:6px;align-items:center;height:40px}
.wave{width:4px;background:#C9A84C;border-radius:2px;animation:wave-anim 1s ease-in-out infinite;opacity:0.6}
.wave:nth-child(1){height:12px}.wave:nth-child(2){height:24px}.wave:nth-child(3){height:18px}.wave:nth-child(4){height:30px}
@keyframes wave-anim{0%,100%{transform:scaleY(0.5);opacity:0.4}50%{transform:scaleY(1);opacity:1}}
.call-controls{position:relative;z-index:1;width:100%;margin-bottom:2rem}
.ctrl-row{display:flex;justify-content:center;gap:2rem}
.ctrl-btn{display:flex;flex-direction:column;align-items:center;gap:0.4rem;width:72px;height:72px;border-radius:50%;border:none;background:rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s}
.ctrl-btn span{font-size:1.5rem}
.ctrl-btn small{font-size:0.6rem;color:rgba(240,244,255,0.5);font-family:'DM Sans',sans-serif}
.ctrl-btn.off{background:rgba(239,68,68,0.18)}
.ctrl-btn.end{background:rgba(239,68,68,0.85);width:80px;height:80px}
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);display:flex;align-items:flex-end;justify-content:center}
.modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem;width:100%;max-width:480px}
.modal-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.modal-msg{font-size:0.88rem;color:rgba(240,244,255,0.65);line-height:1.7;margin-bottom:1.25rem}
.modal-msg strong{color:#C9A84C}
.modal-actions{display:flex;gap:0.75rem}
.m-cancel{flex:1;padding:0.875rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer}
.m-end{flex:2;padding:0.875rem;border-radius:12px;border:none;background:#ef4444;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer}
</style>