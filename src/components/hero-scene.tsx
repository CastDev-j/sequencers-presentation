import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

interface StepData {
  label: string;
  number: string;
  delay: number;
  color: string;
}

const STEPS: StepData[] = [
  { label: "Fetch", number: "1", delay: 0, color: "#3b82f6" },
  { label: "Decode", number: "2", delay: 1.5, color: "#8b5cf6" },
  { label: "Execute", number: "3", delay: 3.0, color: "#ec4899" },
  { label: "Store", number: "4", delay: 4.5, color: "#06b6d4" },
];

function StepBox({
  position,
  step,
  isActive,
  isCompact,
}: {
  position: [number, number, number];
  step: StepData;
  isActive: boolean;
  isCompact: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    const t = isActive ? 1.2 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);

    if (meshRef.current.material && "color" in meshRef.current.material) {
      const targetColor = isActive ? step.color : "#e5e7eb";
      (meshRef.current.material as THREE.MeshBasicMaterial).color.lerp(
        new THREE.Color(targetColor),
        0.1,
      );
    }

    const floatOffset = isActive
      ? Math.sin(state.clock.elapsedTime * 3) * 0.08
      : 0;
    groupRef.current.position.y = position[1] + floatOffset;
  });

  return (
    <group ref={groupRef} position={position}>
      <Box args={[0.8, 0.8, 0.15]} ref={meshRef}>
        <meshBasicMaterial color={isActive ? step.color : "#e5e7eb"} />
      </Box>
      <Text
        position={[0, 0, 0.12]}
        fontSize={isCompact ? 0.24 : 0.3}
        color={isActive ? "#ffffff" : "#6b7280"}
        anchorX="center"
        anchorY="middle"
      >
        {step.number}
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={isCompact ? 0.1 : 0.12}
        color={isActive ? step.color : "#9ca3af"}
        anchorX="center"
        anchorY="middle"
      >
        {step.label}
      </Text>
    </group>
  );
}

function ConnectionLine({
  fromX,
  toX,
  active,
}: {
  fromX: number;
  toX: number;
  active: boolean;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!matRef.current) return;
    const targetColor = active ? "#3b82f6" : "#d1d5db";
    matRef.current.color.lerp(new THREE.Color(targetColor), 0.1);
  });

  const midX = (fromX + toX) / 2;
  const length = Math.abs(toX - fromX) - 0.8;

  return (
    <mesh position={[midX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.015, 0.015, length, 8]} />
      <meshBasicMaterial ref={matRef} color={active ? "#3b82f6" : "#d1d5db"} />
    </mesh>
  );
}

function Scene({
  currentStep,
  isCompact,
}: {
  currentStep: number;
  isCompact: boolean;
}) {
  const spacing = isCompact ? 1.05 : 1.3;
  const positions = STEPS.map((_, i) => (i - 1.5) * spacing);

  return (
    <>
      <color attach="background" args={["#ffffff"]} />

      {STEPS.map((step, i) => (
        <StepBox
          key={i}
          position={[positions[i], 0, 0]}
          step={step}
          isActive={currentStep === i}
          isCompact={isCompact}
        />
      ))}

      {[0, 1, 2].map((i) => (
        <ConnectionLine
          key={i}
          fromX={positions[i] + 0.4}
          toX={positions[i + 1] - 0.4}
          active={currentStep === i}
        />
      ))}

      <mesh position={[0, -0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[0.015, 0.015, positions[3] - positions[0] + 0.8, 8]}
        />
        <meshBasicMaterial color={currentStep === 3 ? "#3b82f6" : "#d1d5db"} />
      </mesh>
    </>
  );
}

export function HeroScene() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const updateCompact = () => setIsCompact(mediaQuery.matches);
    updateCompact();

    mediaQuery.addEventListener("change", updateCompact);
    return () => mediaQuery.removeEventListener("change", updateCompact);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-[42vh] sm:h-[48vh] md:h-[60vh] bg-white rounded-lg overflow-hidden border border-neutral-200">
      <Canvas
        camera={{
          position: isCompact ? [0, 0.9, 4.2] : [0, 1, 5],
          fov: isCompact ? 52 : 45,
        }}
        className="w-full h-full"
      >
        <Scene currentStep={currentStep} isCompact={isCompact} />
      </Canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-between p-4 sm:p-6 pointer-events-none">
        <div className="text-center pt-2 sm:pt-4">
          <p className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 sm:mb-2">
            Ciclo de Instrucción
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
            {STEPS[currentStep].label}
          </h3>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentStep(i);
              setIsPlaying(false);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentStep ? "bg-neutral-800 w-6" : "bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
