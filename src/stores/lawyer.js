import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { verifyLawyerWithAI, checkRatesOnLogin } from '@/lib/deepseek'

export const useLawyerStore = defineStore('lawyer', {
  state: () => ({
    profile: null,
    services: [],
    availability: [],
    pendingRequests: [],
    wallet: null,
    reviews: [],
    cases: [],
    verificationStatus: null,
    rateSuggestion: null,
    loading: false,
    error: null,
  }),

  actions: {
    // ─── LOAD ALL LAWYER DATA ───
    async init(userId) {
      this.loading = true
      await Promise.all([
        this.fetchProfile(userId),
        this.fetchServices(userId),
        this.fetchWallet(userId),
        this.fetchReviews(userId),
        this.fetchCases(userId),
        this.fetchAvailability(userId),
        this.checkVerificationStatus(userId),
      ])
      this.loading = false
    },

    // ─── PROFILE ───
    async fetchProfile(userId) {
      const { data } = await supabase
        .from('lawyer_profiles')
        .select('*, profiles(*)')
        .eq('id', userId)
        .single()
      if (data) this.profile = { ...data, ...data.profiles }
    },

    async updateProfile(userId, updates) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: updates.full_name, phone: updates.phone })
        .eq('id', userId)

      const { error: lawyerError } = await supabase
        .from('lawyer_profiles')
        .update({
          bio: updates.bio,
          specializations: updates.specializations,
          languages: updates.languages,
          experience_years: updates.experience_years,
          city: updates.city,
        })
        .eq('id', userId)

      if (!profileError && !lawyerError) await this.fetchProfile(userId)
      return { success: !profileError && !lawyerError }
    },

    async uploadPhoto(userId, file) {
      const ext = file.name.split('.').pop()
      const path = `avatars/${userId}.${ext}`
      const { error } = await supabase.storage.from('vakilr').upload(path, file, { upsert: true })
      if (error) return { success: false, error: error.message }
      const { data: { publicUrl } } = supabase.storage.from('vakilr').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)
      return { success: true, url: publicUrl }
    },

    // ─── SERVICES ───
    async fetchServices(userId) {
      const { data } = await supabase
        .from('lawyer_services')
        .select('*')
        .eq('lawyer_id', userId)
        .order('created_at')
      this.services = data || []
    },

    async addService(userId, service) {
      const { error } = await supabase.from('lawyer_services').insert({
        lawyer_id: userId, ...service,
      })
      if (!error) await this.fetchServices(userId)
      return { success: !error }
    },

    async updateService(serviceId, updates) {
      const { error } = await supabase
        .from('lawyer_services')
        .update(updates)
        .eq('id', serviceId)
      return { success: !error }
    },

    async deleteService(serviceId, userId) {
      await supabase.from('lawyer_services').delete().eq('id', serviceId)
      await this.fetchServices(userId)
    },

    // ─── AVAILABILITY ───
    async fetchAvailability(userId) {
      const { data } = await supabase
        .from('availability')
        .select('*')
        .eq('lawyer_id', userId)
        .order('day_of_week')
      this.availability = data || []
    },

    async saveAvailability(userId, schedule) {
      await supabase.from('availability').delete().eq('lawyer_id', userId)
      if (schedule.length > 0) {
        await supabase.from('availability').insert(
          schedule.map(s => ({ ...s, lawyer_id: userId }))
        )
      }
      await this.fetchAvailability(userId)
    },

    // ─── STATUS TOGGLE ───
    async setAvailabilityStatus(userId, status) {
      await supabase
        .from('lawyer_profiles')
        .update({ availability_status: status })
        .eq('id', userId)
      if (this.profile) this.profile.availability_status = status
    },

    // ─── WALLET ───
    async fetchWallet(userId) {
      const { data } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single()
      this.wallet = data

      const { data: txns } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
      if (this.wallet) this.wallet.transactions = txns || []
    },

    async withdrawFunds(userId, amount) {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('available_balance')
        .eq('user_id', userId)
        .single()

      if (!wallet || wallet.available_balance < amount)
        return { success: false, error: 'Insufficient balance' }

      await supabase.from('wallets').update({
        available_balance: wallet.available_balance - amount,
      }).eq('user_id', userId)

      await supabase.from('transactions').insert({
        wallet_id: userId,
        type: 'withdrawal',
        amount: -amount,
        description: 'Withdrawal to bank account',
      })

      await this.fetchWallet(userId)
      return { success: true }
    },

    // ─── REVIEWS ───
    async fetchReviews(userId) {
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles:client_id(full_name, avatar_url)')
        .eq('lawyer_id', userId)
        .order('created_at', { ascending: false })
      this.reviews = data || []
    },

    // ─── COURT CASES ───
    async fetchCases(userId) {
      const { data } = await supabase
        .from('court_cases')
        .select('*, profiles:client_id(full_name)')
        .eq('lawyer_id', userId)
        .order('created_at', { ascending: false })
      this.cases = data || []
    },

    // ─── PENDING REQUESTS ───
    async fetchPendingRequests(userId) {
      const { data } = await supabase
        .from('sessions')
        .select('*, profiles:client_id(full_name, avatar_url)')
        .eq('lawyer_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      this.pendingRequests = data || []
    },

    async acceptRequest(sessionId) {
      await supabase.from('sessions').update({
        status: 'active',
        started_at: new Date().toISOString(),
      }).eq('id', sessionId)
      await this.fetchPendingRequests(this.profile?.id)
    },

    async declineRequest(sessionId) {
      await supabase.from('sessions').update({ status: 'cancelled' }).eq('id', sessionId)
      await this.fetchPendingRequests(this.profile?.id)
    },

    // ─── AI VERIFICATION ───
    async checkVerificationStatus(userId) {
      const { data } = await supabase
        .from('verification_queue')
        .select('*')
        .eq('lawyer_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        this.verificationStatus = data
        if (data.status === 'done' && data.rate_suggestion) {
          this.rateSuggestion = data.rate_suggestion
        }
      }
    },

    async submitForVerification(userId, lawyerData) {
      const existing = await supabase
        .from('verification_queue')
        .select('id, status')
        .eq('lawyer_id', userId)
        .eq('status', 'pending')
        .single()

      if (existing.data) return { success: false, error: 'Already in queue' }

      await supabase.from('verification_queue').insert({
        lawyer_id: userId,
        certificate_url: lawyerData.certificate_url,
        bar_council_number: lawyerData.bar_council_number,
        status: 'pending',
      })

      // Trigger AI verification (runs async — simulates 12hr delay in prod)
      this._runAIVerification(userId, lawyerData)
      return { success: true }
    },

    async _runAIVerification(userId, lawyerData) {
      // Get market averages
      const { data: avgData } = await supabase.rpc('get_market_averages').catch(() => ({ data: null }))
      const marketAverages = avgData || { chat: 20, voice: 30, video: 40, document: 299 }

      try {
        const result = await verifyLawyerWithAI({
          name: lawyerData.full_name,
          barCouncilNumber: lawyerData.bar_council_number,
          specializations: lawyerData.specializations || [],
          experienceYears: lawyerData.experience_years || 0,
          city: lawyerData.city || '',
          rateChat: lawyerData.chat_rate || 20,
          rateVoice: lawyerData.voice_rate || 30,
          rateVideo: lawyerData.video_rate || 40,
          rateDocument: lawyerData.doc_rate || 299,
          averageLawyers: marketAverages,
        })

        await supabase.from('verification_queue')
          .update({
            status: 'done',
            processed_at: new Date().toISOString(),
            ai_decision: result.decision,
            ai_reasoning: result.reasoning,
            rate_suggestion: result.rate_suggestion,
          })
          .eq('lawyer_id', userId)
          .eq('status', 'pending')

        if (result.decision === 'approved') {
          await supabase.from('profiles').update({
            is_verified: true,
            verification_status: 'approved',
          }).eq('id', userId)
        }
      } catch (err) {
        console.error('AI verification failed:', err)
      }
    },

    // ─── CHECK RATES ON LOGIN ───
    async checkRatesOnLoginForLawyer(userId) {
      if (!this.profile) return
      const marketAverages = { chat: 20, voice: 30, video: 40, document: 299 }
      const suggestion = await checkRatesOnLogin({
        lawyerData: this.profile,
        marketAverages,
      })
      if (suggestion) this.rateSuggestion = suggestion.message
    },
  },
})