import type { Exoplanet } from "@/definition"

export const filterByConfirmed = (array: Exoplanet[]) => {
  return array.filter(item => item.archive_disposition === "CONFIRMED")
}

export const getRandomExoplanet = (array: Exoplanet[]) => {
  const confirmedExoplanets = filterByConfirmed(array)
  if (confirmedExoplanets.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * confirmedExoplanets.length)
  return confirmedExoplanets[randomIndex]
}

const nameFormat = (name: string) => {
  return name.toString().replaceAll(/[\s\-\_\.]/g, "")
}

export const findExoplanet = (array: Exoplanet[], exoplanet_name: string) => {
  exoplanet_name = nameFormat(exoplanet_name)
  const exoplanet = array.find(exoplanet => {
    const exoplanet_name_trim = exoplanet.name
      ? nameFormat(exoplanet.name)
      : null

    if (exoplanet_name === exoplanet_name_trim) {
      return exoplanet_name_trim
    }
  })

  if (!exoplanet) {
    return null
  }

  return exoplanet
}
