<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/lawyer" class="back-btn">←</router-link>
      <h1 class="page-title">My Wallet</h1>
    </div>

    <div class="wallet-content">
      <!-- Balance Card -->
      <div class="balance-card">
        <div class="bc-glow"></div>
        <p class="bc-label">Available to Withdraw</p>
        <p class="bc-amount">₹{{ fmt(walletStore.balance) }}</p>
        <div class="bc-row">
          <div class="bc-item">
            <span class="bc-item-val">₹{{ fmt(walletStore.lockedBalance) }}</span>
            <span class="bc-item-label">Locked (7 days)</span>
          </div>
          <div class="bc-item">
            <span class="bc-item-val">₹{{ fmt(walletStore.totalEarned) }}</span>
            <span class="bc-item-label">Total Earned</span>
          </div>
        </div>
        <button class="withdraw-btn" @click="showWithdrawModal = true" :disabled="walletStore.balance <= 0">
          Withdraw to Bank →
        </button>
      </div>

      <!-- 7-day Lock Explanation -->
      <div class="lock-info">
        <span>🔒</span>
        <p>Earnings are locked for 7 days for dispute protection. After 7 days they move to available balance automatically.</p>
      </div>

      <!-- Transaction History -->
      <div class="section-header">
        <h2 class="section-title">Transaction History</h2>
      </div>

      <div v-if="walletStore.transactions.length === 0" class="empty-state">
        <span>📊</span><p>No transactions yet</p>
      </div>

      <div class="txn-list">
        <div class="txn-item" v-for="txn in walletStore.transactions" :key="txn.id">
          <div class="txn-icon">{{ txnIcons[txn.type] || '💰' }}</div>
          <div class="txn-info">
            <div class="txn-desc">{{ txn.description || txnLabels[txn.type] }}</div>
            <div class="txn-date">{{ formatDate(txn.created_at) }}</div>
          </div>
          <div :class="['txn-amount', txn.amount > 0 ? 'positive' : 'negative']">
            {{ txn.amount > 0 ? '+' : '' }}₹{{ Math.abs(txn.amount).toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="modal-overlay" @click.self="showWithdrawModal = false">
      <div class="modal">
        <h3 class="modal-title">Withdraw Funds</h3>
        <p class="modal-sub">Available: <strong>₹{{ fmt(walletStore.balance) }}</strong></p>
        <div class="field">
          <label>Amount to Withdraw</label>
          <div class="price-row">
            <span class="price-prefix">₹</span>
            <input v-model.number="withdrawAmount" type="number" :max="walletStore.balance" placeholder="Enter amount" />
          </div>
        </div>
        <div class="field">
          <label>Bank Account (Fake)</label>
          <input value="XXXX XXXX XXXX 1234" readonly style="color:rgba(240,244,255,0.4)" />
        </div>
        <div v-if="withdrawError" class="error-msg">{{ withdrawError }}</div>
        <div class="modal-actions">
          <button class="modal-cancel" @click="showWithdrawModal = false">Cancel</button>
          <button class="modal-confirm" @click="doWithdraw" :disabled="withdrawing">
            {{ withdrawing ? 'Processing...' : 'Withdraw' }}
          </button>
        </div>
      </div>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWalletStore } from '@/stores/wallet'
import { useLawyerStore } from '@/stores/lawyer'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'

const auth         = useAuthStore()
const walletStore  = useWalletStore()
const lawyerStore  = useLawyerStore()

const showWithdrawModal = ref(false)
const withdrawAmount    = ref('')
const withdrawError     = ref('')
const withdrawing       = ref(false)

const txnIcons  = { credit:'💰', debit:'💸', lock:'🔒', unlock:'🔓', withdrawal:'🏦' }
const txnLabels = { credit:'Payment received', debit:'Session payment', lock:'Earning locked', unlock:'Funds released', withdrawal:'Bank withdrawal' }

function fmt(n) { return Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 }) }
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

