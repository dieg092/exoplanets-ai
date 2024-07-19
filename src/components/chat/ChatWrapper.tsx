"use client";
import { useChatStore } from "@/store/chat";
import Chat from "./Chat";
import { ChatIcon } from "./ChatIcon";

export const ChatWrapper = () => {
  const isChatHidden = useChatStore((store) => store.isChatHidden);

  return <>{isChatHidden ? <ChatIcon /> : <Chat />}</>;
};
