export const calculateRotationVelocity = (rotationPeriodDays: number) => {
  const degreesPerDay = 360 / rotationPeriodDays; // 360 / 172800 ≈ 0.0020833 grados por segundo
  const degreesPerSecond = degreesPerDay / 86400; // 86400 segundos en un día
  const radiansPerSecond = degreesPerSecond * (Math.PI / 180); // convertir a radianes

  return radiansPerSecond;
};
