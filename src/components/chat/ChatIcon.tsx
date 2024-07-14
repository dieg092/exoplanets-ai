"use client";

import { BotMessageSquare } from "lucide-react";

export const ChatIcon = ({
  setIsHidden,
}: {
  setIsHidden: (isHidden: boolean) => void;
}) => {
  return (
    <div
      className="absolute bottom-16 right-16 p-4 z-50 bg-neutral-900 hover:bg-neutral-600 hover:cursor-pointer hover:bg-opacity-40 hover:backdrop-blur-lg bg-opacity-20 backdrop-blur-lg rounded-full shadow-xl border border-white border-opacity-20 animate-pulse"
      onClick={(e) => {
        setIsHidden(false);
      }}
    >
      <BotMessageSquare className="text-white" />
    </div>
  );
};
