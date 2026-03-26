import type { DentistProfile } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Star, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Urgency = "Mild" | "Moderate" | "Severe";

interface SampleDentist {
  name: string;
  specialty: string;
  location: string;
  languages: string[];
  available: "today" | "tomorrow";
  urgencyAccepted: Urgency[];
  rating: number;
  reviews: number;
}

const SAMPLE_DENTISTS: SampleDentist[] = [
  {
    name: "Dr. Priya Sharma",
    specialty: "General Dentistry",
    location: "Mumbai, Maharashtra",
    languages: ["English", "Hindi", "Marathi"],
    available: "today",
    urgencyAccepted: ["Mild", "Moderate", "Severe"],
    rating: 4.9,
    reviews: 58,
  },
  {
    name: "Dr. Arjun Mehta",
    specialty: "Endodontics & Root Canal",
    location: "Pune, Maharashtra",
    languages: ["English", "Hindi"],
    available: "today",
    urgencyAccepted: ["Moderate", "Severe"],
    rating: 4.8,
    reviews: 42,
  },
  {
    name: "Dr. Lakshmi Iyer",
    specialty: "Periodontology",
    location: "Bengaluru, Karnataka",
    languages: ["English", "Tamil", "Kannada"],
    available: "tomorrow",
    urgencyAccepted: ["Mild", "Moderate"],
    rating: 4.7,
    reviews: 36,
  },
  {
    name: "Dr. Rohan Desai",
    specialty: "Oral Surgery",
    location: "Delhi, NCR",
    languages: ["English", "Hindi", "Punjabi"],
    available: "today",
    urgencyAccepted: ["Severe"],
    rating: 4.9,
    reviews: 71,
  },
  {
    name: "Dr. Fatima Khan",
    specialty: "Pediatric & Family Dentistry",
    location: "Hyderabad, Telangana",
    languages: ["English", "Urdu", "Telugu"],
    available: "tomorrow",
    urgencyAccepted: ["Mild", "Moderate"],
    rating: 4.8,
    reviews: 29,
  },
  {
    name: "Dr. Vikram Nair",
    specialty: "Orthodontics & Emergency Care",
    location: "Chennai, Tamil Nadu",
    languages: ["English", "Tamil"],
    available: "today",
    urgencyAccepted: ["Mild", "Moderate", "Severe"],
    rating: 4.6,
    reviews: 44,
  },
];

const URGENCY_COLORS: Record<Urgency, string> = {
  Mild: "bg-green-500/15 text-green-400 border-green-500/30",
  Moderate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Severe: "bg-red-500/15 text-red-400 border-red-500/30",
};

const FILTER_TABS = ["All", "Mild", "Moderate", "Severe"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function FindDentistPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [registeredDentists, setRegisteredDentists] = useState<
    DentistProfile[]
  >([]);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllDentists()
      .then((list) => setRegisteredDentists(list))
      .catch(() => {});
  }, [actor]);

  const filtered =
    activeFilter === "All"
      ? SAMPLE_DENTISTS
      : SAMPLE_DENTISTS.filter((d) =>
          d.urgencyAccepted.includes(activeFilter as Urgency),
        );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 flex-shrink-0"
          onClick={() => navigate({ to: "/" })}
          data-ocid="find_dentist.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">
            Emergency Dentist Finder
          </h1>
          <p className="text-xs text-muted-foreground">
            Find a verified dentist near you — fast.
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Book by Code + Dentist Register CTAs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          <Button
            className="rounded-full glow-primary text-sm px-6"
            onClick={() => navigate({ to: "/book" })}
            data-ocid="find_dentist.primary_button"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Book by Dentist Code
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 text-sm px-6"
            onClick={() => navigate({ to: "/dentist-register" })}
            data-ocid="find_dentist.secondary_button"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Are you a dentist? Register here
          </Button>
        </motion.div>

        {/* Registered dentists from backend (real data) */}
        {registeredDentists.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <p className="text-sm font-semibold text-yellow-400">
              Registered on DantaNova ({registeredDentists.length})
            </p>
            {registeredDentists.map((d, i) => (
              <div
                key={d.name}
                className="glass-card rounded-3xl p-4 border border-yellow-500/20 flex items-start gap-3"
                data-ocid={`find_dentist.item.${i + 1}`}
              >
                <div className="circle-icon w-10 h-10 bg-yellow-500/10 border border-yellow-500/40 flex-shrink-0">
                  <span className="text-yellow-400 font-bold">{d.name[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.specialty} · {d.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.languages.join(", ")}
                  </p>
                  {d.isVerified && (
                    <span className="text-xs text-green-400 font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="rounded-full glow-primary text-xs px-3 flex-shrink-0"
                  onClick={() => navigate({ to: "/book" })}
                  data-ocid="find_dentist.primary_button"
                >
                  Book
                </Button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Urgency Filter Tabs */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">
            Sample Verified Dentists
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex gap-2 flex-wrap"
            data-ocid="find_dentist.tab"
          >
            {FILTER_TABS.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveFilter(tab)}
                data-ocid={`find_dentist.${tab.toLowerCase()}.tab`}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeFilter === tab
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_2px_oklch(0.85_0.17_85/0.15)]"
                    : "text-muted-foreground border-border/40 hover:border-yellow-500/30 hover:text-yellow-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Sample Dentist Cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((dentist, i) => (
            <motion.div
              key={dentist.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
              className="glass-card rounded-3xl p-5 border border-yellow-500/10 hover:border-yellow-500/25 transition-colors"
              data-ocid={`find_dentist.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="circle-icon w-11 h-11 bg-yellow-500/10 border border-yellow-500/30 flex-shrink-0">
                    <span className="text-yellow-400 font-display font-bold text-base">
                      {dentist.name.split(" ")[1]?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm leading-tight">
                      {dentist.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dentist.specialty}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    dentist.available === "today"
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {dentist.available === "today"
                    ? "Available Today"
                    : "Next Slot: Tomorrow"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">
                  {dentist.location}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {dentist.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border/40"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {dentist.urgencyAccepted.map((u) => (
                  <span
                    key={u}
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${URGENCY_COLORS[u]}`}
                  >
                    {u}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">
                    {dentist.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({dentist.reviews} reviews)
                  </span>
                </div>
                <Button
                  size="sm"
                  className="rounded-full glow-primary text-xs px-4"
                  onClick={() => navigate({ to: "/book" })}
                  data-ocid={`find_dentist.primary_button.${i + 1}`}
                >
                  Book Appointment
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-8 text-center"
            data-ocid="find_dentist.empty_state"
          >
            <p className="text-muted-foreground text-sm">
              No dentists found for this urgency level. Try a different filter.
            </p>
          </motion.div>
        )}
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
