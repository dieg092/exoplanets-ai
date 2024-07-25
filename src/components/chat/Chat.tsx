"use client"
import { motion } from "framer-motion"
import { DiamondMinus, Send, StopCircle } from "lucide-react"
import { useChat } from "@/hooks/useChat"

const Chat = () => {
  const {
    input,
    messagesEndRef,
    conversation,
    error,
    isLoading,
    isInputDisabled,
    isChatHidden,
    setIsChatHidden,
    stop,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
  } = useChat()

  if (isChatHidden) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="opacity-100 transition-opacity duration-700 absolute flex flex-col top-1/2 md:left-[82%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 md:w-1/3 w-2/3 h-5/6 bg-neutral-900 bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl border border-white border-opacity-20"
    >
      <div className="flex justify-end px-4 py-3 text-white text-lg w-full">
        <DiamondMinus
          className="hover:cursor-pointer hover:text-slate-400 hover:transition hover:ease-in-out hover:scale-125"
          onClick={() => setIsChatHidden(true)}
        />
      </div>
      <div className="flex-grow overflow-y-auto px-4 rounded-xl no-scrollbar">
        {conversation.map(message => (
          <div
            key={message.id}
            className={`py-2 text-white ${
              message.role === "user" && "text-end"
            }`}
          >
            <p className="font-bold">
              {message.role === "user" ? "User: " : "AI: "}
            </p>
            <p className="font-regular">{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center px-3 pb-3">
        <textarea
          className="border rounded-md mr-2 flex-grow p-2 bg-black bg-opacity-30 text-white backdrop-blur-md"
          name="prompt"
          value={input}
          onChange={handleInputChange}
          id="input"
          onKeyDown={handleKeyDown}
          style={{ resize: "none" }}
        />

        <button
          type={`${isLoading ? "button" : "submit"}`}
          onClick={isLoading ? stop : () => {}}
          disabled={!isLoading && isInputDisabled}
          className="p-4 bg-opacity-50 text-white rounded-full flex items-center justify-center ml-2"
        >
          {isLoading ? <StopCircle size={35} /> : <Send size={30} />}
        </button>
      </form>
      {error && <p className="text-red-500 px-4 pb-2">{error.message}</p>}
    </motion.div>
  )
}

export default Chat
