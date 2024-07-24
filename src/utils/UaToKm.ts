export const UaToKm = (ua: number) => {
  const CONSTANT = 1.496e8;

  return ua * CONSTANT;
};
