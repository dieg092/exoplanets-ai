"use client";

import { FormEvent, useState } from "react";
import { generateText, tool } from "ai";
import { ollama } from "ollama-ai-provider";
import exoplantets from "@/data/exoplanets.json";
import fields_definition from "@/data/fields_definition.json";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult("");
    setIsLoading(true);

    try {
      const result = await generateText({
        maxTokens: 40,
        messages: [
          {
            content: `Eres un experto en exoplanetas, dada la siguiente lista de exoplanetas ${JSON.stringify(
              exoplantets
            )}, representan un conjunto de llaves y valores, cada llave y valor hace difinicion a: ${fields_definition.toString()}. Debes responder en el idioma español  a lo que el usuario te pregunte basandote en estos datos. Se directo y acertivo.`,
            role: "system",
          },
          {
            content: prompt,
            role: "user",
          },
        ],
        // prompt: prompt,
        model: ollama("llama3"),
      });
      setResult(result.text);
    } catch (error) {
      console.error("Error generating text:", error);
      setResult("Failed to generate text");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
      {result && <p>Result: {result}</p>}
    </div>
  );
}
