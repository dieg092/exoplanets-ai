import { create } from "zustand"
import type { ChatStoreType, Exoplanet } from "@/definition"

export const useChatStore = create<ChatStoreType>((set) => ({
  isChatHidden: false,
  sceneData: undefined,
  keyOpenAI: "",
  setIsChatHidden: (isHidden: boolean) => set({ isChatHidden: isHidden }),
  setSceneData: (exoplanet: Exoplanet) => set({ sceneData: exoplanet }),
  setKeyOpenAI: (apiKey: string) => set({ keyOpenAI: apiKey }),
}))
