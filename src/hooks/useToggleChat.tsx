import { useChatStore } from "@/store/chat"

export const useToggleChat = () => {
  const isChatHidden = useChatStore(store => store.isChatHidden)
  const setIsChatHidden = useChatStore(store => store.setIsChatHidden)

  return {
    isChatHidden,
    setIsChatHidden,
  }
}
