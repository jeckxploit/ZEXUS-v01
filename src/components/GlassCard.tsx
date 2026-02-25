'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'gradient-border'
  glow?: boolean
  glowColor?: 'cyan' | 'purple' | 'pink'
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  glow = false,
  glowColor = 'cyan',
  ...props
}: GlassCardProps) {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300'

  const variantClasses = {
    default: 'glass-custom',
    strong: 'glass-strong-custom',
    'gradient-border': 'gradient-border-custom glass-custom',
  }

  const glowClasses = {
    cyan: 'hover:neon-glow-custom',
    purple: 'hover:neon-glow-purple-custom',
    pink: 'hover:neon-glow-pink-custom',
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${glow ? glowClasses[glowColor] : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
