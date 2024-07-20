const dayInSeconds = 24 * 60 * 60;
export const calculateRotationVelocity = (orbitPeriod: number) => {
  const angularMediaVelocity = (2 * Math.PI) / (orbitPeriod * dayInSeconds);

  return angularMediaVelocity;
};
