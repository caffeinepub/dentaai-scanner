import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Brain,
  CalendarCheck,
  Camera,
  ChevronRight,
  History,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  QrCode,
  ScanLine,
  Shield,
  Stethoscope,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

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

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Camera,
    title: "Open Camera",
    desc: "Point your phone camera at your teeth. No special equipment needed — just good lighting.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analyzes",
    desc: "Our neural network scans each of your 32 teeth individually, identifying subtle signs of decay.",
  },
  {
    step: "03",
    icon: Zap,
    title: "Get Results",
    desc: "Receive a full 3D color-coded arch report in seconds with actionable recommendations.",
  },
];

const WHY_DANTANOVA = [
  {
    icon: Stethoscope,
    text: "No dentist visit needed for initial screening — scan from anywhere, anytime.",
  },
  {
    icon: Activity,
    text: "Early detection saves thousands in treatment costs by catching issues before they escalate.",
  },
  {
    icon: Lock,
    text: "Secure and private — your scan data is encrypted and stored on the blockchain, not sold.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const { actor } = useActor();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!actor || !identity) return;
    actor
      .getUnreadMessageCount()
      .then((count) => setUnreadCount(Number(count)))
      .catch(() => {});
  }, [actor, identity]);

  const handleStartScan = () => {
    if (identity) {
      navigate({ to: "/scan" });
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-4 md:px-10">
        <div className="flex justify-start" />

        <div className="flex items-center justify-center gap-3">
          <LogoCircle size="sm" />
          <span className="font-display font-bold text-xl tracking-tight">
            Danta<span className="text-gradient-cyan">Nova</span>
          </span>
        </div>

        <nav className="flex items-center justify-end gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/qr" })}
            data-ocid="home.link"
            className="text-muted-foreground hover:text-foreground rounded-full px-3"
          >
            <QrCode className="w-4 h-4 mr-1.5" />
            QR
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/find-dentist" })}
            data-ocid="home.find_dentist.link"
            className="text-muted-foreground hover:text-yellow-400 rounded-full px-3"
          >
            <MapPin className="w-4 h-4 mr-1.5" />
            Dentist
          </Button>
          {identity ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/my-bookings" })}
                data-ocid="home.link"
                className="text-muted-foreground hover:text-foreground rounded-full px-3 relative"
              >
                <CalendarCheck className="w-4 h-4 mr-1.5" />
                Bookings
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-500 text-black text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/history" })}
                data-ocid="home.link"
                className="text-muted-foreground hover:text-foreground rounded-full px-3"
              >
                <History className="w-4 h-4 mr-1.5" />
                History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/profile" })}
                data-ocid="home.profile_button"
                className="text-muted-foreground hover:text-foreground rounded-full px-3"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                data-ocid="home.secondary_button"
                className="rounded-full px-3 border-primary/40 text-primary hover:bg-primary/10"
              >
                <LogOut className="w-4 h-4" />
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
      <main className="flex-1 flex flex-col items-center px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-2xl w-full"
        >
          <div className="relative mb-6">
            <div className="absolute inset-[-20px] rounded-full border border-primary/10" />
            <div className="absolute inset-[-10px] rounded-full border border-primary/15" />
            <LogoCircle size="xl" animate />
            <div
              className="absolute inset-[-8px] rounded-full border border-primary/30"
              style={{ animation: "spin 8s linear infinite" }}
            />
          </div>

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
            className="flex flex-col sm:flex-row gap-4 mt-10 flex-wrap justify-center"
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
                Scan History
              </Button>
            ) : null}
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 rounded-full border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => navigate({ to: "/find-dentist" })}
              data-ocid="home.find_dentist.button"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Find Emergency Dentist
            </Button>
          </motion.div>

          {/* Dentist / bookings quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
          >
            {identity ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-yellow-400 rounded-full"
                onClick={() => navigate({ to: "/my-bookings" })}
                data-ocid="home.link"
              >
                <CalendarCheck className="w-4 h-4 mr-1.5" />
                My Bookings
                {unreadCount > 0 && (
                  <span className="ml-1.5 w-4 h-4 rounded-full bg-yellow-500 text-black text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sign in required to start a scan and save your reports.
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-muted-foreground hover:text-yellow-400 rounded-full"
              onClick={() => navigate({ to: "/dentist-register" })}
              data-ocid="home.link"
            >
              <Stethoscope className="w-4 h-4 mr-1.5" />
              Are you a dentist? Register here
            </Button>
          </motion.div>

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

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-28 max-w-5xl w-full"
        >
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-2">
              Simple Process
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              From camera to diagnosis in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-[2px] bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card rounded-3xl p-6 flex flex-col items-center text-center relative"
              >
                {/* Step number circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4 font-display font-bold text-lg relative z-10"
                  style={{
                    background: "oklch(0.22 0.08 85 / 0.9)",
                    border: "2px solid oklch(0.72 0.15 85 / 0.6)",
                    boxShadow: "0 0 20px oklch(0.72 0.15 85 / 0.3)",
                    color: "oklch(0.88 0.18 85)",
                  }}
                >
                  {step.step}
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "oklch(0.18 0.05 85 / 0.6)" }}
                >
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Book a Dentist Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="mt-28 max-w-5xl w-full"
        >
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-2">
              Dental Care Network
            </p>
            <h2
              className="font-display text-4xl md:text-6xl font-bold bg-clip-text text-transparent mb-4"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.15 85), oklch(0.95 0.12 85))",
              }}
            >
              Book a Dentist
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-lg">
              Emergency dental care, real bookings — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CalendarCheck,
                title: "Book an Appointment",
                desc: "Enter a dentist's booking code to see real availability and confirm your appointment instantly.",
                cta: "Book Now",
                route: "/book",
                delay: 0,
              },
              {
                icon: MapPin,
                title: "Find Emergency Dentist",
                desc: "Browse verified local dentists available for urgent care, filter by urgency level.",
                cta: "Find Dentist",
                route: "/find-dentist",
                delay: 0.15,
              },
              {
                icon: Stethoscope,
                title: "Register as Dentist",
                desc: "Join DantaNova as a verified dentist — set your availability and start receiving patient bookings.",
                cta: "Register",
                route: "/dentist-register",
                delay: 0.3,
              },
            ].map((card) => (
              <motion.div
                key={card.route}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: card.delay, duration: 0.55 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate({ to: card.route })}
                className="glass-card rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer"
                style={{
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.45)",
                  boxShadow:
                    "0 0 32px oklch(0.72 0.15 85 / 0.12), inset 0 1px 0 oklch(0.72 0.15 85 / 0.08)",
                  background:
                    "linear-gradient(145deg, oklch(0.12 0.04 85 / 0.85), oklch(0.08 0.02 85 / 0.95))",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: "oklch(0.18 0.06 85 / 0.7)",
                    border: "2px solid oklch(0.72 0.15 85 / 0.6)",
                    boxShadow: "0 0 28px oklch(0.72 0.15 85 / 0.35)",
                  }}
                >
                  <card.icon
                    className="w-10 h-10"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  />
                </div>
                <h3
                  className="font-display font-bold text-2xl md:text-3xl mb-3"
                  style={{ color: "oklch(0.92 0.14 85)" }}
                >
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  {card.desc}
                </p>
                <button
                  type="button"
                  className="w-full py-3 rounded-full font-semibold text-base transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.15 85), oklch(0.62 0.14 85))",
                    color: "oklch(0.08 0.02 85)",
                    boxShadow: "0 4px 20px oklch(0.72 0.15 85 / 0.4)",
                  }}
                >
                  {card.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose DantaNova */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-24 max-w-5xl w-full"
        >
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-2">
              Our Advantage
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Why Choose DantaNova?
            </h2>
          </div>

          <div
            className="rounded-3xl p-8 md:p-10"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.13 0.04 85 / 0.95), oklch(0.10 0.02 85 / 0.95))",
              border: "1px solid oklch(0.72 0.15 85 / 0.2)",
              boxShadow:
                "0 0 40px oklch(0.72 0.15 85 / 0.08), inset 0 1px 0 oklch(0.72 0.15 85 / 0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_DANTANOVA.map((item, i) => (
                <motion.div
                  key={item.icon.displayName ?? String(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center md:items-start gap-4 text-center md:text-left"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "oklch(0.20 0.08 85 / 0.8)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.4)",
                      boxShadow: "0 0 16px oklch(0.72 0.15 85 / 0.2)",
                    }}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Banner */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mt-24 mb-8 max-w-3xl w-full text-center"
        >
          <div
            className="rounded-3xl py-14 px-8"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.15 0.06 85 / 0.9), oklch(0.11 0.03 85 / 0.95))",
              border: "1px solid oklch(0.72 0.15 85 / 0.3)",
              boxShadow:
                "0 0 60px oklch(0.72 0.15 85 / 0.12), inset 0 1px 0 oklch(0.72 0.15 85 / 0.15)",
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display text-3xl md:text-5xl font-bold mb-3"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.88 0.18 85), oklch(0.78 0.14 75), oklch(0.88 0.18 85))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Early detection.
              <br />
              Healthier smiles.
            </motion.h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Join thousands who caught dental issues early — and saved their
              smiles.
            </p>
            <Button
              size="lg"
              className="text-base px-10 py-6 font-semibold glow-primary rounded-full"
              onClick={handleStartScan}
              data-ocid="home.cta.primary_button"
            >
              <ScanLine className="w-5 h-5 mr-2" />
              {identity ? "Start Dental Scan" : "Sign In to Scan"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.section>
      </main>

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
