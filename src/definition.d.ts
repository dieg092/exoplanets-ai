// Original API JSON
export type JsonApi = {
  kepid: number;
  kepler_name: string | null;
  koi_disposition: string;
  koi_period: number | null;
  koi_prad: number | null;
  koi_sma: number | null;
  koi_teq: number | null;
  koi_dor: number | null;
  koi_count: number | null;
  koi_steff: number | null;
  koi_slogg: number | null;
  koi_srad: number | null;
  koi_smass: number | null;
  koi_pdisposition: string;
};

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
  | "koi_pdisposition";

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
  | "stellar_mass";
