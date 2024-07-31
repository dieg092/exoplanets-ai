export const calculateRotationVelocity = (hours: number) => {
  const secondsPerDay = hours * 60 * 60
  const degreesPerDay = 360
  const degressPerSecondsToRadians = degreesPerDay * (Math.PI / 180)
  const degressPerSeconds = degressPerSecondsToRadians / secondsPerDay

  return degressPerSeconds
}
