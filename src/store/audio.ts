import { AudioStoreType } from "@/definition"
import { saltMusic } from "@/utils/saltMusic"
import { create } from "zustand"

export const useAudioStore = create<AudioStoreType>((set) => ({
  audio: null,
  isPlaying: true,
  volume: 1,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setVolume: (volume: number) => set({ volume }),
  setAudio: (audio: HTMLAudioElement) => set({ audio }),
}))
