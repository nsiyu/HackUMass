import { FC, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface Fish {
  id: string
  name: string
  species: string
  dateAdded: string
  length: number
  pos: [number, number, number]
  speed: number
  radius: number
  color: string
  size: number
  lastSpotted: {
    date: string
    location: {
      lat: number
      lng: number
      name: string
    }
    spottedBy: {
      id: string
      name: string
      avatar?: string
    }
  }
}

const AquariumOverlay: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<string>('all')

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
    },

  ]

  const species = ['all', ...new Set(mockFish.map(fish => fish.species))]
  
  const filteredFish = mockFish.filter(fish => {
    const matchesSearch = fish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fish.species.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = filterSpecies === 'all' || fish.species === filterSpecies
    return matchesSearch && matchesSpecies
  })

  const stats = {
    totalFish: mockFish.length,
    averageLength: mockFish.reduce((acc, fish) => acc + fish.length, 0) / mockFish.length,
    lastAdded: mockFish[mockFish.length - 1].dateAdded
  }

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-white/90 shadow-lg flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-0' : 'w-80'
      }`}
    >
      {/* Collapse Toggle Button */}
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

      {/* Content - only show when not collapsed */}
      <div className={`${isCollapsed ? 'hidden' : 'flex flex-col h-full'}`}>
        {/* Fixed Header Section */}
        <div className="p-6 bg-white/95 border-b border-gray-200">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Aquarium</h2>
              <p className="text-sm text-gray-600">Virtual fish collection</p>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-light-coral text-white px-4 py-2 rounded-lg hover:bg-coral-pink transition-colors">
                Add Fish
              </button>
              <button className="flex-1 bg-melon text-white px-4 py-2 rounded-lg hover:bg-apricot transition-colors">
                Upload
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search fish..."
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
                <p>Total Fish: {stats.totalFish}</p>
                <p>Average Length: {stats.averageLength.toFixed(1)}cm</p>
                <p>Last Added: {new Date(stats.lastAdded).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Fish List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {filteredFish.map(fish => (
              <div 
                key={fish.id} 
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">{fish.name}</p>
                    <p className="text-sm text-gray-600">{fish.species}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {fish.length}cm
                  </span>
                </div>
                
                <div className="text-xs space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Last spotted:</span>
                    <span className="font-medium">
                      {new Date(fish.lastSpotted.date).toLocaleDateString()} at {fish.lastSpotted.location.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>By:</span>
                    <div className="flex items-center gap-1">
                      {fish.lastSpotted.spottedBy.avatar && (
                        <img 
                          src={fish.lastSpotted.spottedBy.avatar} 
                          alt={fish.lastSpotted.spottedBy.name}
                          className="w-4 h-4 rounded-full"
                        />
                      )}
                      <span className="font-medium">{fish.lastSpotted.spottedBy.name}</span>
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

export default AquariumOverlay