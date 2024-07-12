"use client";

import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, isLoading, error, handleInputChange, handleSubmit } =
    useChat({
      api: "api/chat",
    });

  return (
    <div className="p-3">
      {messages.map((message) => (
        <div key={message.id} className="py-1">
          <p className="font-bold">
            {message.role === "user" ? "User: " : "AI: "}
          </p>
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          className="border rounded-md mr-2"
          name="prompt"
          value={input}
          onChange={handleInputChange}
          id="input"
        />
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
        {isLoading && <p>Loading...</p>}
      </form>
    </div>
  );
}
