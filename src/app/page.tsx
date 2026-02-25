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
import { Rocket, Shield, Zap, Layers, Sparkles, Code2, Palette, TrendingUp, Users, Award, Clock, Target, ArrowRight, Bot, MessageSquare } from 'lucide-react'

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
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">Powered by </span>
            <span className="text-gradient-custom">Innovation</span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Discover the features that make ZEXUS the future of digital experiences
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard key={index} glow glowColor={index % 2 === 0 ? 'cyan' : 'purple'}>
              <motion.div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full glass-custom flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <stat.icon className="w-8 h-8 text-gradient-custom" />
              </motion.div>
              <motion.div
                className="text-4xl sm:text-5xl font-bold text-gradient-custom mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-custom-2">Built for </span>
            <span className="text-white">Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every detail crafted with precision and purpose
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {showcases.map((showcase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <GlassCard variant="gradient-border" className="h-full glow">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                  <showcase.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{showcase.title}</h3>
                <p className="text-muted-foreground mb-6">{showcase.description}</p>
                <ul className="space-y-3">
                  {showcase.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
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

function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background */}
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
          className="glass-custom-strong rounded-3xl p-12 md:p-16"
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Ready to
            <span className="text-gradient-custom block mt-2">Transform?</span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Join thousands of innovators already building the future with ZEXUS
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <GradientButton size="lg" className="group">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
            </GradientButton>
            <GradientButton variant="outline" size="lg" className="!text-white !border-white/20">
              Schedule Demo
            </GradientButton>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-12 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by industry leaders</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
              {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'].map((company, i) => (
                <motion.span
                  key={i}
                  className="text-lg font-semibold text-white"
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

function Footer() {
  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div
            className="text-2xl font-bold text-gradient-custom"
            whileHover={{ scale: 1.05 }}
          >
            ZEXUS
          </motion.div>
          <motion.p
            className="text-sm text-muted-foreground"
            whileHover={{ opacity: 1 }}
          >
            © 2025 ZEXUS. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const { scrollY } = useScroll()
  const navbarBackground = useTransform(scrollY, [0, 50], ['rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.98)'])
  const navbarBlur = useTransform(scrollY, [0, 50], [16, 24])

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

      {/* Background elements */}
      <ParticleBackground />
      <FloatingElements />

      {/* Liquid cursor - desktop only */}
      <LiquidCursor />

      {/* Navigation with scroll-aware background - hidden on AI Assistant page */}
      <AnimatePresence>
        {!showAIAssistant && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.6, delay: 3.2 }}
            style={{
              backgroundColor: navbarBackground,
              backdropFilter: `blur(${navbarBlur}px)`,
              WebkitBackdropFilter: `blur(${navbarBlur}px)`,
            }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-300 shadow-2xl shadow-black/50"
          >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="text-2xl font-bold text-gradient-custom"
              whileHover={{ scale: 1.05 }}
            >
              ZEXUS
            </motion.div>
            <div className="flex items-center gap-3">
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
          </div>
        </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-grow">
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
