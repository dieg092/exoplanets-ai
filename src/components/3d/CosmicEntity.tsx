import { ThreeElements } from "@react-three/fiber"
import { CosmicEntityType } from "@/definition"
import { useCosmicEntity } from "@/hooks/useCosmicEntity"

export function CosmicEntity({
  texture,
  type = "STAR",
  ...props
}: {
  texture?: string
  type?: CosmicEntityType
} & ThreeElements["mesh"]) {
  const {
    meshRef,
    inclination,
    side,
    scale,
    colorMap,
    active,
    setActive,
    setHover,
  } = useCosmicEntity(type)

  return (
    <mesh
      ref={meshRef}
      rotation={inclination}
      position={[0, 0, 0]}
      scale={scale}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      userData={{ hello: "world" }}
      {...props}
    >
      {type === "STAR" ? (
        <meshStandardMaterial
          side={side}
          emissiveMap={colorMap}
          emissive={0xffff00}
          emissiveIntensity={1}
        />
      ) : (
        <meshStandardMaterial map={colorMap} side={side} />
      )}
      <sphereGeometry args={[]} />
    </mesh>
  )
}
