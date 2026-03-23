import { Cookie } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "dantanova_cookie_dismissed";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          data-ocid="cookie_notice.toast"
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/50 bg-background/95 backdrop-blur-md px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <Cookie className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-muted-foreground flex-1">
            DantaNova uses local browser storage to save your session and
            preferences.{" "}
            <strong className="text-foreground">
              No tracking cookies are used.
            </strong>{" "}
            See our{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
          <button
            type="button"
            data-ocid="cookie_notice.confirm_button"
            onClick={dismiss}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
