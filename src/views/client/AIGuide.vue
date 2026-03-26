<template>
  <div class="page">
    <div class="page-bg"></div>

    <!-- Header -->
    <div class="ag-header">
      <router-link to="/client" class="back-btn">←</router-link>
      <div class="ag-title-wrap">
        <h1 class="ag-title">AI Legal Guide</h1>
        <span class="ag-badge">Powered by DeepSeek</span>
      </div>
      <button class="clear-btn" @click="clearChat">🗑️</button>
    </div>

    <!-- Intro (shown when no messages) -->
    <div v-if="messages.length === 0" class="intro-area">
      <div class="intro-icon">✨</div>
      <h2 class="intro-title">Describe Your Problem</h2>
      <p class="intro-sub">Tell me what's happening in simple Hindi or English. I'll guide you to the right lawyer.</p>
      <div class="suggestion-chips">
        <button v-for="s in suggestions" :key="s" class="chip" @click="sendSuggestion(s)">{{ s }}</button>
      </div>
      <div class="disclaimer">
        <span>⚠️</span>
        <p>AI Guide does not give legal advice. It only helps you find the right lawyer.</p>
      </div>
    </div>

    <!-- Chat Messages -->
    <div v-else class="chat-area" ref="chatEl">
      <div v-for="(msg, i) in messages" :key="i" :class="['msg', msg.role]">
        <div v-if="msg.role === 'assistant'" class="msg-avatar">✨</div>
        <div class="msg-content">
          <div class="msg-bubble" v-html="formatMessage(msg.content)"></div>
          <!-- Lawyer Recommendations -->
          <div v-if="msg.recommendations?.length" class="rec-cards">
            <router-link
              v-for="l in msg.recommendations" :key="l.id"
              :to="'/client/lawyer/' + l.id"
              class="rec-card"
            >
              <div class="rec-av" :style="{ background: getColor(l.profiles?.full_name) }">
                {{ getInitials(l.profiles?.full_name) }}
                <div class="rec-status" :class="l.availability_status"></div>
              </div>
              <div class="rec-info">
                <div class="rec-name">{{ l.profiles?.full_name }}</div>
                <div class="rec-spec">{{ l.specializations?.[0] }}</div>
                <div class="rec-rate">₹{{ getMinRate(l) }}/min · ⭐{{ l.rating }}</div>
              </div>
              <span class="rec-arrow">→</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="msg assistant">
        <div class="msg-avatar">✨</div>
        <div class="msg-content">
          <div class="msg-bubble typing-bubble">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
            <span class="typing-status">{{ typingStatus }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="input-bar">
      <textarea
        v-model="userInput"
        :placeholder="messages.length === 0 ? 'E.g. Mera landlord deposit wapas nahi de raha...' : 'Ask a follow-up question...'"
        class="chat-input"
        rows="2"
        @keydown.enter.prevent="sendMessage"
        :disabled="isTyping"
      ></textarea>
      <button class="send-btn" @click="sendMessage" :disabled="isTyping || !userInput.trim()">
        {{ isTyping ? '⏳' : '→' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useClientStore } from '@/stores/client'
import { askLegalGuide } from '@/lib/deepseek'

const clientStore = useClientStore()
const chatEl      = ref(null)
const userInput   = ref('')
const isTyping    = ref(false)
const typingStatus = ref('Thinking...')
const messages    = ref([])
const allLawyers  = ref([])

const suggestions = [
  '🏠 Landlord ne deposit nahi diya',
  '⚖️ False criminal case filed against me',
  '📄 Need NDA for my business',
  '👨‍👩‍👧 Divorce & child custody help',
  '💰 GST notice mila hai',
  '💻 Online fraud ho gaya',
]

const typingMessages = [
  'Analyzing your situation...',
  'Finding the right lawyer type...',
  'Checking available lawyers...',
  'Preparing recommendations...',
]

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
function getColor(name) {
  let h = 0; for (const c of (name||'')) h = (h*31+c.charCodeAt(0))%colors.length
  return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`
}
function getInitials(name) { return (name||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
function getMinRate(l) {
  const svcs = l.lawyer_services?.filter(s=>s.is_active&&s.price_unit==='per_minute')
  return svcs?.length ? Math.min(...svcs.map(s=>s.price_amount)) : '—'
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

async function sendSuggestion(s) {
  userInput.value = s.replace(/^[^\s]+\s/, '')
  await sendMessage()
}

function clearChat() { messages.value = []; userInput.value = '' }

async function scrollDown() {
  await nextTick()
  if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
}

async function sendMessage() {
  const text = userInput.value.trim()
  if (!text || isTyping.value) return

  messages.value.push({ role: 'user', content: text })
  userInput.value = ''
  isTyping.value  = true
  await scrollDown()

  // Cycle through typing status messages
  let tIdx = 0
  typingStatus.value = typingMessages[0]
  const tInterval = setInterval(() => {
    tIdx = (tIdx + 1) % typingMessages.length
    typingStatus.value = typingMessages[tIdx]
  }, 1800)

  let fullResponse = ''
  const aiMsg = { role: 'assistant', content: '', recommendations: [] }
  messages.value.push(aiMsg)

  try {
    await askLegalGuide({
      userMessage: text,
      lawyers: allLawyers.value,
      onChunk: async (chunk, full) => {
        fullResponse = full
        aiMsg.content = full
        await scrollDown()
      },
    })

    // Extract recommended lawyer numbers from response
    const nums = [...fullResponse.matchAll(/\b([1-9]|10)\b/g)].map(m => parseInt(m[1]) - 1)
    const unique = [...new Set(nums)].slice(0, 3)
    aiMsg.recommendations = unique
      .map(i => allLawyers.value[i])
      .filter(Boolean)
      .slice(0, 3)

  } catch (err) {
    aiMsg.content = 'Sorry, main abhi available nahi hoon. Please thodi der baad try karein. 🙏'
  }

  clearInterval(tInterval)
  isTyping.value = false
  await scrollDown()
}

onMounted(async () => {
  allLawyers.value = await clientStore.browseLawyers({})
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;overflow:hidden;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.ag-header{position:relative;z-index:1;display:flex;align-items:center;gap:0.75rem;padding:1.1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.1rem;font-weight:700;padding:0.4rem 0.7rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.ag-title-wrap{flex:1}
.ag-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff}
.ag-badge{display:block;font-size:0.62rem;color:#C9A84C;letter-spacing:0.08em;text-transform:uppercase;margin-top:1px}
.clear-btn{background:none;border:none;font-size:1.1rem;cursor:pointer;padding:0.3rem;color:rgba(240,244,255,0.4)}
.intro-area{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;text-align:center;position:relative;z-index:1;overflow-y:auto}
.intro-icon{font-size:3.5rem;margin-bottom:1rem;animation:float 3s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.intro-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;color:#f0f4ff;margin-bottom:0.75rem}
.intro-sub{font-size:0.9rem;color:rgba(240,244,255,0.6);line-height:1.7;margin-bottom:2rem;max-width:320px}
.suggestion-chips{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin-bottom:1.5rem}
.chip{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);color:rgba(240,244,255,0.8);padding:0.45rem 0.875rem;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:0.78rem;cursor:pointer;transition:all 0.2s}
.chip:hover{background:rgba(201,168,76,0.15);color:#C9A84C;border-color:#C9A84C}
.disclaimer{display:flex;align-items:flex-start;gap:0.5rem;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:0.75rem;max-width:320px}
.disclaimer span{font-size:0.85rem;flex-shrink:0}
.disclaimer p{font-size:0.75rem;color:rgba(240,244,255,0.5);line-height:1.5}
.chat-area{flex:1;overflow-y:auto;padding:1rem 1.25rem;display:flex;flex-direction:column;gap:1rem;position:relative;z-index:1;scrollbar-width:none}
.chat-area::-webkit-scrollbar{display:none}
.msg{display:flex;gap:0.6rem;align-items:flex-start}
.msg.user{flex-direction:row-reverse}
.msg-avatar{width:30px;height:30px;border-radius:50%;background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0;margin-top:2px}
.msg-content{max-width:85%;display:flex;flex-direction:column;gap:0.5rem}
.msg.user .msg-content{align-items:flex-end}
.msg-bubble{padding:0.75rem 1rem;border-radius:16px;font-size:0.88rem;line-height:1.65}
.msg.user .msg-bubble{background:#C9A84C;color:#0A0F2C;font-weight:500;border-bottom-right-radius:4px}
.msg.assistant .msg-bubble{background:rgba(22,29,63,0.95);color:#f0f4ff;border:1px solid rgba(255,255,255,0.08);border-bottom-left-radius:4px}
.typing-bubble{display:flex;align-items:center;gap:0.75rem;min-width:140px}
.typing-indicator{display:flex;gap:4px;align-items:center}
.typing-indicator span{width:7px;height:7px;border-radius:50%;background:#C9A84C;animation:typing-bounce 1.2s ease-in-out infinite}
.typing-indicator span:nth-child(2){animation-delay:0.2s}
.typing-indicator span:nth-child(3){animation-delay:0.4s}
@keyframes typing-bounce{0%,100%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-4px);opacity:1}}
.typing-status{font-size:0.72rem;color:rgba(240,244,255,0.4);font-style:italic}
.rec-cards{display:flex;flex-direction:column;gap:0.6rem;margin-top:0.5rem}
.rec-card{display:flex;align-items:center;gap:0.75rem;background:rgba(22,29,63,0.9);border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:0.75rem;text-decoration:none;transition:all 0.2s}
.rec-card:hover{border-color:#C9A84C;background:rgba(201,168,76,0.08)}
.rec-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:#fff;position:relative;flex-shrink:0}
.rec-status{position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;border:2px solid #0d1538}
.rec-status.online{background:#10b981}.rec-status.busy{background:#f59e0b}.rec-status.offline{background:#64748b}
.rec-info{flex:1}
.rec-name{font-weight:700;font-size:0.82rem;color:#f0f4ff}
.rec-spec{font-size:0.7rem;color:#C9A84C;margin-top:0.1rem}
.rec-rate{font-size:0.68rem;color:rgba(240,244,255,0.45);margin-top:0.1rem}
.rec-arrow{color:#C9A84C;font-size:0.9rem;flex-shrink:0}
.input-bar{position:relative;z-index:1;display:flex;gap:0.75rem;padding:0.875rem 1.25rem;border-top:1px solid rgba(255,255,255,0.08);background:rgba(10,15,44,0.95);flex-shrink:0}
.chat-input{flex:1;background:rgba(22,29,63,0.9);border:1.5px solid rgba(255,255,255,0.1);border-radius:14px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.88rem;padding:0.75rem 1rem;outline:none;resize:none;transition:border-color 0.2s;line-height:1.5}
.chat-input:focus{border-color:#C9A84C}
.chat-input:disabled{opacity:0.5}
.send-btn{width:44px;height:44px;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-size:1.1rem;font-weight:700;cursor:pointer;align-self:flex-end;flex-shrink:0;transition:all 0.2s}
.send-btn:disabled{opacity:0.4;cursor:not-allowed}
</style>