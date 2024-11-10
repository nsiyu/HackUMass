// SimplifiedBirdModel.jsx
import React from 'react';

const SimplifiedBirdModel = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

export default SimplifiedBirdModel;
