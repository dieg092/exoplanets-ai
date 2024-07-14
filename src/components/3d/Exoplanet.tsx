import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export function Exoplanet({
  textureName,
  ...props
}: { textureName: string } & ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += 0.0005));
  useFrame((state, delta) => (meshRef.current.rotation.y += 0.0002));

  const colorMap = useLoader(TextureLoader, `${textureName}.jpg`);
  return (
    <mesh
      {...props}
      ref={meshRef}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      userData={{ hello: "world" }}
    >
      <meshStandardMaterial map={colorMap} />
      <sphereGeometry args={[]} />
    </mesh>
  );
}
