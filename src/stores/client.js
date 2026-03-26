import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useClientStore = defineStore('client', {
  state: () => ({
    profile: null,
    savedLawyers: [],
    sessions: [],
    loading: false,
  }),

  actions: {
    async init(userId) {
      await Promise.all([
        this.fetchProfile(userId),
        this.fetchSavedLawyers(userId),
        this.fetchSessions(userId),
      ])
    },

    async fetchProfile(userId) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (data) this.profile = data
    },

    // ─── BROWSE LAWYERS ───
    async browseLawyers({ specialization, language, minRate, maxRate, minRating, status, search } = {}) {
      let query = supabase
        .from('lawyer_profiles')
        .select(`
          *,
          profiles!inner(full_name, avatar_url, is_verified),
          lawyer_services(service_type, price_amount, price_unit, is_active)
        `)
        .eq('profiles.is_verified', true)

      if (specialization) query = query.contains('specializations', [specialization])
      if (language)        query = query.contains('languages', [language])
      if (status)          query = query.eq('availability_status', status)
      if (minRating)       query = query.gte('rating', minRating)
      if (search) {
        query = query.or(`profiles.full_name.ilike.%${search}%`)
      }

      const { data } = await query.order('rating', { ascending: false }).limit(30)
      return data || []
    },

    async getLawyerProfile(lawyerId) {
      const { data } = await supabase
        .from('lawyer_profiles')
        .select(`
          *,
          profiles(full_name, avatar_url, is_verified, email),
          lawyer_services(*),
          availability(*)
        `)
        .eq('id', lawyerId)
        .single()
      return data
    },

    // ─── SAVED LAWYERS ───
    async fetchSavedLawyers(userId) {
      const saved = JSON.parse(localStorage.getItem(`vakilr_saved_${userId}`) || '[]')
      if (saved.length === 0) { this.savedLawyers = []; return }
      const { data } = await supabase
        .from('lawyer_profiles')
        .select('*, profiles(full_name, avatar_url)')
        .in('id', saved)
      this.savedLawyers = data || []
    },

    toggleSaveLawyer(userId, lawyerId) {
      const key = `vakilr_saved_${userId}`
      const saved = JSON.parse(localStorage.getItem(key) || '[]')
      const idx = saved.indexOf(lawyerId)
      if (idx === -1) saved.push(lawyerId)
      else saved.splice(idx, 1)
      localStorage.setItem(key, JSON.stringify(saved))
      this.fetchSavedLawyers(userId)
      return idx === -1
    },

    isSaved(userId, lawyerId) {
      const saved = JSON.parse(localStorage.getItem(`vakilr_saved_${userId}`) || '[]')
      return saved.includes(lawyerId)
    },

    // ─── SESSIONS ───
    async fetchSessions(userId) {
      const { data } = await supabase
        .from('sessions')
        .select('*, profiles:lawyer_id(full_name, avatar_url)')
        .eq('client_id', userId)
        .order('created_at', { ascending: false })
      this.sessions = data || []
    },

    async createSession({ clientId, lawyerId, sessionType, ratePerMinute, flatRate }) {
      const { data, error } = await supabase.from('sessions').insert({
        client_id: clientId,
        lawyer_id: lawyerId,
        session_type: sessionType,
        rate_per_minute: ratePerMinute,
        flat_rate: flatRate,
        status: 'pending',
      }).select().single()
      if (error) return { success: false, error: error.message }
      return { success: true, session: data }
    },

    // ─── REVIEWS ───
    async getReviewsForLawyer(lawyerId) {
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles:client_id(full_name, avatar_url)')
        .eq('lawyer_id', lawyerId)
        .order('created_at', { ascending: false })
        .limit(20)
      return data || []
    },

    async submitReview({ sessionId, clientId, lawyerId, rating, comment }) {
      const { error } = await supabase.from('reviews').insert({
        session_id: sessionId, client_id: clientId,
        lawyer_id: lawyerId, rating, comment,
      })
      if (!error) {
        const { data: allReviews } = await supabase
          .from('reviews').select('rating').eq('lawyer_id', lawyerId)
        if (allReviews) {
          const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
          await supabase.from('lawyer_profiles')
            .update({ rating: Math.round(avg * 10) / 10, total_cases: allReviews.length })
            .eq('id', lawyerId)
        }
      }
      return { success: !error }
    },
  },
})