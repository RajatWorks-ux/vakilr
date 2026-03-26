<template>
  <div class="page">
    <div class="page-bg"></div>

    <div class="page-header">
      <router-link to="/lawyer" class="back-btn">←</router-link>
      <h1 class="page-title">My Services</h1>
      <button class="add-btn" @click="showAddModal = true">+ Add</button>
    </div>

    <!-- Services List -->
    <div class="services-list" v-if="!lawyerStore.loading">
      <div
        v-for="svc in lawyerStore.services" :key="svc.id"
        class="service-card"
        :class="{ inactive: !svc.is_active }"
      >
        <div class="sc-left">
          <span class="sc-icon">{{ typeIcons[svc.service_type] || '⚖️' }}</span>
          <div>
            <div class="sc-name">{{ svc.service_name }}</div>
            <div class="sc-type">{{ typeLabels[svc.service_type] || svc.service_type }}</div>
          </div>
        </div>
        <div class="sc-right">
          <div class="sc-price">
            ₹{{ svc.price_amount }}
            <span class="sc-unit">{{ unitLabels[svc.price_unit] }}</span>
          </div>
          <div class="sc-actions">
            <button class="sc-toggle" @click="toggleService(svc)">
              <span :class="['toggle-dot', { on: svc.is_active }]"></span>
            </button>
            <button class="sc-edit" @click="openEdit(svc)">✏️</button>
            <button class="sc-delete" @click="deleteService(svc.id)">🗑️</button>
          </div>
        </div>
      </div>

      <div v-if="lawyerStore.services.length === 0" class="empty-state">
        <span>⚖️</span>
        <p>No services yet. Add your first service!</p>
      </div>
    </div>

    <!-- Long Case Info Card -->
    <div class="long-case-card">
      <div class="lcc-header">
        <span class="lcc-icon">🏛️</span>
        <div>
          <div class="lcc-title">Court Representation</div>
          <div class="lcc-sub">One-time placement fee from Vakilr</div>
        </div>
      </div>
      <div class="lcc-body">
        <p>For court cases, you set your <strong>average fee per hearing</strong> so clients know what to expect. Clients see this before hiring you.</p>
        <div class="lcc-field">
          <label>Your Average Fee Per Hearing</label>
          <div class="lcc-input-row">
            <input
              v-model.number="avgHearingFee"
              type="number" placeholder="e.g. 5000"
              class="lcc-input"
            />
            <button class="lcc-save-btn" @click="saveAvgFee">Save</button>
          </div>
          <p class="lcc-note">⚠️ Price can bargain per hearing. It can also increase or decrease based on case complexity. Normal case average is ₹{{ avgHearingFee || '—' }}.</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingService" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="modal-title">{{ editingService ? 'Edit Service' : 'Add New Service' }}</h2>

        <div class="field">
          <label>Service Name</label>
          <input v-model="form.service_name" placeholder="e.g. Property Document Review" />
        </div>
        <div class="field">
          <label>Service Type</label>
          <select v-model="form.service_type">
            <option value="chat">Chat Consultation</option>
            <option value="voice">Voice Call</option>
            <option value="video">Video Call</option>
            <option value="document_review">Document Review</option>
            <option value="will_draft">Will Drafting</option>
            <option value="nda">NDA Creation</option>
            <option value="custom">Custom Service</option>
          </select>
        </div>
        <div class="field">
          <label>Price</label>
          <div class="price-row">
            <span class="price-prefix">₹</span>
            <input v-model.number="form.price_amount" type="number" placeholder="Amount" />
          </div>
        </div>
        <div class="field">
          <label>Pricing Unit</label>
          <select v-model="form.price_unit">
            <option value="per_minute">Per Minute</option>
            <option value="flat">Flat Rate</option>
            <option value="per_document">Per Document</option>
          </select>
        </div>

        <div v-if="formError" class="form-error">{{ formError }}</div>

        <div class="modal-actions">
          <button class="modal-cancel" @click="closeModal">Cancel</button>
          <button class="modal-save" @click="saveService" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Service' }}
          </button>
        </div>
      </div>
    </div>

    <div style="height:80px"></div>
    <LawyerBottomNav />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLawyerStore } from '@/stores/lawyer'
import LawyerBottomNav from '@/components/LawyerBottomNav.vue'

const auth = useAuthStore()
const lawyerStore = useLawyerStore()

const showAddModal  = ref(false)
const editingService = ref(null)
const saving        = ref(false)
const formError     = ref('')
const avgHearingFee = ref(lawyerStore.profile?.avg_hearing_fee || '')

const form = reactive({
  service_name: '', service_type: 'chat',
  price_amount: '', price_unit: 'per_minute',
})

const typeIcons  = { chat:'💬', voice:'📞', video:'🎥', document_review:'📄', will_draft:'📜', nda:'🤝', custom:'⚙️' }
const typeLabels = { chat:'Chat Consultation', voice:'Voice Call', video:'Video Call', document_review:'Document Review', will_draft:'Will Drafting', nda:'NDA Creation', custom:'Custom' }
const unitLabels = { per_minute:'/min', flat:' flat', per_document:'/doc' }

function openEdit(svc) {
  editingService.value = svc
  form.service_name  = svc.service_name
  form.service_type  = svc.service_type
  form.price_amount  = svc.price_amount
  form.price_unit    = svc.price_unit
}

function closeModal() {
  showAddModal.value  = false
  editingService.value = null
  form.service_name   = ''
  form.service_type   = 'chat'
  form.price_amount   = ''
  form.price_unit     = 'per_minute'
  formError.value     = ''
}

