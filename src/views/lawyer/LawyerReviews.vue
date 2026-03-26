<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/lawyer" class="back-btn">←</router-link>
      <h1 class="page-title">My Reviews</h1>
    </div>

    <!-- Rating Summary -->
    <div class="rating-summary">
      <div class="rs-big">
        <span class="rs-num">{{ avgRating }}</span>
        <span class="rs-star">★</span>
      </div>
      <div class="rs-bars">
        <div class="rs-bar-row" v-for="n in [5,4,3,2,1]" :key="n">
          <span class="rs-label">{{ n }}★</span>
          <div class="rs-bar-track">
            <div class="rs-bar-fill" :style="{ width: getRatingPct(n) + '%' }"></div>
          </div>
          <span class="rs-count">{{ getRatingCount(n) }}</span>
        </div>
      </div>
      <div class="rs-total">{{ lawyerStore.reviews.length }} total reviews</div>
    </div>

    <!-- Reviews List -->
    <div class="reviews-list">
      <div v-if="lawyerStore.reviews.length === 0" class="empty-state">
        <span>⭐</span><p>No reviews yet. Complete sessions to get reviews!</p>
      </div>
      <div class="review-card" v-for="r in lawyerStore.reviews" :key="r.id">
        <div class="rc-top">
          <div class="rc-avatar">{{ getInitials(r.profiles?.full_name) }}</div>
          <div class="rc-meta">
            <div class="rc-name">{{ r.profiles?.full_name || 'Client' }}</div>
            <div class="rc-date">{{ formatDate(r.created_at) }}</div>
          </div>
          <div class="rc-rating">{{ '★'.repeat(r.rating) }}</div>
        </div>
        <p class="rc-comment" v-if="r.comment">{{ r.comment }}</p>
      </div>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLawyerStore } from '@/stores/lawyer'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'

const auth = useAuthStore()
const lawyerStore = useLawyerStore()

const avgRating = computed(() => {
  if (!lawyerStore.reviews.length) return '—'
  const avg = lawyerStore.reviews.reduce((s,r) => s + r.rating, 0) / lawyerStore.reviews.length
  return avg.toFixed(1)
})

function getRatingCount(n) { return lawyerStore.reviews.filter(r => r.rating === n).length }
function getRatingPct(n) {
  if (!lawyerStore.reviews.length) return 0
  return (getRatingCount(n) / lawyerStore.reviews.length) * 100
}
function getInitials(name) { return (name||'C').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
function formatDate(ts) { return new Date(ts).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) }

onMounted(async () => { await lawyerStore.fetchReviews(auth.user.id) })
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.rating-summary{position:relative;z-index:1;display:flex;align-items:center;gap:1.5rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.rs-big{display:flex;align-items:baseline;gap:0.2rem}
.rs-num{font-family:'Playfair Display',serif;font-size:3.5rem;font-weight:900;color:#C9A84C;line-height:1}
.rs-star{font-size:2rem;color:#C9A84C}
.rs-bars{flex:1}
.rs-bar-row{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem}
.rs-label{font-size:0.72rem;color:rgba(240,244,255,0.5);width:20px;flex-shrink:0}
.rs-bar-track{flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden}
.rs-bar-fill{height:100%;background:#C9A84C;border-radius:3px;transition:width 0.5s ease}
.rs-count{font-size:0.68rem;color:rgba(240,244,255,0.35);width:16px;text-align:right;flex-shrink:0}
.rs-total{font-size:0.72rem;color:rgba(240,244,255,0.35);text-align:center;position:absolute;bottom:0.5rem;left:50%;transform:translateX(-50%)}
.reviews-list{position:relative;z-index:1;padding:1rem 1.25rem}
.empty-state{text-align:center;padding:3rem 1rem;color:rgba(240,244,255,0.4)}
.empty-state span{font-size:2.5rem;display:block;margin-bottom:0.75rem}
.empty-state p{font-size:0.88rem;line-height:1.6}
.review-card{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1rem;margin-bottom:0.75rem}
.rc-top{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem}
.rc-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:#fff;flex-shrink:0}
.rc-meta{flex:1}
.rc-name{font-weight:700;font-size:0.88rem;color:#f0f4ff}
.rc-date{font-size:0.7rem;color:rgba(240,244,255,0.4);margin-top:0.1rem}
.rc-rating{color:#C9A84C;font-size:0.88rem;letter-spacing:0.05em}
.rc-comment{font-size:0.83rem;color:rgba(240,244,255,0.65);line-height:1.6;font-style:italic}
</style>