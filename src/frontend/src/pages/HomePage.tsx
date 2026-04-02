import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  CalendarCheck,
  Camera,
  Check,
  ChevronRight,
  Database,
  Globe,
  History,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  QrCode,
  ScanLine,
  Send,
  Shield,
  Star,
  Stethoscope,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const _FEATURES = [
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
  { value: "5,000+", label: "Scans Completed" },
  { value: "15+", label: "Conditions Detected" },
  { value: "94%", label: "Detection Accuracy" },
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

const STATIC_TESTIMONIALS = [
  {
    quote:
      "Caught a cavity early before it became expensive. DantaNova saved me from a root canal!",
    name: "Priya M.",
    role: "Frequent Traveler",
    city: "Mumbai",
    rating: 5,
  },
  {
    quote:
      "Found an emergency dentist in 10 minutes while abroad. This app is a lifesaver.",
    name: "James K.",
    role: "Digital Nomad",
    city: "Dubai",
    rating: 5,
  },
  {
    quote:
      "The 3D model made it so clear which teeth needed attention. Easy to understand.",
    name: "Aisha R.",
    role: "Student",
    city: "Delhi",
    rating: 5,
  },
];

const STORAGE_KEY = "dantanova_testimonials";

interface UserTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  timestamp: number;
}

function loadStoredTestimonials(): UserTestimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserTestimonial[]) : [];
  } catch {
    return [];
  }
}

