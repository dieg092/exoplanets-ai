import { DiamondMinus } from "lucide-react"
import { useToggleChat } from "@/hooks/useToggleChat"
import { useChatStore } from "@/store/chat"

const ChatHeader = () => {
  const { setIsChatHidden } = useToggleChat()
  const keyOpenAI = useChatStore((store) => store.keyOpenAI)
  const setKeyOpenAI = useChatStore((store) => store.setKeyOpenAI)

  return (
    <div className="flex justify-between items-center px-4 py-3 text-white text-lg w-full">
      <input
        value={keyOpenAI}
        onChange={(e) => setKeyOpenAI(e.target.value)}
        type="password"
        placeholder="OPEN_AI API_KEY"
        className="border rounded-md mr-2 p-1 bg-black bg-opacity-30 text-white backdrop-blur-md"
      />
      <DiamondMinus
        className="hover:cursor-pointer hover:text-slate-400 hover:transition hover:ease-in-out hover:scale-125"
        onClick={() => setIsChatHidden(true)}
      />
    </div>
  )
}

export default ChatHeader
