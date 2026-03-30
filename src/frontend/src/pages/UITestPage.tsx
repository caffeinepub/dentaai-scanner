import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useScanContext } from "@/context/ScanContext";
import type { ScanResult } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Bug,
  CheckCircle,
  ExternalLink,
  Info,
  Layers,
  Palette,
  Play,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Fake scan data factories ───────────────────────────────────────────────

function makeHealthyScan(): ScanResult {
  return {
    overallScore: BigInt(90),
    teeth: Array.from({ length: 32 }, (_, i) => ({
      number: BigInt(i + 1),
      status: "healthy" as const,
      condition: "Normal appearance",
      recommendation: "Continue regular brushing and flossing",
    })),
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  };
}

function makeModerateIssueScan(): ScanResult {
  const atRisk = new Set([3, 7, 14, 18]);
  return {
    overallScore: BigInt(55),
    teeth: Array.from({ length: 32 }, (_, i) => {
      const num = i + 1;
      const isRisk = atRisk.has(num);
      return {
        number: BigInt(num),
        status: isRisk ? ("risk" as const) : ("healthy" as const),
        condition: isRisk ? "Mild plaque buildup" : "Normal appearance",
        recommendation: isRisk
          ? "Schedule a dental cleaning"
          : "Continue regular brushing and flossing",
      };
    }),
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  };
}

function makeSevereIssueScan(): ScanResult {
  const cavities = new Set([3, 7, 14, 18]);
  const risks = new Set([5, 12, 21, 28]);
  return {
    overallScore: BigInt(22),
    teeth: Array.from({ length: 32 }, (_, i) => {
      const num = i + 1;
      if (cavities.has(num)) {
        return {
          number: BigInt(num),
          status: "cavity" as const,
          condition: "Active decay detected",
          recommendation: "Immediate dental treatment required",
        };
      }
      if (risks.has(num)) {
        return {
          number: BigInt(num),
          status: "risk" as const,
          condition: "Early signs of decay",
          recommendation: "Schedule urgent dental appointment",
        };
      }
      return {
        number: BigInt(num),
        status: "healthy" as const,
        condition: "Normal appearance",
        recommendation: "Continue regular brushing and flossing",
      };
    }),
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  };
}

// ─── Route map ───────────────────────────────────────────────────────────────

const ALL_ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/scan", label: "Scan" },
  { path: "/analysis", label: "Analysis" },
  { path: "/results", label: "Results" },
  { path: "/history", label: "History" },
  { path: "/find-dentist", label: "Find Dentist" },
  { path: "/dentist-register", label: "Dentist Register" },
  { path: "/dentist-dashboard", label: "Dentist Dashboard" },
  { path: "/book", label: "Book" },
  { path: "/my-bookings", label: "My Bookings" },
  { path: "/messages/test-booking-id", label: "Messages" },
  { path: "/passport", label: "Passport" },
  { path: "/issue-passport", label: "Issue Passport" },
  { path: "/passport-lookup", label: "Passport Lookup" },
  { path: "/qr", label: "QR Code" },
  { path: "/demo", label: "Demo" },
  { path: "/profile", label: "Profile" },
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Service" },
];

// ─── Color swatches ──────────────────────────────────────────────────────────

