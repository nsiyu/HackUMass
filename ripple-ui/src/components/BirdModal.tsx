import { FC, useState, Suspense, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Bird } from "../types/bird";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BirdModel from "./crow_fly";
import RobinModel from "./Bird_robin";
import SeagullModel from "./Seagull";
import { getBirdInfo } from "../lib/database";

interface BirdModalProps {
  bird: Bird;
  onClose: () => void;
}

interface BirdInfo {
  summary: string;
  conservationStatus: string;
  funFacts: string[];
}

const BirdModal: FC<BirdModalProps> = ({ bird, onClose }) => {
  const [showDetails, setShowDetails] = useState(true);
  const [birdInfo, setBirdInfo] = useState<BirdInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    const loadBirdInfo = async () => {
      setLoading(true);
      try {
        const info = await getBirdInfo(bird.species);
        setBirdInfo(info);
      } catch (error) {
        console.error('Failed to load bird info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBirdInfo();
  }, [bird.species]);

  const renderBirdInfo = () => (
    <>
      <div className="bg-gradient-to-br from-melon/10 to-transparent p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Summary</h3>
        <p className="text-gray-600 leading-relaxed">
          {loading ? 'Loading...' : birdInfo?.summary || 'Information unavailable'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-light-coral/10 to-transparent p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Conservation Status</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-500/20"></div>
          <p className="font-medium text-green-700">
            {loading ? 'Loading...' : birdInfo?.conservationStatus || 'Unknown'}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-coral-pink/10 to-transparent p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Fun Facts</h3>
        <ul className="space-y-3 text-gray-600">
          {loading ? (
            <li>Loading...</li>
          ) : (
            birdInfo?.funFacts?.map((fact, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-coral-pink">•</span>
                <span>{fact}</span>
              </li>
            )) || <li>No fun facts available</li>
          )}
        </ul>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-light-coral to-melon flex-shrink-0 cursor-pointer hover:ring-4 hover:ring-light-coral/20 transition-all duration-300 shadow-lg group relative"
                onClick={() => setShowDetails(!showDetails)}
              >
                {bird.imageUrl ? (
                  <>
                    <img
                      src={bird.imageUrl}
                      alt={bird.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", bird.imageUrl);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <UserCircleIcon className="w-full h-full text-white/90" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{bird.name}</h2>
                <p className="text-light-coral font-medium">{bird.species}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Click icon to {showDetails ? 'view 3D model' : 'view details'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {showDetails ? (
                <>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Details</h3>
                    <div className="space-y-3 text-sm">
                      <p className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Size</span>
                        <span className="font-semibold text-gray-900">{bird.length}cm</span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">First Sighted</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(bird.dateAdded).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Last Spotted</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <ClockIcon className="w-5 h-5 text-light-coral" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(bird.lastSpotted.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            {new Date(bird.lastSpotted.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <MapPinIcon className="w-5 h-5 text-light-coral" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {bird.lastSpotted.location.name}
                          </p>
                          <p className="text-gray-500">
                            {bird.lastSpotted.location.lat.toFixed(4)},{" "}
                            {bird.lastSpotted.location.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5">
                          {bird.lastSpotted.spottedBy.avatar ? (
                            <img
                              src={bird.lastSpotted.spottedBy.avatar}
                              alt={bird.lastSpotted.spottedBy.name}
                              className="w-5 h-5 rounded-full ring-2 ring-light-coral/20"
                            />
                          ) : (
                            <UserCircleIcon className="w-5 h-5 text-light-coral" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Spotted by</p>
                          <p className="text-gray-500">
                            {bird.lastSpotted.spottedBy.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                renderBirdInfo()
              )}
            </div>

            {showDetails ? (
              <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg relative">
                <Map
                  mapboxAccessToken={mapboxToken}
                  initialViewState={{
                    longitude: bird.lastSpotted.location.lng,
                    latitude: bird.lastSpotted.location.lat,
                    zoom: 12,
                  }}
                  style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                  mapStyle="mapbox://styles/mapbox/outdoors-v12"
                >
                  <Marker
                    longitude={bird.lastSpotted.location.lng}
                    latitude={bird.lastSpotted.location.lat}
                  >
                    <div className="text-4xl">📍</div>
                  </Marker>
                </Map>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
                <Canvas shadows camera={{ position: [0, 0.5, 2], fov: 40 }}>
                  <color attach="background" args={['#f3f4f6']} />
                  <ambientLight intensity={0.8} />
                  <directionalLight
                    castShadow
                    position={[2, 5, 2]}
                    intensity={1.5}
                    shadow-mapSize={1024}
                  />
                  <pointLight position={[-2, 2, -2]} intensity={0.5} />
                  <Suspense fallback={null}>
                    <group 
                      position={[0, 0, 0]} 
                      scale={4}
                      rotation={[Math.PI, 0, 0]}
                    >
                      {bird.species === "White_crowned_Sparrow" ? (
                        <BirdModel />
                      ) : bird.species === "1" ? (
                        <RobinModel />
                      ) : bird.species === "Heermann_Gull" ? (
                        <SeagullModel />
                      ) : (
                        <BirdModel />
                      )}
                    </group>
                  </Suspense>
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={0.5}
                    maxDistance={4}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2}
                  />
                </Canvas>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirdModal;
