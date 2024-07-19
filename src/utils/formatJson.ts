import type { JsonApi, OldKeys, NewKeys, ExoplanetTexture } from "@/definition";
import { assignTexture } from "./assignTexture";

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
};

export const formatJson = (json: Array<JsonApi>) => {
  return json.map((jsonObject) => {
    //Create new object formatted
    const formattedObject: { [key: string]: string | number | null } = {};

    Object.keys(jsonObject).map((key) => {
      //Get new key, example: newObjectFields.kepid => "id"
      const newKey = newObjectFields[key as OldKeys];

      // Replace old fields json fom (API) to new object fields
      if (newKey) {
        //apply new key
        formattedObject[newKey] = jsonObject[key as OldKeys];
      } else {
        //apply old key
        formattedObject[key] = jsonObject[key as OldKeys];
      }

      //If exist kepler name, add host star
      formattedObject.host_star = jsonObject.kepler_name?.split(" ")[0] ?? null;
    });

    const dataToTexture: ExoplanetTexture = {
      eq_temp: jsonObject.koi_teq,
      rad: jsonObject.koi_prad,
      star_distance: jsonObject.koi_dor,
    };

    formattedObject.texture = assignTexture(dataToTexture);
    return formattedObject;
  });
};
