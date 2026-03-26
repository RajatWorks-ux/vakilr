<template>
  <div class="session-page">
    <div class="session-bg"></div>

    <!-- Header -->
    <div class="s-header">
      <div class="sh-info">
        <div class="sh-av" :style="{ background: getColor(lawyerName) }">{{ getInitials(lawyerName) }}</div>
        <div>
          <div class="sh-name">{{ lawyerName }}</div>
          <div class="sh-status">{{ connected ? '🟢 Connected' : '🟡 Waiting...' }}</div>
        </div>
      </div>
      <div class="sh-timer-wrap">
        <div class="sh-timer">{{ sessionStore.formattedTime }}</div>
        <div class="sh-cost">{{ sessionStore.formattedCost }}</div>
      </div>
    </div>

    <!-- Messages -->
    <div class="chat-messages" ref="msgEl">
      <div class="chat-start-note">Session started. Your conversation is private and encrypted.</div>
      <div v-for="msg in sessionStore.messages" :key="msg.id"
        :class="['msg', msg.sender_id === myId ? 'mine' : 'theirs']">
        <div class="msg-bubble">{{ msg.content }}</div>
        <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
      </div>
    </div>

    <!-- Time Extension Prompt -->
    <div v-if="showExtend" class="extend-banner">
      <span>⏰</span>
      <p>Time is running low! <strong>₹{{ extensionCost }}</strong> for 10 more minutes?</p>
      <button class="extend-yes" @click="extendSession">Yes, Extend</button>
      <button class="extend-no" @click="showExtend = false; endSession()">End Session</button>
    </div>

    <!-- Input -->
    <div class="chat-bar">
      <input v-model="inputText" placeholder="Type your message..." class="chat-input" @keydown.enter="send" :disabled="!connected" />
      <button class="send-btn" @click="send" :disabled="!inputText.trim() || !connected">→</button>
      <button class="end-btn" @click="confirmEnd = true">✕</button>
    </div>

    <!-- Confirm End Modal -->
    <div v-if="confirmEnd" class="modal-overlay" @click.self="confirmEnd = false">
      <div class="modal">
        <h3 class="modal-title">End Session?</h3>
        <p class="modal-msg">Time: <strong>{{ sessionStore.formattedTime }}</strong> · Cost: <strong>{{ sessionStore.formattedCost }}</strong></p>
        <div class="modal-actions">
          <button class="m-cancel" @click="confirmEnd = false">Continue</button>
          <button class="m-end" @click="endSession">End Session</button>
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

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sessionStore = useSessionStore()

const msgEl = ref(null)
const inputText = ref('')
const connected = ref(false)
const confirmEnd = ref(false)
const showExtend = ref(false)
const extensionCost = ref(0)

