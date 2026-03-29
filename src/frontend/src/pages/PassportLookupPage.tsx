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
  DollarSign,
  Loader2,
  Mail,
  QrCode,
  Search,
  Send,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
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

export default function PassportLookupPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [codeInput, setCodeInput] = useState("");
  const [looking, setLooking] = useState(false);
  const [passport, setPassport] = useState<DentalPassport | null>(null);

  const [treatmentDesc, setTreatmentDesc] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [myRequests, setMyRequests] = useState<ReimbursementRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoadingRequests(false);
      return;
    }
    const a = actor as any;
    a.getMyReimbursementRequests()
      .then((list: ReimbursementRequest[]) => setMyRequests(list))
      .catch(() => {})
      .finally(() => setLoadingRequests(false));
  }, [actor, isFetching, identity]);

  const lookupPassport = async () => {
    if (!actor || !codeInput.trim()) return;
    setLooking(true);
    setPassport(null);
    try {
      const a = actor as any;
      const result = await a.getPassportByCode(codeInput.trim());
      if (result) {
        setPassport(result);
        toast.success("Patient found!");
      } else {
        toast.error("No passport found with that code");
      }
    } catch {
      toast.error("Failed to look up passport");
    } finally {
      setLooking(false);
    }
  };

  const submitReimbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !passport) return;
    const amountCents = Math.round(Number.parseFloat(amountInput || "0") * 100);
    if (Number.isNaN(amountCents) || amountCents <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!treatmentDesc.trim()) {
      toast.error("Please describe the treatment");
      return;
    }
    setSubmitting(true);
    try {
      const a = actor as any;
      const result = await a.submitReimbursementRequest(
        passport.passportCode,
        treatmentDesc.trim(),
        BigInt(amountCents),
      );
      if ("ok" in result) {
        toast.success("Billing request submitted!");
        setTreatmentDesc("");
        setAmountInput("");
        try {
          const updated = await a.getMyReimbursementRequests();
          setMyRequests(updated);
        } catch {
          // ignore refresh errors
        }
      } else {
        toast.error(result.err ?? "Failed to submit request");
      }
    } catch {
      toast.error("Failed to submit reimbursement request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to look up patient passports
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="passport_lookup.primary_button"
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
          data-ocid="passport_lookup.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Passport Lookup</h1>
          <p className="text-xs text-muted-foreground">
            Look up a patient passport by code
          </p>
        </div>
        <Link to="/qr">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-yellow-500/40 text-yellow-400 gap-1.5"
            data-ocid="passport_lookup.link"
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Code
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Lookup Box */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 mb-6"
          style={{
            border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
            boxShadow: "0 0 30px oklch(0.72 0.15 85 / 0.1)",
          }}
        >
          <h2 className="font-display font-bold text-base mb-1">
            Look Up Patient by Passport Code
          </h2>
          <p className="text-xs text-muted-foreground mb-1">
            Ask the patient for their unique passport code (e.g. DP-123).
          </p>
          <p className="text-xs mb-4" style={{ color: "oklch(0.72 0.15 85)" }}>
            💡 Tip: Ask the patient to open <strong>My Dental Passport</strong>{" "}
            → tap <strong>Share Code</strong>
          </p>
          <div className="flex gap-2">
            <Input
              className="rounded-2xl bg-background/60 border-border/40 flex-1 font-mono tracking-widest text-yellow-300"
              placeholder="e.g. DP-123"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && lookupPassport()}
              data-ocid="passport_lookup.search_input"
            />
            <Button
              className="rounded-full glow-primary px-5"
              onClick={lookupPassport}
              disabled={looking || !codeInput.trim()}
              data-ocid="passport_lookup.primary_button"
            >
              {looking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Patient Found Banner + Details */}
        {passport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-5 mb-8"
          >
            {/* Patient Found heading */}
            <div
              className="flex items-center gap-3 rounded-3xl px-5 py-4"
              style={{
                background: "oklch(0.22 0.08 85 / 0.3)",
                border: "1.5px solid oklch(0.72 0.15 85 / 0.6)",
                boxShadow: "0 0 24px oklch(0.72 0.15 85 / 0.15)",
              }}
              data-ocid="passport_lookup.success_state"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(0.72 0.15 85 / 0.2)",
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.7)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-display font-bold text-base">
                  Patient Found — Ready to Treat
                </p>
                <p className="text-xs text-muted-foreground">
                  Full patient records loaded below
                </p>
              </div>
              <Badge className="ml-auto bg-green-500/15 text-green-400 border-green-500/30">
                Active
              </Badge>
            </div>

            {/* Passport Details */}
            <div
              className="glass-card rounded-3xl p-6"
              style={{
                border: "1.5px solid oklch(0.72 0.15 85 / 0.6)",
                boxShadow: "0 0 40px oklch(0.72 0.15 85 / 0.15)",
              }}
              data-ocid="passport_lookup.card"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold">Patient Passport</h3>
                <code
                  className="ml-auto text-xs font-mono px-2 py-1 rounded-lg"
                  style={{
                    background: "oklch(0.15 0.06 85 / 0.8)",
                    border: "1px solid oklch(0.72 0.15 85 / 0.5)",
                    color: "oklch(0.9 0.18 85)",
                  }}
                >
                  {passport.passportCode}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {passport.allergies && (
                  <div
                    className="rounded-2xl p-3 flex items-start gap-2"
                    style={{
                      background: "oklch(0.35 0.18 20 / 0.15)",
                      border: "1px solid oklch(0.55 0.18 20 / 0.4)",
                    }}
                  >
                    <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-1">
                        ⚠ Allergies
                      </p>
                      <p className="text-sm text-red-200">
                        {passport.allergies}
                      </p>
                    </div>
                  </div>
                )}
                <div className="glass-card rounded-2xl p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Pre-Approved Budget
                  </p>
                  <p className="text-xl font-bold text-yellow-400">
                    ${(Number(passport.preApprovedBudget) / 100).toFixed(2)}
                  </p>
                </div>
                {passport.currentConditions && (
                  <div className="glass-card rounded-2xl p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Current Conditions
                    </p>
                    <p className="text-sm">{passport.currentConditions}</p>
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
                {passport.notes && (
                  <div className="glass-card rounded-2xl p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Dentist Notes
                    </p>
                    <p className="text-sm">{passport.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bill Home Dentist form */}
            <form
              onSubmit={submitReimbursement}
              className="glass-card rounded-3xl p-6 flex flex-col gap-4"
              data-ocid="passport_lookup.panel"
            >
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold">
                  Bill Home Dentist for Treatment
                </h3>
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                After treating the patient, submit a billing request to their
                home dentist. Platform fee: 8%.
              </p>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Treatment Description *
                </span>
                <Textarea
                  className="rounded-2xl bg-background/60 border-border/40 min-h-[80px]"
                  placeholder="Describe the treatment performed..."
                  value={treatmentDesc}
                  onChange={(e) => setTreatmentDesc(e.target.value)}
                  required
                  data-ocid="passport_lookup.textarea"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Amount (USD) *
                </span>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="250.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  required
                  data-ocid="passport_lookup.input"
                />
                {amountInput && Number.parseFloat(amountInput) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    You receive:{" "}
                    <span className="text-yellow-400 font-semibold">
                      ${(Number.parseFloat(amountInput) * 0.92).toFixed(2)}
                    </span>{" "}
                    after 8% platform fee
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="rounded-full glow-primary w-full"
                disabled={submitting}
                data-ocid="passport_lookup.submit_button"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {submitting
                  ? "Submitting..."
                  : "Bill Home Dentist for Treatment"}
              </Button>
            </form>
          </motion.div>
        )}

        {/* My Submitted Requests */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">
            My Billing Requests
          </h2>
          {loadingRequests ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
            </div>
          ) : myRequests.length === 0 ? (
            <div
              className="glass-card rounded-3xl p-8 text-center"
              data-ocid="passport_lookup.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No billing requests submitted yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myRequests.map((req, i) => {
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
                    data-ocid={`passport_lookup.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                          Request #{Number(req.requestId)}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {req.treatmentDescription}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold shrink-0 ${reimbStatusColor(req.status)}`}
                      >
                        {statusStr}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Amount
                      </span>
                      <div className="text-right">
                        <span className="text-yellow-400 font-bold text-sm">
                          ${(Number(req.amount) / 100).toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          (-{(Number(req.platformFee) / 100).toFixed(2)} fee)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
