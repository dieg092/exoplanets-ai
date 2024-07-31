import type {
  JsonApi,
  OldKeys,
  NewKeys,
  CosmicEntityTexture,
} from "@/definition"
import { assignTexture } from "./assignTexture"
import { ROT_HOURS_EARTH } from "@/config"

const newObjectFields: Record<OldKeys, NewKeys> = {
  kepid: "id",
  kepler_name: "name",
  koi_disposition: "archive_disposition",
  koi_period: "period",
  koi_prad: "rad",
  koi_sma: "orbit",
  koi_teq: "eq_temp",
  koi_dor: "star_distance",
  koi_count: "number_planets",
  koi_steff: "stellar_temp",
  koi_slogg: "surface_gravity",
  koi_srad: "stellar_rad",
  koi_smass: "stellar_mass",
  koi_pdisposition: "disposition",
  koi_incl: "inclination",
  rot_hours: "rot_hours",
}

export const formatJson = (json: Array<JsonApi>) => {
  const newJson = json.map(jsonObject => {
    //Create new object formatted
    const formattedObject: { [key: string]: string | number | null } = {}

    Object.keys(jsonObject).map(key => {
      //Get new key, example: newObjectFields.kepid => "id"
      const newKey = newObjectFields[key as OldKeys]

      // Replace old fields json fom (API) to new object fields
      if (newKey) {
        //apply new key
        formattedObject[newKey] = jsonObject[key as OldKeys]
      } else {
        //apply old key
        formattedObject[key] = jsonObject[key as OldKeys]
      }

      //If exist kepler name, add host star
      formattedObject.host_star = jsonObject.kepler_name?.split(" ")[0] ?? null
    })

    const dataToTexture: CosmicEntityTexture = {
      eq_temp: jsonObject.koi_teq,
      rad: jsonObject.koi_prad,
      star_distance: jsonObject.koi_dor,
    }

    formattedObject.texture = assignTexture(dataToTexture)
    formattedObject.rot_hours = ROT_HOURS_EARTH
    return formattedObject
  })

  newJson.push(earth)
  return newJson
}

const earth = {
  id: 0,
  host_star: "Sun",
  name: "Earth",
  archive_disposition: "CONFIRMED",
  period: 365.25,
  rad: 1,
  orbit: 1,
  eq_temp: 288,
  disposition: "CONFIRMED",
  star_distance: 0,
  number_planets: 8,
  stellar_temp: 5778,
  surface_gravity: 9.807,
  stellar_rad: 1,
  stellar_mass: 1,
  inclination: 23.5,
  texture: "tierra.jpg",
  rot_hours: ROT_HOURS_EARTH,
}
