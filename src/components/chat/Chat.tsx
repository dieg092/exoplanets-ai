"use client";

import { useLayoutEffect, useRef } from "react";
import { Message, useChat } from "ai/react";
import { DiamondMinus, Loader, Send } from "lucide-react";

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "¡Hola! Estoy aquí para ser tu guía en el aprendizaje acerca de exoplanetas.",
  },
];

const Chat = ({
  isChatHidden,
  handleChatHidden,
}: {
  isChatHidden: boolean;
  handleChatHidden: () => void;
}) => {
  const { messages, input, isLoading, error, handleInputChange, handleSubmit } =
    useChat({
      api: "api/chat",
      maxToolRoundtrips: 1,
      initialMessages: initialMessages,
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputDisabled = input.trim() === "" || isLoading;
  const conversation = messages.filter((message) => !message.toolInvocations);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      !inputDisabled && handleSubmit(e);
    }
  };

  return (
    <div
      className={`${
        isChatHidden ? "opacity-0 z-10" : "opacity-100 z-50"
      } transition-opacity duration-700 absolute flex flex-col top-1/2 md:left-[82%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 md:w-1/3 w-2/3 h-5/6 bg-neutral-900 bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl border border-white border-opacity-20`}
    >
      <div className="flex justify-end px-4 py-3 text-white text-lg w-full">
        <DiamondMinus
          className={`${
            !isChatHidden && "hover:cursor-pointer"
          } hover:text-slate-400 hover:transition hover:ease-in-out hover:scale-125 `}
          onClick={() => {
            if (!isChatHidden) {
              handleChatHidden();
            }
          }}
        />
      </div>
      <div className="flex-grow overflow-y-auto px-4 rounded-xl no-scrollbar">
        {conversation.map((message) => (
          <div key={message.id} className="py-2 text-white">
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
          type="submit"
          disabled={inputDisabled}
          className="p-4 bg-opacity-50 text-white rounded-full flex items-center justify-center"
        >
          {isLoading ? (
            <Loader className="animate-spin" size={30} />
          ) : (
            <Send size={30} />
          )}
        </button>
      </form>
      {error && <p className="text-red-500 px-4 pb-2">{error.message}</p>}
    </div>
  );
};

export default Chat;
