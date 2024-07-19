import type { ExoplanetType } from "@/definition";

export const filterByConfirmed = (array: ExoplanetType[]) => {
  return array.filter((item) => item.archive_disposition === "CONFIRMED");
};

export const getRandomExoplanet = (array: ExoplanetType[]) => {
  const confirmedExoplanets = filterByConfirmed(array);
  if (confirmedExoplanets.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * confirmedExoplanets.length);
  return confirmedExoplanets[randomIndex];
};

export const findExoplanet = (
  array: ExoplanetType[],
  exoplanet_name: string
) => {
  const exoplanet = array.find(
    (exoplanet) => exoplanet.name === exoplanet_name
  );

  if (!exoplanet) {
    return null;
  }

  return exoplanet;
};
