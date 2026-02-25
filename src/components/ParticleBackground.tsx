'use client'

import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { type Container, type ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

export default function ParticleBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Silent load - no console logs in production
  }

  const options: ISourceOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60, // Reduced from 120 for better performance
    interactivity: {
      events: {
        onClick: {
          enable: false, // Disable for performance
        },
        onHover: {
          enable: true,
          mode: 'bubble', // Simpler than grab
        },
      },
      modes: {
        bubble: {
          distance: 300,
          size: 20,
          duration: 1,
          opacity: 0.3,
        },
      },
    },
    particles: {
      color: {
        value: ['#00f5ff', '#a855f7', '#ff006e', '#3b82f6'],
      },
      links: {
        color: '#ffffff',
        distance: 120,
        enable: true,
        opacity: 0.05, // Reduced opacity
        width: 0.5, // Thinner links
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'out', // Faster than bounce
        },
        random: false,
        speed: 0.8, // Slower for calmer effect
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 40, // Reduced from 80
      },
      opacity: {
        value: 0.3, // Reduced from 0.5
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 2 }, // Smaller particles
      },
    },
    detectRetina: true,
    backgroundMask: {
      enable: false,
    },
  }

  if (!init) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="absolute inset-0"
      />
    </div>
  )
}
