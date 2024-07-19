import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Side } from "three";

export function Exoplanet({
  texture,
  side = 0,
  rotationX = 0,
  rotationY = 0,
  ...props
}: {
  texture: string;
  side: Side;
  rotationX: number;
  rotationY: number;
} & ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += rotationX));
  useFrame((state, delta) => (meshRef.current.rotation.y += rotationY));

  const colorMap = useLoader(TextureLoader, texture);
  return (
    <mesh
      {...props}
      ref={meshRef}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      userData={{ hello: "world" }}
    >
      <meshStandardMaterial map={colorMap} side={side} />
      <sphereGeometry args={[]} />
    </mesh>
  );
}
