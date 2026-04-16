import { Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

function TrafficLight({ activeLight }: { activeLight: number }) {
  const lights = [
    { color: "#22c55e", label: "Verde" },
    { color: "#eab308", label: "Ambar" },
    { color: "#ef4444", label: "Rojo" },
  ];

  return (
    <group position={[-1.5, 0, 0]}>
      <RoundedBox args={[1.2, 3.2, 0.4]} radius={0.1}>
        <meshBasicMaterial color="#374151" />
      </RoundedBox>

      {lights.map((light, i) => {
        const isActive = activeLight === i;
        const yPos = 0.9 - i * 0.9;
        return (
          <group key={i}>
            <mesh position={[0, yPos, 0.25]}>
              <circleGeometry args={[0.32, 32]} />
              <meshBasicMaterial color={isActive ? light.color : "#1f2937"} />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 1, 16]} />
        <meshBasicMaterial color="#374151" />
      </mesh>
    </group>
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = [
    { num: "1", label: "Verde", desc: "Paso" },
    { num: "2", label: "Ambar", desc: "Paso" },
    { num: "3", label: "Rojo", desc: "Paso" },
    { num: "R", label: "Reinicio", desc: "Ciclo" },
  ];

  return (
    <group position={[1.5, 0, 0]}>
      {steps.map((s, i) => {
        const isActive = step === i;
        const yPos = 1.2 - i * 0.8;
        return (
          <group key={i} position={[0, yPos, 0]}>
            <RoundedBox args={[2, 0.55, 0.08]} radius={0.04}>
              <meshBasicMaterial color={isActive ? "#3b82f6" : "#f3f4f6"} />
            </RoundedBox>
            <Text
              fontSize={0.24}
              color={isActive ? "#ffffff" : "#374151"}
              position={[-0.6, 0.02, 0.06]}
              anchorX="center"
              anchorY="middle"
            >
              {s.num}
            </Text>
            <Text
              fontSize={0.18}
              color={isActive ? "#ffffff" : "#6b7280"}
              position={[0.3, 0.02, 0.06]}
              anchorX="center"
              anchorY="middle"
            >
              {s.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function Scene({ step }: { step: number }) {
  const activeLight = step === 3 ? 0 : step;

  return (
    <>
      <color attach="background" args={["#ffffff"]} />

      <TrafficLight activeLight={activeLight} />
      <StepIndicator step={step} />
    </>
  );
}

export function TrafficLightDemo() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-200">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <Scene step={step} />
        </Canvas>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          {isPlaying ? "Pausar" : "Iniciar"}
        </button>
        <button
          onClick={() => {
            setStep(0);
            setIsPlaying(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reiniciar
        </button>
      </div>
    </div>
  );
}
