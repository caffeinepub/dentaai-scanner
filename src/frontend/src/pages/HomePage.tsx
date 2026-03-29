import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  History,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  QrCode,
  ScanLine,
  Send,
  Shield,
  Star,
  Stethoscope,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const STATIC_TESTIMONIALS = [
  {
    quote:
      "Caught a cavity early before it became expensive. DantaNova saved me from a root canal!",
    name: "Priya M.",
    role: "Frequent Traveler",
    rating: 5,
  },
  {
    quote:
      "Found an emergency dentist in 10 minutes while abroad. This app is a lifesaver.",
    name: "James K.",
    role: "Digital Nomad",
    rating: 5,
  },
  {
    quote:
      "The 3D model made it so clear which teeth needed attention. Easy to understand.",
    name: "Aisha R.",
    role: "Student",
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

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const { actor } = useActor();
  const [unreadCount, setUnreadCount] = useState(0);

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

        {/* Dental Passport Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="mt-28 max-w-5xl w-full"
        >
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-2">
              Trust Network
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Dental Passport
            </h2>
            <p className="font-display text-xl md:text-2xl text-primary mt-2 italic">
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
                className="glass-card rounded-3xl p-6 flex flex-col items-center text-center gap-3"
                style={{
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

        {/* ── Testimonials Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-24 w-full max-w-5xl"
          data-ocid="testimonials.section"
        >
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-primary mb-2">
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
                className="glass-card rounded-3xl p-6 flex flex-col gap-4"
                style={{
                  border: "1px solid oklch(0.75 0.18 85 / 0.35)",
                  boxShadow: "0 0 18px oklch(0.75 0.18 85 / 0.08)",
                }}
                data-ocid={`testimonials.item.${idx + 1}`}
              >
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
                          n <= t.rating ? "oklch(0.88 0.18 85)" : "transparent",
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-sm text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
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
                  className="glass-card rounded-3xl p-6 flex flex-col gap-4"
                  style={{
                    border: "1px solid oklch(0.75 0.18 85 / 0.45)",
                    boxShadow:
                      "0 0 22px oklch(0.75 0.18 85 / 0.12), inset 0 1px 0 oklch(0.75 0.18 85 / 0.06)",
                  }}
                  data-ocid={`testimonials.item.${STATIC_TESTIMONIALS.length + idx + 1}`}
                >
                  <div className="flex items-center justify-between">
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
                  <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto">
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Share Your Experience Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-10 glass-card rounded-3xl p-8 md:p-10"
            style={{
              border: "1.5px solid oklch(0.72 0.15 85 / 0.3)",
              boxShadow:
                "0 0 40px oklch(0.72 0.15 85 / 0.08), inset 0 1px 0 oklch(0.72 0.15 85 / 0.07)",
            }}
            data-ocid="testimonials.panel"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.20 0.08 85 / 0.7)",
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                  boxShadow: "0 0 16px oklch(0.72 0.15 85 / 0.25)",
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

        {/* Before/After Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-24 w-full max-w-4xl"
        >
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-primary mb-2">
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
              className="glass-card rounded-3xl p-7"
              style={{
                border: "1px solid oklch(0.5 0.18 20 / 0.5)",
                boxShadow: "0 0 24px oklch(0.5 0.18 20 / 0.12)",
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
              className="glass-card rounded-3xl p-7"
              style={{
                border: "1px solid oklch(0.75 0.18 85 / 0.55)",
                boxShadow: "0 0 28px oklch(0.75 0.18 85 / 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.75 0.18 85 / 0.2)" }}
                >
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-primary">
                  WITH DantaNova
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Catch issues in seconds from home",
                  "Save thousands in treatment costs",
                  "3D visualization of every tooth",
                  "Connect with dentists instantly",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
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
