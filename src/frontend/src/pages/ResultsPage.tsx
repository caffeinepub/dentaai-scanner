import DentalArch3D from "@/components/DentalArch3D";
import HealthScoreGauge from "@/components/HealthScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useSubmitScan } from "@/hooks/useQueries";
import type { ToothRecord } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  LogIn,
  RotateCcw,
  Save,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
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
      className={`glass-card rounded-xl p-4 border ${config.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">
              Tooth #{Number(tooth.number)}
            </span>
            <Badge
              variant="outline"
              className={`text-xs ${config.color} border-current`}
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

export default function ResultsPage() {
  const navigate = useNavigate();
  const { scanResult } = useScanContext();
  const { identity, login } = useInternetIdentity();
  const { mutate: submitScan, isPending: isSaving } = useSubmitScan();

  if (!scanResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No scan results available.</p>
        <Button onClick={() => navigate({ to: "/scan" })}>Start a Scan</Button>
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30">
        <img
          src="/assets/generated/dentaai-logo-transparent.dim_200x200.png"
          alt=""
          className="w-8 h-8 object-contain"
        />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Scan Results</h1>
          <p className="text-xs text-muted-foreground">
            {new Date(
              Number(scanResult.timestamp / BigInt(1_000_000)),
            ).toLocaleString()}
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Score + stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-6 glass-card rounded-2xl p-6"
        >
          <HealthScoreGauge score={score} />
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-green-400">
                {healthyCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Healthy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-yellow-400">
                {riskCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">At Risk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-red-400">
                {cavityCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Cavities</p>
            </div>
          </div>
        </motion.div>

        {/* 3D Arch — hero element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">
              3D Dental Arch
            </h2>
            <span className="text-xs text-muted-foreground">
              {scanResult.teeth.length} teeth analyzed
            </span>
          </div>
          <DentalArch3D teeth={scanResult.teeth} />

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-4">
            {[
              { color: "bg-green-500", label: "Healthy" },
              { color: "bg-yellow-500", label: "Risk Detected" },
              { color: "bg-red-500", label: "Cavity / Decay" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
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
              Issues Found ({issueTeeth.length})
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
            className="glass-card rounded-2xl p-6 text-center"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg">
              Perfect Dental Health!
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              No issues detected. Keep up the great oral hygiene routine.
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => navigate({ to: "/scan" })}
            data-ocid="results.secondary_button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Scan Again
          </Button>
          <Button
            className="flex-1 rounded-xl glow-primary"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="results.primary_button"
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
    </div>
  );
}
