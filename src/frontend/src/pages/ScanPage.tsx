import { useCamera } from "@/camera/useCamera";
import { Button } from "@/components/ui/button";
import { useScanContext } from "@/context/ScanContext";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, CheckCircle2, Scan } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Front Teeth",
    instruction:
      "Open your mouth slightly and show your front teeth. Center your smile in the frame.",
    tip: "Relax your lips for best coverage",
  },
  {
    id: 2,
    title: "Upper Jaw",
    instruction:
      "Tilt your head back slightly to show the upper jaw and roof of your mouth.",
    tip: "Open wide so upper molars are visible",
  },
  {
    id: 3,
    title: "Lower Jaw",
    instruction:
      "Lower your jaw fully to expose the lower teeth and the floor of your mouth.",
    tip: "Keep the camera steady for a sharp image",
  },
  {
    id: 4,
    title: "Left Side",
    instruction:
      "Turn your head to the right so the camera captures the left side of your teeth.",
    tip: "Show both upper and lower left molars",
  },
  {
    id: 5,
    title: "Right Side",
    instruction:
      "Turn your head to the left so the camera captures the right side of your teeth.",
    tip: "Show both upper and lower right molars",
  },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const { setCapturedImages } = useScanContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [captures, setCaptures] = useState<File[]>([]);
  const [capturedThumb, setCapturedThumb] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment", quality: 0.85 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: camera functions are stable refs, intentionally runs once
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = async () => {
    setIsCapturing(true);
    const file = await capturePhoto();
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedThumb(url);
      void url;
      const newCaptures = [...captures, file];
      setCaptures(newCaptures);

      if (currentStep < STEPS.length - 1) {
        setTimeout(() => {
          setCapturedThumb(null);
          setCurrentStep((s) => s + 1);
          setIsCapturing(false);
        }, 900);
      } else {
        setIsCapturing(false);
      }
    } else {
      setIsCapturing(false);
    }
  };

  const handleAnalyze = () => {
    setCapturedImages(captures);
    stopCamera();
    navigate({ to: "/analysis" });
  };

  const step = STEPS[currentStep];
  const allCaptured = captures.length === STEPS.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center gap-4 px-4 py-4 border-b border-border/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            stopCamera();
            navigate({ to: "/" });
          }}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Dental Scan</h1>
          <p className="text-xs text-muted-foreground">
            Step {Math.min(currentStep + 1, STEPS.length)} of {STEPS.length}
          </p>
        </div>
        <img
          src="/assets/generated/dentaai-logo-transparent.dim_200x200.png"
          alt=""
          className="w-8 h-8 object-contain"
        />
      </header>

      <div className="flex gap-1.5 px-4 pt-4 pb-2">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width:
                  i < captures.length
                    ? "100%"
                    : i === currentStep
                      ? "50%"
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 px-4 mb-3">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex-1 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < captures.length
                  ? "bg-primary text-primary-foreground"
                  : i === currentStep
                    ? "bg-primary/30 text-primary border border-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < captures.length ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                i + 1
              )}
            </div>
            <span className="text-[9px] text-muted-foreground mt-1 text-center leading-tight">
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col px-4 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="font-display font-bold text-xl text-foreground">
              {step.title}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {step.instruction}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="relative rounded-2xl overflow-hidden bg-black flex-1 min-h-[300px] max-h-[400px]">
          {isSupported === false ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
              <Camera className="w-12 h-12 opacity-40" />
              <p className="text-center text-sm">
                Camera not supported in this browser.
              </p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
              <Camera className="w-12 h-12 opacity-40" />
              <p className="text-sm text-destructive text-center">
                {error.message}
              </p>
              <Button size="sm" variant="outline" onClick={() => startCamera()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                style={{ minHeight: "300px" }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {isActive && (
                <>
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute left-0 right-0 h-0.5 opacity-70 animate-scan-line"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, oklch(0.73 0.19 200), transparent)",
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="w-4/5 rounded-3xl"
                      style={{
                        height: "60%",
                        border: "2px solid oklch(0.73 0.19 200 / 0.7)",
                        boxShadow:
                          "0 0 0 9999px oklch(0 0 0 / 0.45), inset 0 0 20px oklch(0.73 0.19 200 / 0.05)",
                      }}
                    />
                  </div>

                  {[
                    "top-4 left-4",
                    "top-4 right-4",
                    "bottom-4 left-4",
                    "bottom-4 right-4",
                  ].map((pos) => (
                    <div
                      key={pos}
                      className={`absolute ${pos} w-5 h-5 pointer-events-none`}
                      style={{
                        borderColor: "oklch(0.73 0.19 200)",
                        borderWidth: "2px",
                        borderStyle:
                          pos.includes("top") && pos.includes("left")
                            ? "solid none none solid"
                            : pos.includes("top") && pos.includes("right")
                              ? "solid solid none none"
                              : pos.includes("bottom") && pos.includes("left")
                                ? "none none solid solid"
                                : "none solid solid none",
                      }}
                    />
                  ))}
                </>
              )}

              {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {capturedThumb && currentStep < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/20"
                />
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          💡 {step.tip}
        </p>

        {captures.length > 0 && (
          <div className="flex gap-2 justify-center">
            {captures.map((_, i) => (
              <div
                key={STEPS[i]?.id ?? i}
                className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
            ))}
          </div>
        )}

        <div className="pb-6 flex flex-col gap-3">
          {!allCaptured ? (
            <Button
              size="lg"
              className="w-full text-base py-6 rounded-xl font-semibold"
              onClick={handleCapture}
              disabled={!isActive || isLoading || isCapturing}
              data-ocid="scan.capture_button"
            >
              <Camera className="w-5 h-5 mr-2" />
              {isCapturing ? "Capturing..." : `Capture ${step.title}`}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full text-base py-6 rounded-xl font-semibold glow-primary"
              onClick={handleAnalyze}
              data-ocid="scan.primary_button"
            >
              <Scan className="w-5 h-5 mr-2" />
              Analyze My Teeth
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
