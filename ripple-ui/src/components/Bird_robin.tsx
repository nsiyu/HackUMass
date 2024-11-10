import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const BirdModel = () => {
  const { scene, animations } = useGLTF("/BirdModel/robin_bird.glb");

  const mixer = useMemo(() => {
    if (scene) {
      return new THREE.AnimationMixer(scene);
    }
    return null;
  }, [scene]);

  useEffect(() => {
    if (mixer && animations && animations.length > 0) {
      const flyAnimation = animations.find(
        (anim) => anim.name === "Robin_Bird_Fly"
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
            child.material.transparent = true; // Set to true if using opacity
            child.material.opacity = 1;
            child.material.side = THREE.DoubleSide;
            child.material.depthTest = false;
            child.material.depthWrite = false;
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

  if (!scene) {
    return null;
  }

  return (
    <>
      <primitive object={scene} />
      <boxHelper args={[scene]} />
    </>
  );
};

useGLTF.preload("/BirdModel/robin_bird.glb");

export default BirdModel;
