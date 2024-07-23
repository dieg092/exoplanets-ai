"use client";
import { CameraControls } from "@react-three/drei";
import { Exoplanet } from "@/components/3d/Exoplanet";
import { useEffect, useRef } from "react";
import { useControls, button, folder, buttonGroup } from "leva";
import { calculateCameraDistance } from "@/utils/calculateCameraDistance";
import { useChatStore } from "@/store/chat";
import { calculateRotationVelocity } from "@/utils/calculateRotationVelocity";
import { IMAGE_EXOPLANET_PATH, IMAGE_TEXTURE_PATH } from "@/config";
import { calculateRadius } from "@/utils/calculateRadius";
import { calculateStarDistance } from "@/utils/calculateStarDistance";
import Helpers from "@/components/3d/Helpers";
import { DEG2RAD } from "three/src/math/MathUtils.js";
import { useFrame } from "@react-three/fiber";

export const Scene = () => {
  const UNIT = 1000;
  const EARTH_RADIUS = 6371 / UNIT;
  const EARTH_SOLAR_DISTANCE = 150000000 / UNIT;
  const SOLAR_RADIUS = 695700 / UNIT;
  const cameraControlsRef = useRef<any>(null);
  const { sceneData } = useChatStore();

  // Rotate camera per seconds
  useFrame((state, delta) =>
    // Change 1 to dinamic degrees rotation
    cameraControlsRef.current.rotate(1 * DEG2RAD * delta, 0, true)
  );

  useEffect(() => {
    const distanceCametaToExoplanet = calculateCameraDistance(
      calculateRadius(1, EARTH_RADIUS)
    );

    // put camera on target mesh and position
    cameraControlsRef.current?.setLookAt(
      ...[0, 0, EARTH_SOLAR_DISTANCE + distanceCametaToExoplanet], //position
      ...[0, 0, EARTH_SOLAR_DISTANCE], //target
      true
    );

    // Rotate
    cameraControlsRef.current?.rotate(180 * DEG2RAD, 0, true);
  }, []);

  useEffect(() => {
    if (sceneData !== undefined) {
      const distanceCametaToExoplanet = calculateCameraDistance(
        calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
      );
      // put camera on target mesh and position
      cameraControlsRef.current?.setLookAt(
        ...[
          0,
          0,
          calculateStarDistance(sceneData.orbit ?? EARTH_SOLAR_DISTANCE, UNIT) +
            distanceCametaToExoplanet,
        ], //position
        ...[
          0,
          0,
          calculateStarDistance(sceneData.orbit ?? EARTH_SOLAR_DISTANCE, UNIT),
        ], //target
        true
      );

      // Rotate
      cameraControlsRef.current?.rotate(180 * DEG2RAD, 0, true);
    }
  }, [sceneData]);

  // Floating window - comment this disabled
  useControls({
    thetaGrp: buttonGroup({
      label: "rotate",
      opts: {
        "+45º": () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
        "-90º": () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
        "+180º": () =>
          cameraControlsRef.current?.rotate(180 * DEG2RAD, 0, true),
        "-180º": () =>
          cameraControlsRef.current?.rotate(-180 * DEG2RAD, 0, true),
        "+360º": () =>
          cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true),
      },
    }),
    setLookAt: folder(
      {
        vec4: { value: [0, 0, 0], label: "position" },
        vec5: { value: [0, 0, 0], label: "target" },
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
      <Helpers />
      <CameraControls
        minDistance={calculateCameraDistance(
          calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
        )}
        maxDistance={150000}
        ref={cameraControlsRef}
      />
      <pointLight position={[0, 0, 0]} decay={0} intensity={Math.PI} />
      {sceneData !== undefined ? (
        <>
          {/* Exoplanet */}
          <Exoplanet
            inclination={[0, 0, sceneData.inclination ?? 0]}
            rotationX={0}
            rotationY={calculateRotationVelocity()}
            position={[
              0,
              0,
              calculateStarDistance(
                sceneData.orbit ?? EARTH_SOLAR_DISTANCE,
                UNIT
              ),
            ]}
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
          <Exoplanet
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={calculateRotationVelocity()}
            position={[0, 0, EARTH_SOLAR_DISTANCE]}
            scale={calculateRadius(1, EARTH_RADIUS)}
            texture={`${IMAGE_TEXTURE_PATH}tierra.jpg`}
            side={0}
          />

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
