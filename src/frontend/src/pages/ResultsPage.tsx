import DentalArch3D from "@/components/DentalArch3D";
import HealthScoreGauge from "@/components/HealthScoreGauge";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useSubmitScan } from "@/hooks/useQueries";
import type { ToothRecord } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  LogIn,
  LogOut,
  MapPin,
  RotateCcw,
  Save,
  Share2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const STATUS_CONFIG = {
  healthy: {
    label: "Healthy",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: CheckCircle2,
  },
  risk: {
    label: "Risk Detected",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: AlertTriangle,
  },
  cavity: {
    label: "Cavity / Decay",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
  },
};

function IssueCard({ tooth, index }: { tooth: ToothRecord; index: number }) {
  const config = STATUS_CONFIG[tooth.status] ?? STATUS_CONFIG.risk;
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`glass-card rounded-3xl p-4 border ${config.border}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`circle-icon w-9 h-9 ${config.bg} flex-shrink-0 border ${config.border}`}
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">
              Tooth #{Number(tooth.number)}
            </span>
            <Badge
              variant="outline"
              className={`text-xs ${config.color} border-current rounded-full`}
            >
              {config.label}
            </Badge>
          </div>
          <p className="font-semibold text-sm mt-1">{tooth.condition}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {tooth.recommendation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function TriageBanner({ score }: { score: number }) {
  const navigate = useNavigate();

  let severity: "Mild" | "Moderate" | "Severe";
  let message: string;
  let borderColor: string;
  let bgColor: string;
  let textColor: string;
  let Icon: typeof CheckCircle2;

  if (score >= 70) {
    severity = "Mild";
    message =
      "Your scan looks mostly healthy. Monitor and maintain good hygiene.";
    borderColor = "border-l-green-500";
    bgColor = "bg-green-500/8";
    textColor = "text-green-400";
    Icon = CheckCircle2;
  } else if (score >= 40) {
    severity = "Moderate";
    message = "Some issues detected. Consider visiting a dentist soon.";
    borderColor = "border-l-yellow-500";
    bgColor = "bg-yellow-500/8";
    textColor = "text-yellow-400";
    Icon = AlertTriangle;
  } else {
    severity = "Severe";
    message =
      "Significant issues detected. We recommend seeing an emergency dentist.";
    borderColor = "border-l-red-500";
    bgColor = "bg-red-500/8";
    textColor = "text-red-400";
    Icon = XCircle;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className={`glass-card rounded-3xl p-5 border-l-4 ${borderColor} ${bgColor}`}
      data-ocid="results.triage.card"
    >
      <div className="flex items-start gap-3">
        <div
          className={`circle-icon w-10 h-10 flex-shrink-0 ${
            severity === "Mild"
              ? "bg-green-500/15 border border-green-500/30"
              : severity === "Moderate"
                ? "bg-yellow-500/15 border border-yellow-500/30"
                : "bg-red-500/15 border border-red-500/30"
          }`}
        >
          <Icon className={`w-5 h-5 ${textColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${textColor}`}
            >
              {severity}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {message}
          </p>
          {(severity === "Moderate" || severity === "Severe") && (
            <Button
              size="sm"
              className="mt-3 rounded-full glow-primary text-xs px-4 border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
              variant="outline"
              onClick={() => navigate({ to: "/find-dentist" })}
              data-ocid="results.find_dentist.button"
            >
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Find Emergency Dentist
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { scanResult } = useScanContext();
  const { identity, login, clear } = useInternetIdentity();
  const { mutate: submitScan, isPending: isSaving } = useSubmitScan();
  const autoSavedRef = useRef(false);

  // Auto-save when authenticated and scan result is available
  useEffect(() => {
    if (identity && scanResult && !autoSavedRef.current) {
      autoSavedRef.current = true;
      submitScan(scanResult, {
        onSuccess: () => {
          toast.success("Scan report saved to your account!");
        },
        onError: () => {
          toast.error("Failed to auto-save report.");
        },
      });
    }
  }, [identity, scanResult, submitScan]);

  if (!scanResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No scan results available.</p>
        <Button
          className="rounded-full"
          onClick={() => navigate({ to: "/scan" })}
        >
          Start a Scan
        </Button>
      </div>
    );
  }

  const score = Number(scanResult.overallScore);
  const issueTeeth = scanResult.teeth.filter((t) => t.status !== "healthy");
  const cavityCount = scanResult.teeth.filter(
    (t) => t.status === "cavity",
  ).length;
  const riskCount = scanResult.teeth.filter((t) => t.status === "risk").length;
  const healthyCount = scanResult.teeth.filter(
    (t) => t.status === "healthy",
  ).length;

  const handleSave = () => {
    if (!identity) {
      login();
      return;
    }
    submitScan(scanResult, {
      onSuccess: () => {
        toast.success("Scan report saved successfully!");
      },
      onError: () => {
        toast.error("Failed to save report. Please try again.");
      },
    });
  };

  const handleShare = async () => {
    const text = `My dental health score is ${score}/100. ${healthyCount} healthy, ${riskCount} at risk, ${cavityCount} cavities detected. #DantaNova`;
    const shareData = {
      title: "My DantaNova Scan Results",
      text,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        toast.success("Results copied to clipboard!");
      } catch {
        toast.error("Unable to share. Please copy the URL manually.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30">
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Scan Results</h1>
          <p className="text-xs text-muted-foreground">
            {new Date(
              Number(scanResult.timestamp / BigInt(1_000_000)),
            ).toLocaleString()}
          </p>
        </div>
        {identity ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear()}
            data-ocid="results.secondary_button"
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
            data-ocid="results.secondary_button"
            className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Sign In
          </Button>
        )}
      </header>

      <main className="flex-1 flex flex-col gap-6 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Score + stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-6 glass-card rounded-3xl p-6"
        >
          <HealthScoreGauge score={score} />
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div
                className="circle-icon w-14 h-14 bg-green-500/10 border border-green-500/25 mb-2"
                style={{ boxShadow: "0 0 12px 2px oklch(0.72 0.17 150 / 0.1)" }}
              >
                <span className="text-xl font-display font-bold text-green-400">
                  {healthyCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="circle-icon w-14 h-14 bg-yellow-500/10 border border-yellow-500/25 mb-2">
                <span className="text-xl font-display font-bold text-yellow-400">
                  {riskCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">At Risk</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="circle-icon w-14 h-14 bg-red-500/10 border border-red-500/25 mb-2">
                <span className="text-xl font-display font-bold text-red-400">
                  {cavityCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Cavities</p>
            </div>
          </div>
        </motion.div>

        {/* Triage Severity Banner */}
        <TriageBanner score={score} />

        {/* 3D Arch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">
              3D Dental Arch
            </h2>
            <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              {scanResult.teeth.length} teeth analyzed
            </span>
          </div>
          <DentalArch3D teeth={scanResult.teeth} />

          <div className="flex gap-3 justify-center mt-4 flex-wrap">
            {[
              { color: "bg-green-500", label: "Healthy" },
              { color: "bg-yellow-500", label: "Risk Detected" },
              { color: "bg-red-500", label: "Cavity / Decay" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 bg-muted/30 px-3 py-1 rounded-full"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Issues */}
        {issueTeeth.length > 0 ? (
          <div>
            <h2 className="font-display font-semibold text-base mb-3">
              Issues Found
              <span className="ml-2 text-xs font-normal bg-primary/15 text-primary px-2.5 py-0.5 rounded-full">
                {issueTeeth.length}
              </span>
            </h2>
            <div className="flex flex-col gap-3">
              {issueTeeth.map((tooth, i) => (
                <IssueCard key={Number(tooth.number)} tooth={tooth} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass-card rounded-3xl p-6 text-center"
          >
            <div className="circle-icon w-16 h-16 bg-green-500/10 mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-display font-bold text-lg">
              Perfect Dental Health!
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              No issues detected. Keep up the great oral hygiene routine.
            </p>
          </motion.div>
        )}

        {/* Sign in banner for unauthenticated users */}
        {!identity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="glass-card rounded-3xl p-4 flex items-center justify-between gap-4 border border-primary/20"
            data-ocid="results.card"
          >
            <div className="flex items-center gap-3">
              <div className="circle-icon w-9 h-9 bg-primary/10 flex-shrink-0">
                <LogIn className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Sign in to save this report to your account
              </p>
            </div>
            <Button
              size="sm"
              className="rounded-full flex-shrink-0 glow-primary"
              onClick={() => login()}
              data-ocid="results.primary_button"
            >
              Sign In
            </Button>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => navigate({ to: "/scan" })}
            data-ocid="results.secondary_button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Scan Again
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleShare}
            data-ocid="results.share_button"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            className="flex-1 rounded-full glow-primary"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="results.save_button"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : identity ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            {isSaving
              ? "Saving..."
              : identity
                ? "Save Report"
                : "Login to Save"}
          </Button>
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
        <p className="mt-1">Developed by Swanandi Manoj Vispute</p>
      </footer>
    </div>
  );
}
