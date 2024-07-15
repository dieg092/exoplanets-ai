"use client";

import { BotMessageSquare } from "lucide-react";

export const ChatIcon = ({
  isChatHidden,
  handleChatHidden,
}: {
  isChatHidden: boolean;
  handleChatHidden: () => void;
}) => {
  return (
    <div
      className={`${
        !isChatHidden
          ? "opacity-0 z-10"
          : "opacity-100 z-50 hover:cursor-pointer"
      } transition-opacity duration-700 absolute bottom-16 right-16 p-4 bg-neutral-900 hover:bg-neutral-600 hover:bg-opacity-40 hover:backdrop-blur-lg bg-opacity-20 backdrop-blur-lg rounded-full shadow-xl border border-white border-opacity-20`}
      onClick={() => isChatHidden && handleChatHidden()}
    >
      <BotMessageSquare className="text-white" />
    </div>
  );
};
