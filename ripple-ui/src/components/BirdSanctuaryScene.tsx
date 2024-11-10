import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { Bird } from '../types/bird'
import { useLoader } from '@react-three/fiber'
import { EXRLoader } from 'three-stdlib'
import { useTextures } from '../hooks/useTextures'
import RockModel from './RockModel'

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
    heightVariation: 3 + Math.random() * 4,
    baseHeight: 5 + Math.random() * 3,
  }), [speed])

  const wingState = useRef({
    flapOffset: Math.random() * Math.PI * 2,
    flapSpeed: 12 + Math.random() * 4
  })

  useFrame((state) => {
    if (!birdRef.current) return
    
    const time = state.clock.getElapsedTime()
    const currentPos = birdRef.current.position
    
    if (time - offset.lastDirectionChange > offset.changeDirectionInterval) {
      offset.lastDirectionChange = time
      targetPosition.current.set(
        position[0] + (Math.random() - 0.5) * radius * 4,
        offset.baseHeight + (Math.random() - 0.5) * offset.heightVariation,
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

    const wingFlap = Math.sin(time * wingState.current.flapSpeed + wingState.current.flapOffset)
    const wingUpDown = Math.abs(wingFlap) * 0.8 
    const wingTwist = wingFlap * 0.3 
    
    birdRef.current.children.forEach(child => {
      if (child.userData.wing) {
        child.rotation.z = wingFlap * 0.6
        child.rotation.y = wingTwist
        child.position.y = wingUpDown * 0.1
      }
    })

    birdRef.current.rotation.z = Math.sin(time * 2) * 0.05
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
      <mesh castShadow>
        <capsuleGeometry args={[size * 0.15, size * 0.4, 8, 16]} />
        <meshStandardMaterial 
          color={hovered ? '#FF9A8B' : color}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Head and neck */}
      <group position={[size * 0.25, size * 0.1, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[size * 0.12, size * 0.15, 8, 16]} rotation={[0, 0, Math.PI / 3]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh castShadow position={[size * 0.15, size * 0.05, 0]}>
          <sphereGeometry args={[size * 0.12, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Beak */}
        <mesh castShadow position={[size * 0.25, 0, 0]}>
          <coneGeometry args={[size * 0.05, size * 0.2, 8]} rotation={[0, 0, -Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      </group>

      {/* Wings with more detail */}
      {[-1, 1].map((side) => (
        <group 
          key={side} 
          position={[0, size * 0.1, side * size * 0.15]}
          userData={{ wing: true }}
        >
          <mesh castShadow>
            <bufferGeometry>
              <bufferAttribute 
                attach="attributes-position"
                count={4}
                itemSize={3}
                array={new Float32Array([
                  0, 0, 0,
                  -size * 0.4, 0, side * size * 0.3,
                  -size * 0.8, 0, side * size * 0.6,
                  -size * 1.2, -size * 0.1, side * size * 0.3,
                ])}
              />
              <bufferAttribute
                attach="index"
                array={new Uint16Array([0, 1, 2, 2, 3, 0])}
                count={6}
                itemSize={1}
              />
            </bufferGeometry>
            <meshStandardMaterial 
              color={color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Tail feathers */}
      <group position={[-size * 0.4, 0, 0]}>
        {[-1, 0, 1].map((side, i) => (
          <mesh key={i} castShadow position={[0, 0, side * size * 0.1]}>
            <coneGeometry 
              args={[size * 0.08, size * 0.4, 4]} 
              rotation={[0, 0, Math.PI / 2 + (side * Math.PI / 12)]} 
            />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>

      {/* Info tooltip */}
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

const TreeCluster = ({ position, density = 1, distanceFromCenter = 0 }) => {
  // Fade out trees based on distance from center
  const opacity = Math.max(0.2, 1 - (distanceFromCenter / 200))
  const scale = Math.max(0.3, 1 - (distanceFromCenter / 300))
  
  return (
    <group position={position}>
      {Array.from({ length: Math.floor(8 * density) }).map((_, i) => {
        const treeScale = (0.5 + Math.random() * 1.5) * scale
        const offset: [number, number, number] = [
          -15 + Math.random() * 30,
          treeScale * 2,
          -15 + Math.random() * 30
        ]
        return (
          <group key={i} position={offset} scale={[treeScale, treeScale, treeScale]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.5, 4]} />
              <meshStandardMaterial 
                color="#4A3728" 
                roughness={0.8}
                transparent
                opacity={opacity}
              />
            </mesh>
            {[0, 1, 2].map((layer) => (
              <mesh 
                key={layer} 
                castShadow 
                position={[0, 2 + layer * 1.2, 0]}
              >
                <coneGeometry args={[2 - layer * 0.4, 2, 8]} />
                <meshStandardMaterial 
                  color={`hsl(${100 + Math.random() * 40}, 40%, ${30 + layer * 10}%)`}
                  roughness={0.8}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

const Trees = () => {
  const rings = 8
  const treeClusters = []
  
  for (let ring = 0; ring < rings; ring++) {
    const radius = 30 + ring * 40
    const clustersInRing = Math.floor(6 + ring * 3)
    
    for (let i = 0; i < clustersInRing; i++) {
      const angle = (i / clustersInRing) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      treeClusters.push({
        position: [x, 0, z] as [number, number, number],
        density: 1 + ring * 0.3,
        distanceFromCenter: radius
      })
    }
  }

  return (
    <group>
      {treeClusters.map((cluster, i) => (
        <TreeCluster 
          key={i}
          position={cluster.position}
          density={cluster.density}
          distanceFromCenter={cluster.distanceFromCenter}
        />
      ))}
    </group>
  )
}

const Rocks = () => {
  return (
    <group>
      {Array.from({ length: 50 }).map((_, i) => {
        const scale = 0.5 + Math.random() * 2
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 100
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          scale * 0.5 - 0.3,
          Math.sin(angle) * radius
        ]

        return (
          <RockModel
            key={i}
            position={position}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
            scale={[scale, scale * 0.8, scale]}
          />
        )
      })}
    </group>
  )
}

const Mountains = () => {
  return (
    <group>
      {Array.from({ length: 12 }).map((_, i) => {
        const scale = 15 + Math.random() * 25
        const angle = (i / 12) * Math.PI * 2
        const radius = 80 + Math.random() * 40
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <group 
            key={i} 
            position={[x, scale * 0.3, z]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            {/* Mountain base */}
            <mesh castShadow receiveShadow>
              <coneGeometry args={[scale * 0.8, scale, 6]} />
              <meshStandardMaterial 
                color="#4B5320"
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
            
            {/* Snow cap */}
            <mesh castShadow position={[0, scale * 0.3, 0]}>
              <coneGeometry args={[scale * 0.3, scale * 0.4, 6]} />
              <meshStandardMaterial 
                color="white"
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

const Clouds = () => {
  return (
    <group>
      {Array.from({ length: 30 }).map((_, i) => {
        const scale = 2 + Math.random() * 4
        const angle = Math.random() * Math.PI * 2
        const radius = 20 + Math.random() * 100
        const height = 20 + Math.random() * 15
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <group 
            key={i} 
            position={[x, height, z]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            {/* Create cloud clusters using multiple overlapping spheres */}
            {Array.from({ length: 5 }).map((_, j) => {
              const cloudScale = scale * (0.7 + Math.random() * 0.6)
              const offset = {
                x: (Math.random() - 0.5) * scale * 1.5,
                y: (Math.random() - 0.5) * scale * 0.5,
                z: (Math.random() - 0.5) * scale * 1.5
              }
              
              return (
                <mesh 
                  key={j} 
                  position={[offset.x, offset.y, offset.z]}
                  scale={[cloudScale, cloudScale * 0.6, cloudScale]}
                >
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial 
                    color="white" 
                    transparent 
                    opacity={0.8 - (radius / 150)}
                    roughness={1}
                  />
                </mesh>
              )
            })}
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
      <color attach="background" args={['#E6F4F1']} />
      <fog attach="fog" args={['#E6F4F1', 60, 300]} /> {/* Increased fog distance */}
      
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={1.2}
        shadow-mapSize={2048}
      >
        <orthographicCamera attach="shadow-camera" args={[-100, 100, 100, -100, 0.1, 200]} />
      </directionalLight>
      <hemisphereLight 
        args={['#E6F4F1', '#D4E6E1', 0.7]} 
        position={[0, 50, 0]} 
      />
      
      {/* Ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]} 
        receiveShadow
      >
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial 
          color="#D4E6E1"
          roughness={1}
          metalness={0}
        />
      </mesh>

      <Mountains />
      <Trees />
      <Rocks />
      <Clouds />
      
      {birds.map((bird) => (
        <Bird
          key={bird.id}
          {...bird}
          position={[bird.pos[0], bird.pos[1] + 8, bird.pos[2]]}
          onBirdClick={onBirdClick}
        />
      ))}
    </>
  )
}

export default BirdSanctuaryScene 