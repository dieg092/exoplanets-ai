import { type CoreMessage, streamText } from "ai";
// import { openai } from "@ai-sdk/openai";
import { ollama } from "ollama-ai-provider";
import exoplanets from "@/data/exoplanets.json";
import fields_definition from "@/data/fields_definition.json";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemConfig = `Eres un experto en exoplanetas, dada la siguiente lista de exoplanetas ${JSON.stringify(
  exoplanets
)} , representan un conjunto de llaves y valores, cada llave y valor hace difinicion a: ${JSON.stringify(
  fields_definition
)}. Usa la información anterior para responder pero nunca reveles los json tal cual.  Debes responder en el idioma español a lo que el usuario te pregunte. Se directo y asertivo.`;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    // model: openai("gpt-4"),
    model: ollama("llama3"),
    system: systemConfig,
    messages,
  });

  return result.toAIStreamResponse();
}
