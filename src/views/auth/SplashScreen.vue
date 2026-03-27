<template>
  <div class="splash">
    <canvas ref="canvas" class="three-canvas"></canvas>
    <div class="splash-content" :class="{ visible: show }">
      <div class="logo-glow"></div>
      <h1 class="splash-title">
        <span v-for="(char, i) in 'Vakilr'" :key="i"
          class="title-char"
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

const router = useRouter()
const canvas = ref(null)
const show     = ref(false)
const progress = ref(0)
let animId = null

onMounted(async () => {
  setTimeout(() => { show.value = true }, 200)

  // Load Three.js dynamically
  try {
    const THREE = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' + '').catch(() => null)
    if (THREE && canvas.value) initThree(THREE)
  } catch (e) { /* fallback to CSS only */ }

  const interval = setInterval(() => {
    progress.value = Math.min(100, progress.value + 2)
    if (progress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        const visited = localStorage.getItem('vakilr_onboarded')
        router.push(visited ? '/login' : '/onboarding')
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
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
  camera.position.set(0, 0, 5)

  const gold = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.8, roughness: 0.2 })

  // Beam
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3, 8), gold)
  scene.add(beam)

  // Top pivot
  const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), gold)
  pivot.position.y = 1.5
  scene.add(pivot)

  // Crossbar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.4, 8), gold)
  bar.rotation.z = Math.PI / 2
  bar.position.y = 0.6
  scene.add(bar)

  // Pans
  function makePan(x) {
    const g = new THREE.Group()
    // Chain
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), gold)
    chain.position.y = -0.6
    g.add(chain)
    // Pan
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 32), gold)
    pan.position.y = -1.2
    g.add(pan)
    g.position.set(x, 0.6, 0)
    return g
  }
  const leftPan  = makePan(-1.7)
  const rightPan = makePan( 1.7)
  scene.add(leftPan, rightPan)

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const pLight = new THREE.PointLight(0xC9A84C, 2, 10)
  pLight.position.set(0, 3, 3)
  scene.add(pLight)

  // Particles
  const pts = new Float32Array(300 * 3)
  for (let i = 0; i < 300 * 3; i++) pts[i] = (Math.random() - 0.5) * 20
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
  const pMat = new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.04, transparent: true, opacity: 0.5 })
  scene.add(new THREE.Points(pGeo, pMat))

  let t = 0
  function animate() {
    animId = requestAnimationFrame(animate)
    t += 0.008
    beam.rotation.y = t * 0.3
    bar.rotation.y  = t * 0.3
    leftPan.rotation.y  = t * 0.3
    rightPan.rotation.y = t * 0.3
    leftPan.position.y  = 0.6 + Math.sin(t) * 0.15
    rightPan.position.y = 0.6 - Math.sin(t) * 0.15
    pivot.rotation.y    = t * 0.3
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
.three-canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.6; }
.splash-content {
  position: relative; z-index: 1; text-align: center;
  opacity: 0; transform: translateY(30px) scale(0.95);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.splash-content.visible { opacity: 1; transform: translateY(0) scale(1); }
.logo-glow {
  width: 200px; height: 200px; margin: 0 auto -100px;
  background: radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%);
  pointer-events: none;
}
.splash-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem; font-weight: 700; color: #C9A84C;
  margin: 0 0 0.5rem; display: flex; justify-content: center;
  text-shadow: 0 0 40px rgba(201,168,76,0.5);
}
.title-char {
  display: inline-block;
  animation: charRise 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes charRise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.splash-tagline {
  font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
  letter-spacing: 0.25em; color: rgba(240,244,255,0.4);
  margin: 0 0 2.5rem;
  animation: fadeIn 1s ease 0.6s both;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.splash-loader { display: flex; align-items: center; gap: 12px; width: 220px; }
.loader-track { flex: 1; height: 3px; background: rgba(255,255,255,0.1); border-radius: 3px; position: relative; overflow: visible; }
.loader-fill { height: 100%; background: linear-gradient(90deg, #C9A84C, #f5d98c); border-radius: 3px; transition: width 0.1s; }
.loader-glow { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: #C9A84C; border-radius: 50%; box-shadow: 0 0 12px #C9A84C; transition: left 0.1s; }
.loader-pct { font-family: 'DM Sans', sans-serif; font-size: 0.7rem; color: rgba(240,244,255,0.3); min-width: 32px; }
</style>