import { FC, useState, useRef, useEffect } from 'react'

interface AddBirdFormData {
  name: string;
  species: string;
  image: File | null;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  { title: 'Upload Image', description: 'Upload or take a photo of the bird' },
  { title: 'Add Details', description: 'Fill in the remaining information' }
]

const AddBirdModal: FC<{ 
  onClose: () => void, 
  onSubmit: (data: AddBirdFormData) => void
}> = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AddBirdFormData>({
    name: '',
    species: '',
    image: null,
    location: '',
    coordinates: {
      lat: 0,
      lng: 0
    }
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.image) {
      setIsLoadingSpecies(true);
      
      // Create FormData for the prediction request
      const predictionData = new FormData();
      predictionData.append('file', formData.image);

      // Make the prediction request
      fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: predictionData
      })
      .then(response => response.json())
      .then(data => {
        setFormData(prev => ({ ...prev, species: data.predicted_class }));
      })
      .catch(error => {
        console.error('Error predicting species:', error);
        setFormData(prev => ({ ...prev, species: 'Prediction failed' }));
      })
      .finally(() => {
        setIsLoadingSpecies(false);
      });
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
            if (!mapboxToken) {
              throw new Error('Mapbox token not configured');
            }
            
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${mapboxToken}`
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch location data');
            }
            
            const data = await response.json();
            const locationName = data.features?.[0]?.place_name || 'Unknown Location';
            
            setFormData(prev => ({ 
              ...prev, 
              location: locationName,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }));
          } catch (error) {
            console.error('Error fetching location name:', error);
            setFormData(prev => ({ 
              ...prev, 
              location: 'Unknown Location',
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }));
          }
        });
      }
    }
  }, [formData.image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setCurrentStep(1);
    }
  };

  const handleImageCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-bird.jpg', { type: 'image/jpeg' });
          setFormData(prev => ({ ...prev, image: file }));
          setPreviewUrl(URL.createObjectURL(file));
          setCurrentStep(1);
        }
      }, 'image/jpeg');
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Update the species input field in the form to show loading state
  const speciesField = (
    <div>
      <label className="block text-sm font-medium text-gray-700">Species (Auto-detected)</label>
      <input
        type="text"
        value={isLoadingSpecies ? 'Detecting species...' : formData.species}
        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50"
        disabled
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        {currentStep === 0 ? (
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Upload Image
              </button>
              <button
                type="button"
                onClick={handleImageCapture}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Take Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}>
            <div className="space-y-4">
              {previewUrl && (
                <div className="mb-4">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Name your Bird</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:border-light-coral focus:ring-light-coral"
                  required
                />
              </div>

              {speciesField}

              <div>
                <label className="block text-sm font-medium text-gray-700">Location (Auto-detected)</label>
                <input
                  type="text"
                  value={formData.location}
                  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50"
                  disabled
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  Add Bird
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBirdModal;