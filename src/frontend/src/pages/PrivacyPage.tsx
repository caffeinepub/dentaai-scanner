import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Database, Eye, Lock, Mail, UserCheck } from "lucide-react";
import { motion } from "motion/react";

const SECTIONS = [
  {
    icon: Database,
    title: "What We Collect",
    content:
      "We collect your scan results (tooth-by-tooth analysis) and your Internet Identity principal. We do not store any photos or video from your camera — only the analysis output.",
  },
  {
    icon: Eye,
    title: "How It's Used",
    content:
      "Your data is used exclusively to show you your own dental health reports and history. We do not share, sell, or analyze your data for any other purpose.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content:
      "All data is stored on the Internet Computer (ICP) blockchain. Data is encrypted at rest by the platform. No centralized server holds your information.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content:
      "You can delete all your scan data at any time from your Profile page. Once deleted, the data is permanently removed and cannot be recovered.",
  },
  {
    icon: Mail,
    title: "Contact",
    content: "Questions about your privacy? Reach us at contact@dantanova.com",
  },
];

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-ocid="privacy.page"
    >
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-4 border-b border-border/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          data-ocid="privacy.link"
          className="justify-start rounded-full px-4 w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center gap-2">
          <LogoCircle size="sm" />
          <span className="font-display font-bold text-lg tracking-tight">
            Danta<span className="text-primary">Nova</span>
          </span>
        </div>
        <div />
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-8 max-w-xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-display text-3xl font-bold mb-1"
            style={{ color: "#c9a84c" }}
          >
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground mb-8">
            Last updated: March 2026 · Plain language, no legal jargon.
          </p>

          <div className="flex flex-col gap-4">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="glass-card rounded-3xl p-5 flex gap-4"
              >
                <div className="circle-icon w-10 h-10 bg-primary/15 flex-shrink-0 mt-0.5">
                  <section.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2
                    className="font-display font-semibold text-sm mb-1"
                    style={{ color: "#c9a84c" }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
          {" | "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