async function doWithdraw() {
  if (!withdrawAmount.value || withdrawAmount.value <= 0) {
    withdrawError.value = 'Enter a valid amount'
    return
  }
  if (withdrawAmount.value > walletStore.balance) {
    withdrawError.value = 'Insufficient balance'
    return
  }
  withdrawing.value  = true
  withdrawError.value = ''
  const result = await lawyerStore.withdrawFunds(auth.user.id, withdrawAmount.value)
  withdrawing.value  = false
  if (result.success) {
    showWithdrawModal.value = false
    withdrawAmount.value    = ''
    await walletStore.fetch(auth.user.id)
  } else {
    withdrawError.value = result.error
  }
}

onMounted(async () => {
  await walletStore.fetch(auth.user.id)
  await walletStore.releaseLockedFunds(auth.user.id)
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.wallet-content{position:relative;z-index:1;padding:1.25rem}
.balance-card{background:linear-gradient(135deg,#1a1400,#2a1f00,#1a1400);border:1px solid rgba(201,168,76,0.4);border-radius:18px;padding:1.5rem;margin-bottom:1rem;position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(201,168,76,0.15)}
.bc-glow{position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.2),transparent 70%);pointer-events:none}
.bc-label{font-size:0.72rem;color:rgba(201,168,76,0.6);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.4rem}
.bc-amount{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:900;color:#f0d080;margin-bottom:1.25rem}
.bc-row{display:flex;gap:2rem;margin-bottom:1.25rem}
.bc-item{flex:1}
.bc-item-val{display:block;font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#C9A84C}
.bc-item-label{font-size:0.68rem;color:rgba(201,168,76,0.5);text-transform:uppercase;letter-spacing:0.06em}
.withdraw-btn{width:100%;padding:0.875rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer;transition:all 0.2s}
.withdraw-btn:disabled{opacity:0.4;cursor:not-allowed}
.lock-info{display:flex;align-items:flex-start;gap:0.75rem;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.18);border-radius:12px;padding:0.875rem;margin-bottom:1.25rem}
.lock-info span{font-size:1.1rem;flex-shrink:0}
.lock-info p{font-size:0.8rem;color:rgba(240,244,255,0.6);line-height:1.5}
.section-header{margin-bottom:0.75rem}
.section-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff}
.empty-state{text-align:center;padding:2rem;color:rgba(240,244,255,0.4)}
.empty-state span{font-size:2rem;display:block;margin-bottom:0.5rem}
.empty-state p{font-size:0.85rem}
.txn-list{}
.txn-item{display:flex;align-items:center;gap:0.875rem;padding:0.875rem;border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.2s}
.txn-item:hover{background:rgba(255,255,255,0.02)}
.txn-icon{font-size:1.3rem;flex-shrink:0}
.txn-info{flex:1}
.txn-desc{font-size:0.85rem;font-weight:600;color:#f0f4ff}
.txn-date{font-size:0.72rem;color:rgba(240,244,255,0.4);margin-top:0.15rem}
.txn-amount{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700}
.txn-amount.positive{color:#10b981}
.txn-amount.negative{color:#ef4444}
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center}
.modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem;width:100%;max-width:480px}
.modal-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff;margin-bottom:0.25rem}
.modal-sub{font-size:0.85rem;color:rgba(240,244,255,0.6);margin-bottom:1.25rem}
.modal-sub strong{color:#C9A84C}
.field{display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1rem}
.field label{font-size:0.72rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em}
.field input{height:44px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.9rem;padding:0 0.875rem;outline:none}
.field input:focus{border-color:#C9A84C}
.price-row{display:flex;align-items:center;position:relative}
.price-prefix{position:absolute;left:0.875rem;color:#8892b0}
.price-row input{padding-left:1.8rem;width:100%}
.error-msg{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;padding:0.6rem;border-radius:8px;font-size:0.8rem;margin-bottom:0.75rem}
.modal-actions{display:flex;gap:0.75rem}
.modal-cancel{flex:1;padding:0.875rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer}
.modal-confirm{flex:2;padding:0.875rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer}
.modal-confirm:disabled{opacity:0.4;cursor:not-allowed}
</style>