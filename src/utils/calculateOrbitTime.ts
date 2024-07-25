export const calculateOrbitTime = (
  orbitDays: number,
  totalPointsCurve: number
) => {
  // Transform days to seconds
  const orbitSeconds = orbitDays * 24 * 60 * 60;

  const orbitTimeSpeed = totalPointsCurve / orbitSeconds;

  return orbitTimeSpeed;
};
