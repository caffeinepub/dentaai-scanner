import type { Booking } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getStatusStr(status: any): string {
  if (typeof status === "string") return status;
  return Object.keys(status)[0];
}

function getPaymentStr(payment: any): string {
  if (typeof payment === "string") return payment;
  return Object.keys(payment)[0];
}

function statusColor(status: string) {
  if (status === "confirmed")
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (status === "declined")
    return "bg-red-500/15 text-red-400 border-red-500/30";
  if (status === "completed")
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    actor
      .getPatientBookings()
      .then((bks) => setBookings(bks))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, isFetching, identity]);

  const markPaid = async (bookingId: bigint) => {
    if (!actor) return;
    try {
      await actor.markPaymentPaid(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, paymentStatus: "paid" as any }
            : b,
        ),
      );
      toast.success("Payment marked as paid!");
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm text-center">
          Sign in to view your bookings
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="my_bookings.primary_button"
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
          data-ocid="my_bookings.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">My Bookings</h1>
          <p className="text-xs text-muted-foreground">
            Your appointment history
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full glow-primary text-xs"
          onClick={() => navigate({ to: "/book" })}
          data-ocid="my_bookings.primary_button"
        >
          + New Booking
        </Button>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 text-center flex flex-col items-center gap-4"
            data-ocid="my_bookings.empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No bookings yet. Book an appointment with a dentist!
            </p>
            <Button
              className="rounded-full glow-primary"
              onClick={() => navigate({ to: "/book" })}
              data-ocid="my_bookings.primary_button"
            >
              Book Appointment
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3" data-ocid="my_bookings.list">
            {bookings.map((bk, i) => {
              const statusStr = getStatusStr(bk.status);
              const paymentStr = getPaymentStr(bk.paymentStatus);
              return (
                <motion.div
                  key={bk.bookingId.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-3xl p-4 flex flex-col gap-3"
                  data-ocid={`my_bookings.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">
                        Booking #{Number(bk.bookingId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dentist: {bk.dentistId.toString().slice(0, 16)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(
                          Number(bk.createdAt / 1000000n),
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusColor(statusStr)}`}
                      >
                        {statusStr}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                          paymentStr === "paid"
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : paymentStr === "released"
                              ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                              : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        💳 {paymentStr}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statusStr === "confirmed" && paymentStr === "unpaid" && (
                      <Button
                        size="sm"
                        className="rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 text-xs px-3"
                        onClick={() => markPaid(bk.bookingId)}
                        data-ocid="my_bookings.primary_button"
                      >
                        Mark Payment Paid
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-yellow-400 hover:bg-yellow-500/10 text-xs px-3"
                      onClick={() =>
                        navigate({
                          to: "/messages/$bookingId",
                          params: { bookingId: bk.bookingId.toString() },
                        })
                      }
                      data-ocid="my_bookings.link"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Chat
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
