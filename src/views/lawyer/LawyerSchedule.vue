<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/lawyer" class="back-btn">←</router-link>
      <h1 class="page-title">Availability Schedule</h1>
      <button class="save-btn" @click="saveSchedule" :disabled="saving">
        {{ saving ? '...' : 'Save' }}
      </button>
    </div>

    <div class="schedule-content">
      <p class="schedule-hint">Set your working hours for each day. Clients will only be able to book during these times.</p>

      <div class="day-card" v-for="day in schedule" :key="day.day">
        <div class="day-header">
          <div class="day-info">
            <span class="day-name">{{ dayNames[day.day] }}</span>
          </div>
          <button
            :class="['day-toggle', { active: day.is_available }]"
            @click="day.is_available = !day.is_available"
          >
            <span class="toggle-dot" :class="{ on: day.is_available }"></span>
          </button>
        </div>
        <div v-if="day.is_available" class="day-times">
          <div class="time-field">
            <label>Start Time</label>
            <input type="time" v-model="day.start_time" />
          </div>
          <div class="time-sep">to</div>
          <div class="time-field">
            <label>End Time</label>
            <input type="time" v-model="day.end_time" />
          </div>
        </div>
        <div v-else class="day-off">
          <span>Off — Not available this day</span>
        </div>
      </div>

      <div v-if="saved" class="success-banner">✓ Schedule saved successfully!</div>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLawyerStore } from '@/stores/lawyer'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'

const auth = useAuthStore()
const lawyerStore = useLawyerStore()
const saving = ref(false)
const saved  = ref(false)

const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const schedule = ref(
  Array.from({ length: 7 }, (_, i) => ({
    day: i,
    day_of_week: i,
    is_available: i >= 1 && i <= 5,
    start_time: '09:00',
    end_time: '18:00',
  }))
)

async function saveSchedule() {
  saving.value = true
  const data = schedule.value.map(d => ({
    day_of_week: d.day,
    is_available: d.is_available,
    start_time: d.start_time,
    end_time: d.end_time,
  }))
  await lawyerStore.saveAvailability(auth.user.id, data)
  saving.value = false
  saved.value  = true
  setTimeout(() => { saved.value = false }, 3000)
}

onMounted(async () => {
  await lawyerStore.fetchAvailability(auth.user.id)
  if (lawyerStore.availability.length > 0) {
    lawyerStore.availability.forEach(a => {
      const d = schedule.value.find(s => s.day === a.day_of_week)
      if (d) { d.is_available = a.is_available; d.start_time = a.start_time || '09:00'; d.end_time = a.end_time || '18:00' }
    })
  }
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#f0f4ff}
.save-btn{background:#C9A84C;color:#0A0F2C;border:none;border-radius:10px;padding:0.5rem 1.2rem;font-weight:700;font-size:0.85rem;cursor:pointer}
.save-btn:disabled{opacity:0.5}
.schedule-content{position:relative;z-index:1;padding:1.25rem}
.schedule-hint{font-size:0.83rem;color:rgba(240,244,255,0.5);line-height:1.6;margin-bottom:1.25rem}
.day-card{background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:1rem;margin-bottom:0.75rem}
.day-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem}
.day-name{font-weight:700;font-size:0.95rem;color:#f0f4ff}
.day-toggle{width:44px;height:24px;border-radius:100px;border:1.5px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);cursor:pointer;position:relative;padding:0;transition:all 0.2s}
.day-toggle.active{border-color:#C9A84C;background:rgba(201,168,76,0.15)}
.toggle-dot{position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#64748b;transition:all 0.2s}
.toggle-dot.on{left:23px;background:#C9A84C}
.day-times{display:flex;align-items:center;gap:0.75rem}
.time-field{flex:1}
.time-field label{font-size:0.68rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:0.3rem}
.time-field input{width:100%;height:40px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:8px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.88rem;padding:0 0.75rem;outline:none}
.time-field input:focus{border-color:#C9A84C}
.time-sep{color:rgba(240,244,255,0.4);font-size:0.82rem;font-weight:500;flex-shrink:0}
.day-off{font-size:0.8rem;color:rgba(240,244,255,0.35);font-style:italic}
.success-banner{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#10b981;padding:0.875rem 1rem;border-radius:10px;font-size:0.85rem;margin-top:1rem;text-align:center}
</style>