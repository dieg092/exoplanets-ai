import type { Exoplanet } from "@/definition"
import exoplanetsData from "@/data/exoplanets.json"

const exoplanets: Exoplanet[] = exoplanetsData as Exoplanet[]

const nameFormat = (name: string) => {
  return name.toString().replaceAll(/[\s\-\_\.]/g, "")
}

const checkExoplanet = (exoplanet_name: string) => {
  exoplanet_name = nameFormat(exoplanet_name)

  const exoplanet = exoplanets.find(exoplanet => {
    const exoplanet_name_trim = exoplanet.name
      ? nameFormat(exoplanet.name)
      : null

    if (exoplanet_name === exoplanet_name_trim) {
      return exoplanet_name_trim
    }
  })
  return exoplanet
}

export const filterByConfirmed = () => {
  return exoplanets.filter(item => item.archive_disposition === "CONFIRMED")
}

export const filterByUnConfirmed = () => {
  return exoplanets.filter(item => item.archive_disposition !== "CONFIRMED")
}

export const filterByMajorOrbit = () => {
  const exoplanetsNotNull = exoplanets.filter(
    exoplanet => exoplanet.period !== null
  )

  return exoplanetsNotNull.reduce(
    (max, exoplanet) => (exoplanet.orbit! > max.orbit! ? exoplanet : max),
    exoplanetsNotNull[0]
  )
}

export const filterByMinorOrbit = () => {
  const exoplanetsNotNull = exoplanets.filter(
    exoplanet => exoplanet.period !== null
  )

  return exoplanetsNotNull.reduce(
    (max, exoplanet) => (exoplanet.orbit! < max.orbit! ? exoplanet : max),
    exoplanetsNotNull[0]
  )
}

export const getRandomExoplanet = () => {
  // const confirmedExoplanets = filterByConfirmed()

  // if (confirmedExoplanets.length === 0) {
  //   return null
  // }

  const randomIndex = Math.floor(Math.random() * exoplanets.length)
  return exoplanets[randomIndex]
}

// const differentExoplanets = confirmedExoplanets.filter(
//   item => item.texture !== exoplanet.texture
// )
// differentExoplanets.map(item => console.log(item.texture))
// console.log(exoplanet.texture)
// const randomIndex = Math.floor(Math.random() * differentExoplanets.length)
// return differentExoplanets[randomIndex]

export const getListExoplanetsName = (quantity: number) => {
  const exoplanetsNotNulls = exoplanets.filter(
    exoplanet => exoplanet.name !== null
  )

  const index: number[] = []
  while (index.length < quantity) {
    const randomIndex = Math.floor(Math.random() * exoplanetsNotNulls.length)
    if (!index.includes(randomIndex)) {
      index.push(randomIndex)
    }
  }

  const exoplanetsPartition = [...index].map(index => exoplanetsNotNulls[index])

  return exoplanetsPartition
    .map(exoplanet => {
      return [exoplanet.name!]
    })
    .join(", ")
}

export const findExoplanet = (exoplanet_name: string) => {
  const exoplanet = checkExoplanet(exoplanet_name)

  return exoplanet ?? null
}

export const fastVelocity = (exoplanet_name: string) => {
  const exoplanet = checkExoplanet(exoplanet_name)
  return exoplanet ? { ...exoplanet, rot_hours: 0.006667 } : null
}

export const fastOrbit = (exoplanet_name: string) => {
  const exoplanet = checkExoplanet(exoplanet_name)

  return exoplanet ? { ...exoplanet, period: 0.000666 } : null
}
