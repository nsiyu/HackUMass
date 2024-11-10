import { FC } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Bird } from "../types/bird";

interface BirdModalProps {
  bird: Bird;
  onClose: () => void;
}

const BirdModal: FC<BirdModalProps> = ({ bird, onClose }) => {
  console.log("Bird in modal:", bird); // Debug log

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{bird.name}</h2>
              <p className="text-gray-600">{bird.species}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {bird.imageUrl && (
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={bird.imageUrl}
                    alt={bird.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", bird.imageUrl);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{bird.length}cm</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">First Sighted:</span>
                    <span className="font-medium">
                      {new Date(bird.dateAdded).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Last Spotted</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {new Date(bird.lastSpotted.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500">
                        {new Date(bird.lastSpotted.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">
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
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Spotted by</p>
                      <p className="text-gray-500">
                        {bird.lastSpotted.spottedBy.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
              <Map
                mapboxAccessToken={mapboxToken}
                initialViewState={{
                  longitude: bird.lastSpotted.location.lng,
                  latitude: bird.lastSpotted.location.lat,
                  zoom: 12,
                }}
                style={{ width: "100%", height: "100%" }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirdModal;
