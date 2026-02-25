'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import MagneticButton from './MagneticButton'

interface GradientButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  shine?: boolean
  magnetic?: boolean
  ripple?: boolean
}

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  shine = true,
  magnetic = true,
  ripple = true,
  ...props
}: GradientButtonProps) {
  const baseClasses = 'relative overflow-hidden rounded-full font-semibold transition-all duration-300 btn-shine'

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50',
    secondary: 'bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50',
    outline: 'bg-transparent border-2 border-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg',
  }

  const shineClasses = shine ? 'btn-shine' : ''

  const ButtonComponent = magnetic ? MagneticButton : motion.button

  return (
    <ButtonComponent
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${shineClasses} ${className}`}
      ripple={ripple}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {children}
      {shine && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
    </ButtonComponent>
  )
}
