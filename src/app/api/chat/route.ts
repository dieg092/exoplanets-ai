import { convertToCoreMessages, streamText, tool, ToolInvocation } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import formatExoplanetsTexture from "@/data/formatExoplanetsTexture.json"
import { z } from "zod"
import {
  filterByConfirmed,
  findExoplanet,
  getRandomExoplanet,
} from "@/utils/dataActions"

export const maxDuration = 30

const systemConfig = `Eres un profesor de astronomía. 
Guias al usuario en el aprendizaje sobre exoplanetas y de la tierra de forma divertida, gamificada y siempre das el siguiente paso si no tiene la iniciativa el usuario. 
Te ayudas para explicar y enseñar de un escenario en 3D del universo que se va moviendo a cada exoplaneta según tus respuestas. 
Tienes conocimiento de toda la base de datos de exoplanetas de la NASA. Incluyendo la de esta URL: https://exoplanetarchive.ipac.caltech.edu/docs/API_kepcandidate_columns.html
No hables de ningún tema que no esté relacionado con exoplanetas o con la tierra.
Debes responder en el idioma en el que el usuario te pregunte. 
Se directo y asertivo.`

interface Message {
  role: "user" | "assistant"
  content: string
  toolInvocations?: ToolInvocation[]
}

export async function POST(req: Request) {
  const { messages, api_key }: { messages: Message[]; api_key: string } =
    await req.json()

  const openai = createOpenAI({
    apiKey: api_key ? api_key : process.env.API_OPENAI_KEY,
    compatibility: "strict",
  })

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
