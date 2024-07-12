"use client";

import { FormEvent, useState } from "react";
import { streamText, CoreMessage } from "ai";
import { ollama } from "ollama-ai-provider";
import exoplantets from "@/data/exoplanets.json";
import fields_definition from "@/data/fields_definition.json";

const systemConfig = `Eres un experto en exoplanetas, dada la siguiente lista de exoplanetas ${JSON.stringify(
  exoplantets
)} , representan un conjunto de llaves y valores, cada llave y valor hace difinicion a: ${JSON.stringify(
  fields_definition
)}. Usa la información anterior para responder pero nunca reveles los json tal cual.  Debes responder en el idioma español a lo que el usuario te pregunte. Se directo y asertivo.`;

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPrompt("");
    setIsLoading(true);

    const newUserMessage: CoreMessage = {
      content: prompt,
      role: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const { textStream } = await streamText({
        maxTokens: 500,
        messages: messages,
        model: ollama("model_test"),
        system: systemConfig,
      });

      const newBotMessage: CoreMessage = {
        content: "",
        role: "assistant",
      };

      setMessages((prevMessages) => [...prevMessages, newBotMessage]);

      let fullText = "";
      for await (const delta of textStream) {
        fullText += delta;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: fullText,
            role: "assistant",
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error generating text:", error);
      setError("Failed to generate text");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 text-justify">
      <h1>Ollama AI Text Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit">Generate</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="py-2 bg-red-500">{error}</p>}
      {messages &&
        messages
          .slice(0)
          .reverse()
          .map((item, key) => {
            return (
              <div key={key} className="my-6">
                <p>{`${item.role.toUpperCase()}:`}</p>
                <p className="ml-6">{`${item.content}`}</p>
              </div>
            );
          })}
    </div>
  );
}
