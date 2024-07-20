"use client";
import { CameraControls } from "@react-three/drei";
import { Exoplanet } from "@/components/3d/Exoplanet";
import { useEffect, useRef } from "react";
import { useControls, button, folder } from "leva";
import { calculateCameraDistance } from "@/utils/calculateCameraDistance";
import { useChatStore } from "@/store/chat";
import { calculateRotationVelocity } from "@/utils/calculateRotationVelocity";
import { IMAGE_EXOPLANET_PATH, IMAGE_TEXTURE_PATH } from "@/config";

export const Scene = () => {
  const EXOPLANETSCALE = 2;
  const cameraControlsRef = useRef<any>(null);
  const { sceneData } = useChatStore();

  useEffect(() => {
    const distanceZ = calculateCameraDistance(EXOPLANETSCALE);
    // put camera on target mesh and position
    cameraControlsRef.current?.setLookAt(
      ...[0, 0, distanceZ],
      ...[0, 0, 0],
      true
    );
  }, []);

  useEffect(() => {
    if (sceneData !== undefined) {
      const distanceZ = calculateCameraDistance(sceneData.rad ?? 2);
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
        minDistance={calculateCameraDistance(EXOPLANETSCALE)}
        maxDistance={310}
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
            scale={sceneData.rad ?? 2}
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
            position={[0, 0, -500]}
            scale={90}
            texture={`${IMAGE_EXOPLANET_PATH}/sol.jpg`}
            side={0}
          />
        </>
      ) : (
        <>
          <Exoplanet
            inclination={[0, 0, 0]}
            rotationX={0}
            rotationY={0.0005}
            position={[0, 0, 0]}
            scale={EXOPLANETSCALE}
            texture={`${IMAGE_TEXTURE_PATH}tierra.jpg`}
            side={0}
          />
        </>
      )}

      {/* Universe */}
      <Exoplanet
        inclination={[0, 0, 0]}
        rotationX={0.00005}
        rotationY={0.00005}
        position={[0, 0, 0]}
        scale={600}
        texture={`${IMAGE_TEXTURE_PATH}universo.jpg`}
        side={1}
      />
    </>
  );
};
