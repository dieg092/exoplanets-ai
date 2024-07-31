import { CosmicEntityTexture, Texture } from "@/definition"

type TemperatureRange = {
  min: number
  max: number
  image: Texture
}

const ROCKY_ATHMOSPHERE_DEFAULT = "basalto_regolito.jpg"
const ROCKY_DEFAULT = "co2_acidosulfurico.jpg"
const GASEOUS_DEFAULT = "helio_amoniaco.jpg"

const GAESOUS_EXOPLANET: TemperatureRange[] = [
  { min: 1501, max: Infinity, image: "co2_acidosulfurico.jpg" },
  { min: 1001, max: 1500, image: "helio_amoniaco.jpg" },
  { min: 601, max: 1000, image: "helio_amoniaco_nublina.jpg" },
  { min: 274, max: 600, image: "hidrogeno_metano_nieblina.jpg" },
  { min: -Infinity, max: 273, image: "hidrogeno_metano.jpg" },
]

const ROCKY_EXOPLANET: TemperatureRange[] = [
  { min: -Infinity, max: 273, image: "hielo_silicatos.jpg" },
  { min: 274, max: 373, image: "silicatos_regolito.jpg" },
  { min: 374, max: 1000, image: "hematita_arenisca.jpg" },
  { min: 1001, max: 1500, image: "basalto_regolito.jpg" },
  { min: 1501, max: Infinity, image: "basalto_anortosita.jpg" },
]

const ROCY_ATMOSPHERE_EXOPLANET: TemperatureRange[] = [
  { min: -Infinity, max: 273, image: "hielo_silicatos.jpg" },
  { min: 274, max: 373, image: "nuves.jpg" },
  { min: 374, max: 1000, image: "hematita_arenisca.jpg" },
  { min: 1001, max: 1500, image: "basalto_riolita.jpg" },
  { min: 1501, max: Infinity, image: "co2_acidosulfurico.jpg" },
]

const getTexture = (
  temperature: number | null,
  lookup: TemperatureRange[],
  defaultImage: Texture
): Texture => {
  if (temperature === null) return defaultImage
  const entry = lookup.find(
    range => temperature >= range.min && temperature <= range.max
  )

  return entry ? entry.image : defaultImage
}

const getGaseousTexture = (temperature: number | null): Texture => {
  return getTexture(temperature, GAESOUS_EXOPLANET, GASEOUS_DEFAULT)
}

const getRockyTexture = (
  temperature: number | null,
  isRockyWithoutAtmosphere: boolean
): Texture => {
  const image = isRockyWithoutAtmosphere
    ? ROCKY_EXOPLANET
    : ROCY_ATMOSPHERE_EXOPLANET
  const defaultImage = isRockyWithoutAtmosphere
    ? ROCKY_ATHMOSPHERE_DEFAULT
    : ROCKY_DEFAULT

  return getTexture(temperature, image, defaultImage)
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
