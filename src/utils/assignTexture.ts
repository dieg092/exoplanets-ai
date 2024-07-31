import { CosmicEntityTexture, Texture } from "@/definition"

const getGaseousTexture = (temperature: number | null): Texture => {
  if (!temperature) return "helio_amoniaco.jpg"

  if (temperature > 1500) return "co2_acidosulfurico.jpg"
  if (temperature > 1000) return "helio_amoniaco.jpg"
  if (temperature > 600) return "helio_amoniaco_nublina.jpg"
  if (temperature > 273) return "hidrogeno_metano_nieblina.jpg"

  return "hidrogeno_metano.jpg"
}

const getRockyTexture = (
  temperature: number | null,
  isRockyWithoutAtmosphere: boolean
): Texture => {
  if (isRockyWithoutAtmosphere) {
    if (!temperature) return "basalto_regolito.jpg"

    if (temperature <= 273) return "hielo_silicatos.jpg"
    if (temperature <= 373) return "silicatos_regolito.jpg"
    if (temperature <= 1000) return "hematita_arenisca.jpg"
    if (temperature <= 1500) return "basalto_regolito.jpg"

    return "basalto_anortosita.jpg"
  }

  if (!temperature) return "co2_acidosulfurico.jpg"

  if (temperature <= 273) return "hielo_silicatos.jpg"
  if (temperature <= 373) return "nuves.jpg"
  if (temperature <= 1000) return "hematita_arenisca.jpg"
  if (temperature <= 1500) return "basalto_riolita.jpg"

  return "co2_acidosulfurico.jpg"
}

export const assignTexture = (exoplanet: CosmicEntityTexture): Texture => {
  const { eq_temp, rad, star_distance } = exoplanet

  const isGaseous = rad !== null && rad > 10
  const isRockyWithoutAtmosphere =
    rad !== null && star_distance !== null && rad <= 1.5 && star_distance < 0.1

  return isGaseous
    ? getGaseousTexture(eq_temp)
    : getRockyTexture(eq_temp, isRockyWithoutAtmosphere)
}
