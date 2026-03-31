import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DentistRegisterPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    licenseNumber: "",
    location: "",
    bio: "",
    languages: "",
  });

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setChecking(false);
      return;
    }
    const principal = identity.getPrincipal();
    actor
      .getDentistProfile(principal)
      .then((profile) => {
        if (profile) {
          setIsUpdate(true);
          setForm({
            name: profile.name,
            email: profile.email ?? "",
            specialty: profile.specialty,
            licenseNumber: profile.licenseNumber,
            location: profile.location,
            bio: profile.bio,
            languages: profile.languages.join(", "),
          });
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [actor, isFetching, identity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity) return;
    setLoading(true);
    try {
      const profile = {
        name: form.name.trim(),
        email: form.email.trim(),
        specialty: form.specialty.trim(),
        licenseNumber: form.licenseNumber.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        languages: form.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        isVerified: false,
      };
      if (isUpdate) {
        await actor.updateDentistProfile(profile);
        toast.success("Profile updated successfully!");
      } else {
        await actor.registerDentistProfile(profile);
        toast.success("Registered as a dentist!");
      }
      navigate({ to: "/dentist-dashboard" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm text-center">
          Sign in to register as a dentist
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="dentist_register.primary_button"
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
          data-ocid="dentist_register.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">
            {isUpdate ? "Update Dentist Profile" : "Register as Dentist"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Join the DantaNova dentist network
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {checking ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="circle-icon w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500/40 circle-glow-ring">
                <Stethoscope className="w-7 h-7 text-yellow-400" />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 flex flex-col gap-5"
              data-ocid="dentist_register.panel"
            >
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="Dr. Jane Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  data-ocid="dentist_register.input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  type="email"
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="doctor@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  data-ocid="dentist_register.input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Specialty
                </Label>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="e.g. General Dentistry, Orthodontics"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialty: e.target.value }))
                  }
                  required
                  data-ocid="dentist_register.input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  License Number
                </Label>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="MH-DEN-12345"
                  value={form.licenseNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, licenseNumber: e.target.value }))
                  }
                  required
                  data-ocid="dentist_register.input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Location
                </Label>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="City, State"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  required
                  data-ocid="dentist_register.input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Languages (comma-separated)
                </Label>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="English, Hindi, Marathi"
                  value={form.languages}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, languages: e.target.value }))
                  }
                  data-ocid="dentist_register.input"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">Bio</Label>
                <Textarea
                  className="rounded-2xl bg-background/60 border-border/40 resize-none"
                  placeholder="Brief description of your experience and approach..."
                  rows={3}
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  data-ocid="dentist_register.textarea"
                />
              </div>

              <Button
                type="submit"
                className="rounded-full glow-primary mt-2"
                disabled={loading}
                data-ocid="dentist_register.submit_button"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {loading
                  ? "Saving..."
                  : isUpdate
                    ? "Update Profile"
                    : "Register as Dentist"}
              </Button>
            </form>
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
