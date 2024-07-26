export const calculateRotationGravity = (
  mass: number,
  cameraDistance: number
) => {
  const G = 6.6743e-11;

  return Math.sqrt((G * mass) / cameraDistance);
};
