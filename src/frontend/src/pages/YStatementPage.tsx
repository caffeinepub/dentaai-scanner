import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Clock,
  Play,
  Scan,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

const metrics = [
  { icon: TrendingUp, value: "5,000+", label: "Scans Analyzed" },
  { icon: Target, value: "94%", label: "Detection Accuracy" },
  { icon: Activity, value: "15+", label: "Conditions Detected" },
  { icon: Clock, value: "<15 min", label: "Emergency Match Time" },
];

const differentiators = [
  {
    emoji: "🦷",
    title: "AI Scan at Home",
    description:
      "Detect cavities, gum disease, and 15+ conditions using just your phone camera — no clinic visit needed.",
  },
  {
    emoji: "🚨",
    title: "Emergency-First Matching",
    description:
      "Unlike ZocDoc or directories, DantaNova is purpose-built for urgent care — matching you to an available dentist in under 15 minutes.",
  },
  {
    emoji: "🛂",
    title: "Dental Passport",
    description:
      "The world's first dentist-to-dentist trust-transfer network. Your records, budget, and history travel with you — globally.",
  },
  {
    emoji: "💸",
    title: "No Upfront Payment Abroad",
    description:
      "Payment is settled dentist-to-dentist. Patients never pay out-of-pocket while traveling — a problem no competitor has solved.",
  },
];

const yParts = [
  {
    label: "We help",
    content: "patients experiencing dental pain or uncertainty",
    color: "oklch(0.82 0.18 85)",
  },
  {
    label: "to",
    content:
      "detect dental problems early, find emergency dentists instantly, and carry their dental history anywhere in the world",
    color: "oklch(0.75 0.14 85)",
  },
  {
    label: "by",
    content:
      "combining AI-powered tooth scanning, real-time verified dentist matching, and a Dental Passport trust-transfer network — all in one free platform",
    color: "oklch(0.70 0.12 85)",
  },
  {
    label: "so that",
    content:
      "no one ever has to suffer through a dental emergency alone, overpay for care while traveling, or show up to a new dentist with zero context",
    color: "oklch(0.88 0.20 85)",
  },
];

export default function YStatementPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.01 85)" }}
      data-ocid="pitch.page"
    >
      {/* Header nav */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "oklch(0.08 0.01 85 / 0.9)",
          borderColor: "oklch(0.72 0.15 85 / 0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
          style={{ color: "oklch(0.88 0.18 85)" }}
          data-ocid="pitch.home.link"
        >
          🦷 DantaNova
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/scan" })}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: "oklch(0.72 0.18 85)",
              color: "oklch(0.08 0.01 85)",
            }}
            data-ocid="pitch.scan.button"
          >
            Try Free Scan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border mb-2"
            style={{
              borderColor: "oklch(0.72 0.18 85 / 0.4)",
              color: "oklch(0.82 0.18 85)",
              background: "oklch(0.72 0.18 85 / 0.08)",
            }}
          >
            Y Statement
          </div>
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight leading-none"
            style={{ color: "oklch(0.97 0.03 85)" }}
          >
            Our Pitch
          </h1>
          <p
            className="text-base md:text-lg italic"
            style={{ color: "oklch(0.65 0.08 85)" }}
          >
            Because Every Smile Matters The Most
          </p>
        </motion.div>

        {/* Y Statement Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1.5px solid oklch(0.72 0.18 85 / 0.3)",
            background:
              "linear-gradient(135deg, oklch(0.12 0.02 85 / 0.9), oklch(0.10 0.01 85))",
            boxShadow: "0 0 60px oklch(0.72 0.18 85 / 0.06)",
          }}
          data-ocid="pitch.statement.card"
        >
          <div
            className="px-6 py-4 border-b"
            style={{
              borderColor: "oklch(0.72 0.18 85 / 0.15)",
              background: "oklch(0.72 0.18 85 / 0.05)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.72 0.18 85)" }}
            >
              The Y Combinator-Style Statement
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-0">
            {yParts.map((part, i) => (
              <motion.div
                key={part.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex gap-4 md:gap-6 py-5 border-b last:border-b-0"
                style={{ borderColor: "oklch(0.72 0.18 85 / 0.1)" }}
              >
                <div className="pt-0.5 shrink-0 w-20 md:w-24">
                  <span
                    className="text-xs font-black uppercase tracking-widest"
                    style={{ color: part.color }}
                  >
                    {part.label}
                  </span>
                </div>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: "oklch(0.92 0.04 85)" }}
                >
                  {part.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
          data-ocid="pitch.metrics.section"
        >
          <h2
            className="text-2xl font-black text-center uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.18 85)" }}
          >
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                className="rounded-xl p-5 text-center space-y-2"
                style={{
                  background: "oklch(0.13 0.02 85)",
                  border: "1px solid oklch(0.72 0.18 85 / 0.2)",
                }}
              >
                <m.icon
                  className="w-5 h-5 mx-auto"
                  style={{ color: "oklch(0.72 0.18 85)" }}
                />
                <div
                  className="text-3xl font-black tracking-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.88 0.20 85), oklch(0.65 0.14 85))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {m.value}
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.65 0.07 85)" }}
                >
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-6"
          data-ocid="pitch.differentiators.section"
        >
          <h2
            className="text-2xl font-black text-center uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.18 85)" }}
          >
            Why DantaNova and Not a Competitor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl p-6 space-y-3"
                style={{
                  background: "oklch(0.12 0.02 85)",
                  border: "1px solid oklch(0.72 0.18 85 / 0.2)",
                }}
                data-ocid={`pitch.differentiators.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{d.emoji}</span>
                  <h3
                    className="font-bold text-base"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  >
                    {d.title}
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.72 0.06 85)" }}
                >
                  {d.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* One-liner quote */}
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.18 85 / 0.12), oklch(0.72 0.18 85 / 0.04))",
            border: "1.5px solid oklch(0.72 0.18 85 / 0.35)",
          }}
          data-ocid="pitch.quote.section"
        >
          <div
            className="absolute top-4 left-6 text-6xl font-serif leading-none select-none"
            style={{ color: "oklch(0.72 0.18 85 / 0.2)" }}
          >
            &ldquo;
          </div>
          <p
            className="relative text-lg md:text-xl font-semibold leading-relaxed italic"
            style={{ color: "oklch(0.92 0.08 85)" }}
          >
            DantaNova is the only platform that scans your teeth, finds you an
            emergency dentist, and ensures your records and budget travel with
            you — anywhere in the world.
          </p>
          <div
            className="absolute bottom-4 right-6 text-6xl font-serif leading-none select-none"
            style={{ color: "oklch(0.72 0.18 85 / 0.2)" }}
          >
            &rdquo;
          </div>
        </motion.blockquote>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          data-ocid="pitch.cta.section"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate({ to: "/scan" })}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.65 0.16 85))",
              color: "oklch(0.08 0.01 85)",
              boxShadow: "0 4px 24px oklch(0.72 0.18 85 / 0.3)",
            }}
            data-ocid="pitch.scan.primary_button"
          >
            <Scan className="w-4 h-4" />
            Try Free Scan
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate({ to: "/demo" })}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base border transition-all"
            style={{
              border: "1.5px solid oklch(0.72 0.15 85 / 0.55)",
              color: "oklch(0.88 0.18 85)",
            }}
            data-ocid="pitch.demo.button"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Footer tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-center text-sm pb-8"
          style={{ color: "oklch(0.50 0.05 85)" }}
        >
          © {new Date().getFullYear()} DantaNova · Because Every Smile Matters
          The Most
        </motion.p>
      </div>
    </div>
  );
}
