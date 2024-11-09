import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { Bird } from '../types/bird'

interface BirdProps {
  position: [number, number, number]
  speed?: number
  radius?: number
  color?: string
  size?: number
  id: string
  name: string
  species: string
  onBirdClick: (id: string) => void
  obstacles?: Array<{ position: THREE.Vector3, radius: number }>
}

const Bird = ({ position, speed = 1, radius = 1, color = '#8B4513', size = 0.2, id, name, species, onBirdClick, obstacles }: BirdProps) => {
  const [hovered, setHovered] = useState(false)
  const birdRef = useRef<THREE.Group>(null)
  const targetPosition = useRef(new THREE.Vector3(...position))
  
  const offset = useMemo(() => ({
    changeDirectionInterval: 2 + Math.random() * 3,
    lastDirectionChange: 0,
    wingFlapFrequency: 8 + Math.random() * 4,
    maxSpeed: speed * (0.8 + Math.random() * 0.4),
    heightVariation: 1 + Math.random() * 2,
  }), [speed])

  useFrame((state) => {
    if (!birdRef.current) return
    
    const time = state.clock.getElapsedTime()
    const currentPos = birdRef.current.position
    
    // Change direction periodically
    if (time - offset.lastDirectionChange > offset.changeDirectionInterval) {
      offset.lastDirectionChange = time
      targetPosition.current.set(
        position[0] + (Math.random() - 0.5) * radius * 4,
        position[1] + (Math.random() - 0.5) * offset.heightVariation,
        position[2] + (Math.random() - 0.5) * radius * 4
      )
    }

    // Calculate direction to target
    const direction = new THREE.Vector3()
    direction.subVectors(targetPosition.current, currentPos)
    const distance = direction.length()
    direction.normalize()

    // Move towards target with smooth acceleration/deceleration
    const speed = Math.min(offset.maxSpeed * distance * 0.5, offset.maxSpeed)
    currentPos.add(direction.multiplyScalar(speed * 0.016))

    // Rotate bird to face movement direction
    if (distance > 0.01) {
      const targetRotation = Math.atan2(direction.x, direction.z)
      birdRef.current.rotation.y = THREE.MathUtils.lerp(
        birdRef.current.rotation.y,
        targetRotation,
        0.1
      )
    }

    // Wing flapping animation
    birdRef.current.rotation.z = Math.sin(time * offset.wingFlapFrequency) * 0.3
  })

  return (
    <group 
      ref={birdRef} 
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onBirdClick(id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Bird body */}
      <mesh castShadow>
        <sphereGeometry args={[size, 32, 16]} />
        <meshStandardMaterial 
          color={hovered ? '#A0522D' : color}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Wings */}
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[0, 0, side * size * 0.8]}>
          <planeGeometry args={[size * 2, size]} />
          <meshStandardMaterial 
            color={color}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Tail */}
      <mesh castShadow position={[-size * 1.2, 0, 0]}>
        <coneGeometry args={[size * 0.3, size * 0.8, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {hovered && (
        <Html>
          <div className="bg-white/90 px-2 py-1 rounded text-sm shadow-lg pointer-events-none">
            <p className="font-bold">{name}</p>
            <p className="text-xs text-gray-600">{species}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

const Trees = () => {
  return (
    <group>
      {Array.from({ length: 15 }).map((_, i) => {
        const scale = 0.5 + Math.random() * 1
        const position: [number, number, number] = [
          -20 + Math.random() * 40,
          scale * 2,
          -20 + Math.random() * 40
        ]
        return (
          <group key={i} position={position} scale={[scale, scale, scale]}>
            {/* Tree trunk */}
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.5, 4]} />
              <meshStandardMaterial color="#4A3728" />
            </mesh>
            {/* Tree foliage */}
            <mesh castShadow position={[0, 2.5, 0]}>
              <coneGeometry args={[2, 4, 8]} />
              <meshStandardMaterial color="#2D5A27" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

interface BirdSanctuarySceneProps {
  birds: Bird[]
  onBirdClick: (id: string) => void
}

const BirdSanctuaryScene: FC<BirdSanctuarySceneProps> = ({ birds, onBirdClick }) => {
  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 30, 100]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={1.5}
        shadow-mapSize={2048}
      />
      
      {/* Ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      <Trees />
      
      {birds.map((bird) => (
        <Bird
          key={bird.id}
          {...bird}
          position={bird.pos}
          onBirdClick={onBirdClick}
        />
      ))}
    </>
  )
}

export default BirdSanctuaryScene 