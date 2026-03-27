import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    role: (state) => state.profile?.role || null,
    isVerified: (state) => state.profile?.is_verified || false,
    verificationStatus: (state) => state.profile?.verification_status || 'pending',
  },

  actions: {
    // ─── SIGN UP ───
    async signUp({ email, password, full_name, phone, role }) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        // Create profile row
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            role,
            full_name,
            email,
            phone,
            is_verified: role === 'client', // clients auto-verified
            verification_status: role === 'client' ? 'approved' : 'pending',
          })
        if (profileError) throw profileError

        this.user = data.user
        await this.fetchProfile()
        return { success: true }
      } catch (e) {
        this.error = e.message
        return { success: false, error: e.message }
      } finally {
        this.loading = false
      }
    },

    // ─── SIGN UP LAWYER EXTRA ───
    async createLawyerProfile({ bar_council_number, specializations, experience_years, city, languages }) {
      try {
        const { error } = await supabase
          .from('lawyer_profiles')
          .insert({
            id: this.user.id,
            bar_council_number,
            specializations,
            experience_years,
            city,
            languages,
          })
        if (error) throw error
        return { success: true }
      } catch (e) {
        return { success: false, error: e.message }
      }
    },

    // ─── SIGN UP FIRM EXTRA ───
    async createFirmProfile({ firm_name, registration_number, team_size, address, city }) {
      try {
        const { error } = await supabase
          .from('firm_profiles')
          .insert({
            id: this.user.id,
            firm_name,
            registration_number,
            team_size,
            address,
            city,
          })
        if (error) throw error
        return { success: true }
      } catch (e) {
        return { success: false, error: e.message }
      }
    },

    // ─── LOG IN ───
    async signIn({ email, password }) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        this.user = data.user
        await this.fetchProfile()
        return { success: true }
      } catch (e) {
        this.error = e.message
        return { success: false, error: e.message }
      } finally {
        this.loading = false
      }
    },

    // ─── LOG OUT ───
    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      // Router navigation handled by component
    },

    // ─── FORGOT PASSWORD ───
    async forgotPassword(email) {
      this.loading = true
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#/reset-password`,
        })
        if (error) throw error
        return { success: true }
      } catch (e) {
        return { success: false, error: e.message }
      } finally {
        this.loading = false
      }
    },

    // ─── FETCH PROFILE ───
    async fetchProfile() {
      if (!this.user) return
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single()
      if (data) this.profile = data
    },

    // ─── RESTORE SESSION ───
    async init() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        this.user = data.session.user
        await this.fetchProfile()
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
        if (this.user) this.fetchProfile()
        else this.profile = null
      })
    },
  },
})
