import Crow from "./crow_fly";
import Robin from "./Bird_robin";
import { Suspense } from "react";
import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { Bird } from '../types/bird'
import RockModel from './RockModel'
import Seagull from "./Seagull";

interface BirdProps {
  position: [number, number, number];
  speed?: number;
  radius?: number;
  color?: string;
  size?: number;
  id: string;
  name: string;
  species: string;
  onBirdClick: (id: string) => void;
  obstacles?: Array<{ position: THREE.Vector3; radius: number }>;
}

const Bird = ({ position, ...props }: BirdProps) => {
  const [hovered, setHovered] = useState(false);
  const birdRef = useRef<THREE.Group>(null);

  // Reduce default speed
  const speed = 0.08;

  // Tighter boundaries
  const bounds = {
    minX: -30,
    maxX: 30,
    minY: 5,
    maxY: 20,
    minZ: -30,
    maxZ: 30,
  };

  const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);

  const targetDirection = useRef(new THREE.Vector3());
  const direction = useRef(
    new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 2
    ).normalize()
  );

  const positionRef = useRef(new THREE.Vector3(...position));

  useFrame((state, delta) => {
    if (birdRef.current) {
      // Calculate distance from center
      const distanceFromCenter = positionRef.current.length();

      // Increase chance of new direction when far from center
      const directionChangeChance =
        0.003 + (distanceFromCenter > 20 ? 0.01 : 0);

      if (Math.random() < directionChangeChance) {
        // When far from center, bias direction towards center
        if (distanceFromCenter > 15) {
          // Create direction vector pointing to center
          const toCenter = new THREE.Vector3(0, positionRef.current.y, 0)
            .sub(positionRef.current)
            .normalize();

          // Mix random direction with center direction
          targetDirection.current
            .set(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 2
            )
            .normalize()
            .lerp(toCenter, 0.4); // 40% bias towards center
        } else {
          // Normal random direction when close to center
          targetDirection.current
            .set(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 2
            )
            .normalize();
        }
      }

      // Smoothly change direction
      direction.current.lerp(targetDirection.current, 0.02);
      direction.current.normalize();

      // Update position with boundaries check
      const newPosition = positionRef.current.clone();
      newPosition.addScaledVector(direction.current, speed);

      // Check boundaries and adjust direction if needed
      if (newPosition.x < bounds.minX || newPosition.x > bounds.maxX) {
        direction.current.x *= -1;
      }
      if (newPosition.y < bounds.minY || newPosition.y > bounds.maxY) {
        direction.current.y *= -1;
      }
      if (newPosition.z < bounds.minZ || newPosition.z > bounds.maxZ) {
        direction.current.z *= -1;
      }

      // Apply the new position
      positionRef.current.copy(newPosition);
      birdRef.current.position.copy(newPosition);

      // Rotate bird to face direction of movement
      const targetRotationY =
        Math.atan2(-direction.current.z, direction.current.x) + Math.PI / 2;
      birdRef.current.rotation.y = targetRotationY;

      // Update banking
      const bankingAmount = clamp(direction.current.x * 0.5, -0.3, 0.3);
      birdRef.current.rotation.z = bankingAmount;
    }
  });

  return (
    <group
      ref={birdRef}
      
      onClick={(e) => {
        e.stopPropagation();
        props.onBirdClick(props.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      renderOrder={999}
    >
      <group
        scale={[20, 20, 20]}
        rotation={[Math.PI, 0, 0]}
        
        position={[0, position[1]-10, 0]}
        renderOrder={999}
      >
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          }
        >
          {props.species === "1" ? (
            <Crow />
          ) : props.species === "2" ? (
            <Robin/>
          ) : props.species === "3" ? (
            <Seagull/>
          ) : (
              <Crow/>
          )}
        </Suspense>
      </group>

   

      {hovered && (
        <Html>
          <div className="bg-white/90 px-2 py-1 rounded text-sm shadow-lg pointer-events-none">
            <p className="font-bold">{props.name}</p>
            <p className="text-xs text-gray-600">{props.species}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

const TreeCluster = ({ position, density = 1, distanceFromCenter = 0 }) => {
  // Fade out trees based on distance from center
  const opacity = Math.max(0.2, 1 - distanceFromCenter / 200);
  const scale = Math.max(0.3, 1 - distanceFromCenter / 300);

  return (
    <group position={position}>
      {Array.from({ length: Math.floor(8 * density) }).map((_, i) => {
        const treeScale = (0.5 + Math.random() * 1.5) * scale;
        const offset: [number, number, number] = [
          -15 + Math.random() * 30,
          treeScale * 2,
          -15 + Math.random() * 30,
        ];
        return (
          <group
            key={i}
            position={offset}
            scale={[treeScale, treeScale, treeScale]}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.5, 4]} />
              <meshStandardMaterial
                color="#4A3728"
                roughness={0.8}
                transparent
                opacity={opacity}
              />
            </mesh>
            {[0, 1, 2].map((layer) => (
              <mesh key={layer} castShadow position={[0, 2 + layer * 1.2, 0]}>
                <coneGeometry args={[2 - layer * 0.4, 2, 8]} />
                <meshStandardMaterial
                  color={`hsl(${100 + Math.random() * 40}, 40%, ${
                    30 + layer * 10
                  }%)`}
                  roughness={0.8}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};

const Trees = () => {
  // Create concentric rings of trees with increasing density and fade
  const rings = 8;
  const treeClusters = [];

  for (let ring = 0; ring < rings; ring++) {
    const radius = 30 + ring * 40;
    const clustersInRing = Math.floor(6 + ring * 3);

    for (let i = 0; i < clustersInRing; i++) {
      const angle = (i / clustersInRing) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      treeClusters.push({
        position: [x, 0, z] as [number, number, number],
        density: 1 + ring * 0.3,
        distanceFromCenter: radius,
      });
    }
  }

  return (
    <group>
      {treeClusters.map((cluster, i) => (
        <TreeCluster
          key={i}
          position={cluster.position}
          density={cluster.density}
          distanceFromCenter={cluster.distanceFromCenter}
        />
      ))}
    </group>
  );
};

const Rocks = () => {
  return (
    <group>
      {Array.from({ length: 50 }).map((_, i) => {
        const scale = 0.5 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 100;
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          scale * 0.5 - 0.3,
          Math.sin(angle) * radius
        ]

        return (
          <RockModel
            key={i}
            position={position}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI,
            ]}
            scale={[scale, scale * 0.8, scale]}
          />
        )
      })}
    </group>
  );
};

const Mountains = () => {
  return (
    <group>
      {Array.from({ length: 12 }).map((_, i) => {
        const scale = 15 + Math.random() * 25;
        const angle = (i / 12) * Math.PI * 2;
        const radius = 80 + Math.random() * 40;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group
            key={i}
            position={[x, scale * 0.3, z]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            {/* Mountain base */}
            <mesh castShadow receiveShadow>
              <coneGeometry args={[scale * 0.8, scale, 6]} />
              <meshStandardMaterial
                color="#4B5320"
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>

            {/* Snow cap */}
            <mesh castShadow position={[0, scale * 0.3, 0]}>
              <coneGeometry args={[scale * 0.3, scale * 0.4, 6]} />
              <meshStandardMaterial
                color="white"
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Clouds = () => {
  return (
    <group>
      {Array.from({ length: 30 }).map((_, i) => {
        const scale = 2 + Math.random() * 4;
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 100;
        const height = 20 + Math.random() * 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group
            key={i}
            position={[x, height, z]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            {/* Create cloud clusters using multiple overlapping spheres */}
            {Array.from({ length: 5 }).map((_, j) => {
              const cloudScale = scale * (0.7 + Math.random() * 0.6);
              const offset = {
                x: (Math.random() - 0.5) * scale * 1.5,
                y: (Math.random() - 0.5) * scale * 0.5,
                z: (Math.random() - 0.5) * scale * 1.5,
              };

              return (
                <mesh
                  key={j}
                  position={[offset.x, offset.y, offset.z]}
                  scale={[cloudScale, cloudScale * 0.6, cloudScale]}
                >
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial 
                    color="white" 
                    transparent 
                    opacity={0.8 - (radius / 150)}
                    roughness={1}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

interface BirdSanctuarySceneProps {
  birds: Bird[];
  onBirdClick: (id: string) => void;
}

const BirdSanctuaryScene: FC<BirdSanctuarySceneProps> = ({
  birds,
  onBirdClick,
}) => {
  return (
    <>
      <color attach="background" args={["#E6F4F1"]} />
      <fog attach="fog" args={["#E6F4F1", 60, 300]} />{" "}
      {/* Increased fog distance */}
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={1.2}
        shadow-mapSize={2048}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-100, 100, 100, -100, 0.1, 200]}
        />
      </directionalLight>
      <hemisphereLight
        args={["#E6F4F1", "#D4E6E1", 0.7]}
        position={[0, 50, 0]}
      />
      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#D4E6E1" roughness={1} metalness={0} />
      </mesh>
      <Mountains />
      <Trees />
      <Rocks />
      <Clouds />
      {birds.map((bird) => (
        <Bird
          key={bird.id}
          {...bird}
          position={[bird.pos[0], bird.pos[1] + 8, bird.pos[2]]}
          onBirdClick={onBirdClick}
        />
      ))}
    </>
  );
};

export default BirdSanctuaryScene;
