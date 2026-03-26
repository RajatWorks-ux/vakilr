import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { judgeDispute } from '@/lib/deepseek'

export const useDisputeStore = defineStore('dispute', {
  state: () => ({
    disputes: [],
    currentDispute: null,
    loading: false,
  }),

  actions: {
    async fileDispute({ sessionId, filedBy, against, reason, description, amountDisputed, evidenceUrls = [] }) {
      const { data: session } = await supabase
        .from('sessions').select('total_amount').eq('id', sessionId).single()

      const tier = (session?.total_amount || 0) < 2000 ? 1
                 : (session?.total_amount || 0) < 25000 ? 2 : 3

      const { data, error } = await supabase.from('disputes').insert({
        session_id: sessionId,
        filed_by: filedBy,
        against,
        reason,
        description,
        evidence_urls: evidenceUrls,
        amount_disputed: amountDisputed,
        tier,
        status: 'filed',
      }).select().single()

      if (error) return { success: false, error: error.message }

      // Tier 1 & 2 → AI decides in 12 hours (simulated)
      if (tier <= 2) this._scheduleAIDecision(data.id, sessionId)
      return { success: true, dispute: data }
    },

    async _scheduleAIDecision(disputeId, sessionId) {
      // In production: Supabase Edge Function with 12hr delay
      // For demo: runs after 5 seconds to show functionality
      setTimeout(async () => {
        const { data: dispute } = await supabase
          .from('disputes').select('*').eq('id', disputeId).single()
        const { data: session } = await supabase
          .from('sessions').select('*').eq('id', sessionId).single()

        if (!dispute || dispute.status !== 'filed') return

        await supabase.from('disputes').update({ status: 'under_review' }).eq('id', disputeId)

        try {
          const result = await judgeDispute({
            sessionType: session?.session_type,
            clientClaim: dispute.description,
            lawyerResponse: null,
            sessionDuration: Math.floor((session?.duration_seconds || 0) / 60),
            amountPaid: dispute.amount_disputed,
            sessionNotes: session?.notes,
          })

          await supabase.from('disputes').update({
            status: 'decided',
            ai_decision: result.decision,
            ai_reasoning: result.reasoning,
            final_decision: result.decision_summary,
            decided_at: new Date().toISOString(),
          }).eq('id', disputeId)

          // Process refund if applicable
          if (result.refund_amount > 0 && session?.client_id) {
            const { data: wallet } = await supabase
              .from('wallets').select('available_balance').eq('user_id', session.client_id).single()
            if (wallet) {
              await supabase.from('wallets').update({
                available_balance: wallet.available_balance + result.refund_amount,
              }).eq('user_id', session.client_id)
            }
          }
        } catch (err) {
          console.error('AI judgment failed:', err)
        }
      }, 5000)
    },

    async fetchMyDisputes(userId) {
      const { data } = await supabase
        .from('disputes')
        .select('*, sessions(session_type, total_amount)')
        .or(`filed_by.eq.${userId},against.eq.${userId}`)
        .order('created_at', { ascending: false })
      this.disputes = data || []
    },

    async fetchDispute(disputeId) {
      const { data } = await supabase
        .from('disputes')
        .select('*, sessions(*), profiles:filed_by(full_name)')
        .eq('id', disputeId)
        .single()
      this.currentDispute = data
      return data
    },

    async getAllDisputes() {
      const { data } = await supabase
        .from('disputes')
        .select('*, sessions(session_type, total_amount), profiles:filed_by(full_name)')
        .order('created_at', { ascending: false })
      return data || []
    },
  },
})