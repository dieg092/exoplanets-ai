export const filterByConfirmed = (array) => {
  return array.filter((item) => item.archive_disposition === "CONFIRMED");
};

export const getRandomExoplanet = (array) => {
  const confirmedExoplanets = filterByConfirmed(array);
  if (confirmedExoplanets.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * confirmedExoplanets.length);
  return confirmedExoplanets[randomIndex];
};
