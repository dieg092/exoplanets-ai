import { useScroll } from "@/hooks/useScroll"
import { Message } from "ai"

type props = {
  conversation: Message[]
}

const ChatBody = ({ conversation }: props) => {
  const { scrollRef } = useScroll({ element: conversation })

  return (
    <div className="flex-grow overflow-y-auto px-4 rounded-xl no-scrollbar">
      {conversation.map(message => (
        <div
          key={message.id}
          className={`py-2 text-white ${message.role === "user" && "text-end"}`}
        >
          <p className="font-bold">
            {message.role === "user" ? "User: " : "AI: "}
          </p>
          <p className="font-regular">{message.content}</p>
        </div>
      ))}
      <div ref={scrollRef} />
    </div>
  )
}

export default ChatBody
