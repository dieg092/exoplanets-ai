export const calculateRotationGravity = (cameraDistance: number) => {
  // Generate random velocity between 1 - 5
  const randomVelocity = Math.random() * (5 - 1) + 1;

  return Math.sqrt(randomVelocity / cameraDistance);
};
