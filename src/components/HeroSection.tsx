'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Rocket, Sparkles, Cpu, Globe } from 'lucide-react'
import GradientButton from './GradientButton'
import ThreeHero from './ThreeHero'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      {/* 3D Interactive Hero Background */}
      <ThreeHero />

      {/* Background gradient orbs - scaled down on mobile */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-pink-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Floating geometric shapes - hidden on very small screens, scaled on mobile */}
      <motion.div
        className="hidden xs:block absolute top-20 right-20 w-12 h-12 sm:w-20 sm:h-20 border-2 border-cyan-500/30 rotate-45"
        animate={{
          rotate: [45, 225, 45],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="hidden xs:block absolute bottom-32 left-16 w-10 h-10 sm:w-16 sm:h-16 border-2 border-purple-500/30 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="hidden xs:block absolute top-40 left-32 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-lg"
        animate={{
          rotate: [0, 360],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge - smaller on mobile */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-8">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-custom text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
            </motion.div>
            <span className="text-gradient-custom font-semibold">Next Generation Experience</span>
          </motion.div>
        </motion.div>

        {/* Main heading - responsive sizing */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight px-2"
        >
          <span className="text-white">Welcome to </span>
          <motion.span
            className="text-gradient-custom inline-block"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% auto',
            }}
          >
            ZEXUS
          </motion.span>
        </motion.h1>

        {/* Subtitle - responsive */}
        <motion.p
          variants={itemVariants}
          className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-4 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
        >
          Experience the future of{' '}
          <span className="text-gradient-2-custom font-semibold">digital innovation</span>.
          Where{' '}
          <span className="text-gradient-3-custom font-semibold">creativity</span> meets{' '}
          <span className="text-gradient-custom font-semibold">technology</span>.
        </motion.p>

        {/* Description - responsive */}
        <motion.p
          variants={itemVariants}
          className="text-sm xs:text-base sm:text-lg text-muted-foreground/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
        >
          Step into a world of limitless possibilities. Powered by cutting-edge technology,
          designed for the visionaries of tomorrow.
        </motion.p>

        {/* CTA Buttons - stacked on mobile, full width */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md mx-auto px-4"
        >
          <GradientButton size="lg" className="group w-full sm:w-auto justify-center">
            Get Started
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowRight className="w-5 h-5 inline" />
            </motion.span>
          </GradientButton>
          <GradientButton variant="outline" size="lg" className="!text-white !border-white/20 hover:!border-cyan-500/50 w-full sm:w-auto justify-center">
            <Rocket className="w-5 h-5 inline mr-2" />
            Explore Features
          </GradientButton>
        </motion.div>

        {/* Feature icons - single column on mobile */}
        <motion.div
          variants={itemVariants}
          className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4"
        >
          {[
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Powered by next-gen technology',
              gradient: 'from-yellow-400 to-orange-500',
            },
            {
              icon: Cpu,
              title: 'AI Powered',
              description: 'Intelligent automation',
              gradient: 'from-cyan-400 to-blue-500',
            },
            {
              icon: Globe,
              title: 'Global Scale',
              description: 'Connect worldwide',
              gradient: 'from-green-400 to-emerald-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-custom rounded-2xl p-4 sm:p-6 text-center"
              whileHover={{
                scale: 1.05,
                y: -10,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <motion.div
                className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
