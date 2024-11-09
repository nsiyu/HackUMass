import { FC, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Bird } from '../types/bird'

interface BirdSanctuaryOverlayProps {
  birds: Bird[]
}

const BirdSanctuaryOverlay: FC<BirdSanctuaryOverlayProps> = ({ birds }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<string>('all')

  const species = ['all', ...new Set(birds.map(bird => bird.species))]
  
  const filteredBirds = birds.filter(bird => {
    const matchesSearch = bird.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bird.species.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = filterSpecies === 'all' || bird.species === filterSpecies
    return matchesSearch && matchesSpecies
  })

  const stats = {
    totalBirds: birds.length,
    averageLength: birds.reduce((acc, bird) => acc + bird.length, 0) / birds.length,
    lastAdded: birds[birds.length - 1].dateAdded
  }

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-white/90 shadow-lg flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-0' : 'w-80'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute ${isCollapsed ? 'right-4' : '-left-10'} top-4 bg-white/90 p-2 ${
          isCollapsed ? 'rounded-lg' : 'rounded-l-lg'
        } shadow-lg hover:bg-gray-50 transition-colors`}
      >
        {isCollapsed ? (
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <ChevronRightIcon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      <div className={`${isCollapsed ? 'hidden' : 'flex flex-col h-full'}`}>
        <div className="p-6 bg-white/95 border-b border-gray-200">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bird Sanctuary</h2>
              <p className="text-sm text-gray-600">Virtual bird collection</p>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-light-coral text-white px-4 py-2 rounded-lg hover:bg-coral-pink transition-colors">
                Add Bird
              </button>
              <button className="flex-1 bg-melon text-white px-4 py-2 rounded-lg hover:bg-apricot transition-colors">
                Upload
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search birds..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-light-coral"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-light-coral"
                value={filterSpecies}
                onChange={(e) => setFilterSpecies(e.target.value)}
              >
                {species.map(species => (
                  <option key={species} value={species}>
                    {species.charAt(0).toUpperCase() + species.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-light-coral/10 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">Stats</h3>
              <div className="space-y-1 text-sm">
                <p>Total Birds: {stats.totalBirds}</p>
                <p>Average Length: {stats.averageLength.toFixed(1)}cm</p>
                <p>Last Added: {new Date(stats.lastAdded).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {filteredBirds.map(bird => (
              <div 
                key={bird.id} 
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">{bird.name}</p>
                    <p className="text-sm text-gray-600">{bird.species}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {bird.length}cm
                  </span>
                </div>
                
                <div className="text-xs space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Last spotted:</span>
                    <span className="font-medium">
                      {new Date(bird.lastSpotted.date).toLocaleDateString()} at {bird.lastSpotted.location.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>By:</span>
                    <div className="flex items-center gap-1">
                      {bird.lastSpotted.spottedBy.avatar && (
                        <img 
                          src={bird.lastSpotted.spottedBy.avatar} 
                          alt={bird.lastSpotted.spottedBy.name}
                          className="w-4 h-4 rounded-full"
                        />
                      )}
                      <span className="font-medium">{bird.lastSpotted.spottedBy.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BirdSanctuaryOverlay 