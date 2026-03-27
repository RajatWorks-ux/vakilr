<template>
  <div class="page">
    <div class="page-bg"><div class="orb o1"></div><div class="orb o2"></div></div>
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="page-title">Checkout</h1>
    </div>

    <!-- Order Summary -->
    <div class="summary-card">
      <div class="summary-lawyer">
        <div class="lawyer-avatar">{{ lawyerName.charAt(0) }}</div>
        <div>
          <div class="lawyer-name">{{ lawyerName }}</div>
          <div class="lawyer-spec">{{ serviceType }}</div>
        </div>
        <div class="lawyer-rating">⭐ {{ lawyerRating }}</div>
      </div>
      <div class="summary-divider"></div>
      <div class="price-breakdown">
        <div class="price-row">
          <span>Service fee</span>
          <span>₹{{ fmt(baseAmount) }}</span>
        </div>
        <div class="price-row platform">
          <span>Platform fee (20%)</span>
          <span>₹{{ fmt(platformFee) }}</span>
        </div>
        <div class="price-row total">
          <span>Total</span>
          <span class="total-val">₹{{ fmt(totalAmount) }}</span>
        </div>
      </div>
      <div class="wallet-balance-row">
        <span>💰 Wallet balance</span>
        <span :class="walletStore.balance >= totalAmount ? 'green' : 'red'">₹{{ fmt(walletStore.balance) }}</span>
      </div>
    </div>

    <!-- Insufficient Funds Warning -->
    <div v-if="walletStore.balance < totalAmount" class="insufficient-warning">
      <span>⚠️</span>
      <div>
        <p>Insufficient wallet balance</p>
        <router-link to="/client/wallet" class="add-funds-link">Add funds to wallet →</router-link>
      </div>
    </div>

    <!-- Payment Method — Fake UPI -->
    <div class="payment-method">
      <h3 class="pm-title">Payment Method</h3>
      <div class="pm-options">
        <div class="pm-option active">
          <span class="pm-radio"></span>
          <span class="pm-icon">💰</span>
          <div>
            <div class="pm-name">Vakilr Wallet</div>
            <div class="pm-sub">Balance: ₹{{ fmt(walletStore.balance) }}</div>
          </div>
          <span class="pm-tag">Recommended</span>
        </div>
        <div class="pm-option disabled">
          <span class="pm-radio-empty"></span>
          <span class="pm-icon">📱</span>
          <div>
            <div class="pm-name">UPI / Razorpay</div>
            <div class="pm-sub">Coming soon</div>
          </div>
          <span class="pm-coming">Soon</span>
        </div>
      </div>
    </div>

    <!-- Pay Button -->
    <div class="pay-section">
      <div class="secure-note">🔒 Secure payment · 7-day dispute protection</div>
      <button class="pay-btn"
        :class="{ loading: paying, disabled: walletStore.balance < totalAmount }"
        :disabled="walletStore.balance < totalAmount || paying"
        @click="doPay">
        <span v-if="!paying">Pay ₹{{ fmt(totalAmount) }}</span>
        <span v-else class="pay-spinner"></span>
      </button>
    </div>

    <!-- Success Screen -->
    <transition name="success-slide">
      <div v-if="paymentSuccess" class="success-screen">
        <div class="success-bg">
          <div class="success-orb"></div>
        </div>
        <div class="success-content">
          <div class="success-icon-wrap">
            <div class="success-ring"></div>
            <div class="success-check">✓</div>
          </div>
          <h2 class="success-title">Payment Done!</h2>
          <p class="success-sub">₹{{ fmt(totalAmount) }} paid · Connecting you to {{ lawyerName }}</p>
          <div class="success-coins-row">
            <span v-for="n in 5" :key="n" class="success-coin" :style="{ animationDelay: n * 0.1 + 's' }">🪙</span>
          </div>
          <div class="success-breakdown">
            <div class="sb-row"><span>Lawyer receives</span><span class="green">₹{{ fmt(lawyerEarning) }}</span></div>
            <div class="sb-row"><span>Platform fee</span><span class="gold">₹{{ fmt(platformFee) }}</span></div>
          </div>
          <button class="success-btn" @click="proceedToSession">
            Start Session →
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const route  = useRoute()
const router = useRouter()
const walletStore = useWalletStore()
const authStore   = useAuthStore()

