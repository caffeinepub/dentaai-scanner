import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Trash2, UserLock } from "lucide-react";
import { useState } from "react";

const CONSENT_KEY = "dantanova_consent_v1";

function hasConsented(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return true;
  }
}

export default function ConsentModal() {
  const [open, setOpen] = useState(!hasConsented());
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "true");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}} data-ocid="consent.dialog">
      <DialogContent
        className="rounded-3xl border border-primary/30 max-w-sm mx-auto p-6 [&>button]:hidden"
        style={{
          background: "oklch(0.08 0.01 90)",
          boxShadow: "0 0 40px oklch(0.65 0.15 85 / 0.2)",
        }}
      >
        <DialogHeader className="flex flex-col items-center text-center gap-3 mb-2">
          <div
            className="flex items-center justify-center rounded-full overflow-hidden mb-1"
            style={{
              width: 64,
              height: 64,
              border: "2px solid #c9a84c",
              boxShadow: "0 0 16px #c9a84c44",
            }}
          >
            <img
              src="/assets/uploads/file_00000000a88c720bbdf9639edb08e122-3-1.png"
              alt="DantaNova"
              style={{ width: 50, height: 50, objectFit: "contain" }}
            />
          </div>
          <DialogTitle className="font-display text-xl font-bold">
            Welcome to <span style={{ color: "#c9a84c" }}>DantaNova</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Before you begin, here's how we handle your data:
          </p>
        </DialogHeader>

        <ul className="flex flex-col gap-3 mb-5">
          {[
            {
              icon: ShieldCheck,
              text: "Scan results are saved to your account on the ICP blockchain — private and secure.",
            },
            {
              icon: UserLock,
              text: "Your data is only visible to you. No one else can access your scans.",
            },
            {
              icon: Trash2,
              text: "You can delete all your data anytime from your Profile page.",
            },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <div className="circle-icon w-8 h-8 bg-primary/15 flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {text}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 mb-5">
          <Checkbox
            id="consent-check"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(!!v)}
            data-ocid="consent.checkbox"
            className="rounded-sm border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="consent-check"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            I understand and agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button
          className="w-full rounded-full font-semibold"
          style={agreed ? { background: "#c9a84c", color: "#000" } : {}}
          disabled={!agreed}
          onClick={handleAccept}
          data-ocid="consent.confirm_button"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
