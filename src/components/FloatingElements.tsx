'use client'

import { motion } from 'framer-motion'

export default function FloatingElements() {
  const elements = [
    { size: 60, color: 'from-cyan-500/20 to-cyan-500/5', top: '10%', left: '10%', delay: 0 },
    { size: 80, color: 'from-purple-500/20 to-purple-500/5', top: '20%', right: '15%', delay: 0.5 },
    { size: 50, color: 'from-pink-500/20 to-pink-500/5', top: '60%', left: '20%', delay: 1 },
    { size: 70, color: 'from-blue-500/20 to-blue-500/5', top: '70%', right: '10%', delay: 1.5 },
    { size: 40, color: 'from-green-500/20 to-green-500/5', top: '40%', left: '5%', delay: 2 },
    { size: 90, color: 'from-yellow-500/20 to-yellow-500/5', top: '80%', left: '40%', delay: 2.5 },
    { size: 55, color: 'from-red-500/20 to-red-500/5', top: '15%', left: '60%', delay: 3 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${element.color} backdrop-blur-sm`}
          style={{
            width: element.size,
            height: element.size,
            top: element.top,
            left: element.left || 'auto',
            right: element.right || 'auto',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8 + index,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: element.delay,
          }}
        />
      ))}

      {/* Geometric shapes */}
      <motion.div
        className="absolute top-32 right-32 w-16 h-16 border-2 border-cyan-500/30 rotate-45"
        animate={{
          rotate: [45, 225, 45],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute bottom-40 left-20 w-12 h-12 border-2 border-purple-500/30 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-8 h-8 bg-gradient-to-r from-pink-500/30 to-cyan-500/30 rounded-lg"
        animate={{
          rotate: [0, 360],
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{
            width: '100%',
            top: `${30 + i * 20}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scaleX: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
