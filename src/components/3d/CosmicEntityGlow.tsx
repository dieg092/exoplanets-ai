import { Sphere } from "@react-three/drei"
import { FakeGlowMaterial } from "./FakeGlowMaterial"
import { useCosmicEntity } from "@/hooks/useCosmicEntity"

export const CosmicEntityGlow = () => {
  const TYPE = "STAR"

  const { scale } = useCosmicEntity(TYPE)
  const doubleScale = scale * 2.5

  return (
    <Sphere args={[doubleScale, 64, 64]} position={[0, 0, 0]}>
      <FakeGlowMaterial glowColor="#ff8f00" glowInternalRadius={1.5} />
    </Sphere>
  )
}
