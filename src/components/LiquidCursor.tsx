'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface TrailDot {
  id: number
  x: number
  y: number
  scale: number
  opacity: number
}

export default function LiquidCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<HTMLDivElement[]>([])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for main cursor
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  // Reduced from 8 to 4 trails for better performance
  const trailSpringX1 = useSpring(mouseX, { damping: 34, stiffness: 180 })
  const trailSpringY1 = useSpring(mouseY, { damping: 34, stiffness: 180 })
  const trailSpringX2 = useSpring(mouseX, { damping: 28, stiffness: 160 })
  const trailSpringY2 = useSpring(mouseY, { damping: 28, stiffness: 160 })
  const trailSpringX3 = useSpring(mouseX, { damping: 22, stiffness: 140 })
  const trailSpringY3 = useSpring(mouseY, { damping: 22, stiffness: 140 })
  const trailSpringX4 = useSpring(mouseX, { damping: 16, stiffness: 120 })
  const trailSpringY4 = useSpring(mouseY, { damping: 16, stiffness: 120 })

  const trailSprings = [
    { x: trailSpringX1, y: trailSpringY1 },
    { x: trailSpringX2, y: trailSpringY2 },
    { x: trailSpringX3, y: trailSpringY3 },
    { x: trailSpringX4, y: trailSpringY4 },
  ]

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
      {/* Liquid Trail */}
      {trailSprings.map((spring, index) => (
        <motion.div
          key={index}
          ref={(el) => { if (el) trailsRef.current[index] = el }}
          className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
          style={{
            x: spring.x,
            y: spring.y,
          }}
          initial={{ scale: 0 }}
          animate={{
            scale: isHovering ? [0.5, 0.8, 0.5] : 0.4,
            opacity: 1 - index * 0.12,
          }}
          transition={{
            scale: {
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.05,
            },
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: 20 - index * 2,
              height: 20 - index * 2,
              background: `linear-gradient(135deg, 
                ${index % 3 === 0 ? '#00f5ff' : index % 3 === 1 ? '#a855f7' : '#ff006e'}80,
                ${index % 3 === 0 ? '#a855f7' : index % 3 === 1 ? '#ff006e' : '#00f5ff'}80
              )`,
              filter: `blur(${index * 0.5}px)`,
            }}
          />
        </motion.div>
      ))}

      {/* Main Liquid Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        {/* Liquid blob */}
        <motion.div
          className="relative"
          animate={{
            scale: isHovering ? 2.5 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 28,
          }}
        >
          {/* Inner core */}
          <motion.div
            className="w-4 h-4 rounded-full bg-white"
            animate={{
              scale: [1, 1.2, 1],
              borderRadius: ['50%', '40%', '50%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Liquid ripples */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.8, 0.4, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Glow effect */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl"
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
      </motion.div>

      {/* Click ripple effect */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: cursorX,
            y: cursorY,
          }}
        >
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full border border-white/20"
              animate={{
                width: [0, 40],
                height: [0, 40],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </>
  )
}