async function saveService() {
  if (!form.service_name || !form.price_amount) {
    formError.value = 'Please fill all fields'
    return
  }
  saving.value = true
  const uid = auth.user.id
  if (editingService.value) {
    await lawyerStore.updateService(editingService.value.id, { ...form })
    await lawyerStore.fetchServices(uid)
  } else {
    await lawyerStore.addService(uid, { ...form, is_active: true })
  }
  saving.value = false
  closeModal()
}

async function toggleService(svc) {
  await lawyerStore.updateService(svc.id, { is_active: !svc.is_active })
  await lawyerStore.fetchServices(auth.user.id)
}

async function deleteService(id) {
  if (!confirm('Delete this service?')) return
  await lawyerStore.deleteService(id, auth.user.id)
}

async function saveAvgFee() {
  const { supabase } = await import('@/lib/supabase')
  await supabase.from('lawyer_profiles')
    .update({ avg_hearing_fee: avgHearingFee.value })
    .eq('id', auth.user.id)
  alert('Average fee saved!')
}

onMounted(async () => {
  if (auth.user?.id) await lawyerStore.fetchServices(auth.user.id)
  avgHearingFee.value = lawyerStore.profile?.avg_hearing_fee || ''
})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.page{min-height:100vh;background:#0A0F2C;font-family:'DM Sans',sans-serif;position:relative;overflow-x:hidden}
.page-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,168,76,0.07),transparent 60%);pointer-events:none}
.page-header{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:1.25rem;border-bottom:1px solid rgba(255,255,255,0.06)}
.back-btn{color:#C9A84C;text-decoration:none;font-size:1.2rem;font-weight:700;padding:0.4rem 0.75rem;border-radius:10px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.08)}
.page-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff}
.add-btn{background:#C9A84C;color:#0A0F2C;border:none;border-radius:10px;padding:0.5rem 1rem;font-weight:700;font-size:0.85rem;cursor:pointer}
.services-list{position:relative;z-index:1;padding:1rem 1.25rem}
.service-card{display:flex;align-items:center;justify-content:space-between;background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:1rem;margin-bottom:0.75rem;transition:all 0.2s}
.service-card.inactive{opacity:0.5}
.sc-left{display:flex;align-items:center;gap:0.75rem}
.sc-icon{font-size:1.5rem}
.sc-name{font-weight:700;font-size:0.9rem;color:#f0f4ff}
.sc-type{font-size:0.72rem;color:#C9A84C;margin-top:0.1rem}
.sc-right{display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem}
.sc-price{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#C9A84C}
.sc-unit{font-family:'DM Sans',sans-serif;font-size:0.7rem;color:rgba(240,244,255,0.4);font-weight:400}
.sc-actions{display:flex;align-items:center;gap:0.5rem}
.sc-toggle{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:100px;width:36px;height:20px;cursor:pointer;position:relative;padding:0}
.toggle-dot{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#64748b;transition:all 0.2s}
.toggle-dot.on{left:18px;background:#10b981}
.sc-edit,.sc-delete{background:none;border:none;cursor:pointer;font-size:0.85rem;padding:0.2rem}
.empty-state{text-align:center;padding:3rem 1rem;color:rgba(240,244,255,0.4)}
.empty-state span{font-size:2.5rem;display:block;margin-bottom:0.75rem}
.empty-state p{font-size:0.88rem}
.long-case-card{position:relative;z-index:1;margin:0 1.25rem 1rem;background:rgba(22,29,63,0.9);border:1px solid rgba(201,168,76,0.2);border-radius:16px;padding:1.25rem}
.lcc-header{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem}
.lcc-icon{font-size:1.8rem}
.lcc-title{font-weight:700;font-size:0.95rem;color:#f0f4ff}
.lcc-sub{font-size:0.75rem;color:#C9A84C;margin-top:0.15rem}
.lcc-body p{font-size:0.83rem;color:rgba(240,244,255,0.65);line-height:1.6;margin-bottom:1rem}
.lcc-body strong{color:#f0f4ff}
.lcc-field label{font-size:0.75rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:0.4rem}
.lcc-input-row{display:flex;gap:0.5rem;margin-bottom:0.5rem}
.lcc-input{flex:1;height:42px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.9rem;padding:0 0.875rem;outline:none}
.lcc-input:focus{border-color:#C9A84C}
.lcc-save-btn{background:#C9A84C;color:#0A0F2C;border:none;border-radius:10px;padding:0 1rem;font-weight:700;font-size:0.85rem;cursor:pointer}
.lcc-note{font-size:0.72rem;color:rgba(240,244,255,0.45);line-height:1.5}
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center}
.modal{background:#0d1538;border:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;padding:1.5rem;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
.modal-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#f0f4ff;margin-bottom:1.25rem}
.field{display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1rem}
.field label{font-size:0.75rem;font-weight:700;color:#8892b0;text-transform:uppercase;letter-spacing:0.08em}
.field input,.field select{height:44px;background:rgba(10,15,44,0.8);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:#f0f4ff;font-family:'DM Sans',sans-serif;font-size:0.9rem;padding:0 0.875rem;outline:none}
.field input:focus,.field select:focus{border-color:#C9A84C}
.price-row{display:flex;align-items:center;position:relative}
.price-prefix{position:absolute;left:0.875rem;color:#8892b0;font-size:0.9rem}
.price-row input{padding-left:1.8rem;width:100%}
.form-error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#ef4444;padding:0.6rem 0.875rem;border-radius:8px;font-size:0.8rem;margin-bottom:0.75rem}
.modal-actions{display:flex;gap:0.75rem;margin-top:1rem}
.modal-cancel{flex:1;padding:0.875rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.6);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer}
.modal-save{flex:2;padding:0.875rem;border-radius:12px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer}
.modal-save:disabled{opacity:0.4;cursor:not-allowed}
</style>