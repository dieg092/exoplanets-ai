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
import Helpers from "@/components/3d/Helpers";

export const Scene = () => {
  const EARTH_RADIUS = 6371;
  const SOLAR_RADIUS = 695700;
  const cameraControlsRef = useRef<any>(null);
  const { sceneData } = useChatStore();

  useEffect(() => { 
    const distanceCametaToExoplanet = calculateCameraDistance(calculateRadius(1, EARTH_RADIUS));
    
    // put camera on target mesh and position
    cameraControlsRef.current?.setLookAt(
      ...[0, 0, calculateStarDistance(5) + distanceCametaToExoplanet], //position
      ...[0, 0, calculateStarDistance(5)], //target
      true
    );
  }, []);

  useEffect(() => {
    if (sceneData !== undefined) {
      console.log('stellar radius: ', calculateRadius(sceneData.stellar_rad ?? 1, SOLAR_RADIUS));
      console.log('exoplanet radius:', calculateRadius(sceneData.rad ?? 1, EARTH_RADIUS));
      
      
      const distanceCametaToExoplanet = calculateCameraDistance(
        calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
      );
      // put camera on target mesh and position
      cameraControlsRef.current?.setLookAt(
       ...[0, 0, calculateStarDistance(sceneData.star_distance ?? 5) + distanceCametaToExoplanet], //position
      ...[0, 0, calculateStarDistance(sceneData.star_distance ?? 5)], //target
        true
      );
    }
  }, [sceneData]);

  // Floating window - comment this disabled
  useControls({
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
        maxDistance={90000}
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
            position={[0, 0, calculateStarDistance(sceneData.star_distance ?? 5)]}
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
          type='STAR'
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={0.0005}
            position={[
              0,
              0,
              0,
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
            rotationY={calculateRotationVelocity()}
            position={[0, 0, calculateStarDistance(5)]}
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
        scale={99000}
        texture={`${IMAGE_TEXTURE_PATH}universo.jpg`}
        side={1}
      />
    </>
  );
};
