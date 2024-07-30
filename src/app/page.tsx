"use client"

import { ChatWrapper } from "@/components/chat/ChatWrapper"
import { Scene } from "@/components/3d/Scene"
import { Canvas } from "@react-three/fiber"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AudioWrapper } from "@/components/audio/AudioWrapper"
import { useToggleChat } from "@/hooks/useToggleChat"

const Page = () => {
  const router = useRouter()
  const { isChatHidden } = useToggleChat()

  useEffect(() => {
    const { searchParams } = new URL(window.location.href)
    if (searchParams && searchParams.toString()) {
      router.replace("/")
    }
  }, [router])

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <h1
        className={`${
          !isChatHidden ? "hidden" : ""
        } font-bold md:text-2xl sm:text-xl absolute z-50 sm:left-6 left-1/2 transform -translate-x-1/2 sm:transform-none sm:translate-x-0 top-3 text-white md:block`}
      >
        EXOPLANETS-AI
      </h1>
      <Canvas
        className="bg-black w-full h-full"
        camera={{
          far: 10000000,
        }}
      >
        <Scene />
      </Canvas>
      <ChatWrapper />
      <AudioWrapper isChatHidden={isChatHidden} />
    </div>
  )
}

export default Page
