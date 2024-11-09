import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { Fish } from '../types/fish'

interface FishProps {
  position: [number, number, number]
  speed?: number
  radius?: number
  color?: string
  size?: number
  id: string
  name: string
  species: string
  onFishClick: (id: string) => void
  obstacles?: Array<{ position: THREE.Vector3, radius: number }>
}

const Fish = ({ position, speed = 1, radius = 1, color = '#FA8072', size = 0.2, id, name, species, onFishClick, obstacles }: FishProps) => {
  const [hovered, setHovered] = useState(false)
  const fishRef = useRef<THREE.Group>(null)
  const targetPosition = useRef(new THREE.Vector3(...position))
  
  const offset = useMemo(() => ({
    changeDirectionInterval: 2 + Math.random() * 3,
    lastDirectionChange: 0,
    verticalFrequency: 0.3 + Math.random() * 0.2,
    wiggleFrequency: 8 + Math.random() * 4,
    maxSpeed: speed * (0.8 + Math.random() * 0.4),
  }), [speed])

  useFrame((state) => {
    if (!fishRef.current) return
    
    const time = state.clock.getElapsedTime()
    const currentPos = fishRef.current.position
    
    // Change direction periodically
    if (time - offset.lastDirectionChange > offset.changeDirectionInterval) {
      offset.lastDirectionChange = time
      targetPosition.current.set(
        position[0] + (Math.random() - 0.5) * radius * 2,
        position[1] + (Math.random() - 0.5) * 0.5,
        position[2] + (Math.random() - 0.5) * radius * 2
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

    // Add vertical bobbing
    currentPos.y += Math.sin(time * offset.verticalFrequency) * 0.002

    // Rotate fish to face movement direction
    if (distance > 0.01) {
      const targetRotation = Math.atan2(direction.x, direction.z)
      fishRef.current.rotation.y = THREE.MathUtils.lerp(
        fishRef.current.rotation.y,
        targetRotation,
        0.1
      )
    }

    // Add subtle body wiggle
    fishRef.current.rotation.z = Math.sin(time * offset.wiggleFrequency) * 0.05
  })

  return (
    <group 
      ref={fishRef} 
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onFishClick(id)
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
      {/* Fish body */}
      <mesh castShadow>
        <sphereGeometry args={[size * (hovered ? 1.1 : 1), 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? '#FFB6C1' : color}
          roughness={0.3}
          metalness={0.2}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* Fish tail */}
      <mesh castShadow position={[-size * 1.5, 0, 0]}>
        <coneGeometry args={[size * 0.6, size * 1.2, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Fish fins */}
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[0, 0, side * size * 0.8]}>
          <coneGeometry args={[size * 0.3, size * 0.6, 16]} rotation={[0, 0, side * Math.PI * 0.15]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}

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

const WaterEffect = () => {
  const waterRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!waterRef.current) return
    const time = state.clock.getElapsedTime()
    waterRef.current.material.uniforms.uTime.value = time
  })

  return (
    <mesh ref={waterRef}>
      <sphereGeometry args={[50, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        transparent
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position;
            float displacement = sin(pos.x * 0.2 + pos.y * 0.3 + pos.z * 0.2) * 0.5;
            pos += normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vec2 uv = vUv;
            float depth = gl_FragCoord.z;
            float wave = sin(vPosition.x * 0.05 + vPosition.y * 0.05 + uTime * 0.5) * 0.5;
            float caustic = abs(sin(vPosition.x * 0.1 - uTime) * sin(vPosition.y * 0.1 - uTime));
            vec3 color = vec3(0.1, 0.3, 0.5);
            color += vec3(wave + caustic * 0.1) * (1.0 - depth * 0.5);
            float alpha = 0.2 + caustic * 0.05;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  )
}

const Decorations = () => {
  return (
    <group>
      {/* Coral formations */}
      {Array.from({ length: 8 }).map((_, i) => {
        const scale = 0.3 + Math.random() * 0.4
        return (
          <mesh
            key={i}
            position={[
              -3 + Math.random() * 6,
              -0.9,
              -1.5 + Math.random() * 3
            ]}
            scale={[scale, scale * 1.5, scale]}
          >
            <cylinderGeometry args={[0.2, 0.4, 1, 8]} />
            <meshStandardMaterial
              color={`hsl(${Math.random() * 60 + 340}, 70%, 70%)`}
              roughness={0.8}
            />
          </mesh>
        )
      })}

      {/* Seaweed */}
      {Array.from({ length: 12 }).map((_, i) => {
        const height = 1 + Math.random() * 1.5
        return (
          <mesh
            key={`seaweed-${i}`}
            position={[
              -4 + Math.random() * 8,
              -1 + height / 2,
              -2 + Math.random() * 4
            ]}
          >
            <cylinderGeometry args={[0.05, 0.05, height, 8]} />
            <meshStandardMaterial
              color="#2F4F4F"
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}

      {/* Sand with texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 6, 32, 32]} />
        <meshStandardMaterial
          color="#e6d5ac"
          roughness={1}
          metalness={0}
          onBeforeCompile={(shader) => {
            shader.uniforms.time = { value: 0 }
            shader.vertexShader = `
              varying vec3 vPosition;
              ${shader.vertexShader}
            `.replace(
              '#include <begin_vertex>',
              `
                #include <begin_vertex>
                vPosition = position;
                float wave = sin(position.x * 2.0 + position.z * 2.0) * 0.1;
                transformed.y += wave;
              `
            )
          }}
        />
      </mesh>

      {/* Rocks */}
      {Array.from({ length: 6 }).map((_, i) => {
        const scale = 0.4 + Math.random() * 0.6
        return (
          <mesh
            key={`rock-${i}`}
            position={[
              -4 + Math.random() * 8,
              -0.8,
              -2 + Math.random() * 4
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
            scale={scale}
          >
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color="#666666"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

const OceanFloor = () => {
  const floorRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ camera }) => {
    if (!floorRef.current) return
    // Make the floor follow the camera horizontally
    floorRef.current.position.x = camera.position.x
    floorRef.current.position.z = camera.position.z
  })

  return (
    <mesh 
      ref={floorRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2, 0]} 
      receiveShadow
    >
      <planeGeometry args={[200, 200, 100, 100]} />
      <meshStandardMaterial
        color="#e6d5ac"
        roughness={1}
        metalness={0}
        onBeforeCompile={(shader) => {
          shader.uniforms.time = { value: 0 }
          shader.vertexShader = `
            varying vec3 vPosition;
            ${shader.vertexShader}
          `.replace(
            '#include <begin_vertex>',
            `
              #include <begin_vertex>
              vPosition = position;
              float elevation = sin(position.x * 0.5) * sin(position.y * 0.5) * 0.5;
              transformed.z += elevation;
            `
          )
        }}
      />
    </mesh>
  )
}

interface AquariumSceneProps {
  fish: Fish[]
  onFishClick: (id: string) => void
}

const AquariumScene: FC<AquariumSceneProps> = ({ fish, onFishClick }) => {
  const [obstacles, setObstacles] = useState<Array<{ position: THREE.Vector3, radius: number }>>([])
  
  // Create refs for decoration groups
  const decorationsRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!decorationsRef.current) return
    
    const newObstacles: Array<{ position: THREE.Vector3, radius: number }> = []
    
    // Add corals
    decorationsRef.current.children.forEach(child => {
      if (child.userData.type === 'coral' || child.userData.type === 'rock') {
        newObstacles.push({
          position: child.position.clone(),
          radius: child.scale.x * 0.4
        })
      }
    })
    
    setObstacles(newObstacles)
  }, [])

  return (
    <>
      <WaterEffect />
      <OceanFloor />
      <group ref={decorationsRef}>
        <Decorations />
      </group>
      {fish.map((fish) => (
        <Fish
          key={fish.id}
          {...fish}
          position={fish.pos}
          onFishClick={onFishClick}
          obstacles={obstacles}
        />
      ))}
    </>
  )
}

export default AquariumScene