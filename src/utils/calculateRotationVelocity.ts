const daysToSeconds = (days: number) => days * 24 * 3600;

export const calculateRotationVelocity = (rotationPeriodDays: number) => {
  const rotationPeriodSeconds = daysToSeconds(rotationPeriodDays); // Convertir el periodo de rotación a segundos
  const velocity = 360 / rotationPeriodSeconds; // Velocidad angular en grados por segundo
  console.log(velocity);
  return velocity;
};
