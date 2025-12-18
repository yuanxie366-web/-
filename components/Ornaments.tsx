
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, OrnamentData } from '../types';
import { ORNAMENT_COUNT, CHAOS_RADIUS, TREE_HEIGHT, TREE_RADIUS, ORNAMENT_TYPES, COLORS } from '../constants';

interface OrnamentsProps {
  state: TreeState;
}

const Ornaments: React.FC<OrnamentsProps> = ({ state }) => {
  const { mouse, viewport } = useThree();
  const sphereRef = useRef<THREE.InstancedMesh>(null);
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.InstancedMesh>(null);
  
  const progressRef = useRef(0);
  
  // Pre-calculate positions and data
  const ornamentData = useMemo(() => {
    const data: OrnamentData[] = [];
    for (let i = 0; i < ORNAMENT_COUNT; i++) {
      const type = Math.random() > 0.7 ? ORNAMENT_TYPES.GIFT : (Math.random() > 0.5 ? ORNAMENT_TYPES.BALL : ORNAMENT_TYPES.LIGHT);
      
      const r = Math.random() * CHAOS_RADIUS;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const chaosPos: [number, number, number] = [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ];

      const h = Math.random() * TREE_HEIGHT;
      const currentRadius = (1 - h / TREE_HEIGHT) * TREE_RADIUS;
      const angle = Math.random() * Math.PI * 2;
      
      const targetPos: [number, number, number] = [
        Math.cos(angle) * currentRadius,
        h - TREE_HEIGHT / 2,
        Math.sin(angle) * currentRadius
      ];

      const colorPool = [COLORS.gold, COLORS.deepRed, COLORS.offWhite, '#00c853'];
      const color = colorPool[Math.floor(Math.random() * colorPool.length)];

      data.push({
        chaosPos,
        targetPos,
        color,
        weight: type.weight,
        scale: type.scale
      });
    }
    return data;
  }, []);

  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  useFrame(({ clock }, delta) => {
    const targetValue = state === TreeState.FORMED ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetValue, delta * 2.0);

    // Mouse vector in world space (approximate)
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const mousePos = new THREE.Vector3(mouseX, mouseY, 0);

    const updateMesh = (mesh: THREE.InstancedMesh | null, filterFn: (d: OrnamentData) => boolean) => {
      if (!mesh) return;
      let count = 0;
      ornamentData.forEach((d, i) => {
        if (!filterFn(d)) return;
        
        const chaos = new THREE.Vector3(...d.chaosPos);
        const target = new THREE.Vector3(...d.targetPos);
        const currentBase = new THREE.Vector3().lerpVectors(chaos, target, progressRef.current);
        
        // Repulsion physics
        const distToMouse = currentBase.distanceTo(mousePos);
        const pushForce = Math.max(0, 5 - distToMouse) * d.weight * 0.5;
        const pushDir = currentBase.clone().sub(mousePos).normalize().multiplyScalar(pushForce);
        
        currentBase.add(pushDir);

        tempObject.position.copy(currentBase);
        tempObject.scale.setScalar(d.scale * (0.8 + 0.2 * Math.sin(clock.elapsedTime + i)));
        tempObject.rotation.y = clock.elapsedTime * (i % 2 === 0 ? 1 : -1) * 0.5;
        tempObject.updateMatrix();
        mesh.setMatrixAt(count, tempObject.matrix);
        
        tempColor.set(d.color);
        mesh.setColorAt(count, tempColor);
        count++;
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };

    updateMesh(sphereRef.current, d => d.scale === ORNAMENT_TYPES.BALL.scale);
    updateMesh(boxRef.current, d => d.scale === ORNAMENT_TYPES.GIFT.scale);
    updateMesh(lightRef.current, d => d.scale === ORNAMENT_TYPES.LIGHT.scale);
  });

  const ballCount = ornamentData.filter(d => d.scale === ORNAMENT_TYPES.BALL.scale).length;
  const giftCount = ornamentData.filter(d => d.scale === ORNAMENT_TYPES.GIFT.scale).length;
  const lightCount = ornamentData.filter(d => d.scale === ORNAMENT_TYPES.LIGHT.scale).length;

  return (
    <group>
      <instancedMesh ref={sphereRef} args={[undefined, undefined, ballCount]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </instancedMesh>
      <instancedMesh ref={boxRef} args={[undefined, undefined, giftCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.4} roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={lightRef} args={[undefined, undefined, lightCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
};

export default Ornaments;
