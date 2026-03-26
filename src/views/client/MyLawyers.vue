<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/client" class="back-btn">←</router-link>
      <h1 class="page-title">Saved Lawyers</h1>
    </div>

    <div class="lawyers-content">
      <div v-if="clientStore.savedLawyers.length === 0" class="empty-state">
        <span>❤️</span>
        <h3>No Saved Lawyers</h3>
        <p>Save lawyers you like by tapping the heart icon on their profile.</p>
        <router-link to="/client/browse" class="browse-btn">Browse Lawyers →</router-link>
      </div>
      <div v-else class="lawyers-list">
        <router-link
          v-for="l in clientStore.savedLawyers" :key="l.id"
          :to="'/client/lawyer/' + l.id"
          class="lawyer-row"
        >
          <div class="lr-av" :style="{ background: getColor(l.profiles?.full_name) }">
            {{ getInitials(l.profiles?.full_name) }}
            <div class="lr-status" :class="l.availability_status"></div>
          </div>
          <div class="lr-info">
            <div class="lr-name">{{ l.profiles?.full_name }}</div>
            <div class="lr-spec">{{ l.specializations?.slice(0,2).join(' · ') }}</div>
            <div class="lr-meta">📍 {{ l.city }} · {{ l.experience_years }}yr · ⭐{{ l.rating }}</div>
          </div>
          <div class="lr-right">
            <button class="lr-remove" @click.prevent="removeSaved(l.id)">🗑️</button>
            <span class="lr-arrow">→</span>
          </div>
        </router-link>
      </div>
    </div>

    <div style="height:80px"></div>
    <ClientBottomNav />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useClientStore } from '@/stores/client'
import ClientBottomNav from '@/components/ClientBottomNav.vue'

const auth = useAuthStore()
const clientStore = useClientStore()

const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#8b5cf6']
function getColor(n){let h=0;for(const c of(n||''))h=(h*31+c.charCodeAt(0))%colors.length;return `linear-gradient(135deg,${colors[h]},${colors[(h+1)%colors.length]})`}
function getInitials(n){return(n||'L').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}

function removeSaved(lawyerId) {
  clientStore.toggleSaveLawyer(auth.user.id, lawyerId)
}

onMounted(async () => {
  await clientStore.fetchSavedLawyers(auth.user.id)
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.lawyers-content{position:relative;z-index:1;padding:1.25rem}
.empty-state{text-align:center;padding:3rem 1rem}
.empty-state span{font-size:3rem;display:block;margin-bottom:0.75rem}
.empty-state h3{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.empty-state p{font-size:0.85rem;color:rgba(240,244,255,0.5);margin-bottom:1.5rem;line-height:1.6}
.browse-btn{display:inline-block;background:#C9A84C;color:#0A0F2C;padding:0.75rem 1.5rem;border-radius:12px;text-decoration:none;font-weight:700;font-size:0.9rem}
.lawyers-list{display:flex;flex-direction:column;gap:0.75rem}
.lawyer-row{display:flex;align-items:center;gap:0.875rem;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:0.875rem;text-decoration:none;transition:all 0.2s}
.lawyer-row:hover{border-color:rgba(201,168,76,0.25)}
.lr-av{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:#fff;position:relative;flex-shrink:0}
.lr-status{position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;border:2px solid #0d1538}
.lr-status.online{background:#10b981}.lr-status.busy{background:#f59e0b}.lr-status.offline{background:#64748b}
.lr-info{flex:1}
.lr-name{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.lr-spec{font-size:0.73rem;color:#C9A84C;margin-top:0.1rem}
.lr-meta{font-size:0.68rem;color:rgba(240,244,255,0.38);margin-top:0.1rem}
.lr-right{display:flex;align-items:center;gap:0.5rem}
.lr-remove{background:none;border:none;cursor:pointer;font-size:0.9rem;padding:0.3rem;opacity:0.5;transition:opacity 0.2s}
.lr-remove:hover{opacity:1}
.lr-arrow{color:rgba(240,244,255,0.3);font-size:0.9rem}
</style>