"use client";
import {
  CameraControls,
  Line,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Exoplanet } from "@/components/3d/Exoplanet";
import { useEffect, useMemo, useRef } from "react";
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
import { CatmullRomCurve3, EllipseCurve, Vector3 } from "three";

export const Scene = () => {
  const UNIT = 1000;
  const EARTH_RADIUS = 6371 / UNIT;
  const EARTH_SOLAR_DISTANCE = 150000000 / UNIT;
  const SOLAR_RADIUS = 695700 / UNIT;

  const { sceneData } = useChatStore();

  const cameraControlsRef = useRef<any>(null);
  const earthRef = useRef<any>(null);

  useEffect(() => {
    const distanceCametaToExoplanet = calculateCameraDistance(
      calculateRadius(1, EARTH_RADIUS)
    );

    // put camera on target mesh and position
    // cameraControlsRef.current?.setLookAt(
    //   ...[0, 0, EARTH_SOLAR_DISTANCE + distanceCametaToExoplanet], //position
    //   ...[0, 0, EARTH_SOLAR_DISTANCE], //target
    //   true
    // );

    // Rotate
    // cameraControlsRef.current?.rotate(180 * DEG2RAD, 0, true);
  }, []);

  // useEffect(() => {
  //   if (sceneData !== undefined) {
  //     const distanceCametaToExoplanet = calculateCameraDistance(
  //       calculateRadius(sceneData?.rad ?? 1, EARTH_RADIUS)
  //     );
  //     // put camera on target mesh and position
  //     cameraControlsRef.current?.setLookAt(
  //       ...[
  //         0,
  //         0,
  //         calculateStarDistance(sceneData.orbit ?? EARTH_SOLAR_DISTANCE, UNIT) +
  //           distanceCametaToExoplanet,
  //       ], //position
  //       ...[
  //         0,
  //         0,
  //         calculateStarDistance(sceneData.orbit ?? EARTH_SOLAR_DISTANCE, UNIT),
  //       ], //target
  //       true
  //     );

  //     // Rotate
  //     cameraControlsRef.current?.rotate(180 * DEG2RAD, 0, true);
  //   }
  // }, [sceneData]);

  // Floating window - comment this disabled
  // useControls({
  //   "fitToBox(mesh)": button(() =>
  //     cameraControlsRef.current?.fitToBox(earthRef.current, true)
  //   ),
  //   thetaGrp: buttonGroup({
  //     label: "rotate",
  //     opts: {
  //       "+45º": () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
  //       "-90º": () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
  //       "+180º": () =>
  //         cameraControlsRef.current?.rotate(180 * DEG2RAD, 0, true),
  //       "-180º": () =>
  //         cameraControlsRef.current?.rotate(-180 * DEG2RAD, 0, true),
  //       "+360º": () =>
  //         cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true),
  //     },
  //   }),
  //   setPosition: folder(
  //     {
  //       vec2: { value: [0, 0, 0], label: "vec" },
  //       "setPosition(…vec)": button((get) =>
  //         cameraControlsRef.current?.setPosition(
  //           ...get("setPosition.vec2"),
  //           true
  //         )
  //       ),
  //     },
  //     { collapsed: true }
  //   ),
  //   setTarget: folder(
  //     {
  //       vec3: { value: [0, 0, 0], label: "vec" },
  //       "setTarget(…vec)": button((get) =>
  //         cameraControlsRef.current?.setTarget(...get("setTarget.vec3"), true)
  //       ),
  //     },
  //     { collapsed: true }
  //   ),
  //   setLookAt: folder(
  //     {
  //       vec4: { value: [0, 0, 0], label: "position" },
  //       vec5: { value: [0, 0, 0], label: "target" },
  //       "setLookAt(…position, …target)": button((get) =>
  //         cameraControlsRef.current?.setLookAt(
  //           ...get("setLookAt.vec4"),
  //           ...get("setLookAt.vec5"),
  //           true
  //         )
  //       ),
  //     },
  //     { collapsed: true }
  //   ),
  //   reset: button(() => cameraControlsRef.current?.reset(true)),
  // });

  const LINE_POINTS = 120; // total Points in curve

  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= LINE_POINTS; i++) {
      const angle = (i / LINE_POINTS) * Math.PI * 2; // 360 degrees in radians
      const x = EARTH_SOLAR_DISTANCE * Math.cos(angle);
      const z = EARTH_SOLAR_DISTANCE * Math.sin(angle);
      points.push(new Vector3(x, 0, z));
    }
    return new CatmullRomCurve3(points, true, "catmullrom");
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_POINTS);
  }, [curve]);

  // FPS
  const totalPoints = curve.getPoints(LINE_POINTS).length;
  const speed = 0.01; // Rotation velocity
  // Progress in curve
  const progressRef = useRef(0);

  // Rotate camera per seconds
  useFrame((state, delta) => {
    // Mover el objeto aquí
    progressRef.current += speed;
    if (progressRef.current >= totalPoints) {
      progressRef.current = 0; // Reiniciar el progreso
    }

    const point = curve.getPoint(progressRef.current / totalPoints);
    if (earthRef.current) {
      earthRef.current.position.copy(point);

      // Calcular la nueva posición de la cámara relativa al objeto
      const offsetDirection = cameraControlsRef.current.object.position
        .clone()
        .sub(cameraControlsRef.current.target)
        .normalize();
      let distance = cameraControlsRef.current.object.position.distanceTo(
        cameraControlsRef.current.target
      );

      // Limitar la distancia
      distance = Math.max(2000, Math.min(150000, distance));

      const offset = offsetDirection.multiplyScalar(distance);
      const newCameraPosition = point.clone().add(offset);

      // Actualizar la posición de la cámara
      cameraControlsRef.current.object.position.copy(newCameraPosition);

      // Mantener la orientación de la cámara hacia el objeto
      cameraControlsRef.current.target.copy(point);
      cameraControlsRef.current.update();
    }
  });

  return (
    <>
      <Helpers />
      <OrbitControls
        autoRotate={true}
        autoRotateSpeed={0.5}
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
            inclination={[0, 0, 0]}
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
          <Line
            rotation={[0, 0, 0]}
            points={linePoints}
            color={"white"}
            opacity={0.7}
            transparent
            lineWidth={1}
          />

          {/* Earth */}
          <group ref={earthRef}>
            <Exoplanet
              inclination={[0, 0, 0]}
              rotationX={0}
              rotationY={calculateRotationVelocity()}
              position={[0, 0, 0]}
              scale={1000}
              // scale={calculateRadius(1, EARTH_RADIUS)}
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
