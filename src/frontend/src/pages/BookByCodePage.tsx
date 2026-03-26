import type { AvailabilitySlot, DentistProfile } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarCheck, Loader2, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function BookByCodePage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();

  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [dentistProfile, setDentistProfile] = useState<DentistProfile | null>(
    null,
  );
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<bigint | null>(null);
  const [booking, setBooking] = useState(false);
  const [dentistPrincipalStr, setDentistPrincipalStr] = useState("");

  const searchDentist = async () => {
    if (!actor || !code.trim()) return;
    setSearching(true);
    setDentistProfile(null);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal = Principal.fromText(code.trim());
      const [profile, availableSlots] = await Promise.all([
        actor.getDentistProfile(principal),
        actor.getDentistSlots(principal),
      ]);
      if (!profile) {
        toast.error("No dentist found with that booking code.");
        return;
      }
      setDentistProfile(profile);
      setSlots(availableSlots.filter((s) => !s.isBooked));
      setDentistPrincipalStr(code.trim());
    } catch {
      toast.error("Invalid booking code. Please check and try again.");
    } finally {
      setSearching(false);
    }
  };

  const bookAppointment = async () => {
    if (!actor || !identity || selectedSlot === null) return;
    setBooking(true);
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal = Principal.fromText(dentistPrincipalStr);
      const bookingId = await actor.bookSlot(principal, selectedSlot);
      toast.success(
        `Appointment booked! Booking ID: #${Number(bookingId)}. Waiting for dentist confirmation.`,
      );
      navigate({ to: "/my-bookings" });
    } catch (err: any) {
      toast.error(err?.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm text-center">
          Sign in to book an appointment
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="book.primary_button"
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
          onClick={() => navigate({ to: "/find-dentist" })}
          data-ocid="book.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">
            Book by Dentist Code
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter the dentist's booking code to see their slots
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full flex flex-col gap-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-5 flex flex-col gap-3"
          data-ocid="book.panel"
        >
          <p className="text-sm font-semibold text-yellow-400">
            Enter Dentist's Booking Code
          </p>
          <p className="text-xs text-muted-foreground">
            Ask your dentist to share their Principal ID (booking code) from
            their dashboard.
          </p>
          <div className="flex gap-2">
            <Input
              className="rounded-2xl bg-background/60 border-border/40 flex-1 text-xs"
              placeholder="e.g. 2vxsx-fae..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              data-ocid="book.input"
            />
            <Button
              className="rounded-full glow-primary px-4"
              onClick={searchDentist}
              disabled={searching || !code.trim()}
              data-ocid="book.primary_button"
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Dentist Profile */}
        {dentistProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="circle-icon w-12 h-12 bg-yellow-500/10 border border-yellow-500/40">
                <span className="text-yellow-400 font-bold text-lg">
                  {dentistProfile.name[0]}
                </span>
              </div>
              <div>
                <p className="font-display font-bold">{dentistProfile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {dentistProfile.specialty} · {dentistProfile.location}
                </p>
              </div>
            </div>

            {/* Slots */}
            <div>
              <p className="text-sm font-semibold mb-2">
                Available Slots ({slots.length})
              </p>
              {slots.length === 0 ? (
                <p
                  className="text-xs text-muted-foreground"
                  data-ocid="book.empty_state"
                >
                  No available slots at the moment.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {slots.map((slot, i) => (
                    <button
                      type="button"
                      key={slot.slotId.toString()}
                      onClick={() => setSelectedSlot(slot.slotId)}
                      data-ocid={`book.item.${i + 1}`}
                      className={`text-left px-4 py-3 rounded-2xl border text-sm transition-all ${
                        selectedSlot === slot.slotId
                          ? "bg-yellow-500/20 border-yellow-500/60 text-yellow-300 shadow-[0_0_12px_2px_oklch(0.78_0.16_80/0.2)]"
                          : "bg-background/40 border-border/30 hover:border-yellow-500/30 hover:text-yellow-400"
                      }`}
                    >
                      {slot.dateTimeLabel}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {slots.length > 0 && (
              <Button
                className="rounded-full glow-primary"
                disabled={selectedSlot === null || booking}
                onClick={bookAppointment}
                data-ocid="book.submit_button"
              >
                {booking ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CalendarCheck className="w-4 h-4 mr-2" />
                )}
                {booking ? "Booking..." : "Confirm Appointment"}
              </Button>
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
      </footer>
    </div>
  );
}
