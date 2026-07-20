import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float, Text3D } from "@react-three/drei";

const FONT_URL =
  "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

/** Single extruded ACE mesh with gentle motion */
function AceMesh({ position = [0, 0, 0], scale = 1, speed = 1, phase = 0 }) {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime * speed + phase;
    groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.55;
    groupRef.current.rotation.x = Math.sin(t * 0.25 + phase) * 0.18;
    groupRef.current.position.y = Math.sin(t * 0.45) * 0.25;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
        <Center>
          <Text3D
            font={FONT_URL}
            size={1.15}
            height={0.28}
            curveSegments={16}
            bevelEnabled
            bevelSize={0.025}
            bevelThickness={0.035}
          >
            ACE
            <meshStandardMaterial
              color="#ff6b9d"
              emissive="#e63956"
              emissiveIntensity={0.55}
              metalness={0.35}
              roughness={0.35}
              transparent
              opacity={0.92}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}

/** Scene: layered ACE letters + soft romantic lighting */
function AceScene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} color="#ffe4ec" />
      <pointLight position={[-5, -2, 4]} intensity={0.85} color="#b794f6" />
      <pointLight position={[5, 2, -3]} intensity={0.6} color="#ff6b9d" />

      <AceMesh position={[0, 0, 0]} scale={1} speed={1} phase={0} />
      <AceMesh position={[-2.8, 1.2, -2.5]} scale={0.45} speed={0.7} phase={1.2} />
      <AceMesh position={[2.6, -1.1, -3]} scale={0.38} speed={0.85} phase={2.4} />
    </>
  );
}

/**
 * Full-screen 3D “ACE” background — fixed behind page content.
 */
export default function Background3D() {
  return (
    <div className="background-3d" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <AceScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
