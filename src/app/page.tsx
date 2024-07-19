"use client";
import { ChatWrapper } from "@/components/chat/ChatWrapper";
import { Scene } from "@/components/3d/Scene";
import { Canvas } from "@react-three/fiber";

const Page = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Canvas className="bg-black w-full h-full">
        <Scene />
      </Canvas>
      <ChatWrapper />
    </div>
  );
};

export default Page;
