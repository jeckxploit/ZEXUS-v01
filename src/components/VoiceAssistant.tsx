'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Sparkles, Volume2, Send, Loader2, MessageSquare, Zap } from 'lucide-react'

interface Message {
  type: 'user' | 'assistant'
  text: string
  audioUrl?: string
}

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sessionIdRef = useRef(Date.now().toString())

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setCurrentTranscript('')

    try {
      // Convert audio to base64
      const audioBase64 = await blobToBase64(audioBlob)

      // Step 1: Transcribe audio
      const transcribeResponse = await fetch('/api/voice/transcribe?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64 })
      })

      const transcribeData = await transcribeResponse.json()

      if (!transcribeData.success) {
        throw new Error(transcribeData.error || 'Failed to transcribe audio')
      }

      const transcript = transcribeData.transcription
      setCurrentTranscript(transcript)

      if (!transcript || transcript.trim().length === 0) {
        setIsProcessing(false)
        return
      }

      // Add user message
      const userMessage: Message = {
        type: 'user',
        text: transcript
      }
      setMessages(prev => [...prev, userMessage])

      // Step 2: Get AI response
      const chatResponse = await fetch('/api/voice/chat?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          sessionId: sessionIdRef.current
        })
      })

      const chatData = await chatResponse.json()

      if (!chatData.success) {
        throw new Error(chatData.error || 'Failed to get AI response')
      }

      const aiResponse = chatData.response

      // Step 3: Generate speech from AI response
      const speakResponse = await fetch('/api/voice/speak?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: aiResponse,
          voice: 'tongtong',
          speed: 0.95
        })
      })

      if (speakResponse.ok) {
        const audioBlob = await speakResponse.blob()
        const audioUrl = URL.createObjectURL(audioBlob)

        const assistantMessage: Message = {
          type: 'assistant',
          text: aiResponse,
          audioUrl: audioUrl
        }
        setMessages(prev => [...prev, assistantMessage])

        // Auto-play the response
        playAudio(audioUrl)
      } else {
        // Add text-only response if TTS fails
        const assistantMessage: Message = {
          type: 'assistant',
          text: aiResponse
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error processing voice:', error)

      // Get error message from response or use default
      let errorMsg = 'Gagal memproses suara'
      if (error instanceof Error) {
        errorMsg = error.message
      }

      // Show user-friendly error
      alert(errorMsg)
    } finally {
      setIsProcessing(false)
      setCurrentTranscript('')
    }
  }

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.onplay = () => setIsSpeaking(true)
    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)

    audio.play().catch(console.error)
  }

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const clearConversation = () => {
    setMessages([])
    setCurrentTranscript('')
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    sessionIdRef.current = Date.now().toString()

    // Clear server-side conversation
    fetch('/api/voice/chat?XTransformPort=3000', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionIdRef.current })
    }).catch(console.error)
  }

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {messages.length > 0 || isProcessing || isRecording ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-custom rounded-3xl p-6 w-96 mb-4 shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center"
                  animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
                <span className="font-bold text-white">Asisten Suara ZEXUS</span>
              </div>
              <motion.button
                onClick={clearConversation}
                className="text-xs text-muted-foreground hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Hapus
              </motion.button>
            </div>

            {/* Messages */}
            <div className="space-y-3 max-h-80 overflow-y-auto mb-4 custom-scrollbar">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                      : 'glass-custom border border-purple-500/30'
                  }`}>
                    <p className={`text-sm ${
                      message.type === 'user' ? 'text-white' : 'text-white/90'
                    }`}>
                      {message.text}
                    </p>
                    {message.audioUrl && (
                      <motion.button
                        onClick={() => playAudio(message.audioUrl!)}
                        className="flex items-center gap-1 mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Volume2 className="w-3 h-3" />
                        Putar Ulang
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Current transcript */}
              {currentTranscript && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 justify-end"
                >
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                    <p className="text-sm text-white">{currentTranscript}</p>
                    {isProcessing && (
                      <div className="flex gap-1 mt-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-cyan-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Status */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Record Button */}
      <motion.button
        onClick={handleRecordClick}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 ${
          isRecording
            ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-400'
            : 'bg-gradient-to-r from-cyan-500 to-purple-500 border-cyan-400'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isRecording ? {
          boxShadow: [
            '0 0 20px rgba(239, 68, 68, 0.5)',
            '0 0 40px rgba(239, 68, 68, 0.8)',
            '0 0 20px rgba(239, 68, 68, 0.5)'
          ]
        } : {
          boxShadow: [
            '0 0 20px rgba(6, 182, 212, 0.5)',
            '0 0 40px rgba(168, 85, 247, 0.5)',
            '0 0 20px rgba(6, 182, 212, 0.5)'
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={isRecording ? {
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          } : {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Wave animation when recording */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 h-4 bg-white rounded-full"
                animate={{
                  scaleY: [1, 1.5, 1]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}

        {!isRecording && (
          <>
            <Mic className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {messages.length === 0 && !isProcessing && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 glass-custom rounded-lg px-3 py-2 text-xs text-white"
          >
            Klik untuk mulai berbicara
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
