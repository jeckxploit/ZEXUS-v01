'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Settings, Plus, Trash2, Download, Sparkles, Image, Code, Briefcase, MessageSquare, Palette, ArrowLeft } from 'lucide-react'
import GlassCard from './GlassCard'
import GradientButton from './GradientButton'
import MagneticButton from './MagneticButton'

interface Message {
  type: 'user' | 'assistant' | 'image'
  text?: string
  imageUrl?: string
  timestamp: number
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: number
}

type AIMode = 'general' | 'creative' | 'professional' | 'coding' | 'design'

interface AIAssistantPageProps {
  onBack?: () => void
}

const AIMODES: Record<AIMode, { icon: any; name: string; description: string }> = {
  general: { icon: MessageSquare, name: 'Umum', description: 'Asisten serbaguna untuk semua kebutuhan' },
  creative: { icon: Palette, name: 'Kreatif', description: 'Ide kreatif, cerita, konten' },
  professional: { icon: Briefcase, name: 'Profesional', description: 'Bisnis, email, dokumen formal' },
  coding: { icon: Code, name: 'Coding', description: 'Programming, debug, code review' },
  design: { icon: Image, name: 'Desain', description: 'UI/UX, grafik, visual design' },
}

export default function AIAssistantPage({ onBack }: AIAssistantPageProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputText, setInputText] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<AIMode>('general')
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef(Date.now().toString())

  useEffect(() => {
    // Load conversations from localStorage
    const saved = localStorage.getItem('ai-conversations')
    if (saved) {
      const parsed = JSON.parse(saved)
      setConversations(parsed)
      if (parsed.length > 0) {
        setCurrentConversationId(parsed[0].id)
      }
    }
  }, [])

  useEffect(() => {
    // Save conversations to localStorage
    localStorage.setItem('ai-conversations', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    // Scroll to bottom when new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversationId])

  const getCurrentConversation = () => {
    return conversations.find(c => c.id === currentConversationId)
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Percakapan ${conversations.length + 1}`,
      messages: [],
      timestamp: Date.now(),
    }
    setConversations([newConversation, ...conversations])
    setCurrentConversationId(newConversation.id)
  }

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(conversations.length > 1 ? conversations[1].id : null)
    }
  }

  const exportConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id)
    if (!conversation) return

    const text = conversation.messages
      .map(m => `[${m.type === 'user' ? 'Anda' : 'ZEXUS'}]: ${m.text || '(Gambar)'}`)
      .join('\n\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${conversation.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }



  const addUserMessage = (text: string) => {
    if (!currentConversationId) {
      createNewConversation()
    }

    const newMessage: Message = {
      type: 'user',
      text,
      timestamp: Date.now(),
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          title: conv.messages.length === 0 ? text.slice(0, 30) + '...' : conv.title,
        }
      }
      return conv
    }))
  }

  const addAssistantMessage = (text: string) => {
    if (!currentConversationId) return

    const newMessage: Message = {
      type: 'assistant',
      text,
      timestamp: Date.now(),
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
        }
      }
      return conv
    }))
  }

  const handleTextSubmit = async () => {
    if (!inputText.trim()) return

    const text = inputText.trim()
    setInputText('')
    addUserMessage(text)

    setIsProcessing(true)

    try {
      const chatResponse = await fetch('/api/voice/chat?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
          mode: selectedMode
        })
      })

      if (!chatResponse.ok) {
        let errorMsg = `Server error (${chatResponse.status})`
        try {
          const errorData = await chatResponse.json()
          errorMsg = errorData.error || errorMsg
        } catch (e) {
          console.error('Failed to parse error response:', e)
        }
        throw new Error(errorMsg)
      }

      const chatData = await chatResponse.json()

      if (!chatData.success) {
        throw new Error(chatData.error || 'Failed to get AI response')
      }

      const aiResponse = chatData.response

      // Add assistant response
      addAssistantMessage(aiResponse)
    } catch (error) {
      console.error('Error:', error)
      
      // Determine the error message
      let errorMsg = 'Gagal mengirim pesan'
      if (error instanceof Error) {
        errorMsg = error.message
        
        // Check for network errors
        if (error.message === 'Failed to fetch' || error.message === 'fetch failed') {
          errorMsg = 'Tidak dapat terhubung ke layanan AI. Pastikan koneksi internet aktif atau coba lagi nanti.'
        }
      }
      
      // Add error message as assistant response
      addAssistantMessage(`❌ ${errorMsg}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const currentMessages = getCurrentConversation()?.messages || []

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Conversations */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="font-bold text-white">ZEXUS AI</span>
                </div>
                <MagneticButton
                  onClick={createNewConversation}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-white" />
                </MagneticButton>
              </div>
              
              {/* AI Mode Selector */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Mode AI</p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(AIMODES).map(([mode, config]) => (
                    <motion.button
                      key={mode}
                      onClick={() => setSelectedMode(mode as AIMode)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedMode === mode
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <config.icon className={`w-4 h-4 mb-1 ${selectedMode === mode ? 'text-cyan-400' : 'text-muted-foreground'}`} />
                      <p className={`text-sm font-medium ${selectedMode === mode ? 'text-white' : 'text-white/70'}`}>
                        {config.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  onClick={() => setCurrentConversationId(conv.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all group ${
                    currentConversationId === conv.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <p className={`text-sm font-medium truncate ${currentConversationId === conv.id ? 'text-white' : 'text-white/70'}`}>
                      {conv.title}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MagneticButton
                        onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                        className="w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </MagneticButton>
                      <MagneticButton
                        onClick={(e) => { e.stopPropagation(); exportConversation(conv.id); }}
                        className="w-6 h-6 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 flex items-center justify-center"
                      >
                        <Download className="w-3 h-3 text-cyan-400" />
                      </MagneticButton>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conv.messages.length} pesan
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Settings Toggle */}
            <div className="p-4 border-t border-white/10">
              <MagneticButton
                onClick={() => setShowSettings(true)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-3"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-white/70">Pengaturan</span>
              </MagneticButton>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-lg shadow-black/30 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                title="Kembali ke Landing"
                aria-label="Kembali ke Landing"
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
            )}
            <MagneticButton
              onClick={() => setShowSidebar(!showSidebar)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 text-white/70" />
            </MagneticButton>
            <div>
              <h1 className="text-xl font-bold text-white">Asisten AI ZEXUS</h1>
              <p className="text-xs text-muted-foreground">Mode: {AIMODES[selectedMode].name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MagneticButton
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-white/70" />
            </MagneticButton>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mb-6"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Halo! Saya ZEXUS</h2>
              <p className="text-muted-foreground max-w-md">
                Saya adalah asisten AI futuristik yang siap membantu Anda. Mulailah dengan mengirim pesan!
              </p>
            </div>
          )}

          {currentMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                  : 'glass-custom border border-purple-500/30'
              }`}>
                {message.text && (
                  <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-white/90'}`}>
                    {message.text}
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="glass-custom rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder="Ketik pesan Anda di sini..."
                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            <GradientButton
              onClick={handleTextSubmit}
              disabled={!inputText.trim() || isProcessing}
              size="sm"
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Kirim</span>
                </>
              )}
            </GradientButton>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-custom rounded-3xl p-6 w-full max-w-md border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Pengaturan</h2>
                <MagneticButton
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                >
                  ✕
                </MagneticButton>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Mode AI Default</label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value as AIMode)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    {Object.entries(AIMODES).map(([mode, config]) => (
                      <option key={mode} value={mode}>{config.name} - {config.description}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tampilkan Sidebar</label>
                  <div className="flex gap-2">
                    <MagneticButton
                      onClick={() => setShowSidebar(true)}
                      className={`flex-1 px-4 py-2 rounded-xl ${showSidebar ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-white/5 border-white/10'}`}
                    >
                      Ya
                    </MagneticButton>
                    <MagneticButton
                      onClick={() => setShowSidebar(false)}
                      className={`flex-1 px-4 py-2 rounded-xl ${!showSidebar ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-white/5 border-white/10'}`}
                    >
                      Tidak
                    </MagneticButton>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <MagneticButton
                    onClick={() => {
                      setConversations([])
                      setCurrentConversationId(null)
                      setShowSettings(false)
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Hapus Semua Percakapan
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
