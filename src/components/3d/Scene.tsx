"use client";
import { Line, OrbitControls } from "@react-three/drei";
import { Exoplanet } from "@/components/3d/Exoplanet";
import { useMemo, useRef, useState } from "react";
import { calculateCameraDistance } from "@/utils/calculateCameraDistance";
import { useChatStore } from "@/store/chat";
import { calculateRotationVelocity } from "@/utils/calculateRotationVelocity";
import { IMAGE_EXOPLANET_PATH, IMAGE_TEXTURE_PATH } from "@/config";
import { calculateRadius } from "@/utils/calculateRadius";
import { calculateStarDistance } from "@/utils/calculateStarDistance";
import Helpers from "@/components/3d/Helpers";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Matrix4, Vector3 } from "three";
import { calculateOrbitTime } from "@/utils/calculateOrbitTime";
import { calculateRotationGravity } from "@/utils/calculateRotationGravity";
import { calculateInclinationAngle } from "@/utils/calculateInclinationAngle";

export const Scene = () => {
  const UNIT = 1000;
  const EARTH_RADIUS = 6371 / UNIT;
  const EARTH_SOLAR_DISTANCE = 150000000 / UNIT;
  const SOLAR_RADIUS = 695700 / UNIT;
  const LINE_POINTS = 1000; // total Points in curve
  const INCLINATION_EARTH_ANGLE = 23.5;

  const orbitControls = useRef<any>(null);
  const exoplanetRef = useRef<any>(null);
  const { sceneData } = useChatStore();
  const [orbitSpeed, setOrbitSpeed] = useState(0.01);

  // First reload
  const curve = useMemo(() => {
    const points = [];
    let starDistance = EARTH_SOLAR_DISTANCE;

    setOrbitSpeed(calculateOrbitTime(sceneData?.period ?? 365, LINE_POINTS));

    if (sceneData && sceneData.orbit) {
      starDistance = calculateStarDistance(sceneData?.orbit, UNIT);
    }

    // Inclination angle curve
    const rotationMatrix = new Matrix4().makeRotationX(
      calculateInclinationAngle(
        sceneData?.inclination ?? INCLINATION_EARTH_ANGLE
      )
    );

    for (let i = 0; i <= LINE_POINTS; i++) {
      const angle = (i / LINE_POINTS) * Math.PI * 2; // 360 degrees in radians
      const x = starDistance * Math.cos(angle);
      const z = starDistance * Math.sin(angle);
      const point = new Vector3(x, 0, z);
      point.applyMatrix4(rotationMatrix);
      points.push(point);
      // points.push(new Vector3(x, 0, z));
    }
    return new CatmullRomCurve3(points, true, "catmullrom");
  }, [EARTH_SOLAR_DISTANCE, sceneData]);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_POINTS);
  }, [curve]);

  // FPS
  const totalPoints = curve.getPoints(LINE_POINTS).length;

  // Progress in curve
  const progressRef = useRef(0);

  // Rotate camera per seconds
  useFrame((state, delta) => {
    // Move exoplanet
    progressRef.current += orbitSpeed * delta;
    if (progressRef.current >= totalPoints) {
      progressRef.current = 0; // Reset progress
    }

    const point = curve.getPoint(progressRef.current / totalPoints);
    if (exoplanetRef.current) {
      exoplanetRef.current.position.copy(point);

      // Calculate new camera position relative to target
      const offsetDirection = orbitControls.current.object.position
        .clone()
        .sub(orbitControls.current.target)
        .normalize();

      let distance = orbitControls.current.object.position.distanceTo(
        orbitControls.current.target
      );

      // Ajust dynamic distance dolly

      const distanceCametaToExoplanet = calculateCameraDistance(
        calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
      );

      distance = Math.max(
        distanceCametaToExoplanet,
        Math.min(150000, distance)
      );

      const offset = offsetDirection.multiplyScalar(distance);
      const newCameraPosition = point.clone().add(offset);

      // Update camera position
      orbitControls.current.object.position.copy(newCameraPosition);

      // camera rotation gravity - CHANGE HERE!!
      const cameraDistance = orbitControls.current.getDistance();
      const rotationGravity = calculateRotationGravity(cameraDistance);

      orbitControls.current.autoRotateSpeed = rotationGravity;

      // Look target
      orbitControls.current.target.copy(point);
      orbitControls.current.update();
    }
  });

  return (
    <>
      {/* <Helpers /> */}
      <OrbitControls
        zoomSpeed={5}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        ref={orbitControls}
      />
      <pointLight position={[0, 0, 0]} decay={0} intensity={Math.PI} />
      {sceneData !== undefined ? (
        <>
          {/* Exoplanet */}
          <group ref={exoplanetRef}>
            <Exoplanet
              inclination={[
                calculateInclinationAngle(
                  sceneData?.inclination ?? INCLINATION_EARTH_ANGLE
                ),
                0,
                0,
              ]}
              rotationX={0}
              rotationY={calculateRotationVelocity()}
              position={[0, 0, 0]}
              scale={calculateRadius(sceneData.rad ?? 1, EARTH_RADIUS)}
              texture={
                sceneData?.texture
                  ? `${IMAGE_EXOPLANET_PATH}/${sceneData.texture}`
                  : `${IMAGE_TEXTURE_PATH}tierra.jpg`
              }
              side={0}
            />
          </group>

          {/* Star */}
          <Exoplanet
            type="STAR"
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={0.0005}
            position={[0, 0, 0]}
            scale={calculateRadius(sceneData.stellar_rad ?? 1, SOLAR_RADIUS)}
            texture={`${IMAGE_EXOPLANET_PATH}/sol.jpg`}
            side={0}
          />
        </>
      ) : (
        <>
          {/* Earth */}
          <group ref={exoplanetRef}>
            <Exoplanet
              inclination={[
                calculateInclinationAngle(INCLINATION_EARTH_ANGLE),
                0,
                0,
              ]}
              rotationX={0}
              rotationY={calculateRotationVelocity()}
              position={[0, 0, 0]}
              scale={calculateRadius(1, EARTH_RADIUS)}
              texture={`${IMAGE_TEXTURE_PATH}tierra.jpg`}
              side={0}
            />
          </group>

          {/* Sun */}
          <Exoplanet
            type="STAR"
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={0.0005}
            position={[0, 0, 0]}
            scale={calculateRadius(1, SOLAR_RADIUS)}
            texture={`${IMAGE_EXOPLANET_PATH}/sol.jpg`}
            side={0}
          />
        </>
      )}

      <Line
        rotation={[0, 0, 0]}
        points={linePoints}
        color={"white"}
        opacity={0.2}
        transparent
        lineWidth={0.3}
      />

      {/* Universe */}
      <Exoplanet
        inclination={[0, 0, 0]}
        rotationX={0.0001}
        rotationY={0.0001}
        position={[0, 0, 0]}
        scale={500000}
        texture={`${IMAGE_TEXTURE_PATH}universo.jpg`}
        side={1}
      />
    </>
  );
};
