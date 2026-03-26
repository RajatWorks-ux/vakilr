import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Splash', component: () => import('@/views/auth/SplashScreen.vue') },
  { path: '/home', name: 'Landing', component: () => import('@/views/LandingPage.vue') }, // ✅ added here
  { path: '/onboarding', name: 'Onboarding', component: () => import('@/views/auth/OnboardingScreen.vue') },
  { path: '/role', name: 'RoleSelect', component: () => import('@/views/auth/RoleSelectScreen.vue') },
  { path: '/signup/client', name: 'SignupClient', component: () => import('@/views/auth/SignupClient.vue') },
  { path: '/signup/lawyer', name: 'SignupLawyer', component: () => import('@/views/auth/SignupLawyer.vue') },
  { path: '/signup/firm', name: 'SignupFirm', component: () => import('@/views/auth/SignupFirm.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/auth/LoginScreen.vue') },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('@/views/auth/ForgotPassword.vue') },
  { path: '/verify-email', name: 'VerifyEmail', component: () => import('@/views/auth/VerifyEmail.vue') },
  { path: '/verification-pending', name: 'VerificationPending', component: () => import('@/views/auth/VerificationPending.vue') },
  { path: '/client', name: 'ClientHome', component: () => import('@/views/client/ClientHome.vue'), meta: { requiresAuth: true, role: 'client' } },
  { path: '/lawyer', name: 'LawyerHome', component: () => import('@/views/lawyer/LawyerHome.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
  { path: '/firm', name: 'FirmHome', component: () => import('@/views/firm/FirmHome.vue'), meta: { requiresAuth: true, role: 'firm' } },
  { path: '/design', name: 'Design', component: () => import('@/views/DesignSystem.vue') },
  { path: '/services', redirect: '/home' },
{ path: '/lawyers', redirect: '/home' },
{ path: '/firms', redirect: '/home' },
{ path: '/pricing', redirect: '/home' },
{ path: '/how-it-works', redirect: '/home'},
{ path: '/lawyer', component: () => import('@/views/lawyer/LawyerHome.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/services', component: () => import('@/views/lawyer/LawyerServices.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/profile', component: () => import('@/views/lawyer/LawyerProfile.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/schedule', component: () => import('@/views/lawyer/LawyerSchedule.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/requests', component: () => import('@/views/lawyer/LawyerRequests.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/session/:id', component: () => import('@/views/lawyer/LawyerSession.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/wallet', component: () => import('@/views/lawyer/LawyerWallet.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/reviews', component: () => import('@/views/lawyer/LawyerReviews.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/lawyer/cases', component: () => import('@/views/lawyer/LawyerCases.vue'), meta: { requiresAuth: true, role: 'lawyer' } },
{ path: '/client', component: () => import('@/views/client/ClientHome.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/browse', component: () => import('@/views/client/ClientBrowse.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/lawyer/:id', component: () => import('@/views/client/LawyerProfileView.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/ai-guide', component: () => import('@/views/client/AIGuide.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/service-select', component: () => import('@/views/client/ServiceSelect.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/payment', component: () => import('@/views/client/PaymentScreen.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/chat/:id', component: () => import('@/views/client/ChatSession.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/call/:id', component: () => import('@/views/client/CallSession.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/video/:id', component: () => import('@/views/client/VideoSession.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/document/:id', component: () => import('@/views/client/DocumentSession.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/sessions', component: () => import('@/views/client/MySessions.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/saved', component: () => import('@/views/client/MyLawyers.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/client/dispute/:id', component: () => import('@/views/client/DisputeFile.vue'), meta: { requiresAuth: true, role: 'client' } },
{ path: '/firm', component: () => import('@/views/firm/FirmHome.vue'), meta: { requiresAuth: true, role: 'firm' } },
{ path: '/firm/dashboard', component: () => import('@/views/firm/FirmDashboard.vue'), meta: { requiresAuth: true, role: 'firm' } },
{ path: '/firm/add-lawyer', component: () => import('@/views/firm/FirmAddLawyer.vue'), meta: { requiresAuth: true, role: 'firm' } },
{ path: '/firm/services', component: () => import('@/views/firm/FirmServices.vue'), meta: { requiresAuth: true, role: 'firm' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login')
  if (to.meta.role && auth.role !== to.meta.role) return next('/login')
  next()
})

export default router