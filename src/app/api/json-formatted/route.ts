import { formatJson } from "@/utils/formatJson"
import apiExoplanetsJson from "@/data/apiExoplanets.json"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const jsonFormatted = formatJson(apiExoplanetsJson)
    const filePath = path.join(process.cwd(), "src/data/exoplanets.json")

    await fs.writeFile(filePath, JSON.stringify(jsonFormatted, null, 2))

    return new Response(JSON.stringify(jsonFormatted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error al escribir el archivo" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
