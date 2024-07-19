import { formatJson } from "@/utils/formatJson";
import apiExoplanetsJson from "@/data/apiExoplanets.json";

export async function GET(req: Request, res: Response) {
  const jsonFormatted = formatJson(apiExoplanetsJson);

  return Response.json(jsonFormatted);
}
