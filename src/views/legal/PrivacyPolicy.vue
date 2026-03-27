<template>
  <div class="legal-page">
    <div class="legal-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1>Privacy Policy</h1>
    </div>
    <div class="legal-content">
      <p class="effective">Effective: January 1, 2025 · Last updated: March 2025</p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>Vakilr collects information you provide when you register: name, email address, phone number, and for lawyers, professional credentials including Bar Council registration number. We also collect usage data to improve our services.</p>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>Your information is used to provide legal marketplace services, verify lawyer credentials, process payments, and communicate important service updates. We do not sell your personal data to third parties.</p>
      </section>

      <section>
        <h2>3. Data Security</h2>
        <p>All data is encrypted in transit and at rest. Session communications between clients and lawyers are secured. Payment information is processed through secured payment gateways and never stored on our servers.</p>
      </section>

      <section>
        <h2>4. Session Recordings & Confidentiality</h2>
        <p>Vakilr does not record voice or video sessions. Chat transcripts are stored for dispute resolution purposes only and are deleted after 90 days unless a dispute is active. All client-lawyer communications are treated as confidential.</p>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us at privacy@vakilr.com. Account deletion requests are processed within 30 days.</p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>We use essential cookies only — for authentication and security. We do not use advertising or tracking cookies.</p>
      </section>

      <section>
        <h2>7. Contact</h2>
        <p>For privacy concerns: privacy@vakilr.com<br>Vakilr Technologies Pvt. Ltd., India</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.legal-page { min-height: 100vh; background: #04071a; padding-bottom: 40px; }
.legal-header { display: flex; align-items: center; gap: 14px; padding: 3rem 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.back-btn { color: #C9A84C; font-size: 1.4rem; background: none; border: none; cursor: pointer; }
.legal-header h1 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #f0f4ff; margin: 0; }
.legal-content { padding: 1.5rem; max-width: 700px; }
.effective { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: rgba(240,244,255,0.35); margin: 0 0 2rem; }
section { margin-bottom: 1.8rem; }
h2 { font-family: 'Playfair Display', serif; font-size: 1rem; color: #C9A84C; margin: 0 0 10px; }
p { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: rgba(240,244,255,0.65); line-height: 1.7; margin: 0; }
</style>