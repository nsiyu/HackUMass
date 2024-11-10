import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances } from '@react-three/drei'

const GrassBlade = () => (
  <Instance rotation={[0, 0, 0]} scale={[0.1, 0.3, 0.1]} />
)

const Grass = () => {
  const grassRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  const bladePositions = useMemo(() => {
    const positions = []
    const radius = 150 // Grass coverage radius
    const count = 10000 // Number of grass blades

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * radius
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      
      // Add some randomness to rotation and scale
      const rotation = Math.random() * Math.PI * 2
      const scale = 0.5 + Math.random() * 0.5

      positions.push({ position: [x, 0, z], rotation, scale })
    }
    return positions
  }, [])

  useFrame((state) => {
    time.current += 0.1
    if (grassRef.current) {
      grassRef.current.children.forEach((blade: THREE.Object3D, i) => {
        const { x, z } = blade.position
        // Wind effect
        blade.rotation.x = Math.sin(time.current + x * 0.5) * 0.1
        blade.rotation.z = Math.cos(time.current + z * 0.5) * 0.1
      })
    }
  })

  return (
    <group ref={grassRef}>
      <Instances limit={10000}>
        <planeGeometry />
        <meshStandardMaterial
          color="#4a9c2d"
          side={THREE.DoubleSide}
          vertexColors
        />
        {bladePositions.map((props, i) => (
          <GrassBlade key={i} {...props} />
        ))}
      </Instances>
    </group>
  )
}

export default Grass 