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
  ChevronRight,
  Copy,
  Loader2,
  Mail,
  QrCode,
  Share2,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
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

interface ReimbursementRequest {
  requestId: bigint;
  passportId: bigint;
  travelingDentistId: any;
  homeDentistId: any;
  treatmentDescription: string;
  amount: bigint;
  platformFee: bigint;
  status: any;
  createdAt: bigint;
}

function reimbStatusColor(status: any): string {
  const s = typeof status === "string" ? status : Object.keys(status)[0];
  if (s === "approved")
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (s === "declined") return "bg-red-500/15 text-red-400 border-red-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

export default function PassportPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [passport, setPassport] = useState<DentalPassport | null | undefined>(
    undefined,
  );
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Self-issue form
  const [showSelfForm, setShowSelfForm] = useState(false);
  const [selfAllergies, setSelfAllergies] = useState("");
  const [selfConditions, setSelfConditions] = useState("");
  const [selfNotes, setSelfNotes] = useState("");
  const [selfCreating, setSelfCreating] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey is a manual refresh trigger
  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    const a = actor as any;
    setLoading(true);
    Promise.all([a.getMyPassport(), a.getMyReimbursementRequests()])
      .then(([p, r]: [DentalPassport | null, ReimbursementRequest[]]) => {
        setPassport(p);
        setRequests(r);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, isFetching, identity, refreshKey]);

  const copyCode = useCallback(() => {
    if (!passport) return;
    navigator.clipboard.writeText(passport.passportCode);
    toast.success("Passport code copied!");
  }, [passport]);

  const shareCode = useCallback(async () => {
    if (!passport) return;
    const shareData = {
      title: "My Dental Passport",
      text: `My DantaNova Dental Passport Code: ${passport.passportCode}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      toast.success("Passport code copied to clipboard!");
    }
  }, [passport]);

  const handleSelfCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity) return;
    setSelfCreating(true);
    try {
      const a = actor as any;
      const result = await a.selfIssuePassport(
        "", // treatmentHistory
        selfConditions.trim(), // currentConditions
        selfAllergies.trim(), // allergies
        BigInt(0), // preApprovedBudget
        selfNotes.trim(), // notes
      );
      if (result && "ok" in result) {
        // Backend now upserts — ok means created or updated
        toast.success("Your Dental Passport has been created!");
        setShowSelfForm(false);
        setSelfAllergies("");
        setSelfConditions("");
        setSelfNotes("");
        setRefreshKey((k) => k + 1);
      } else {
        toast.error(result?.err ?? "Failed to create passport");
      }
    } catch {
      toast.error("Could not create passport. Please try again.");
    } finally {
      setSelfCreating(false);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to view your Dental Passport
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="passport.primary_button"
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
          onClick={() => navigate({ to: "/" })}
          data-ocid="passport.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">My Dental Passport</h1>
          <p className="text-xs text-muted-foreground">
            Your portable dental identity
          </p>
        </div>
        <Link to="/qr">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-yellow-500/40 text-yellow-400 gap-1.5"
            data-ocid="passport.link"
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Code
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          </div>
        ) : !passport ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Empty state header */}
            <div
              className="glass-card rounded-3xl p-6 text-center flex flex-col items-center gap-3"
              data-ocid="passport.empty_state"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.22 0.08 85 / 0.3)",
                  border: "2px solid oklch(0.72 0.15 85 / 0.5)",
                  boxShadow: "0 0 30px oklch(0.72 0.15 85 / 0.2)",
                }}
              >
                <BookOpen className="w-7 h-7 text-yellow-400" />
              </div>
              <h2 className="font-display font-bold text-xl">
                No Passport Yet
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Get a Dental Passport to share your records when visiting
                dentists away from home.
              </p>
            </div>

            {/* Two options side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Get from dentist */}
              <Link to="/find-dentist">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-3xl p-5 flex flex-col items-center gap-3 cursor-pointer h-full"
                  style={{ border: "1.5px solid oklch(0.72 0.15 85 / 0.35)" }}
                  data-ocid="passport.primary_button"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.22 0.08 85 / 0.4)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                    }}
                  >
                    <Stethoscope className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm">
                      Get one from your dentist
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Ask your home dentist to issue a passport with your full
                      records.
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-yellow-400 text-xs font-semibold">
                    Find a Dentist <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              </Link>

              {/* Option 2: Create your own */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card rounded-3xl p-5 flex flex-col items-center gap-3 cursor-pointer"
                style={{
                  border: showSelfForm
                    ? "1.5px solid oklch(0.72 0.15 85 / 0.7)"
                    : "1.5px solid oklch(0.72 0.15 85 / 0.35)",
                  boxShadow: showSelfForm
                    ? "0 0 24px oklch(0.72 0.15 85 / 0.15)"
                    : undefined,
                }}
                onClick={() => setShowSelfForm((v) => !v)}
                data-ocid="passport.secondary_button"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.22 0.08 85 / 0.4)",
                    border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                  }}
                >
                  <BookOpen className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">Create your own</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Self-create a basic passport with your allergies and
                    conditions.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-yellow-400 text-xs font-semibold">
                  {showSelfForm ? "Hide Form" : "Create Now"}{" "}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${showSelfForm ? "rotate-90" : ""}`}
                  />
                </div>
              </motion.div>
            </div>

            {/* Self-create inline form */}
            <AnimatePresence>
              {showSelfForm && (
                <motion.form
                  key="self-form"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSelfCreate}
                  className="glass-card rounded-3xl p-6 flex flex-col gap-4"
                  style={{ border: "1.5px solid oklch(0.72 0.15 85 / 0.5)" }}
                  data-ocid="passport.panel"
                >
                  <h3 className="font-display font-bold text-base">
                    Basic Passport Details
                  </h3>
                  <p className="text-xs text-muted-foreground -mt-2">
                    All fields optional — add what you know.
                  </p>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Allergies
                    </span>
                    <Input
                      className="rounded-2xl bg-background/60 border-border/40"
                      placeholder="e.g. Penicillin, latex..."
                      value={selfAllergies}
                      onChange={(e) => setSelfAllergies(e.target.value)}
                      data-ocid="passport.input"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Current Conditions
                    </span>
                    <Input
                      className="rounded-2xl bg-background/60 border-border/40"
                      placeholder="e.g. Ongoing sensitivity, crown on tooth 14..."
                      value={selfConditions}
                      onChange={(e) => setSelfConditions(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Notes
                    </span>
                    <Textarea
                      className="rounded-2xl bg-background/60 border-border/40 min-h-[60px]"
                      placeholder="Any other notes for your dentist..."
                      value={selfNotes}
                      onChange={(e) => setSelfNotes(e.target.value)}
                      data-ocid="passport.textarea"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="rounded-full glow-primary w-full"
                    disabled={selfCreating}
                    data-ocid="passport.submit_button"
                  >
                    {selfCreating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {selfCreating ? "Creating..." : "Create My Passport"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Passport Card */}
            <div
              className="glass-card rounded-3xl p-6"
              style={{
                border: "1.5px solid oklch(0.72 0.15 85 / 0.6)",
                boxShadow: "0 0 40px oklch(0.72 0.15 85 / 0.15)",
              }}
              data-ocid="passport.card"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.22 0.08 85 / 0.5)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                    }}
                  >
                    <BookOpen className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm">
                      Dental Passport
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Issued #{Number(passport.passportId)}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    passport.isActive
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-red-500/15 text-red-400 border-red-500/30"
                  }
                >
                  {passport.isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>

              {/* Passport Code */}
              <div className="mb-5">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">
                  Passport Code
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 text-base font-mono font-bold px-4 py-3 rounded-2xl tracking-widest"
                    style={{
                      background: "oklch(0.15 0.06 85 / 0.8)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.7)",
                      color: "oklch(0.9 0.18 85)",
                      boxShadow: "0 0 20px oklch(0.72 0.15 85 / 0.2)",
                    }}
                    data-ocid="passport.panel"
                  >
                    {passport.passportCode}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-10 w-10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 flex-shrink-0"
                    onClick={copyCode}
                    data-ocid="passport.toggle"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-10 w-10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 flex-shrink-0"
                    onClick={shareCode}
                    data-ocid="passport.secondary_button"
                    title="Share code"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this code with a traveling dentist so they can look up
                  your records.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {passport.currentConditions && (
                  <div className="glass-card rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Current Conditions
                    </p>
                    <p className="text-sm">{passport.currentConditions}</p>
                  </div>
                )}
                {passport.allergies && (
                  <div className="glass-card rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Allergies
                    </p>
                    <p className="text-sm text-red-300">{passport.allergies}</p>
                  </div>
                )}
                {passport.treatmentHistory && (
                  <div className="glass-card rounded-2xl p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Treatment History
                    </p>
                    <p className="text-sm leading-relaxed">
                      {passport.treatmentHistory}
                    </p>
                  </div>
                )}
                <div className="glass-card rounded-2xl p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Pre-Approved Budget
                  </p>
                  <p className="text-lg font-bold text-yellow-400">
                    ₹{(Number(passport.preApprovedBudget) / 100).toFixed(2)}
                  </p>
                </div>
                {passport.notes && (
                  <div className="glass-card rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Notes
                    </p>
                    <p className="text-sm">{passport.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reimbursement History */}
            {requests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className="font-display font-bold text-lg mb-3">
                  Treatment Reimbursements
                </h2>
                <div className="flex flex-col gap-3">
                  {requests.map((req, i) => {
                    const statusStr =
                      typeof req.status === "string"
                        ? req.status
                        : Object.keys(req.status)[0];
                    return (
                      <motion.div
                        key={req.requestId.toString()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card rounded-2xl p-4 flex flex-col gap-2"
                        data-ocid={`passport.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">
                              Request #{Number(req.requestId)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {req.treatmentDescription}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${reimbStatusColor(req.status)}`}
                          >
                            {statusStr}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground text-xs">
                            Amount
                          </span>
                          <span className="text-yellow-400 font-bold">
                            ₹{(Number(req.amount) / 100).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
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
        <p className="mt-1">
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            DANTANOVA.14@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
