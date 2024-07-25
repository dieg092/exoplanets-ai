"use client"

import { motion } from "framer-motion"
import { BotMessageSquare } from "lucide-react"
import { useChat } from "@/hooks/useChat"

export const ChatIcon = () => {
  const { isChatHidden, setIsChatHidden } = useChat()

  if (!isChatHidden) {
    return null
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.6 }}
      className={
        "hover:cursor-pointer absolute bottom-16 right-16 p-4 bg-neutral-900 hover:bg-neutral-600 hover:bg-opacity-40 hover:backdrop-blur-lg bg-opacity-20 backdrop-blur-lg rounded-full shadow-xl border border-white border-opacity-20"
      }
      onClick={() => setIsChatHidden(false)}
    >
      <BotMessageSquare className="text-white" />
    </motion.div>
  )
}
