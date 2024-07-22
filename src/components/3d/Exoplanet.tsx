import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Side } from "three";

export function Exoplanet({
  texture,
  inclination,
  side = 0,
  rotationX = 0,
  rotationY = 0,
  type,
  ...props
}: {
  inclination: [number, number, number];
  texture: string;
  side: Side;
  rotationX: number;
  rotationY: number;
  type?: "STAR";
} & ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += rotationX * delta));
  useFrame((state, delta) => (meshRef.current.rotation.y += rotationY * delta));

  const colorMap = useLoader(TextureLoader, texture);
  return (
    <mesh
      rotation={inclination}
      {...props}
      ref={meshRef}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      userData={{ hello: "world" }}
    >
      {type === "STAR" ? (
        <meshStandardMaterial
          side={side}
          emissiveMap={colorMap}
          emissive={0xffff00}
          emissiveIntensity={1}
        />
      ) : (
        <meshStandardMaterial map={colorMap} side={side} />
      )}
      <sphereGeometry args={[]} />
    </mesh>
  );
}
