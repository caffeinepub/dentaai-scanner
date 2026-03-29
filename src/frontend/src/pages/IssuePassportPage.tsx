import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Copy,
  Loader2,
  Plus,
  QrCode,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DentalPassport {
  passportId: bigint;
  patientId: any;
  homeDentistId: any;
  passportCode: string;
  treatmentHistory: string;
  currentConditions: string;
  allergies: string;
  preApprovedBudget: bigint;
  notes: string;
  isActive: boolean;
  createdAt: bigint;
}

export default function IssuePassportPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [patientEmail, setPatientEmail] = useState("");
  const [treatmentHistory, setTreatmentHistory] = useState("");
  const [currentConditions, setCurrentConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Success state
  const [issuedCode, setIssuedCode] = useState<string | null>(null);

  const [issuedPassports, setIssuedPassports] = useState<DentalPassport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    const a = actor as any;
    a.getPassportsIssuedByMe()
      .then((list: DentalPassport[]) => setIssuedPassports(list))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, isFetching, identity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity) return;
    if (!patientEmail.trim()) {
      toast.error("Patient email is required");
      return;
    }
    const budgetCents = Math.round(Number.parseFloat(budget || "0") * 100);
    if (Number.isNaN(budgetCents) || budgetCents <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }
    setSubmitting(true);
    try {
      const a = actor as any;
      const result = await a.issuePassport(
        patientEmail.trim(),
        treatmentHistory.trim(),
        currentConditions.trim(),
        allergies.trim(),
        BigInt(budgetCents),
        notes.trim(),
      );
      if ("ok" in result) {
        setIssuedCode(`DP-${result.ok.toString()}`);
        // Refresh list
        try {
          const updated = await a.getPassportsIssuedByMe();
          setIssuedPassports(updated);
        } catch {
          // ignore refresh errors
        }
      } else {
        toast.error(result.err ?? "Failed to issue passport");
      }
    } catch {
      toast.error("Failed to issue passport");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setIssuedCode(null);
    setPatientEmail("");
    setTreatmentHistory("");
    setCurrentConditions("");
    setAllergies("");
    setBudget("");
    setNotes("");
    setShowDetails(false);
  };

  const copyIssuedCode = () => {
    if (!issuedCode) return;
    navigator.clipboard.writeText(issuedCode);
    toast.success("Passport code copied!");
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to issue Dental Passports
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="issue_passport.primary_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/passport" })}
          data-ocid="issue_passport.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">
            Issue Dental Passport
          </h1>
          <p className="text-xs text-muted-foreground">
            Create a dental passport for a patient
          </p>
        </div>
        <Link to="/qr">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-yellow-500/40 text-yellow-400 gap-1.5"
            data-ocid="issue_passport.link"
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Code
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-4 mb-6 flex items-start gap-3"
          style={{
            border: "1px solid oklch(0.72 0.15 85 / 0.4)",
            background: "oklch(0.15 0.06 85 / 0.15)",
          }}
        >
          <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            A Dental Passport lets a patient receive trusted care anywhere in
            the DantaNova network. Enter the patient's email, pre-approve a
            budget, and the patient can share the generated code with any
            dentist they visit while traveling.
          </p>
        </motion.div>

        {/* Success Panel or Form */}
        <AnimatePresence mode="wait">
          {issuedCode ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="glass-card rounded-3xl p-8 flex flex-col items-center gap-5 mb-8"
              style={{
                border: "1.5px solid oklch(0.72 0.15 85 / 0.7)",
                boxShadow: "0 0 40px oklch(0.72 0.15 85 / 0.15)",
              }}
              data-ocid="issue_passport.success_state"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.22 0.08 85 / 0.4)",
                  border: "2px solid oklch(0.72 0.15 85 / 0.8)",
                  boxShadow: "0 0 30px oklch(0.72 0.15 85 / 0.3)",
                }}
              >
                <CheckCircle className="w-10 h-10 text-yellow-400" />
              </div>

              <div className="text-center">
                <h2 className="font-display font-bold text-2xl">
                  Passport Issued!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share this code with your patient
                </p>
              </div>

              <div className="w-full">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-center mb-3">
                  Passport Code
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 text-xl font-mono font-bold px-5 py-4 rounded-2xl tracking-widest text-center"
                    style={{
                      background: "oklch(0.15 0.06 85 / 0.8)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.8)",
                      color: "oklch(0.9 0.18 85)",
                      boxShadow: "0 0 24px oklch(0.72 0.15 85 / 0.3)",
                    }}
                    data-ocid="issue_passport.panel"
                  >
                    {issuedCode}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-12 w-12 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 flex-shrink-0"
                    onClick={copyIssuedCode}
                    data-ocid="issue_passport.toggle"
                    title="Copy passport code"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
                  Share this code with your patient. They can use it at the{" "}
                  <Link
                    to="/passport-lookup"
                    className="text-yellow-400 underline"
                  >
                    Passport Lookup
                  </Link>{" "}
                  page when visiting a dentist away from home.
                </p>
              </div>

              <Button
                className="rounded-full glow-primary px-8"
                onClick={resetForm}
                data-ocid="issue_passport.primary_button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Issue Another
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 flex flex-col gap-5 mb-8"
              data-ocid="issue_passport.panel"
            >
              <h2 className="font-display font-bold text-lg">New Passport</h2>

              {/* Required fields */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Patient Email *
                </span>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="patient@email.com"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                  data-ocid="issue_passport.input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Pre-Approved Budget (INR) *
                </span>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="500.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  data-ocid="issue_passport.input"
                />
              </div>

              {/* Optional medical details toggle */}
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-yellow-400 font-semibold self-start hover:opacity-80 transition-opacity"
                onClick={() => setShowDetails((v) => !v)}
                data-ocid="issue_passport.toggle"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
                />
                Add Medical Details (optional)
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-4 overflow-hidden"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Treatment History
                      </span>
                      <Textarea
                        className="rounded-2xl bg-background/60 border-border/40 min-h-[80px]"
                        placeholder="Previous treatments, procedures, x-rays..."
                        value={treatmentHistory}
                        onChange={(e) => setTreatmentHistory(e.target.value)}
                        data-ocid="issue_passport.textarea"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Current Conditions
                      </span>
                      <Textarea
                        className="rounded-2xl bg-background/60 border-border/40 min-h-[70px]"
                        placeholder="Active dental issues, ongoing treatments..."
                        value={currentConditions}
                        onChange={(e) => setCurrentConditions(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Allergies
                        </span>
                        <Input
                          className="rounded-2xl bg-background/60 border-border/40"
                          placeholder="Penicillin, latex..."
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Notes
                        </span>
                        <Input
                          className="rounded-2xl bg-background/60 border-border/40"
                          placeholder="Additional notes..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="rounded-full glow-primary w-full"
                disabled={submitting}
                data-ocid="issue_passport.submit_button"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {submitting ? "Issuing Passport..." : "Issue Dental Passport"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Issued Passports List */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">
            <Users className="w-5 h-5 inline mr-2 text-yellow-400" />
            Issued Passports ({issuedPassports.length})
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
            </div>
          ) : issuedPassports.length === 0 ? (
            <div
              className="glass-card rounded-3xl p-8 text-center"
              data-ocid="issue_passport.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No passports issued yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {issuedPassports.map((p, i) => (
                <motion.div
                  key={p.passportId.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-2xl p-4 flex items-center justify-between gap-3"
                  data-ocid={`issue_passport.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "oklch(0.22 0.08 85 / 0.4)",
                        border: "1px solid oklch(0.72 0.15 85 / 0.4)",
                      }}
                    >
                      <BookOpen className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Patient</p>
                      <p className="text-sm truncate">
                        {p.notes ? p.notes.split("\n")[0] : "Patient"}
                      </p>
                      <code
                        className="text-xs font-mono text-yellow-400"
                        style={{ letterSpacing: "0.08em" }}
                      >
                        {p.passportCode}
                      </code>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge
                      className={
                        p.isActive
                          ? "bg-green-500/15 text-green-400 border-green-500/30 text-xs"
                          : "bg-red-500/15 text-red-400 border-red-500/30 text-xs"
                      }
                    >
                      {p.isActive ? (
                        <CheckCircle className="w-2.5 h-2.5 mr-1" />
                      ) : null}
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-yellow-400 font-bold">
                      ₹{(Number(p.preApprovedBudget) / 100).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
