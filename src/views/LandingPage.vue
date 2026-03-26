<template>
  <div class="landing" ref="landingRef">

    <!-- NAVBAR -->
    <nav class="navbar" :class="{ scrolled: navScrolled }">
      <div class="nav-container">
        <div class="nav-logo">
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
            <rect x="48" y="22" width="4" height="56" rx="2" fill="#C9A84C"/>
            <rect x="20" y="28" width="60" height="4" rx="2" fill="#C9A84C"/>
            <rect x="32" y="74" width="36" height="4" rx="2" fill="#C9A84C"/>
            <line x1="26" y1="32" x2="20" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
            <line x1="26" y1="32" x2="32" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
            <path d="M18 50 Q26 58 34 50" stroke="#C9A84C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <line x1="74" y1="32" x2="68" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
            <line x1="74" y1="32" x2="80" y2="50" stroke="#C9A84C" stroke-width="2" opacity="0.7"/>
            <path d="M66 50 Q74 58 82 50" stroke="#C9A84C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <circle cx="50" cy="28" r="4" fill="#C9A84C"/>
          </svg>
          <span class="nav-brand">Vakilr</span>
        </div>
        <div class="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#services">Services</a>
          <a href="#lawyers">Lawyers</a>
          <a href="#firms">For Firms</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div class="nav-actions">
          <router-link to="/login" class="nav-login">Log In</router-link>
          <router-link to="/role" class="nav-cta">Get Started →</router-link>
        </div>
        <button class="nav-hamburger" @click="mobileMenu = !mobileMenu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu" :class="{ open: mobileMenu }">
        <a href="#how-it-works" @click="mobileMenu=false">How It Works</a>
        <a href="#services" @click="mobileMenu=false">Services</a>
        <a href="#lawyers" @click="mobileMenu=false">Lawyers</a>
        <a href="#firms" @click="mobileMenu=false">For Firms</a>
        <a href="#pricing" @click="mobileMenu=false">Pricing</a>
        <router-link to="/login" @click="mobileMenu=false">Log In</router-link>
        <router-link to="/role" class="mobile-cta" @click="mobileMenu=false">Get Started</router-link>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero" ref="heroRef">
      <div class="hero-video-wrap">
        <video ref="heroVideo" class="hero-video" autoplay loop muted playsinline src="/videos/hero.mp4"></video>
        <div class="hero-video-overlay"></div>
      </div>
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <div class="floating-scales">
        <svg width="260" height="260" viewBox="0 0 100 100" fill="none" class="scales-svg">
          <circle cx="50" cy="50" r="46" stroke="#C9A84C" stroke-width="0.5" stroke-opacity="0.2" stroke-dasharray="3 3"/>
          <rect x="48" y="20" width="4" height="60" rx="2" fill="#C9A84C" opacity="0.9"/>
          <rect x="18" y="26" width="64" height="4" rx="2" fill="#C9A84C" opacity="0.9"/>
          <rect x="30" y="76" width="40" height="4" rx="2" fill="#C9A84C" opacity="0.7"/>
          <line x1="24" y1="30" x2="16" y2="52" stroke="#C9A84C" stroke-width="1.5" opacity="0.7"/>
          <line x1="24" y1="30" x2="32" y2="52" stroke="#C9A84C" stroke-width="1.5" opacity="0.7"/>
          <path d="M14 52 Q24 62 34 52" stroke="#C9A84C" stroke-width="2" fill="none" stroke-linecap="round"/>
          <line x1="76" y1="30" x2="68" y2="52" stroke="#C9A84C" stroke-width="1.5" opacity="0.7"/>
          <line x1="76" y1="30" x2="84" y2="52" stroke="#C9A84C" stroke-width="1.5" opacity="0.7"/>
          <path d="M66 52 Q76 62 86 52" stroke="#C9A84C" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="50" cy="26" r="5" fill="#C9A84C" opacity="0.9"/>
        </svg>
        <div class="scales-glow"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          India's First Complete Legal Marketplace
        </div>
        <h1 class="hero-title">
          <span class="title-line">India's Legal</span>
          <span class="title-line gold-italic">Marketplace.</span>
          <span class="title-line">Find a Lawyer in</span>
          <span class="title-line gold-italic">60 Seconds.</span>
        </h1>
        <p class="hero-sub">Connect with 12,000+ verified lawyers across India.<br/>Transparent pricing, escrow payments, AI-guided matching.</p>
        <div class="hero-actions">
          <router-link to="/role" class="btn-primary-hero">Find a Lawyer →</router-link>
          <router-link to="/role" class="btn-secondary-hero">Join as Lawyer / Firm</router-link>
        </div>
        <div class="hero-trust">
          <div class="trust-item"><span class="trust-val">12,000+</span><span class="trust-label">Verified Lawyers</span></div>
          <div class="trust-sep"></div>
          <div class="trust-item"><span class="trust-val">4.8★</span><span class="trust-label">Avg Rating</span></div>
          <div class="trust-sep"></div>
          <div class="trust-item"><span class="trust-val">₹0</span><span class="trust-label">Hidden Fees</span></div>
          <div class="trust-sep"></div>
          <div class="trust-item"><span class="trust-val">24/7</span><span class="trust-label">Available</span></div>
        </div>
      </div>
      <div class="scroll-indicator"><div class="scroll-line"></div><span>Scroll</span></div>
    </section>

    <!-- STATS BAR -->
    <section class="stats-bar" ref="statsRef">
      <div class="stats-container">
        <div class="stat-item" v-for="s in stats" :key="s.label">
          <div class="stat-number">{{ s.display }}</div>
          <div class="stat-label-text">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-section" id="how-it-works">
      <div class="section-video-wrap">
        <video class="section-video" autoplay loop muted playsinline src="/videos/city.mp4"></video>
        <div class="section-video-overlay dark"></div>
      </div>
      <div class="section-container">
        <div class="section-eyebrow">Simple Process</div>
        <h2 class="section-title">How <em>Vakilr</em> Works</h2>
        <div class="how-toggle">
          <button :class="['toggle-btn', { active: howSide === 'client' }]" @click="howSide = 'client'">👤 For Clients</button>
          <button :class="['toggle-btn', { active: howSide === 'lawyer' }]" @click="howSide = 'lawyer'">⚖️ For Lawyers</button>
        </div>
        <div class="how-steps">
          <div v-for="(step, i) in howSteps[howSide]" :key="howSide+i" class="how-step">
            <div class="step-num-bg">{{ String(i+1).padStart(2,'0') }}</div>
            <div class="step-icon-wrap"><span>{{ step.icon }}</span></div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-body">{{ step.body }}</p>
            <div v-if="i < 2" class="step-arrow">→</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="services-section" id="services">
      <div class="section-container">
        <div class="section-eyebrow">What We Offer</div>
        <h2 class="section-title">Every Legal Service<br/><em>Under One Roof</em></h2>
        <p class="section-sub">From a 10-minute consultation to full court representation.</p>
        <div class="services-grid">
          <div class="service-card" v-for="svc in services" :key="svc.title">
            <div class="sc-glow" :style="{ background: svc.glow }"></div>
            <div class="sc-icon">{{ svc.icon }}</div>
            <h3 class="sc-title">{{ svc.title }}</h3>
            <p class="sc-desc">{{ svc.desc }}</p>
            <div class="sc-price">{{ svc.price }}</div>
            <span class="sc-tag">{{ svc.tag }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- LAWYERS -->
    <section class="lawyers-section" id="lawyers">
      <div class="section-video-wrap">
        <video class="section-video" autoplay loop muted playsinline src="/videos/scales.mp4"></video>
        <div class="section-video-overlay"></div>
      </div>
      <div class="section-container">
        <div class="section-eyebrow">Our Network</div>
        <h2 class="section-title">Meet Our <em>Top Lawyers</em></h2>
        <p class="section-sub">All verified. All rated. Ready to help right now.</p>
      </div>
      <div class="lawyers-scroll-wrap">
        <div class="lawyers-track">
          <div class="lawyer-card" v-for="l in lawyers" :key="l.name">
            <div class="lc-top">
              <div class="lc-avatar" :style="{ background: l.color }">
                {{ l.initials }}
                <div class="lc-status" :class="l.status"></div>
              </div>
              <div class="lc-meta">
                <div class="lc-name">{{ l.name }}</div>
                <div class="lc-spec">{{ l.spec }}</div>
                <div class="lc-city">📍 {{ l.city }}</div>
              </div>
              <div class="lc-rate"><span class="rate-num">₹{{ l.rate }}</span><span class="rate-unit">/min</span></div>
            </div>
            <div class="lc-stats">
              <div class="lcs"><span>⭐ {{ l.rating }}</span><small>Rating</small></div>
              <div class="lcs"><span>{{ l.cases }}</span><small>Cases</small></div>
              <div class="lcs"><span>{{ l.exp }}yr</span><small>Exp.</small></div>
            </div>
            <div class="lc-tags"><span v-for="t in l.tags" :key="t" class="lc-tag">{{ t }}</span></div>
            <div class="lc-actions">
              <router-link to="/role" class="lc-btn-primary">Consult Now</router-link>
              <button class="lc-btn-secondary">View Profile</button>
            </div>
          </div>
        </div>
      </div>
      <p class="lawyers-scroll-hint">← Scroll to explore more lawyers →</p>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials-section">
      <div class="section-container">
        <div class="section-eyebrow">Real Stories</div>
        <h2 class="section-title">What Our <em>Clients Say</em></h2>
      </div>
      <div class="marquee-wrap" style="margin-top:2rem">
        <div class="marquee-track forward">
          <div class="testimonial-card" v-for="(t,i) in [...testimonials,...testimonials]" :key="'a'+i">
            <div class="tc-stars">★★★★★</div>
            <p class="tc-text">"{{ t.text }}"</p>
            <div class="tc-author">
              <div class="tc-avatar" :style="{background:t.color}">{{ t.initials }}</div>
              <div><div class="tc-name">{{ t.name }}</div><div class="tc-detail">{{ t.detail }}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="marquee-wrap" style="margin-top:1.25rem">
        <div class="marquee-track reverse">
          <div class="testimonial-card" v-for="(t,i) in [...testimonialsB,...testimonialsB]" :key="'b'+i">
            <div class="tc-stars">★★★★★</div>
            <p class="tc-text">"{{ t.text }}"</p>
            <div class="tc-author">
              <div class="tc-avatar" :style="{background:t.color}">{{ t.initials }}</div>
              <div><div class="tc-name">{{ t.name }}</div><div class="tc-detail">{{ t.detail }}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOR FIRMS -->
    <section class="firms-section" id="firms">
      <div class="section-video-wrap">
        <video class="section-video" autoplay loop muted playsinline src="/videos/lawyer.mp4"></video>
        <div class="section-video-overlay dark"></div>
      </div>
      <div class="section-container firms-inner">
        <div class="firms-text">
          <div class="section-eyebrow">Law Firms</div>
          <h2 class="section-title" style="text-align:left">Your Entire Firm<br/><em>On Vakilr</em></h2>
          <p class="section-sub" style="text-align:left;max-width:480px">Register your law firm, add your team, manage clients, and build your firm's reputation — all in one platform.</p>
          <div class="firms-features">
            <div class="firm-feat" v-for="f in firmFeatures" :key="f.title">
              <span class="feat-icon">{{ f.icon }}</span>
              <div><div class="feat-title">{{ f.title }}</div><div class="feat-desc">{{ f.desc }}</div></div>
            </div>
          </div>
          <router-link to="/role" class="btn-primary-hero" style="display:inline-flex;margin-top:2rem">Register Your Firm →</router-link>
        </div>
        <div class="firms-card-wrap">
          <div class="firm-showcase-card">
            <div class="fsc-header">
              <div class="fsc-logo">⚖️</div>
              <div><div class="fsc-name">Mehta & Associates</div><div class="fsc-sub">Delhi · Est. 2008</div></div>
              <span class="fsc-badge">Law Firm</span>
            </div>
            <div class="fsc-specs">
              <span class="spec-tag">Corporate</span><span class="spec-tag">Mergers</span>
              <span class="spec-tag">IPO</span><span class="spec-tag">Compliance</span>
            </div>
            <div class="fsc-stats">
              <div class="fsc-stat"><span>18</span><small>Lawyers</small></div>
              <div class="fsc-stat"><span>4.9★</span><small>Rating</small></div>
              <div class="fsc-stat"><span>2,400+</span><small>Cases</small></div>
            </div>
            <div class="fsc-team">
              <div class="team-avatars">
                <div v-for="(m,i) in firmTeam" :key="i" class="team-av" :style="{background:m.color}">{{m.init}}</div>
                <div class="team-more">+14</div>
              </div>
              <span class="team-label">18 lawyers on this team</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section class="pricing-section" id="pricing">
      <div class="section-video-wrap">
        <video class="section-video" autoplay loop muted playsinline src="/videos/document.mp4"></video>
        <div class="section-video-overlay dark"></div>
      </div>
      <div class="section-container">
        <div class="section-eyebrow">Transparent Pricing</div>
        <h2 class="section-title">No Surprises.<br/><em>Ever.</em></h2>
        <p class="section-sub">Platform takes 20% automatically. Lawyers get 80%. Simple.</p>
        <div class="pricing-grid">
          <div class="pricing-card featured">
            <div class="pc-badge">All Sessions</div>
            <h3 class="pc-title">Auto Commission Split</h3>
            <div class="pc-split">
              <div class="split-block lawyer"><span class="split-pct">80%</span><span class="split-label">Lawyer gets</span></div>
              <div class="split-divider">+</div>
              <div class="split-block platform"><span class="split-pct">20%</span><span class="split-label">Platform fee</span></div>
            </div>
            <p class="pc-note">Automatic escrow split. Chat · Call · Video · Documents</p>
          </div>
          <div class="pricing-card">
            <div class="pc-badge">Court Cases</div>
            <h3 class="pc-title">One-Time Placement Fee</h3>
            <div class="tier-list">
              <div class="tier-row" v-for="t in tiers" :key="t.name">
                <div><div class="tier-name">{{ t.name }}</div><div class="tier-exp">{{ t.exp }}</div></div>
                <span class="tier-price">{{ t.price }}</span>
              </div>
            </div>
            <p class="pc-note">After fee — platform steps back. Client & lawyer deal directly.</p>
          </div>
          <div class="pricing-card">
            <div class="pc-badge">For Clients</div>
            <h3 class="pc-title">What You Pay</h3>
            <div class="client-pricing">
              <div class="cp-row" v-for="cp in clientPricing" :key="cp.service">
                <span>{{ cp.icon }}</span><span class="cp-service">{{ cp.service }}</span><span class="cp-price">{{ cp.price }}</span>
              </div>
            </div>
            <p class="pc-note">All prices shown upfront before you pay. No hidden charges.</p>
          </div>
        </div>
        <div class="pricing-guarantee">
          <span>🛡️</span>
          <p>All payments held in <strong>secure escrow</strong>. 7-day dispute protection on every transaction.</p>
        </div>
      </div>
    </section>

    <!-- DOWNLOAD -->
    <section class="download-section">
      <div class="section-video-wrap">
        <video class="section-video" autoplay loop muted playsinline src="/videos/hero.mp4"></video>
        <div class="section-video-overlay dark"></div>
      </div>
      <div class="section-container download-inner">
        <div class="download-text">
          <div class="section-eyebrow">Get The App</div>
          <h2 class="section-title" style="text-align:left">Legal Help in<br/><em>Your Pocket</em></h2>
          <p class="section-sub" style="text-align:left;max-width:420px">Download the Vakilr app for Android. Find lawyers, consult instantly, track your cases.</p>
          <div class="download-btns">
            <a href="/vakilr.apk" download class="dl-btn android">
              <span>📱</span><div><div class="dl-small">Download for</div><div class="dl-big">Android APK</div></div>
            </a>
            <div class="dl-btn coming">
              <span>🍎</span><div><div class="dl-small">Coming Soon</div><div class="dl-big">iOS App</div></div>
            </div>
          </div>
        </div>
        <div class="phone-mockup">
          <div class="phone-frame">
            <div class="phone-screen">
              <div class="ps-header">
                <span style="color:#C9A84C;font-family:'Playfair Display',serif;font-style:italic;font-weight:900;font-size:1rem">Vakilr</span>
                <span style="color:#10b981;font-size:0.65rem">● Online</span>
              </div>
              <div class="ps-search">🔍 Find a lawyer...</div>
              <div class="ps-cards">
                <div class="ps-card" v-for="l in lawyers.slice(0,3)" :key="l.name">
                  <div class="ps-av" :style="{background:l.color}">{{l.initials}}</div>
                  <div style="flex:1"><div style="font-size:0.68rem;font-weight:600;color:#f0f4ff">{{l.name.split(' ').slice(-1)[0]}}</div><div style="font-size:0.6rem;color:#8892b0">{{l.spec}}</div></div>
                  <div style="font-size:0.65rem;color:#C9A84C;font-weight:700">₹{{l.rate}}/m</div>
                </div>
              </div>
              <div class="ps-nav"><span>🏠</span><span>🔍</span><span style="color:#C9A84C">✨</span><span>⏱</span><span>👤</span></div>
            </div>
          </div>
          <div class="phone-glow"></div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none"><rect x="48" y="22" width="4" height="56" rx="2" fill="#C9A84C"/><rect x="20" y="28" width="60" height="4" rx="2" fill="#C9A84C"/><rect x="32" y="74" width="36" height="4" rx="2" fill="#C9A84C"/><path d="M18 50 Q26 58 34 50" stroke="#C9A84C" stroke-width="2.5" fill="none"/><path d="M66 50 Q74 58 82 50" stroke="#C9A84C" stroke-width="2.5" fill="none"/></svg>
              <span style="font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;font-style:italic;color:#C9A84C">Vakilr</span>
            </div>
            <p class="footer-tagline">Justice for Everyone.<br/>India's complete legal marketplace.</p>
            <div class="footer-social">
              <a href="#" class="social-btn">𝕏</a>
              <a href="#" class="social-btn">in</a>
              <a href="#" class="social-btn">f</a>
            </div>
          </div>
          <div class="footer-links-grid">
            <div class="footer-col">
              <div class="footer-col-title">Platform</div>
              <a href="#how-it-works">How It Works</a>
              <a href="#services">Services</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">For Lawyers</div>
              <router-link to="/role">Join as Lawyer</router-link>
              <a href="#">Verification</a>
              <a href="#">Resources</a>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">For Firms</div>
              <router-link to="/role">Register Firm</router-link>
              <a href="#">Team Mgmt</a>
              <a href="#">Enterprise</a>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">Legal</div>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
              <a href="#">Disputes</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 Vakilr Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Made with ⚖️ in India</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const navScrolled = ref(false)
const mobileMenu  = ref(false)
const howSide     = ref('client')
const particleCanvas = ref(null)
let statsAnimated = false

const stats = reactive([
  { label: 'Verified Lawyers',    target: 12000, suffix: '+',  display: '0+',   decimal: false },
  { label: 'Cases Completed',     target: 48000, suffix: '+',  display: '0+',   decimal: false },
  { label: 'Average Rating',      target: 4.8,   suffix: '★',  display: '0★',   decimal: true  },
  { label: 'Cities Covered',      target: 450,   suffix: '+',  display: '0+',   decimal: false },
  { label: 'Client Satisfaction', target: 98,    suffix: '%',  display: '0%',   decimal: false },
])

const howSteps = {
  client: [
    { icon:'🔍', title:'Describe Your Problem', body:"Tell our AI your legal issue in plain Hindi or English. No jargon needed." },
    { icon:'⚖️', title:'Get Matched Instantly', body:'AI recommends 3 verified lawyers with exact upfront prices.' },
    { icon:'💬', title:'Consult & Pay Safely', body:'Chat, call or video. Pay into escrow. Lawyer paid only after work done.' },
  ],
  lawyer: [
    { icon:'📝', title:'Create Your Profile', body:'Sign up with your bar council number and set your own prices.' },
    { icon:'✅', title:'Get Verified', body:'Upload certificate. Manual review in 24–48 hours. Profile goes live.' },
    { icon:'💰', title:'Earn Consistently', body:'Accept requests, do the work, get 80% automatically in your wallet.' },
  ],
}

const services = [
  { icon:'💬', title:'Chat Consultation', desc:'Real-time text with a verified lawyer. Pay per minute, stop anytime.', price:'From ₹5/min', tag:'Most Popular', glow:'radial-gradient(circle at 50% 0%,rgba(201,168,76,0.2),transparent 60%)' },
  { icon:'📞', title:'Voice Call', desc:'Speak directly to your lawyer for clearer communication.', price:'From ₹10/min', tag:'Quick Help', glow:'radial-gradient(circle at 50% 0%,rgba(59,130,246,0.15),transparent 60%)' },
  { icon:'🎥', title:'Video Call', desc:'Face-to-face consultation. Best for serious matters.', price:'From ₹15/min', tag:'Recommended', glow:'radial-gradient(circle at 50% 0%,rgba(16,185,129,0.15),transparent 60%)' },
  { icon:'📄', title:'Document Review', desc:'Upload your contract or notice. Get expert legal review fast.', price:'From ₹299/doc', tag:'Fast Turnaround', glow:'radial-gradient(circle at 50% 0%,rgba(245,158,11,0.15),transparent 60%)' },
  { icon:'🏛️', title:'Court Representation', desc:'Full case handling. One-time fee, then lawyer deals directly.', price:'₹999 – ₹4,999', tag:'Complete Service', glow:'radial-gradient(circle at 50% 0%,rgba(139,92,246,0.15),transparent 60%)' },
  { icon:'🏢', title:'Law Firm Services', desc:'Connect with entire firms for large corporate matters.', price:'Custom Pricing', tag:'Enterprise', glow:'radial-gradient(circle at 50% 0%,rgba(239,68,68,0.12),transparent 60%)' },
]

const lawyers = [
  { name:'Adv. Priya Sharma',   initials:'PS', spec:'Family Law',        city:'Mumbai',    rate:35, rating:4.9, cases:342, exp:8,  status:'online',  color:'linear-gradient(135deg,#C9A84C,#a8882a)', tags:['Divorce','Child Custody'] },
  { name:'Adv. Rahul Verma',    initials:'RV', spec:'Criminal Defense',  city:'Delhi',     rate:50, rating:4.8, cases:518, exp:12, status:'online',  color:'linear-gradient(135deg,#3b82f6,#1d4ed8)', tags:['Bail','Trial'] },
  { name:'Adv. Sunita Roy',     initials:'SR', spec:'Property Law',      city:'Kolkata',   rate:28, rating:4.7, cases:201, exp:6,  status:'busy',    color:'linear-gradient(135deg,#10b981,#047857)', tags:['Land Dispute','RERA'] },
  { name:'Adv. Amit Patel',     initials:'AP', spec:'Corporate Law',     city:'Ahmedabad', rate:65, rating:5.0, cases:890, exp:18, status:'online',  color:'linear-gradient(135deg,#8b5cf6,#6d28d9)', tags:['M&A','Contracts'] },
  { name:'Adv. Meera Iyer',     initials:'MI', spec:'Tax Law',           city:'Bangalore', rate:45, rating:4.9, cases:456, exp:10, status:'online',  color:'linear-gradient(135deg,#ec4899,#be185d)', tags:['GST','Income Tax'] },
  { name:'Adv. Karan Malhotra', initials:'KM', spec:'Cyber Law',         city:'Hyderabad', rate:40, rating:4.6, cases:178, exp:5,  status:'offline', color:'linear-gradient(135deg,#f59e0b,#d97706)', tags:['Data Privacy','IT Act'] },
]

const testimonials = [
  { text:'Found an amazing property lawyer within minutes. Settled my land dispute in 3 months.', name:'Rajesh Kumar', detail:'Property Dispute · Delhi', initials:'RK', color:'#C9A84C' },
  { text:'As a first-time entrepreneur I had no idea about contracts. Got everything drafted perfectly.', name:'Ananya Singh', detail:'Contract Review · Bangalore', initials:'AS', color:'#3b82f6' },
  { text:'My divorce case was handled with complete professionalism. The lawyer was always available.', name:'Pooja Mehta', detail:'Family Law · Mumbai', initials:'PM', color:'#10b981' },
  { text:'The AI guide instantly matched me with exactly the right lawyer. Resolved in 2 weeks!', name:'Vikram Nair', detail:'Consumer Law · Kochi', initials:'VN', color:'#8b5cf6' },
]
const testimonialsB = [
  { text:'Found a criminal defense specialist at midnight through Vakilr. Got bail next morning.', name:'Suresh Yadav', detail:'Criminal Defense · Lucknow', initials:'SY', color:'#ef4444' },
  { text:'Our startup needed an NDA urgently. Vakilr lawyer delivered a perfect document in 2 hours.', name:'Deepika Reddy', detail:'Corporate Law · Hyderabad', initials:'DR', color:'#f59e0b' },
  { text:'Labour lawyer helped me recover 6 months salary through proper legal notice.', name:'Mohammed Iqbal', detail:'Labour Law · Pune', initials:'MI', color:'#ec4899' },
  { text:'Transparent pricing is what got me. No surprise bills. Paid exactly what was shown.', name:'Kavitha Rajan', detail:'Property Law · Chennai', initials:'KR', color:'#14b8a6' },
]

const firmFeatures = [
  { icon:'🏢', title:'Firm Profile Page', desc:'Dedicated listing with all team lawyers and case history.' },
  { icon:'👥', title:'Team Management', desc:'Add and manage lawyers in your firm from one dashboard.' },
  { icon:'💰', title:'Firm Wallet', desc:'Consolidated earnings across all team members.' },
  { icon:'📊', title:'Analytics', desc:'Track firm performance, client satisfaction, and revenue.' },
]
const firmTeam = [
  {init:'AK',color:'#C9A84C'},{init:'RS',color:'#3b82f6'},{init:'PM',color:'#10b981'},{init:'VT',color:'#8b5cf6'},
]
const tiers = [
  {name:'Standard',    exp:'0–5 years',   price:'₹999'},
  {name:'Experienced', exp:'5–10 years',  price:'₹2,499'},
  {name:'Senior',      exp:'10–20 years', price:'₹3,999'},
  {name:'Expert',      exp:'20+ years',   price:'₹4,999'},
]
const clientPricing = [
  {icon:'💬',service:'Chat Consultation',price:"Lawyer's rate/min"},
  {icon:'📞',service:'Voice Call',price:"Lawyer's rate/min"},
  {icon:'🎥',service:'Video Call',price:"Lawyer's rate/min"},
  {icon:'📄',service:'Document Review',price:'Flat rate'},
  {icon:'🏛️',service:'Court Cases',price:'₹999 – ₹4,999'},
]

// Particles
function initParticles() {
  const canvas = particleCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let W = canvas.width = window.innerWidth
  let H = canvas.height = window.innerHeight
  const pts = Array.from({length:55},()=>({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3,
    r:Math.random()*1.5+0.4, o:Math.random()*0.35+0.1,
  }))
  let id
  function draw() {
    ctx.clearRect(0,0,W,H)
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy
      if(p.x<0)p.x=W; if(p.x>W)p.x=0
      if(p.y<0)p.y=H; if(p.y>H)p.y=0
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
      ctx.fillStyle=`rgba(201,168,76,${p.o})`; ctx.fill()
    })
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y
      const d=Math.sqrt(dx*dx+dy*dy)
      if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y)
        ctx.strokeStyle=`rgba(201,168,76,${0.07*(1-d/90)})`; ctx.lineWidth=0.5; ctx.stroke() }
    }
    id=requestAnimationFrame(draw)
  }
  draw()
  const onResize=()=>{ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight }
  window.addEventListener('resize',onResize)
  return ()=>{ cancelAnimationFrame(id); window.removeEventListener('resize',onResize) }
}

