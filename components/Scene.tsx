
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import Background from './Background';
import { TreeState } from '../types';

interface SceneProps {
  state: TreeState;
}

const Scene: React.FC<SceneProps> = ({ state }) => {
  return (
    <div className="w-full h-screen">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={10} 
          maxDistance={30} 
          maxPolarAngle={Math.PI / 1.5}
        />
        
        <Suspense fallback={null}>
          <Background />
          <group position={[0, 1, 0]}>
            <Foliage state={state} />
            <Ornaments state={state} />
            <ContactShadows opacity={0.4} scale={20} blur={2.4} far={4.5} />
          </group>

          <EffectComposer disableNormalPass>
            <Bloom 
              intensity={1.2} 
              luminanceThreshold={0.8} 
              luminanceSmoothing={0.025} 
              mipmapBlur 
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
