import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { generateScanResult } from "@/utils/scanSimulation";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, LogIn, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STEPS = [
  { label: "Processing images...", duration: 1000 },
  { label: "Detecting tooth surfaces...", duration: 1100 },
  { label: "Analyzing for cavities...", duration: 1500 },
  { label: "Checking gum health...", duration: 1000 },
  { label: "Generating 3D model...", duration: 1200 },
];

// Gold particle positions for burst animation
const PARTICLES = [
  { px: "20px", delay: "0s" },
  { px: "-30px", delay: "0.15s" },
  { px: "45px", delay: "0.3s" },
  { px: "-15px", delay: "0.1s" },
  { px: "35px", delay: "0.45s" },
  { px: "-45px", delay: "0.2s" },
  { px: "10px", delay: "0.35s" },
  { px: "-25px", delay: "0.05s" },
];

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { capturedImages, setScanResult } = useScanContext();
  const { identity, login, clear } = useInternetIdentity();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showParticles, setShowParticles] = useState(false);

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
          // Trigger particle burst on each step start
          setShowParticles(false);
          setTimeout(() => setShowParticles(true), 50);
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
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      data-ocid="analysis.loading_state"
    >
      {/* Header with sign in/out */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/20 relative z-20">
        <LogoCircle size="sm" />
        {identity ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear()}
            data-ocid="analysis.secondary_button"
            className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => login()}
            data-ocid="analysis.primary_button"
            className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Sign In
          </Button>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.78 0.16 80 / 0.07) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

        {/* Gold particle burst */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              {PARTICLES.map((p, i) => (
                <motion.div
                  key={`particle-${i}-${currentStep}`}
                  initial={{ opacity: 0.7, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -120, scale: 0.3 }}
                  transition={{
                    duration: 2.5,
                    delay: Number.parseFloat(p.delay),
                    ease: "easeOut",
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: "oklch(0.88 0.18 85)",
                    boxShadow: "0 0 8px oklch(0.88 0.18 85 / 0.8)",
                    translateX: p.px,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-md w-full">
          {/* Circular spinner with logo inside */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-[-16px] rounded-full border border-primary/10" />
            <div className="absolute inset-[-6px] rounded-full border border-primary/15" />
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "oklch(0.78 0.16 80)",
                borderRightColor: "oklch(0.78 0.16 80 / 0.5)",
                animation: "spin 1.2s linear infinite",
              }}
            />
            {/* Pulse ring around spinner */}
            <div
              className="absolute inset-[-10px] rounded-full animate-ring-pulse pointer-events-none"
              style={{ border: "1px solid oklch(0.78 0.16 80 / 0.3)" }}
            />
            <LogoCircle size="lg" animate />
            <div className="absolute inset-4 overflow-hidden rounded-full">
              <div
                className="absolute left-0 right-0 h-0.5 animate-scan-line"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.16 80 / 0.8), transparent)",
                }}
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-1">
              AI Analysis
            </h1>
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
                  className="flex items-center gap-3 glass-card rounded-3xl px-4 py-3"
                >
                  <div
                    className={`circle-icon w-8 h-8 flex-shrink-0 ${
                      isDone
                        ? "bg-primary/20 circle-glow-ring"
                        : isStepActive
                          ? "bg-primary/10 border border-primary/50"
                          : "bg-muted/50"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : isStepActive ? (
                      <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium flex-1 ${
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
                        className="text-xs text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full"
                      >
                        Done
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar with glow */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPct}%`,
                transition: "width 0.5s ease",
                background:
                  "linear-gradient(90deg, oklch(0.72 0.16 80), oklch(0.88 0.18 85))",
                boxShadow: "0 0 12px oklch(0.78 0.16 80 / 0.6)",
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            This usually takes a few seconds…
          </p>
        </div>
      </div>
    </div>
  );
}
