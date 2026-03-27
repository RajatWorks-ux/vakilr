<template>
  <div class="page">
    <div class="page-bg">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
    </div>

    <!-- Header -->
    <div class="page-header">
      <router-link to="/client" class="back-btn">←</router-link>
      <h1 class="page-title">My Wallet</h1>
      <button class="info-btn" @click="showInfo = !showInfo">ℹ</button>
    </div>

    <!-- Test Mode Banner -->
    <div class="test-banner">
      <span>🧪</span>
      <span>Test Mode — All money is fake. Use it freely!</span>
    </div>

    <!-- Balance Card -->
    <div class="balance-section">
      <div class="balance-card" :class="{ pulse: justAdded }">
        <div class="bc-glow"></div>
        <div class="bc-label">Available Balance</div>
        <div class="bc-amount">
          ₹<span class="bc-num" :class="{ bounce: justAdded }">{{ fmt(walletStore.balance) }}</span>
        </div>
        <div class="bc-row">
          <div class="bc-stat">
            <div class="bc-stat-val">₹{{ fmt(walletStore.totalSpent) }}</div>
            <div class="bc-stat-label">Total Spent</div>
          </div>
          <div class="bc-divider"></div>
          <div class="bc-stat">
            <div class="bc-stat-val">{{ walletStore.transactions.filter(t=>t.type==='escrow').length }}</div>
            <div class="bc-stat-label">Sessions Paid</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Funds -->
    <div class="add-funds-section">
      <h3 class="section-title">Add Test Funds</h3>
      <div class="fund-grid">
        <button v-for="amt in [500, 1000, 2000, 5000]" :key="amt"
          class="fund-btn" :class="{ loading: addingFunds === amt }"
          @click="addFunds(amt)">
          <span class="fund-icon">💳</span>
          <span class="fund-amt">+₹{{ amt.toLocaleString() }}</span>
          <div v-if="addingFunds === amt" class="fund-spinner"></div>
        </button>
      </div>
      <!-- Fake UPI input -->
      <div class="custom-add">
        <div class="custom-input-row">
          <span class="rupee-prefix">₹</span>
          <input v-model.number="customAmount" type="number" placeholder="Custom amount" class="custom-input" min="100" max="100000" />
        </div>
        <button class="custom-add-btn" :disabled="!customAmount || customAmount < 100 || !!addingFunds" @click="addFunds(customAmount)">
          Add via Fake UPI →
        </button>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="txn-section">
      <h3 class="section-title">Transaction History</h3>

      <div v-if="walletStore.loading" class="txn-loading">
        <div v-for="n in 4" :key="n" class="txn-skeleton"></div>
      </div>

      <div v-else-if="!walletStore.transactions.length" class="empty-state">
        <div class="empty-icon">💸</div>
        <p>No transactions yet.<br>Add funds and book a session!</p>
      </div>

      <div v-else class="txn-list">
        <transition-group name="txn-fade">
          <div class="txn-item" v-for="txn in walletStore.transactions" :key="txn.id">
            <div class="txn-icon-wrap" :class="txnClass(txn.type)">
              {{ txnIcon(txn.type) }}
            </div>
            <div class="txn-info">
              <div class="txn-desc">{{ txn.description }}</div>
              <div class="txn-meta">
                <span class="txn-badge" :class="txn.type">{{ txnLabel(txn.type) }}</span>
                <span class="txn-date">{{ fmtDate(txn.created_at) }}</span>
              </div>
            </div>
            <div :class="['txn-amount', txn.amount >= 0 ? 'green' : 'red']">
              {{ txn.amount >= 0 ? '+' : '' }}₹{{ Math.abs(txn.amount).toFixed(0) }}
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Payment Success Overlay -->
    <transition name="success-pop">
      <div v-if="showSuccess" class="success-overlay">
        <div class="success-card">
          <div class="success-coins">💰💰💰</div>
          <div class="success-amount">+₹{{ successAmount.toLocaleString() }}</div>
          <div class="success-text">Added to your wallet!</div>
        </div>
      </div>
    </transition>

    <!-- Info Modal -->
    <div v-if="showInfo" class="modal-overlay" @click.self="showInfo = false">
      <div class="modal">
        <h3 class="modal-title">How Vakilr Wallet Works</h3>
        <div class="info-list">
          <div class="info-item"><span>🧪</span><p>This is a <strong>test environment</strong>. No real money involved.</p></div>
          <div class="info-item"><span>💳</span><p>Add fake funds to pay for legal consultations and documents.</p></div>
          <div class="info-item"><span>⚖️</span><p><strong>80% goes to the lawyer</strong>, 20% is Vakilr's platform fee.</p></div>
          <div class="info-item"><span>🔒</span><p>Lawyer earnings are locked for <strong>7 days</strong> for dispute protection.</p></div>
          <div class="info-item"><span>⚡</span><p>Real payments via Razorpay will be live in the next phase.</p></div>
        </div>
        <button class="modal-close" @click="showInfo = false">Got it!</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useAuthStore } from '@/stores/auth'

