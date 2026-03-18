import { useCamera } from "@/camera/useCamera";
import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  LogIn,
  LogOut,
  Scan,
  SwitchCamera,
} from "lucide-react";
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
  const { identity, login, clear } = useInternetIdentity();
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
    switchCamera,
    currentFacingMode,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment", quality: 0.85 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once when authenticated
  useEffect(() => {
    if (!identity) return;
    startCamera();
    return () => {
      stopCamera();
    };
  }, [!!identity]);

  const handleFlipCamera = async () => {
    await switchCamera();
  };

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

  // --- Sign-in gate ---
  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-sm w-full"
        >
          {/* Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-[-16px] rounded-full border border-primary/10" />
            <div className="absolute inset-[-8px] rounded-full border border-primary/20" />
            <LogoCircle size="lg" animate />
          </div>

          <h1
            className="font-display text-3xl font-bold mb-3"
            style={{ color: "oklch(0.78 0.16 80)" }}
          >
            Sign In Required
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Please sign in to start your dental scan and save your results.
          </p>

          <Button
            size="lg"
            className="w-full text-base py-6 rounded-full font-semibold glow-primary mb-4"
            onClick={() => login()}
            data-ocid="scan.primary_button"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In to Continue
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="w-full rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: "/" })}
            data-ocid="scan.cancel_button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

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
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Dental Scan</h1>
          <p className="text-xs text-muted-foreground">
            Step {Math.min(currentStep + 1, STEPS.length)} of {STEPS.length}
          </p>
        </div>
        <button
          type="button"
          onClick={() => clear()}
          data-ocid="scan.secondary_button"
          className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
        <LogoCircle size="sm" />
      </header>

      {/* Progress pills */}
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

      {/* Step circles */}
      <div className="flex gap-1.5 px-4 mb-3">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex-1 flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < captures.length
                  ? "bg-primary text-primary-foreground circle-glow-ring"
                  : i === currentStep
                    ? "bg-primary/20 text-primary border border-primary"
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

        <div className="relative rounded-3xl overflow-hidden bg-black flex-1 min-h-[300px] max-h-[400px]">
          {isSupported === false ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
              <div className="circle-icon w-16 h-16 bg-muted/30">
                <Camera className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-center text-sm">
                Camera not supported in this browser.
              </p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 p-6">
              <div className="circle-icon w-16 h-16 bg-destructive/10">
                <Camera className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-sm text-destructive text-center">
                {error.message}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => startCamera()}
              >
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
                style={{
                  minHeight: "300px",
                  transform:
                    currentFacingMode === "user" ? "scaleX(-1)" : "none",
                }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {isActive && (
                <>
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute left-0 right-0 h-0.5 opacity-70 animate-scan-line"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, oklch(0.78 0.16 80), transparent)",
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="w-4/5 rounded-3xl"
                      style={{
                        height: "60%",
                        border: "2px solid oklch(0.78 0.16 80 / 0.75)",
                        boxShadow:
                          "0 0 0 9999px oklch(0 0 0 / 0.45), inset 0 0 20px oklch(0.78 0.16 80 / 0.05)",
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
                        borderColor: "oklch(0.78 0.16 80)",
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

                  {/* Camera flip button */}
                  <button
                    type="button"
                    onClick={handleFlipCamera}
                    data-ocid="scan.toggle"
                    aria-label={
                      currentFacingMode === "environment"
                        ? "Switch to front camera"
                        : "Switch to back camera"
                    }
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
                  >
                    <SwitchCamera className="w-5 h-5 text-white" />
                  </button>
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
          {"\uD83D\uDCA1"} {step.tip}
        </p>

        {/* Captured thumbnails */}
        {captures.length > 0 && (
          <div className="flex gap-2 justify-center">
            {captures.map((_, i) => (
              <div
                key={STEPS[i]?.id ?? i}
                className="circle-icon w-10 h-10 bg-primary/20 border border-primary/40 circle-glow-ring"
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
              className="w-full text-base py-6 rounded-full font-semibold"
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
              className="w-full text-base py-6 rounded-full font-semibold glow-primary"
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
