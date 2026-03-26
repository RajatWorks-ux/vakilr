import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Restore auth session before mounting
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore(pinia)
authStore.init().then(() => {
  app.mount('#app')
})