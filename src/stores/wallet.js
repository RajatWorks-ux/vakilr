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
    totalBalance: (state) => state.balance + state.lockedBalance,
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
        .eq('wallet_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)
      this.transactions = txns || []
      this.loading = false
    },

    async addFunds(userId, amount) {
      const { data: wallet } = await supabase
        .from('wallets').select('available_balance').eq('user_id', userId).single()
      if (!wallet) return

      await supabase.from('wallets').update({
        available_balance: wallet.available_balance + amount,
      }).eq('user_id', userId)

      await supabase.from('transactions').insert({
        wallet_id: userId, type: 'credit', amount,
        description: 'Added to wallet (fake)',
      })
      await this.fetch(userId)
    },

    async deductFunds(userId, amount, sessionId) {
      const { data: wallet } = await supabase
        .from('wallets').select('available_balance, total_spent').eq('user_id', userId).single()
      if (!wallet || wallet.available_balance < amount)
        return { success: false, error: 'Insufficient balance' }

      await supabase.from('wallets').update({
        available_balance: wallet.available_balance - amount,
        total_spent: wallet.total_spent + amount,
      }).eq('user_id', userId)

      await supabase.from('transactions').insert({
        wallet_id: userId, session_id: sessionId,
        type: 'debit', amount: -amount,
        description: 'Session payment',
      })
      await this.fetch(userId)
      return { success: true }
    },

    // Release locked funds after 7 days
    async releaseLockedFunds(userId) {
      const now = new Date().toISOString()
      const { data: toRelease } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', userId)
        .eq('type', 'lock')
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
  },
})