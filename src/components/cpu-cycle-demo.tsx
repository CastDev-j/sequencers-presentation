import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import type * as THREE from "three";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";

const CPU_PHASES = [
  { name: "Fetch", desc: "Buscar", color: "#22c55e" },
  { name: "Decode", desc: "Decodificar", color: "#eab308" },
  { name: "Execute", desc: "Ejecutar", color: "#ef4444" },
  { name: "Store", desc: "Guardar", color: "#3b82f6" },
];

function PhaseBlock({
  index,
  isActive,
  total,
}: {
  index: number;
  isActive: boolean;
  total: number;
}) {
  const phase = CPU_PHASES[index];
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 1.6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 5) * 0.03,
      );
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[x, 0, z]}
      rotation={[0, -angle + Math.PI / 2, 0]}
    >
      <RoundedBox args={[1.1, 1.1, 0.15]} radius={0.08}>
        <meshBasicMaterial color={isActive ? phase.color : "#f3f4f6"} />
      </RoundedBox>

      <Text
        fontSize={0.24}
        color={isActive ? "#ffffff" : "#374151"}
        position={[0, 0.15, 0.1]}
        anchorX="center"
        anchorY="middle"
      >
        {phase.name}
      </Text>

      <Text
        fontSize={0.16}
        color={isActive ? "#ffffff" : "#6b7280"}
        position={[0, -0.15, 0.1]}
        anchorX="center"
        anchorY="middle"
      >
        {phase.desc}
      </Text>
    </group>
  );
}

function CenterCPU() {
  return (
    <group>
      <RoundedBox args={[0.9, 0.9, 0.2]} radius={0.08}>
        <meshBasicMaterial color="#1f2937" />
      </RoundedBox>
      <Text
        fontSize={0.28}
        color="#ffffff"
        position={[0, 0, 0.15]}
        anchorX="center"
        anchorY="middle"
      >
        CPU
      </Text>
    </group>
  );
}

function CameraRotator({ currentPhase }: { currentPhase: number }) {
  const { camera } = useThree();
  const radiusRef = useRef(5);

  useFrame((state) => {
    const angle = state.clock.elapsedTime * 0.5;
    const radius = 5;
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene({ currentPhase }: { currentPhase: number }) {
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <CameraRotator currentPhase={currentPhase} />

      <group rotation={[0.4, 0, 0]}>
        <CenterCPU />
        {CPU_PHASES.map((_, i) => (
          <PhaseBlock
            key={i}
            index={i}
            isActive={currentPhase === i}
            total={CPU_PHASES.length}
          />
        ))}
      </group>
    </>
  );
}

export function CPUCycleDemo() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % CPU_PHASES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-200">
        <Canvas camera={{ position: [0, 2, 5], fov: 40 }}>
          <Scene currentPhase={currentPhase} />
        </Canvas>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded px-3 py-1.5 border border-neutral-200">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: CPU_PHASES[currentPhase].color }}
          />
          <span className="text-xs font-medium text-neutral-800">
            {CPU_PHASES[currentPhase].name}
          </span>
        </div>
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
          onClick={() =>
            setCurrentPhase((prev) => (prev + 1) % CPU_PHASES.length)
          }
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <SkipForward className="w-3 h-3" />
          Siguiente
        </button>
        <button
          onClick={() => {
            setCurrentPhase(0);
            setIsPlaying(true);
          }}
          className="flex items-center gap-2 p-1.5 text-sm font-medium rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
