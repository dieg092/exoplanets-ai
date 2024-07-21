"use client";
import { CameraControls } from "@react-three/drei";
import { Exoplanet } from "@/components/3d/Exoplanet";
import { useEffect, useRef } from "react";
import { useControls, button, folder } from "leva";
import { calculateCameraDistance } from "@/utils/calculateCameraDistance";
import { useChatStore } from "@/store/chat";
import { calculateRotationVelocity } from "@/utils/calculateRotationVelocity";
import { IMAGE_EXOPLANET_PATH, IMAGE_TEXTURE_PATH } from "@/config";
import { calculateRadius } from "@/utils/calculateRadius";
import { calculateStarDistance } from "@/utils/calculateStarDistance";

export const Scene = () => {
  const EARTH_ROTATION_DAYS = 365;
  const EARTH_RADIUS = 6371;
  const SOLAR_RADIUS = 695700;
  const cameraControlsRef = useRef<any>(null);
  const { sceneData } = useChatStore();

  useEffect(() => {
    const distanceZ = calculateCameraDistance(calculateRadius(1, EARTH_RADIUS));
    // put camera on target mesh and position
    cameraControlsRef.current?.setLookAt(
      ...[0, 0, distanceZ],
      ...[0, 0, 0],
      true
    );
  }, []);

  useEffect(() => {
    if (sceneData !== undefined) {
      const distanceZ = calculateCameraDistance(
        calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
      );
      // put camera on target mesh and position
      cameraControlsRef.current?.setLookAt(
        ...[0, 0, distanceZ],
        ...[0, 0, 0],
        true
      );
    }
  }, [sceneData]);

  // Floating window - comment this disabled
  useControls({
    setLookAt: folder(
      {
        vec4: { value: [1, 2, 3], label: "position" },
        vec5: { value: [1, 1, 0], label: "target" },
        "setLookAt(…position, …target)": button((get) =>
          cameraControlsRef.current?.setLookAt(
            ...get("setLookAt.vec4"),
            ...get("setLookAt.vec5"),
            true
          )
        ),
      },
      { collapsed: true }
    ),
    reset: button(() => cameraControlsRef.current?.reset(true)),
  });

  return (
    <>
      <CameraControls
        minDistance={calculateCameraDistance(
          calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
        )}
        maxDistance={90000}
        ref={cameraControlsRef}
      />
      <ambientLight intensity={Math.PI / 2} />
      <ambientLight intensity={0.5} />

      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <directionalLight color="red" position={[0, 0, 5]} intensity={0.1} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {sceneData !== undefined ? (
        <>
          {/* Exoplanet */}
          <Exoplanet
            inclination={[0, 0, sceneData.inclination ?? 0]}
            rotationX={0}
            rotationY={calculateRotationVelocity(sceneData.period ?? 0)}
            position={[0, 0, 0]}
            scale={calculateRadius(sceneData.rad ?? 1, EARTH_RADIUS)}
            texture={
              sceneData?.texture
                ? `${IMAGE_EXOPLANET_PATH}/${sceneData.texture}`
                : `${IMAGE_TEXTURE_PATH}tierra.jpg`
            }
            side={0}
          />

          {/* Star */}
          <Exoplanet
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={0.0005}
            position={[
              0,
              0,
              -calculateStarDistance(sceneData.star_distance ?? 100),
            ]}
            scale={calculateRadius(sceneData.stellar_rad ?? 1, SOLAR_RADIUS)}
            texture={`${IMAGE_EXOPLANET_PATH}/sol.jpg`}
            side={0}
          />
        </>
      ) : (
        <>
          {/* Earth */}
          <Exoplanet
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={calculateRotationVelocity(EARTH_ROTATION_DAYS)}
            position={[0, 0, 0]}
            scale={calculateRadius(1, EARTH_RADIUS)}
            texture={`${IMAGE_TEXTURE_PATH}tierra.jpg`}
            side={0}
          />

          {/* Sun */}
          <Exoplanet
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={0.0005}
            position={[0, 0, -5000]}
            scale={calculateRadius(1, SOLAR_RADIUS)}
            texture={`${IMAGE_EXOPLANET_PATH}/sol.jpg`}
            side={0}
          />
        </>
      )}

      {/* Universe */}
      <Exoplanet
        inclination={[0, 0, 0]}
        rotationX={0.0001}
        rotationY={0.0001}
        position={[0, 0, 0]}
        scale={99000}
        texture={`${IMAGE_TEXTURE_PATH}universo.jpg`}
        side={1}
      />
    </>
  );
};
