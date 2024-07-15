"use client";
import Chat from "./Chat";
import { ChatIcon } from "./ChatIcon";
import { useState } from "react";

export const ChatWrapper = () => {
  const [isChatHidden, setIsChatHidden] = useState(false);

  const handleChatHidden = () => setIsChatHidden(!isChatHidden);

  return (
    <>
      <ChatIcon
        handleChatHidden={handleChatHidden}
        isChatHidden={isChatHidden}
      />

      <Chat handleChatHidden={handleChatHidden} isChatHidden={isChatHidden} />
    </>
  );
};
