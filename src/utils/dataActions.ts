import type { Exoplanet } from "@/definition"

export const filterByConfirmed = (array: Exoplanet[]) => {
  return array.filter((item) => item.archive_disposition === "CONFIRMED")
}

export const filterByUnConfirmed = (array: Exoplanet[]) => {
  return array.filter((item) => item.archive_disposition !== "CONFIRMED")
}

export const filterByMajorOrbit = (array: Exoplanet[]) => {
  const exoplanetsNotNull = array.filter(
    (exoplanet) => exoplanet.period !== null
  )

  return exoplanetsNotNull.reduce(
    (max, exoplanet) => (exoplanet.orbit! > max.orbit! ? exoplanet : max),
    exoplanetsNotNull[0]
  )
}

export const filterByMinorOrbit = (array: Exoplanet[]) => {
  const exoplanetsNotNull = array.filter(
    (exoplanet) => exoplanet.period !== null
  )

  return exoplanetsNotNull.reduce(
    (max, exoplanet) => (exoplanet.orbit! < max.orbit! ? exoplanet : max),
    exoplanetsNotNull[0]
  )
}

export const getRandomExoplanet = (array: Exoplanet[]) => {
  const confirmedExoplanets = filterByConfirmed(array)
  if (confirmedExoplanets.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * confirmedExoplanets.length)
  return confirmedExoplanets[randomIndex]
}

export const getListExoplanetsName = (array: Exoplanet[], quantity: number) => {
  const exoplanetsNotNulls = array.filter(
    (exoplanet) => exoplanet.name !== null
  )

  const index: number[] = []
  while (index.length < quantity) {
    const randomIndex = Math.floor(Math.random() * exoplanetsNotNulls.length)
    if (!index.includes(randomIndex)) {
      index.push(randomIndex)
    }
  }

  const exoplanetsPartition = [...index].map(
    (index) => exoplanetsNotNulls[index]
  )

  return exoplanetsPartition
    .map((exoplanet) => {
      return [exoplanet.name!]
    })
    .join(", ")
}

const nameFormat = (name: string) => {
  return name.toString().replaceAll(/[\s\-\_\.]/g, "")
}

export const findExoplanet = (array: Exoplanet[], exoplanet_name: string) => {
  exoplanet_name = nameFormat(exoplanet_name)
  const exoplanet = array.find((exoplanet) => {
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

export const fastVelocity = (array: Exoplanet[], exoplanet_name: string) => {
  exoplanet_name = nameFormat(exoplanet_name)
  const exoplanet = array.find((exoplanet) => {
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

  return { ...exoplanet, period: 0.000694444, rot_hours: 0.166667 }
}
