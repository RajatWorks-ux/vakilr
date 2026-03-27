
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    balance: 0,
    lockedBalance: 0,
    totalEarned: 0,
    totalSpent: 0,
    transactions: [],
    loading: false,
    escrowItems: [],
  }),

  getters: {
    totalBalance: (state) => state.balance + state.lockedBalance,
    availableForWithdraw: (state) => Math.max(0, state.balance),
  },

  actions: {
    async fetch(userId) {
      this.loading = true
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (wallet) {
        this.balance       = wallet.available_balance || 0
        this.lockedBalance = wallet.locked_balance    || 0
        this.totalEarned   = wallet.total_earned      || 0
        this.totalSpent    = wallet.total_spent       || 0
      }

      const { data: txns } = await supabase
        .from('transactions')
        .select('*')
        .or(`wallet_id.eq.${userId},session_id.not.is.null`)
        .eq('wallet_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
      this.transactions = txns || []
      this.loading = false
    },

    // ─── Initialize wallet with ₹10,000 test balance ───
    async initTestWallet(userId) {
      const { data: existing } = await supabase
        .from('wallets').select('id').eq('user_id', userId).single()

      if (!existing) {
        await supabase.from('wallets').insert({
          user_id: userId,
          available_balance: 10000,
          locked_balance: 0,
          total_earned: 0,
          total_spent: 0,
        })
        await supabase.from('transactions').insert({
          wallet_id: userId,
          type: 'credit',
          amount: 10000,
          description: '🎁 Test Credits — Welcome to Vakilr!',
        })
      }
      await this.fetch(userId)
    },

    // ─── Add test funds ───
    async addTestFunds(userId, amount = 5000) {
      const { data: wallet } = await supabase
        .from('wallets').select('available_balance').eq('user_id', userId).single()
      if (!wallet) return { success: false }

      await supabase.from('wallets').update({
        available_balance: wallet.available_balance + amount,
      }).eq('user_id', userId)

      await supabase.from('transactions').insert({
        wallet_id: userId,
        type: 'credit',
        amount,
        description: `💳 Test funds added via fake UPI`,
      })
      await this.fetch(userId)
      return { success: true }
    },

    // ─── Escrow: Hold money when session starts ───
    async escrowFunds(userId, amount, sessionId, lawyerId) {
      const { data: wallet } = await supabase
        .from('wallets').select('available_balance, total_spent').eq('user_id', userId).single()

      if (!wallet || wallet.available_balance < amount)
        return { success: false, error: 'Insufficient balance' }

      await supabase.from('wallets').update({
        available_balance: wallet.available_balance - amount,
        total_spent: wallet.total_spent + amount,
      }).eq('user_id', userId)

      await supabase.from('transactions').insert({
        wallet_id: userId,
        session_id: sessionId,
        type: 'escrow',
        amount: -amount,
        description: `⏳ Escrowed for session`,
        lock_release_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
      })

      // Pay lawyer (80%) — locked for 7 days
      const lawyerEarning = Math.floor(amount * 0.8)
      const platformFee   = amount - lawyerEarning
      const { data: lw } = await supabase
        .from('wallets').select('*').eq('user_id', lawyerId).single()
      if (lw) {
        await supabase.from('wallets').update({
          locked_balance: lw.locked_balance + lawyerEarning,
          total_earned:   lw.total_earned   + lawyerEarning,
        }).eq('user_id', lawyerId)

        await supabase.from('transactions').insert({
          wallet_id: lawyerId,
          session_id: sessionId,
          type: 'lock',
          amount: lawyerEarning,
          description: `🔒 Session earnings (7-day lock) | Platform fee: ₹${platformFee}`,
          lock_release_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
        })
      }

      await this.fetch(userId)
      return { success: true, lawyerEarning, platformFee }
    },

    // ─── Per-minute deduction during live chat/call ───
    async deductPerMinute(userId, ratePerMinute, sessionId) {
      const { data: wallet } = await supabase
        .from('wallets').select('available_balance, total_spent').eq('user_id', userId).single()
      if (!wallet || wallet.available_balance < ratePerMinute)
        return { success: false, error: 'Insufficient balance' }

      await supabase.from('wallets').update({
        available_balance: wallet.available_balance - ratePerMinute,
        total_spent: wallet.total_spent + ratePerMinute,
      }).eq('user_id', userId)

      await this.fetch(userId)
      return { success: true, remaining: wallet.available_balance - ratePerMinute }
    },

    // ─── Document per-page payment ───
    async payForDocument(clientId, lawyerId, sessionId, pages, pricePerPage) {
      const total         = pages * pricePerPage
      const lawyerEarning = Math.floor(total * 0.8)
      const platformFee   = total - lawyerEarning

      const { data: wallet } = await supabase
        .from('wallets').select('available_balance, total_spent').eq('user_id', clientId).single()
      if (!wallet || wallet.available_balance < total)
        return { success: false, error: 'Insufficient balance' }

      // Deduct from client
      await supabase.from('wallets').update({
        available_balance: wallet.available_balance - total,
        total_spent: wallet.total_spent + total,
      }).eq('user_id', clientId)

      await supabase.from('transactions').insert({
        wallet_id: clientId, session_id: sessionId,
        type: 'debit', amount: -total,
        description: `📄 Document service (${pages} pages × ₹${pricePerPage})`,
      })

      // Credit lawyer (locked 7 days)
      const { data: lw } = await supabase
        .from('wallets').select('*').eq('user_id', lawyerId).single()
      if (lw) {
        await supabase.from('wallets').update({
          locked_balance: lw.locked_balance + lawyerEarning,
          total_earned: lw.total_earned + lawyerEarning,
        }).eq('user_id', lawyerId)

        await supabase.from('transactions').insert({
          wallet_id: lawyerId, session_id: sessionId,
          type: 'lock', amount: lawyerEarning,
          description: `📄 Document earnings (${pages} pg × ₹${pricePerPage}) — Platform: ₹${platformFee}`,
          lock_release_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
        })
      }

      await this.fetch(clientId)
      return { success: true, total, lawyerEarning, platformFee }
    },

    // ─── Release 7-day locks ───
    async releaseLockedFunds(userId) {
      const now = new Date().toISOString()
      const { data: toRelease } = await supabase
        .from('transactions').select('*')
        .eq('wallet_id', userId).eq('type', 'lock')
        .lt('lock_release_at', now)

      if (!toRelease?.length) return

      const total = toRelease.reduce((s, t) => s + t.amount, 0)
      const { data: wallet } = await supabase
        .from('wallets').select('*').eq('user_id', userId).single()

      if (wallet) {
        await supabase.from('wallets').update({
          available_balance: wallet.available_balance + total,
          locked_balance: Math.max(0, wallet.locked_balance - total),
        }).eq('user_id', userId)

        for (const t of toRelease) {
          await supabase.from('transactions').update({ type: 'unlock' }).eq('id', t.id)
        }
      }
      await this.fetch(userId)
    },

    // ─── Simulate withdrawal ───
    async withdraw(userId, amount) {
      const { data: wallet } = await supabase
        .from('wallets').select('available_balance').eq('user_id', userId).single()

      if (!wallet || wallet.available_balance < amount)
        return { success: false, error: 'Insufficient funds' }

      await supabase.from('wallets').update({
        available_balance: wallet.available_balance - amount,
      }).eq('user_id', userId)

      await supabase.from('transactions').insert({
        wallet_id: userId, type: 'withdrawal', amount: -amount,
        description: `🏦 Withdrawal to bank account (simulated)`,
      })
      await this.fetch(userId)
      return { success: true }
    },
  },
})