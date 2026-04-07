import type { AvailabilitySlot, Booking, DentistProfile } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarPlus,
  Check,
  CheckCircle,
  Copy,
  Loader2,
  MessageSquare,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

function statusColor(status: string) {
  const s = typeof status === "string" ? status : Object.keys(status as any)[0];
  if (s === "confirmed")
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (s === "declined") return "bg-red-500/15 text-red-400 border-red-500/30";
  if (s === "completed")
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

function reimbStatusColor(status: any): string {
  const s = typeof status === "string" ? status : Object.keys(status)[0];
  if (s === "approved")
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (s === "declined") return "bg-red-500/15 text-red-400 border-red-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

function getStatusStr(status: any): string {
  if (typeof status === "string") return status;
  return Object.keys(status)[0];
}

export default function DentistDashboardPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [profile, setProfile] = useState<DentistProfile | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reimbRequests, setReimbRequests] = useState<ReimbursementRequest[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState("");
  const [addingSlot, setAddingSlot] = useState(false);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    const p = identity.getPrincipal();
    const a = actor as any;
    Promise.all([
      actor.getDentistProfile(p),
      actor.getDentistSlots(p),
      actor.getDentistBookings(),
      a
        .getReimbursementRequestsForMe()
        .catch(() => [] as ReimbursementRequest[]),
    ])
      .then(([prof, sl, bk, reimb]) => {
        setProfile(prof);
        setSlots(sl as AvailabilitySlot[]);
        setBookings(bk as Booking[]);
        setReimbRequests(reimb as ReimbursementRequest[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, isFetching, identity]);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile?.email ?? "");
    toast.success("Booking email copied!");
  };

  const addSlot = async () => {
    if (!actor || !newSlot.trim()) return;
    setAddingSlot(true);
    try {
      await actor.addAvailabilitySlot(newSlot.trim());
      const p = identity!.getPrincipal();
      const updated = await actor.getDentistSlots(p);
      setSlots(updated);
      setNewSlot("");
      toast.success("Slot added!");
    } catch {
      toast.error("Failed to add slot");
    } finally {
      setAddingSlot(false);
    }
  };

  const removeSlot = async (slotId: bigint) => {
    if (!actor) return;
    try {
      await actor.removeAvailabilitySlot(slotId);
      setSlots((prev) => prev.filter((s) => s.slotId !== slotId));
      toast.success("Slot removed");
    } catch {
      toast.error("Failed to remove slot");
    }
  };

  const confirmBooking = async (bookingId: bigint) => {
    if (!actor) return;
    try {
      await actor.confirmBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "confirmed" as any } : b,
        ),
      );
      toast.success("Booking confirmed!");
    } catch {
      toast.error("Failed to confirm");
    }
  };

  const declineBooking = async (bookingId: bigint) => {
    if (!actor) return;
    try {
      await actor.declineBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "declined" as any } : b,
        ),
      );
      toast.success("Booking declined");
    } catch {
      toast.error("Failed to decline");
    }
  };

  const completeBooking = async (bookingId: bigint) => {
    if (!actor) return;
    try {
      await actor.completeBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "completed" as any } : b,
        ),
      );
      toast.success("Marked as completed");
    } catch {
      toast.error("Failed to complete");
    }
  };

  const settleReimbursement = async (requestId: bigint, approve: boolean) => {
    if (!actor) return;
    try {
      const a = actor as any;
      const result = await a.settleReimbursement(requestId, approve);
      if ("ok" in result) {
        const newStatus = approve ? "approved" : "declined";
        setReimbRequests((prev) =>
          prev.map((r) =>
            r.requestId === requestId ? { ...r, status: newStatus } : r,
          ),
        );
        toast.success(
          approve ? "Reimbursement approved!" : "Reimbursement declined",
        );
      } else {
        toast.error(result.err ?? "Failed to settle");
      }
    } catch {
      toast.error("Failed to settle reimbursement");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to access your dashboard
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="dentist_dashboard.primary_button"
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
          data-ocid="dentist_dashboard.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Dentist Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            {profile?.name ?? "Your dentist portal"}
          </p>
        </div>
        {!profile && !loading && (
          <Button
            size="sm"
            className="rounded-full glow-primary text-xs"
            onClick={() => navigate({ to: "/dentist-register" })}
            data-ocid="dentist_dashboard.primary_button"
          >
            Register
          </Button>
        )}
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          </div>
        ) : !profile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 text-center flex flex-col items-center gap-4"
            data-ocid="dentist_dashboard.panel"
          >
            <div className="circle-icon w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500/40">
              <Stethoscope className="w-7 h-7 text-yellow-400" />
            </div>
            <h2 className="font-display font-bold text-xl">Not Registered</h2>
            <p className="text-sm text-muted-foreground">
              You haven't registered as a dentist yet.
            </p>
            <Button
              className="rounded-full glow-primary"
              onClick={() => navigate({ to: "/dentist-register" })}
              data-ocid="dentist_dashboard.primary_button"
            >
              Register as Dentist
            </Button>
          </motion.div>
        ) : (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList
              className="w-full rounded-full bg-muted/30 mb-6"
              data-ocid="dentist_dashboard.tab"
            >
              <TabsTrigger
                value="profile"
                className="rounded-full flex-1 text-xs"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="availability"
                className="rounded-full flex-1 text-xs"
              >
                Availability
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="rounded-full flex-1 text-xs"
              >
                Bookings
              </TabsTrigger>
              <TabsTrigger
                value="passport"
                className="rounded-full flex-1 text-xs"
              >
                Passport
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="glass-card rounded-3xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="circle-icon w-12 h-12 bg-yellow-500/10 border border-yellow-500/40">
                      <span className="text-yellow-400 font-bold text-lg">
                        {profile.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile.specialty}
                      </p>
                    </div>
                    {profile.isVerified && (
                      <Badge className="ml-auto bg-green-500/15 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Email: </span>
                      {profile.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">License: </span>
                      {profile.licenseNumber}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Location: </span>
                      {profile.location}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Languages: </span>
                      {profile.languages.join(", ")}
                    </p>
                    {profile.bio && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4 rounded-full border-yellow-500/30 text-yellow-400"
                    onClick={() => navigate({ to: "/dentist-register" })}
                    data-ocid="dentist_dashboard.edit_button"
                  >
                    Edit Profile
                  </Button>
                </div>

                {/* Booking Email */}
                <div className="glass-card rounded-3xl p-5">
                  <p className="text-sm font-semibold text-yellow-400 mb-2">
                    Your Booking Email
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Share your email address with patients so they can book
                    appointments with you.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-3 py-2 text-yellow-300 break-all">
                      {profile.email || "No email set — update your profile"}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-9 w-9 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 flex-shrink-0"
                      onClick={copyEmail}
                      disabled={!profile.email}
                      data-ocid="dentist_dashboard.toggle"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Passport Quick Links */}
                <div className="glass-card rounded-3xl p-5 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-yellow-400 mb-1">
                    Dental Passport Tools
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      className="rounded-full glow-primary text-xs"
                      onClick={() => navigate({ to: "/issue-passport" })}
                      data-ocid="dentist_dashboard.primary_button"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1" />
                      Issue a Passport
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-yellow-500/30 text-yellow-400 text-xs"
                      onClick={() => navigate({ to: "/passport-lookup" })}
                      data-ocid="dentist_dashboard.secondary_button"
                    >
                      Lookup Patient Passport
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="glass-card rounded-3xl p-5">
                  <p className="text-sm font-semibold mb-3">
                    Add Available Slot
                  </p>
                  <div className="flex gap-2">
                    <Input
                      className="rounded-2xl bg-background/60 border-border/40 flex-1"
                      placeholder="e.g. Mon Mar 28 10:00 AM"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      data-ocid="dentist_dashboard.input"
                    />
                    <Button
                      className="rounded-full glow-primary px-4"
                      onClick={addSlot}
                      disabled={addingSlot || !newSlot.trim()}
                      data-ocid="dentist_dashboard.primary_button"
                    >
                      {addingSlot ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CalendarPlus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {slots.length === 0 ? (
                    <div
                      className="glass-card rounded-3xl p-6 text-center"
                      data-ocid="dentist_dashboard.empty_state"
                    >
                      <p className="text-sm text-muted-foreground">
                        No slots added yet. Add availability above.
                      </p>
                    </div>
                  ) : (
                    slots.map((slot, i) => (
                      <motion.div
                        key={slot.slotId.toString()}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between"
                        data-ocid={`dentist_dashboard.item.${i + 1}`}
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {slot.dateTimeLabel}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {slot.isBooked ? "Booked" : "Available"}
                          </p>
                        </div>
                        {!slot.isBooked && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full h-8 w-8 text-red-400 hover:bg-red-500/10"
                            onClick={() => removeSlot(slot.slotId)}
                            data-ocid={`dentist_dashboard.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {bookings.length === 0 ? (
                  <div
                    className="glass-card rounded-3xl p-8 text-center"
                    data-ocid="dentist_dashboard.empty_state"
                  >
                    <p className="text-sm text-muted-foreground">
                      No bookings yet.
                    </p>
                  </div>
                ) : (
                  bookings.map((bk, i) => {
                    const statusStr = getStatusStr(bk.status);
                    const slot = slots.find((s) => s.slotId === bk.slotId);
                    return (
                      <motion.div
                        key={bk.bookingId.toString()}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card rounded-3xl p-4 flex flex-col gap-3"
                        data-ocid={`dentist_dashboard.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Booking #{Number(bk.bookingId)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Slot:{" "}
                              {slot?.dateTimeLabel ?? `#${Number(bk.slotId)}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Patient: {bk.patientId.toString().slice(0, 16)}...
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusColor(bk.status)}`}
                          >
                            {statusStr}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {statusStr === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 text-xs px-3"
                                onClick={() => confirmBooking(bk.bookingId)}
                                data-ocid="dentist_dashboard.confirm_button"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="rounded-full text-red-400 hover:bg-red-500/10 text-xs px-3"
                                onClick={() => declineBooking(bk.bookingId)}
                                data-ocid="dentist_dashboard.cancel_button"
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                          {statusStr === "confirmed" && (
                            <Button
                              size="sm"
                              className="rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 text-xs px-3"
                              onClick={() => completeBooking(bk.bookingId)}
                              data-ocid="dentist_dashboard.save_button"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full text-yellow-400 hover:bg-yellow-500/10 text-xs px-3"
                            onClick={() =>
                              navigate({
                                to: "/messages/$bookingId",
                                params: {
                                  bookingId: bk.bookingId.toString(),
                                },
                              })
                            }
                            data-ocid="dentist_dashboard.link"
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </TabsContent>

            {/* Passport Tab */}
            <TabsContent value="passport">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div
                  className="glass-card rounded-3xl p-4 flex items-start gap-3 mb-1"
                  style={{
                    border: "1px solid oklch(0.72 0.15 85 / 0.4)",
                    background: "oklch(0.15 0.06 85 / 0.15)",
                  }}
                >
                  <BookOpen className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reimbursement requests from traveling dentists who treated
                    your patients. Approve or decline each request — payment is
                    settled minus the 8% platform fee.
                  </p>
                </div>

                <div className="flex gap-2 mb-2">
                  <Button
                    size="sm"
                    className="rounded-full glow-primary text-xs"
                    onClick={() => navigate({ to: "/issue-passport" })}
                    data-ocid="dentist_dashboard.primary_button"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    Issue Passport
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-yellow-500/30 text-yellow-400 text-xs"
                    onClick={() => navigate({ to: "/passport-lookup" })}
                    data-ocid="dentist_dashboard.secondary_button"
                  >
                    Lookup Patient
                  </Button>
                </div>

                <h3 className="font-display font-semibold text-base">
                  Incoming Reimbursement Requests
                </h3>

                {reimbRequests.length === 0 ? (
                  <div
                    className="glass-card rounded-3xl p-8 text-center"
                    data-ocid="dentist_dashboard.empty_state"
                  >
                    <p className="text-sm text-muted-foreground">
                      No reimbursement requests yet.
                    </p>
                  </div>
                ) : (
                  reimbRequests.map((req, i) => {
                    const statusStr =
                      typeof req.status === "string"
                        ? req.status
                        : Object.keys(req.status)[0];
                    const netAmount =
                      Number(req.amount) - Number(req.platformFee);
                    return (
                      <motion.div
                        key={req.requestId.toString()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card rounded-3xl p-4 flex flex-col gap-3"
                        data-ocid={`dentist_dashboard.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Request #{Number(req.requestId)}
                            </p>
                            <p className="text-sm font-medium line-clamp-2">
                              {req.treatmentDescription}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Traveling dentist:{" "}
                              {req.travelingDentistId.toString().slice(0, 14)}
                              ...
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-semibold shrink-0 ${reimbStatusColor(req.status)}`}
                          >
                            {statusStr}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="glass-card rounded-xl p-2">
                            <p className="text-xs text-muted-foreground">
                              Amount
                            </p>
                            <p className="text-sm font-bold text-yellow-400">
                              ₹{(Number(req.amount) / 100).toFixed(2)}
                            </p>
                          </div>
                          <div className="glass-card rounded-xl p-2">
                            <p className="text-xs text-muted-foreground">
                              Platform Fee
                            </p>
                            <p className="text-sm font-bold text-muted-foreground">
                              ₹{(Number(req.platformFee) / 100).toFixed(2)}
                            </p>
                          </div>
                          <div className="glass-card rounded-xl p-2">
                            <p className="text-xs text-muted-foreground">
                              You Pay
                            </p>
                            <p
                              className="text-sm font-bold"
                              style={{ color: "oklch(0.75 0.18 145)" }}
                            >
                              ₹{(netAmount / 100).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {statusStr === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 text-xs px-3 flex-1"
                              onClick={() =>
                                settleReimbursement(req.requestId, true)
                              }
                              data-ocid="dentist_dashboard.confirm_button"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-full text-red-400 hover:bg-red-500/10 text-xs px-3 flex-1"
                              onClick={() =>
                                settleReimbursement(req.requestId, false)
                              }
                              data-ocid="dentist_dashboard.cancel_button"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
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
