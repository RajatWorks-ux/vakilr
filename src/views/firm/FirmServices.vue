<template>
  <div class="page">
    <div class="page-bg"></div>
    <div class="page-header">
      <router-link to="/firm" class="back-btn">←</router-link>
      <h1 class="page-title">Firm Services</h1>
      <button class="add-service-btn" @click="showAddModal = true">+ Add</button>
    </div>

    <div class="content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="si-val">{{ activeServices.length }}</span>
          <span class="si-label">Active</span>
        </div>
        <div class="si-div"></div>
        <div class="stat-item">
          <span class="si-val">₹{{ fmt(avgPrice) }}</span>
          <span class="si-label">Avg Price</span>
        </div>
        <div class="si-div"></div>
        <div class="stat-item">
          <span class="si-val">{{ services.length }}</span>
          <span class="si-label">Total</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-col">
        <div class="skel" v-for="i in 3" :key="i"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="services.length === 0" class="empty-state">
        <span>⚖️</span>
        <h3>No Services Yet</h3>
        <p>Add firm-wide services that clients can book directly from your firm profile.</p>
        <button class="add-first-btn" @click="showAddModal = true">Add First Service</button>
      </div>

      <!-- Services List -->
      <div v-else class="services-list">
        <div class="service-card" v-for="s in services" :key="s.id">
          <div class="sc-top">
            <div class="sc-icon">{{ serviceIcons[s.service_type] || '⚖️' }}</div>
            <div class="sc-info">
              <div class="sc-name">{{ s.service_name }}</div>
              <div class="sc-type">{{ typeLabels[s.service_type] || s.service_type }}</div>
            </div>
            <div class="sc-toggle-wrap">
              <div :class="['sc-toggle', s.is_active ? 'on' : 'off']" @click="toggleService(s)">
                <div class="sc-toggle-dot"></div>
              </div>
            </div>
          </div>
          <div class="sc-bottom">
            <div class="sc-price">
              <span class="price-val">₹{{ fmt(s.price_amount) }}</span>
              <span class="price-unit">/ {{ s.price_unit }}</span>
            </div>
            <div class="sc-actions">
              <button class="edit-btn" @click="editService(s)">✏️</button>
              <button class="del-btn" @click="deleteService(s.id)">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingService" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="modal-title">{{ editingService ? 'Edit Service' : 'Add Service' }}</h2>

        <div class="field">
          <label>Service Type</label>
          <select v-model="form.service_type">
            <option value="">Select type</option>
            <option v-for="(label, key) in typeLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>

        <div class="field">
          <label>Service Name</label>
          <input v-model="form.service_name" placeholder="e.g. Corporate Legal Consultation" class="text-input" />
        </div>

        <div class="field-row">
          <div class="field">
            <label>Price (₹)</label>
            <input v-model.number="form.price_amount" type="number" placeholder="5000" class="text-input" />
          </div>
          <div class="field">
            <label>Per</label>
            <select v-model="form.price_unit">
              <option value="session">Session</option>
              <option value="hour">Hour</option>
              <option value="minute">Minute</option>
              <option value="document">Document</option>
              <option value="case">Case</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="save-btn" @click="saveService" :disabled="saving || !form.service_name || !form.price_amount">
            {{ saving ? 'Saving...' : editingService ? 'Update' : 'Add Service' }}
          </button>
        </div>
      </div>
    </div>

    <FirmBottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const auth = useAuthStore()
const services = ref([])
const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const editingService = ref(null)

const form = ref({ service_type:'', service_name:'', price_amount:0, price_unit:'session' })

const typeLabels = {
  chat: 'Chat Consultation',
  call: 'Voice Call',
  video: 'Video Consultation',
  document: 'Document Drafting',
  court: 'Court Representation',
  retainer: 'Retainer Agreement',
  audit: 'Legal Audit',
}

const serviceIcons = {
  chat:'💬', call:'📞', video:'📹', document:'📄',
  court:'⚖️', retainer:'📝', audit:'🔍',
}

const activeServices = computed(() => services.value.filter(s => s.is_active))
const avgPrice = computed(() => {
  if (!services.value.length) return 0
  return services.value.reduce((sum, s) => sum + (s.price_amount || 0), 0) / services.value.length
})

function fmt(n) { return Number(n||0).toLocaleString('en-IN', { maximumFractionDigits: 0 }) }

function editService(s) {
  editingService.value = s
  form.value = { service_type: s.service_type, service_name: s.service_name, price_amount: s.price_amount, price_unit: s.price_unit }
}

function closeModal() {
  showAddModal.value = false
  editingService.value = null
  form.value = { service_type:'', service_name:'', price_amount:0, price_unit:'session' }
}

async function saveService() {
  if (!form.value.service_name || !form.value.price_amount) return
  saving.value = true
  const uid = auth.user?.id

  if (editingService.value) {
    await supabase.from('lawyer_services').update({
      service_type: form.value.service_type,
      service_name: form.value.service_name,
      price_amount: form.value.price_amount,
      price_unit: form.value.price_unit,
    }).eq('id', editingService.value.id)
  } else {
    await supabase.from('lawyer_services').insert({
      lawyer_id: uid,
      service_type: form.value.service_type || 'consultation',
      service_name: form.value.service_name,
      price_amount: form.value.price_amount,
      price_unit: form.value.price_unit,
      is_active: true,
    })
  }

  await loadServices()
  closeModal()
  saving.value = false
}

