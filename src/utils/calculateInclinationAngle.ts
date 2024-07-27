import { DEG2RAD } from "three/src/math/MathUtils.js"

export const calculateInclinationAngle = (degrees: number) => {
  if (degrees === 23.5) return degrees * DEG2RAD // return earth degrees

  // Normalice random degress between 0 - 50
  const MIN_1 = 0
  const MAX_1 = 100
  const MIN_2 = 0
  const MAX_2 = 50

  const newDegrees =
    (degrees - MIN_1) * ((MAX_2 - MIN_2) / (MAX_1 - MIN_1)) + MIN_2

  return newDegrees * DEG2RAD
}
