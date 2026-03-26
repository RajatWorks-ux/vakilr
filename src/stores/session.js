import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { sendMessage, getMessages, subscribeToMessages } from '@/lib/realtime'

export const useSessionStore = defineStore('session', {
  state: () => ({
    currentSession: null,
    messages: [],
    timerSeconds: 0,
    timerInterval: null,
    totalCost: 0,
    messageSubscription: null,
    loading: false,
  }),

  getters: {
    formattedTime: (state) => {
      const m = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0')
      const s = (state.timerSeconds % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    },
    formattedCost: (state) => `₹${state.totalCost.toFixed(2)}`,
  },

  actions: {
    async loadSession(sessionId) {
      const { data } = await supabase
        .from('sessions')
        .select('*, profiles:lawyer_id(full_name, avatar_url), client:client_id(full_name)')
        .eq('id', sessionId)
        .single()
      this.currentSession = data
      this.messages = await getMessages(sessionId)
    },

    startTimer() {
      if (this.timerInterval) return
      this.timerInterval = setInterval(() => {
        this.timerSeconds++
        if (this.currentSession?.rate_per_minute) {
          this.totalCost = (this.timerSeconds / 60) * this.currentSession.rate_per_minute
        }
      }, 1000)
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    subscribeMessages(sessionId) {
      this.messageSubscription = subscribeToMessages(sessionId, (msg) => {
        this.messages.push(msg)
      })
    },

    unsubscribeMessages() {
      this.messageSubscription?.unsubscribe()
      this.messageSubscription = null
    },

    async sendChat(sessionId, senderId, content) {
      const msg = await sendMessage(sessionId, senderId, content)
      return msg
    },

    async endSession(sessionId) {
      this.stopTimer()
      const duration = this.timerSeconds
      const total = this.totalCost
      const platformFee = total * 0.2
      const lawyerEarning = total * 0.8

      await supabase.from('sessions').update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration_seconds: duration,
        total_amount: total,
        platform_fee: platformFee,
        lawyer_earning: lawyerEarning,
      }).eq('id', sessionId)

      // Credit lawyer wallet
      if (this.currentSession?.lawyer_id) {
        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', this.currentSession.lawyer_id)
          .single()

        if (wallet) {
          await supabase.from('wallets').update({
            locked_balance: wallet.locked_balance + lawyerEarning,
            total_earned: wallet.total_earned + lawyerEarning,
          }).eq('user_id', this.currentSession.lawyer_id)

          await supabase.from('transactions').insert({
            wallet_id: this.currentSession.lawyer_id,
            session_id: sessionId,
            type: 'lock',
            amount: lawyerEarning,
            description: `Session earning — locked 7 days`,
            lock_release_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
        }
      }

      this.unsubscribeMessages()
      return { total, platformFee, lawyerEarning }
    },

    reset() {
      this.stopTimer()
      this.unsubscribeMessages()
      this.currentSession = null
      this.messages = []
      this.timerSeconds = 0
      this.totalCost = 0
    },
  },
})