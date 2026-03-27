import type { ToothRecord } from "@/types";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";

const STATUS_COLOR: Record<string, string> = {
  healthy: "#16a34a",
  risk: "#ca8a04",
  cavity: "#dc2626",
};

const STATUS_GLOW: Record<string, string> = {
  healthy: "#22c55e",
  risk: "#facc15",
  cavity: "#f87171",
};

const STATUS_EMISSIVE: Record<string, string> = {
  healthy: "#0a2e14",
  risk: "#2a1800",
  cavity: "#2e0a0a",
};

const STATUS_LABEL: Record<string, string> = {
  healthy: "Healthy",
  risk: "Risk Detected",
  cavity: "Cavity / Decay",
};

const STATUS_BG: Record<string, string> = {
  healthy: "rgba(5,46,22,0.92)",
  risk: "rgba(69,26,3,0.92)",
  cavity: "rgba(69,10,10,0.92)",
};

const STATUS_BORDER: Record<string, string> = {
  healthy: "#16a34a",
  risk: "#ca8a04",
  cavity: "#dc2626",
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
  selectedTooth: ToothRecord | null;
  onClose: () => void;
}

function ToothMesh({
  tooth,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  selectedTooth,
  onClose,
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
    const activeScale = isSelected ? 1.18 : isHovered ? 1.08 : 1.0;
    const targetScale = eased * activeScale;
    const curr = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(curr + (targetScale - curr) * 0.15);
  });

  const toothNum = Number(tooth.number);
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const { position, rotationY } = getToothTransform(toothNum);
  const [w, h, d] = getToothSize(idx);
  const glowColor = STATUS_GLOW[tooth.status] ?? "#22c55e";
  const statusEmissive = STATUS_EMISSIVE[tooth.status] ?? "#0a2e14";
  const isActive = isSelected || isHovered;

  const labelOffset: [number, number, number] = [
    position[0],
    position[1] + h / 2 + 0.55,
    position[2],
  ];

  return (
    <group>
      {/* Per-tooth status glow light */}
      <pointLight
        position={[position[0], position[1], position[2] + 0.3]}
        intensity={isActive ? 1.2 : 0.45}
        color={glowColor}
        distance={1.2}
        decay={2}
      />

      <RoundedBox
        ref={meshRef}
        args={[w, h, d]}
        radius={0.05}
        smoothness={6}
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
          color="#f5f0e8"
          emissive={isActive ? glowColor : statusEmissive}
          emissiveIntensity={isActive ? 0.35 : 0.06}
          roughness={0.15}
          metalness={0.05}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {isSelected && selectedTooth?.number === tooth.number && (
        <Html
          position={labelOffset}
          center
          zIndexRange={[100, 200]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: STATUS_BG[tooth.status] ?? "rgba(5,46,22,0.92)",
              border: `1.5px solid ${STATUS_BORDER[tooth.status] ?? "#16a34a"}`,
              borderRadius: "16px",
              padding: "10px 14px",
              minWidth: "160px",
              maxWidth: "210px",
              color: "#f1f5f9",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: `0 0 18px 2px ${STATUS_BORDER[tooth.status] ?? "#16a34a"}55`,
              fontSize: "12px",
              lineHeight: "1.5",
              textAlign: "center",
              pointerEvents: "auto",
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                position: "absolute",
                top: "6px",
                right: "8px",
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: 1,
                padding: 0,
                pointerEvents: "auto",
              }}
              aria-label="Close"
            >
              ×
            </button>

            <div
              style={{
                fontSize: "10px",
                color: STATUS_COLOR[tooth.status],
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Tooth #{toothNum}
            </div>

            <div
              style={{
                color: STATUS_COLOR[tooth.status],
                fontWeight: 700,
                fontSize: "13px",
                marginBottom: "4px",
              }}
            >
              {STATUS_LABEL[tooth.status]}
            </div>

            <div
              style={{
                fontWeight: 600,
                fontSize: "12px",
                marginBottom: "4px",
                color: "#e2e8f0",
              }}
            >
              {tooth.condition}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                lineHeight: "1.4",
              }}
            >
              {tooth.recommendation}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: `8px solid ${STATUS_BORDER[tooth.status] ?? "#16a34a"}`,
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}

const GUM_INDICES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

/** Curved gum/jaw base for upper or lower arch */
function JawBase({ isUpper }: { isUpper: boolean }) {
  const y = isUpper ? 0.28 : -0.28;

  return (
    <group>
      {GUM_INDICES.map((idx) => {
        const t = idx / 15;
        const rx = 2.55;
        const rz = 1.85;
        const angle = Math.PI * (1 - t);
        const x = rx * Math.cos(angle);
        const z = rz * Math.sin(angle);
        const rotY = -(Math.PI / 2 - angle);
        return (
          <mesh
            key={`gum-seg-${idx}`}
            position={[x, y, z]}
            rotation={[0, rotY, 0]}
          >
            <boxGeometry args={[0.34, 0.22, 0.28]} />
            <meshStandardMaterial
              color="#7b2d2d"
              roughness={0.75}
              metalness={0.0}
              emissive="#3a0d0d"
              emissiveIntensity={0.15}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface DentalArch3DProps {
  teeth: ToothRecord[];
}

export default function DentalArch3D({ teeth }: DentalArch3DProps) {
  const [selectedTooth, setSelectedTooth] = useState<ToothRecord | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ height: "480px" }}
      data-ocid="results.canvas_target"
    >
      <Canvas
        camera={{ position: [0, 2.8, 6.5], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#0a0800" }}
      >
        {/* Ambient base */}
        <ambientLight intensity={0.3} />

        {/* Warm key light (gold) */}
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.6}
          color="#ffe8a0"
          castShadow
        />

        {/* Cool fill light (blueish) */}
        <directionalLight
          position={[-5, 3, 2]}
          intensity={0.5}
          color="#a8d8ff"
        />

        {/* Strong rim light from behind */}
        <directionalLight
          position={[0, -2, -6]}
          intensity={0.8}
          color="#ffffff"
        />

        {/* Warm under-glow */}
        <pointLight position={[0, -3, 2]} intensity={0.4} color="#a07000" />

        {/* Jaw gum bases */}
        <JawBase isUpper />
        <JawBase isUpper={false} />

        {teeth.map((tooth, i) => (
          <ToothMesh
            key={Number(tooth.number)}
            tooth={tooth}
            index={i}
            isSelected={selectedTooth?.number === tooth.number}
            isHovered={hoveredId === Number(tooth.number)}
            onSelect={setSelectedTooth}
            onHover={setHoveredId}
            selectedTooth={selectedTooth}
            onClose={() => setSelectedTooth(null)}
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

      {!selectedTooth && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground pointer-events-none whitespace-nowrap">
          Tap any tooth to see its report · Drag to rotate
        </div>
      )}
    </div>
  );
}
