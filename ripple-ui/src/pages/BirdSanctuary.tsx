import { FC, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import BirdSanctuaryOverlay from '../components/BirdSanctuaryOverlay'
import BirdSanctuaryScene from '../components/BirdSanctuaryScene'
import FloatingNav from '../components/FloatingNav'
import BirdModal from '../components/BirdModal'
import { Bird } from '../types/bird'

const BirdSanctuary: FC = () => {
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null)
  
  const mockBirds: Bird[] = [
    { 
      id: '1', 
      name: 'Robin Red', 
      species: 'American Robin', 
      dateAdded: '2024-01-15', 
      length: 25,
      pos: [0, 2, 0],
      speed: 1.2,
      radius: 2,
      color: '#8B4513',
      size: 0.2,
      lastSpotted: {
        date: '2024-03-15T14:30:00Z',
        location: {
          lat: 25.7617,
          lng: -80.1918,
          name: 'Central Park'
        },
        spottedBy: {
          id: 'user123',
          name: 'John Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        }
      }
    }
  ]

  const handleBirdClick = (id: string) => {
    setSelectedBirdId(id)
  }

  const selectedBird = mockBirds.find(bird => bird.id === selectedBirdId)

  return (
    <div className="fixed inset-0 bg-blue-100">
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 75 }}>
        <BirdSanctuaryScene birds={mockBirds} onBirdClick={handleBirdClick} />
        <OrbitControls 
          enablePan={true}
          panSpeed={0.5}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.1}
          minDistance={5}
          maxDistance={30}
        />
        <Environment preset="sunset" />
      </Canvas>
      <FloatingNav />
      <BirdSanctuaryOverlay birds={mockBirds} />
      {selectedBird && (
        <BirdModal 
          bird={selectedBird} 
          onClose={() => setSelectedBirdId(null)} 
        />
      )}
    </div>
  )
}

export default BirdSanctuary 