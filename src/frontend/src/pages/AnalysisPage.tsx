import { useScanContext } from "@/context/ScanContext";
import { generateScanResult } from "@/utils/scanSimulation";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STEPS = [
  { label: "Processing images...", duration: 1000 },
  { label: "Detecting tooth surfaces...", duration: 1100 },
  { label: "Analyzing for cavities...", duration: 1500 },
  { label: "Checking gum health...", duration: 1000 },
  { label: "Generating 3D model...", duration: 1200 },
];

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { capturedImages, setScanResult } = useScanContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const imageCount = capturedImages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount
  useEffect(() => {
    let cumulativeDelay = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const [i, step] of STEPS.entries()) {
      const startDelay = cumulativeDelay;
      timers.push(
        setTimeout(() => {
          setCurrentStep(i);
        }, startDelay),
      );

      cumulativeDelay += step.duration;

      const completeDelay = cumulativeDelay - 200;
      timers.push(
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, i]);
        }, completeDelay),
      );
    }

    timers.push(
      setTimeout(() => {
        const result = generateScanResult(imageCount || 5);
        setScanResult(result);
        navigate({ to: "/results" });
      }, cumulativeDelay + 200),
    );

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  const totalDuration = STEPS.reduce((sum, s) => sum + s.duration, 0);
  const elapsed = STEPS.slice(0, currentStep + 1).reduce(
    (sum, s, i) => sum + (i < currentStep ? s.duration : s.duration / 2),
    0,
  );
  const progressPct = Math.min(100, (elapsed / totalDuration) * 100);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden"
      data-ocid="analysis.loading_state"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.73 0.19 200 / 0.08) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-md w-full">
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "oklch(0.73 0.19 200)",
              borderRightColor: "oklch(0.73 0.19 200 / 0.5)",
              animation: "spin 1.2s linear infinite",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/assets/uploads/file_00000000a88c720bbdf9639edb08e122-1.png"
              alt="DantaNova Logo"
              className="w-16 h-16 object-contain opacity-80"
            />
          </div>
          <div className="absolute inset-4 overflow-hidden rounded-full">
            <div
              className="absolute left-0 right-0 h-0.5 animate-scan-line"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.73 0.19 200 / 0.8), transparent)",
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-1">AI Analysis</h1>
          <p className="text-muted-foreground text-sm">
            Scanning {imageCount || 5} captured images
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {STEPS.map((step, i) => {
            const isDone = completedSteps.includes(i);
            const isStepActive = i === currentStep && !isDone;
            const isPending = i > currentStep;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-3 glass-card rounded-xl px-4 py-3"
              >
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : isStepActive ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-muted" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDone
                      ? "text-primary"
                      : isStepActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                <AnimatePresence>
                  {isDone && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto text-xs text-primary font-semibold"
                    >
                      Done
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${progressPct}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          This usually takes a few seconds…
        </p>
      </div>
    </div>
  );
}
