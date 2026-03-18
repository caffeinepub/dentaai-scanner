import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Download, LogIn, LogOut, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const logoSrc = "/assets/uploads/file_00000000a88c720bbdf9639edb08e122-3-1.png";

// Minimal QR code generator using canvas
// Uses the QR code API via an img tag with a data URL fallback
function useQRCode(value: string, size = 260) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    // Use a reliable QR code generation approach via canvas drawing
    // We encode a simple URL-based QR image from the QuickChart API
    const url = `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=${size}&margin=1`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      setImgSrc(canvas.toDataURL("image/png"));
    };
    img.src = url;
  }, [value, size]);

  return { canvasRef, imgSrc };
}

export default function QRCodePage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const appUrl = window.location.href.split("/qr")[0];
  const { canvasRef, imgSrc } = useQRCode(appUrl, 260);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = "dantanova-qr.png";
    a.href = url;
    a.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "DantaNova", url: appUrl });
    } else {
      await navigator.clipboard.writeText(appUrl);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      <header className="grid grid-cols-3 items-center px-6 py-4 md:px-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          data-ocid="qr.link"
          className="justify-start rounded-full px-4 w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center gap-2">
          <div
            className="flex items-center justify-center rounded-full overflow-hidden"
            style={{ width: 36, height: 36, border: "2px solid #c9a84c" }}
          >
            <img
              src={logoSrc}
              alt="DantaNova"
              style={{ width: 28, height: 28, objectFit: "contain" }}
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Danta<span className="text-yellow-400">Nova</span>
          </span>
        </div>
        <div className="flex justify-end">
          {identity ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              data-ocid="qr.secondary_button"
              className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => login()}
              data-ocid="qr.primary_button"
              className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-md w-full"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Scan to Open <span className="text-yellow-400">DantaNova</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Point your phone camera at this code to open DantaNova instantly.
          </p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-3xl p-6 mb-4 flex flex-col items-center"
            style={{
              background: "#0a0a0a",
              border: "2px solid #c9a84c",
              boxShadow: "0 0 24px #c9a84c55",
            }}
          >
            {/* QR code canvas (hidden) + visible img */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 10,
                display: "inline-block",
                width: 280,
                height: 280,
              }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="QR Code"
                  style={{ width: 260, height: 260, display: "block" }}
                />
              ) : (
                <div
                  style={{
                    width: 260,
                    height: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontSize: 13,
                  }}
                >
                  Loading QR...
                </div>
              )}
            </div>

            <p
              className="mt-4 font-mono tracking-wide text-center whitespace-nowrap overflow-hidden"
              style={{
                color: "#c9a84c",
                fontSize: "7px",
                maxWidth: 280,
                textOverflow: "ellipsis",
              }}
            >
              {appUrl}
            </p>
          </motion.div>

          <div className="flex gap-3 w-full max-w-xs mt-2">
            <Button
              className="flex-1 rounded-full font-semibold"
              style={{ background: "#c9a84c", color: "#000" }}
              onClick={handleDownload}
              data-ocid="qr.download_button"
              disabled={!imgSrc}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              style={{ borderColor: "#c9a84c", color: "#c9a84c" }}
              onClick={handleShare}
              data-ocid="qr.share_button"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>© 2026 DantaNova. Because Every Smile Matters The Most.</p>
      </footer>
    </div>
  );
}
