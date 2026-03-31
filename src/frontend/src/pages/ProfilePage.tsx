import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useScanHistory } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, LogIn, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { data: history, isLoading } = useScanHistory();

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const principalId = identity?.getPrincipal().toString() ?? "";
  const shortId = principalId ? `${principalId.slice(0, 10)}...` : "";

  useEffect(() => {
    if (!actor || isFetching || !identity) return;
    actor
      .getCallerUserProfile()
      .then((p) => {
        if (p) {
          setProfileName(p.name);
          setProfileEmail(p.email ?? "");
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, [actor, isFetching, identity]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSavingProfile(true);
    try {
      await actor.saveCallerUserProfile({
        name: profileName.trim(),
        email: profileEmail.trim(),
      });
      toast.success("Profile saved successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

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

          {/* Profile edit card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="glass-card rounded-3xl p-5"
          >
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "#c9a84c" }}
            >
              Personal Information
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Add your name and email so dentists and the platform can identify
              you.
            </p>
            {!profileLoaded && isFetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
              </div>
            ) : (
              <form
                onSubmit={saveProfile}
                className="flex flex-col gap-4"
                data-ocid="profile.panel"
              >
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    className="rounded-2xl bg-background/60 border-border/40"
                    placeholder="Your full name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    data-ocid="profile.input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    className="rounded-2xl bg-background/60 border-border/40"
                    placeholder="your@email.com"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    data-ocid="profile.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-full glow-primary"
                  disabled={savingProfile}
                  data-ocid="profile.save_button"
                >
                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
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
