'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Futuristic 3D Object Component
function FuturisticObject() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Auto-rotation when not hovered
      if (!hovered) {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
      }

      // Pulse effect on hover
      const scale = hovered ? 1.1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.05 : 1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  // Geometry - Torus Knot for complex futuristic look
  const geometry = useMemo(() => new THREE.TorusKnotGeometry(2.5, 0.7, 200, 32), [])

  // Materials layered for visual depth
  const materials = useMemo(
    () => ({
      wireframe: new THREE.MeshBasicMaterial({
        color: hovered ? 0x00f5ff : 0xa855f7,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      }),
      emissive: new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: hovered ? 0x00f5ff : 0xa855f7,
        emissiveIntensity: hovered ? 0.8 : 0.3,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
      }),
      core: new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff006e,
        emissiveIntensity: 0.2,
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.3,
      }),
    }),
    [hovered]
  )

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Core mesh */}
        <primitive object={materials.core} attach="material" />
      </mesh>

      {/* Outer wireframe mesh */}
      <mesh
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={[1.1, 1.1, 1.1]}
      >
        <primitive object={materials.wireframe} attach="material" />
      </mesh>

      {/* Inner glow mesh */}
      <mesh
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={[1.05, 1.05, 1.05]}
      >
        <primitive object={materials.emissive} attach="material" />
      </mesh>
    </Float>
  )
}

// Particle System Component
function Particles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 300

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const colorPalette = [
      new THREE.Color(0x00f5ff), // Cyan
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0xff006e), // Pink
    ]

    for (let i = 0; i < particleCount; i++) {
      // Position in a sphere around the center
      const radius = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5
    }

    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      // Gentle rotation of entire particle system
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
    }
  })

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1))
    return geo
  }, [particles])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    []
  )

  return <points ref={particlesRef} geometry={geometry} material={material} />
}

// Ambient Rings Component
function AmbientRings() {
  const ringsRef = useRef<THREE.Group>(null)

  const rings = useMemo(() => {
    const geometries: { geometry: THREE.TorusGeometry; material: THREE.MeshBasicMaterial }[] = []
    const ringConfigs = [
      { radius: 4, tube: 0.02, radialSegments: 16, tubularSegments: 100, color: 0x00f5ff },
      { radius: 5, tube: 0.02, radialSegments: 16, tubularSegments: 100, color: 0xa855f7 },
      { radius: 6, tube: 0.02, radialSegments: 16, tubularSegments: 100, color: 0xff006e },
    ]

    ringConfigs.forEach((config) => {
      const geometry = new THREE.TorusGeometry(config.radius, config.tube, config.radialSegments, config.tubularSegments)
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      })
      geometries.push({ geometry, material })
    })

    return geometries
  }, [])

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        const speed = 0.1 + index * 0.05
        ring.rotation.z = state.clock.getElapsedTime() * speed
        ring.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2 + index) * 0.2
      })
    }
  })

  return (
    <group ref={ringsRef}>
      {rings.map((ring, index) => (
        <mesh key={index} geometry={ring.geometry} material={ring.material} />
      ))}
    </group>
  )
}

// Lighting Setup
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color={0x00f5ff} />
      <directionalLight position={[-10, -10, -5]} intensity={0.6} color={0xff006e} />
      <pointLight position={[5, 5, 5]} intensity={1} color={0xa855f7} distance={20} />
      <pointLight position={[-5, -5, 5]} intensity={1} color={0x00f5ff} distance={20} />
    </>
  )
}

// Main Component
export default function ThreeHero() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
          style={{
            background: 'transparent',
          }}
        >
          <SceneLights />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={6}
            maxDistance={20}
            autoRotate={false}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
          <FuturisticObject />
          <Particles />
          <AmbientRings />
        </Canvas>
      </div>
    </div>
  )
}
