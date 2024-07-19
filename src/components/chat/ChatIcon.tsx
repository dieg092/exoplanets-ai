"use client";
import { motion } from "framer-motion";
import { useChatStore } from "@/store/chat";
import { BotMessageSquare } from "lucide-react";

export const ChatIcon = () => {
  const setIsChatHidden = useChatStore((store) => store.setIsChatHidden);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.6 }}
    >
      <div
        className={
          "hover:cursor-pointer absolute bottom-16 right-16 p-4 bg-neutral-900 hover:bg-neutral-600 hover:bg-opacity-40 hover:backdrop-blur-lg bg-opacity-20 backdrop-blur-lg rounded-full shadow-xl border border-white border-opacity-20"
        }
        onClick={() => setIsChatHidden(false)}
      >
        <BotMessageSquare className="text-white" />
      </div>
    </motion.div>
  );
};
