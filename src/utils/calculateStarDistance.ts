import { UaToKm } from "./UaToKm";

export const calculateStarDistance = (distance: number, unit: number) => {
  // Convert UA to KM
  return UaToKm(distance) / unit;
};