// Stats counter
function animateStats() {
  stats.forEach(s=>{
    const dur=2200, start=performance.now()
    const tick=(now)=>{
      const p=Math.min((now-start)/dur,1)
      const e=1-Math.pow(1-p,3)
      const v=s.target*e
      s.display=(s.decimal?v.toFixed(1):Math.floor(v).toLocaleString('en-IN'))+s.suffix
      if(p<1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

// Scroll
function onScroll() {
  navScrolled.value = window.scrollY > 60
  if (!statsAnimated) {
    const el = document.querySelector('.stats-bar')
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      statsAnimated = true
      animateStats()
    }
  }
}

let cleanup
onMounted(()=>{ cleanup=initParticles(); window.addEventListener('scroll',onScroll,{passive:true}) })
onUnmounted(()=>{ cleanup?.(); window.removeEventListener('scroll',onScroll) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.landing{background:#0A0F2C;color:#f0f4ff;font-family:'DM Sans',sans-serif;overflow-x:hidden}

/* NAVBAR */
.navbar{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all 0.4s}
.navbar.scrolled{background:rgba(4,7,26,0.93);backdrop-filter:blur(20px);border-bottom:1px solid rgba(201,168,76,0.12)}
.nav-container{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:2rem;padding:1.1rem 2rem}
.nav-logo{display:flex;align-items:center;gap:0.6rem}
.nav-brand{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;font-style:italic;color:#C9A84C}
.nav-links{display:flex;gap:2rem;flex:1;justify-content:center}
.nav-links a{color:rgba(240,244,255,0.65);text-decoration:none;font-size:0.88rem;font-weight:500;transition:color 0.2s}
.nav-links a:hover{color:#C9A84C}
.nav-actions{display:flex;gap:0.75rem;align-items:center}
.nav-login{color:rgba(240,244,255,0.65);text-decoration:none;font-size:0.88rem;font-weight:500;padding:0.5rem 1rem;transition:color 0.2s}
.nav-login:hover{color:#f0f4ff}
.nav-cta{background:#C9A84C;color:#0A0F2C;text-decoration:none;padding:0.55rem 1.4rem;border-radius:10px;font-size:0.88rem;font-weight:700;box-shadow:0 0 20px rgba(201,168,76,0.3);transition:all 0.2s}
.nav-cta:hover{background:#e0b84a;transform:translateY(-1px)}
.nav-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
.nav-hamburger span{display:block;width:22px;height:2px;background:#f0f4ff;border-radius:1px}
.mobile-menu{display:none;flex-direction:column;background:rgba(4,7,26,0.98);padding:1.5rem 2rem 2rem;gap:1rem;border-top:1px solid rgba(255,255,255,0.07)}
.mobile-menu.open{display:flex}
.mobile-menu a{color:rgba(240,244,255,0.7);text-decoration:none;font-size:1rem;font-weight:500;padding:0.4rem 0}
.mobile-cta{background:#C9A84C!important;color:#0A0F2C!important;padding:0.8rem!important;border-radius:12px;text-align:center;font-weight:700!important}

/* HERO */
.hero{position:relative;height:100vh;min-height:700px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.hero-video-wrap{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 80% 60% at 50% 30%,rgba(201,168,76,0.1),transparent 60%),#04071a}
.hero-video{width:100%;height:100%;object-fit:cover;opacity:0.4}
.hero-video-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(4,7,26,0.25) 0%,rgba(4,7,26,0.1) 40%,rgba(4,7,26,0.75) 100%)}
.particle-canvas{position:absolute;inset:0;z-index:1;pointer-events:none}
.floating-scales{position:absolute;right:8%;top:50%;transform:translateY(-50%);z-index:2;pointer-events:none;animation:float-scales 6s ease-in-out infinite}
.scales-svg{filter:drop-shadow(0 0 28px rgba(201,168,76,0.25))}
.scales-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.12),transparent 70%);pointer-events:none}
.hero-content{position:relative;z-index:3;max-width:680px;padding:0 2rem;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.28);color:#C9A84C;padding:0.4rem 1.2rem;border-radius:100px;font-size:0.78rem;font-weight:600;letter-spacing:0.04em;margin-bottom:1.5rem;animation:fade-up 0.8s ease both}
.badge-dot{width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse-dot 2s infinite;flex-shrink:0}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.6rem,6vw,5.2rem);font-weight:900;line-height:1.08;color:#f0f4ff;margin-bottom:1.5rem;animation:fade-up 0.8s 0.1s ease both}
.title-line{display:block}
.gold-italic{color:#C9A84C;font-style:italic}
.hero-sub{font-size:clamp(0.95rem,2vw,1.1rem);color:rgba(240,244,255,0.72);line-height:1.7;margin-bottom:2.5rem;animation:fade-up 0.8s 0.2s ease both}
.hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:3rem;animation:fade-up 0.8s 0.3s ease both}
.btn-primary-hero{display:inline-flex;align-items:center;gap:0.5rem;background:#C9A84C;color:#0A0F2C;text-decoration:none;padding:0.9rem 2rem;border-radius:14px;font-size:1rem;font-weight:700;box-shadow:0 0 32px rgba(201,168,76,0.38);transition:all 0.25s}
.btn-primary-hero:hover{background:#e0b84a;transform:translateY(-2px);box-shadow:0 0 48px rgba(201,168,76,0.5)}
.btn-secondary-hero{display:inline-flex;align-items:center;background:rgba(255,255,255,0.08);color:#f0f4ff;text-decoration:none;border:1px solid rgba(255,255,255,0.18);padding:0.9rem 2rem;border-radius:14px;font-size:1rem;font-weight:600;backdrop-filter:blur(8px);transition:all 0.25s}
.btn-secondary-hero:hover{background:rgba(255,255,255,0.12);border-color:rgba(201,168,76,0.4)}
.hero-trust{display:flex;align-items:center;justify-content:center;gap:2rem;flex-wrap:wrap;animation:fade-up 0.8s 0.4s ease both}
.trust-item{text-align:center}
.trust-val{display:block;font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#C9A84C}
.trust-label{font-size:0.7rem;color:rgba(240,244,255,0.45);text-transform:uppercase;letter-spacing:0.08em}
.trust-sep{width:1px;height:32px;background:rgba(255,255,255,0.1)}
.scroll-indicator{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:0.4rem;color:rgba(240,244,255,0.35);font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase}
.scroll-line{width:1px;height:36px;background:linear-gradient(to bottom,rgba(201,168,76,0.7),transparent);animation:scroll-pulse 2s infinite}

/* STATS */
.stats-bar{background:rgba(201,168,76,0.05);border-top:1px solid rgba(201,168,76,0.14);border-bottom:1px solid rgba(201,168,76,0.14);padding:2.5rem 2rem}
.stats-container{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-around;flex-wrap:wrap;gap:2rem}
.stat-item{text-align:center}
.stat-number{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;color:#C9A84C}
.stat-label-text{font-size:0.75rem;color:rgba(240,244,255,0.45);text-transform:uppercase;letter-spacing:0.08em;margin-top:0.25rem}

/* SECTION COMMONS */
.section-video-wrap{position:absolute;inset:0;z-index:0;overflow:hidden}
.section-video{width:100%;height:100%;object-fit:cover;opacity:0.22}
.section-video-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,15,44,0.55),rgba(10,15,44,0.5))}
.section-video-overlay.dark{background:linear-gradient(to bottom,rgba(4,7,26,0.78),rgba(4,7,26,0.82))}
.section-container{position:relative;z-index:1;max-width:1280px;margin:0 auto;padding:0 2rem}
.section-eyebrow{display:inline-block;color:#C9A84C;font-size:0.73rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.75rem}
.section-title{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,4vw,3rem);font-weight:900;color:#f0f4ff;line-height:1.15;margin-bottom:1rem;text-align:center}
.section-title em{color:#C9A84C;font-style:italic}
.section-sub{color:rgba(240,244,255,0.58);font-size:1rem;line-height:1.7;text-align:center;margin-bottom:3rem}
/* HOW IT WORKS */
.how-section{position:relative;padding:7rem 0;overflow:hidden}
.how-toggle{display:flex;justify-content:center;gap:0.5rem;margin-bottom:3.5rem}
.toggle-btn{padding:0.65rem 1.6rem;border-radius:100px;border:1.5px solid rgba(255,255,255,0.12);background:transparent;color:rgba(240,244,255,0.55);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.3s}
.toggle-btn.active{background:rgba(201,168,76,0.14);border-color:#C9A84C;color:#C9A84C}
.how-steps{display:flex;align-items:flex-start;justify-content:center;gap:2rem;flex-wrap:wrap}
.how-step{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:250px;flex:1;min-width:180px;position:relative;transition:transform 0.3s}
.how-step:hover{transform:translateY(-4px)}
.step-num-bg{font-family:'Playfair Display',serif;font-size:4rem;font-weight:900;color:rgba(201,168,76,0.1);line-height:1;position:absolute;top:-1.5rem;left:50%;transform:translateX(-50%)}
.step-icon-wrap{width:78px;height:78px;border-radius:50%;background:rgba(201,168,76,0.1);border:1.5px solid rgba(201,168,76,0.25);display:flex;align-items:center;justify-content:center;font-size:2rem;margin:2.5rem 0 1.25rem;position:relative;z-index:1;transition:all 0.3s}
.how-step:hover .step-icon-wrap{background:rgba(201,168,76,0.18);box-shadow:0 0 24px rgba(201,168,76,0.2)}
.step-title{font-weight:700;font-size:1rem;color:#f0f4ff;margin-bottom:0.5rem}
.step-body{font-size:0.83rem;color:rgba(240,244,255,0.55);line-height:1.6}
.step-arrow{position:absolute;top:calc(2.5rem + 39px);right:-1.5rem;color:rgba(201,168,76,0.35);font-size:1.2rem;z-index:2}

/* SERVICES */
.services-section{padding:7rem 0;background:rgba(4,7,26,0.35)}
.services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1.5rem}
.service-card{position:relative;overflow:hidden;background:rgba(22,29,63,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:2rem 1.75rem;backdrop-filter:blur(12px);transition:all 0.3s cubic-bezier(0.4,0,0.2,1);cursor:pointer}
.service-card:hover{transform:translateY(-6px);border-color:rgba(201,168,76,0.32);box-shadow:0 20px 60px rgba(0,0,0,0.4)}
.sc-glow{position:absolute;top:0;left:0;right:0;height:100px;pointer-events:none}
.sc-icon{font-size:2.5rem;margin-bottom:1rem;display:block}
.sc-title{font-weight:700;font-size:1.05rem;color:#f0f4ff;margin-bottom:0.6rem}
.sc-desc{font-size:0.83rem;color:rgba(240,244,255,0.58);line-height:1.6;margin-bottom:1.25rem}
.sc-price{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:#C9A84C;margin-bottom:0.6rem}
.sc-tag{display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);color:#C9A84C;padding:0.2rem 0.7rem;border-radius:100px;font-size:0.7rem;font-weight:600;letter-spacing:0.04em}

/* LAWYERS */
.lawyers-section{position:relative;padding:7rem 0;overflow:hidden}
.lawyers-scroll-wrap{overflow-x:auto;padding:2rem 0 1rem;scrollbar-width:none;cursor:grab}
.lawyers-scroll-wrap::-webkit-scrollbar{display:none}
.lawyers-track{display:flex;gap:1.25rem;padding:0 2rem;min-width:max-content}
.lawyer-card{width:295px;flex-shrink:0;background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:1.5rem;backdrop-filter:blur(16px);transition:all 0.3s;cursor:pointer}
.lawyer-card:hover{transform:translateY(-4px);border-color:rgba(201,168,76,0.28);box-shadow:0 16px 48px rgba(0,0,0,0.4)}
.lc-top{display:flex;gap:0.875rem;align-items:flex-start;margin-bottom:1rem}
.lc-avatar{width:50px;height:50px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;color:#fff;position:relative;box-shadow:0 4px 12px rgba(0,0,0,0.3)}
.lc-status{position:absolute;bottom:0;right:0;width:13px;height:13px;border-radius:50%;border:2px solid #0d1538}
.lc-status.online{background:#10b981;box-shadow:0 0 8px #10b981}
.lc-status.busy{background:#f59e0b}
.lc-status.offline{background:#64748b}
.lc-meta{flex:1}
.lc-name{font-weight:700;font-size:0.92rem;color:#f0f4ff;margin-bottom:0.15rem}
.lc-spec{font-size:0.75rem;color:#C9A84C;font-weight:600;margin-bottom:0.1rem}
.lc-city{font-size:0.7rem;color:rgba(240,244,255,0.4)}
.lc-rate{text-align:right}
.rate-num{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:#C9A84C;display:block}
.rate-unit{font-size:0.68rem;color:rgba(240,244,255,0.35)}
.lc-stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);padding:0.75rem 0;margin-bottom:0.875rem}
.lcs{text-align:center}
.lcs span{display:block;font-weight:700;font-size:0.88rem;color:#f0f4ff}
.lcs small{font-size:0.62rem;color:rgba(240,244,255,0.38);text-transform:uppercase;letter-spacing:0.04em}
.lc-tags{display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:1rem}
.lc-tag{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.18);color:#C9A84C;padding:0.18rem 0.55rem;border-radius:100px;font-size:0.68rem;font-weight:600}
.lc-actions{display:flex;gap:0.5rem}
.lc-btn-primary{flex:1;padding:0.55rem;border-radius:10px;border:none;background:#C9A84C;color:#0A0F2C;font-weight:700;font-size:0.8rem;cursor:pointer;text-align:center;text-decoration:none;display:block;transition:all 0.2s}
.lc-btn-primary:hover{background:#e0b84a}
.lc-btn-secondary{flex:1;padding:0.55rem;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,244,255,0.65);font-weight:600;font-size:0.8rem;cursor:pointer;transition:all 0.2s}
.lc-btn-secondary:hover{border-color:rgba(201,168,76,0.3);color:#C9A84C}
.lawyers-scroll-hint{text-align:center;font-size:0.75rem;color:rgba(240,244,255,0.3);margin-top:1.5rem;letter-spacing:0.06em}

/* TESTIMONIALS */
.testimonials-section{padding:7rem 0;overflow:hidden}
.marquee-wrap{overflow:hidden}
.marquee-track{display:flex;gap:1.25rem;width:max-content}
.marquee-track.forward{animation:marquee-fwd 45s linear infinite}
.marquee-track.reverse{animation:marquee-rev 45s linear infinite}
.marquee-track:hover{animation-play-state:paused}
.testimonial-card{width:310px;flex-shrink:0;background:rgba(22,29,63,0.85);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:1.5rem;backdrop-filter:blur(12px)}
.tc-stars{color:#C9A84C;font-size:0.82rem;margin-bottom:0.75rem;letter-spacing:0.1em}
.tc-text{font-size:0.85rem;color:rgba(240,244,255,0.78);line-height:1.65;margin-bottom:1.25rem;font-style:italic}
.tc-author{display:flex;align-items:center;gap:0.75rem}
.tc-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:#fff;flex-shrink:0}
.tc-name{font-weight:700;font-size:0.82rem;color:#f0f4ff}
.tc-detail{font-size:0.7rem;color:rgba(240,244,255,0.4)}

/* FIRMS */
.firms-section{position:relative;padding:7rem 0;overflow:hidden}
.firms-inner{display:flex;align-items:center;gap:4rem;flex-wrap:wrap}
.firms-text{flex:1;min-width:280px}
.firms-features{display:flex;flex-direction:column;gap:1.25rem;margin-top:2rem}
.firm-feat{display:flex;align-items:flex-start;gap:1rem}
.feat-icon{font-size:1.4rem;flex-shrink:0;margin-top:0.1rem}
.feat-title{font-weight:700;font-size:0.93rem;color:#f0f4ff;margin-bottom:0.2rem}
.feat-desc{font-size:0.8rem;color:rgba(240,244,255,0.52);line-height:1.5}
.firms-card-wrap{flex:1;min-width:260px;max-width:380px}
.firm-showcase-card{background:rgba(22,29,63,0.92);border:1px solid rgba(201,168,76,0.2);border-radius:20px;padding:1.75rem;backdrop-filter:blur(16px);box-shadow:0 8px 48px rgba(0,0,0,0.4)}
.fsc-header{display:flex;align-items:center;gap:0.875rem;margin-bottom:1rem}
.fsc-logo{font-size:2rem}
.fsc-name{font-weight:700;font-size:0.97rem;color:#f0f4ff}
.fsc-sub{font-size:0.72rem;color:rgba(240,244,255,0.42);margin-top:0.15rem}
.fsc-badge{margin-left:auto;background:rgba(139,92,246,0.14);border:1px solid rgba(139,92,246,0.28);color:#a78bfa;padding:0.22rem 0.65rem;border-radius:100px;font-size:0.7rem;font-weight:600}
.fsc-specs{display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:1.25rem}
.spec-tag{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.18);color:#C9A84C;padding:0.18rem 0.6rem;border-radius:100px;font-size:0.7rem;font-weight:600}
.fsc-stats{display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:1.25rem;border-top:1px solid rgba(255,255,255,0.06);padding-top:1rem}
.fsc-stat{text-align:center}
.fsc-stat span{display:block;font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:#C9A84C}
.fsc-stat small{font-size:0.63rem;color:rgba(240,244,255,0.38);text-transform:uppercase;letter-spacing:0.05em}
.fsc-team{display:flex;align-items:center;gap:0.75rem}
.team-avatars{display:flex}
.team-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:#fff;border:2px solid rgba(13,21,56,0.8);margin-left:-5px}
.team-av:first-child{margin-left:0}
.team-more{width:28px;height:28px;border-radius:50%;background:rgba(201,168,76,0.14);border:2px solid rgba(13,21,56,0.8);display:flex;align-items:center;justify-content:center;font-size:0.58rem;font-weight:700;color:#C9A84C;margin-left:-5px}
.team-label{font-size:0.72rem;color:rgba(240,244,255,0.42)}

/* PRICING */
.pricing-section{position:relative;padding:7rem 0;overflow:hidden}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.5rem;margin-bottom:2rem}
.pricing-card{background:rgba(22,29,63,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:2rem;backdrop-filter:blur(12px)}
.pricing-card.featured{border-color:rgba(201,168,76,0.32);box-shadow:0 0 40px rgba(201,168,76,0.09)}
.pc-badge{display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.22);color:#C9A84C;padding:0.22rem 0.75rem;border-radius:100px;font-size:0.7rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:1rem}
.pc-title{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:#f0f4ff;margin-bottom:1.5rem}
.pc-split{display:flex;align-items:center;justify-content:center;gap:1.5rem;margin-bottom:1.5rem}
.split-block{text-align:center}
.split-pct{display:block;font-family:'Playfair Display',serif;font-size:2.8rem;font-weight:900;line-height:1}
.split-block.lawyer .split-pct{color:#10b981}
.split-block.platform .split-pct{color:#C9A84C}
.split-label{font-size:0.75rem;color:rgba(240,244,255,0.45);text-transform:uppercase;letter-spacing:0.08em}
.split-divider{font-size:1.4rem;color:rgba(255,255,255,0.18);font-weight:300}
.tier-list{display:flex;flex-direction:column;gap:0.65rem;margin-bottom:1.5rem}
.tier-row{display:flex;align-items:center;justify-content:space-between;padding:0.7rem;background:rgba(255,255,255,0.04);border-radius:10px}
.tier-name{font-weight:600;font-size:0.88rem;color:#f0f4ff;display:block}
.tier-exp{font-size:0.7rem;color:rgba(240,244,255,0.4)}
.tier-price{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:#C9A84C}
.client-pricing{display:flex;flex-direction:column;gap:0.55rem;margin-bottom:1.5rem}
.cp-row{display:flex;align-items:center;gap:0.7rem;padding:0.55rem;border-radius:8px;transition:background 0.2s;font-size:0.85rem}
.cp-row:hover{background:rgba(255,255,255,0.04)}
.cp-service{flex:1;color:rgba(240,244,255,0.68)}
.cp-price{font-size:0.8rem;font-weight:600;color:#C9A84C}
.pc-note{font-size:0.76rem;color:rgba(240,244,255,0.4);line-height:1.6;border-top:1px solid rgba(255,255,255,0.06);padding-top:1rem}
.pricing-guarantee{display:flex;align-items:flex-start;gap:1rem;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.18);border-radius:14px;padding:1.25rem 1.5rem}
.pricing-guarantee p{font-size:0.86rem;color:rgba(240,244,255,0.62);line-height:1.6}
.pricing-guarantee strong{color:#f0f4ff}

/* DOWNLOAD */
.download-section{position:relative;padding:7rem 0;overflow:hidden}
.download-inner{display:flex;align-items:center;gap:4rem;flex-wrap:wrap}
.download-text{flex:1;min-width:280px}
.download-btns{display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem}
.dl-btn{display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;border-radius:14px;text-decoration:none;cursor:pointer;transition:all 0.2s;border:none;font-family:'DM Sans',sans-serif}
.dl-btn.android{background:#C9A84C;color:#0A0F2C;box-shadow:0 0 24px rgba(201,168,76,0.3)}
.dl-btn.android:hover{background:#e0b84a;transform:translateY(-2px)}
.dl-btn.coming{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1)!important;color:rgba(240,244,255,0.45);cursor:not-allowed}
.dl-small{font-size:0.68rem;text-transform:uppercase;letter-spacing:0.08em;opacity:0.7}
.dl-big{font-size:0.95rem;font-weight:700}
.phone-mockup{flex-shrink:0;position:relative}
.phone-frame{width:210px;background:#0d1538;border:2px solid rgba(201,168,76,0.28);border-radius:30px;padding:10px;box-shadow:0 24px 80px rgba(0,0,0,0.6);position:relative;z-index:1}
.phone-screen{background:#0A0F2C;border-radius:22px;overflow:hidden;padding:0.875rem;min-height:360px;display:flex;flex-direction:column;gap:0.7rem}
.ps-header{display:flex;justify-content:space-between;align-items:center}
.ps-search{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:0.45rem 0.7rem;font-size:0.68rem;color:rgba(240,244,255,0.38)}
.ps-cards{display:flex;flex-direction:column;gap:0.45rem;flex:1}
.ps-card{display:flex;align-items:center;gap:0.45rem;background:rgba(22,29,63,0.9);border-radius:9px;padding:0.55rem}
.ps-av{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:700;color:#fff;flex-shrink:0}
.ps-nav{display:flex;justify-content:space-around;padding:0.45rem 0;border-top:1px solid rgba(255,255,255,0.06);font-size:0.85rem}
.phone-glow{position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.18),transparent 70%);pointer-events:none}

/* FOOTER */
.footer{background:#04071a;border-top:1px solid rgba(255,255,255,0.06);padding:4rem 0 2rem}
.footer-container{max-width:1280px;margin:0 auto;padding:0 2rem}
.footer-top{display:flex;gap:4rem;flex-wrap:wrap;margin-bottom:3rem}
.footer-brand{flex:1;min-width:180px}
.footer-tagline{font-size:0.83rem;color:rgba(240,244,255,0.42);line-height:1.6;margin-bottom:1.5rem}
.footer-social{display:flex;gap:0.5rem}
.social-btn{width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);display:flex;align-items:center;justify-content:center;color:rgba(240,244,255,0.55);text-decoration:none;font-size:0.8rem;transition:all 0.2s}
.social-btn:hover{background:rgba(201,168,76,0.14);border-color:rgba(201,168,76,0.28);color:#C9A84C}
.footer-links-grid{display:flex;gap:3rem;flex-wrap:wrap}
.footer-col{display:flex;flex-direction:column;gap:0.7rem;min-width:110px}
.footer-col-title{font-size:0.72rem;font-weight:700;color:#f0f4ff;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.2rem}
.footer-col a{font-size:0.8rem;color:rgba(240,244,255,0.42);text-decoration:none;transition:color 0.2s}
.footer-col a:hover{color:#C9A84C}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:2rem;flex-wrap:wrap;gap:1rem}
.footer-bottom p{font-size:0.75rem;color:rgba(240,244,255,0.28)}

/* KEYFRAMES */
@keyframes float-scales{0%,100%{transform:translateY(-50%) rotate(0deg)}33%{transform:translateY(calc(-50% - 14px)) rotate(1deg)}66%{transform:translateY(calc(-50% + 7px)) rotate(-0.8deg)}}
@keyframes fade-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse-dot{0%,100%{box-shadow:0 0 8px #10b981}50%{box-shadow:0 0 16px #10b981,0 0 24px rgba(16,185,129,0.4)}}
@keyframes scroll-pulse{0%,100%{opacity:0.3}50%{opacity:1}}
@keyframes marquee-fwd{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes marquee-rev{from{transform:translateX(-50%)}to{transform:translateX(0)}}

/* RESPONSIVE */
@media(max-width:768px){
  .nav-links,.nav-actions{display:none}
  .nav-hamburger{display:flex}
  .floating-scales{display:none}
  .hero-content{padding:0 1.25rem}
  .trust-sep{display:none}
  .hero-trust{gap:1rem}
  .how-steps{flex-direction:column;align-items:center}
  .step-arrow{display:none}
  .firms-inner,.download-inner{flex-direction:column}
  .firms-text{text-align:center}
  .phone-mockup{display:none}
  .footer-top{flex-direction:column;gap:2rem}
  .footer-links-grid{gap:1.5rem}
}
</style>