const walletStore = useWalletStore()
const authStore = useAuthStore()

const addingFunds = ref(null)
const customAmount = ref(null)
const showInfo = ref(false)
const showSuccess = ref(false)
const successAmount = ref(0)
const justAdded = ref(false)

onMounted(() => {
  if (authStore.user) walletStore.fetch(authStore.user.id)
})

const fmt = (n) => (n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

async function addFunds(amount) {
  if (addingFunds.value) return
  addingFunds.value = amount
  await new Promise(r => setTimeout(r, 1200)) // Fake UPI processing delay

  const result = await walletStore.addTestFunds(authStore.user.id, amount)
  addingFunds.value = null
  customAmount.value = null

  if (result.success) {
    successAmount.value = amount
    showSuccess.value = true
    justAdded.value = true
    setTimeout(() => { showSuccess.value = false; justAdded.value = false }, 2500)
  }
}

const txnIcon = (type) => ({ credit: '💳', debit: '💸', escrow: '⏳', lock: '🔒', unlock: '✅', withdrawal: '🏦', refund: '↩️' }[type] || '💰')
const txnLabel = (type) => ({ credit: 'Added', debit: 'Paid', escrow: 'Session', lock: 'Earning', unlock: 'Released', withdrawal: 'Withdrawn', refund: 'Refund' }[type] || type)
const txnClass = (type) => (['credit', 'unlock', 'refund'].includes(type) ? 'green-icon' : 'red-icon')
</script>

<style scoped>
.page { min-height: 100vh; background: #04071a; padding-bottom: 80px; }
.page-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
.orb1 { width: 300px; height: 300px; background: #C9A84C; top: -100px; right: -100px; }
.orb2 { width: 200px; height: 200px; background: #1a3a8f; bottom: 100px; left: -80px; }

.page-header {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 12px;
  padding: 3rem 1.5rem 1rem;
}
.back-btn { color: #C9A84C; font-size: 1.4rem; text-decoration: none; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
.page-title { flex: 1; font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #f0f4ff; margin: 0; }
.info-btn { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 0.85rem; }

.test-banner {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 8px;
  background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
  border-radius: 10px; margin: 0 1.5rem 1rem; padding: 10px 14px;
  font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: #4ade80;
}

.balance-section { position: relative; z-index: 1; padding: 0 1.5rem 1.5rem; }
.balance-card {
  background: linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(10,15,44,0.9) 100%);
  border: 1px solid rgba(201,168,76,0.3); border-radius: 20px;
  padding: 1.8rem; position: relative; overflow: hidden;
  transition: all 0.3s;
}
.balance-card.pulse { animation: cardPulse 0.6s ease; }
@keyframes cardPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); box-shadow: 0 0 40px rgba(201,168,76,0.4); } }
.bc-glow { position: absolute; top: -50%; right: -20%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%); pointer-events: none; }
.bc-label { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: rgba(201,168,76,0.7); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
.bc-amount { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 700; color: #C9A84C; margin-bottom: 1.5rem; }
.bc-num { display: inline-block; }
.bc-num.bounce { animation: numBounce 0.5s ease; }
@keyframes numBounce { 0% { transform: scale(1); } 50% { transform: scale(1.15); color: #fff; } 100% { transform: scale(1); } }
.bc-row { display: flex; align-items: center; gap: 1rem; }
.bc-stat { flex: 1; text-align: center; }
.bc-stat-val { font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 700; color: #f0f4ff; }
.bc-stat-label { font-size: 0.7rem; color: rgba(240,244,255,0.4); margin-top: 2px; }
.bc-divider { width: 1px; height: 30px; background: rgba(255,255,255,0.1); }

.add-funds-section { position: relative; z-index: 1; padding: 0 1.5rem 1.5rem; }
.section-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #f0f4ff; margin: 0 0 1rem; }
.fund-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.fund-btn {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; padding: 16px 12px; cursor: pointer; display: flex;
  flex-direction: column; align-items: center; gap: 4px; position: relative; overflow: hidden;
  transition: all 0.2s; color: inherit;
}
.fund-btn:active { transform: scale(0.96); background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.4); }
.fund-icon { font-size: 1.2rem; }
.fund-amt { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700; color: #f0f4ff; }
.fund-spinner { position: absolute; inset: 0; background: rgba(201,168,76,0.1); display: flex; align-items: center; justify-content: center; }
.fund-spinner::after { content: ''; width: 16px; height: 16px; border: 2px solid #C9A84C; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; }

.custom-add { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; display: flex; gap: 10px; align-items: center; }
.custom-input-row { flex: 1; display: flex; align-items: center; gap: 8px; }
.rupee-prefix { color: #C9A84C; font-family: 'DM Sans', sans-serif; font-size: 1rem; }
.custom-input { flex: 1; background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 1rem; color: #f0f4ff; }
.custom-input::placeholder { color: rgba(240,244,255,0.25); }
.custom-add-btn {
  background: linear-gradient(135deg, #C9A84C, #a8893d); border: none;
  color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 700;
  padding: 10px 14px; border-radius: 10px; cursor: pointer; white-space: nowrap;
  transition: opacity 0.2s;
}
.custom-add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.txn-section { position: relative; z-index: 1; padding: 0 1.5rem; }
.txn-loading { display: flex; flex-direction: column; gap: 10px; }
.txn-skeleton { height: 64px; background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; border-radius: 14px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.empty-state { text-align: center; padding: 3rem; }
.empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
.empty-state p { font-family: 'DM Sans', sans-serif; color: rgba(240,244,255,0.4); font-size: 0.9rem; line-height: 1.5; }

.txn-list { display: flex; flex-direction: column; gap: 8px; }
.txn-item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 12px 14px; }
.txn-icon-wrap { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.txn-icon-wrap.green-icon { background: rgba(34,197,94,0.15); }
.txn-icon-wrap.red-icon { background: rgba(239,68,68,0.12); }
.txn-info { flex: 1; min-width: 0; }
.txn-desc { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: rgba(240,244,255,0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.txn-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.txn-badge { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 20px; }
.txn-badge.credit, .txn-badge.unlock, .txn-badge.refund { background: rgba(34,197,94,0.15); color: #4ade80; }
.txn-badge.debit, .txn-badge.escrow, .txn-badge.withdrawal { background: rgba(239,68,68,0.12); color: #f87171; }
.txn-badge.lock { background: rgba(251,191,36,0.12); color: #fbbf24; }
.txn-date { font-size: 0.7rem; color: rgba(240,244,255,0.3); }
.txn-amount { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700; flex-shrink: 0; }
.txn-amount.green { color: #4ade80; }
.txn-amount.red { color: #f87171; }

.txn-fade-enter-active, .txn-fade-leave-active { transition: all 0.3s; }
.txn-fade-enter-from { opacity: 0; transform: translateY(-10px); }

/* Success overlay */
.success-overlay { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.success-card { background: rgba(10,15,44,0.95); border: 1px solid rgba(201,168,76,0.4); border-radius: 24px; padding: 2rem 2.5rem; text-align: center; box-shadow: 0 0 60px rgba(201,168,76,0.3); }
.success-coins { font-size: 2rem; animation: coinBurst 0.5s ease; margin-bottom: 8px; }
@keyframes coinBurst { 0% { transform: scale(0); } 60% { transform: scale(1.3); } 100% { transform: scale(1); } }
.success-amount { font-family: 'Playfair Display', serif; font-size: 2rem; color: #C9A84C; font-weight: 700; }
.success-text { font-family: 'DM Sans', sans-serif; color: rgba(240,244,255,0.7); margin-top: 4px; }
.success-pop-enter-active { animation: popIn 0.3s ease; }
.success-pop-leave-active { animation: popIn 0.3s ease reverse; }
@keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

/* Info modal */
.modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); display: flex; align-items: flex-end; }
.modal { background: #0d1233; border-radius: 24px 24px 0 0; padding: 1.5rem; width: 100%; border-top: 1px solid rgba(201,168,76,0.2); }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #f0f4ff; margin: 0 0 1.2rem; }
.info-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem; }
.info-item { display: flex; gap: 12px; align-items: flex-start; }
.info-item span { font-size: 1.2rem; flex-shrink: 0; }
.info-item p { font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: rgba(240,244,255,0.7); margin: 0; line-height: 1.5; }
.modal-close { width: 100%; background: linear-gradient(135deg, #C9A84C, #a8893d); border: none; color: #04071a; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; padding: 14px; border-radius: 14px; cursor: pointer; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>