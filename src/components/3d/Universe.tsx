import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useFrame, ThreeElements, useLoader } from "@react-three/fiber";
import { TextureLoader, BackSide } from "three";

export function Universe(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += 0.00005));
  useFrame((state, delta) => (meshRef.current.rotation.y += 0.00001));

  const colorMap = useLoader(TextureLoader, "universe.jpg");
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={200}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      userData={{ hello: "world" }}
    >
      <meshStandardMaterial map={colorMap} side={BackSide} />
      <sphereGeometry args={[]} />
    </mesh>
  );
}
