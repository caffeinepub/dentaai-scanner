import type { ToothRecord } from "@/types";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";

const STATUS_COLOR: Record<string, string> = {
  healthy: "#16a34a",
  risk: "#ca8a04",
  cavity: "#dc2626",
};

const STATUS_EMISSIVE: Record<string, string> = {
  healthy: "#052e16",
  risk: "#451a03",
  cavity: "#450a0a",
};

function getToothTransform(toothNum: number): {
  position: [number, number, number];
  rotationY: number;
} {
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const t = idx / 15;
  const rx = 2.45;
  const rz = 1.75;
  const angle = Math.PI * (1 - t);
  const x = rx * Math.cos(angle);
  const z = rz * Math.sin(angle);
  const y = isUpper ? 0.55 : -0.55;
  const rotationY = -(Math.PI / 2 - angle);
  return { position: [x, y, z], rotationY };
}

function getToothSize(idx: number): [number, number, number] {
  const t = idx / 15;
  const frontness = Math.max(0, 1 - Math.abs(t - 0.5) * 2.2);
  const w = 0.3 - 0.12 * frontness;
  const h = 0.42 + 0.1 * frontness;
  const d = 0.24 - 0.05 * frontness;
  return [w, h, d];
}

interface ToothMeshProps {
  tooth: ToothRecord;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (tooth: ToothRecord | null) => void;
  onHover: (id: number | null) => void;
}

function ToothMesh({
  tooth,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: ToothMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const startTimeRef = useRef<number | null>(null);
  const delayMs = index * 28;

  useFrame((state) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }
    const elapsed = (state.clock.elapsedTime - startTimeRef.current) * 1000;
    if (elapsed < delayMs) {
      meshRef.current.scale.setScalar(0);
      return;
    }
    const progress = Math.min(1, (elapsed - delayMs) / 350);
    const eased = 1 - (1 - progress) ** 3;
    const activeScale = isSelected ? 1.12 : isHovered ? 1.06 : 1.0;
    const targetScale = eased * activeScale;
    const curr = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(curr + (targetScale - curr) * 0.15);
  });

  const toothNum = Number(tooth.number);
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const { position, rotationY } = getToothTransform(toothNum);
  const [w, h, d] = getToothSize(idx);
  const color = STATUS_COLOR[tooth.status] ?? "#16a34a";
  const emissive = STATUS_EMISSIVE[tooth.status] ?? "#052e16";
  const isActive = isSelected || isHovered;

  return (
    <RoundedBox
      ref={meshRef}
      args={[w, h, d]}
      radius={0.045}
      smoothness={4}
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSelected ? null : tooth);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(toothNum);
      }}
      onPointerOut={() => onHover(null)}
    >
      <meshStandardMaterial
        color={color}
        emissive={isActive ? color : emissive}
        emissiveIntensity={isActive ? 0.5 : 0.08}
        roughness={0.28}
        metalness={0.15}
      />
    </RoundedBox>
  );
}

interface DentalArch3DProps {
  teeth: ToothRecord[];
}

export default function DentalArch3D({ teeth }: DentalArch3DProps) {
  const [selectedTooth, setSelectedTooth] = useState<ToothRecord | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const statusLabel: Record<string, string> = {
    healthy: "Healthy",
    risk: "Risk Detected",
    cavity: "Cavity / Decay",
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ height: "480px" }}
      data-ocid="results.canvas_target"
    >
      <Canvas
        camera={{ position: [0, 2.8, 6.5], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#040c1a" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.3}
          color="#e0f0ff"
        />
        <pointLight position={[0, 4, 3]} intensity={0.9} color="#00c8e8" />
        <pointLight position={[0, -3, 2]} intensity={0.4} color="#0088aa" />

        {teeth.map((tooth, i) => (
          <ToothMesh
            key={Number(tooth.number)}
            tooth={tooth}
            index={i}
            isSelected={selectedTooth?.number === tooth.number}
            isHovered={hoveredId === Number(tooth.number)}
            onSelect={setSelectedTooth}
            onHover={setHoveredId}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.7}
          minDistance={4}
          maxDistance={10}
          autoRotate={!selectedTooth}
          autoRotateSpeed={0.7}
          dampingFactor={0.06}
          enableDamping
        />
      </Canvas>

      {selectedTooth && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-max max-w-xs glass-card rounded-xl px-5 py-3 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Tooth #{Number(selectedTooth.number)}
              </p>
              <p
                className="font-display font-semibold text-sm mt-0.5"
                style={{ color: STATUS_COLOR[selectedTooth.status] }}
              >
                {statusLabel[selectedTooth.status]}
              </p>
              <p className="text-sm font-medium mt-0.5">
                {selectedTooth.condition}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                {selectedTooth.recommendation}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTooth(null)}
              className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none flex-shrink-0 mt-0.5"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {!selectedTooth && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground pointer-events-none whitespace-nowrap">
          Click any tooth to inspect · Drag to rotate
        </div>
      )}
    </div>
  );
}
