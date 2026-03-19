import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Loader2, LogIn, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FloatingFeedback() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      if (actor) {
        await (actor as any).submitFeedback(text.trim());
      }
      toast.success("Thank you for your feedback!");
      setText("");
      setOpen(false);
    } catch {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="feedback.open_modal_button"
          aria-label="Leave feedback"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center glow-primary circle-glow-ring transition-transform hover:scale-110 active:scale-95"
          style={{
            background: "oklch(0.78 0.16 80)",
            color: "oklch(0.08 0.005 60)",
          }}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent
        data-ocid="feedback.dialog"
        className="max-w-sm rounded-3xl glass-card border-border/60"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-gradient-gold">
            Share Your Feedback
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Help us improve DantaNova — tell us what you think!
          </DialogDescription>
        </DialogHeader>

        {!identity ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-muted-foreground text-center">
              You need to sign in before submitting feedback.
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                login();
              }}
              data-ocid="feedback.signin_button"
              className="rounded-full px-6 glow-primary"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              data-ocid="feedback.textarea"
              placeholder="Your thoughts, suggestions, or issues..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="rounded-2xl resize-none border-border/60 focus:border-primary/60 bg-card/60"
            />
            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                data-ocid="feedback.cancel_button"
                className="rounded-full px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                data-ocid="feedback.submit_button"
                className="rounded-full px-6 glow-primary"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {loading ? "Sending..." : "Send Feedback"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
