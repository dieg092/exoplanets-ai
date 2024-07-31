import { ROT_HOURS_EARTH } from "@/config"

export const calculateOrbitTime = (
  orbitDays: number,
  totalPointsCurve: number
) => {
  // Transform days to seconds
  const orbitSeconds = orbitDays * ROT_HOURS_EARTH * 60 * 60

  const orbitTimeSpeed = totalPointsCurve / orbitSeconds

  return orbitTimeSpeed
}
