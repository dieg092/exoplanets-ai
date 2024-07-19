import { create } from "zustand";
import type { ChatStoreType, ExoplanetType } from "@/definition";

export const useChatStore = create<ChatStoreType>((set) => ({
  isChatHidden: false,
  sceneData: undefined,
  setIsChatHidden: (isHidden: boolean) => set({ isChatHidden: isHidden }),
  setSceneData: (exoplanet: ExoplanetType) => set({ sceneData: exoplanet }),
}));
