
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FOLIAGE_COUNT, CHAOS_RADIUS, TREE_HEIGHT, TREE_RADIUS, COLORS } from '../constants';
import { TreeState } from '../types';

interface FoliageProps {
  state: TreeState;
}

const foliageVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  attribute vec3 aChaosPos;
  attribute vec3 aTargetPos;
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec3 pos = mix(aChaosPos, aTargetPos, uProgress);
    
    // Subtle waving motion
    pos.x += sin(uTime * 0.5 + pos.y) * 0.1 * uProgress;
    pos.z += cos(uTime * 0.5 + pos.y) * 0.1 * uProgress;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Scale particles based on distance
    gl_PointSize = (12.0 / -mvPosition.z) * (1.0 + 0.5 * sin(uTime + pos.x * 10.0));
    
    // Color logic: Emerald to Gold
    float colorMix = fract(sin(dot(aChaosPos.xy ,vec2(12.9898,78.233))) * 43758.5453);
    vColor = mix(vec3(0.0, 0.3, 0.25), vec3(1.0, 0.84, 0.0), colorMix * 0.2);
    vOpacity = 0.6 + 0.4 * uProgress;
  }
`;

const foliageFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    float strength = 1.0 - (r * 2.0);
    gl_FragColor = vec4(vColor, strength * vOpacity);
  }
`;

const Foliage: React.FC<FoliageProps> = ({ state }) => {
  const meshRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);

  const { chaosPositions, targetPositions } = useMemo(() => {
    const chaosArr = new Float32Array(FOLIAGE_COUNT * 3);
    const targetArr = new Float32Array(FOLIAGE_COUNT * 3);

    for (let i = 0; i < FOLIAGE_COUNT; i++) {
      // Chaos: Random Sphere
      const r = Math.random() * CHAOS_RADIUS;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      chaosArr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      chaosArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      chaosArr[i * 3 + 2] = r * Math.cos(phi);

      // Target: Cone (Christmas Tree shape)
      const h = Math.random() * TREE_HEIGHT;
      const currentRadius = (1 - h / TREE_HEIGHT) * TREE_RADIUS;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * currentRadius; // Fill inside cone

      targetArr[i * 3] = Math.cos(angle) * dist;
      targetArr[i * 3 + 1] = h - TREE_HEIGHT / 2; // Center it vertically
      targetArr[i * 3 + 2] = Math.sin(angle) * dist;
    }

    return { chaosPositions: chaosArr, targetPositions: targetArr };
  }, []);

  useFrame((s, delta) => {
    if (!meshRef.current) return;
    const targetValue = state === TreeState.FORMED ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetValue, delta * 2.5);
    
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = s.clock.elapsedTime;
    material.uniforms.uProgress.value = progressRef.current;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={FOLIAGE_COUNT}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aChaosPos"
          count={FOLIAGE_COUNT}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTargetPos"
          count={FOLIAGE_COUNT}
          array={targetPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={foliageVertexShader}
        fragmentShader={foliageFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
      />
    </points>
  );
};

export default Foliage;
