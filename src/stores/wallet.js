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
  }),

  getters: {
    totalBalance: (s) => s.balance + s.lockedBalance,
    availableForWithdraw: (s) => Math.max(0, s.balance),
  },

  actions: {
    async fetch(userId) {
      this.loading = true
      const { data: wallet } = await supabase
        .from('wallets').select('*').eq('user_id', userId).single()
      if (wallet) {
        this.balance       = wallet.available_balance || 0
        this.lockedBalance = wallet.locked_balance    || 0
        this.totalEarned   = wallet.total_earned      || 0
        this.totalSpent    = wallet.total_spent       || 0
      }
      const { data: txns } = await supabase
        .from('transactions').select('*')
        .eq('wallet_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
      this.transactions = txns || []
      this.loading = false
    },

    async initTestWallet(userId) {
      const { data: existing } = await supabase
        .from('wallets').select('id').eq('user_id', userId).single()
      if (!existing) {
        await supabase.from('wallets').insert({
          user_id: userId, available_balance: 10000,
          locked_balance: 0, total_earned: 0, total_spent: 0,
        })
        await supabase.from('transactions').insert({
          wallet_id: userId, type: 'credit', amount: 10000,
          description: '🎁 Welcome Credits — Vakilr Test Balance',
        })
      }
      await this.fetch(userId)
    },

    async addTestFunds(userId, amount = 5000) {
      const { data: w } = await supabase
        .from('wallets').select('available_balance').eq('user_id', userId).single()
      if (!w) return { success: false }
      await supabase.from('wallets').update({
        available_balance: w.available_balance + amount,
      }).eq('user_id', userId)
      await supabase.from('transactions').insert({
        wallet_id: userId, type: 'credit', amount,
        description: '💳 Funds added via UPI',
      })
      await this.fetch(userId)
      return { success: true }
    },

    // ─── Helper: check if lawyer belongs to a firm ───
    async _getLawyerFirmId(lawyerId) {
      const { data } = await supabase
        .from('lawyer_profiles')
        .select('firm_id')
        .eq('id', lawyerId)
        .single()
      return data?.firm_id || null
    },

    // ─── Helper: ensure wallet exists for a user ───
    async _ensureWallet(userId) {
      const { data } = await supabase
        .from('wallets').select('id').eq('user_id', userId).single()
      if (!data) {
        await supabase.from('wallets').insert({
          user_id: userId, available_balance: 0,
          locked_balance: 0, total_earned: 0, total_spent: 0,
        })
      }
    },

    // ─── Escrow: Hold client money, credit lawyer/firm ───
    async escrowFunds(clientId, amount, sessionId, lawyerId) {
      const { data: clientWallet } = await supabase
        .from('wallets').select('*').eq('user_id', clientId).single()

      if (!clientWallet || clientWallet.available_balance < amount)
        return { success: false, error: 'Insufficient balance' }

      // Deduct from client
      await supabase.from('wallets').update({
        available_balance: clientWallet.available_balance - amount,
        total_spent: clientWallet.total_spent + amount,
      }).eq('user_id', clientId)
      await supabase.from('transactions').insert({
        wallet_id: clientId, session_id: sessionId,
        type: 'escrow', amount: -amount,
        description: `⏳ Session payment escrowed`,
        lock_release_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
      })

      const lawyerEarning = Math.floor(amount * 0.8)
      const platformFee   = amount - lawyerEarning
      const releaseAt     = new Date(Date.now() + 7 * 24 * 3600000).toISOString()

      // ✅ Check if lawyer is under a firm
      const firmId = await this._getLawyerFirmId(lawyerId)

      if (firmId) {
        // ── Firm lawyer: earnings → FIRM wallet ──
        await this._ensureWallet(firmId)
        const { data: fw } = await supabase
          .from('wallets').select('*').eq('user_id', firmId).single()
        await supabase.from('wallets').update({
          locked_balance: fw.locked_balance + lawyerEarning,
          total_earned:   fw.total_earned   + lawyerEarning,
        }).eq('user_id', firmId)

        // Firm wallet transaction
        await supabase.from('transactions').insert({
          wallet_id: firmId, session_id: sessionId,
          type: 'lock', amount: lawyerEarning,
          description: `🔒 Firm earnings — ${lawyerEarning} (lawyer session) | Platform: ₹${platformFee}`,
          lock_release_at: releaseAt,
        })

        // ✅ Lawyer work history (no money, just record for their log)
        await supabase.from('transactions').insert({
          wallet_id: lawyerId, session_id: sessionId,
          type: 'firm_credit', amount: lawyerEarning,
          description: `📋 Session completed — ₹${lawyerEarning} credited to firm | Firm will pay you`,
          lock_release_at: releaseAt,
        })
      } else {
        // ── Independent lawyer: earnings → LAWYER wallet (locked 7 days) ──
        const { data: lw } = await supabase
          .from('wallets').select('*').eq('user_id', lawyerId).single()
        if (lw) {
          await supabase.from('wallets').update({
            locked_balance: lw.locked_balance + lawyerEarning,
            total_earned:   lw.total_earned   + lawyerEarning,
          }).eq('user_id', lawyerId)
          await supabase.from('transactions').insert({
            wallet_id: lawyerId, session_id: sessionId,
            type: 'lock', amount: lawyerEarning,
            description: `🔒 Session earnings (7-day lock) | Platform fee: ₹${platformFee}`,
            lock_release_at: releaseAt,
          })
        }
      }

      await this.fetch(clientId)
      return { success: true, lawyerEarning, platformFee }
    },

    async deductPerMinute(userId, ratePerMinute, sessionId) {
      const { data: w } = await supabase
        .from('wallets').select('available_balance, total_spent').eq('user_id', userId).single()
      if (!w || w.available_balance < ratePerMinute)
        return { success: false, error: 'Insufficient balance' }
      await supabase.from('wallets').update({
        available_balance: w.available_balance - ratePerMinute,
        total_spent: w.total_spent + ratePerMinute,
      }).eq('user_id', userId)
      await this.fetch(userId)
      return { success: true, remaining: w.available_balance - ratePerMinute }
    },

    async payForDocument(clientId, lawyerId, sessionId, pages, pricePerPage) {
      const total         = pages * pricePerPage
      const lawyerEarning = Math.floor(total * 0.8)
      const platformFee   = total - lawyerEarning
      const releaseAt     = new Date(Date.now() + 7 * 24 * 3600000).toISOString()

      const { data: cw } = await supabase
        .from('wallets').select('*').eq('user_id', clientId).single()
      if (!cw || cw.available_balance < total)
        return { success: false, error: 'Insufficient balance' }

      await supabase.from('wallets').update({
        available_balance: cw.available_balance - total,
        total_spent: cw.total_spent + total,
      }).eq('user_id', clientId)
      await supabase.from('transactions').insert({
        wallet_id: clientId, session_id: sessionId,
        type: 'debit', amount: -total,
        description: `📄 Document service (${pages} pages × ₹${pricePerPage})`,
      })

      // ✅ Same firm check for document sessions
      const firmId = await this._getLawyerFirmId(lawyerId)
      const targetId = firmId || lawyerId

      await this._ensureWallet(targetId)
      const { data: lw } = await supabase
        .from('wallets').select('*').eq('user_id', targetId).single()
      if (lw) {
        await supabase.from('wallets').update({
          locked_balance: lw.locked_balance + lawyerEarning,
          total_earned:   lw.total_earned   + lawyerEarning,
        }).eq('user_id', targetId)
        await supabase.from('transactions').insert({
          wallet_id: targetId, session_id: sessionId,
          type: 'lock', amount: lawyerEarning,
          description: firmId
            ? `📄 Firm doc earnings (${pages}pg × ₹${pricePerPage}) — Platform: ₹${platformFee}`
            : `📄 Document earnings (${pages}pg × ₹${pricePerPage}) — Platform: ₹${platformFee}`,
          lock_release_at: releaseAt,
        })
        // If firm, log work history on lawyer too
        if (firmId) {
          await supabase.from('transactions').insert({
            wallet_id: lawyerId, session_id: sessionId,
            type: 'firm_credit', amount: lawyerEarning,
            description: `📋 Document completed — ₹${lawyerEarning} credited to firm`,
          })
        }
      }

      await this.fetch(clientId)
      return { success: true, total, lawyerEarning, platformFee }
    },

    async releaseLockedFunds(userId) {
      const now = new Date().toISOString()
      const { data: toRelease } = await supabase
        .from('transactions').select('*')
        .eq('wallet_id', userId).eq('type', 'lock')
        .lt('lock_release_at', now)
      if (!toRelease?.length) return
      const total = toRelease.reduce((s, t) => s + t.amount, 0)
      const { data: w } = await supabase
        .from('wallets').select('*').eq('user_id', userId).single()
      if (w) {
        await supabase.from('wallets').update({
          available_balance: w.available_balance + total,
          locked_balance: Math.max(0, w.locked_balance - total),
        }).eq('user_id', userId)
        for (const t of toRelease) {
          await supabase.from('transactions').update({ type: 'unlock' }).eq('id', t.id)
        }
      }
      await this.fetch(userId)
    },

    async withdraw(userId, amount) {
      const { data: w } = await supabase
        .from('wallets').select('available_balance').eq('user_id', userId).single()
      if (!w || w.available_balance < amount)
        return { success: false, error: 'Insufficient funds' }
      await supabase.from('wallets').update({
        available_balance: w.available_balance - amount,
      }).eq('user_id', userId)
      await supabase.from('transactions').insert({
        wallet_id: userId, type: 'withdrawal', amount: -amount,
        description: `🏦 Withdrawal to bank account`,
      })
      await this.fetch(userId)
      return { success: true }
    },
  },
})