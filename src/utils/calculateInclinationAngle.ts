import { DEG2RAD } from "three/src/math/MathUtils.js";

export const calculateInclinationAngle = (angle: number) => {
  return angle * DEG2RAD;
};
