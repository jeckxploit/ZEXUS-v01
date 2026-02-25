'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

interface Ripple {
  x: number
  y: number
  id: number
}

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  ripple?: boolean
  rippleColor?: string
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.5,
  onClick,
  disabled = false,
  ripple = true,
  rippleColor = 'rgba(255, 255, 255, 0.3)'
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleIdRef = useRef(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth magnetic effect
  const springConfig = { damping: 30, stiffness: 400 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    const button = ref.current
    if (!button) return

    const handleMouseMove = (e: MouseEvent) => {
      if (disabled) return

      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY

      // Calculate magnetic pull
      const pullStrength = strength * (rect.width / 2)
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance < rect.width) {
        // Inside magnetic field - pull button towards cursor
        const xMovement = (distanceX / rect.width) * pullStrength
        const yMovement = (distanceY / rect.height) * pullStrength

        x.set(xMovement)
        y.set(yMovement)
      } else {
        // Outside - return to center
        x.set(0)
        y.set(0)
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      x.set(0)
      y.set(0)
    }

    const handleMouseEnter = () => {
      if (!disabled) {
        setIsHovered(true)
      }
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)
    button.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
      button.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [strength, disabled, x, y])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ripple || !ref.current) {
      onClick?.(e)
      return
    }

    const rect = ref.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    const newRipple: Ripple = {
      x: clickX,
      y: clickY,
      id: rippleIdRef.current++,
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  return (
    <motion.button
      ref={ref}
      style={{
        x: springX,
        y: springY,
      }}
      className={`relative overflow-hidden ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
    >
      {children}

      {/* Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: rippleColor,
              width: 0,
              height: 0,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 4,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  )
}
