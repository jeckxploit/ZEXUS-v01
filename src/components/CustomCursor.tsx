'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement[]>([])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  const trailSpringConfig = { damping: 30, stiffness: 200 }
  const trailX = useSpring(mouseX, trailSpringConfig)
  const trailY = useSpring(mouseY, trailSpringConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement
      const isInteractive = !!(target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]'))

      setIsHovering(isInteractive)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-full h-full bg-white rounded-full"
          animate={{
            scale: isHovering ? 2.5 : 1,
            opacity: isHovering ? 0.8 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 28,
          }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: trailX,
          y: trailY,
        }}
      >
        <motion.div
          className="w-full h-full border-2 border-white rounded-full"
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.5 : 0.7,
            borderColor: isHovering ? '#00f5ff' : '#ffffff',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9997]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-full h-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          animate={{
            scale: isHovering ? 1.2 : 1,
            opacity: isHovering ? 0.8 : 0.5,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 30,
          }}
        />
      </motion.div>
    </>
  )
}
