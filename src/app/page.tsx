"use client";
import { Exoplanet } from "@/components/3d/Exoplanet";
import { Universe } from "@/components/3d/Universe";
import Chat from "@/components/Chat";
import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Page = () => {
  return (
    <div className="w-full h-screen">
      <Canvas className="bg-black w-full h-full">
        <CameraControls minDistance={5} maxDistance={10} />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <directionalLight color="red" position={[0, 0, 5]} intensity={0.1} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {/* Earth prueba */}
        <Exoplanet position={[0, 0, 0]} scale={1} textureName="earth" />
        {/* Sun prueba */}
        <Exoplanet position={[0, 0, -90]} scale={25} textureName="sun" />
        {/* Universe sphere example */}
        <Universe position={[0, 0, 0]} />
      </Canvas>
      <Chat />
    </div>
  );
};

export default Page;
