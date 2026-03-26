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