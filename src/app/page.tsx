"use client";

import { useState } from "react";
import { generateText, tool } from "ai";
import { ollama } from "ollama-ai-provider";
import exoplantets from "@/data/exoplanets.json";
import fields_definition from "@/data/fields_definition.json";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await generateText({
        maxTokens: 40,
        messages: [
          {
            content: JSON.stringify(exoplantets),
            role: "system",
          },
          {
            content: fields_definition.toString(),
            role: "system",
          },
          {
            content: prompt,
            role: "user",
          },
        ],
        // prompt: prompt,
        model: ollama("llama3"),
        system: "Eres un experto en exoplanetas",
      });

      setResult(result.text);
    } catch (error) {
      console.error("Error generating text:", error);
      setResult("Failed to generate text");
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
      {result && <p>Result: {result}</p>}
    </div>
  );
}
