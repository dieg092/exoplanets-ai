import * as THREE from "three"
import { useRef, useState } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useChatStore } from "@/store/chat"
import {
  EARTH_RADIUS,
  IMAGE_EXOPLANET_PATH,
  IMAGE_TEXTURE_PATH,
  INCLINATION_EARTH_ANGLE,
  SOLAR_RADIUS,
} from "@/config"
import { CosmicEntityInclination, CosmicEntityType } from "@/definition"
import { calculateRotationVelocity } from "@/utils/calculateRotationVelocity"
import { calculateInclinationAngle } from "@/utils/calculateInclinationAngle"
import { calculateRadius } from "@/utils/calculateRadius"

const SUN_TEXTURE = `${IMAGE_EXOPLANET_PATH}/sol.jpg`
const UNIVERSE_TEXTURE = `${IMAGE_TEXTURE_PATH}universo.jpg`
const EARTH_TEXTURE = `${IMAGE_EXOPLANET_PATH}/tierra.jpg`
const UNIVERSE_RADIUS = 10000000

const TEXTURES: Record<CosmicEntityType, string> = {
  PLANET: EARTH_TEXTURE,
  STAR: SUN_TEXTURE,
  UNIVERSE: UNIVERSE_TEXTURE,
}

function getRotationX(type: CosmicEntityType) {
  const PLANET = 0
  const STAR = 0
  const UNIVERSE = 0.0001

  if (type === "PLANET") return PLANET
  if (type === "STAR") return STAR
  if (type === "UNIVERSE") return UNIVERSE

  return 0
}

function getRotationY(type: CosmicEntityType, hours: number) {
  const PLANET = calculateRotationVelocity(hours)
  const STAR = 0.0005
  const UNIVERSE = 0.02

  if (type === "PLANET") return PLANET
  if (type === "STAR") return STAR
  if (type === "UNIVERSE") return UNIVERSE

  return 0
}

const INCLINATION: Record<CosmicEntityType, CosmicEntityInclination> = {
  PLANET: [calculateInclinationAngle(INCLINATION_EARTH_ANGLE), 0, 0],
  STAR: [0, 0, 0],
  UNIVERSE: [0, 0, 0],
}

function getTexture(type: CosmicEntityType, texture?: string): string {
  if (type === "PLANET" && texture) return `${IMAGE_EXOPLANET_PATH}/${texture}`

  return TEXTURES[type]
}

function getInclination(
  type: CosmicEntityType,
  inc?: number | null
): CosmicEntityInclination {
  let inclination = INCLINATION[type]
  if (type === "PLANET" && inc)
    inclination = [calculateInclinationAngle(inc), 0, 0]

  return inclination
}

function getScale(type: CosmicEntityType, rad?: number | null): number {
  let scale = UNIVERSE_RADIUS
  let ref = EARTH_RADIUS
  if (type === "STAR") ref = SOLAR_RADIUS
  if (type !== "UNIVERSE") scale = calculateRadius(rad ?? 1, ref)

  return scale
}

export function useCosmicEntity(type: CosmicEntityType) {
  const { sceneData } = useChatStore()
  const meshRef = useRef<THREE.Mesh>(null!)
  const [, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const rotationX = getRotationX(type)
  const rotationY = getRotationY(type, sceneData?.rot_hours ?? 24)

  const side: THREE.Side = type === "UNIVERSE" ? 1 : 0
  const inclination = getInclination(type, sceneData?.inclination)

  const scaleData = type === "STAR" ? sceneData?.stellar_rad : sceneData?.rad
  const scale = getScale(type, scaleData)

  const texture = getTexture(type, sceneData?.texture)

  const colorMap = useLoader(TextureLoader, texture)

  useFrame((state, delta) => {
    if (meshRef && meshRef.current) {
      meshRef.current.rotation.x += rotationX * delta
      meshRef.current.rotation.y += rotationY * delta
    }
  })

  return {
    meshRef,
    colorMap,
    active,
    inclination,
    side,
    scale,
    setActive,
    setHover,
  }
}
