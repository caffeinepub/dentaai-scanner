import type { Message } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function MessagesPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams({ from: "/messages/$bookingId" });
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const bookingIdBig = BigInt(bookingId);
  const myPrincipalStr = identity?.getPrincipal().toString() ?? "";

  const fetchMessages = useCallback(async () => {
    if (!actor || !identity) return;
    try {
      const msgs = await actor.getBookingMessages(bookingIdBig);
      setMessages(msgs);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, [actor, identity, bookingIdBig]);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [actor, isFetching, identity, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendMessage = async () => {
    if (!actor || !identity || !text.trim()) return;
    setSending(true);
    try {
      await actor.sendMessage(bookingIdBig, text.trim());
      setText("");
      await fetchMessages();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to view messages
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="messages.primary_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/my-bookings" })}
          data-ocid="messages.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Chat</h1>
          <p className="text-xs text-muted-foreground">Booking #{bookingId}</p>
        </div>
      </header>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        data-ocid="messages.panel"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex items-center justify-center h-full"
            data-ocid="messages.empty_state"
          >
            <p className="text-sm text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender.toString() === myPrincipalStr;
            return (
              <motion.div
                key={msg.messageId.toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i < 10 ? i * 0.04 : 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                data-ocid={`messages.item.${i + 1}`}
              >
                <div
                  className={`max-w-[75%] rounded-3xl px-4 py-2.5 ${
                    isMe
                      ? "bg-yellow-500/20 border border-yellow-500/40 rounded-br-sm"
                      : "glass-card rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isMe ? "text-yellow-400/60" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(
                      Number(msg.timestamp / 1000000n),
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border/30 flex-shrink-0">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            className="rounded-full bg-background/60 border-border/40 flex-1"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            data-ocid="messages.input"
          />
          <Button
            className="rounded-full glow-primary px-4"
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            data-ocid="messages.submit_button"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <footer className="py-3 text-center text-xs text-muted-foreground border-t border-border/30 flex-shrink-0">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy
          </Link>
          {" · "}
          Developed by Swanandi Manoj Vispute ·{" "}
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
