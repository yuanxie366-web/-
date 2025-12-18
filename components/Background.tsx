
import React from 'react';
import { Stars } from '@react-three/drei';

const Background: React.FC = () => {
  return (
    <>
      <color attach="background" args={['#010a01']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffd700" />
      <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#004d40" castShadow />
    </>
  );
};

export default Background;