const COLOR_SWATCHES = [
  { label: "Primary (Gold)", bg: "oklch(0.78 0.16 80)", border: "" },
  {
    label: "Background",
    bg: "oklch(0.08 0.005 60)",
    border: "1px solid oklch(0.3 0.03 70 / 0.6)",
  },
  { label: "Card", bg: "oklch(0.12 0.008 60)", border: "" },
  { label: "Muted", bg: "oklch(0.16 0.01 60)", border: "" },
  { label: "Accent", bg: "oklch(0.72 0.18 75)", border: "" },
  { label: "Destructive", bg: "oklch(0.62 0.22 25)", border: "" },
  {
    label: "Border",
    bg: "oklch(0.3 0.03 70 / 0.6)",
    border: "1px solid oklch(0.5 0.05 70 / 0.4)",
  },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function UITestPage() {
  const { setScanResult } = useScanContext();
  const navigate = useNavigate();
  const [lsCount, setLsCount] = useState(0);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setLsCount(localStorage.length);
    setTimestamp(new Date().toISOString());
  }, []);

  function simulateAndNavigate(scan: ScanResult) {
    setScanResult(scan);
    navigate({ to: "/results" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30 sticky top-0 z-10 bg-background/90 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/" })}
          data-ocid="ui_test.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Bug className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-lg">
              UI Test &amp; Debug Panel
            </h1>
            <Badge className="text-[10px] px-2 py-0 rounded-full bg-primary/20 text-primary border border-primary/30">
              Dev Tools
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Route navigation, scan simulation, design tokens
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full">
        {/* ── Quick Navigation ── */}
        <Card className="glass-card border-border/40 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <ExternalLink className="w-4 h-4 text-primary" />
              Quick Navigation
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              All routes in the app — click to navigate
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_ROUTES.map((route) => (
                <Link
                  key={route.path}
                  to={route.path as "/"}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all min-h-[44px]"
                  data-ocid="ui_test.nav.link"
                >
                  <span className="text-primary opacity-60">/</span>
                  {route.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Simulate Scan Results ── */}
        <Card className="glass-card border-border/40 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <Play className="w-4 h-4 text-primary" />
              Simulate Scan Results
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Inject fake scan data and jump directly to Results page
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 rounded-full glow-primary font-semibold"
                onClick={() => simulateAndNavigate(makeHealthyScan())}
                data-ocid="ui_test.simulate_healthy.button"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Healthy (Score: 90)
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 font-semibold"
                onClick={() => simulateAndNavigate(makeModerateIssueScan())}
                data-ocid="ui_test.simulate_moderate.button"
              >
                <Activity className="w-4 h-4 mr-2" />
                Moderate (Score: 55)
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold"
                onClick={() => simulateAndNavigate(makeSevereIssueScan())}
                data-ocid="ui_test.simulate_severe.button"
              >
                <Zap className="w-4 h-4 mr-2" />
                Severe (Score: 22)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Healthy: all 32 teeth normal · Moderate: teeth 3, 7, 14, 18 at
              risk · Severe: teeth 3, 7, 14, 18 cavities + 5, 12, 21, 28 at risk
            </p>
          </CardContent>
        </Card>

        {/* ── Design System ── */}
        <Card className="glass-card border-border/40 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <Palette className="w-4 h-4 text-primary" />
              Design System
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {/* Color swatches */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Color Tokens
              </p>
              <div className="flex flex-wrap gap-3">
                {COLOR_SWATCHES.map((swatch) => (
                  <div
                    key={swatch.label}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        background: swatch.bg,
                        border: swatch.border || undefined,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground text-center max-w-[64px] leading-tight">
                      {swatch.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Button variants */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Button Variants
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="rounded-full glow-primary"
                  data-ocid="ui_test.ds_primary.button"
                >
                  Primary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-primary/40 text-primary"
                  data-ocid="ui_test.ds_outline.button"
                >
                  Outline
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  data-ocid="ui_test.ds_ghost.button"
                >
                  Ghost
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="rounded-full"
                  data-ocid="ui_test.ds_delete.button"
                >
                  Destructive
                </Button>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Status badges */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Status Badges
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-green-500/15 text-green-400 border border-green-500/30 px-3">
                  Healthy
                </Badge>
                <Badge className="rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-3">
                  Risk
                </Badge>
                <Badge className="rounded-full bg-red-500/15 text-red-400 border border-red-500/30 px-3">
                  Cavity
                </Badge>
                <Badge className="rounded-full bg-primary/15 text-primary border border-primary/30 px-3">
                  Primary
                </Badge>
                <Badge variant="outline" className="rounded-full px-3">
                  Outline
                </Badge>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Status indicators */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Status Indicators
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Healthy", color: "bg-green-400" },
                  { label: "Risk", color: "bg-yellow-400" },
                  { label: "Cavity", color: "bg-red-400" },
                  { label: "Loading", color: "bg-blue-400" },
                  { label: "Inactive", color: "bg-muted-foreground" },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Typography */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Typography
              </p>
              <div className="space-y-1">
                <p className="font-display text-3xl font-bold text-gradient-gold">
                  Display Heading
                </p>
                <p className="font-display text-xl font-semibold">
                  Section Title (Bricolage)
                </p>
                <p className="text-base">
                  Body text (Satoshi) — normal weight, optimum readability
                </p>
                <p className="text-sm text-muted-foreground">
                  Muted helper text — secondary information
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  Label / Eyebrow — overline
                </p>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Glass card demo */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Glass Card
              </p>
              <div className="glass-card rounded-3xl p-4">
                <p className="text-sm font-semibold">Glass Card Component</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Background blur + semi-transparent gold border at 0.6 opacity
                  + inner highlight
                </p>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Layer depth demo */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Layer Stacking
              </p>
              <div className="relative h-20 w-40">
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "oklch(0.12 0.008 60)",
                    border: "1px solid oklch(0.3 0.03 70 / 0.6)",
                  }}
                />
                <div
                  className="absolute inset-2 rounded-xl"
                  style={{
                    background: "oklch(0.18 0.015 60)",
                    border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                  }}
                />
                <div
                  className="absolute inset-4 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.78 0.16 80 / 0.15)" }}
                >
                  <Layers className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── System Info ── */}
        <Card className="glass-card border-border/40 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <Info className="w-4 h-4 text-primary" />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4 text-xs">
                <span className="text-muted-foreground flex-shrink-0">
                  Current URL
                </span>
                <span className="font-mono text-primary break-all text-right">
                  {typeof window !== "undefined" ? window.location.href : ""}
                </span>
              </div>
              <Separator className="bg-border/30" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  localStorage items
                </span>
                <span className="font-mono text-foreground">{lsCount}</span>
              </div>
              <Separator className="bg-border/30" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Page load timestamp
                </span>
                <span className="font-mono text-foreground">{timestamp}</span>
              </div>
              <Separator className="bg-border/30" />
              <div className="flex items-start justify-between gap-4 text-xs">
                <span className="text-muted-foreground flex-shrink-0">
                  localStorage keys
                </span>
                <div className="flex flex-col items-end gap-1">
                  {typeof window !== "undefined" && localStorage.length > 0 ? (
                    Array.from({ length: localStorage.length }, (_, i) =>
                      localStorage.key(i),
                    ).map((k) => (
                      <span
                        key={k}
                        className="font-mono text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full"
                      >
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">empty</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <p className="mt-1">
          <a
            href="mailto:dantanova@gmail.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            dantanova@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
