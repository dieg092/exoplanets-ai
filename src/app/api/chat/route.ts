import { convertToCoreMessages, streamText, tool, ToolInvocation } from "ai";
import { ollama } from "ollama-ai-provider";
import { createOpenAI } from "@ai-sdk/openai";
import formatExoplanets from "@/data/formatExoplanets.json";
import { z } from "zod";
import { filterByConfirmed, getRandomExoplanet } from "@/utils/dataActions";

export const maxDuration = 30;

const systemConfig = `Eres la base de datos de exoplanetas de la NASA. 
No hables de ningún tema que no esté relacionado con exoplanetas.
Debes responder en el idioma en el que el usuario te pregunte. 
Se directo y asertivo.`;

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict", // Otras configuraciones personalizadas
});

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = await streamText({
    model: openai.chat("gpt-3.5-turbo"),
    system: systemConfig,
    messages: convertToCoreMessages(messages),
    temperature: 0,
    topP: 1,
    tools: {
      exoplanets_confirmed: tool({
        description: "Muestra el total de exoplanetas confirmados por la NASA",
        parameters: z.object({}),
        execute: async () => {
          return filterByConfirmed(formatExoplanets).length;
        },
      }),
      exoplanet_random: tool({
        description:
          "Muestra un exoplaneta random de la base de datos de la NASA",
        parameters: z.object({}),
        execute: async () => {
          return getRandomExoplanet(formatExoplanets);
        },
      }),
    },
  });

  return result.toAIStreamResponse();
}
