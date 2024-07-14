"use client";
import Chat from "./Chat";
import { ChatIcon } from "./ChatIcon";
import { useState } from "react";

export const ChatWrapper = () => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <div>
      {isHidden ? (
        <ChatIcon setIsHidden={setIsHidden} />
      ) : (
        <Chat setIsHidden={setIsHidden} />
      )}
    </div>
  );
};
