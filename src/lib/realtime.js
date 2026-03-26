// ═══════════════════════════════════════
// Real-Time: Chat + WebRTC Calls
// ═══════════════════════════════════════

import { supabase } from './supabase'

// ─── CHAT ───
export function subscribeToMessages(sessionId, onMessage) {
  return supabase
    .channel(`messages:${sessionId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `session_id=eq.${sessionId}`,
    }, payload => onMessage(payload.new))
    .subscribe()
}

export async function sendMessage(sessionId, senderId, content, type = 'text') {
  const { data, error } = await supabase.from('messages').insert({
    session_id: sessionId,
    sender_id: senderId,
    content,
    type,
  }).select().single()
  if (error) throw error
  return data
}

export async function getMessages(sessionId) {
  const { data } = await supabase
    .from('messages')
    .select('*, profiles:sender_id(full_name, avatar_url)')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  return data || []
}

// ─── WEBRTC CALLS ───
const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
}

export class VakilrCall {
  constructor({ sessionId, userId, isInitiator, onRemoteStream, onConnected, onEnded, onError }) {
    this.sessionId   = sessionId
    this.userId      = userId
    this.isInitiator = isInitiator
    this.onRemoteStream = onRemoteStream
    this.onConnected = onConnected
    this.onEnded     = onEnded
    this.onError     = onError
    this.pc          = null
    this.localStream = null
    this.channel     = null
    this.videoEnabled = true
    this.audioEnabled = true
  }

  async start(withVideo = false) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo,
      })

      this.pc = new RTCPeerConnection(STUN_SERVERS)

      this.localStream.getTracks().forEach(track => {
        this.pc.addTrack(track, this.localStream)
      })

      this.pc.ontrack = (event) => {
        this.onRemoteStream?.(event.streams[0])
      }

      this.pc.oniceconnectionstatechange = () => {
        if (this.pc.iceConnectionState === 'connected') this.onConnected?.()
        if (['disconnected','failed','closed'].includes(this.pc.iceConnectionState)) this.onEnded?.()
      }

      this._subscribeSignaling()

      if (this.isInitiator) await this._createOffer()

      return this.localStream
    } catch (err) {
      this.onError?.(err.message)
      throw err
    }
  }

  async _createOffer() {
    this.pc.onicecandidate = (e) => {
      if (e.candidate) this._sendSignal({ type: 'candidate', candidate: e.candidate })
    }
    const offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer)
    this._sendSignal({ type: 'offer', sdp: offer })
  }

  async _handleOffer(sdp) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
    this.pc.onicecandidate = (e) => {
      if (e.candidate) this._sendSignal({ type: 'candidate', candidate: e.candidate })
    }
    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
    this._sendSignal({ type: 'answer', sdp: answer })
  }

  async _handleAnswer(sdp) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  async _handleCandidate(candidate) {
    try { await this.pc.addIceCandidate(new RTCIceCandidate(candidate)) } catch {}
  }

  _sendSignal(data) {
    supabase.channel(`call:${this.sessionId}`).send({
      type: 'broadcast',
      event: 'signal',
      payload: { from: this.userId, ...data },
    })
  }

  _subscribeSignaling() {
    this.channel = supabase
      .channel(`call:${this.sessionId}`)
      .on('broadcast', { event: 'signal' }, async ({ payload }) => {
        if (payload.from === this.userId) return
        if (payload.type === 'offer')     await this._handleOffer(payload.sdp)
        if (payload.type === 'answer')    await this._handleAnswer(payload.sdp)
        if (payload.type === 'candidate') await this._handleCandidate(payload.candidate)
        if (payload.type === 'end')       this.onEnded?.()
      })
      .subscribe()
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled
    this.localStream?.getAudioTracks().forEach(t => { t.enabled = this.audioEnabled })
    return this.audioEnabled
  }

  toggleVideo() {
    this.videoEnabled = !this.videoEnabled
    this.localStream?.getVideoTracks().forEach(t => { t.enabled = this.videoEnabled })
    return this.videoEnabled
  }

  end() {
    this._sendSignal({ type: 'end' })
    this.localStream?.getTracks().forEach(t => t.stop())
    this.pc?.close()
    this.channel?.unsubscribe()
  }
}