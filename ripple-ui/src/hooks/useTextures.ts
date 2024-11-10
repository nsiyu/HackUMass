import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { EXRLoader } from 'three-stdlib'
import * as THREE from 'three'

export const useTextures = () => {
  const rockNormalTexture = useLoader(TextureLoader, '/dry_riverbed_rock_4k.gltf/textures/dry_riverbed_rock_nor_gl_4k.jpg')
  const rockDiffuseTexture = useLoader(TextureLoader, '/dry_riverbed_rock_4k.gltf/textures/dry_riverbed_rock_diff_4k.jpg')
  const rockDisplacementTexture = useLoader(TextureLoader, '/dry_riverbed_rock_4k.gltf/textures/dry_riverbed_rock_arm_4k.jpg')

  const textures = [rockNormalTexture, rockDiffuseTexture, rockDisplacementTexture]
  textures.forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = true
  })

  return {
    rock: {
      normal: rockNormalTexture,
      diffuse: rockDiffuseTexture,
      displacement: rockDisplacementTexture
    }
  }
}