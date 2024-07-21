export const calculateRadius = (radius: number, radiusReference: number) => {
  const radiusFraction = (radius * radiusReference) / 1000; // 1,000 = Fraction of a meter in kilometers

  return radiusFraction;
};
