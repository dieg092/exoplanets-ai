import { useMemo, useRef, useState } from "react"
import { calculateCameraDistance } from "@/utils/calculateCameraDistance"
import { useChatStore } from "@/store/chat"
import { calculateRadius } from "@/utils/calculateRadius"
import { calculateStarDistance } from "@/utils/calculateStarDistance"
import { useFrame } from "@react-three/fiber"
import { CatmullRomCurve3, Matrix4, Vector3 } from "three"
import { calculateOrbitTime } from "@/utils/calculateOrbitTime"
import { calculateRotationGravity } from "@/utils/calculateRotationGravity"
import { calculateInclinationAngle } from "@/utils/calculateInclinationAngle"
import { UNIT, EARTH_RADIUS, INCLINATION_EARTH_ANGLE } from "@/config"

const EARTH_SOLAR_DISTANCE = 150000000 / UNIT
const LINE_POINTS = 1000 // total Points in curve

export const useScene = () => {
  const orbitControls = useRef<any>(null)
  const exoplanetRef = useRef<any>(null)
  const { sceneData } = useChatStore()
  const [orbitSpeed, setOrbitSpeed] = useState(0.01)

  // First reload
  const curve = useMemo(() => {
    const points = []
    let starDistance = EARTH_SOLAR_DISTANCE

    setOrbitSpeed(calculateOrbitTime(sceneData?.period ?? 365, LINE_POINTS))

    if (sceneData && sceneData.orbit) {
      starDistance = calculateStarDistance(sceneData?.orbit, UNIT)
    }

    // Inclination angle curve
    const rotationMatrix = new Matrix4().makeRotationX(
      calculateInclinationAngle(
        sceneData?.inclination ?? INCLINATION_EARTH_ANGLE
      )
    )

    for (let i = 0; i <= LINE_POINTS; i++) {
      const angle = (i / LINE_POINTS) * Math.PI * 2 // 360 degrees in radians
      const x = starDistance * Math.cos(angle)
      const z = starDistance * Math.sin(angle)
      const point = new Vector3(x, 0, z)
      point.applyMatrix4(rotationMatrix)
      points.push(point)
      // points.push(new Vector3(x, 0, z));
    }
    return new CatmullRomCurve3(points, true, "catmullrom")
  }, [sceneData])

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_POINTS)
  }, [curve])

  // FPS
  const totalPoints = curve.getPoints(LINE_POINTS).length

  // Progress in curve
  const progressRef = useRef(0)

  // Rotate camera per seconds
  useFrame((state, delta) => {
    // Move exoplanet
    progressRef.current += orbitSpeed * delta
    if (progressRef.current >= totalPoints) {
      progressRef.current = 0 // Reset progress
    }

    const point = curve.getPoint(progressRef.current / totalPoints)
    if (exoplanetRef.current) {
      exoplanetRef.current.position.copy(point)

      // Calculate new camera position relative to target
      const offsetDirection = orbitControls.current.object.position
        .clone()
        .sub(orbitControls.current.target)
        .normalize()

      let distance = orbitControls.current.object.position.distanceTo(
        orbitControls.current.target
      )

      // Ajust dynamic distance dolly

      const distanceCametaToExoplanet = calculateCameraDistance(
        calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
      )

      distance = Math.max(distanceCametaToExoplanet, Math.min(150000, distance))

      const offset = offsetDirection.multiplyScalar(distance)
      const newCameraPosition = point.clone().add(offset)

      // Update camera position
      orbitControls.current.object.position.copy(newCameraPosition)

      // camera rotation gravity - CHANGE HERE!!
      const cameraDistance = orbitControls.current.getDistance()
      const rotationGravity = calculateRotationGravity(cameraDistance)

      orbitControls.current.autoRotateSpeed = rotationGravity

      // Look target
      orbitControls.current.target.copy(point)
      orbitControls.current.update()
    }
  })

  return {
    linePoints,
    exoplanetRef,
    orbitControls,
  }
}
