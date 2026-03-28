<template>
  <div class="legal-page">
    <div class="legal-header">
      <button class="back-btn" @click="$router.back()">← Back</button>
      <div class="legal-logo">Vakilr</div>
    </div>
    <div class="legal-content">
      <div class="doc-header">
        <h1>Privacy Policy</h1>
        <p class="effective">Effective: 1 January 2025 · Last updated: March 2025</p>
        <p class="intro">
          At Vakilr Technologies ("Vakilr", "we", "us", "our"), your privacy is not
          a checkbox — it is a core design principle. This Privacy Policy explains in plain
          language exactly what data we collect, why we collect it, how we protect it, and
          what rights you hold over it. We operate under the Information Technology Act, 2000
          and the Digital Personal Data Protection Act, 2023 (DPDPA) of India.
        </p>
        <div class="trust-badges">
          <div class="tb">🔒 256-bit AES Encryption</div>
          <div class="tb">🇮🇳 Data stored in India</div>
          <div class="tb">🚫 Never sold to third parties</div>
          <div class="tb">📵 No session recordings</div>
        </div>
      </div>

      <section>
        <h2>1. Who This Policy Applies To</h2>
        <p>This policy applies to all users of the Vakilr platform including:</p>
        <ul>
          <li><strong>Clients</strong> — individuals seeking legal help</li>
          <li><strong>Lawyers</strong> — verified advocates registered on our platform</li>
          <li><strong>Law Firms</strong> — registered law firms and their teams</li>
          <li>Visitors to our website at vakilr.com</li>
        </ul>
        <p>By using Vakilr, you consent to the practices described in this policy. If you do not agree, please discontinue use of our services.</p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <h3>2.1 Information You Provide</h3>
        <ul>
          <li><strong>Account data:</strong> full name, email address, phone number (optional for clients), profile photo</li>
          <li><strong>For lawyers:</strong> Bar Council registration number, certificate documents, specializations, years of experience, city, languages spoken, bio</li>
          <li><strong>For firms:</strong> firm name, GST/registration number, team size, registered address</li>
          <li><strong>Payment data:</strong> wallet top-up records, transaction history (we do NOT store card numbers, UPI PINs, or bank credentials — all payments are processed by third-party PCI-DSS certified gateways)</li>
          <li><strong>Communications:</strong> text messages exchanged in chat sessions (stored for dispute resolution, auto-deleted after 90 days)</li>
        </ul>
        <h3>2.2 Information Collected Automatically</h3>
        <ul>
          <li>Device type, operating system, browser type</li>
          <li>IP address and approximate location (city-level only)</li>
          <li>Session timestamps, pages visited, features used</li>
          <li>Crash reports and error logs (no personal content included)</li>
        </ul>
        <h3>2.3 What We Do NOT Collect</h3>
        <ul>
          <li>We do NOT record, transcribe, or store voice or video call content</li>
          <li>We do NOT read chat messages in real time for advertising purposes</li>
          <li>We do NOT track your location via GPS</li>
          <li>We do NOT access your contacts, photos, or files on your device</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li><strong>Service delivery:</strong> Connecting clients with lawyers, processing bookings, managing sessions</li>
          <li><strong>Identity verification:</strong> Verifying Bar Council credentials for all lawyers to protect clients</li>
          <li><strong>Payments:</strong> Processing wallet top-ups, session fees, lawyer payouts, and dispute refunds</li>
          <li><strong>Safety and disputes:</strong> Resolving client-lawyer disputes using session metadata and chat history</li>
          <li><strong>AI features:</strong> The AI Legal Guide uses anonymised query text to generate responses via our AI provider. Your name, contact, and session details are never sent to AI systems.</li>
          <li><strong>Service improvements:</strong> Aggregate, anonymised analytics to improve the platform</li>
          <li><strong>Transactional emails:</strong> Account confirmations, password resets, lawyer verification status, session receipts</li>
          <li><strong>Legal compliance:</strong> Responding to valid court orders or government directives under Indian law</li>
        </ul>
        <p>We will NEVER use your information for unsolicited marketing, sell it to advertisers, or share it with data brokers.</p>
      </section>

      <section>
        <h2>4. Data Security — How We Protect You</h2>
        <p>We take security extremely seriously. Here is what protects your data:</p>
        <ul>
          <li><strong>Encryption in transit:</strong> All data between your device and our servers is encrypted using TLS 1.3</li>
          <li><strong>Encryption at rest:</strong> All stored data is encrypted using AES-256, the same standard used by banks</li>
          <li><strong>Database security:</strong> Our database uses Row-Level Security (RLS) policies — each user can only access their own data. Even our engineers cannot casually read your records.</li>
          <li><strong>Authentication:</strong> Secure email-based authentication with rate limiting and brute-force protection</li>
          <li><strong>Wallet protection:</strong> Funds are held in escrow during sessions. A 7-day lock prevents fraudulent immediate withdrawals.</li>
          <li><strong>Session data:</strong> Chat messages are stored only for the session duration plus 90 days for dispute purposes, then permanently deleted</li>
          <li><strong>No session recordings:</strong> Voice and video calls are peer-to-peer (WebRTC). Vakilr servers never receive or store call audio or video.</li>
          <li><strong>Certificate documents:</strong> Lawyer certificates uploaded for verification are accessible only to our verification team and are deleted once verification is complete</li>
        </ul>
        <p>In the event of a data breach affecting your personal data, we will notify you within 72 hours as required by the DPDPA 2023.</p>
      </section>

      <section>
        <h2>5. Lawyer-Client Confidentiality</h2>
        <p>
          Vakilr respects the principle of attorney-client privilege. Communications between
          a client and their lawyer on our platform are treated as confidential. Vakilr staff
          do not access the content of your conversations except:
        </p>
        <ul>
          <li>When you formally file a dispute and explicitly request review</li>
          <li>When required by a valid court order or law enforcement directive</li>
        </ul>
        <p>
          We strongly recommend that clients and lawyers do not share sensitive documents outside
          the Vakilr secure document session. Vakilr is not responsible for information shared
          via external channels.
        </p>
      </section>

      <section>
        <h2>6. Data Sharing — Who We Share With</h2>
        <p>We share data only in limited circumstances:</p>
        <ul>
          <li><strong>With your lawyer/client:</strong> Your name and profile are visible to the other party during a session you both agreed to</li>
          <li><strong>Payment processors:</strong> Transaction data is shared with our payment gateway partners (Razorpay/equivalent) solely to process payments. They have their own privacy policies.</li>
          <li><strong>AI provider:</strong> Anonymised legal queries are sent to our AI provider (DeepSeek/NVIDIA) for the AI Guide feature. No identifying information is included.</li>
          <li><strong>Law enforcement:</strong> We comply with valid legal orders from Indian courts and government authorities. We will notify you unless legally prohibited from doing so.</li>
        </ul>
        <p>We do NOT share your data with: advertisers, marketing agencies, social media platforms, data brokers, or any third party for commercial purposes.</p>
      </section>

      <section>
        <h2>7. Data Retention</h2>
        <ul>
          <li><strong>Active accounts:</strong> Data retained as long as your account is active</li>
          <li><strong>Chat history:</strong> 90 days from session end, then permanently deleted (unless a dispute is active)</li>
          <li><strong>Transaction records:</strong> 7 years (required by Indian financial regulations)</li>
          <li><strong>Lawyer certificates:</strong> Deleted within 30 days of verification completion</li>
          <li><strong>Deleted accounts:</strong> All personal data deleted within 30 days of account deletion request, except data required by law</li>
        </ul>
      </section>

      <section>
        <h2>8. Your Rights Under DPDPA 2023</h2>
        <p>As a data principal under the Digital Personal Data Protection Act 2023, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
          <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
          <li><strong>Grievance redressal:</strong> File a complaint with our Data Protection Officer</li>
          <li><strong>Nomination:</strong> Nominate a person to exercise your data rights in case of incapacity or death</li>
        </ul>
        <p>To exercise these rights, contact us at <strong>privacy@vakilr.com</strong>. We will respond within 72 hours.</p>
      </section>

      <section>
        <h2>9. Cookies and Tracking</h2>
        <p>We use minimal cookies and local storage for:</p>
        <ul>
          <li>Keeping you logged in (session token, stored securely)</li>
          <li>Remembering your onboarding completion</li>
          <li>Storing app preferences</li>
        </ul>
        <p>We do NOT use advertising cookies, tracking pixels, or third-party analytics that profile you across websites.</p>
      </section>

      <section>
        <h2>10. Children's Privacy</h2>
        <p>
          Vakilr is not intended for users under the age of 18. We do not knowingly collect data
          from minors. If you believe a minor has registered on our platform, contact us at
          privacy@vakilr.com and we will delete the account immediately.
        </p>
      </section>

      <section>
        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in law or our practices.
          When we make material changes, we will notify you via email and an in-app notice
          at least 14 days before the changes take effect. Continued use after that date
          constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>12. Contact Us</h2>
        <div class="contact-card">
          <div class="cc-item">📧 <strong>Privacy queries:</strong> privacy@vakilr.com</div>
          <div class="cc-item">📧 <strong>Data Protection Officer:</strong> dpo@vakilr.com</div>
          <div class="cc-item">📧 <strong>General support:</strong> support@vakilr.com</div>
          <div class="cc-item">📍 <strong>Address:</strong> Vakilr Technologies, India</div>
        </div>
      </section>

      <div class="doc-footer">
        <p>© 2025 Vakilr Technologies. All rights reserved.</p>
        <p>This document was last reviewed by our legal team in March 2025.</p>
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
.trust-badges { display:flex; flex-wrap:wrap; gap:0.5rem; }
.tb { background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2); color:#C9A84C; font-family:'DM Sans',sans-serif; font-size:0.75rem; font-weight:600; padding:0.35rem 0.8rem; border-radius:100px; }
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
</style>