<template>
  <div class="ds-root">
    <!-- Grain overlay -->
    <div class="grain"></div>

    <!-- ───────── NAV ───────── -->
    <header class="top-nav">
      <div class="nav-inner">
        <VakilrLogo />
        <nav class="nav-links">
          <a href="#colors">Colors</a>
          <a href="#typography">Type</a>
          <a href="#buttons">Buttons</a>
          <a href="#cards">Cards</a>
          <a href="#inputs">Inputs</a>
          <a href="#badges">Badges</a>
          <a href="#avatars">Avatars</a>
          <a href="#skeletons">Skeletons</a>
          <a href="#toasts">Toasts</a>
          <a href="#bottomnav">Bottom Nav</a>
        </nav>
        <button class="nav-cta" @click="showToast('Welcome to Vakilr Design System', 'success')">
          Show Toast ↗
        </button>
      </div>
    </header>

    <main class="ds-main">

      <!-- ───────── HERO ───────── -->
      <section class="ds-hero">
        <div class="hero-glow"></div>
        <div class="hero-glow hero-glow-2"></div>
        <div class="hero-content">
          <span class="hero-eyebrow">Design System v1.0</span>
          <h1 class="hero-title">
            <em>Vakilr</em> Component<br/>Library
          </h1>
          <p class="hero-sub">Every pixel. Every token. Every component.<br/>The complete visual language of Vakilr.</p>
          <div class="hero-stats">
            <div class="stat"><span class="stat-num">12</span><span class="stat-label">Components</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><span class="stat-num">4</span><span class="stat-label">Font Sizes</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><span class="stat-num">∞</span><span class="stat-label">Possibilities</span></div>
          </div>
        </div>
        <div class="hero-logo-large">
          <VakilrLogo size="large" />
        </div>
      </section>

      <!-- ───────── LOGO ───────── -->
      <section class="ds-section" id="logo">
        <SectionHeader number="00" title="Logo" subtitle="The Vakilr wordmark and icon system" />
        <div class="logo-showcase">
          <div class="logo-card dark-bg">
            <VakilrLogo size="small" />
            <span class="logo-label">Small — 28px</span>
          </div>
          <div class="logo-card dark-bg">
            <VakilrLogo size="medium" />
            <span class="logo-label">Medium — 40px (default)</span>
          </div>
          <div class="logo-card dark-bg">
            <VakilrLogo size="large" />
            <span class="logo-label">Large — 64px</span>
          </div>
          <div class="logo-card light-bg">
            <VakilrLogo size="medium" inverted />
            <span class="logo-label" style="color:#0A0F2C">On Light Background</span>
          </div>
          <div class="logo-card icon-only dark-bg">
            <VakilrIcon size="48" />
            <span class="logo-label">Icon Only</span>
          </div>
        </div>
      </section>

      <!-- ───────── COLORS ───────── -->
      <section class="ds-section" id="colors">
        <SectionHeader number="01" title="Color Tokens" subtitle="The complete Vakilr color palette" />
        <div class="color-grid">
          <ColorSwatch name="Navy 950" hex="#04071a" var="--navy-950" />
          <ColorSwatch name="Navy 900" hex="#0A0F2C" var="--navy-900" label="Background" />
          <ColorSwatch name="Navy 800" hex="#0d1538" var="--navy-800" />
          <ColorSwatch name="Navy 700" hex="#111d4a" var="--navy-700" />
          <ColorSwatch name="Navy 600" hex="#1a2d6b" var="--navy-600" />
          <ColorSwatch name="Surface" hex="#121830" var="--surface" label="Cards BG" />
          <ColorSwatch name="Card" hex="#161d3f" var="--card" label="Elevated" />
          <ColorSwatch name="Gold 300" hex="#f0d080" var="--gold-300" dark />
          <ColorSwatch name="Gold 400" hex="#e0b84a" var="--gold-400" dark />
          <ColorSwatch name="Gold 500" hex="#C9A84C" var="--gold-500" label="Primary" dark />
          <ColorSwatch name="Gold 600" hex="#a8882a" var="--gold-600" dark />
          <ColorSwatch name="Text Primary" hex="#f0f4ff" var="--text-primary" dark />
          <ColorSwatch name="Text Secondary" hex="#8892b0" var="--text-secondary" dark />
          <ColorSwatch name="Text Muted" hex="#4a5578" var="--text-muted" />
          <ColorSwatch name="Success" hex="#10b981" var="--success" dark />
          <ColorSwatch name="Error" hex="#ef4444" var="--error" dark />
          <ColorSwatch name="Warning" hex="#f59e0b" var="--warning" dark />
          <ColorSwatch name="Info" hex="#3b82f6" var="--info" dark />
        </div>
      </section>

      <!-- ───────── TYPOGRAPHY ───────── -->
      <section class="ds-section" id="typography">
        <SectionHeader number="02" title="Typography" subtitle="Playfair Display + DM Sans — authority meets clarity" />
        <div class="type-showcase">
          <div class="type-row">
            <span class="type-meta">Display / Playfair Display 900</span>
            <p class="t-display">Justice for All</p>
          </div>
          <div class="type-row">
            <span class="type-meta">Heading 1 / Playfair Display 700</span>
            <p class="t-h1">Find Your Lawyer</p>
          </div>
          <div class="type-row">
            <span class="type-meta">Heading 2 / Playfair Display 600</span>
            <p class="t-h2">Property & Contract Law</p>
          </div>
          <div class="type-row">
            <span class="type-meta">Heading 3 / DM Sans 600</span>
            <p class="t-h3">Criminal Defense Specialist</p>
          </div>
          <div class="type-row">
            <span class="type-meta">Body Large / DM Sans 400</span>
            <p class="t-body-lg">Connect with verified lawyers across India. Get legal help for property disputes, divorce, criminal cases, contracts, and more — in minutes.</p>
          </div>
          <div class="type-row">
            <span class="type-meta">Body / DM Sans 400</span>
            <p class="t-body">Vakilr is a two-sided marketplace connecting clients with verified lawyers and law firms across India. Transparent pricing, escrow payments, and AI-guided matching.</p>
          </div>
          <div class="type-row">
            <span class="type-meta">Caption / DM Sans 400</span>
            <p class="t-caption">₹20 per minute · 4.9 ★ · 342 cases · Responds in ~5 min</p>
          </div>
          <div class="type-row">
            <span class="type-meta">Label / DM Sans 600 Uppercase</span>
            <p class="t-label">Bar Council No. MH/1234/2015</p>
          </div>
          <div class="type-row gold-text-row">
            <span class="type-meta">Gold Italic / Playfair Display 700 italic</span>
            <p class="t-gold-italic">Vakilr</p>
          </div>
        </div>
      </section>

      <!-- ───────── BUTTONS ───────── -->
      <section class="ds-section" id="buttons">
        <SectionHeader number="03" title="Buttons" subtitle="Primary, Secondary, Ghost, Danger — all states" />

        <div class="component-row">
          <h3 class="component-sub-title">Primary — Gold</h3>
          <div class="btn-row">
            <VBtn variant="primary" size="sm">Small</VBtn>
            <VBtn variant="primary" size="md">Find a Lawyer</VBtn>
            <VBtn variant="primary" size="lg">Get Legal Help Now</VBtn>
            <VBtn variant="primary" size="md" :loading="btnLoading" @click="btnLoading = !btnLoading">
              {{ btnLoading ? 'Loading...' : 'Toggle Loading' }}
            </VBtn>
            <VBtn variant="primary" size="md" disabled>Disabled</VBtn>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">Secondary — Outlined</h3>
          <div class="btn-row">
            <VBtn variant="secondary" size="sm">Small</VBtn>
            <VBtn variant="secondary" size="md">View Profile</VBtn>
            <VBtn variant="secondary" size="lg">Browse Lawyers</VBtn>
            <VBtn variant="secondary" size="md" disabled>Disabled</VBtn>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">Ghost — Transparent</h3>
          <div class="btn-row">
            <VBtn variant="ghost" size="sm">Small</VBtn>
            <VBtn variant="ghost" size="md">Learn More</VBtn>
            <VBtn variant="ghost" size="lg">Skip for Now</VBtn>
            <VBtn variant="ghost" size="md" disabled>Disabled</VBtn>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">Danger + Icon Buttons</h3>
          <div class="btn-row">
            <VBtn variant="danger" size="md">End Session</VBtn>
            <VBtn variant="primary" size="md" icon>⚖️</VBtn>
            <VBtn variant="secondary" size="md" icon>📞</VBtn>
            <VBtn variant="primary" size="md">
              <span>Start Chat</span>
              <span class="btn-icon">→</span>
            </VBtn>
            <VBtn variant="primary" size="md" full>Full Width Button</VBtn>
          </div>
        </div>
      </section>

      <!-- ───────── CARDS ───────── -->
      <section class="ds-section" id="cards">
        <SectionHeader number="04" title="Cards" subtitle="Glassmorphism dark — the primary container system" />

        <div class="cards-grid">

          <!-- Lawyer Card -->
          <VCard class="lawyer-card-demo">
            <div class="lawyer-card-top">
              <VAvatar name="Priya Sharma" status="online" size="56" />
              <div class="lawyer-card-info">
                <div class="lawyer-name">Adv. Priya Sharma</div>
                <div class="lawyer-spec">
                  <VBadge variant="spec">Family Law</VBadge>
                  <VBadge variant="spec">Divorce</VBadge>
                </div>
                <div class="lawyer-meta">Mumbai · 8 years exp.</div>
              </div>
              <div class="lawyer-rate">
                <span class="rate-amount">₹35</span>
                <span class="rate-unit">/min</span>
              </div>
            </div>
            <div class="lawyer-card-stats">
              <div class="lcs"><span class="lcs-val">4.9</span><span class="lcs-label">Rating</span></div>
              <div class="lcs"><span class="lcs-val">342</span><span class="lcs-label">Cases</span></div>
              <div class="lcs"><span class="lcs-val">~5m</span><span class="lcs-label">Response</span></div>
              <div class="lcs"><span class="lcs-val">Hindi</span><span class="lcs-label">Languages</span></div>
            </div>
            <div class="lawyer-card-actions">
              <VBtn variant="primary" size="sm">Consult Now</VBtn>
              <VBtn variant="secondary" size="sm">View Profile</VBtn>
            </div>
          </VCard>

          <!-- Stat Card -->
          <VCard class="stat-card-demo">
            <div class="stat-card-icon">💰</div>
            <div class="stat-card-val">₹48,200</div>
            <div class="stat-card-label">Total Earnings</div>
            <div class="stat-card-change positive">↑ 12% this month</div>
          </VCard>

          <!-- Service Card -->
          <VCard class="service-card-demo" hoverable>
            <div class="service-icon">💬</div>
            <div class="service-name">Chat Consultation</div>
            <div class="service-price">₹20 <span>/min</span></div>
            <div class="service-desc">Instant text-based legal guidance. Timer starts when lawyer accepts.</div>
            <VBtn variant="primary" size="sm" style="margin-top: 1rem">Select</VBtn>
          </VCard>

          <!-- Firm Card -->
          <VCard class="firm-card-demo">
            <div class="firm-top">
              <div class="firm-logo">⚖️</div>
              <div>
                <div class="firm-name">Mehta & Associates</div>
                <div class="firm-location">Delhi · Est. 2008</div>
              </div>
              <VBadge variant="firm">Law Firm</VBadge>
            </div>
            <div class="firm-specs">
              <VBadge variant="spec">Corporate</VBadge>
              <VBadge variant="spec">Mergers</VBadge>
              <VBadge variant="spec">IPO</VBadge>
            </div>
            <div class="firm-team">12 lawyers · 4.8 ★ · 1,200+ cases</div>
          </VCard>

          <!-- Session Card -->
          <VCard class="session-card-demo">
            <div class="session-header">
              <VBadge variant="live">● Live Session</VBadge>
              <span class="session-timer">12:34</span>
            </div>
            <div class="session-lawyer">
              <VAvatar name="Rahul Verma" status="online" size="36" />
              <div>
                <div class="session-lawyer-name">Adv. Rahul Verma</div>
                <div class="session-type">Video Call</div>
              </div>
            </div>
            <div class="session-cost">
              <span class="session-cost-label">Amount used</span>
              <span class="session-cost-val">₹248.00</span>
            </div>
            <VBtn variant="danger" size="sm" style="margin-top:1rem">End Session</VBtn>
          </VCard>

          <!-- Earnings Card -->
          <VCard class="earnings-card-demo" variant="gold">
            <div class="ec-label">Available to Withdraw</div>
            <div class="ec-amount">₹12,480</div>
            <div class="ec-locked">+ ₹3,200 locked (5 days)</div>
            <VBtn variant="primary" size="md" style="margin-top:1.2rem;width:100%">Withdraw to Bank</VBtn>
          </VCard>

        </div>
      </section>

      <!-- ───────── INPUTS ───────── -->
      <section class="ds-section" id="inputs">
        <SectionHeader number="05" title="Inputs" subtitle="Dark themed inputs with gold focus states" />

        <div class="inputs-grid">
          <div class="input-group">
            <VInput label="Full Name" placeholder="Adv. Priya Sharma" />
          </div>
          <div class="input-group">
            <VInput label="Bar Council Number" placeholder="MH/1234/2015" helper="As shown on your certificate" />
          </div>
          <div class="input-group">
            <VInput label="Email Address" type="email" placeholder="priya@example.com" />
          </div>
          <div class="input-group">
            <VInput label="Phone Number" type="tel" placeholder="+91 98765 43210" prefix="+91" />
          </div>
          <div class="input-group">
            <VInput label="Password" type="password" placeholder="Min. 8 characters" />
          </div>
          <div class="input-group">
            <VInput label="Error State" placeholder="Enter amount" :error="'Amount cannot exceed ₹5,000'" model-value="₹9999" />
          </div>
          <div class="input-group">
            <VInput label="Success State" placeholder="Bar number" model-value="MH/5678/2019" :success="true" />
          </div>
          <div class="input-group">
            <VInput label="Disabled" placeholder="Not editable" disabled model-value="Verified ✓" />
          </div>
          <div class="input-group full-width">
            <VTextarea label="Describe Your Legal Problem" placeholder="Tell us what's happening. For example: My landlord is refusing to return my security deposit of ₹50,000 after I vacated the flat..." rows="4" />
          </div>
          <div class="input-group">
            <VSelect label="Specialization" :options="['Family Law','Criminal Defense','Property Law','Corporate Law','Labour Law','Cyber Law','Tax Law','Immigration']" />
          </div>
          <div class="input-group">
            <VSelect label="Experience Tier" :options="['Standard (0–5 yrs)','Experienced (5–10 yrs)','Senior (10–20 yrs)','Expert (20+ yrs)']" />
          </div>
        </div>
      </section>

      <!-- ───────── BADGES ───────── -->
      <section class="ds-section" id="badges">
        <SectionHeader number="06" title="Badges" subtitle="Status indicators, tags, and labels" />

        <div class="component-row">
          <h3 class="component-sub-title">Availability Status</h3>
          <div class="badge-row">
            <VBadge variant="online">● Online</VBadge>
            <VBadge variant="busy">● Busy</VBadge>
            <VBadge variant="offline">● Offline</VBadge>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">Specialization Tags</h3>
          <div class="badge-row">
            <VBadge variant="spec">Family Law</VBadge>
            <VBadge variant="spec">Criminal Defense</VBadge>
            <VBadge variant="spec">Property Law</VBadge>
            <VBadge variant="spec">Corporate Law</VBadge>
            <VBadge variant="spec">Labour Law</VBadge>
            <VBadge variant="spec">Cyber Law</VBadge>
            <VBadge variant="spec">Tax Law</VBadge>
            <VBadge variant="spec">Immigration</VBadge>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">System Badges</h3>
          <div class="badge-row">
            <VBadge variant="verified">✓ Verified</VBadge>
            <VBadge variant="firm">Law Firm</VBadge>
            <VBadge variant="live">● Live</VBadge>
            <VBadge variant="pro">Pro</VBadge>
            <VBadge variant="new">New</VBadge>
            <VBadge variant="pending">Pending Review</VBadge>
            <VBadge variant="success">Payment Received</VBadge>
            <VBadge variant="error">Disputed</VBadge>
            <VBadge variant="warning">Action Needed</VBadge>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">Tier Badges</h3>
          <div class="badge-row">
            <VBadge variant="tier-standard">Standard</VBadge>
            <VBadge variant="tier-experienced">Experienced</VBadge>
            <VBadge variant="tier-senior">Senior</VBadge>
            <VBadge variant="tier-expert">Expert</VBadge>
          </div>
        </div>
      </section>

