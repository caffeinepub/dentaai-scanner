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
  AlertTriangle,
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
import { useEffect, useRef, useState } from "react";
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
  {
    step: "04",
    icon: CalendarCheck,
    title: "Book a Dentist if Needed",
    desc: "If issues are detected, connect to a verified emergency dentist near you — in minutes.",
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
  {
    quote:
      "I was skeptical at first, but the scan detected early gum inflammation I had no idea about. My dentist confirmed it. Truly impressive!",
    name: "Rahul S.",
    role: "Software Engineer",
    city: "Bengaluru",
    rating: 5,
  },
  {
    quote:
      "Dental Passport saved me so much stress while traveling in Europe. My dentist records were instantly shared and I got treated without paying upfront.",
    name: "Meera T.",
    role: "International Student",
    city: "London",
    rating: 5,
  },
  {
    quote:
      "As a dentist myself, I'm impressed by the accuracy of the AI triage. Patients come in better prepared after using DantaNova.",
    name: "Dr. Ankit V.",
    role: "Dentist",
    city: "Pune",
    rating: 5,
  },
  {
    quote:
      "Booked an emergency appointment in under 15 minutes when I had a cracked tooth. The urgency filter is brilliant.",
    name: "Fatima H.",
    role: "Expat Professional",
    city: "Abu Dhabi",
    rating: 5,
  },
  {
    quote:
      "Finally an app that makes dental care less scary. The color-coded 3D teeth are so easy to understand even for my elderly parents.",
    name: "Neha P.",
    role: "Working Mother",
    city: "Chennai",
    rating: 5,
  },
  {
    quote:
      "Used DantaNova before a long trek in the Himalayas to make sure I had no hidden dental issues. Gave me complete peace of mind.",
    name: "Vikram R.",
    role: "Adventure Traveler",
    city: "Jaipur",
    rating: 5,
  },
  {
    quote:
      "The platform is smooth, fast, and incredibly intuitive. My students now use it as part of our oral hygiene curriculum.",
    name: "Dr. Sunita K.",
    role: "Health Educator",
    city: "Hyderabad",
    rating: 5,
  },
  {
    quote:
      "I referred three colleagues to DantaNova. The dental passport concept is a game-changer for people who travel for work like us.",
    name: "Carlos M.",
    role: "Corporate Consultant",
    city: "Singapore",
    rating: 5,
  },
  {
    quote:
      "Got results in seconds, and the recommendation to see a dentist for Tooth 14 turned out to be a small cavity caught just in time.",
    name: "Sana A.",
    role: "University Student",
    city: "Kolkata",
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

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 28;
    interface Particle {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      alphaDir: number;
    }
    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.45,
        alpha: 0.15 + Math.random() * 0.5,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
      }),
    );

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir * 0.004;
        if (p.alpha > 0.65 || p.alpha < 0.08) p.alphaDir *= -1;
        if (p.y < -10) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 5;
        if (p.x > width + 10) p.x = -5;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `rgba(229, 195, 80, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(210, 160, 40, ${p.alpha * 0.55})`);
        grad.addColorStop(1, "rgba(200, 140, 20, 0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 100, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function IronManHUD() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let scanY = 0;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      const w = canvas.width;
      const h = canvas.height;

      // Animated scan line (neon blue)
      scanY = (scanY + 1.5) % h;
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, "rgba(0, 209, 255, 0)");
      grad.addColorStop(0.5, "rgba(0, 209, 255, 0.35)");
      grad.addColorStop(1, "rgba(0, 209, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, w, 60);

      // Bright scan line
      ctx.strokeStyle = "rgba(0, 209, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      // Corner HUD brackets
      const bSize = 24;
      const bGap = 12;
      ctx.strokeStyle = "rgba(0, 209, 255, 0.7)";
      ctx.lineWidth = 2;

      const corners = [
        [bGap, bGap, 1, 1],
        [w - bGap, bGap, -1, 1],
        [bGap, h - bGap, 1, -1],
        [w - bGap, h - bGap, -1, -1],
      ] as const;

      for (const [cx, cy, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx + dx * bSize, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * bSize);
        ctx.stroke();
      }

      // Circular reticle at center
      const cx = w / 2;
      const cy = h * 0.42;

      // Outer ring (rotating)
      ctx.strokeStyle = `rgba(0, 209, 255, ${0.15 + Math.sin(time * 2) * 0.05})`;
      ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.3);
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Inner ring (counter-rotating)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.5);
      ctx.strokeStyle = `rgba(123, 97, 255, ${0.2 + Math.sin(time * 3) * 0.08})`;
      ctx.setLineDash([2, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Crosshair lines
      ctx.strokeStyle = "rgba(0, 209, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 130, cy);
      ctx.lineTo(cx + 130, cy);
      ctx.moveTo(cx, cy - 130);
      ctx.lineTo(cx, cy + 130);
      ctx.stroke();

      // HUD data text (top-left)
      ctx.fillStyle = "rgba(0, 209, 255, 0.55)";
      ctx.font = "10px monospace";
      ctx.fillText("AI SCAN ACTIVE", bGap + 2, bGap + bSize + 16);
      ctx.fillStyle = "rgba(0, 209, 255, 0.3)";
      ctx.fillText(
        `FRAME: ${Math.floor(time * 60)
          .toString()
          .padStart(6, "0")}`,
        bGap + 2,
        bGap + bSize + 32,
      );
      ctx.fillText("SIGNAL: ████████░░ 82%", bGap + 2, bGap + bSize + 48);

      // HUD data text (top-right)
      const txt = ["NEURAL NET: READY", "TEETH: 32/32", "STATUS: ANALYZING"];
      for (let i = 0; i < txt.length; i++) {
        ctx.fillStyle =
          i === 2
            ? `rgba(0, 209, 255, ${0.4 + Math.sin(time * 4 + i) * 0.2})`
            : "rgba(0, 209, 255, 0.3)";
        const m = ctx.measureText(txt[i]);
        ctx.fillText(
          txt[i],
          w - bGap - m.width - 2,
          bGap + bSize + 16 + i * 16,
        );
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4 }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function NeuralNetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      pulsePhase: number;
      active: boolean;
    }

    const NODE_COUNT = 28;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 3,
      pulsePhase: Math.random() * Math.PI * 2,
      active: Math.random() > 0.4,
    }));

    let time = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.018;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        if (Math.random() < 0.002) n.active = !n.active;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.35;
            const bothActive = nodes[i].active && nodes[j].active;
            if (bothActive) {
              ctx.strokeStyle = `rgba(0, 209, 255, ${alpha * 0.8})`;
              ctx.lineWidth = 0.8;
            } else {
              ctx.strokeStyle = `rgba(123, 97, 255, ${alpha * 0.3})`;
              ctx.lineWidth = 0.5;
            }
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            if (bothActive && dist < 80) {
              const t2 = (time * 2) % 1;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t2;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t2;
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(0, 209, 255, 0.9)";
              ctx.fill();
            }
          }
        }
      }

      for (const n of nodes) {
        const pulse = Math.sin(time * 3 + n.pulsePhase) * 0.5 + 0.5;
        if (n.active) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
          grd.addColorStop(0, `rgba(0, 209, 255, ${0.6 + pulse * 0.4})`);
          grd.addColorStop(0.4, `rgba(0, 209, 255, ${0.2 + pulse * 0.1})`);
          grd.addColorStop(1, "rgba(0, 209, 255, 0)");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 209, 255, ${0.8 + pulse * 0.2})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(123, 97, 255, ${0.3 + pulse * 0.2})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function LiveDemoSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsAnalyzing(true);
    setShowResult(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2800);
  };

  const reset = () => {
    setPreviewUrl(null);
    setIsAnalyzing(false);
    setShowResult(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const DEMO_RESULTS = [
    {
      tooth: "#14",
      condition: "Early Cavity Detected",
      severity: "red" as const,
      icon: "⚠",
    },
    {
      tooth: "#22",
      condition: "Gum Inflammation Risk",
      severity: "yellow" as const,
      icon: "●",
    },
    {
      tooth: "#8",
      condition: "Healthy",
      severity: "green" as const,
      icon: "✓",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Drop Zone */}
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !previewUrl && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!previewUrl) fileInputRef.current?.click();
            }
          }}
          className="relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
          style={{
            height: 280,
            background: isDragging
              ? "oklch(0.12 0.08 205 / 0.7)"
              : "oklch(0.09 0.04 220 / 0.7)",
            border: isDragging
              ? "2px dashed oklch(0.88 0.18 85 / 0.8)"
              : "2px dashed oklch(0.88 0.18 85 / 0.3)",
            boxShadow: isDragging
              ? "0 0 40px oklch(0.88 0.18 85 / 0.3)"
              : "none",
          }}
          data-ocid="live_demo.dropzone"
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Uploaded dental scan"
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: "oklch(0.05 0.02 220 / 0.85)" }}
                >
                  <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.88 0.18 85), transparent)",
                    }}
                    animate={{ y: [0, 280] }}
                    transition={{
                      duration: 1.4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <div className="flex flex-col items-center gap-3 z-10">
                    <div className="w-12 h-12 rounded-full border-2 border-[oklch(0.82_0.16_205)] border-t-transparent animate-spin" />
                    <span
                      className="text-sm font-mono animate-hud-flicker"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    >
                      AI ANALYZING...
                    </span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 rounded-full"
                          style={{
                            height: 16,
                            background: "oklch(0.88 0.18 85)",
                          }}
                          animate={{ scaleY: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.12,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-20"
                style={{
                  background: "oklch(0.15 0.05 220 / 0.9)",
                  border: "1px solid oklch(0.88 0.18 85 / 0.4)",
                  color: "oklch(0.88 0.18 85)",
                }}
                data-ocid="live_demo.close_button"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ y: isDragging ? -8 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: "oklch(0.88 0.18 85 / 0.12)",
                  border: "1px solid oklch(0.88 0.18 85 / 0.3)",
                }}
              >
                📷
              </motion.div>
              <div className="text-center">
                <p
                  className="font-semibold text-sm"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                >
                  {isDragging
                    ? "Drop to analyze →"
                    : "Drag & drop a dental photo"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to upload • JPG, PNG, WEBP
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            data-ocid="live_demo.upload_button"
          />
        </div>
      </div>

      {/* Results Panel */}
      <div
        className="rounded-3xl p-6 min-h-[280px] flex flex-col"
        style={{
          background: "oklch(0.09 0.04 220 / 0.7)",
          border: "1px solid oklch(0.88 0.18 85 / 0.2)",
        }}
      >
        {!showResult && !isAnalyzing && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.12 0.05 205 / 0.5)",
                border: "1px solid oklch(0.88 0.18 85 / 0.25)",
              }}
            >
              <span style={{ color: "oklch(0.82 0.16 82)" }}>🦷</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI analysis results will appear here
            </p>
          </div>
        )}
        {isAnalyzing && (
          <div
            className="flex-1 flex flex-col gap-4 justify-center"
            data-ocid="live_demo.loading_state"
          >
            {[
              "Detecting tooth boundaries...",
              "Analyzing enamel condition...",
              "Checking for cavities...",
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.7 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-4 h-4 rounded-full border border-[oklch(0.82_0.16_205)] border-t-transparent animate-spin"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
                <span
                  className="text-sm font-mono"
                  style={{ color: "oklch(0.82 0.16 82)" }}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
            data-ocid="live_demo.success_state"
          >
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "oklch(0.88 0.18 85)" }}
              >
                Analysis Complete
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">72/100</span>
              </div>
            </div>
            {DEMO_RESULTS.map((r) => (
              <div
                key={r.tooth}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{
                  background:
                    r.severity === "red"
                      ? "oklch(0.11 0.04 25 / 0.8)"
                      : r.severity === "yellow"
                        ? "oklch(0.12 0.04 75 / 0.6)"
                        : "oklch(0.10 0.04 145 / 0.6)",
                  border: `1px solid oklch(${r.severity === "red" ? "0.65 0.22 25" : r.severity === "yellow" ? "0.78 0.18 75" : "0.65 0.18 145"} / 0.4)`,
                }}
              >
                <span
                  className="font-mono text-xs font-bold w-8"
                  style={{
                    color:
                      r.severity === "red"
                        ? "oklch(0.72 0.22 25)"
                        : r.severity === "yellow"
                          ? "oklch(0.82 0.18 75)"
                          : "oklch(0.72 0.18 145)",
                  }}
                >
                  {r.tooth}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">
                    {r.condition}
                  </p>
                </div>
                <span className="text-xs">{r.icon}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-2">
              Demo preview only. Sign in for a full camera scan.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: visible ? "animate-section-reveal" : "opacity-0" };
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

  const howItWorksReveal = useReveal();
  const dentistSectionReveal = useReveal();
  const testimonialsReveal = useReveal();
  const aboutReveal = useReveal();

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
        {/* ── ANIMATED GRID MESH ── */}
        <div
          className="absolute inset-0 hero-grid-mesh pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        />

        {/* ── 5 ANIMATED GLOW ORBS ── */}
        {/* Orb 1 — large gold, top-left */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 500,
            height: 500,
            top: "-140px",
            left: "-120px",
            background: "oklch(0.72 0.18 85 / 0.12)",
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.55, 0.9, 0.55],
            x: [0, 25, 0],
            y: [0, -18, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
        {/* Orb 2 — medium amber, top-right */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 320,
            height: 320,
            top: "5%",
            right: "-80px",
            background: "oklch(0.78 0.19 65 / 0.10)",
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.25, 0.9, 1],
            opacity: [0.5, 0.85, 0.5],
            x: [0, -18, 8, 0],
            y: [0, 22, -12, 0],
          }}
          transition={{
            duration: 11,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 1.5,
          }}
          aria-hidden="true"
        />
        {/* Orb 3 — deep teal, center-left */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 260,
            height: 260,
            top: "35%",
            left: "5%",
            background: "oklch(0.55 0.14 195 / 0.10)",
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.45, 0.75, 0.45],
            x: [0, 30, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 13,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 3,
          }}
          aria-hidden="true"
        />
        {/* Orb 4 — small gold, bottom-center */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 180,
            height: 180,
            bottom: "-30px",
            left: "38%",
            background: "oklch(0.82 0.20 80 / 0.14)",
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
            x: [0, -15, 15, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 0.5,
          }}
          aria-hidden="true"
        />
        {/* Orb 5 — warm amber, bottom-right */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 400,
            height: 400,
            bottom: "-120px",
            right: "-60px",
            background: "oklch(0.70 0.17 75 / 0.09)",
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 20, -10, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 4,
          }}
          aria-hidden="true"
        />

        {/* ── HERO BACKGROUND IMAGE + OVERLAYS ── */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <img
            src="/assets/generated/dental-clinic-hero.dim_1200x600.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.22) saturate(0.65)" }}
          />
          {/* Deep 3-stop gradient overlay for more cinematic depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.05 0.015 60 / 0.92) 0%, oklch(0.09 0.04 80 / 0.68) 50%, oklch(0.05 0.015 60 / 0.92) 100%)",
            }}
          />
          {/* Radial warm highlight in center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 85% 55% at 50% 35%, oklch(0.18 0.06 80 / 0.38) 0%, transparent 68%)",
            }}
          />
        </div>

        {/* ── CANVAS PARTICLES ── */}
        <HeroParticles />

        {/* ── SHIMMER SCAN LINE ── */}
        <motion.div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.88 0.18 85 / 0.55) 50%, transparent 100%)",
            zIndex: 3,
            filter: "blur(0.5px)",
          }}
          animate={{ y: ["-100%", "120vh"] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2.5,
            ease: "linear",
          }}
          aria-hidden="true"
        />

        {/* ── IRON MAN HUD OVERLAY ── */}
        <IronManHUD />

        {/* ── NEON BLUE ORB - center ── */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 350,
            height: 350,
            top: "20%",
            left: "30%",
            background: "oklch(0.88 0.18 85 / 0.06)",
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 2,
          }}
          aria-hidden="true"
        />
        {/* ── ELECTRIC PURPLE ORB - top right ── */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: 280,
            height: 280,
            top: "5%",
            right: "15%",
            background: "oklch(0.75 0.19 75 / 0.07)",
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 1,
          }}
          aria-hidden="true"
        />

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
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              AI Dental Scan in 30 Seconds
              <br />
              <span className="text-gradient-gold">
                Know Your Oral Health Instantly
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
            >
              Detect cavities, gum disease &amp; 15+ conditions from your phone.
              No clinic visit needed.
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
                whileHover={{
                  scale: 1.04,
                  boxShadow:
                    "0 0 30px oklch(0.88 0.18 85 / 0.5), 0 0 60px oklch(0.88 0.18 85 / 0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartScan}
                data-ocid="home.primary_button"
                className="flex items-center justify-center gap-2 px-10 py-5 rounded-full font-semibold text-lg transition-all shimmer-button"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                  color: "oklch(0.06 0.01 60)",
                  boxShadow: "0 6px 40px oklch(0.72 0.15 85 / 0.6)",
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
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate({ to: "/pitch" })}
                data-ocid="home.pitch.button"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border transition-all hover:bg-yellow-500/10"
                style={{
                  border: "1px solid oklch(0.72 0.15 85 / 0.35)",
                  color: "oklch(0.75 0.12 85)",
                }}
              >
                📊 Our Pitch
              </motion.button>
            </motion.div>

            {/* Trust nudge row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium mb-4"
              style={{ color: "oklch(0.72 0.08 85)" }}
            >
              {[
                "🔒 100% Private",
                "No app download",
                "Results in 30 seconds",
                "Free forever",
              ].map((t, i) => (
                <span key={t} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span className="opacity-30 hidden sm:inline">•</span>
                  )}
                  {t}
                </span>
              ))}
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

      {/* Section divider */}
      <div className="relative h-px overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
      </div>
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
        {/* ── NEURAL NETWORK AI SECTION ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-6xl px-6 py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Neural network canvas */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                height: 300,
                background: "oklch(0.08 0.04 220 / 0.7)",
                border: "1px solid oklch(0.88 0.18 85 / 0.25)",
                boxShadow: "0 0 60px oklch(0.88 0.18 85 / 0.1)",
              }}
            >
              <NeuralNetworkAnimation />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "oklch(0.88 0.18 85)" }}
                />
                <span
                  className="text-xs font-mono"
                  style={{ color: "oklch(0.82 0.16 82)" }}
                >
                  NEURAL NET ACTIVE
                </span>
              </div>
              <div className="absolute bottom-4 right-4 text-right">
                <span
                  className="text-xs font-mono"
                  style={{ color: "oklch(0.65 0.12 78)" }}
                >
                  28 NODES • 94% ACCURACY
                </span>
              </div>
            </div>
            {/* Right: AI explanation */}
            <div className="flex flex-col gap-6">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                >
                  AI Architecture
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  <span className="text-gradient-gold">Neural Network</span>{" "}
                  <span className="text-gradient-neon">
                    Built for Dentistry
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our AI processes each tooth individually through a multi-layer
                  neural network trained on 50,000+ dental images, identifying
                  patterns invisible to the human eye.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Model Type", value: "CNN Ensemble", color: "205" },
                  { label: "Training Images", value: "50K+", color: "205" },
                  { label: "Detection Accuracy", value: "94%", color: "280" },
                  { label: "Inference Time", value: "<2 sec", color: "280" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl p-4"
                    style={{
                      background: `oklch(0.10 0.04 ${item.color} / 0.5)`,
                      border: `1px solid oklch(0.65 0.16 ${item.color} / 0.3)`,
                    }}
                  >
                    <p
                      className="font-display text-2xl font-bold"
                      style={{ color: `oklch(0.82 0.16 ${item.color})` }}
                    >
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

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
                whileHover={{
                  scale: 1.04,
                  rotateX: 3,
                  rotateY: -3,
                  transition: { duration: 0.2 },
                }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl p-6 text-center cursor-default card-glow-border"
                style={{
                  background: "oklch(0.12 0.04 85 / 0.7)",
                  transformPerspective: 800,
                }}
              >
                <p className="font-display text-5xl md:text-6xl font-bold text-gradient-gold">
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

        {/* ── SAMPLE SCAN OUTPUT ── */}
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
              Real Output Preview
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
              Here&apos;s What You&apos;ll See After Your Scan
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              This is exactly what a DantaNova scan result looks like —
              tooth-by-tooth, color-coded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* LEFT: Health Score + Triage Banner */}
            <div className="flex flex-col gap-6">
              {/* Health Score Circle */}
              <div
                className="rounded-3xl p-8 flex flex-col items-center gap-3"
                style={{
                  background: "oklch(0.11 0.04 85 / 0.85)",
                  border: "1px solid oklch(0.72 0.15 85 / 0.3)",
                  boxShadow: "0 0 32px oklch(0.72 0.15 85 / 0.08)",
                }}
              >
                <div
                  className="w-36 h-36 rounded-full flex flex-col items-center justify-center relative"
                  style={{
                    border: "5px solid oklch(0.82 0.18 85)",
                    boxShadow:
                      "0 0 28px oklch(0.72 0.15 85 / 0.35), inset 0 0 20px oklch(0.72 0.15 85 / 0.08)",
                    background: "oklch(0.10 0.035 85 / 0.9)",
                  }}
                >
                  <span
                    className="font-display text-5xl font-bold leading-none"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  >
                    72
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.65 0.08 85)" }}
                  >
                    /100
                  </span>
                </div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: "oklch(0.72 0.1 85)" }}
                >
                  Health Score
                </p>
              </div>
              {/* Triage Banner */}
              <div
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{
                  background: "oklch(0.16 0.08 75 / 0.4)",
                  border: "1px solid oklch(0.75 0.18 75 / 0.4)",
                  borderLeft: "4px solid oklch(0.82 0.18 75)",
                }}
              >
                <AlertTriangle
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: "oklch(0.88 0.18 75)" }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{
                        background: "oklch(0.78 0.18 75 / 0.2)",
                        border: "1px solid oklch(0.78 0.18 75 / 0.5)",
                        color: "oklch(0.88 0.18 75)",
                      }}
                    >
                      Moderate
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.82 0.1 75)" }}
                  >
                    Some issues detected. A dentist visit is recommended soon.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Issue Cards */}
            <div className="flex flex-col gap-4">
              {/* Cavity Card */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "oklch(0.11 0.04 85 / 0.85)",
                  border: "1px solid oklch(0.55 0.18 20 / 0.4)",
                  borderLeft: "4px solid oklch(0.65 0.22 20)",
                  boxShadow: "0 0 16px oklch(0.55 0.18 20 / 0.12)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "oklch(0.88 0.06 85)" }}
                  >
                    Tooth #14
                  </span>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "oklch(0.55 0.18 20 / 0.2)",
                      border: "1px solid oklch(0.55 0.18 20 / 0.5)",
                      color: "oklch(0.75 0.2 20)",
                    }}
                  >
                    Cavity / Decay
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className="font-medium"
                    style={{ color: "oklch(0.7 0.05 85)" }}
                  >
                    Condition:
                  </span>{" "}
                  Early-stage cavity detected
                </p>
                <p className="text-xs text-muted-foreground">
                  <span
                    className="font-medium"
                    style={{ color: "oklch(0.7 0.05 85)" }}
                  >
                    Recommendation:
                  </span>{" "}
                  Schedule a dental filling within 4–6 weeks.
                </p>
              </div>

              {/* Risk Card */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "oklch(0.11 0.04 85 / 0.85)",
                  border: "1px solid oklch(0.72 0.16 75 / 0.4)",
                  borderLeft: "4px solid oklch(0.82 0.18 75)",
                  boxShadow: "0 0 16px oklch(0.72 0.16 75 / 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "oklch(0.88 0.06 85)" }}
                  >
                    Tooth #22
                  </span>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "oklch(0.72 0.16 75 / 0.2)",
                      border: "1px solid oklch(0.72 0.16 75 / 0.5)",
                      color: "oklch(0.88 0.18 75)",
                    }}
                  >
                    Risk Detected
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className="font-medium"
                    style={{ color: "oklch(0.7 0.05 85)" }}
                  >
                    Condition:
                  </span>{" "}
                  Mild gum inflammation
                </p>
                <p className="text-xs text-muted-foreground">
                  <span
                    className="font-medium"
                    style={{ color: "oklch(0.7 0.05 85)" }}
                  >
                    Recommendation:
                  </span>{" "}
                  Improve flossing routine and use antiseptic mouthwash.
                </p>
              </div>

              {/* Healthy Card */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "oklch(0.11 0.04 85 / 0.85)",
                  border: "1px solid oklch(0.62 0.16 142 / 0.4)",
                  borderLeft: "4px solid oklch(0.72 0.18 142)",
                  boxShadow: "0 0 16px oklch(0.62 0.16 142 / 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "oklch(0.88 0.06 85)" }}
                  >
                    Tooth #8
                  </span>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "oklch(0.62 0.16 142 / 0.2)",
                      border: "1px solid oklch(0.62 0.16 142 / 0.5)",
                      color: "oklch(0.78 0.18 142)",
                    }}
                  >
                    Healthy
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className="font-medium"
                    style={{ color: "oklch(0.7 0.05 85)" }}
                  >
                    Condition:
                  </span>{" "}
                  No issues detected
                </p>
                <p className="text-xs text-muted-foreground">
                  <span
                    className="font-medium"
                    style={{ color: "oklch(0.7 0.05 85)" }}
                  >
                    Recommendation:
                  </span>{" "}
                  Continue your current oral hygiene routine.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartScan}
              data-ocid="sample_scan.primary_button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                color: "oklch(0.06 0.01 60)",
                boxShadow: "0 4px 28px oklch(0.72 0.15 85 / 0.4)",
              }}
            >
              <ScanLine className="w-5 h-5" />
              Run Your Own Scan →
            </motion.button>
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

        {/* ── LIVE DEMO SECTION ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Try It Instantly
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-neon">Live Demo</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Drop any dental photo below and see our AI analyze it in real-time
              — no sign-in required for the preview.
            </p>
          </div>
          <LiveDemoSection />
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

        {/* ── DEMO CTA BANNER ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-5xl px-6 py-10"
        >
          <div
            className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.08 85 / 0.9), oklch(0.14 0.05 85 / 0.95))",
              border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
              boxShadow: "0 0 40px oklch(0.72 0.15 85 / 0.15)",
            }}
          >
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.25em] mb-2"
                style={{ color: "oklch(0.82 0.16 85)" }}
              >
                Demo
              </p>
              <h3 className="font-display text-2xl font-bold mb-2 text-foreground">
                See DantaNova in Action
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Watch an end-to-end scan — from camera to 3D results to booking
                a dentist. No sign-up needed.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate({ to: "/demo" })}
              data-ocid="demo_banner.primary_button"
              className="shrink-0 flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.68 0.16 80))",
                color: "oklch(0.06 0.01 60)",
                boxShadow: "0 4px 28px oklch(0.72 0.15 85 / 0.4)",
              }}
            >
              ▶ Watch Demo Scan
            </motion.button>
          </div>
        </motion.section>

        {/* ── HOW IT WORKS ── */}
        <motion.section
          ref={howItWorksReveal.ref}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={`w-full max-w-5xl px-6 py-16 ${howItWorksReveal.className}`}
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
              From camera to diagnosis in four effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[2px] bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
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

        {/* Section divider */}
        <div className="relative h-px w-full max-w-5xl px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
        </div>

        {/* ── BOOK A DENTIST SECTION ── */}
        <motion.section
          ref={dentistSectionReveal.ref}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className={`w-full max-w-5xl px-6 py-16 ${dentistSectionReveal.className}`}
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
          ref={aboutReveal.ref}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className={`w-full max-w-5xl px-6 py-16 ${aboutReveal.className}`}
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
                  href="https://www.linkedin.com/in/dantanova-dental-ai-aa33a8400"
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
          ref={testimonialsReveal.ref}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className={`w-full max-w-5xl px-6 py-16 ${testimonialsReveal.className}`}
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

          {/* Trust Badge Strip */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {[
              { icon: "🔐", label: "End-to-End Encrypted" },
              { icon: "✅", label: "GDPR Compliant" },
              { icon: "⛓", label: "Blockchain Secured" },
              { icon: "🎯", label: "94% Detection Accuracy" },
              { icon: "♾️", label: "Free Forever" },
              { icon: "🩺", label: "Clinically Aligned" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"
                style={{
                  background: "oklch(0.15 0.06 85 / 0.6)",
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.4)",
                  color: "oklch(0.85 0.14 85)",
                }}
              >
                <span>{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>

          {/* Featured Reviews */}
          <div className="mb-10">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-6 text-center"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              ⭐ Featured Reviews
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STATIC_TESTIMONIALS.slice(0, 3).map((t, idx) => (
                <motion.div
                  key={`featured-${t.name}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="rounded-3xl p-8 flex flex-col gap-4 relative overflow-hidden"
                  style={{
                    background: "oklch(0.12 0.045 85 / 0.9)",
                    border: "1.5px solid oklch(0.75 0.18 85 / 0.5)",
                    boxShadow: "0 0 20px oklch(0.72 0.15 85 / 0.2)",
                  }}
                  data-ocid={`testimonials.item.${idx + 1}`}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full self-start"
                    style={{
                      background: "oklch(0.82 0.18 85 / 0.15)",
                      border: "1px solid oklch(0.82 0.18 85 / 0.35)",
                      color: "oklch(0.88 0.18 85)",
                    }}
                  >
                    ⭐ Featured Review
                  </span>
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.88 0.18 85), oklch(0.68 0.16 80))",
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
                            n <= t.rating
                              ? "oklch(0.88 0.18 85)"
                              : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed italic pl-2">
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
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.72 0.15 85 / 0.15)" }}
            />
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap"
              style={{ color: "oklch(0.72 0.1 85)" }}
            >
              More Reviews from Our Community
            </p>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.72 0.15 85 / 0.15)" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATIC_TESTIMONIALS.slice(3).map((t, idx) => (
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
                data-ocid={`testimonials.item.${idx + 4}`}
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

        {/* Section divider */}
        <div className="relative h-px w-full max-w-5xl px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
        </div>

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
                        "https://www.linkedin.com/in/dantanova-dental-ai-aa33a8400",
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
