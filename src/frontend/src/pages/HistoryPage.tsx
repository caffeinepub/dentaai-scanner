import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useScanHistory } from "@/hooks/useQueries";
import type { ScanResult } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ClipboardList,
  LogIn,
  LogOut,
} from "lucide-react";
import { motion } from "motion/react";

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-400 border-green-500/40 bg-green-500/10"
      : score >= 50
        ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
        : "text-red-400 border-red-500/40 bg-red-500/10";
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${color}`}
    >
      {score}
    </span>
  );
}

function ScanCard({
  scan,
  index,
  onView,
}: {
  scan: ScanResult;
  index: number;
  onView: (scan: ScanResult) => void;
}) {
  const score = Number(scan.overallScore);
  const cavityCount = scan.teeth.filter((t) => t.status === "cavity").length;
  const riskCount = scan.teeth.filter((t) => t.status === "risk").length;
  const date = new Date(
    Number(scan.timestamp / BigInt(1_000_000)),
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const markerIndex = index + 1;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="w-full glass-card rounded-3xl p-4 text-left flex items-center gap-4 hover:border-primary/40 transition-colors"
      onClick={() => onView(scan)}
      data-ocid={`history.item.${markerIndex}`}
    >
      <div className="circle-icon w-12 h-12 bg-primary/10 circle-glow-ring flex-shrink-0">
        <ClipboardList className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <ScoreChip score={score} />
          {cavityCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs text-red-400 border-red-500/40 rounded-full"
            >
              {cavityCount} {cavityCount === 1 ? "cavity" : "cavities"}
            </Badge>
          )}
          {riskCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs text-yellow-400 border-yellow-500/40 rounded-full"
            >
              {riskCount} at risk
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{date}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </motion.button>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const { setScanResult } = useScanContext();
  const { data: history, isLoading } = useScanHistory();

  const handleViewScan = (scan: ScanResult) => {
    setScanResult(scan);
    navigate({ to: "/results" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center gap-4 px-4 py-4 border-b border-border/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
          aria-label="Go back"
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Scan History</h1>
          <p className="text-xs text-muted-foreground">
            Your past dental scans
          </p>
        </div>
        {identity ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear()}
            data-ocid="history.secondary_button"
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
            data-ocid="history.secondary_button"
            className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Sign In
          </Button>
        )}
        <LogoCircle size="sm" />
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {!identity ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-20 text-center"
            data-ocid="history.empty_state"
          >
            <div className="circle-icon w-20 h-20 bg-primary/10 circle-glow-ring">
              <LogIn className="w-9 h-9 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Login Required</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                Sign in to access your scan history and track your dental health
                over time.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() => login()}
              data-ocid="history.primary_button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </motion.div>
        ) : isLoading ? (
          <div
            className="flex flex-col gap-3"
            data-ocid="history.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card rounded-3xl p-4 flex gap-4 items-center"
              >
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !history || history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-20 text-center"
            data-ocid="history.empty_state"
          >
            <div className="circle-icon w-20 h-20 bg-muted/50">
              <ClipboardList className="w-9 h-9 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">No Scans Yet</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                Complete your first dental scan to start tracking your oral
                health journey.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8 glow-primary"
              onClick={() => navigate({ to: "/scan" })}
              data-ocid="history.primary_button"
            >
              Start First Scan
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground mb-1 px-1">
              {history.length} scan{history.length !== 1 ? "s" : ""} recorded
            </p>
            {history.map((scan, i) => (
              <ScanCard
                key={Number(scan.timestamp)}
                scan={scan}
                index={i}
                onView={handleViewScan}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>
          © {new Date().getFullYear()} DantaNova.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-1">Developed by Swanandi Manoj Vispute</p>
      </footer>
    </div>
  );
}