<!-- ───────── AVATARS ───────── -->
      <section class="ds-section" id="avatars">
        <SectionHeader number="07" title="Avatars" subtitle="User avatars with status indicators" />

        <div class="component-row">
          <h3 class="component-sub-title">Sizes</h3>
          <div class="avatar-row">
            <div class="avatar-demo">
              <VAvatar name="Priya Sharma" status="online" size="24" />
              <span>24px</span>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Rahul Verma" status="busy" size="32" />
              <span>32px</span>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Amit Patel" status="online" size="40" />
              <span>40px (default)</span>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Sunita Roy" status="offline" size="56" />
              <span>56px</span>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Krishna Iyer" status="online" size="72" />
              <span>72px</span>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Meera Law Firm" status="online" size="96" firm />
              <span>96px — Firm</span>
            </div>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">Status States</h3>
          <div class="avatar-row">
            <div class="avatar-demo">
              <VAvatar name="Online User" status="online" size="48" />
              <VBadge variant="online">Online</VBadge>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Busy User" status="busy" size="48" />
              <VBadge variant="busy">Busy</VBadge>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Offline User" status="offline" size="48" />
              <VBadge variant="offline">Offline</VBadge>
            </div>
            <div class="avatar-demo">
              <VAvatar name="Verified Lawyer" status="online" size="48" verified />
              <VBadge variant="verified">Verified</VBadge>
            </div>
          </div>
        </div>

        <div class="component-row">
          <h3 class="component-sub-title">Avatar Group</h3>
          <div class="avatar-group-demo">
            <VAvatar name="Priya S" status="online" size="40" :overlap="true" :index="0" />
            <VAvatar name="Rahul V" status="busy" size="40" :overlap="true" :index="1" />
            <VAvatar name="Amit P" status="online" size="40" :overlap="true" :index="2" />
            <VAvatar name="Sunita R" status="offline" size="40" :overlap="true" :index="3" />
            <div class="avatar-more">+8</div>
          </div>
        </div>
      </section>

      <!-- ───────── SKELETONS ───────── -->
      <section class="ds-section" id="skeletons">
        <SectionHeader number="08" title="Loading Skeletons" subtitle="Animated placeholders for every loading state" />

        <div class="skeletons-grid">
          <!-- Lawyer card skeleton -->
          <VCard class="skeleton-card-demo">
            <div class="sk-header">
              <VSkeleton width="56px" height="56px" radius="50%" />
              <div class="sk-header-text">
                <VSkeleton width="140px" height="16px" />
                <VSkeleton width="100px" height="12px" style="margin-top:6px" />
                <VSkeleton width="80px" height="12px" style="margin-top:4px" />
              </div>
            </div>
            <VSkeleton width="100%" height="1px" style="margin:16px 0" />
            <div class="sk-stats-row">
              <VSkeleton width="40px" height="32px" />
              <VSkeleton width="40px" height="32px" />
              <VSkeleton width="40px" height="32px" />
              <VSkeleton width="40px" height="32px" />
            </div>
            <div class="sk-actions">
              <VSkeleton width="48%" height="36px" radius="8px" />
              <VSkeleton width="48%" height="36px" radius="8px" />
            </div>
          </VCard>

          <!-- Text content skeleton -->
          <VCard class="skeleton-text-demo">
            <VSkeleton width="60%" height="22px" />
            <VSkeleton width="100%" height="14px" style="margin-top:16px" />
            <VSkeleton width="100%" height="14px" style="margin-top:6px" />
            <VSkeleton width="85%" height="14px" style="margin-top:6px" />
            <VSkeleton width="100%" height="14px" style="margin-top:6px" />
            <VSkeleton width="70%" height="14px" style="margin-top:6px" />
          </VCard>

          <!-- List skeleton -->
          <VCard class="skeleton-list-demo">
            <div v-for="i in 4" :key="i" class="sk-list-item">
              <VSkeleton width="36px" height="36px" radius="50%" />
              <div style="flex:1">
                <VSkeleton width="60%" height="13px" />
                <VSkeleton width="40%" height="11px" style="margin-top:5px" />
              </div>
              <VSkeleton width="50px" height="24px" radius="100px" />
            </div>
          </VCard>
        </div>
      </section>

      <!-- ───────── TOASTS ───────── -->
      <section class="ds-section" id="toasts">
        <SectionHeader number="09" title="Toast Notifications" subtitle="Non-blocking feedback messages" />
        <div class="toast-demo-area">
          <VBtn variant="success-btn" size="md" @click="showToast('Payment of ₹480 received successfully', 'success')">Show Success Toast</VBtn>
          <VBtn variant="danger" size="md" @click="showToast('Session ended due to payment timeout', 'error')">Show Error Toast</VBtn>
          <VBtn variant="warning-btn" size="md" @click="showToast('Your time is running out. 2 minutes remaining', 'warning')">Show Warning Toast</VBtn>
          <VBtn variant="info-btn" size="md" @click="showToast('Adv. Priya Sharma has accepted your request', 'info')">Show Info Toast</VBtn>
        </div>
        <div class="toast-static-preview">
          <div class="toast-preview success-toast">
            <span class="toast-icon">✓</span>
            <div class="toast-body">
              <div class="toast-title">Payment Received</div>
              <div class="toast-message">₹480 deposited into your wallet</div>
            </div>
            <button class="toast-close">✕</button>
          </div>
          <div class="toast-preview error-toast">
            <span class="toast-icon">✕</span>
            <div class="toast-body">
              <div class="toast-title">Session Ended</div>
              <div class="toast-message">Payment timeout after 30 seconds</div>
            </div>
            <button class="toast-close">✕</button>
          </div>
          <div class="toast-preview warning-toast">
            <span class="toast-icon">⚠</span>
            <div class="toast-body">
              <div class="toast-title">Time Running Low</div>
              <div class="toast-message">2 minutes left in your session</div>
            </div>
            <button class="toast-close">✕</button>
          </div>
          <div class="toast-preview info-toast">
            <span class="toast-icon">ℹ</span>
            <div class="toast-body">
              <div class="toast-title">Request Accepted</div>
              <div class="toast-message">Adv. Priya Sharma joined the session</div>
            </div>
            <button class="toast-close">✕</button>
          </div>
        </div>
      </section>

      <!-- ───────── BOTTOM NAV ───────── -->
      <section class="ds-section" id="bottomnav">
        <SectionHeader number="10" title="Navigation" subtitle="Bottom nav (app) and top navbar (website)" />

        <div class="component-row">
          <h3 class="component-sub-title">Mobile Bottom Navigation — Client</h3>
          <div class="nav-demo-wrapper">
            <BottomNav role="client" :active="activeClientNav" @change="activeClientNav = $event" />
          </div>
        </div>

        <div class="component-row" style="margin-top:2rem">
          <h3 class="component-sub-title">Mobile Bottom Navigation — Lawyer</h3>
          <div class="nav-demo-wrapper">
            <BottomNav role="lawyer" :active="activeLawyerNav" @change="activeLawyerNav = $event" />
          </div>
        </div>

        <div class="component-row" style="margin-top:2rem">
          <h3 class="component-sub-title">Website Top Navbar</h3>
          <div class="navbar-demo-wrapper">
            <WebNavbar />
          </div>
        </div>
      </section>

      <!-- ───────── SPACING ───────── -->
      <section class="ds-section" id="spacing">
        <SectionHeader number="11" title="Spacing & Radius" subtitle="Consistent spatial rhythm" />
        <div class="spacing-grid">
          <div v-for="s in spacingTokens" :key="s.name" class="spacing-item">
            <div class="spacing-bar" :style="{width: s.px, height: '24px', background: 'var(--gold-500)', borderRadius:'2px'}"></div>
            <span class="spacing-name">{{ s.name }}</span>
            <span class="spacing-val">{{ s.px }}</span>
          </div>
        </div>
        <div class="radius-grid">
          <div v-for="r in radiusTokens" :key="r.name" class="radius-item">
            <div class="radius-box" :style="{borderRadius: r.val}"></div>
            <span class="spacing-name">{{ r.name }}</span>
            <span class="spacing-val">{{ r.val }}</span>
          </div>
        </div>
      </section>

    </main>

    <!-- ───────── TOAST CONTAINER ───────── -->
    <Teleport to="body">
      <div class="toast-container">
        <transition-group name="toast-anim">
          <div v-for="t in toasts" :key="t.id" :class="['toast-live', `toast-live-${t.type}`]">
            <span class="toast-icon">{{ toastIcons[t.type] }}</span>
            <div class="toast-body">
              <div class="toast-title">{{ toastTitles[t.type] }}</div>
              <div class="toast-message">{{ t.message }}</div>
            </div>
            <div class="toast-progress" :style="{animationDuration: '3s'}"></div>
          </div>
        </transition-group>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, h, defineComponent } from 'vue'

