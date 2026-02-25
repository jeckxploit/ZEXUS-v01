'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import ParticleBackground from '@/components/ParticleBackground'
import LiquidCursor from '@/components/LiquidCursor'
import HeroSection from '@/components/HeroSection'
import FloatingElements from '@/components/FloatingElements'
import GlassCard from '@/components/GlassCard'
import GradientButton from '@/components/GradientButton'

import AIAssistantPage from '@/components/AIAssistantPage'
import { Rocket, Shield, Zap, Layers, Sparkles, Code2, Palette, TrendingUp, Users, Award, Clock, Target, ArrowRight, Bot, MessageSquare, Menu, X } from 'lucide-react'

// Responsive FeatureSection
function FeatureSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-100px" })

  const features = [
    {
      icon: Rocket,
      title: 'Lightning Performance',
      description: 'Optimized for speed with cutting-edge technology that delivers instant experiences.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols to protect your data.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Intelligent automation that learns and adapts to your needs.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Layers,
      title: 'Modular Design',
      description: 'Flexible architecture that scales with your ambitions.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Beautiful UI',
      description: 'Stunning visuals that captivate and engage your audience.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Code2,
      title: 'Developer First',
      description: 'Built with developers in mind, offering seamless integration.',
      gradient: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <section ref={ref} className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.h2
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">Powered by </span>
            <span className="text-gradient-custom">Innovation</span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Discover the features that make ZEXUS the future of digital experiences
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <GlassCard key={index} glow glowColor={index % 2 === 0 ? 'cyan' : 'purple'}>
              <motion.div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// Responsive StatsSection
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-100px" })

  const stats = [
    { value: '99.9%', label: 'Uptime', icon: Clock },
    { value: '10M+', label: 'Users', icon: Users },
    { value: '500+', label: 'Features', icon: Sparkles },
    { value: '50+', label: 'Awards', icon: Award },
  ]

  return (
    <section ref={ref} className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full glass-custom flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gradient-custom" />
              </motion.div>
              <motion.div
                className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gradient-custom mb-1 sm:mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs sm:text-base text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Responsive ShowcaseSection
function ShowcaseSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-100px" })

  const showcases = [
    {
      icon: Palette,
      title: 'Design System',
      description: 'Comprehensive design tokens and components for consistent experiences.',
      items: ['Color Palettes', 'Typography', 'Components', 'Animations'],
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Real-time insights and analytics to drive informed decisions.',
      items: ['User Metrics', 'Performance', 'Engagement', 'Conversion'],
    },
    {
      icon: Target,
      title: 'Automation',
      description: 'Powerful automation tools to streamline your workflows.',
      items: ['Workflows', 'Triggers', 'Actions', 'Integrations'],
    },
  ]

  return (
    <section ref={ref} className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 px-2">
            <span className="text-gradient-custom-2">Built for </span>
            <span className="text-white">Excellence</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Every detail crafted with precision and purpose
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {showcases.map((showcase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <GlassCard variant="gradient-border" className="h-full glow">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 sm:mb-6">
                  <showcase.icon className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{showcase.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{showcase.description}</p>
                <ul className="space-y-2 sm:space-y-3">
                  {showcase.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.2 + i * 0.1 }}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Responsive CTASection
function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-custom-strong rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16"
        >
          <motion.h2
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Ready to
            <span className="text-gradient-custom block mt-2">Transform?</span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Join thousands of innovators already building the future with ZEXUS
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <GradientButton size="lg" className="group w-full justify-center">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
            </GradientButton>
            <GradientButton variant="outline" size="lg" className="!text-white !border-white/20 w-full justify-center">
              Schedule Demo
            </GradientButton>
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Trusted by industry leaders</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 items-center opacity-50 px-4">
              {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'].map((company, i) => (
                <motion.span
                  key={i}
                  className="text-sm sm:text-lg font-semibold text-white"
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {company}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Responsive Footer
function Footer() {
  return (
    <footer className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <motion.div
            className="text-xl sm:text-2xl font-bold text-gradient-custom"
            whileHover={{ scale: 1.05 }}
          >
            ZEXUS
          </motion.div>
          <motion.p
            className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right"
            whileHover={{ opacity: 1 }}
          >
            © 2025 ZEXUS. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}

// Responsive Navbar with Hamburger Menu
function Navbar({ showAIAssistant, setShowAIAssistant }: { showAIAssistant: boolean; setShowAIAssistant: (value: boolean) => void }) {
  const { scrollY } = useScroll()
  const navbarBackground = useTransform(scrollY, [0, 50], ['rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.98)'])
  const navbarBlur = useTransform(scrollY, [0, 50], [16, 24])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        backgroundColor: navbarBackground,
        backdropFilter: `blur(${navbarBlur}px)`,
        WebkitBackdropFilter: `blur(${navbarBlur}px)`,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-300 shadow-2xl shadow-black/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <motion.div
            className="text-xl sm:text-2xl font-bold text-gradient-custom"
            whileHover={{ scale: 1.05 }}
          >
            ZEXUS
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-3">
            <GradientButton
              size="sm"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className={showAIAssistant ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              {showAIAssistant ? (
                <>
                  <Bot className="w-4 h-4 inline mr-2" />
                  Landing
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  AI Assistant
                </>
              )}
            </GradientButton>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            className="sm:hidden p-2 touch-target flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <GradientButton
                size="md"
                fullWidthMobile
                onClick={() => {
                  setShowAIAssistant(!showAIAssistant)
                  setIsMenuOpen(false)
                }}
                className={showAIAssistant ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
              >
                {showAIAssistant ? (
                  <>
                    <Bot className="w-5 h-5 inline mr-2" />
                    Landing
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 inline mr-2" />
                    AI Assistant
                  </>
                )}
              </GradientButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <ParticleBackground />
      <FloatingElements />

      {/* Liquid cursor - desktop only */}
      <LiquidCursor />

      {/* Navigation */}
      <AnimatePresence>
        {!showAIAssistant && (
          <Navbar showAIAssistant={showAIAssistant} setShowAIAssistant={setShowAIAssistant} />
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-grow pt-14 sm:pt-16">
        <AnimatePresence mode="wait">
          {!showAIAssistant ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection />
              <FeatureSection />
              <StatsSection />
              <ShowcaseSection />
              <CTASection />
            </motion.div>
          ) : (
            <motion.div
              key="ai-assistant"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIAssistantPage onBack={() => setShowAIAssistant(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!showAIAssistant && <Footer />}
    </div>
  )
}
