import { convertToCoreMessages, streamText, tool, ToolInvocation } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import exoplanetsData from "@/data/exoplanets.json"
import { z } from "zod"
import {
  fastVelocity,
  filterByConfirmed,
  filterByMajorOrbit,
  filterByMinorOrbit,
  filterByUnConfirmed,
  findExoplanet,
  getListExoplanetsName,
  getRandomExoplanet,
} from "@/utils/dataActions"
import { Exoplanet } from "@/definition"

export const maxDuration = 30
const exoplanets: Exoplanet[] = exoplanetsData as Exoplanet[]

const systemConfig = `Eres un profesor de astronomía. Tu rol es guiar al usuario en el aprendizaje de los exoplanetas y también de la información de la tierra de forma divertida mostrando emojis en cada explicación y siempre debes dar el siguiente paso si el usuario no tiene iniciativa en preguntar. Ten en cuenta que todos los exoplanetas giran a velocidad de la vida real, asi que debes preguntarle al usuario no solo si quiere ver otros exoplanetas, si no, también si quiere aumentar la velocidad de giro o mantenerla en estado normal o si quiere que le muestres una lista de los exoplanetas disponibles. 
Te ayudas para explicar y enseñar de un escenario en 3D del universo que se va moviendo a cada exoplaneta según tus respuestas. 
Tienes conocimiento de toda la base de datos de exoplanetas de la NASA. Incluyendo la de esta URL: https://exoplanetarchive.ipac.caltech.edu/docs/API_kepcandidate_columns.html
No hables de ningún tema que no esté relacionado con exoplanetas o con la tierra.
Debes responder en el idioma en el que el usuario te pregunte. 
Se directo, asertivo y entretenido.`

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(req: Request) {
  const { messages, api_key }: { messages: Message[]; api_key: string } =
    await req.json()

  const apiKey = api_key ? api_key : process.env.API_OPENAI_KEY

  // Crear instancia de OpenAI
  const openai = createOpenAI({
    apiKey: apiKey,
    compatibility: "strict",
  })

  try {
    const result = await streamText({
      model: openai.chat("gpt-3.5-turbo"),
      system: systemConfig,
      messages: convertToCoreMessages(messages),
      temperature: 0,
      topP: 1,

      tools: {
        exoplanets_confirmed: tool({
          description:
            "Muestra cuantos exoplanetas confirmados hay por la NASA",
          parameters: z.object({}),
          execute: async () => {
            return {
              updateScene: false,
              data: filterByConfirmed(exoplanets).length,
            }
          },
        }),
        exoplanets_unconfirmed: tool({
          description:
            "Muestra el total de exoplanetas no confirmados por la NASA",
          parameters: z.object({}),
          execute: async () => {
            return {
              updateScene: false,
              data: filterByUnConfirmed(exoplanets).length,
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
              data: getRandomExoplanet(exoplanets),
            }
          },
        }),
        exoplanet_find: tool({
          description:
            "Muestra el exoplaneta si el usuario introduce un nombre de un exoplaneta o si te dice que muestres la tierra, busca el que tiene nombre de Earth",
          parameters: z.object({ exoplanet_name: z.string() }),
          execute: async ({ exoplanet_name }) => {
            const exoplanet = findExoplanet(exoplanets, exoplanet_name)

            if (exoplanet !== null) {
              return {
                updateScene: true,
                data: exoplanet,
              }
            } else {
              // Exoplanet not found
              return {
                updateScene: false,
                data: "No se ha encontrado el exoplaneta solicitado",
              }
            }
          },
        }),
        exoplanet_standar_velocity: tool({
          description:
            "Ajusta la velocidad orbital del exoplaneta que se ha mostrado o la velocidad de giro del exoplaneta mostrado a una velocidad baja o velocidad normal",
          parameters: z.object({ exoplanet_name: z.string() }),
          execute: async ({ exoplanet_name }) => {
            const exoplanet = findExoplanet(exoplanets, exoplanet_name)

            if (exoplanet !== null) {
              return {
                updateScene: true,
                data: exoplanet,
              }
            } else {
              // Exoplanet not found
              return {
                updateScene: false,
                data: "No se ha encontrado el exoplaneta solicitado",
              }
            }
          },
        }),
        exoplanet_fast_velocity: tool({
          description:
            "Ajusta la velocidad orbital del exoplaneta que se ha mostrado o la velocidad de giro del exoplaneta mostrado a una velocidad mas rápida",
          parameters: z.object({ exoplanet_name: z.string() }),
          execute: async ({ exoplanet_name }) => {
            const exoplanet = fastVelocity(exoplanets, exoplanet_name)

            if (exoplanet !== null) {
              return {
                updateScene: true,
                data: exoplanet,
              }
            } else {
              // Exoplanet not found
              return {
                updateScene: false,
                data: "No se ha encontrado el exoplaneta solicitado",
              }
            }
          },
        }),
        exoplanet_show_list_names: tool({
          description:
            "Muestra el nombre de todos los exoplanetas disponibles o muestra una lista de los exoplanetas o si te pregunta cuales son los exoplanetas",
          parameters: z.object({}),
          execute: async ({}) => {
            return {
              updateScene: false,
              data:
                "Al final colocale un emoji a cada exoplaneta y di que es una lista corta, que si quiere puedes generar nuevamente la lista" +
                getListExoplanetsName(exoplanets, 10),
            }
          },
        }),
        exoplanets_major_orbit: tool({
          description: "Muestra el exoplaneta con mayor tiempo de orbita",
          parameters: z.object({}),
          execute: async () => {
            return {
              updateScene: true,
              data: filterByMajorOrbit(exoplanets),
            }
          },
        }),
        exoplanets_minor_orbit: tool({
          description: "Muestra el exoplaneta con menor tiempo de orbita",
          parameters: z.object({}),
          execute: async () => {
            return {
              updateScene: true,
              data: filterByMinorOrbit(exoplanets),
            }
          },
        }),
      },
    })

    return result.toAIStreamResponse()
  } catch (error) {
    return new Response(
      "API_KEY de Open AI errónea. Puedes crear una en https://platform.openai.com/account/api-keys",
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
