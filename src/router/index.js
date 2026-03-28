import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const ADMIN_EMAIL = 'rajatworks1@gmail.com'

const routes = [
  { path: '/',       name: 'Splash',   component: () => import('@/views/auth/SplashScreen.vue') },
  { path: '/home',   name: 'Landing',  component: () => import('@/views/LandingPage.vue') },
  { path: '/design', name: 'Design',   component: () => import('@/views/DesignSystem.vue') },
  { path: '/privacy',name: 'Privacy',  component: () => import('@/views/legal/PrivacyPolicy.vue') },
  { path: '/terms',  name: 'Terms',    component: () => import('@/views/legal/TermsOfService.vue') },

  { path: '/services',     redirect: '/home' },
  { path: '/lawyers',      redirect: '/home' },
  { path: '/firms',        redirect: '/home' },
  { path: '/pricing',      redirect: '/home' },
  { path: '/how-it-works', redirect: '/home' },

  // ─── AUTH ───
  { path: '/onboarding',           name: 'Onboarding',          component: () => import('@/views/auth/OnboardingScreen.vue') },
  { path: '/role',                 name: 'RoleSelect',           component: () => import('@/views/auth/RoleSelectScreen.vue') },
  { path: '/signup/client',        name: 'SignupClient',         component: () => import('@/views/auth/SignupClient.vue') },
  { path: '/signup/lawyer',        name: 'SignupLawyer',         component: () => import('@/views/auth/SignupLawyer.vue') },
  { path: '/signup/firm',          name: 'SignupFirm',           component: () => import('@/views/auth/SignupFirm.vue') },
  { path: '/login',                name: 'Login',                component: () => import('@/views/auth/LoginScreen.vue') },
  { path: '/forgot-password',      name: 'ForgotPassword',       component: () => import('@/views/auth/ForgotPassword.vue') },
  { path: '/verify-email',         name: 'VerifyEmail',          component: () => import('@/views/auth/VerifyEmail.vue') },
  { path: '/verification-pending', name: 'VerificationPending',  component: () => import('@/views/auth/VerificationPending.vue') },

  // ─── CLIENT ───
  { path: '/client',              name: 'ClientHome',        component: () => import('@/views/client/ClientHome.vue'),        meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/profile',      name: 'ClientProfile',     component: () => import('@/views/client/ClientProfile.vue'),     meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/browse',       name: 'ClientBrowse',      component: () => import('@/views/client/ClientBrowse.vue'),      meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/lawyer/:id',   name: 'LawyerProfileView', component: () => import('@/views/client/LawyerProfileView.vue'), meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/ai-guide',     name: 'AIGuide',           component: () => import('@/views/client/AIGuide.vue'),           meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/service-select',name:'ServiceSelect',     component: () => import('@/views/client/ServiceSelect.vue'),    meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/payment',      name: 'PaymentScreen',     component: () => import('@/views/client/PaymentScreen.vue'),     meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/chat/:id',     name: 'ChatSession',       component: () => import('@/views/client/ChatSession.vue'),       meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/call/:id',     name: 'CallSession',       component: () => import('@/views/client/CallSession.vue'),       meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/video/:id',    name: 'VideoSession',      component: () => import('@/views/client/VideoSession.vue'),      meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/document/:id', name: 'DocumentSession',   component: () => import('@/views/client/DocumentSession.vue'),   meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/sessions',     name: 'MySessions',        component: () => import('@/views/client/MySessions.vue'),        meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/saved',        name: 'MyLawyers',         component: () => import('@/views/client/MyLawyers.vue'),         meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/dispute/:id',  name: 'DisputeFile',       component: () => import('@/views/client/DisputeFile.vue'),       meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/disputes',     name: 'DisputeTracker',    component: () => import('@/views/dispute/DisputeTracker.vue'),   meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/wallet',       name: 'ClientWallet',      component: () => import('@/views/client/ClientWallet.vue'),      meta: { requiresAuth: true, role: 'client' } },

  // ─── LAWYER ───
  { path: '/lawyer',             name: 'LawyerHome',     component: () => import('@/views/lawyer/LawyerHome.vue'),     meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },
  { path: '/lawyer/services',    name: 'LawyerServices', component: () => import('@/views/lawyer/LawyerServices.vue'), meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },
  { path: '/lawyer/profile',     name: 'LawyerProfile',  component: () => import('@/views/lawyer/LawyerProfile.vue'),  meta: { requiresAuth: true, role: 'lawyer' } },
  { path: '/lawyer/schedule',    name: 'LawyerSchedule', component: () => import('@/views/lawyer/LawyerSchedule.vue'), meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },
  { path: '/lawyer/requests',    name: 'LawyerRequests', component: () => import('@/views/lawyer/LawyerRequests.vue'), meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },
  { path: '/lawyer/session/:id', name: 'LawyerSession',  component: () => import('@/views/lawyer/LawyerSession.vue'),  meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },
  { path: '/lawyer/wallet',      name: 'LawyerWallet',   component: () => import('@/views/lawyer/LawyerWallet.vue'),   meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },
  { path: '/lawyer/reviews',     name: 'LawyerReviews',  component: () => import('@/views/lawyer/LawyerReviews.vue'),  meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },
  { path: '/lawyer/cases',       name: 'LawyerCases',    component: () => import('@/views/lawyer/LawyerCases.vue'),    meta: { requiresAuth: true, role: 'lawyer', requiresVerified: true } },

  // ─── FIRM ───
  { path: '/firm',            name: 'FirmHome',      component: () => import('@/views/firm/FirmHome.vue'),      meta: { requiresAuth: true, role: 'firm' } },
  { path: '/firm/dashboard',  name: 'FirmDashboard', component: () => import('@/views/firm/FirmDashboard.vue'), meta: { requiresAuth: true, role: 'firm' } },
  { path: '/firm/add-lawyer', name: 'FirmAddLawyer', component: () => import('@/views/firm/FirmAddLawyer.vue'), meta: { requiresAuth: true, role: 'firm' } },
  { path: '/firm/services',   name: 'FirmServices',  component: () => import('@/views/firm/FirmServices.vue'),  meta: { requiresAuth: true, role: 'firm' } },
  { path: '/firm/profile',    name: 'FirmProfile',   component: () => import('@/views/firm/FirmProfile.vue'),   meta: { requiresAuth: true, role: 'firm' } },

  // ─── ADMIN ───
  { path: '/admin',          name: 'AdminDashboard', component: () => import('@/views/admin/AdminDashboard.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/disputes', name: 'ModeratorPanel', component: () => import('@/views/dispute/ModeratorPanel.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/verify',   name: 'AdminVerify',    component: () => import('@/views/admin/AdminVerify.vue'),    meta: { requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  // Admin only
  if (to.meta.requiresAdmin) {
    if (!auth.user || auth.user.email !== ADMIN_EMAIL) return next('/login')
    return next()
  }

  // Must be logged in
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login')

  // ✅ Verification guard — lawyers pending approval always go to waiting screen
  if (to.meta.requiresVerified && auth.role === 'lawyer') {
    const status = auth.profile?.verification_status
    if (status !== 'approved') return next('/verification-pending')
  }

  // Role guard
  if (to.meta.role && auth.role !== to.meta.role) {
    if (auth.isLoggedIn) {
      const dashMap = { client: '/client', lawyer: '/lawyer', firm: '/firm' }
      return next(dashMap[auth.role] || '/login')
    }
    return next('/login')
  }

  next()
})

export default router