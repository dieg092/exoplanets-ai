import { create } from "zustand";
import type { ChatStoreType } from "@/definition";

export const useChatStore = create<ChatStoreType>((set) => ({
  isChatHidden: false,
  setIsChatHidden: (isHidden: boolean) => set({ isChatHidden: isHidden }),
}));