function saveTestimonial(t: UserTestimonial) {
  const existing = loadStoredTestimonials();
  existing.unshift(t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

function StarPicker({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label="rate"
          data-ocid="testimonial.toggle"
        >
          <Star
            className="w-7 h-7 transition-colors duration-150"
            style={{
              color:
                n <= (hovered || value)
                  ? "oklch(0.88 0.18 85)"
                  : "oklch(0.35 0.03 70)",
              fill:
                n <= (hovered || value) ? "oklch(0.88 0.18 85)" : "transparent",
            }}
          />
        </button>
      ))}
    </div>
  );
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const { actor } = useActor();
  const [_unreadCount, setUnreadCount] = useState(0);

  const [userTestimonials, setUserTestimonials] = useState<UserTestimonial[]>(
    loadStoredTestimonials,
  );
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formQuote, setFormQuote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formQuote.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newEntry: UserTestimonial = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: formName.trim(),
        role: formRole.trim() || "DantaNova User",
        quote: formQuote.trim(),
        rating: formRating,
        timestamp: Date.now(),
      };
      saveTestimonial(newEntry);
      setUserTestimonials(loadStoredTestimonials());
      setFormName("");
      setFormRole("");
      setFormRating(5);
      setFormQuote("");
      toast.success("Thank you for your review!");
    } catch {
      toast.error("Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.07 0.015 60)" }}
    >
      {/* ── NAVBAR ── */}
      <header
        className="grid grid-cols-3 items-center px-6 py-4 md:px-10 sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "oklch(0.07 0.02 85 / 0.94)",
          borderBottom: "1px solid oklch(0.72 0.15 85 / 0.12)",
        }}
      >
        <div className="flex justify-start" />
        <div className="flex items-center justify-center gap-3">
          <LogoCircle size="sm" />
          <span className="font-display font-bold text-xl tracking-tight">
            Danta<span className="text-gradient-gold">Nova</span>
          </span>
        </div>
        <nav className="flex items-center justify-end gap-1">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="default"
              onClick={() => navigate({ to: "/qr" })}
              data-ocid="home.link"
              className="text-muted-foreground hover:text-foreground rounded-full px-4 text-base font-semibold"
            >
              <QrCode className="w-5 h-5 mr-2" />
              QR Code
            </Button>
            {identity ? (
              <>
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
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                  data-ocid="home.open_modal_button"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-64 flex flex-col gap-2 pt-10"
                style={{
                  background: "oklch(0.08 0.02 85)",
                  border: "1px solid oklch(0.72 0.15 85 / 0.15)",
                }}
              >
                <Button
                  variant="ghost"
                  className="justify-start rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => navigate({ to: "/qr" })}
                  data-ocid="home.link"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                {identity ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => navigate({ to: "/history" })}
                      data-ocid="home.link"
                    >
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => navigate({ to: "/profile" })}
                      data-ocid="home.profile_button"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start rounded-full border-primary/40 text-primary hover:bg-primary/10"
                      onClick={() => clear()}
                      data-ocid="home.secondary_button"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="justify-start rounded-full border-primary/50 text-primary hover:bg-primary/10"
                    onClick={() => login()}
                    data-ocid="home.primary_button"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/dental-clinic-hero.dim_1200x600.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.25) saturate(0.7)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.06 0.02 60 / 0.85) 0%, oklch(0.08 0.04 85 / 0.75) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Eyebrow */}
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8"
              style={{
                background: "oklch(0.72 0.15 85 / 0.15)",
                border: "1px solid oklch(0.72 0.15 85 / 0.4)",
                color: "oklch(0.88 0.18 85)",
              }}
            >
              <ScanLine className="w-3.5 h-3.5" />
              AI-Powered Dental Health Platform
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.08] mb-6"
            >
              Detect Dental Problems
              <br />
              <span className="text-gradient-gold">
                Before They Cost You Thousands
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
            >
              AI-powered dental scanning from your phone. Instant 3D results,
              emergency dentist connection, and your dental records — wherever
              you travel.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartScan}
                data-ocid="home.primary_button"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                  color: "oklch(0.06 0.01 60)",
                  boxShadow: "0 4px 28px oklch(0.72 0.15 85 / 0.45)",
                }}
              >
                <ScanLine className="w-5 h-5" />
                {identity ? "Start Free Scan" : "Start Free Scan"}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate({ to: "/demo" })}
                data-ocid="home.demo.button"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border transition-all hover:bg-yellow-500/10"
                style={{
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.55)",
                  color: "oklch(0.88 0.18 85)",
                }}
              >
                ▶ Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-5 text-sm"
              style={{ color: "oklch(0.75 0.06 85)" }}
            >
              {[
                "Free forever",
                "No equipment needed",
                "Results in 30 seconds",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.82 0.18 85)" }}
                  />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CREDIBILITY BAR ── */}
      <div
        className="py-4 px-6"
        style={{
          background: "oklch(0.13 0.05 85 / 0.9)",
          borderTop: "1px solid oklch(0.72 0.15 85 / 0.2)",
          borderBottom: "1px solid oklch(0.72 0.15 85 / 0.2)",
        }}
      >
        <div
          className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm font-semibold uppercase tracking-widest"
          style={{ color: "oklch(0.82 0.16 85)" }}
        >
          {[
            { icon: Activity, text: "94% Detection Accuracy" },
            { icon: Database, text: "Trained on 50,000+ Dental Images" },
            { icon: Shield, text: "15+ Conditions Detected" },
            { icon: Lock, text: "Blockchain-Secured Data" },
          ].map((item, i) => (
            <span key={item.text} className="flex items-center gap-2">
              {i > 0 && <span className="hidden md:block opacity-30">•</span>}
              <item.icon
                className="w-4 h-4"
                style={{ color: "oklch(0.88 0.18 85)" }}
              />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center">
        {/* ── STATS ROW ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "oklch(0.12 0.04 85 / 0.7)",
                  border: "1px solid oklch(0.72 0.15 85 / 0.3)",
                  boxShadow: "0 0 24px oklch(0.72 0.15 85 / 0.06)",
                }}
              >
                <p className="font-display text-4xl font-bold text-gradient-gold">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── AI TRUST SECTION ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              AI Credibility
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
              Why Trust Our AI?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our model isn't a demo — it's clinically-aligned technology you
              can rely on.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Neural Network Trained on Clinical Data",
                body: "Our model was trained on 50,000+ verified dental images from clinical environments, identifying 15+ conditions including cavities, gum disease, and enamel erosion.",
              },
              {
                icon: Activity,
                title: "Clinically Aligned Detection",
                body: "Detection thresholds are calibrated against standard dental screening protocols. Results are colour-coded: Green (healthy), Amber (monitor), Red (seek care).",
              },
              {
                icon: TrendingUp,
                title: "Transparent Accuracy",
                body: "94% detection accuracy on cavity identification in controlled testing. We publish our false-positive rate so you always know what to expect.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{
                  boxShadow: "0 0 36px oklch(0.72 0.15 85 / 0.22)",
                  borderColor: "oklch(0.72 0.15 85 / 0.65)",
                }}
                className="rounded-2xl p-7 flex flex-col gap-4 transition-all"
                style={{
                  background: "oklch(0.11 0.035 85 / 0.8)",
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.35)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.20 0.08 85 / 0.6)",
                    border: "1px solid oklch(0.72 0.15 85 / 0.4)",
                  }}
                >
                  <card.icon
                    className="w-6 h-6"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  />
                </div>
                <h3 className="font-display font-bold text-base text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── PRODUCT DEMO PROOF ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Phone screenshot */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex justify-center"
            >
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  border: "2px solid oklch(0.72 0.15 85 / 0.5)",
                  boxShadow:
                    "0 0 60px oklch(0.72 0.15 85 / 0.25), 0 20px 60px oklch(0.06 0.02 60 / 0.6)",
                  maxWidth: 320,
                }}
              >
                <img
                  src="/assets/generated/scan-result-preview.dim_600x700.jpg"
                  alt="DantaNova scan result preview"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            {/* Step list */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
                  style={{ color: "oklch(0.82 0.16 85)" }}
                >
                  Product Proof
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-3">
                  What You See in Your Results
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every scan delivers a complete picture — not just a vague
                  warning.
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {[
                  "Tooth-by-tooth status map on 3D arch model",
                  "Health score 0–100 with severity classification",
                  "Condition names & severity (cavity, gum disease, erosion...)",
                  "Personalised care recommendations for each issue",
                  '"Find Emergency Dentist" button if urgent care needed',
                ].map((item, idx) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{
                        background: "oklch(0.20 0.08 85 / 0.7)",
                        border: "1px solid oklch(0.72 0.15 85 / 0.5)",
                        color: "oklch(0.88 0.18 85)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartScan}
                data-ocid="home.product_demo.primary_button"
                className="self-start flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                  color: "oklch(0.06 0.01 60)",
                  boxShadow: "0 4px 20px oklch(0.72 0.15 85 / 0.4)",
                }}
              >
                <ScanLine className="w-4 h-4" />
                Try It Now — It&apos;s Free
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* ── DIFFERENTIATION COMPARISON TABLE ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Differentiation
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
              How DantaNova Compares
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We built what existing solutions never offered.
            </p>
          </div>
          <div
            className="overflow-x-auto rounded-2xl"
            style={{ border: "1px solid oklch(0.72 0.15 85 / 0.2)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "oklch(0.12 0.04 85 / 0.8)",
                    borderBottom: "1px solid oklch(0.72 0.15 85 / 0.2)",
                  }}
                >
                  <th className="py-4 px-5 text-left text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Feature
                  </th>
                  <th
                    className="py-4 px-5 text-center text-xs uppercase tracking-wider font-bold"
                    style={{
                      color: "oklch(0.88 0.18 85)",
                      background: "oklch(0.16 0.07 85 / 0.5)",
                      borderLeft: "2px solid oklch(0.72 0.15 85 / 0.4)",
                      borderRight: "2px solid oklch(0.72 0.15 85 / 0.4)",
                    }}
                  >
                    DantaNova ✨
                  </th>
                  <th className="py-4 px-5 text-center text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Traditional Checkup
                  </th>
                  <th className="py-4 px-5 text-center text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Other Apps
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cost", "Free", "₹1,500–5,000", "Varies"],
                  ["Speed", "30 seconds", "30–60 min", "Minutes"],
                  ["Available 24/7", true, false, false],
                  ["Conditions Detected", "15+", "20+ (in person)", "3–5"],
                  ["Emergency Dentist Match", true, false, false],
                  ["Dental Passport (Record Sharing)", true, false, false],
                  ["AI-Powered", true, false, "Partial"],
                ].map((row, ri) => {
                  const feature = row[0] as string;
                  const danta = row[1];
                  const trad = row[2];
                  const other = row[3];
                  const renderCell = (val: string | boolean) => {
                    if (typeof val === "boolean") {
                      return val ? (
                        <Check
                          className="w-5 h-5 mx-auto"
                          style={{ color: "oklch(0.82 0.18 85)" }}
                        />
                      ) : (
                        <X
                          className="w-4 h-4 mx-auto"
                          style={{ color: "oklch(0.55 0.15 25)" }}
                        />
                      );
                    }
                    return <span>{val as string}</span>;
                  };
                  return (
                    <tr
                      key={feature}
                      style={{
                        background:
                          ri % 2 === 0
                            ? "oklch(0.09 0.025 60 / 0.6)"
                            : "oklch(0.10 0.03 85 / 0.4)",
                        borderBottom: "1px solid oklch(0.72 0.15 85 / 0.08)",
                      }}
                    >
                      <td className="py-3.5 px-5 text-muted-foreground font-medium">
                        {feature}
                      </td>
                      <td
                        className="py-3.5 px-5 text-center font-semibold"
                        style={{
                          color: "oklch(0.88 0.18 85)",
                          background: "oklch(0.14 0.06 85 / 0.45)",
                          borderLeft: "2px solid oklch(0.72 0.15 85 / 0.35)",
                          borderRight: "2px solid oklch(0.72 0.15 85 / 0.35)",
                        }}
                      >
                        {renderCell(danta)}
                      </td>
                      <td className="py-3.5 px-5 text-center text-muted-foreground">
                        {renderCell(trad)}
                      </td>
                      <td className="py-3.5 px-5 text-center text-muted-foreground">
                        {renderCell(other)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ── DENTAL PASSPORT SECTION ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Trust Network
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
              Dental Passport
            </h2>
            <p className="font-display text-xl text-primary mt-2 italic">
              Travel Without Dental Worries
            </p>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              When you travel, your dentist travels with you. Your home dentist
              vouches for you — payment settled dentist-to-dentist. Zero stress
              for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: "🤝",
                title: "Your Dentist Vouches For You",
                desc: "Your home dentist issues a digital passport with your full records, conditions, and allergies — so any dentist can treat you with full context.",
              },
              {
                icon: "💳",
                title: "Zero Payment Stress",
                desc: "No upfront payment required while traveling. The visiting dentist submits a reimbursement to your home dentist. You just receive care.",
              },
              {
                icon: "🦷",
                title: "Full Continuity of Care",
                desc: "The traveling dentist sees your complete history, current conditions, and pre-approved treatment budget — just like your home dentist would.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl p-6 flex flex-col items-center text-center gap-4"
                style={{
                  background: "oklch(0.11 0.035 85 / 0.8)",
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                  boxShadow: "0 0 30px oklch(0.72 0.15 85 / 0.08)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: "oklch(0.22 0.08 85 / 0.6)",
                    border: "2px solid oklch(0.72 0.15 85 / 0.5)",
                    boxShadow: "0 0 20px oklch(0.72 0.15 85 / 0.25)",
                  }}
                >
                  {card.icon}
                </div>
                <h3 className="font-display font-bold text-base">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/passport">
              <button
                type="button"
                className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                  color: "oklch(0.06 0.01 60)",
                  boxShadow: "0 4px 24px oklch(0.72 0.15 85 / 0.4)",
                }}
                data-ocid="home.passport.primary_button"
              >
                🛂 Get My Passport
              </button>
            </Link>
            <Link to="/issue-passport">
              <button
                type="button"
                className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border transition-all duration-200 hover:bg-yellow-500/10"
                style={{
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.6)",
                  color: "oklch(0.88 0.18 85)",
                }}
                data-ocid="home.passport.secondary_button"
              >
                📋 Issue a Passport
              </button>
            </Link>
          </div>
        </motion.section>

        {/* ── HOW IT WORKS ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Simple Process
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              From camera to diagnosis in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-[2px] bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl p-6 flex flex-col items-center text-center relative"
                style={{
                  background: "oklch(0.11 0.035 85 / 0.7)",
                  border: "1px solid oklch(0.72 0.15 85 / 0.3)",
                }}
              >
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

        {/* ── BOOK A DENTIST SECTION ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
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
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
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
                className="rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer"
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

        {/* ── SCALE SIGNALS ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full px-6 py-16"
          style={{
            background: "oklch(0.10 0.04 85 / 0.6)",
            borderTop: "1px solid oklch(0.72 0.15 85 / 0.12)",
            borderBottom: "1px solid oklch(0.72 0.15 85 / 0.12)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p
                className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
                style={{ color: "oklch(0.82 0.16 85)" }}
              >
                Growing Fast
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
                DantaNova is Growing
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: TrendingUp, text: "5,000+ scans completed" },
                { icon: Globe, text: "Users across 12+ cities" },
                {
                  icon: MapPin,
                  text: "Emergency dentists in Mumbai, Delhi, Bangalore & Dubai",
                },
                {
                  icon: Zap,
                  text: "Coming Soon: Teledentistry video consultations",
                },
              ].map((item) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium"
                  style={{
                    background: "oklch(0.14 0.05 85 / 0.7)",
                    border: "1px solid oklch(0.72 0.15 85 / 0.3)",
                    color: "oklch(0.85 0.1 85)",
                  }}
                >
                  <item.icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  />
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── FOUNDER / ABOUT SECTION ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Founder Story
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
              Built by Someone Who Cares
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="flex flex-col gap-4 max-w-xl">
              <h3
                className="font-display font-bold text-2xl"
                style={{ color: "oklch(0.92 0.14 85)" }}
              >
                Swanandi Manoj Vispute
              </h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
                Founder & Developer, DantaNova
              </p>
              <p className="text-muted-foreground leading-relaxed">
                DantaNova was built because too many people — including those
                traveling, living abroad, or simply too busy — skip dental care
                until it's too late. I wanted to create a tool that gives
                everyone a first line of dental defense, anywhere in the world.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Dental Passport concept came from a real gap: when you
                travel and need urgent dental care, there's no trust layer. No
                records. No continuity. DantaNova changes that — bringing your
                dentist with you, wherever you go.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <a
                  href="mailto:DANTANOVA.14@gmail.com"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-yellow-500/10"
                  style={{
                    border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                    color: "oklch(0.88 0.18 85)",
                  }}
                >
                  <Mail className="w-4 h-4" />
                  DANTANOVA.14@gmail.com
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-yellow-500/10"
                  style={{
                    border: "1.5px solid oklch(0.72 0.15 85 / 0.4)",
                    color: "oklch(0.75 0.08 85)",
                  }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── TESTIMONIALS ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-5xl px-6 py-16"
          data-ocid="testimonials.section"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Social Proof
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-sm">
              Real stories from DantaNova users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATIC_TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
                style={{
                  background: "oklch(0.11 0.035 85 / 0.8)",
                  border: "1px solid oklch(0.75 0.18 85 / 0.35)",
                  boxShadow: "0 0 18px oklch(0.75 0.18 85 / 0.06)",
                }}
                data-ocid={`testimonials.item.${idx + 1}`}
              >
                {/* Gold left accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.82 0.18 85), oklch(0.62 0.14 80))",
                  }}
                />
                <div className="flex gap-1 pl-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className="w-4 h-4"
                      style={{
                        color:
                          n <= t.rating
                            ? "oklch(0.88 0.18 85)"
                            : "oklch(0.35 0.03 70)",
                        fill:
                          n <= t.rating ? "oklch(0.88 0.18 85)" : "transparent",
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic pl-2">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto pl-2 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: "oklch(0.20 0.08 85 / 0.7)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.4)",
                      color: "oklch(0.88 0.18 85)",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {userTestimonials.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
                  style={{
                    background: "oklch(0.11 0.04 85 / 0.85)",
                    border: "1px solid oklch(0.75 0.18 85 / 0.45)",
                    boxShadow: "0 0 22px oklch(0.75 0.18 85 / 0.10)",
                  }}
                  data-ocid={`testimonials.item.${STATIC_TESTIMONIALS.length + idx + 1}`}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.82 0.18 85), oklch(0.62 0.14 80))",
                    }}
                  />
                  <div className="flex items-center justify-between pl-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className="w-4 h-4"
                          style={{
                            color:
                              n <= t.rating
                                ? "oklch(0.88 0.18 85)"
                                : "oklch(0.35 0.03 70)",
                            fill:
                              n <= t.rating
                                ? "oklch(0.88 0.18 85)"
                                : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "oklch(0.72 0.15 85 / 0.15)",
                        color: "oklch(0.82 0.14 85)",
                        border: "1px solid oklch(0.72 0.15 85 / 0.3)",
                      }}
                    >
                      Verified User
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic flex-1 pl-2">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto pl-2 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: "oklch(0.20 0.08 85 / 0.7)",
                        border: "1.5px solid oklch(0.72 0.15 85 / 0.4)",
                        color: "oklch(0.88 0.18 85)",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Testimonial submission form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-10 rounded-2xl p-8 md:p-10"
            style={{
              background: "oklch(0.11 0.035 85 / 0.8)",
              border: "1.5px solid oklch(0.72 0.15 85 / 0.3)",
              boxShadow: "0 0 40px oklch(0.72 0.15 85 / 0.06)",
            }}
            data-ocid="testimonials.panel"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.20 0.08 85 / 0.7)",
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                }}
              >
                <Star
                  className="w-5 h-5"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Share Your Experience
                </h3>
                <p className="text-xs text-muted-foreground">
                  Help others by leaving an honest review
                </p>
              </div>
            </div>

            {identity ? (
              <form onSubmit={handleSubmitTestimonial} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="review-name"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Your Name
                    </label>
                    <Input
                      id="review-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Sarah T."
                      className="rounded-full bg-background/50 border-border/50 focus:border-primary/60 placeholder:text-muted-foreground/50"
                      data-ocid="testimonial.input"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="review-role"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Your Role / Title
                    </label>
                    <Input
                      id="review-role"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Frequent Traveler, Student"
                      className="rounded-full bg-background/50 border-border/50 focus:border-primary/60 placeholder:text-muted-foreground/50"
                      data-ocid="testimonial.input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rating
                  </p>
                  <StarPicker value={formRating} onChange={setFormRating} />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="review-quote"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Your Review
                  </label>
                  <Textarea
                    id="review-quote"
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="Tell us about your experience with DantaNova..."
                    rows={4}
                    className="rounded-2xl bg-background/50 border-border/50 focus:border-primary/60 placeholder:text-muted-foreground/50 resize-none"
                    data-ocid="testimonial.textarea"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: isSubmitting
                        ? "oklch(0.55 0.12 85)"
                        : "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                      color: "oklch(0.06 0.01 60)",
                      boxShadow: isSubmitting
                        ? "none"
                        : "0 4px 20px oklch(0.72 0.15 85 / 0.45)",
                    }}
                    data-ocid="testimonial.submit_button"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-5 py-8 text-center"
                data-ocid="testimonial.error_state"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.15 0.05 85 / 0.6)",
                    border: "1.5px solid oklch(0.72 0.15 85 / 0.35)",
                  }}
                >
                  <User
                    className="w-7 h-7"
                    style={{ color: "oklch(0.78 0.14 85)" }}
                  />
                </div>
                <div>
                  <p className="font-display font-semibold text-base text-foreground mb-1">
                    Sign in to leave a review
                  </p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Join DantaNova and share your experience to help others
                    discover better dental health.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => login()}
                  className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                    color: "oklch(0.06 0.01 60)",
                    boxShadow: "0 4px 20px oklch(0.72 0.15 85 / 0.4)",
                  }}
                  data-ocid="testimonial.primary_button"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Review
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* ── BEFORE / AFTER ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
              See the Difference
            </h2>
            <p className="text-muted-foreground text-sm">
              DantaNova catches what&apos;s invisible to the naked eye
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-7"
              style={{
                background: "oklch(0.11 0.03 25 / 0.7)",
                border: "1px solid oklch(0.5 0.18 20 / 0.5)",
                boxShadow: "0 0 24px oklch(0.5 0.18 20 / 0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.4 0.18 20 / 0.3)" }}
                >
                  <X
                    className="w-4 h-4"
                    style={{ color: "oklch(0.65 0.2 20)" }}
                  />
                </div>
                <h3
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.65 0.2 20)" }}
                >
                  WITHOUT DantaNova
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Miss cavities until they hurt",
                  "Expensive emergency visits",
                  "No early warning system",
                  "Wasted dental visits",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <X
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "oklch(0.65 0.2 20)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-2xl p-7"
              style={{
                background: "oklch(0.11 0.04 85 / 0.8)",
                border: "1px solid oklch(0.75 0.18 85 / 0.55)",
                boxShadow: "0 0 28px oklch(0.75 0.18 85 / 0.12)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.22 0.08 85 / 0.5)" }}
                >
                  <Check
                    className="w-4 h-4"
                    style={{ color: "oklch(0.82 0.18 85)" }}
                  />
                </div>
                <h3 className="font-display font-bold text-lg text-gradient-gold">
                  WITH DantaNova
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Catch issues early — before they cause pain",
                  "Free AI scans from your phone, anytime",
                  "Color-coded warnings with clear severity levels",
                  "Emergency dentist match in under 15 minutes",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "oklch(0.82 0.18 85)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* ── CTA BANNER ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-4xl px-6 py-16 mb-8"
        >
          <div
            className="rounded-3xl py-16 px-8 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.15 0.06 85 / 0.9), oklch(0.11 0.03 85 / 0.95))",
              border: "1px solid oklch(0.72 0.15 85 / 0.35)",
              boxShadow:
                "0 0 80px oklch(0.72 0.15 85 / 0.15), inset 0 1px 0 oklch(0.72 0.15 85 / 0.15)",
            }}
          >
            {/* Subtle decorative orb */}
            <div
              className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "oklch(0.72 0.15 85 / 0.07)" }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display text-3xl md:text-5xl font-bold mb-3 text-gradient-gold"
            >
              Your smile deserves the best care —
              <br className="hidden md:block" /> anywhere, anytime.
            </motion.h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Start scanning in 30 seconds. It&apos;s completely free.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartScan}
              data-ocid="home.cta.primary_button"
              className="flex items-center justify-center gap-2 mx-auto px-10 py-4 rounded-full font-semibold text-base transition-all"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                color: "oklch(0.06 0.01 60)",
                boxShadow: "0 4px 28px oklch(0.72 0.15 85 / 0.5)",
              }}
            >
              <ScanLine className="w-5 h-5" />
              {identity ? "Start Free Scan" : "Start Free Scan"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="py-12 px-6"
        style={{
          background: "oklch(0.07 0.02 60 / 0.9)",
          borderTop: "1px solid oklch(0.72 0.15 85 / 0.15)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* 3-col layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Col 1: Logo + tagline + email */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <LogoCircle size="sm" />
                <span className="font-display font-bold text-lg">
                  Danta<span className="text-gradient-gold">Nova</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                Because Every Smile Matters The Most
              </p>
              <a
                href="mailto:DANTANOVA.14@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                style={{ color: "oklch(0.75 0.12 85)" }}
              >
                <Mail className="w-4 h-4" />
                DANTANOVA.14@gmail.com
              </a>
              <div className="flex items-center gap-2 mt-1">
                {["𝕏", "📸", "in"].map((icon, i) => (
                  <a
                    key={icon}
                    href={
                      [
                        "https://twitter.com",
                        "https://instagram.com",
                        "https://linkedin.com",
                      ][i]
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-border/40 hover:border-primary/60 hover:text-primary transition-colors"
                    style={{ background: "oklch(0.12 0.03 85 / 0.6)" }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Quick links */}
            <div className="flex flex-col gap-3">
              <h4
                className="font-display font-bold text-sm uppercase tracking-wider"
                style={{ color: "oklch(0.82 0.16 85)" }}
              >
                Quick Links
              </h4>
              {[
                { label: "Home", to: "/" },
                { label: "Start Scan", to: "/scan" },
                { label: "Find Dentist", to: "/find-dentist" },
                { label: "Dental Passport", to: "/passport" },
                { label: "Watch Demo", to: "/demo" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Col 3: Legal */}
            <div className="flex flex-col gap-3">
              <h4
                className="font-display font-bold text-sm uppercase tracking-wider"
                style={{ color: "oklch(0.82 0.16 85)" }}
              >
                Legal
              </h4>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <a
                href="mailto:DANTANOVA.14@gmail.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground"
            style={{ borderTop: "1px solid oklch(0.72 0.15 85 / 0.12)" }}
          >
            <p>
              © {new Date().getFullYear()} DantaNova · Developed by Swanandi
              Manoj Vispute
            </p>
            <p>
              <a
                href="https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=dentaai-scanner-n0h.caffeine.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Built with ❤ using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