const myId = computed(() => auth.user?.id)
const lawyerName = computed(() => sessionStore.currentSession?.profiles?.full_name || 'Lawyer')

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#8b5cf6']
function getColor(n){let h=0;for(const c of(n||''))h=(h*31+c.charCodeAt(0))%colors.length;return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`}
function getInitials(n){return(n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
function formatTime(ts){return new Date(ts).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}

async function send() {
  if (!inputText.value.trim()) return
  await sessionStore.sendChat(route.params.id, myId.value, inputText.value.trim())
  inputText.value = ''
}

async function extendSession() {
  showExtend.value = false
  sessionStore.timerSeconds = 0
}

async function endSession() {
  confirmEnd.value = false
  await sessionStore.endSession(route.params.id)
  router.push('/client/sessions')
}

watch(() => sessionStore.messages.length, async () => {
  await nextTick()
  if (msgEl.value) msgEl.value.scrollTop = msgEl.value.scrollHeight
})

watch(() => sessionStore.timerSeconds, (s) => {
  const rate = sessionStore.currentSession?.rate_per_minute || 0
  if (s > 0 && s % (10*60) === 0 && rate) {
    extensionCost.value = rate * 10
    showExtend.value = true
  }
})

onMounted(async () => {
  await sessionStore.loadSession(route.params.id)
  sessionStore.subscribeMessages(route.params.id)
  sessionStore.startTimer()
  connected.value = true
  await nextTick()
  if (msgEl.value) msgEl.value.scrollTop = msgEl.value.scrollHeight
})

onUnmounted(() => {
  sessionStore.stopTimer()
  sessionStore.unsubscribeMessages()
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.session-page{height:100vh;background:#04071a;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;overflow:hidden;position:relative}
.session-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,168,76,0.06),transparent 60%);pointer-events:none}
.s-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(10,15,44,0.97);flex-shrink:0}
.sh-info{display:flex;align-items:center;gap:0.75rem}
.sh-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;color:#fff;flex-shrink:0}
.sh-name{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.sh-status{font-size:0.72rem;color:#10b981;margin-top:0.1rem}
.sh-timer-wrap{text-align:right}
.sh-timer{font-family:'DM Sans',sans-serif;font-size:1.3rem;font-weight:900;color:#C9A84C;font-variant-numeric:tabular-nums}
.sh-cost{font-size:0.78rem;color:rgba(240,244,255,0.5)}
.chat-messages{flex:1;overflow-y:auto;padding:1rem 1.25rem;display:flex;flex-direction:column;gap:0.5rem;position:relative;z-index:1;scrollbar-width:none}
.chat-messages::-webkit-scrollbar{display:none}
.chat-start-note{text-align:center;font-size:0.72rem;color:rgba(240,244,255,0.3);padding:0.5rem 1rem;background:rgba(255,255,255,0.04);border-radius:100px;align-self:center;margin-bottom:0.5rem}
.msg{display:flex;flex-direction:column;max-width:78%}
.msg.mine{align-self:flex-end;align-items:flex-end}
.msg.theirs{align-self:flex-start;align-items:flex-start}
.msg-bubble{padding:0.65rem 0.9rem;border-radius:14px;font-size:0.88rem;line-height:1.55;word-break:break-word}
.mine .msg-bubble{background:#C9A84C;color:#0A0F2C;font-weight:500;border-bottom-right-radius:4px}
.theirs .msg-bubble{background:rgba(22,29,63,0.95);color:#f0f4ff;border:1px solid rgba(255,255,255,0.07);border-bottom-left-radius:4px}
.msg-time{font-size:0.6rem;color:rgba(240,244,255,0.3);margin-top:0.2rem}
.extend-banner{position:relative;z-index:1;display:flex;align-items:center;gap:0.6rem;background:rgba(245,158,11,0.12);border-top:1px solid rgba(245,158,11,0.25);padding:0.75rem 1.25rem;flex-shrink:0;flex-wrap:wrap}
.extend-banner span{font-size:1rem}
.extend-banner p{flex:1;font-size:0.8rem;color:#f0f4ff;min-width:140px}
.extend-banner strong{color:#f59e0b}
.extend-yes{background:#f59e0b;color:#000;border:none;border-radius:8px;padding:0.4rem 0.875rem;font-weight:700;font-size:0.78rem;cursor:pointer}
.extend-no{background:transparent;border:1px solid rgba(255,255,255,0.15);color:rgba(240,244,255,0.5);border-radius:8px;padding:0.4rem 0.875rem;font-size:0.78rem;cursor:pointer}
.chat-bar{position:relative;z-index:1;display:flex;gap:0.5rem;padding:0.75rem 1.25rem;border-top:1px solid rgba(255,255,255,0.08);background:rgba(10,15,44,0.97);flex-shrink:0}
.chat-input{flex:1;height:44px;background:rgba(22,29,63,0.9);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.88rem;padding:0 1rem;outline:none}
.chat-input:focus{border-color:#C9A84C}
.send-btn{width:44px;height:44px;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-size:1.1rem;font-weight:700;cursor:pointer;flex-shrink:0}
.send-btn:disabled{opacity:0.35;cursor:not-allowed}
.end-btn{width:44px;height:44px;border-radius:12px;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.1);color:#ef4444;font-size:1rem;cursor:pointer;flex-shrink:0}
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);display:flex;align-items:flex-end;justify-content:center}
.modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem;width:100%;max-width:480px}
.modal-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.modal-msg{font-size:0.88rem;color:rgba(240,244,255,0.65);line-height:1.7;margin-bottom:1.25rem}
.modal-msg strong{color:#C9A84C}
.modal-actions{display:flex;gap:0.75rem}
.m-cancel{flex:1;padding:0.875rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer}
.m-end{flex:2;padding:0.875rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer}
</style>