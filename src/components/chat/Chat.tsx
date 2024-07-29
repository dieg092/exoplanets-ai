import { motion } from "framer-motion"
import { useChat } from "@/hooks/useChat"
import ChatHeader from "./ChatHeader"
import ChatBody from "./ChatBody"
import ChatFooter from "./ChatFooter"
import { useToggleChat } from "@/hooks/useToggleChat"
import { cn } from "@/lib/utils"

const classesArray = [
  "opacity-100",
  "transition-opacity",
  "duration-700",
  "absolute",
  "flex",
  "flex-col",
  "top-1/2",
  "md:left-[82%]",
  "left-[50%]",
  "transform",
  "-translate-x-1/2",
  "-translate-y-1/2",
  "md:w-1/3",
  "w-2/3",
  "h-5/6",
  "bg-neutral-900",
  "bg-opacity-20",
  "backdrop-blur-lg",
  "rounded-xl",
  "shadow-xl",
  "border",
  "border-white",
  "border-opacity-20",
]

const classes = cn(classesArray.join(" "))

const Chat = () => {
  const {
    openaiKey,
    conversation,
    input,
    error,
    isLoading,
    isInputDisabled,
    stop,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    handleChangeOpenaiKey,
  } = useChat()

  const { isChatHidden } = useToggleChat()

  if (isChatHidden) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={classes}
    >
      <ChatHeader
        openaiKey={openaiKey}
        handleChangeOpenaiKey={handleChangeOpenaiKey}
      />
      <ChatBody conversation={conversation} />
      <ChatFooter
        input={input}
        isLoading={isLoading}
        isInputDisabled={isInputDisabled}
        stop={stop}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
      />
      {error && <p className="text-red-500 px-4 pb-2">{error.message}</p>}
    </motion.div>
  )
}

export default Chat
