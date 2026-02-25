'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="loading-screen"
        >
          <div className="relative flex flex-col items-center gap-8">
            {/* Animated Logo/Icon */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative w-24 h-24">
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-cyan-500/30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Middle ring */}
                <motion.div
                  className="absolute inset-2 rounded-full border-4 border-purple-500/50"
                  animate={{
                    scale: [1, 0.9, 1],
                    opacity: [0.5, 0.8, 0.5],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Inner ring */}
                <motion.div
                  className="absolute inset-4 rounded-full border-4 border-pink-500/70"
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Center dot */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full neon-glow" />
                </motion.div>
              </div>
            </motion.div>

            {/* Loading Text */}
            <div className="relative">
              <motion.h1
                className="loading-text"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ZEXUS
              </motion.h1>
              <motion.div
                className="absolute -inset-4 blur-2xl opacity-50"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(0,245,255,0.4) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(255,0,110,0.4) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(0,245,255,0.4) 0%, transparent 70%)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                style={{
                  width: `${Math.min(progress, 100)}%`
                }}
                transition={{
                  duration: 0.1
                }}
              />
            </div>

            {/* Percentage */}
            <motion.p
              className="text-sm text-muted-foreground tracking-widest"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {Math.round(Math.min(progress, 100))}%
            </motion.p>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#00f5ff' : i % 3 === 0 ? '#a855f7' : '#ff006e',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: (i - 2.5) * 100,
                  y: Math.sin(i * 60) * 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
