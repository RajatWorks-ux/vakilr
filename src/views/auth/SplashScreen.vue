<template>
  <div class="splash">
    <video class="splash-bg-video" autoplay muted loop playsinline :src="videoSrc"></video>
    <div class="splash-video-overlay"></div>
    <canvas ref="canvas" class="three-canvas"></canvas>
    <div class="splash-content" :class="{ visible: show }">
      <div class="logo-glow"></div>
      <h1 class="splash-title">
        <span v-for="(char, i) in 'Vakilr'" :key="i" class="title-char"
          :style="{ animationDelay: (i * 0.08) + 's' }">{{ char }}</span>
      </h1>
      <p class="splash-tagline">JUSTICE FOR EVERYONE</p>
      <div class="splash-loader">
        <div class="loader-track">
          <div class="loader-fill" :style="{ width: progress + '%' }"></div>
          <div class="loader-glow" :style="{ left: progress + '%' }"></div>
        </div>
        <span class="loader-pct">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router   = useRouter()
const auth     = useAuthStore()
const canvas   = ref(null)
const show     = ref(false)
const progress = ref(0)
let animId     = null

const BASE     = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
const videoSrc = `${BASE}/videos/splash_scales.mp4`

onMounted(async () => {
  setTimeout(() => { show.value = true }, 200)

  // ✅ ESM build — fixes silent UMD failure from cdnjs
  try {
    const THREE = await import('https://esm.run/three@0.128.0')
    if (THREE && canvas.value) initThree(THREE)
  } catch (e) { /* CSS glow fallback */ }

  const interval = setInterval(() => {
    progress.value = Math.min(100, progress.value + 2)
    if (progress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        const isApp   = window?.Capacitor?.isNativePlatform?.()
        const visited = localStorage.getItem('vakilr_onboarded')
        if (!isApp && !auth.isLoggedIn) {
          router.push('/home')             // web + not logged in → landing page
        } else if (auth.isLoggedIn) {
          const map = { client: '/client', lawyer: '/lawyer', firm: '/firm' }
          router.push(map[auth.role] || '/login')
        } else if (visited) {
          router.push('/login')
        } else {
          router.push('/onboarding')
        }
      }, 400)
    }
  }, 50)
})

onUnmounted(() => { if (animId) cancelAnimationFrame(animId) })

function initThree(THREE) {
  const w = window.innerWidth, h = window.innerHeight
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene  = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
  // ✅ FIXED: camera pulled back so full model fits on screen
  camera.position.set(0, 0.3, 9)

  const gold = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.85, roughness: 0.15 })

  // ── Vertical beam (shorter so it fits) ──
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.2, 12), gold)
  scene.add(beam)

  // ── Decorative base ──
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 16), gold)
  base.position.y = -1.1
  scene.add(base)
  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.05, 24), gold)
  baseDisc.position.y = -1.2
  scene.add(baseDisc)

  // ── Top pivot sphere ──
  const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), gold)
  pivot.position.y = 1.1
  scene.add(pivot)

  // ── Crossbar (narrower to stay on screen) ──
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.6, 10), gold)
  bar.rotation.z = Math.PI / 2
  bar.position.y = 0.45
  scene.add(bar)

  // ── Pans with chains ──
  function makePan(x) {
    const g = new THREE.Group()
    // Chain links (3 segments)
    for (let i = 0; i < 3; i++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 8), gold)
      link.rotation.x = Math.PI / 2
      link.position.y = -0.22 * i - 0.1
      g.add(link)
    }
    // Pan disc
    const panGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.055, 36)
    const pan = new THREE.Mesh(panGeo, gold)
    pan.position.y = -0.82
    g.add(pan)
    // Rim
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.018, 8, 36), gold)
    rim.rotation.x = Math.PI / 2
    rim.position.y = -0.79
    g.add(rim)
    g.position.set(x, 0.45, 0)
    return g
  }

  const leftPan  = makePan(-1.3)
  const rightPan = makePan(1.3)
  scene.add(leftPan, rightPan)

  // ── Lighting ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const key = new THREE.PointLight(0xC9A84C, 3, 15)
  key.position.set(2, 4, 4)
  scene.add(key)
  const fill = new THREE.PointLight(0x4488ff, 0.8, 20)
  fill.position.set(-4, 2, 2)
  scene.add(fill)

  // ── Gold particles ──
  const pts = new Float32Array(400 * 3)
  for (let i = 0; i < 400 * 3; i++) pts[i] = (Math.random() - 0.5) * 18
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
  scene.add(new THREE.Points(pGeo,
    new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.035, transparent: true, opacity: 0.45 })
  ))

  let t = 0
  function animate() {
    animId = requestAnimationFrame(animate)
    t += 0.007
    // Slow gentle rotation of whole model
    scene.rotation.y = Math.sin(t * 0.3) * 0.25
    // Pans tilt — justice scale effect
    leftPan.position.y  = 0.45 + Math.sin(t) * 0.12
    rightPan.position.y = 0.45 - Math.sin(t) * 0.12
    leftPan.rotation.z  =  Math.sin(t) * 0.06
    rightPan.rotation.z = -Math.sin(t) * 0.06
    renderer.render(scene, camera)
  }
  animate()
}
</script>

<style scoped>
.splash {
  position: fixed; inset: 0; background: #04071a;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.splash-bg-video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; opacity: 0.18; z-index: 0;
}
.splash-video-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(4,7,26,0.3) 0%, rgba(4,7,26,0.88) 100%);
  z-index: 1;
}
.three-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0.7; z-index: 2;
}
.splash-content {
  position: relative; z-index: 3; text-align: center;
  opacity: 0; transform: translateY(30px) scale(0.95);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.splash-content.visible { opacity: 1; transform: none; }
.logo-glow {
  width: 180px; height: 180px; margin: 0 auto -90px;
  background: radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 70%);
}
.splash-title {
  font-family: 'Playfair Display', serif; font-size: 3.8rem; font-weight: 700;
  color: #C9A84C; margin: 0 0 0.4rem;
  display: flex; justify-content: center;
  text-shadow: 0 0 40px rgba(201,168,76,0.5);
}
.title-char { display: inline-block; animation: charRise 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes charRise { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
.splash-tagline {
  font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
  letter-spacing: 0.25em; color: rgba(240,244,255,0.35);
  margin: 0 0 2.2rem; animation: fadeIn 1s ease 0.6s both;
}
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.splash-loader { display: flex; align-items: center; gap: 12px; width: 210px; }
.loader-track { flex:1; height:3px; background:rgba(255,255,255,0.1); border-radius:3px; position:relative; overflow:visible; }
.loader-fill { height:100%; background:linear-gradient(90deg,#C9A84C,#f5d98c); border-radius:3px; transition:width 0.1s; }
.loader-glow { position:absolute; top:50%; transform:translate(-50%,-50%); width:11px; height:11px; background:#C9A84C; border-radius:50%; box-shadow:0 0 12px #C9A84C; transition:left 0.1s; }
.loader-pct { font-family:'DM Sans',sans-serif; font-size:0.68rem; color:rgba(240,244,255,0.3); min-width:32px; }
</style>