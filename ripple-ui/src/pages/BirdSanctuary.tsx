import { FC, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import BirdSanctuaryOverlay from "../components/BirdSanctuaryOverlay";
import BirdSanctuaryScene from "../components/BirdSanctuaryScene";
import FloatingNav from "../components/FloatingNav";
import BirdModal from "../components/BirdModal";
import { Bird, AddBirdFormData } from "../types/bird";
import AddBirdModal from "../components/AddBirdModal";
import { getBirds, addBird, DEFAULT_USER } from "../lib/database";
import { Session } from "@supabase/supabase-js";

interface BirdSanctuaryProps {
  session: Session | null;
  setShowAuthModal: (show: boolean) => void;
}

const BirdSanctuary: FC<BirdSanctuaryProps> = ({
  session,
  setShowAuthModal: setParentAuthModal,
}) => {
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
  const [showAddBirdModal, setShowAddBirdModal] = useState(false);
  const [birds, setBirds] = useState<Bird[]>([
    {
      id: "initial-bird",
      name: "Welcome Bird",
      species: "Tutorial Sparrow",
      dateAdded: new Date().toISOString(),
      length: 25,
      pos: [-15 + Math.random() * 30, 2, -15 + Math.random() * 30],
      speed: 1.2,
      radius: 2,
      color: "#8B4513",
      size: 0.6,
      lastSpotted: {
        date: new Date().toISOString(),
        location: {
          lat: 40.7128,
          lng: -74.006,
          name: "New York City",
        },
        spottedBy: {
          id: "system",
          name: "Bird Sanctuary",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=BirdSanctuary",
        },
      },
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      loadBirds();
    }
  }, [session]);

  const loadBirds = async () => {
    try {
      setLoading(true);
      const data = await getBirds();
      if (data && data.length > 0) {
        setBirds(data);
      }
    } catch (err) {
      setError("Failed to load birds");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-blue-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading birds...</div>
      </div>
    );
  }

  const handleBirdClick = (id: string) => {
    setSelectedBirdId(id);
  };

  const selectedBird = birds.find((bird) => bird.id === selectedBirdId);

  const handleAddBird = async (data: AddBirdFormData) => {
    try {
      const spawnRadius = 30;
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = Math.random() * spawnRadius;
      const spawnX = Math.cos(randomAngle) * randomRadius;
      const spawnZ = Math.sin(randomAngle) * randomRadius;

      const newBird: Omit<Bird, "id"> = {
        name: data.name,
        species: data.species || "Unknown Species",
        dateAdded: new Date().toISOString(),
        length: 25,
        pos: [spawnX, 2, spawnZ],
        speed: 1.2,
        radius: 2,
        color: "#8B4513",
        size: 0.6,
        image: data.image,
        lastSpotted: {
          date: new Date().toISOString(),
          location: {
            lat: data.coordinates?.lat || 0,
            lng: data.coordinates?.lng || 0,
            name: data.location || "Unknown Location",
          },
          spottedBy: {
            id: DEFAULT_USER.id,
            name: DEFAULT_USER.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${DEFAULT_USER.id}`,
          },
        },
      };

      const addedBird = await addBird(newBird);
      setBirds((prev) => [...prev, addedBird]);
      setShowAddBirdModal(false);
    } catch (err) {
      console.error("Failed to add bird:", err);
      alert(err instanceof Error ? err.message : "Failed to add bird");
    }
  };

  const handleUpload = (file: File) => {
    alert(
      `File "${file.name}" selected for upload. This feature will be implemented soon.`
    );
  };

  return (
    <div className="fixed inset-0 bg-blue-100">
      <Canvas shadows camera={{ position: [0, 8, 25], fov: 60 }}>
        <BirdSanctuaryScene birds={birds} onBirdClick={handleBirdClick} />
        <OrbitControls
          enablePan={true}
          panSpeed={0.5}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.1}
          minDistance={10}
          maxDistance={50}
        />
        <Environment preset="sunset" />
      </Canvas>
      <FloatingNav session={session} setShowAuthModal={setParentAuthModal} />
      <BirdSanctuaryOverlay
        birds={birds}
        setShowAddBirdModal={setShowAddBirdModal}
        onUpload={handleUpload}
      />
      {selectedBird && (
        <BirdModal
          bird={selectedBird}
          onClose={() => setSelectedBirdId(null)}
        />
      )}
      {showAddBirdModal && (
        <AddBirdModal
          onClose={() => setShowAddBirdModal(false)}
          onSubmit={handleAddBird}
          availableSpecies={[...new Set(birds.map((bird) => bird.species))]}
        />
      )}
    </div>
  );
};

export default BirdSanctuary;