async function toggleService(s) {
  await supabase.from('lawyer_services').update({ is_active: !s.is_active }).eq('id', s.id)
  s.is_active = !s.is_active
}

async function deleteService(id) {
  await supabase.from('lawyer_services').delete().eq('id', id)
  services.value = services.value.filter(s => s.id !== id)
}

async function loadServices() {
  const uid = auth.user?.id
  if (!uid) return
  const { data } = await supabase.from('lawyer_services').select('*').eq('lawyer_id', uid).order('created_at', { ascending: false })
  services.value = data || []
  loading.value = false
}

onMounted(loadServices)

const FirmBottomNav = defineComponent({
  setup() {
    return () => h('nav', { style:'position:fixed;bottom:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-around;background:rgba(4,7,26,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.08);padding:0.5rem 0;height:60px' },
      [[{to:'/firm',icon:'🏢',label:'Home'},{to:'/firm/dashboard',icon:'📊',label:'Dashboard'},{to:'/firm/add-lawyer',icon:'➕',label:'Add'},{to:'/firm/services',icon:'⚖️',label:'Services'}]
      .map(item => h('a', { href:item.to, key:item.to, style:'display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;min-width:52px' }, [
        h('span',{style:'font-size:1.2rem'},item.icon),
        h('span',{style:'font-size:0.6rem;font-family:DM Sans,sans-serif;font-weight:600;color:rgba(240,244,255,0.4);letter-spacing:0.03em'},item.label),
      ]))]
    )
  }
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;gap:0.75rem;padding:1.25rem 1.25rem 0.75rem}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.25rem;font-weight:700;padding:0.25rem}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:#f0f4ff;flex:1}
.add-service-btn{background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.35);color:#C9A84C;padding:0.4rem 0.875rem;border-radius:100px;font-size:0.8rem;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer}
.content{position:relative;z-index:1;padding:0 1.25rem;padding-bottom:80px}
.stats-row{display:flex;align-items:center;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1rem;margin-bottom:1.25rem}
.stat-item{flex:1;text-align:center}
.si-val{display:block;font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#C9A84C}
.si-label{font-size:0.62rem;color:rgba(240,244,255,0.38);text-transform:uppercase;letter-spacing:0.06em}
.si-div{width:1px;height:28px;background:rgba(255,255,255,0.08)}
.loading-col{display:flex;flex-direction:column;gap:0.6rem}
.skel{height:88px;border-radius:14px;background:rgba(255,255,255,0.04);animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}
.empty-state{text-align:center;padding:3rem 1rem}
.empty-state span{font-size:3rem;display:block;margin-bottom:0.75rem}
.empty-state h3{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#f0f4ff;margin-bottom:0.5rem}
.empty-state p{font-size:0.83rem;color:rgba(240,244,255,0.45);margin-bottom:1.5rem;line-height:1.6}
.add-first-btn{background:#C9A84C;color:#0A0F2C;border:none;border-radius:12px;padding:0.875rem 2rem;font-size:0.92rem;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer}
.services-list{display:flex;flex-direction:column;gap:0.75rem}
.service-card{background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1rem;transition:border-color 0.2s}
.service-card:hover{border-color:rgba(201,168,76,0.2)}
.sc-top{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.875rem}
.sc-icon{width:40px;height:40px;border-radius:10px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.sc-info{flex:1}
.sc-name{font-weight:700;font-size:0.92rem;color:#f0f4ff}
.sc-type{font-size:0.72rem;color:#C9A84C;margin-top:0.1rem}
.sc-toggle-wrap{flex-shrink:0}
.sc-toggle{width:42px;height:24px;border-radius:100px;position:relative;cursor:pointer;transition:background 0.2s}
.sc-toggle.on{background:#C9A84C}
.sc-toggle.off{background:rgba(255,255,255,0.12)}
.sc-toggle-dot{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.3)}
.sc-toggle.on .sc-toggle-dot{left:21px}
.sc-toggle.off .sc-toggle-dot{left:3px}
.sc-bottom{display:flex;align-items:center;justify-content:space-between}
.price-val{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#C9A84C}
.price-unit{font-size:0.75rem;color:rgba(240,244,255,0.4);margin-left:0.2rem}
.sc-actions{display:flex;gap:0.4rem}
.edit-btn,.del-btn{width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);cursor:pointer;font-size:0.85rem;display:flex;align-items:center;justify-content:center}
/* Modal */
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)}
.modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem 1.25rem 2rem;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
.modal-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#f0f4ff;margin-bottom:1.25rem}
.field{margin-bottom:1rem}
.field label{display:block;font-size:0.72rem;font-weight:700;color:rgba(240,244,255,0.5);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.5rem}
.field select,.text-input,.field input{width:100%;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:#f0f4ff;padding:0.75rem 0.875rem;font-size:0.88rem;font-family:'DM Sans',sans-serif;outline:none}
.field select:focus,.text-input:focus,.field input:focus{border-color:rgba(201,168,76,0.4)}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.modal-actions{display:flex;gap:0.75rem;margin-top:1.25rem}
.cancel-btn{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(240,244,255,0.6);border-radius:12px;padding:0.875rem;font-family:'DM Sans',sans-serif;font-size:0.9rem;cursor:pointer}
.save-btn{flex:2;background:#C9A84C;color:#0A0F2C;border:none;border-radius:12px;padding:0.875rem;font-weight:800;font-size:0.9rem;font-family:'DM Sans',sans-serif;cursor:pointer}
.save-btn:disabled{opacity:0.5}
</style>
