import { DiamondMinus } from "lucide-react"
import { useChat } from "@/hooks/useChat"

const ChatHeader = () => {
  const { setIsChatHidden } = useChat()

  return (
    <div className="flex justify-end px-4 py-3 text-white text-lg w-full">
      <DiamondMinus
        className="hover:cursor-pointer hover:text-slate-400 hover:transition hover:ease-in-out hover:scale-125"
        onClick={() => setIsChatHidden(true)}
      />
    </div>
  )
}

export default ChatHeader
