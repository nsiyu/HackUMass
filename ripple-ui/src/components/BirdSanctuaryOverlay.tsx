import { FC, useState, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Bird } from '../types/bird'

interface BirdSanctuaryOverlayProps {
  birds: Bird[]
  setShowAddBirdModal: (show: boolean) => void
  onUpload: (file: File) => void
}

const BirdSanctuaryOverlay: FC<BirdSanctuaryOverlayProps> = ({ birds, setShowAddBirdModal, onUpload }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const species = ['all', ...new Set(birds.map(bird => bird.species))]
  
  const filteredBirds = birds.filter(bird => {
    const matchesSearch = bird.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bird.species.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = filterSpecies === 'all' || bird.species === filterSpecies
    return matchesSearch && matchesSpecies
  })

  const sortedBirds = [...birds].sort((a, b) => 
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  )

  const stats = {
    totalBirds: birds.length,
    averageLength: birds.length > 0 
      ? birds.reduce((acc, bird) => acc + bird.length, 0) / birds.length 
      : 0,
    lastAdded: sortedBirds.length > 0 
      ? sortedBirds[0].dateAdded 
      : new Date().toISOString()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-emerald-50/95 backdrop-blur-sm shadow-lg flex flex-col transition-all duration-300 ${
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

      <div className={`${isCollapsed ? 'hidden' : 'flex flex-col h-full p-6'}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-emerald-900">Bird Sanctuary</h2>
          <p className="text-sm text-emerald-700">Virtual bird collection</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setShowAddBirdModal(true)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Add Bird
          </button>
          <button 
            onClick={handleUploadClick}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Search birds..."
            className="w-full px-4 py-2 rounded-lg border border-emerald-200 bg-white/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 rounded-lg border border-emerald-200 bg-white/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 mb-6 border border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-900 mb-3">Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-emerald-700">Total Birds:</span>
              <span className="font-medium text-emerald-900">{stats.totalBirds}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Average Length:</span>
              <span className="font-medium text-emerald-900">{stats.averageLength.toFixed(1)}cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Last Added:</span>
              <span className="font-medium text-emerald-900">{new Date(stats.lastAdded).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {filteredBirds.map(bird => (
              <div 
                key={bird.id} 
                className="bg-white/80 rounded-lg p-4 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-emerald-900">{bird.name}</h3>
                    <p className="text-sm text-emerald-700">{bird.species}</p>
                  </div>
                  <span className="text-sm font-medium text-emerald-700">{bird.length}cm</span>
                </div>
                <div className="text-sm text-emerald-600">
                  <p className="mb-1">
                    Last spotted: {new Date(bird.lastSpotted.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs">at {bird.lastSpotted.location.name}</p>
                </div>
                <div className="flex items-center mt-2 text-xs text-emerald-600">
                  <span>By:</span>
                  {bird.lastSpotted.spottedBy.avatar && (
                    <img 
                      src={bird.lastSpotted.spottedBy.avatar}
                      alt={bird.lastSpotted.spottedBy.name}
                      className="w-4 h-4 rounded-full mx-1"
                    />
                  )}
                  <span>{bird.lastSpotted.spottedBy.name}</span>
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