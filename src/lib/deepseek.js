// ═══════════════════════════════════════
// DeepSeek AI Engine — Vakilr
// All AI features run through this file
// ═══════════════════════════════════════

const DEEPSEEK_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const DEEPSEEK_MODEL = 'deepseek-ai/deepseek-v3'

async function callDeepSeek(messages, { stream = false, onChunk = null } = {}) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DeepSeek API key missing in .env')

  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2048,
      stream,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepSeek error: ${err}`)
  }

  if (stream && onChunk) {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
      for (const line of lines) {
        const data = line.replace('data: ', '').trim()
        if (data === '[DONE]') continue
        try {
          const json = JSON.parse(data)
          const text = json.choices?.[0]?.delta?.content || ''
          if (text) { fullText += text; onChunk(text, fullText) }
        } catch {}
      }
    }
    return fullText
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

// ─── 1. LAWYER VERIFICATION ───
export async function verifyLawyerWithAI({ name, barCouncilNumber, specializations, experienceYears, city, rateChat, rateVoice, rateVideo, rateDocument, averageLawyers }) {
  const messages = [
    {
      role: 'system',
      content: `You are a strict but fair legal professional verification system for Vakilr, India's legal marketplace. You verify lawyer profiles and check if their rates are reasonable. Always respond in valid JSON only. No markdown, no explanation outside JSON.`,
    },
    {
      role: 'user',
      content: `Verify this lawyer profile and check their rates:

Name: ${name}
Bar Council Number: ${barCouncilNumber}
Specializations: ${specializations.join(', ')}
Experience: ${experienceYears} years
City: ${city}
Rates set by lawyer:
- Chat: ₹${rateChat}/min
- Voice Call: ₹${rateVoice}/min  
- Video Call: ₹${rateVideo}/min
- Document Review: ₹${rateDocument}/doc

Market average rates on our platform:
- Chat: ₹${averageLawyers.chat}/min
- Voice: ₹${averageLawyers.voice}/min
- Video: ₹${averageLawyers.video}/min
- Document: ₹${averageLawyers.document}/doc

Tasks:
1. Check if bar council number format looks valid for India (format: STATE/NUMBER/YEAR)
2. Check if rates are reasonable for ${experienceYears} years experience
3. If rates are more than 40% above market average, suggest lower rates with reason

Respond ONLY with this JSON:
{
  "decision": "approved" or "rejected" or "needs_info",
  "reasoning": "detailed reason in Hindi and English mixed (Hinglish)",
  "rate_suggestion": null or "Your chat rate ₹X seems high for X years experience. Market average is ₹Y. Consider reducing to ₹Z to get more clients.",
  "rate_too_high": true or false,
  "suggested_rates": { "chat": number, "voice": number, "video": number, "document": number } or null
}`,
    },
  ]

  const response = await callDeepSeek(messages)
  try {
    const clean = response.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { decision: 'approved', reasoning: 'Verification completed.', rate_suggestion: null, rate_too_high: false, suggested_rates: null }
  }
}

// ─── 2. AI LEGAL GUIDE (streaming) ───
export async function askLegalGuide({ userMessage, lawyers, onChunk }) {
  const lawyerList = lawyers.slice(0, 10).map((l, i) =>
    `${i + 1}. ${l.full_name} | ${l.specializations?.join(', ')} | ${l.city} | ₹${l.chat_rate}/min | Rating: ${l.rating} | Experience: ${l.experience_years} yrs`
  ).join('\n')

  const messages = [
    {
      role: 'system',
      content: `You are a helpful legal guide for Vakilr, India's legal marketplace. You help clients understand their legal situation and find the right lawyer. 

Rules:
- NEVER give actual legal advice or legal opinions
- Only guide them to the right TYPE of lawyer
- Respond in Hinglish (mix of Hindi and English) — friendly and simple
- Keep response under 200 words
- At the end, recommend exactly 3 lawyers from the list provided by their number
- Format: First explain what type of lawyer they need, then say "Recommended lawyers for you:" and list 3 names with IDs

Available lawyers on platform:
${lawyerList}`,
    },
    { role: 'user', content: userMessage },
  ]

  return await callDeepSeek(messages, { stream: true, onChunk })
}

// ─── 3. DISPUTE JUDGMENT ───
export async function judgeDispute({ sessionType, clientClaim, lawyerResponse, sessionDuration, amountPaid, sessionNotes }) {
  const messages = [
    {
      role: 'system',
      content: `You are a fair and impartial dispute resolution officer for Vakilr legal marketplace. You review disputes between clients and lawyers and make binding decisions. Always respond in valid JSON only.`,
    },
    {
      role: 'user',
      content: `Review this dispute and give a fair judgment:

Session Type: ${sessionType}
Amount Disputed: ₹${amountPaid}
Session Duration: ${sessionDuration} minutes

Client's Claim: ${clientClaim}
Lawyer's Response: ${lawyerResponse || 'No response submitted'}
Session Notes: ${sessionNotes || 'None'}

Give a fair judgment. Consider:
- Was the service delivered?
- Is the complaint reasonable?
- What is the fair resolution?

Respond ONLY with this JSON:
{
  "decision": "refund_full" or "refund_partial" or "no_refund" or "needs_more_info",
  "refund_amount": number (0 if no refund),
  "reasoning": "Detailed explanation in Hinglish with exact reasons. Minimum 3 reasons listed.",
  "decision_summary": "One line summary of decision"
}`,
    },
  ]

  const response = await callDeepSeek(messages)
  try {
    const clean = response.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { decision: 'needs_more_info', refund_amount: 0, reasoning: 'Unable to process. Please resubmit.', decision_summary: 'Under review' }
  }
}

// ─── 4. RATE SUGGESTION (on login check) ───
export async function checkRatesOnLogin({ lawyerData, marketAverages }) {
  if (!lawyerData.chat_rate) return null
  const chatRatio = lawyerData.chat_rate / marketAverages.chat
  const voiceRatio = lawyerData.voice_rate / marketAverages.voice
  if (chatRatio <= 1.4 && voiceRatio <= 1.4) return null

  const messages = [
    {
      role: 'system',
      content: 'You are a pricing advisor for Vakilr. Give short, friendly rate suggestions. JSON only.',
    },
    {
      role: 'user',
      content: `Lawyer has ${lawyerData.experience_years} years experience.
Their rates: Chat ₹${lawyerData.chat_rate}/min, Voice ₹${lawyerData.voice_rate}/min
Market average: Chat ₹${marketAverages.chat}/min, Voice ₹${marketAverages.voice}/min

Give a short friendly suggestion in Hinglish. JSON: { "message": "...", "suggested_chat": number, "suggested_voice": number }`,
    },
  ]
  const response = await callDeepSeek(messages)
  try {
    return JSON.parse(response.replace(/```json|```/g, '').trim())
  } catch { return null }
}