// Route params
const lawyerId   = ref(route.query.lawyerId || '')
const lawyerName = ref(route.query.lawyerName || 'Your Lawyer')
const lawyerRating = ref(route.query.rating || '4.8')
const serviceType  = ref(route.query.serviceType || 'Consultation')
const sessionId    = ref(route.query.sessionId || '')
const baseAmount   = ref(Number(route.query.amount) || 500)

const platformFee  = computed(() => Math.floor(baseAmount.value * 0.2))
const totalAmount  = computed(() => baseAmount.value) // Total = base; lawyer gets 80%
const lawyerEarning = computed(() => Math.floor(baseAmount.value * 0.8))

const paying = ref(false)
const paymentSuccess = ref(false)

onMounted(() => {
  if (authStore.user) walletStore.fetch(authStore.user.id)
})

const fmt = (n) => (n || 0).toLocaleString('en-IN')

async function doPay() {
  if (walletStore.balance < totalAmount.value || paying.value) return
  paying.value = true

  await new Promise(r => setTimeout(r, 1800)) // Fake processing

  const result = await walletStore.escrowFunds(
    authStore.user.id,
    totalAmount.value,
    sessionId.value,
    lawyerId.value
  )

  paying.value = false
  if (result.success) {
    paymentSuccess.value = true
    // Vibrate if available
    if (navigator.vibrate) navigator.vibrate([50, 30, 100])
  }
}

function proceedToSession() {
  const typeMap = {
    'Chat': `/client/chat/${sessionId.value}`,
    'Call': `/client/call/${sessionId.value}`,
    'Video': `/client/video/${sessionId.value}`,
    'Document': `/client/document/${sessionId.value}`,
  }
  const dest = typeMap[serviceType.value] || `/client/chat/${sessionId.value}`
  router.push(dest)
}
</script>

