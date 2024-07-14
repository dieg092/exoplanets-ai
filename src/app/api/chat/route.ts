import { convertToCoreMessages, streamText, tool, ToolInvocation } from "ai";
import { ollama } from "ollama-ai-provider";
import { openai } from "@ai-sdk/openai";
import formatExoplanets from "@/data/formatExoplanets.json";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemConfig = `Eres la base de datos de exoplanetas de la NASA. 
No hables de ningún tema que no esté relacionado con exoplanetas.
Debes responder en el idioma en el que el usuario te pregunte. 
Se directo y asertivo.`;

const filterByConfirmed = (array) => {
  return array.filter((item) => item.archive_disposition === "CONFIRMED")
    .length;
};

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

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
          return filterByConfirmed(formatExoplanets);
        },
      }),
    },
  });

  return result.toAIStreamResponse();
}
