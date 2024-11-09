import { FC } from 'react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { XMarkIcon, MapPinIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface FishModalProps {
  fish: {
    id: string
    name: string
    species: string
    dateAdded: string
    length: number
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
  onClose: () => void
}

const FishModal: FC<FishModalProps> = ({ fish, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{fish.name}</h2>
              <p className="text-gray-600">{fish.species}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Length:</span>
                    <span className="font-medium">{fish.length}cm</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">First Added:</span>
                    <span className="font-medium">
                      {new Date(fish.dateAdded).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Last Spotted Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Last Spotted</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {new Date(fish.lastSpotted.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500">
                        {new Date(fish.lastSpotted.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{fish.lastSpotted.location.name}</p>
                      <p className="text-gray-500">
                        {fish.lastSpotted.location.lat.toFixed(4)}, {fish.lastSpotted.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5">
                      {fish.lastSpotted.spottedBy.avatar ? (
                        <img 
                          src={fish.lastSpotted.spottedBy.avatar}
                          alt={fish.lastSpotted.spottedBy.name}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Spotted by</p>
                      <p className="text-gray-500">{fish.lastSpotted.spottedBy.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
              <Map
                mapboxAccessToken="pk.eyJ1Ijoia2FveW91eXV1dSIsImEiOiJjbTMxMGNmNWgwc2cyMmpxMXdjbHU5dHloIn0.-I3AKHvWtAdHFYhoJfdaKw"
                initialViewState={{
                  longitude: fish.lastSpotted.location.lng,
                  latitude: fish.lastSpotted.location.lat,
                  zoom: 12
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
              >
                <Marker
                  longitude={fish.lastSpotted.location.lng}
                  latitude={fish.lastSpotted.location.lat}
                >
                  <div className="text-4xl">❌</div>
                </Marker>
              </Map>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FishModal