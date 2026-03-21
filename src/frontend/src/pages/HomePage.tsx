import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  ChevronRight,
  History,
  LogIn,
  LogOut,
  QrCode,
  ScanLine,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "AI Cavity Detection",
    desc: "Deep learning models identify cavities, dark spots, and enamel erosion with clinical precision.",
  },
  {
    icon: Activity,
    title: "Gum Health Analysis",
    desc: "Detect early signs of gingivitis and gum recession before they become serious problems.",
  },
  {
    icon: Brain,
    title: "3D Arch Visualization",
    desc: "Color-coded 3D dental model maps every tooth's status for an instant full-mouth overview.",
  },
  {
    icon: Shield,
    title: "Plaque & Tartar Tracking",
    desc: "Track plaque buildup patterns over time and get personalized hygiene recommendations.",
  },
];

const stats = [
  { value: "32", label: "Teeth Analyzed" },
  { value: "6", label: "Conditions Detected" },
  { value: "~30s", label: "Scan Time" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();

  const handleStartScan = () => {
    if (identity) {
      navigate({ to: "/scan" });
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      {/* Header — three-column layout so logo is perfectly centered */}
      <header className="grid grid-cols-3 items-center px-6 py-4 md:px-10">
        {/* Left spacer */}
        <div className="flex justify-start">{/* intentional spacer */}</div>

        {/* Center: logo + brand name */}
        <div className="flex items-center justify-center gap-3">
          <LogoCircle size="sm" />
          <span className="font-display font-bold text-xl tracking-tight">
            Danta<span className="text-gradient-cyan">Nova</span>
          </span>
        </div>

        {/* Right: nav items */}
        <nav className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/qr" })}
            data-ocid="home.link"
            className="text-muted-foreground hover:text-foreground rounded-full px-4"
          >
            <QrCode className="w-4 h-4 mr-2" />
            QR Code
          </Button>
          {identity ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/history" })}
                data-ocid="home.link"
                className="text-muted-foreground hover:text-foreground rounded-full px-4"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/profile" })}
                data-ocid="home.profile_button"
                className="text-muted-foreground hover:text-foreground rounded-full px-4"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                data-ocid="home.secondary_button"
                className="rounded-full px-4 border-primary/40 text-primary hover:bg-primary/10"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => login()}
              data-ocid="home.primary_button"
              className="rounded-full px-4 border-primary/50 text-primary hover:bg-primary/10"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Sign In
            </Button>
          )}
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-2xl"
        >
          {/* Hero logo */}
          <div className="relative mb-6">
            <div className="absolute inset-[-20px] rounded-full border border-primary/10" />
            <div className="absolute inset-[-10px] rounded-full border border-primary/15" />
            <LogoCircle size="xl" animate />
            <div
              className="absolute inset-[-8px] rounded-full border border-primary/30"
              style={{ animation: "spin 8s linear infinite" }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-sm italic font-medium tracking-wide mb-8"
            style={{ color: "oklch(0.78 0.12 85)" }}
          >
            Because Every Smile Matters The Most
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              AI-Powered Dental Health
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-4">
              Know Your Teeth
              <br />
              <span className="text-gradient-cyan">
                Before It&apos;s Too Late
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Scan your mouth with your phone camera. Our AI detects cavities,
              gum disease, and early decay — visualized on a 3D dental arch
              model.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Button
              size="lg"
              className="text-base px-8 py-6 font-semibold glow-primary rounded-full"
              onClick={handleStartScan}
              data-ocid="home.primary_button"
            >
              <ScanLine className="w-5 h-5 mr-2" />
              {identity ? "Start Dental Scan" : "Sign In to Scan"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            {identity ? (
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-full border-border/60"
                onClick={() => navigate({ to: "/history" })}
                data-ocid="home.link"
              >
                <History className="w-5 h-5 mr-2" />
                View Scan History
              </Button>
            ) : null}
          </motion.div>

          {/* Sign in hint for unauthenticated users */}
          {!identity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-4"
            >
              <p className="text-xs text-muted-foreground">
                Sign in required to start a scan and save your reports.
              </p>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-12 text-center"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-3xl px-4 py-3 circle-glow-ring"
              >
                <p className="font-display text-2xl font-bold text-gradient-cyan">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-5xl w-full"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              className="glass-card rounded-3xl p-5"
            >
              <div className="circle-icon w-11 h-11 bg-primary/15 mb-3 circle-glow-ring">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-2">
                {f.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>
          © {new Date().getFullYear()} DantaNova. Built with love using{" "}
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
