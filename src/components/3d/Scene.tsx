import { Line, OrbitControls } from "@react-three/drei"
import { CosmicEntity } from "@/components/3d/CosmicEntity"
import { useScene } from "@/hooks/useScene"

export const Scene = () => {
  const { linePoints, exoplanetRef, orbitControls } = useScene()

  return (
    <>
      <OrbitControls
        zoomSpeed={5}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        ref={orbitControls}
      />
      <pointLight position={[0, 0, 0]} decay={0} intensity={Math.PI} />

      <group ref={exoplanetRef}>
        <CosmicEntity type="PLANET" />
      </group>

      <CosmicEntity type="STAR" />

      <Line
        rotation={[0, 0, 0]}
        points={linePoints}
        color={"white"}
        opacity={0.2}
        transparent
        lineWidth={0.3}
      />

      <CosmicEntity type="UNIVERSE" />
    </>
  )
}
