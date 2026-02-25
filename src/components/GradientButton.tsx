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
  fullWidthMobile?: boolean // New prop for mobile full-width
}

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  shine = true,
  magnetic = true,
  ripple = true,
  fullWidthMobile = true, // Default to true for mobile-first approach
  ...props
}: GradientButtonProps) {
  const baseClasses = 'relative overflow-hidden rounded-full font-semibold transition-all duration-300 btn-shine touch-target'

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50',
    secondary: 'bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50',
    outline: 'bg-transparent border-2 border-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10',
  }

  // Responsive size classes - larger touch targets on mobile
  const sizeClasses = {
    sm: 'px-4 py-3 sm:px-4 sm:py-2 text-sm',
    md: 'px-6 py-4 sm:px-8 sm:py-3 text-base',
    lg: 'px-8 py-4 sm:px-12 sm:py-4 text-lg',
  }

  // Mobile-first: full width on mobile, auto on sm+
  const widthClasses = fullWidthMobile ? 'w-full sm:w-auto' : ''

  const shineClasses = shine ? 'btn-shine' : ''

  const ButtonComponent = magnetic ? MagneticButton : motion.button

  return (
    <ButtonComponent
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${shineClasses} ${className}`}
      ripple={ripple}
      whileHover={{ scale: magnetic ? 1.05 : 1 }}
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
