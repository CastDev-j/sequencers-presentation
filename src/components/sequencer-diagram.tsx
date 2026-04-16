import { Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import { useState, useEffect } from "react";

function Counter({ step }: { step: number }) {
  return (
    <group position={[-1.8, 0, 0]}>
      <RoundedBox args={[1.4, 1.8, 0.15]} radius={0.08}>
        <meshBasicMaterial color="#e0e7ff" />
      </RoundedBox>

      <Text
        fontSize={0.18}
        color="#3730a3"
        position={[0, 0.55, 0.1]}
        anchorX="center"
        anchorY="middle"
      >
        CONTADOR
      </Text>

      <RoundedBox args={[0.8, 0.5, 0.08]} radius={0.04} position={[0, 0, 0.08]}>
        <meshBasicMaterial color="#1e1b4b" />
      </RoundedBox>

      <Text
        fontSize={0.4}
        color="#ffffff"
        position={[0, 0, 0.15]}
        anchorX="center"
        anchorY="middle"
      >
        {step.toString()}
      </Text>

      <Text
        fontSize={0.12}
        color="#374151"
        position={[0, -0.55, 0.1]}
        anchorX="center"
        anchorY="middle"
      >
        {"Avanza con el reloj"}
      </Text>
    </group>
  );
}

function Arrow() {
  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.12, 8]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>
    </group>
  );
}

function Decoder({ step }: { step: number }) {
  const outputs = [0, 1, 2, 3];

  return (
    <group position={[1.8, 0, 0]}>
      <RoundedBox args={[1.6, 1.8, 0.15]} radius={0.08}>
        <meshBasicMaterial color="#dcfce7" />
      </RoundedBox>

      <Text
        fontSize={0.14}
        color="#166534"
        position={[0, 0.55, 0.1]}
        anchorX="center"
        anchorY="middle"
      >
        DECODIFICADOR
      </Text>

      {outputs.map((output, i) => {
        const isActive = step === output;
        const yPos = 0.25 - i * 0.25;
        return (
          <group key={i} position={[0, yPos, 0.1]}>
            <RoundedBox args={[1.2, 0.18, 0.05]} radius={0.02}>
              <meshBasicMaterial color={isActive ? "#22c55e" : "#f3f4f6"} />
            </RoundedBox>
            <Text
              fontSize={0.1}
              color={isActive ? "#ffffff" : "#374151"}
              position={[0, 0, 0.04]}
              anchorX="center"
              anchorY="middle"
            >
              {`Salida ${output}`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function ClockPulse({ tick }: { tick: boolean }) {
  return (
    <group position={[0, -1.3, 0]}>
      <mesh>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color={tick ? "#3b82f6" : "#e5e7eb"} />
      </mesh>
      <Text
        fontSize={0.14}
        color="#6b7280"
        position={[0, 0.3, 0]}
        anchorX="center"
        anchorY="middle"
      >
        Reloj
      </Text>
    </group>
  );
}

function Scene() {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(true);
      setTimeout(() => {
        setTick(false);
        setStep((prev) => (prev + 1) % 4);
      }, 200);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <color attach="background" args={["#ffffff"]} />

      <Counter step={step} />
      <Arrow />
      <Decoder step={step} />
      <ClockPulse tick={tick} />
    </>
  );
}

export function SequencerDiagram() {
  return (
    <div className="w-full aspect-16/10 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-200">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
