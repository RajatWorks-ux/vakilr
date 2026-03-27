<template>
  <div class="legal-page">
    <div class="legal-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1>Terms of Service</h1>
    </div>
    <div class="legal-content">
      <p class="effective">Effective: January 1, 2025</p>

      <section>
        <h2>1. Platform Nature</h2>
        <p>Vakilr is a technology marketplace connecting clients with independent legal professionals. Vakilr is not a law firm and does not provide legal advice. All legal services are provided independently by registered advocates.</p>
      </section>

      <section>
        <h2>2. User Eligibility</h2>
        <p>You must be 18 years or older to use Vakilr. Lawyers must hold a valid Bar Council of India registration. Firms must be registered legal entities. False credentials will result in permanent ban and potential legal action.</p>
      </section>

      <section>
        <h2>3. Payment Terms</h2>
        <p>Platform fee is 20% of all transactions. Lawyer earnings are held in escrow for 7 days after session completion for dispute protection. Withdrawals are processed to the bank account on file within 3-5 business days after the lock period.</p>
      </section>

      <section>
        <h2>4. Document Services</h2>
        <p>Document review and drafting services are charged per page as set by the lawyer. The final page count and amount are determined by the lawyer upon completion and must be accepted by the client before payment is processed.</p>
      </section>

      <section>
        <h2>5. Dispute Resolution</h2>
        <p>Disputes must be filed within 7 days of session completion. Tier 1 disputes are reviewed by AI within 24 hours. Tier 2+ disputes are reviewed by human moderators within 3-5 business days. Vakilr's decision on disputes is final.</p>
      </section>

      <section>
        <h2>6. Prohibited Conduct</h2>
        <p>Users may not misrepresent qualifications, provide false information, use the platform for illegal purposes, harass other users, or attempt to circumvent platform fees by taking payments off-platform.</p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>Vakilr is not liable for the quality of legal advice given by independent lawyers. We facilitate connections only. Maximum liability is limited to the amount paid for the specific session in question.</p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>legal@vakilr.com · Vakilr Technologies Pvt. Ltd., India</p>
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