<template>
  <div class="legal-page">
    <div class="legal-header">
      <button class="back-btn" @click="$router.back()">← Back</button>
      <div class="legal-logo">Vakilr</div>
    </div>
    <div class="legal-content">
      <div class="doc-header">
        <h1>Terms of Service</h1>
        <p class="effective">Effective: 1 January 2025 · Last updated: March 2025</p>
        <p class="intro">
          These Terms of Service ("Terms") constitute a legally binding agreement between you
          and Vakilr Technologies ("Vakilr"). By creating an account or using our platform,
          you confirm that you have read, understood, and agree to be bound by these Terms.
          If you are registering as a law firm, these Terms also bind your organisation.
        </p>
        <div class="warn-box">
          ⚠️ <strong>Important:</strong> Vakilr is a marketplace platform, not a law firm.
          We do not provide legal advice. All legal services are delivered by independent,
          verified lawyers who are solely responsible for their advice.
        </div>
      </div>

      <section>
        <h2>1. Definitions</h2>
        <ul>
          <li><strong>"Platform"</strong> — the Vakilr website, mobile app, and all related services</li>
          <li><strong>"Client"</strong> — a user who uses the Platform to seek legal services</li>
          <li><strong>"Lawyer"</strong> — a verified advocate listed on the Platform</li>
          <li><strong>"Firm"</strong> — a registered law firm with a Vakilr account</li>
          <li><strong>"Session"</strong> — a paid consultation (chat, call, video, or document service)</li>
          <li><strong>"Wallet"</strong> — the in-app balance held by Vakilr on your behalf</li>
          <li><strong>"Platform Fee"</strong> — the 20% service charge Vakilr deducts from each session</li>
        </ul>
      </section>

      <section>
        <h2>2. Eligibility and Account Registration</h2>
        <ul>
          <li>You must be at least 18 years old to use Vakilr</li>
          <li>You must provide accurate, truthful information during registration</li>
          <li>Each person may hold only one account per role (client, lawyer, or firm)</li>
          <li>You are responsible for keeping your password secure. Vakilr is not liable for unauthorised access resulting from your failure to protect your credentials.</li>
          <li>You must notify us immediately at support@vakilr.com if you suspect your account has been compromised</li>
          <li>Corporate entities registering as firms must have authorisation from the firm's management</li>
        </ul>
      </section>

      <section>
        <h2>3. Lawyer Verification and Standards</h2>
        <h3>3.1 For Lawyers</h3>
        <ul>
          <li>All lawyers must hold a valid Bar Council of India registration or equivalent state bar council registration</li>
          <li>You must upload a valid, unaltered certificate during registration. Submitting fraudulent credentials is a criminal offence and will result in immediate account termination and reporting to the Bar Council.</li>
          <li>Verification takes 24–48 business hours. You will receive an email notification on approval or rejection.</li>
          <li>Lawyers are solely responsible for the legal advice they provide. Vakilr does not review or endorse the content of any advice.</li>
          <li>Lawyers must maintain active Bar Council registration at all times. Vakilr reserves the right to re-verify credentials periodically.</li>
          <li>Lawyers must respond to session requests within their stated availability. Repeated no-shows may result in account suspension.</li>
        </ul>
        <h3>3.2 For Law Firms</h3>
        <ul>
          <li>Firms must provide valid firm registration documents</li>
          <li>All lawyers added to a firm must independently satisfy the verification requirements above</li>
          <li>Session earnings from firm-associated lawyers are credited to the firm's Vakilr wallet. Disbursement to individual lawyers is the firm's sole responsibility.</li>
          <li>Firms are responsible for the conduct of all lawyers operating under their account</li>
        </ul>
      </section>

      <section>
        <h2>4. Session Rules and Conduct</h2>
        <ul>
          <li>Sessions must be paid for in advance through the Vakilr wallet</li>
          <li>Both clients and lawyers must conduct sessions professionally and respectfully</li>
          <li>Sessions are for legitimate legal consultation only. Any attempt to use sessions for illegal purposes will result in immediate account termination.</li>
          <li>Lawyers must not solicit clients to communicate outside the Vakilr platform to circumvent platform fees</li>
          <li>Clients must not record sessions without the lawyer's explicit consent</li>
          <li>Vakilr does NOT record voice or video sessions. Chat history is stored for 90 days for dispute purposes only.</li>
        </ul>
      </section>

      <section>
        <h2>5. Payments, Wallet, and Refunds</h2>
        <h3>5.1 Wallet and Fees</h3>
        <ul>
          <li>Clients must maintain sufficient wallet balance before booking sessions</li>
          <li>Vakilr charges a <strong>20% platform fee</strong> on all sessions. Lawyers and firms receive 80% of the session fee.</li>
          <li>Lawyer/firm earnings are subject to a <strong>7-day lock period</strong> from session completion as fraud protection. After 7 days, funds become available for withdrawal.</li>
          <li>Wallet top-ups are processed via third-party payment gateways. Vakilr is not liable for delays caused by payment processors.</li>
        </ul>
        <h3>5.2 Refunds</h3>
        <ul>
          <li><strong>Session not started:</strong> Full refund if the lawyer fails to join within 10 minutes of scheduled time</li>
          <li><strong>Technical failure:</strong> Pro-rated refund for time lost due to platform-side technical issues</li>
          <li><strong>Client disputes:</strong> Disputes must be filed within 7 days of session end. Vakilr's moderation team will review and issue refunds at their sole discretion.</li>
          <li><strong>No refunds for:</strong> sessions completed, client no-shows, or dissatisfaction with legal opinion (Vakilr cannot control the quality of legal advice)</li>
          <li>Wallet balances are non-transferable and non-redeemable for cash except through the standard withdrawal process</li>
        </ul>
      </section>

      <section>
        <h2>6. Prohibited Conduct</h2>
        <p>The following are strictly prohibited on Vakilr:</p>
        <ul>
          <li>Creating fake accounts or impersonating others</li>
          <li>Submitting false or altered credentials for lawyer verification</li>
          <li>Using the platform for any illegal activity</li>
          <li>Harassing, threatening, or abusing other users</li>
          <li>Attempting to circumvent platform fees by soliciting off-platform contact</li>
          <li>Reverse engineering, scraping, or copying the Vakilr platform</li>
          <li>Posting false reviews or manipulating ratings</li>
          <li>Using automated bots to interact with the platform</li>
          <li>Sharing login credentials with others</li>
        </ul>
        <p>Violation of any prohibited conduct rule may result in immediate account suspension, forfeiture of wallet balance, and legal action where appropriate.</p>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <ul>
          <li>All content on the Vakilr platform — design, code, logos, text — is owned by Vakilr Technologies and protected by copyright law</li>
          <li>Documents drafted by lawyers for clients during sessions belong to the client once payment is completed</li>
          <li>Lawyers retain the right to use general legal templates and methodologies but may not re-use client-specific work product without consent</li>
          <li>You grant Vakilr a limited licence to display your profile information on the platform for the purpose of connecting you with clients/lawyers</li>
        </ul>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <ul>
          <li>Vakilr is a technology marketplace and is NOT a party to any lawyer-client relationship formed through the platform</li>
          <li>Vakilr is not liable for the accuracy, quality, or outcome of any legal advice provided by lawyers on the platform</li>
          <li>Vakilr's total liability to you for any claim shall not exceed the amount you paid to Vakilr (platform fees) in the 3 months preceding the claim</li>
          <li>We are not liable for losses arising from: internet outages, device failures, third-party payment issues, or force majeure events</li>
          <li>We do not guarantee continuous, uninterrupted access to the platform</li>
        </ul>
      </section>

      <section>
        <h2>9. Dispute Resolution Between Users</h2>
        <ul>
          <li>All disputes between clients and lawyers must be filed through the Vakilr dispute system within 7 days of the session</li>
          <li>Vakilr's moderation team will review available evidence (session metadata, chat history) and issue a binding decision</li>
          <li>The moderator's decision is final within the platform. Either party may pursue legal remedies in courts of competent jurisdiction.</li>
          <li>Disputes against Vakilr itself shall be subject to arbitration under the Arbitration and Conciliation Act, 1996</li>
          <li>All disputes are governed by the laws of India. Courts in [City], India shall have exclusive jurisdiction.</li>
        </ul>
      </section>

      <section>
        <h2>10. Account Termination</h2>
        <ul>
          <li>You may delete your account at any time through the app settings</li>
          <li>Vakilr may suspend or terminate your account for violation of these Terms, fraudulent activity, or as required by law</li>
          <li>On termination, available wallet balance will be refunded to your original payment method within 14 working days, minus any amounts owed</li>
          <li>Lawyers removed from the platform will have their profiles delisted immediately</li>
          <li>We reserve the right to retain transaction records for 7 years post-termination as required by Indian financial regulations</li>
        </ul>
      </section>

      <section>
        <h2>11. Changes to Terms</h2>
        <p>
          We may revise these Terms at any time. Material changes will be communicated via
          email and in-app notification at least 14 days before taking effect. Continued use of
          the platform after changes take effect constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>12. Contact and Grievance Redressal</h2>
        <div class="contact-card">
          <div class="cc-item">📧 <strong>Legal queries:</strong> legal@vakilr.com</div>
          <div class="cc-item">📧 <strong>Disputes:</strong> disputes@vakilr.com</div>
          <div class="cc-item">📧 <strong>General support:</strong> support@vakilr.com</div>
          <div class="cc-item">🕐 <strong>Response time:</strong> Within 48 business hours</div>
          <div class="cc-item">📍 <strong>Grievance Officer:</strong> Available at legal@vakilr.com per IT Act 2000 requirements</div>
        </div>
      </section>

      <div class="doc-footer">
        <p>© 2025 Vakilr Technologies. All rights reserved.</p>
        <p>These Terms were last reviewed by our legal team in March 2025.</p>
        <router-link to="/privacy" class="pp-link">← Read our Privacy Policy</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page { min-height:100vh; background:#0A0F2C; }
.legal-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; background:rgba(10,15,44,0.98); border-bottom:1px solid rgba(255,255,255,0.07); position:sticky; top:0; z-index:10; }
.back-btn { background:none; border:none; color:#8892b0; font-family:'DM Sans',sans-serif; font-size:0.9rem; cursor:pointer; }
.legal-logo { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; color:#C9A84C; }
.legal-content { max-width:680px; margin:0 auto; padding:2rem 1.5rem 4rem; }
.doc-header { margin-bottom:2.5rem; padding-bottom:2rem; border-bottom:1px solid rgba(255,255,255,0.08); }
.doc-header h1 { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:900; color:#f0f4ff; margin-bottom:0.5rem; }
.effective { font-family:'DM Sans',sans-serif; font-size:0.78rem; color:#4a5578; margin-bottom:1rem; }
.intro { font-family:'DM Sans',sans-serif; font-size:0.92rem; color:#8892b0; line-height:1.75; margin-bottom:1.5rem; }
.warn-box { background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.25); border-radius:12px; padding:1rem 1.25rem; font-family:'DM Sans',sans-serif; font-size:0.85rem; color:#C9A84C; line-height:1.6; }
section { margin-bottom:2.5rem; }
h2 { font-family:'Playfair Display',serif; font-size:1.25rem; font-weight:700; color:#f0f4ff; margin-bottom:0.9rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.06); }
h3 { font-family:'DM Sans',sans-serif; font-size:0.92rem; font-weight:700; color:#C9A84C; margin:1rem 0 0.5rem; }
p { font-family:'DM Sans',sans-serif; font-size:0.88rem; color:#8892b0; line-height:1.78; margin-bottom:0.75rem; }
ul { padding-left:1.25rem; margin-bottom:0.75rem; }
li { font-family:'DM Sans',sans-serif; font-size:0.87rem; color:#8892b0; line-height:1.75; margin-bottom:0.35rem; }
li strong { color:#f0f4ff; }
.contact-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem; }
.cc-item { font-family:'DM Sans',sans-serif; font-size:0.87rem; color:#8892b0; }
.cc-item strong { color:#f0f4ff; }
.doc-footer { margin-top:3rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.08); text-align:center; }
.doc-footer p { font-size:0.78rem; color:#4a5578; margin-bottom:0.25rem; }
.pp-link { display:inline-block; margin-top:0.75rem; font-family:'DM Sans',sans-serif; font-size:0.8rem; color:#C9A84C; text-decoration:none; }
</style>