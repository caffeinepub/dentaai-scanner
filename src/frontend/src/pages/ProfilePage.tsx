import LogoCircle from "@/components/LogoCircle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useScanHistory } from "@/hooks/useQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, LogIn, ShieldCheck, Trash2, User } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: history, isLoading } = useScanHistory();
  const { actor } = useActor();
  const qc = useQueryClient();

  const { mutate: deleteScans, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      await actor.deleteUserScans();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scanHistory"] });
      qc.invalidateQueries({ queryKey: ["latestScan"] });
      toast.success("All your data has been deleted.");
      navigate({ to: "/" });
    },
    onError: () => {
      toast.error("Failed to delete data. Please try again.");
    },
  });

  const principalId = identity?.getPrincipal().toString() ?? "";
  const shortId = principalId ? `${principalId.slice(0, 10)}...` : "";

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="grid grid-cols-3 items-center px-6 py-4 border-b border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            data-ocid="profile.link"
            className="justify-start rounded-full px-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center gap-2">
            <LogoCircle size="sm" />
            <span className="font-display font-bold text-lg">
              Danta<span className="text-primary">Nova</span>
            </span>
          </div>
          <div />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-5 py-20 text-center px-4">
          <div className="circle-icon w-20 h-20 bg-primary/10 circle-glow-ring">
            <LogIn className="w-9 h-9 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl">Sign In Required</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs">
              Sign in to view your profile and manage your data.
            </p>
          </div>
          <Button
            size="lg"
            className="rounded-full px-8 glow-primary"
            onClick={() => login()}
            data-ocid="profile.primary_button"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-ocid="profile.page"
    >
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-4 border-b border-border/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          data-ocid="profile.link"
          className="justify-start rounded-full px-4 w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center gap-2">
          <LogoCircle size="sm" />
          <span className="font-display font-bold text-lg">
            Danta<span className="text-primary">Nova</span>
          </span>
        </div>
        <div />
      </header>

      <main className="flex-1 px-4 py-8 max-w-md mx-auto w-full flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-display text-2xl font-bold mb-6"
            style={{ color: "#c9a84c" }}
          >
            My Profile
          </h1>

          {/* Identity card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="glass-card rounded-3xl p-5 flex items-center gap-4 mb-4"
          >
            <div className="circle-icon w-14 h-14 bg-primary/15 circle-glow-ring flex-shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                Your Account ID
              </p>
              <p
                className="font-mono text-sm font-semibold truncate"
                style={{ color: "#c9a84c" }}
                data-ocid="profile.card"
              >
                {shortId}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Internet Identity
              </p>
            </div>
          </motion.div>

          {/* Scan count */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="glass-card rounded-3xl p-5 flex items-center gap-4 mb-4"
          >
            <div className="circle-icon w-14 h-14 bg-primary/15 flex-shrink-0">
              {isLoading ? (
                <Skeleton className="w-8 h-6 rounded-full" />
              ) : (
                <span className="font-display text-xl font-bold text-primary">
                  {history?.length ?? 0}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">Total Scans</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All dental scans saved to your account
              </p>
            </div>
          </motion.div>

          {/* Privacy info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="glass-card rounded-3xl p-5 flex items-center gap-4 mb-6"
          >
            <div className="circle-icon w-10 h-10 bg-primary/10 flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data is stored securely on the ICP blockchain and is only
                visible to you.{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Delete data */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  data-ocid="profile.delete_button"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className="rounded-3xl border border-red-500/30 max-w-sm"
                style={{ background: "oklch(0.08 0.01 90)" }}
                data-ocid="profile.dialog"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Delete all data?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-sm">
                    This will permanently delete all your scan history from
                    DantaNova. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="rounded-full"
                    data-ocid="profile.cancel_button"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => deleteScans()}
                    disabled={isDeleting}
                    data-ocid="profile.confirm_button"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
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
