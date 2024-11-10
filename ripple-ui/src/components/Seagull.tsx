import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js"; // Import clone function

const BirdModel = () => {
  const { scene: originalScene, animations } = useGLTF(
    "/BirdModel/seagull.glb"
  );

  // Use the clone function to properly clone the scene with animations
  const scene = useMemo(() => clone(originalScene), [originalScene]);

  const mixer = useMemo(() => {
    if (scene) {
      return new THREE.AnimationMixer(scene);
    }
    return null;
  }, [scene]);

  useEffect(() => {
  

    if (mixer && animations && animations.length > 0) {
      const flyAnimation = animations.find(
        (anim) => anim.name === "ArmatureAction.006"
      );
      if (flyAnimation) {
        const action = mixer.clipAction(flyAnimation);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
      }
    }

    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            // Clone the material to prevent shared state
            child.material = child.material.clone();
            child.material.transparent = true; // Set to true if using opacity
            child.material.opacity = 1;
            child.material.side = THREE.DoubleSide;
          }
        }
      });
    }

    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
    };
  }, [animations, mixer, scene]);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  return (
    <>
      <primitive object={scene} scale={[0.1, 0.1, 0.1]} 
              rotation={[Math.PI, Math.PI/2, 0]} 
/>
    </>
  );
};

useGLTF.preload("/BirdModel/seagull.glb");

export default BirdModel;
