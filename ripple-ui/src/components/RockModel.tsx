import { useTextures } from '../hooks/useTextures'
import * as THREE from 'three'
import { useMemo } from 'react'

interface RockModelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}

const RockModel = ({ position, rotation, scale }: RockModelProps) => {
  const textures = useTextures()
  
  const geometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1, 1)
    return geom
  }, [])

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
      geometry={geometry}
    >
      <meshStandardMaterial
        map={textures.rock.diffuse}
        normalMap={textures.rock.normal}
        normalScale={[0.5, 0.5]}
        roughness={0.8}
        metalness={0.2}
        color={`rgb(${100 + Math.random() * 30}, ${100 + Math.random() * 30}, ${100 + Math.random() * 30})`}
      />
    </mesh>
  )
}

export default RockModel