import { DiamondMinus } from "lucide-react"
import { useToggleChat } from "@/hooks/useToggleChat"

type Props = {
  openaiKey: string
  handleChangeOpenaiKey: (e: string) => void
}

const ChatHeader = ({ openaiKey, handleChangeOpenaiKey }: Props) => {
  const { setIsChatHidden } = useToggleChat()

  return (
    <div className="flex items-center px-4 py-3 text-white text-lg w-full">
      <input
        value={openaiKey}
        onChange={e => handleChangeOpenaiKey(e.target.value)}
        type="password"
        placeholder="OpenAI API_KEY"
        className="border w-full rounded-md mr-2 py-1 px-2 bg-black bg-opacity-30 text-white backdrop-blur-md"
      />
      <DiamondMinus
        className="ml-auto hover:cursor-pointer hover:text-slate-400 hover:transition hover:ease-in-out hover:scale-125"
        onClick={() => setIsChatHidden(true)}
      />
    </div>
  )
}

export default ChatHeader
