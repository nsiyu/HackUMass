import { FC, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import AquariumOverlay from '../components/AquariumOverlay'
import AquariumScene from '../components/AquariumScene'
import FloatingNav from '../components/FloatingNav'
import FishModal from '../components/FishModal'
import { Fish } from '../types/fish'

const Aquarium: FC = () => {
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null)
  
  const mockFish: Fish[] = [
    { 
      id: '1', 
      name: 'Salmon Sally', 
      species: 'Atlantic Salmon', 
      dateAdded: '2024-01-15', 
      length: 76,
      pos: [0, 0, 0],
      speed: 0.8,
      radius: 1.5,
      color: '#FA8072',
      size: 0.25,
      lastSpotted: {
        date: '2024-03-15T14:30:00Z',
        location: {
          lat: 25.7617,
          lng: -80.1918,
          name: 'Miami Beach Marina'
        },
        spottedBy: {
          id: 'user123',
          name: 'John Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        }
      }
    }
  ]

  const handleFishClick = (id: string) => {
    setSelectedFishId(id)
  }

  const selectedFish = mockFish.find(fish => fish.id === selectedFishId)

  return (
    <div className="fixed inset-0 bg-blue-100">
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 75 }}>
        <color attach="background" args={['#0066a6']} />
        <fog attach="fog" args={['#0066a6', 5, 30]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[5, 12, 8]}
          intensity={1.2}
          shadow-mapSize={1024}
        />
        <AquariumScene fish={mockFish} onFishClick={handleFishClick} />
        <OrbitControls 
          enablePan={true}
          panSpeed={0.5}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.1}
          minDistance={3}
          maxDistance={20}
          maxAzimuthAngle={Infinity}
          minAzimuthAngle={-Infinity}
        />
        <Environment preset="sunset" />
      </Canvas>
      <FloatingNav />
      <AquariumOverlay fish={mockFish} />
      {selectedFish && (
        <FishModal 
          fish={selectedFish} 
          onClose={() => setSelectedFishId(null)} 
        />
      )}
    </div>
  )
}

export default Aquarium 