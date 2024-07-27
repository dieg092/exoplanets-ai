// Original API JSON
export type JsonApi = {
  kepid: number
  kepler_name: string | null
  koi_disposition: string
  koi_period: number | null
  koi_prad: number | null
  koi_sma: number | null
  koi_teq: number | null
  koi_dor: number | null
  koi_count: number | null
  koi_steff: number | null
  koi_slogg: number | null
  koi_srad: number | null
  koi_smass: number | null
  koi_pdisposition: string
  koi_incl: number | null
}

export type Exoplanet = {
  id: number
  host_star: string | null
  name: string | null
  archive_disposition: string
  period: number | null
  rad: number | null
  orbit: number | null
  eq_temp: number | null
  star_distance: number | null
  number_planets: number | null
  stellar_temp: number | null
  surface_gravity: number | null
  stellar_rad: number | null
  stellar_mass: number | null
  disposition: string
  texture: string
  inclination: number | null
}

export type CosmicEntityInclination = [number, number, number]
export type CosmicEntityType = "PLANET" | "STAR" | "UNIVERSE"
export type CosmicEntityTexture = {
  eq_temp: number | null
  rad: number | null
  star_distance: number | null
}

export type Texture =
  | "co2_acidosulfurico.jpg"
  | "helio_amoniaco.jpg"
  | "helio_amoniaco_nublina.jpg"
  | "hidrogeno_metano_nieblina.jpg"
  | "hidrogeno_metano.jpg"
  | "hielo_silicatos.jpg"
  | "silicatos_regolito.jpg"
  | "hematita_arenisca.jpg"
  | "basalto_regolito.jpg"
  | "basalto_anortosita.jpg"
  | "nuves.jpg"
  | "basalto_riolita.jpg"

export type OldKeys =
  | "kepid"
  | "kepler_name"
  | "koi_disposition"
  | "koi_period"
  | "koi_prad"
  | "koi_sma"
  | "koi_teq"
  | "koi_dor"
  | "koi_count"
  | "koi_steff"
  | "koi_slogg"
  | "koi_srad"
  | "koi_smass"
  | "koi_pdisposition"
  | "koi_incl"

export type NewKeys =
  | "id"
  | "name"
  | "archive_disposition"
  | "disposition"
  | "period"
  | "rad"
  | "orbit"
  | "eq_temp"
  | "star_distance"
  | "number_planets"
  | "stellar_temp"
  | "surface_gravity"
  | "stellar_rad"
  | "stellar_mass"
  | "texture"
  | "inclination"

// zustand
// Chat
export type ChatStoreType = {
  isChatHidden: boolean
  sceneData?: Exoplanet
  keyOpenAI: string
  setIsChatHidden: (boolean: boolean) => void
  setSceneData: (exoplanet: Exoplanet) => void
  setKeyOpenAI: (apiKey: string) => void
}
