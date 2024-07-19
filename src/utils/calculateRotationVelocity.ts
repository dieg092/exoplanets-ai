export const calculateRotationVelocity = (orbitPeriod: number) => {
  const angularMediaVelocity = (2 * Math.PI) / orbitPeriod;

  return angularMediaVelocity;
};