// ─── DATA ───
const btnLoading = ref(false)
const activeClientNav = ref('home')
const activeLawyerNav = ref('dashboard')
const toasts = ref([])

const spacingTokens = [
  { name: 'space-1', px: '4px' },
  { name: 'space-2', px: '8px' },
  { name: 'space-3', px: '12px' },
  { name: 'space-4', px: '16px' },
  { name: 'space-5', px: '20px' },
  { name: 'space-6', px: '24px' },
  { name: 'space-8', px: '32px' },
  { name: 'space-10', px: '40px' },
  { name: 'space-12', px: '48px' },
  { name: 'space-16', px: '64px' },
]

const radiusTokens = [
  { name: 'radius-sm', val: '6px' },
  { name: 'radius-md', val: '10px' },
  { name: 'radius-lg', val: '16px' },
  { name: 'radius-xl', val: '24px' },
  { name: 'radius-2xl', val: '32px' },
  { name: 'radius-full', val: '9999px' },
]

const toastIcons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }
const toastTitles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' }

// ─── TOAST ───
function showToast(message, type = 'info') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3200)
}

// ─── AVATAR COLORS ───
function getAvatarColor(name) {
  const colors = ['#C9A84C','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
  let hash = 0
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length
  return colors[hash]
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<!-- ════════════════════════════════════════════════
     CHILD COMPONENTS (defined inline via script)
═══════════════════════════════════════════════════ -->

<script>
// ─── VAKILR LOGO ───
const VakilrLogo = {
  props: { size: { default: 'medium' }, inverted: Boolean },
  setup(props) {
    const sizes = { small: 28, medium: 40, large: 64 }
    const h_val = sizes[props.size] || 40
    return () => h('div', {
      style: { display:'flex', alignItems:'center', gap: h_val * 0.25 + 'px', cursor:'default' }
    }, [
      // BAAD MEIN (image wala)
h('img', {
  src: '/src/assets/logo.png',
  style: { height: h_val + 'px', width: 'auto' }
}),
      h('span', {
        style: {
          fontFamily: '"Playfair Display", serif',
          fontWeight: 900,
          fontSize: h_val * 0.65 + 'px',
          color: props.inverted ? '#0A0F2C' : '#C9A84C',
          fontStyle: 'italic',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }
      }, 'Vakilr')
    ])
  }
}

// ─── VAKILR ICON (SVG scales of justice) ───
const VakilrIcon = {
  props: { size: { default: '40' } },
  setup(props) {
    const s = Number(props.size)
    return () => h('svg', {
      width: s, height: s,
      viewBox: '0 0 100 100',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      // Outer ring
      h('circle', { cx:50, cy:50, r:46, stroke:'#C9A84C', 'stroke-width':3, 'stroke-opacity':0.3 }),
      // Center pillar
      h('rect', { x:48, y:22, width:4, height:56, rx:2, fill:'#C9A84C' }),
      // Top beam
      h('rect', { x:20, y:28, width:60, height:4, rx:2, fill:'#C9A84C' }),
      // Base
      h('rect', { x:32, y:74, width:36, height:4, rx:2, fill:'#C9A84C' }),
      h('rect', { x:38, y:70, width:24, height:4, rx:2, fill:'#C9A84C', opacity:0.6 }),
      // Left pan chain
      h('line', { x1:26, y1:32, x2:20, y2:50, stroke:'#C9A84C', 'stroke-width':2, opacity:0.7 }),
      h('line', { x1:26, y1:32, x2:32, y2:50, stroke:'#C9A84C', 'stroke-width':2, opacity:0.7 }),
      // Left pan
      h('path', { d:'M18 50 Q26 58 34 50', stroke:'#C9A84C', 'stroke-width':2.5, fill:'none', 'stroke-linecap':'round' }),
      // Right pan chain
      h('line', { x1:74, y1:32, x2:68, y2:50, stroke:'#C9A84C', 'stroke-width':2, opacity:0.7 }),
      h('line', { x1:74, y1:32, x2:80, y2:50, stroke:'#C9A84C', 'stroke-width':2, opacity:0.7 }),
      // Right pan
      h('path', { d:'M66 50 Q74 58 82 50', stroke:'#C9A84C', 'stroke-width':2.5, fill:'none', 'stroke-linecap':'round' }),
      // Center dot
      h('circle', { cx:50, cy:28, r:4, fill:'#C9A84C' }),
    ])
  }
}

// ─── SECTION HEADER ───
const SectionHeader = {
  props: ['number','title','subtitle'],
  setup(props) {
    return () => h('div', { style: { marginBottom:'2.5rem' } }, [
      h('div', { style: { display:'flex', alignItems:'baseline', gap:'1rem', marginBottom:'0.5rem' } }, [
        h('span', { style: { fontFamily:'"DM Sans"', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.15em', color:'#C9A84C', textTransform:'uppercase' } }, `§ ${props.number}`),
        h('h2', { style: { fontFamily:'"Playfair Display", serif', fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:700, color:'#f0f4ff', lineHeight:1.2 } }, props.title),
      ]),
      h('p', { style: { color:'#8892b0', fontFamily:'"DM Sans"', fontSize:'1rem', marginLeft:'3rem' } }, props.subtitle),
      h('div', { style: { width:'60px', height:'2px', background:'linear-gradient(90deg,#C9A84C,transparent)', marginLeft:'3rem', marginTop:'0.75rem' } })
    ])
  }
}

// ─── COLOR SWATCH ───
const ColorSwatch = {
  props: ['name','hex','var','label','dark'],
  setup(props) {
    return () => h('div', { style:{ display:'flex', flexDirection:'column', gap:'0.5rem' } }, [
      h('div', {
        style: {
          width:'100%', height:'64px', borderRadius:'10px',
          background: props.hex,
          border: '1px solid rgba(255,255,255,0.07)',
          position:'relative', overflow:'hidden'
        }
      }, [
        props.label ? h('span', { style:{ position:'absolute', top:'6px', right:'8px', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color: props.dark ? '#0A0F2C' : 'rgba(255,255,255,0.6)', background: props.dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', padding:'2px 6px', borderRadius:'4px' } }, props.label) : null,
      ]),
      h('div', [
        h('p', { style:{ fontSize:'0.8rem', fontWeight:600, color:'#f0f4ff', fontFamily:'"DM Sans"' } }, props.name),
        h('p', { style:{ fontSize:'0.72rem', color:'#8892b0', fontFamily:'"DM Sans"' } }, props.hex),
        h('p', { style:{ fontSize:'0.7rem', color:'#4a5578', fontFamily:'"DM Sans"', fontStyle:'italic' } }, props.var),
      ])
    ])
  }
}

// ─── BUTTON ───
const VBtn = {
  props: {
    variant: { default: 'primary' },
    size: { default: 'md' },
    loading: Boolean,
    disabled: Boolean,
    icon: Boolean,
    full: Boolean,
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    const styles = {
      primary:      { bg:'#C9A84C', color:'#0A0F2C', border:'none', hover:'#e0b84a', shadow:'0 0 24px rgba(201,168,76,0.35)' },
      secondary:    { bg:'transparent', color:'#C9A84C', border:'1px solid #C9A84C', hover:'rgba(201,168,76,0.08)', shadow:'none' },
      ghost:        { bg:'transparent', color:'#8892b0', border:'1px solid rgba(255,255,255,0.1)', hover:'rgba(255,255,255,0.05)', shadow:'none' },
      danger:       { bg:'rgba(239,68,68,0.12)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)', hover:'rgba(239,68,68,0.2)', shadow:'none' },
      'success-btn':{ bg:'rgba(16,185,129,0.12)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)', hover:'rgba(16,185,129,0.2)', shadow:'none' },
      'warning-btn':{ bg:'rgba(245,158,11,0.12)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)', hover:'rgba(245,158,11,0.2)', shadow:'none' },
      'info-btn':   { bg:'rgba(59,130,246,0.12)', color:'#3b82f6', border:'1px solid rgba(59,130,246,0.3)', hover:'rgba(59,130,246,0.2)', shadow:'none' },
    }
    const sizes = {
      sm: { padding:'0.4rem 1rem', fontSize:'0.8rem', borderRadius:'8px', height:'34px' },
      md: { padding:'0.6rem 1.4rem', fontSize:'0.9rem', borderRadius:'10px', height:'42px' },
      lg: { padding:'0.8rem 2rem', fontSize:'1rem', borderRadius:'12px', height:'52px' },
    }
    const s = styles[props.variant] || styles.primary
    const sz = sizes[props.size] || sizes.md

    return () => h('button', {
      disabled: props.disabled || props.loading,
      onClick: (e) => emit('click', e),
      style: {
        display: 'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
        background: s.bg,
        color: s.color,
        border: s.border,
        padding: props.icon ? '0' : sz.padding,
        fontSize: sz.fontSize,
        fontFamily:'"DM Sans", sans-serif',
        fontWeight: 600,
        borderRadius: props.icon ? '50%' : sz.borderRadius,
        height: sz.height,
        width: props.icon ? sz.height : (props.full ? '100%' : 'auto'),
        cursor: (props.disabled || props.loading) ? 'not-allowed' : 'pointer',
        opacity: (props.disabled || props.loading) ? 0.45 : 1,
        transition: 'all 0.2s ease',
        boxShadow: props.variant === 'primary' && !props.disabled ? s.shadow : 'none',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }
    }, props.loading
      ? [h('span', { style:{display:'inline-block', width:'14px', height:'14px', border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.6s linear infinite'} }), 'Loading...']
      : slots.default?.()
    )
  }
}

// ─── CARD ───
const VCard = {
  props: { hoverable: Boolean, variant: String },
  setup(props, { slots }) {
    const isGold = props.variant === 'gold'
    return () => h('div', {
      style: {
        background: isGold
          ? 'linear-gradient(135deg, #1a1400 0%, #2a1f00 50%, #1a1400 100%)'
          : 'linear-gradient(135deg, rgba(22,29,63,0.95) 0%, rgba(18,24,48,0.95) 100%)',
        border: isGold ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '1.25rem',
        backdropFilter: 'blur(12px)',
        transition: props.hoverable ? 'transform 0.2s, box-shadow 0.2s' : 'none',
        boxShadow: isGold
          ? '0 8px 32px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.1)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        position:'relative', overflow:'hidden',
      }
    }, slots.default?.())
  }
}

// ─── INPUT ───
const VInput = {
  props: { label:String, placeholder:String, type:{default:'text'}, helper:String, error:String, success:Boolean, disabled:Boolean, prefix:String, modelValue:String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const focused = { value: false }
    return () => h('div', { style:{ display:'flex', flexDirection:'column', gap:'0.4rem', width:'100%' } }, [
      props.label ? h('label', { style:{ fontSize:'0.8rem', fontWeight:600, color:'#8892b0', fontFamily:'"DM Sans"', letterSpacing:'0.05em', textTransform:'uppercase' } }, props.label) : null,
      h('div', { style:{ position:'relative', display:'flex', alignItems:'center' } }, [
        props.prefix ? h('span', { style:{ position:'absolute', left:'14px', color:'#8892b0', fontFamily:'"DM Sans"', fontSize:'0.9rem', pointerEvents:'none' } }, props.prefix) : null,
        h('input', {
          type: props.type,
          placeholder: props.placeholder,
          disabled: props.disabled,
          value: props.modelValue,
          onInput: (e) => emit('update:modelValue', e.target.value),
          style: {
            width:'100%', height:'44px',
            background:'rgba(10,15,44,0.8)',
            border: props.error ? '1.5px solid #ef4444' : props.success ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.1)',
            borderRadius:'10px', color:'#f0f4ff',
            fontFamily:'"DM Sans"', fontSize:'0.9rem',
            padding: props.prefix ? '0 14px 0 44px' : '0 14px',
            outline:'none', transition:'border-color 0.2s',
            opacity: props.disabled ? 0.5 : 1,
            cursor: props.disabled ? 'not-allowed' : 'text',
          }
        }),
        props.success ? h('span', { style:{ position:'absolute', right:'12px', color:'#10b981', fontSize:'1rem' } }, '✓') : null,
        props.error ? h('span', { style:{ position:'absolute', right:'12px', color:'#ef4444', fontSize:'1rem' } }, '!') : null,
      ]),
      props.error ? h('p', { style:{ fontSize:'0.75rem', color:'#ef4444', fontFamily:'"DM Sans"' } }, props.error) : null,
      props.helper && !props.error ? h('p', { style:{ fontSize:'0.75rem', color:'#4a5578', fontFamily:'"DM Sans"' } }, props.helper) : null,
    ])
  }
}

// ─── TEXTAREA ───
const VTextarea = {
  props: { label:String, placeholder:String, rows:{default:3}, modelValue:String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { style:{ display:'flex', flexDirection:'column', gap:'0.4rem', width:'100%' } }, [
      props.label ? h('label', { style:{ fontSize:'0.8rem', fontWeight:600, color:'#8892b0', fontFamily:'"DM Sans"', letterSpacing:'0.05em', textTransform:'uppercase' } }, props.label) : null,
      h('textarea', {
        placeholder: props.placeholder,
        rows: props.rows,
        value: props.modelValue,
        onInput: (e) => emit('update:modelValue', e.target.value),
        style: {
          width:'100%', minHeight: props.rows * 28 + 'px',
          background:'rgba(10,15,44,0.8)',
          border:'1.5px solid rgba(255,255,255,0.1)',
          borderRadius:'10px', color:'#f0f4ff',
          fontFamily:'"DM Sans"', fontSize:'0.9rem',
          padding:'12px 14px',
          outline:'none', resize:'vertical', transition:'border-color 0.2s',
        }
      })
    ])
  }
}

// ─── SELECT ───
const VSelect = {
  props: { label:String, options:{ default: () => [] }, modelValue:String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { style:{ display:'flex', flexDirection:'column', gap:'0.4rem', width:'100%' } }, [
      props.label ? h('label', { style:{ fontSize:'0.8rem', fontWeight:600, color:'#8892b0', fontFamily:'"DM Sans"', letterSpacing:'0.05em', textTransform:'uppercase' } }, props.label) : null,
      h('select', {
        onChange: (e) => emit('update:modelValue', e.target.value),
        style: {
          width:'100%', height:'44px',
          background:'rgba(10,15,44,0.8)',
          border:'1.5px solid rgba(255,255,255,0.1)',
          borderRadius:'10px', color:'#f0f4ff',
          fontFamily:'"DM Sans"', fontSize:'0.9rem',
          padding:'0 14px',
          outline:'none', cursor:'pointer',
          appearance:'none',
        }
      }, [
        h('option', { value:'', style:{ background:'#0A0F2C' } }, '— Select —'),
        ...props.options.map(o => h('option', { value:o, style:{ background:'#0A0F2C' } }, o))
      ])
    ])
  }
}

// ─── BADGE ───
const VBadge = {
  props: { variant: { default: 'spec' } },
  setup(props, { slots }) {
    const styles = {
      online:           { bg:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)' },
      busy:             { bg:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)' },
      offline:          { bg:'rgba(100,116,139,0.15)', color:'#64748b', border:'1px solid rgba(100,116,139,0.3)' },
      spec:             { bg:'rgba(201,168,76,0.1)', color:'#C9A84C', border:'1px solid rgba(201,168,76,0.25)' },
      verified:         { bg:'rgba(16,185,129,0.1)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)' },
      firm:             { bg:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)' },
      live:             { bg:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)' },
      pro:              { bg:'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(224,184,74,0.1))', color:'#C9A84C', border:'1px solid rgba(201,168,76,0.4)' },
      new:              { bg:'rgba(59,130,246,0.15)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.3)' },
      pending:          { bg:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.25)' },
      success:          { bg:'rgba(16,185,129,0.12)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)' },
      error:            { bg:'rgba(239,68,68,0.12)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.25)' },
      warning:          { bg:'rgba(245,158,11,0.12)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.25)' },
      'tier-standard':  { bg:'rgba(100,116,139,0.15)', color:'#94a3b8', border:'1px solid rgba(100,116,139,0.3)' },
      'tier-experienced':{ bg:'rgba(59,130,246,0.15)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.3)' },
      'tier-senior':    { bg:'rgba(201,168,76,0.15)', color:'#C9A84C', border:'1px solid rgba(201,168,76,0.3)' },
      'tier-expert':    { bg:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' },
    }
    const s = styles[props.variant] || styles.spec
    return () => h('span', {
      style: {
        display:'inline-flex', alignItems:'center', gap:'0.2em',
        padding:'0.25rem 0.7rem',
        borderRadius:'100px',
        fontSize:'0.75rem', fontWeight:600,
        fontFamily:'"DM Sans", sans-serif',
        letterSpacing:'0.02em',
        background: s.bg, color: s.color, border: s.border,
        whiteSpace:'nowrap',
      }
    }, slots.default?.())
  }
}

// ─── AVATAR ───
const VAvatar = {
  props: { name:{default:'User'}, status:{default:'offline'}, size:{default:'40'}, verified:Boolean, firm:Boolean, overlap:Boolean, index:{default:0} },
  setup(props) {
    function getColor(name) {
      const c=['#C9A84C','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
      let h=0; for(let ch of name) h=(h*31+ch.charCodeAt(0))%c.length
      return c[h]
    }
    function getInitials(name) {
      return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
    }
    const statusColors = { online:'#10b981', busy:'#f59e0b', offline:'#64748b' }
    const s = Number(props.size)
    const dotSize = Math.max(8, s * 0.22)

    return () => h('div', {
      style: {
        position:'relative', display:'inline-flex',
        marginLeft: props.overlap && props.index > 0 ? '-10px' : '0',
        zIndex: props.overlap ? 10 - props.index : 'auto',
      }
    }, [
      h('div', {
        style: {
          width: s+'px', height: s+'px', borderRadius:'50%',
          background: `linear-gradient(135deg, ${getColor(props.name)}, ${getColor(props.name + '1')})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: (s * 0.36)+'px', fontWeight:700,
          fontFamily:'"DM Sans"', color:'#fff',
          border: props.overlap ? '2px solid var(--navy-900)' : '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          letterSpacing:'-0.02em',
          userSelect:'none',
        }
      }, [
        props.firm
          ? h('span', { style:{fontSize:(s*0.4)+'px'} }, '⚖️')
          : getInitials(props.name)
      ]),
      h('div', {
        style: {
          position:'absolute', bottom:'0', right:'0',
          width:dotSize+'px', height:dotSize+'px', borderRadius:'50%',
          background: statusColors[props.status] || statusColors.offline,
          border: '2px solid var(--navy-900)',
          boxShadow: `0 0 ${dotSize}px ${statusColors[props.status] || statusColors.offline}`,
        }
      }),
      props.verified ? h('div', {
        style: {
          position:'absolute', top:'-2px', right:'-2px',
          width:(dotSize*1.2)+'px', height:(dotSize*1.2)+'px', borderRadius:'50%',
          background:'#10b981', border:'2px solid var(--navy-900)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:(dotSize*0.6)+'px', color:'#fff',
        }
      }, '✓') : null
    ])
  }
}

// ─── SKELETON ───
const VSkeleton = {
  props: { width:{default:'100%'}, height:{default:'16px'}, radius:{default:'6px'} },
  setup(props) {
    return () => h('div', {
      style: {
        width: props.width, height: props.height,
        borderRadius: props.radius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.6s infinite',
        display:'block',
      }
    })
  }
}

// ─── BOTTOM NAV ───
const BottomNav = {
  props: { role:{default:'client'}, active:{default:'home'} },
  emits: ['change'],
  setup(props, { emit }) {
    const clientItems = [
      { id:'home', icon:'🏠', label:'Home' },
      { id:'browse', icon:'🔍', label:'Browse' },
      { id:'ai', icon:'✨', label:'AI Guide' },
      { id:'sessions', icon:'⏱', label:'Sessions' },
      { id:'profile', icon:'👤', label:'Profile' },
    ]
    const lawyerItems = [
      { id:'dashboard', icon:'📊', label:'Dashboard' },
      { id:'requests', icon:'📥', label:'Requests' },
      { id:'sessions', icon:'⚖️', label:'Sessions' },
      { id:'wallet', icon:'💰', label:'Wallet' },
      { id:'profile', icon:'👤', label:'Profile' },
    ]
    const items = props.role === 'lawyer' ? lawyerItems : clientItems
    return () => h('div', {
      style: {
        display:'flex', alignItems:'center', justifyContent:'space-around',
        background:'rgba(10,13,32,0.97)',
        backdropFilter:'blur(20px)',
        borderTop:'1px solid rgba(255,255,255,0.08)',
        padding:'0.6rem 0',
        borderRadius:'0 0 16px 16px',
      }
    }, items.map(item =>
      h('button', {
        key: item.id,
        onClick: () => emit('change', item.id),
        style: {
          display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
          padding:'6px 12px', border:'none',
          background: props.active === item.id ? 'rgba(201,168,76,0.12)' : 'transparent',
          borderRadius:'12px', cursor:'pointer',
          transition:'all 0.2s',
          minWidth:'56px',
        }
      }, [
        h('span', { style:{fontSize:'1.2rem', filter: props.active===item.id ? 'none' : 'grayscale(60%) opacity(0.5)'} }, item.icon),
        h('span', {
          style: {
            fontSize:'0.65rem', fontFamily:'"DM Sans"', fontWeight:600,
            color: props.active === item.id ? '#C9A84C' : '#4a5578',
            letterSpacing:'0.03em',
          }
        }, item.label)
      ])
    ))
  }
}

// ─── WEB NAVBAR ───
const WebNavbar = {
  setup() {
    const open = { value: false }
    return () => h('nav', {
      style: {
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 2rem', height:'64px',
        background:'rgba(10,13,32,0.95)',
        backdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:'12px',
      }
    }, [
      h(VakilrLogo, { size:'medium' }),
      h('div', { style:{display:'flex', gap:'2rem'} }, [
        ['Find a Lawyer','For Lawyers','For Firms','Pricing'].map(link =>
          h('a', { href:'#', key:link, style:{color:'#8892b0', textDecoration:'none', fontFamily:'"DM Sans"', fontSize:'0.9rem', fontWeight:500, transition:'color 0.2s'} }, link)
        )
      ]),
      h('div', { style:{display:'flex', gap:'0.75rem', alignItems:'center'} }, [
        h(VBtn, { variant:'ghost', size:'sm' }, { default: () => 'Log In' }),
        h(VBtn, { variant:'primary', size:'sm' }, { default: () => 'Get Started →' }),
      ])
    ])
  }
}

export default {
  components: { VakilrLogo, VakilrIcon, SectionHeader, ColorSwatch, VBtn, VCard, VInput, VTextarea, VSelect, VBadge, VAvatar, VSkeleton, BottomNav, WebNavbar },
  data() {
    return {
      btnLoading: false,
      activeClientNav: 'home',
      activeLawyerNav: 'dashboard',
      toasts: [],
      spacingTokens: [
        {name:'space-1',px:'4px'},{name:'space-2',px:'8px'},{name:'space-3',px:'12px'},
        {name:'space-4',px:'16px'},{name:'space-5',px:'20px'},{name:'space-6',px:'24px'},
        {name:'space-8',px:'32px'},{name:'space-10',px:'40px'},{name:'space-12',px:'48px'},{name:'space-16',px:'64px'},
      ],
      radiusTokens: [
        {name:'radius-sm',val:'6px'},{name:'radius-md',val:'10px'},{name:'radius-lg',val:'16px'},
        {name:'radius-xl',val:'24px'},{name:'radius-2xl',val:'32px'},{name:'radius-full',val:'9999px'},
      ],
      toastIcons: { success:'✓', error:'✕', warning:'⚠', info:'ℹ' },
      toastTitles: { success:'Success', error:'Error', warning:'Warning', info:'Info' },
    }
  },
  methods: {
    showToast(message, type='info') {
      const id = Date.now()
      this.toasts.push({ id, message, type })
      setTimeout(() => { this.toasts = this.toasts.filter(t=>t.id!==id) }, 3200)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy-950: #04071a; --navy-900: #0A0F2C; --navy-800: #0d1538;
  --navy-700: #111d4a; --navy-600: #1a2d6b;
  --surface: #121830; --card: #161d3f;
  --gold-300: #f0d080; --gold-400: #e0b84a; --gold-500: #C9A84C; --gold-600: #a8882a;
  --text-primary: #f0f4ff; --text-secondary: #8892b0; --text-muted: #4a5578;
  --success: #10b981; --error: #ef4444; --warning: #f59e0b; --info: #3b82f6;
}

html, body { background: var(--navy-900); color: var(--text-primary); font-family: 'DM Sans', sans-serif; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--navy-900); }
::-webkit-scrollbar-thumb { background: var(--gold-500); border-radius: 2px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
@keyframes toast-in {
  from { opacity:0; transform: translateX(100%); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes toast-out {
  from { opacity:1; transform: translateX(0); }
  to   { opacity:0; transform: translateX(100%); }
}
@keyframes progress {
  from { width: 100%; }
  to   { width: 0%; }
}

.ds-root {
  min-height: 100vh;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 90% 80%, rgba(59,130,246,0.05) 0%, transparent 60%),
              var(--navy-900);
  position: relative;
}

.grain {
  position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* TOP NAV */
.top-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10,15,44,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.nav-inner {
  max-width: 1400px; margin: 0 auto;
  display: flex; align-items: center; gap: 2rem;
  padding: 0.8rem 2rem;
}
.nav-links {
  display: flex; gap: 1.5rem; flex: 1; overflow-x: auto;
  scrollbar-width: none;
}
.nav-links::-webkit-scrollbar { display: none; }
.nav-links a {
  color: var(--text-muted); text-decoration: none; font-size: 0.82rem;
  font-family: 'DM Sans', sans-serif; font-weight: 500;
  white-space: nowrap; transition: color 0.2s; letter-spacing: 0.03em;
}
.nav-links a:hover { color: var(--gold-500); }
.nav-cta {
  background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3);
  color: var(--gold-500); padding: 0.4rem 1rem; border-radius: 8px;
  font-size: 0.8rem; font-family: 'DM Sans', sans-serif; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: all 0.2s;
}
.nav-cta:hover { background: rgba(201,168,76,0.2); }

/* HERO */
.ds-main { max-width: 1400px; margin: 0 auto; padding: 0 2rem 6rem; position: relative; z-index: 1; }

.ds-hero {
  position: relative; padding: 5rem 2rem 4rem;
  display: flex; align-items: center; justify-content: space-between;
  gap: 3rem; overflow: hidden; margin: 0 -2rem;
}
.hero-glow {
  position: absolute; width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
  top: -200px; left: -100px; pointer-events: none;
}
.hero-glow-2 {
  background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
  top: auto; left: auto; bottom: -200px; right: -100px;
}
.hero-content { flex: 1; max-width: 640px; }
.hero-eyebrow {
  display: inline-block; background: rgba(201,168,76,0.12);
  border: 1px solid rgba(201,168,76,0.25); color: var(--gold-500);
  padding: 0.3rem 1rem; border-radius: 100px;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  font-family: 'DM Sans', sans-serif; margin-bottom: 1.5rem;
}
.hero-title {
  font-family: 'Playfair Display', serif; font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 900; line-height: 1.05; color: var(--text-primary); margin-bottom: 1rem;
}
.hero-title em { color: var(--gold-500); font-style: italic; }
.hero-sub { color: var(--text-secondary); font-size: 1.1rem; line-height: 1.7; margin-bottom: 2.5rem; }
.hero-stats { display: flex; align-items: center; gap: 2rem; }
.stat { display: flex; flex-direction: column; }
.stat-num { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; color: var(--gold-500); }
.stat-label { font-size: 0.75rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.08em; }
.stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
.hero-logo-large { flex-shrink: 0; animation: float 4s ease-in-out infinite; }

/* SECTIONS */
.ds-section {
  padding: 4rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

/* LOGO */
.logo-showcase {
  display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: flex-end;
}
.logo-card {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  padding: 2rem 2.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.07);
}
.dark-bg { background: rgba(10,15,44,0.8); }
.light-bg { background: #f0f4ff; }
.icon-only { padding: 2rem; }
.logo-label { font-size: 0.72rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }

/* COLORS */
.color-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1.5rem;
}

/* TYPOGRAPHY */
.type-showcase { display: flex; flex-direction: column; gap: 0; }
.type-row {
  display: flex; align-items: baseline; gap: 2rem;
  padding: 1.25rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);
}
.type-meta {
  font-size: 0.7rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif;
  width: 240px; flex-shrink: 0; padding-top: 0.2rem;
}
.t-display { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; color: var(--text-primary); line-height: 1; }
.t-h1 { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700; color: var(--text-primary); }
.t-h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 600; color: var(--text-primary); }
.t-h3 { font-family: 'DM Sans', sans-serif; font-size: 1.2rem; font-weight: 600; color: var(--text-primary); }
.t-body-lg { font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 400; color: var(--text-secondary); line-height: 1.7; max-width: 600px; }
.t-body { font-family: 'DM Sans', sans-serif; font-size: 0.92rem; font-weight: 400; color: var(--text-secondary); line-height: 1.7; max-width: 600px; }
.t-caption { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: var(--text-muted); }
.t-label { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-500); }
.t-gold-italic { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; font-style: italic; color: var(--gold-500); }
.gold-text-row { background: rgba(201,168,76,0.04); border-radius: 8px; padding: 1.25rem; }

/* BUTTONS */
.component-row { margin-bottom: 2.5rem; }
.component-sub-title {
  font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);
  margin-bottom: 1.25rem;
}
.btn-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
.btn-icon { font-style: normal; }

/* CARDS */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }

.lawyer-card-top { display: flex; gap: 0.85rem; margin-bottom: 1rem; }
.lawyer-card-info { flex: 1; }
.lawyer-name { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.3rem; }
.lawyer-spec { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.3rem; }
.lawyer-meta { font-size: 0.75rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }
.lawyer-rate { text-align: right; }
.rate-amount { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--gold-500); }
.rate-unit { font-size: 0.75rem; color: var(--text-muted); }
.lawyer-card-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin: 0.75rem 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 0; }
.lcs { text-align: center; }
.lcs-val { display: block; font-weight: 700; font-size: 0.9rem; color: var(--text-primary); font-family: 'DM Sans', sans-serif; }
.lcs-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.lawyer-card-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

.stat-card-demo { text-align: center; }
.stat-card-icon { font-size: 2rem; margin-bottom: 0.75rem; }
.stat-card-val { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: var(--gold-500); }
.stat-card-label { font-size: 0.82rem; color: var(--text-secondary); font-family: 'DM Sans', sans-serif; margin-top: 0.25rem; }
.stat-card-change { font-size: 0.75rem; margin-top: 0.5rem; }
.stat-card-change.positive { color: var(--success); }

.service-card-demo { text-align: center; cursor: pointer; }
.service-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.service-name { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1rem; color: var(--text-primary); }
.service-price { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: var(--gold-500); margin: 0.25rem 0; }
.service-price span { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: var(--text-muted); font-weight: 400; }
.service-desc { font-size: 0.8rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; line-height: 1.5; }

.firm-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.firm-logo { font-size: 2rem; }
.firm-name { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
.firm-location { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem; }
.firm-specs { display: flex; flex-wrap: wrap; gap: 0.3rem; margin: 0.75rem 0; }
.firm-team { font-size: 0.78rem; color: var(--text-secondary); font-family: 'DM Sans', sans-serif; margin-top: 0.5rem; }

.session-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.session-timer { font-family: 'DM Sans', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.session-lawyer { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.session-lawyer-name { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); font-family: 'DM Sans', sans-serif; }
.session-type { font-size: 0.75rem; color: var(--text-muted); }
.session-cost { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(10,15,44,0.6); border-radius: 8px; }
.session-cost-label { font-size: 0.78rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }
.session-cost-val { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--gold-500); }

.ec-label { font-size: 0.8rem; color: var(--gold-400); font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
.ec-amount { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 900; color: var(--gold-300); }
.ec-locked { font-size: 0.78rem; color: rgba(201,168,76,0.5); font-family: 'DM Sans', sans-serif; margin-top: 0.25rem; }

/* INPUTS */
.inputs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.input-group {}
.input-group.full-width { grid-column: 1/-1; }
input, textarea, select { color-scheme: dark; }
input:focus, textarea:focus, select:focus {
  border-color: var(--gold-500) !important;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
}

/* BADGES */
.badge-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }

/* AVATARS */
.avatar-row { display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: flex-end; }
.avatar-demo { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.avatar-demo span { font-size: 0.72rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }
.avatar-group-demo { display: flex; align-items: center; }
.avatar-more {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(201,168,76,0.15); border: 2px solid var(--navy-900);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; color: var(--gold-500);
  font-family: 'DM Sans', sans-serif; margin-left: -10px;
}

/* SKELETONS */
.skeletons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.sk-header { display: flex; gap: 0.85rem; align-items: flex-start; }
.sk-header-text { flex: 1; }
.sk-stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.5rem; }
.sk-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.sk-list-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }

/* TOASTS */
.toast-demo-area { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem; }
.toast-static-preview { display: flex; flex-direction: column; gap: 0.75rem; max-width: 400px; }
.toast-preview {
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 0.875rem 1rem; border-radius: 12px; position: relative; overflow: hidden;
}
.success-toast { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); }
.error-toast   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.25); }
.warning-toast { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); }
.info-toast    { background: rgba(59,130,246,0.1);  border: 1px solid rgba(59,130,246,0.25); }
.toast-icon { font-size: 0.9rem; font-weight: 700; margin-top: 1px; }
.success-toast .toast-icon { color: #10b981; }
.error-toast .toast-icon   { color: #ef4444; }
.warning-toast .toast-icon { color: #f59e0b; }
.info-toast .toast-icon    { color: #3b82f6; }
.toast-body { flex: 1; }
.toast-title { font-weight: 700; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; color: var(--text-primary); }
.toast-message { font-size: 0.78rem; color: var(--text-secondary); font-family: 'DM Sans', sans-serif; margin-top: 2px; }
.toast-close { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.75rem; padding: 2px; }

/* LIVE TOAST CONTAINER */
.toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 0.6rem; }
.toast-live {
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 0.875rem 1rem; border-radius: 12px;
  min-width: 300px; max-width: 380px; position: relative; overflow: hidden;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: toast-in 0.3s ease;
}
.toast-live-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); }
.toast-live-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.3); }
.toast-live-warning { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); }
.toast-live-info    { background: rgba(59,130,246,0.15);  border: 1px solid rgba(59,130,246,0.3); }
.toast-live .toast-icon { font-size: 0.9rem; font-weight: 700; margin-top: 2px; }
.toast-live-success .toast-icon { color: #10b981; }
.toast-live-error .toast-icon   { color: #ef4444; }
.toast-live-warning .toast-icon { color: #f59e0b; }
.toast-live-info .toast-icon    { color: #3b82f6; }
.toast-progress {
  position: absolute; bottom: 0; left: 0; height: 2px;
  background: currentColor; opacity: 0.4;
  animation: progress linear forwards;
}
.toast-anim-enter-active { animation: toast-in 0.3s ease; }
.toast-anim-leave-active { animation: toast-out 0.2s ease; }

/* BOTTOM NAV */
.nav-demo-wrapper {
  background: var(--navy-950); border-radius: 16px;
  overflow: hidden; max-width: 420px;
  border: 1px solid rgba(255,255,255,0.07);
}
.navbar-demo-wrapper {
  background: var(--navy-950); border-radius: 12px; overflow: hidden;
}

/* SPACING */
.spacing-grid { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
.spacing-item { display: flex; align-items: center; gap: 1.5rem; }
.spacing-name { font-size: 0.78rem; font-family: 'DM Sans', sans-serif; color: var(--text-secondary); width: 90px; }
.spacing-val { font-size: 0.75rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }
.radius-grid { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.radius-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.radius-box { width: 60px; height: 60px; background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); }

@media (max-width: 768px) {
  .ds-hero { flex-direction: column; padding: 3rem 1rem 2rem; }
  .hero-logo-large { display: none; }
  .type-row { flex-direction: column; gap: 0.5rem; }
  .type-meta { width: auto; }
  .nav-links { display: none; }
}
</style>

