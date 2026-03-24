<template>
  <div class="home">
    <div class="hero">
      <div class="badge">⚖️ Legal Marketplace</div>
      <h1 class="title">Welcome to <span class="gold">Vakilr</span></h1>
      <p class="subtitle">India's first complete legal services platform.<br>Connecting clients, lawyers & law firms.</p>
      <div class="status">
        <span class="dot"></span>
        Phase 0 Setup Complete ✓
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--navy-900);
  padding: 2rem;
}

.hero {
  text-align: center;
  max-width: 600px;
}

.badge {
  display: inline-block;
  background: rgba(201, 168, 76, 0.15);
  border: 1px solid rgba(201, 168, 76, 0.3);
  color: var(--gold-500);
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
}

.title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 1rem;
}

.gold {
  color: var(--gold-500);
  font-style: italic;
}

.subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  padding: 0.5rem 1.2rem;
  border-radius: 100px;
  font-size: 0.9rem;
}

.dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>