<style scoped>
.page { min-height: 100vh; background: #04071a; padding-bottom: 40px; }
.page-bg { position: fixed; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; }
.o1 { width: 300px; height: 300px; background: #C9A84C; top: -80px; right: -80px; }
.o2 { width: 200px; height: 200px; background: #1a3a8f; bottom: 200px; left: -60px; }
.page-header { display: flex; align-items: center; gap: 12px; padding: 3rem 1.5rem 1.5rem; position: relative; z-index: 1; }
.back-btn { color: #C9A84C; font-size: 1.4rem; background: none; border: none; cursor: pointer; width: 36px; }
.page-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #f0f4ff; margin: 0; }

.summary-card { position: relative; z-index: 1; margin: 0 1.5rem 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 1.2rem; }
.summary-lawyer { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
.lawyer-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #C9A84C, #a8893d); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #04071a; font-weight: 700; flex-shrink: 0; }
.lawyer-name { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; color: #f0f4ff; }
.lawyer-spec { font-size: 0.78rem; color: rgba(240,244,255,0.5); margin-top: 2px; }
.lawyer-rating { margin-left: auto; font-size: 0.85rem; color: #C9A84C; font-weight: 600; }
.summary-divider { height: 1px; background: rgba(255,255,255,0.08); margin-bottom: 1rem; }
.price-breakdown { display: flex; flex-direction: column; gap: 8px; }
.price-row { display: flex; justify-content: space-between; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: rgba(240,244,255,0.6); }
.price-row.platform { color: rgba(240,244,255,0.4); font-size: 0.8rem; }
.price-row.total { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px; margin-top: 4px; color: #f0f4ff; font-weight: 700; }
.total-val { color: #C9A84C; font-size: 1.1rem; }
.wallet-balance-row { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; margin-top: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(240,244,255,0.5); }
.green { color: #4ade80 !important; }
.red { color: #f87171 !important; }
.gold { color: #C9A84C !important; }

.insufficient-warning { position: relative; z-index: 1; margin: 0 1.5rem 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 14px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; }
.insufficient-warning p { font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: #f87171; margin: 0 0 4px; }
.add-funds-link { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: #C9A84C; text-decoration: none; }

.payment-method { position: relative; z-index: 1; margin: 0 1.5rem 1.5rem; }
.pm-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0f4ff; margin: 0 0 12px; }
.pm-options { display: flex; flex-direction: column; gap: 8px; }
.pm-option { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px 14px; transition: all 0.2s; }
.pm-option.active { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.06); }
.pm-option.disabled { opacity: 0.4; }
.pm-radio { width: 16px; height: 16px; border-radius: 50%; background: #C9A84C; border: 3px solid #04071a; box-shadow: 0 0 0 2px #C9A84C; flex-shrink: 0; }
.pm-radio-empty { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); flex-shrink: 0; }
.pm-icon { font-size: 1.3rem; }
.pm-name { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; color: #f0f4ff; }
.pm-sub { font-size: 0.72rem; color: rgba(240,244,255,0.4); }
.pm-tag { margin-left: auto; background: rgba(201,168,76,0.15); color: #C9A84C; font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; flex-shrink: 0; }
.pm-coming { margin-left: auto; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); font-size: 0.65rem; padding: 3px 8px; border-radius: 20px; flex-shrink: 0; }

.pay-section { position: relative; z-index: 1; padding: 0 1.5rem; }
.secure-note { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; color: rgba(240,244,255,0.35); text-align: center; margin-bottom: 12px; }
.pay-btn {
  width: 100%; padding: 16px; border: none; border-radius: 16px;
  background: linear-gradient(135deg, #C9A84C 0%, #a8893d 100%);
  color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; position: relative; overflow: hidden;
}
.pay-btn:active:not(:disabled) { transform: scale(0.98); }
.pay-btn.disabled { opacity: 0.4; cursor: not-allowed; }
.pay-spinner { width: 22px; height: 22px; border: 3px solid rgba(4,7,26,0.3); border-top-color: #04071a; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Success screen */
.success-screen { position: fixed; inset: 0; z-index: 300; background: #04071a; display: flex; align-items: center; justify-content: center; }
.success-bg { position: absolute; inset: 0; overflow: hidden; }
.success-orb { width: 400px; height: 400px; background: radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%); position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: orbPulse 2s ease infinite; }
@keyframes orbPulse { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.2); } }
.success-content { position: relative; z-index: 1; text-align: center; padding: 2rem; }
.success-icon-wrap { position: relative; width: 100px; height: 100px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; }
.success-ring { position: absolute; inset: 0; border: 3px solid #C9A84C; border-radius: 50%; animation: ringExpand 0.6s ease; }
@keyframes ringExpand { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.success-check { font-size: 2.5rem; color: #C9A84C; animation: checkPop 0.4s ease 0.3s both; }
@keyframes checkPop { from { transform: scale(0); } to { transform: scale(1); } }
.success-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0f4ff; margin: 0 0 8px; }
.success-sub { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: rgba(240,244,255,0.6); margin: 0 0 1.5rem; }
.success-coins-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 1.5rem; }
.success-coin { font-size: 1.5rem; display: inline-block; animation: coinFloat 0.5s ease both; }
@keyframes coinFloat { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.success-breakdown { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 14px; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 8px; }
.sb-row { display: flex; justify-content: space-between; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: rgba(240,244,255,0.6); }
.success-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #C9A84C, #a8893d); border: none; border-radius: 16px; color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; }

.success-slide-enter-active { animation: slideUp 0.4s ease; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>