<template>
  <div style="min-height:100vh;background:#0A0F2C;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="text-align:center;max-width:380px">
      <div style="font-size:3rem;margin-bottom:1rem">✉️</div>
      <h1 style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#f0f4ff;margin-bottom:0.75rem">Verify Your Email</h1>
      <p style="font-family:'DM Sans',sans-serif;color:#8892b0;line-height:1.7;margin-bottom:2rem">We sent a verification link to your email address. Click the link to activate your account.</p>
      <button @click="router.push('/login')" style="width:100%;padding:1rem;border-radius:14px;border:none;background:#C9A84C;color:#0A0F2C;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer">Back to Login</button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>