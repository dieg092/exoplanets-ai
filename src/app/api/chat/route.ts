import { convertToCoreMessages, streamText, tool, ToolInvocation } from "ai"
import { ollama } from "ollama-ai-provider"
import { createOpenAI } from "@ai-sdk/openai"
import formatExoplanetsTexture from "@/data/formatExoplanetsTexture.json"
import { z } from "zod"
import {
  filterByConfirmed,
  findExoplanet,
  getRandomExoplanet,
} from "@/utils/dataActions"

export const maxDuration = 30

const systemConfig = `Eres un profesor. 
Guias en el aprendizaje sobre exoplanetas de forma divertida, gamificada y siempre das el siguiente paso si no tiene la iniciativa tu alumno. 
Te ayudas para eplicar y enseñar de un escenario 3D del universo que se va moviendo a cada exoplaneta según tus respuestas. 
Tienes conocimiento de toda la base de datos de exoplanetas de la NASA.
No hables de ningún tema que no esté relacionado con exoplanetas.
Debes responder en el idioma en el que el usuario te pregunte. 
Se directo y asertivo.`

interface Message {
  role: "user" | "assistant"
  content: string
  toolInvocations?: ToolInvocation[]
}

const openai = createOpenAI({
  apiKey: process.env.API_OPENAI_KEY,
  compatibility: "strict", // Otras configuraciones personalizadas
})

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()

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
          return {
            updateScene: false,
            data: filterByConfirmed(formatExoplanetsTexture).length,
          }
        },
      }),
      exoplanet_random: tool({
        description:
          "Muestra un exoplaneta random de la base de datos de la NASA",
        parameters: z.object({}),
        execute: async () => {
          return {
            updateScene: true,
            data: getRandomExoplanet(formatExoplanetsTexture),
          }
        },
      }),
      exoplanet_find: tool({
        description:
          "Muestra el exoplaneta si el usuario introduce un nombre de un exoplaneta",
        parameters: z.object({ exoplanet_name: z.string() }),
        execute: async ({ exoplanet_name }) => {
          const exoplanet = findExoplanet(
            formatExoplanetsTexture,
            exoplanet_name
          )

          if (exoplanet !== null) {
            return {
              updateScene: true,
              data: exoplanet,
            }
          } else {
            // Exoplanet not found
            return {
              updateScene: false,
              data: "null",
            }
          }
        },
      }),
    },
  })

  return result.toAIStreamResponse()
}
