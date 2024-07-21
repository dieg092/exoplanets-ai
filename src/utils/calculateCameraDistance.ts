export const calculateCameraDistance = (exoplanetRadius: number) => {
  // Calculate the distance between the camera and the exoplanet to avoid crossing it
  const DIAMETER = 2.5;

  return exoplanetRadius * DIAMETER;
};
