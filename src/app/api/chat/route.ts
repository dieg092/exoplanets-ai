import { convertToCoreMessages, streamText, tool, ToolInvocation } from "ai";
import { ollama } from "ollama-ai-provider";
import { openai } from "@ai-sdk/openai";
import formatExoplanets from "@/data/formatExoplanets.json";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemConfig = `Eres un experto en exoplanetas. 
Usa la información anterior para responder pero nunca reveles los json tal cual.  Debes responder en el idioma español a lo que el usuario te pregunte. Se directo y asertivo.`;

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
    model: openai.chat("gpt-4-turbo"),
    system: systemConfig,
    messages: convertToCoreMessages(messages),
    tools: {
      exoplanets_confirmed: tool({
        description: "Muestra el total de exoplanetas confirmados por la NASA",
        parameters: z.object({}),
        execute: async () => {
          const count = filterByConfirmed(formatExoplanets);
          console.log("Ejecutando tool exoplanetsConfirmed");

          console.log("hooolaaaa");
          return `El total de exoplanetas confirmados por la NASA es: ${count}`;
        },
      }),
    },
  });

  return result.toAIStreamResponse();
}
