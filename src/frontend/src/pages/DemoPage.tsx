import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

const SCENE_DURATION = 4500; // ms per scene

const scenes = [
  {
    id: 1,
    title: "Meet Priya",
    text: "Meet Priya. She noticed some tooth pain...",
  },
  {
    id: 2,
    title: "She Opens DantaNova",
    text: "She opened DantaNova on her phone",
  },
  {
    id: 3,
    title: "Scanning Her Teeth",
    text: "She scanned her teeth using the camera",
  },
  {
    id: 4,
    title: "AI Analysis",
    text: "DantaNova's AI detected 2 cavities!",
  },
  {
    id: 5,
    title: "Cavity Alert",
    text: "A severity alert appeared on her results",
  },
  {
    id: 6,
    title: "Find Emergency Dentist",
    text: "She tapped 'Find Emergency Dentist'",
  },
  {
    id: 7,
    title: "Appointment Booked!",
    text: "Appointment booked in under 2 minutes!",
  },
  {
    id: 8,
    title: "Your Turn",
    text: "Your smile deserves the same care",
  },
];

// ─── SVG Characters & Illustrations ─────────────────────────────────────────

function GirlCharacter({ worried = false }: { worried?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 180"
      width="120"
      height="180"
      style={{ overflow: "visible" }}
      role="img"
      aria-label="Priya the dental patient character"
    >
      <title>Priya the dental patient character</title>
      {/* Body */}
      <ellipse cx="60" cy="150" rx="28" ry="35" fill="#7C3AED" opacity="0.9" />
      {/* Neck */}
      <rect x="52" y="100" width="16" height="18" rx="4" fill="#FBBF24" />
      {/* Head */}
      <circle cx="60" cy="82" r="30" fill="#FBBF24" />
      {/* Hair - long */}
      <ellipse cx="60" cy="62" rx="32" ry="22" fill="#1C1917" />
      <rect x="28" y="68" width="14" height="55" rx="7" fill="#1C1917" />
      <rect x="78" y="68" width="14" height="55" rx="7" fill="#1C1917" />
      {/* Hair top */}
      <ellipse cx="60" cy="54" rx="30" ry="16" fill="#1C1917" />
      {/* Eyes */}
      {worried ? (
        <>
          <ellipse cx="48" cy="84" rx="5" ry="4" fill="#1C1917" />
          <ellipse cx="72" cy="84" rx="5" ry="4" fill="#1C1917" />
          {/* Worried brows */}
          <path
            d="M43 77 Q48 73 53 77"
            stroke="#1C1917"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M67 77 Q72 73 77 77"
            stroke="#1C1917"
            strokeWidth="2"
            fill="none"
          />
          {/* Frown */}
          <path
            d="M50 97 Q60 92 70 97"
            stroke="#1C1917"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse cx="48" cy="84" rx="5" ry="4.5" fill="#1C1917" />
          <ellipse cx="72" cy="84" rx="5" ry="4.5" fill="#1C1917" />
          {/* Smile */}
          <path
            d="M50 96 Q60 103 70 96"
            stroke="#1C1917"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      {/* Cheek blush */}
      <circle cx="42" cy="92" r="5" fill="#FCA5A5" opacity="0.5" />
      <circle cx="78" cy="92" r="5" fill="#FCA5A5" opacity="0.5" />
      {/* Arms */}
      <rect
        x="18"
        y="118"
        width="14"
        height="38"
        rx="7"
        fill="#7C3AED"
        opacity="0.9"
      />
      <rect
        x="88"
        y="118"
        width="14"
        height="38"
        rx="7"
        fill="#7C3AED"
        opacity="0.9"
      />
      {/* Hands */}
      <circle cx="25" cy="158" r="8" fill="#FBBF24" />
      <circle cx="95" cy="158" r="8" fill="#FBBF24" />
      {/* Legs */}
      <rect x="43" y="178" width="14" height="30" rx="7" fill="#3730A3" />
      <rect x="63" y="178" width="14" height="30" rx="7" fill="#3730A3" />
    </svg>
  );
}

function PhoneMockup({
  glowing = false,
  children,
}: { glowing?: boolean; children?: React.ReactNode }) {
  return (
    <div
      style={{
        width: 120,
        height: 200,
        borderRadius: 18,
        border: `3px solid ${glowing ? "#D4AF37" : "#555"}`,
        background: glowing
          ? "linear-gradient(160deg, #1a1200 0%, #0a0a0a 100%)"
          : "#111",
        boxShadow: glowing
          ? "0 0 32px 8px #D4AF3760, 0 0 60px 2px #D4AF3730"
          : "0 4px 24px #0008",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",
        transition: "box-shadow 0.5s, border-color 0.5s",
        position: "relative",
      }}
    >
      {/* Notch */}
      <div
        style={{
          width: 40,
          height: 8,
          background: "#222",
          borderRadius: "0 0 8px 8px",
          marginTop: 6,
          marginBottom: 4,
        }}
      />
      {children}
    </div>
  );
}

// ─── Scene Components ─────────────────────────────────────────────────────────

function Scene1() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Bedroom background blobs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: "#1a0e02",
            borderRadius: "60% 60% 0 0 / 30% 30% 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            right: "8%",
            width: 80,
            height: 120,
            background: "#2a1a08",
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            right: "10%",
            width: 40,
            height: 20,
            background: "#D4AF3740",
            borderRadius: 4,
          }}
        />
      </div>
      <div className="relative z-10 animate-bounce-in">
        <GirlCharacter worried />
      </div>
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "18%",
          background: "#1a0e02",
          border: "2px solid #D4AF37",
          borderRadius: 12,
          padding: "8px 14px",
          zIndex: 20,
        }}
      >
        <span style={{ fontSize: 22 }}>😬</span>
        <span
          style={{
            color: "#D4AF37",
            fontSize: 12,
            display: "block",
            textAlign: "center",
          }}
        >
          ouch!
        </span>
      </div>
    </div>
  );
}

function Scene2() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ animation: "slideInUp 0.7s ease" }}>
        <PhoneMockup glowing>
          <div
            style={{ padding: "12px 10px", width: "100%", textAlign: "center" }}
          >
            {/* DantaNova logo */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "2.5px solid #D4AF37",
                margin: "8px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0a0800",
                boxShadow: "0 0 16px #D4AF3760",
                animation: "pulse 1.5s infinite",
              }}
            >
              <span style={{ fontSize: 26 }}>🦷</span>
            </div>
            <div
              style={{
                color: "#D4AF37",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              DantaNova
            </div>
            <div style={{ color: "#888", fontSize: 9, marginTop: 2 }}>
              AI Dental Scanner
            </div>
            <div
              style={{
                marginTop: 12,
                background: "#D4AF37",
                borderRadius: 20,
                padding: "4px 10px",
                color: "#000",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              Start Scan
            </div>
          </div>
        </PhoneMockup>
      </div>
    </div>
  );
}

function Scene3() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ position: "relative", animation: "slideInUp 0.6s ease" }}>
        <PhoneMockup>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Camera viewfinder */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "3px solid #22c55e",
                position: "relative",
                boxShadow: "0 0 20px #22c55e60",
                animation: "scanPulse 1.2s infinite",
              }}
            >
              {/* Scan line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 3,
                  background:
                    "linear-gradient(90deg, transparent, #22c55e, transparent)",
                  animation: "scanLine 1.5s linear infinite",
                  top: "50%",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  fontSize: 28,
                }}
              >
                😁
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                color: "#22c55e",
                fontSize: 8,
                letterSpacing: 1,
              }}
            >
              SCANNING...
            </div>
          </div>
        </PhoneMockup>
      </div>
    </div>
  );
}

function Scene4() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ animation: "fadeInScale 0.6s ease" }}>
        {/* 3D tooth icon */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, #fff8e1, #d4af37 60%, #b8860b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px #D4AF3780",
            fontSize: 50,
            margin: "0 auto",
            animation: "float 2s ease-in-out infinite",
          }}
        >
          🦷
        </div>
      </div>
      {/* Red dots on teeth */}
      <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
        {[14, 18].map((tooth) => (
          <div
            key={tooth}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "2px solid #ef4444",
              background: "#1a0000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulseDanger 0.8s infinite",
              boxShadow: "0 0 16px #ef444460",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
            <div style={{ color: "#ef4444", fontSize: 9, marginTop: 2 }}>
              #{tooth}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          color: "#ef4444",
          fontSize: 13,
          fontWeight: 700,
          animation: "bounceIn 0.5s ease",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 18 }}>⚠️</span> 2 Cavities Detected!
      </div>
    </div>
  );
}

function Scene5() {
  const [score, setScore] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 100;
      const interval = setInterval(() => {
        current -= 3;
        if (current <= 52) {
          clearInterval(interval);
          setScore(52);
          return;
        }
        setScore(current);
      }, 60);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      {/* Alert banner */}
      <div
        style={{
          background: "linear-gradient(90deg, #7f1d1d, #991b1b)",
          border: "2px solid #ef4444",
          borderRadius: 12,
          padding: "12px 18px",
          width: "100%",
          animation: "slideInDown 0.6s ease",
          boxShadow: "0 0 24px #ef444440",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5" }}>
          ⚠️ Moderate Severity Detected
        </div>
        <div style={{ fontSize: 11, color: "#fca5a5", marginTop: 4 }}>
          Cavities in Tooth #14 &amp; #18
        </div>
      </div>

      {/* Health score gauge */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>
          Health Score
        </div>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `conic-gradient(${score > 70 ? "#22c55e" : score > 40 ? "#f59e0b" : "#ef4444"} ${score * 3.6}deg, #222 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            transition: "background 0.1s",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color:
                  score > 70 ? "#22c55e" : score > 40 ? "#f59e0b" : "#ef4444",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene6() {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setClicked(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs">
      {/* Find Emergency Dentist button */}
      <button
        type="button"
        style={{
          background: clicked ? "#D4AF37" : "transparent",
          border: "2.5px solid #D4AF37",
          borderRadius: 30,
          padding: "12px 24px",
          color: clicked ? "#000" : "#D4AF37",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          animation: clicked
            ? "clickPop 0.3s ease"
            : "buttonPulse 1.2s infinite",
          boxShadow: "0 0 24px #D4AF3760",
          transition: "background 0.2s, color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>🚨</span> Find Emergency Dentist
      </button>

      {/* Dentist card slides in */}
      {clicked && (
        <div
          style={{
            background: "#0f0a00",
            border: "1.5px solid #D4AF37",
            borderRadius: 14,
            padding: "14px 16px",
            width: "100%",
            animation: "slideInUp 0.5s ease",
            boxShadow: "0 0 20px #D4AF3730",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #D4AF37, #8B6914)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              👩‍⚕️
            </div>
            <div>
              <div style={{ color: "#D4AF37", fontWeight: 700, fontSize: 13 }}>
                Dr. Ananya Sharma
              </div>
              <div style={{ color: "#888", fontSize: 11 }}>
                ⭐ 4.9 · Endodontist
              </div>
              <div
                style={{
                  color: "#22c55e",
                  fontSize: 10,
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                ✓ Available Today
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{
              marginTop: 10,
              width: "100%",
              background: "#D4AF37",
              border: "none",
              borderRadius: 20,
              padding: "8px",
              color: "#000",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 300 - 150,
    y: Math.random() * -200 - 20,
    color: ["#D4AF37", "#22c55e", "#60a5fa", "#f472b6", "#a78bfa"][i % 5],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.8,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "40%",
            width: p.size,
            height: p.size,
            borderRadius: 2,
            background: p.color,
            animation: `confetti 1.5s ease-out ${p.delay}s forwards`,
            transform: `translate(${p.x}px, ${p.y}px)`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

function Scene7() {
  return (
    <div
      className="flex flex-col items-center gap-4 w-full max-w-xs"
      style={{ position: "relative" }}
    >
      <Confetti />
      {/* Checkmark */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "radial-gradient(circle, #14532d, #052e16)",
          border: "3px solid #22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "bounceIn 0.6s ease",
          boxShadow: "0 0 40px #22c55e60",
          fontSize: 42,
          zIndex: 10,
          position: "relative",
        }}
      >
        ✅
      </div>
      <div
        style={{
          color: "#22c55e",
          fontWeight: 700,
          fontSize: 16,
          zIndex: 10,
          position: "relative",
        }}
      >
        Appointment Booked!
      </div>
      <div
        style={{
          background: "#0a1f0a",
          border: "1.5px solid #22c55e",
          borderRadius: 12,
          padding: "12px 16px",
          width: "100%",
          textAlign: "center",
          animation: "slideInUp 0.5s 0.4s ease both",
          zIndex: 10,
          position: "relative",
        }}
      >
        <div style={{ color: "#86efac", fontSize: 12 }}>
          Dr. Sharma confirmed your slot
        </div>
        <div
          style={{
            color: "#D4AF37",
            fontWeight: 700,
            fontSize: 14,
            marginTop: 4,
          }}
        >
          3:00 PM Today
        </div>
      </div>
    </div>
  );
}

function Scene8({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Logo */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "3px solid #D4AF37",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0800",
          boxShadow: "0 0 50px #D4AF3780, 0 0 100px #D4AF3730",
          fontSize: 48,
          animation: "float 2.5s ease-in-out infinite",
        }}
      >
        🦷
      </div>
      <div
        style={{
          color: "#D4AF37",
          fontWeight: 700,
          fontSize: 20,
          textAlign: "center",
          animation: "fadeIn 0.8s ease",
        }}
      >
        Your smile deserves the same care
      </div>
      <div
        style={{
          color: "#888",
          fontSize: 13,
          textAlign: "center",
          fontStyle: "italic",
          animation: "fadeIn 0.8s 0.3s ease both",
        }}
      >
        "Because Every Smile Matters The Most"
      </div>
      <button
        type="button"
        onClick={onStart}
        data-ocid="demo.start_scan.primary_button"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #B8860B)",
          border: "none",
          borderRadius: 30,
          padding: "16px 40px",
          color: "#000",
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer",
          boxShadow: "0 0 32px #D4AF3780",
          animation: "pulse 2s infinite, fadeIn 0.6s 0.6s ease both",
          marginTop: 8,
        }}
      >
        🦷 Start Your Scan →
      </button>
    </div>
  );
}

// ─── Main DemoPage ─────────────────────────────────────────────────────────────

export default function DemoPage() {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  const goToScene = useCallback((idx: number) => {
    setCurrentScene(Math.max(0, Math.min(scenes.length - 1, idx)));
    setSceneProgress(0);
  }, []);

  // Auto-advance scenes
  useEffect(() => {
    if (!playing || currentScene >= scenes.length - 1) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / SCENE_DURATION, 1);
      setSceneProgress(p);
      setProgress(((currentScene + p) / (scenes.length - 1)) * 100);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCurrentScene((s) => s + 1);
        setSceneProgress(0);
      }
    };
    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, currentScene]);

  // Update overall progress on last scene
  useEffect(() => {
    if (currentScene === scenes.length - 1) {
      setProgress(100);
    }
  }, [currentScene]);

  const timeRemaining = Math.ceil(
    (SCENE_DURATION * (1 - sceneProgress)) / 1000,
  );
  const scene = scenes[currentScene];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* CSS keyframes */}
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.4); }
          60% { opacity: 1; transform: scale(1.1); }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scanPulse {
          0%, 100% { box-shadow: 0 0 12px #22c55e60; transform: scale(1); }
          50% { box-shadow: 0 0 30px #22c55e90; transform: scale(1.04); }
        }
        @keyframes scanLine {
          0% { top: 8%; }
          50% { top: 90%; }
          100% { top: 8%; }
        }
        @keyframes pulseDanger {
          0%, 100% { box-shadow: 0 0 8px #ef444440; }
          50% { box-shadow: 0 0 20px #ef4444a0; transform: scale(1.08); }
        }
        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 0 16px #D4AF3760; }
          50% { box-shadow: 0 0 36px #D4AF37c0; transform: scale(1.04); }
        }
        @keyframes clickPop {
          0% { transform: scale(1); }
          40% { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        @keyframes confetti {
          0% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--tx, 80px), var(--ty, 120px)) rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.5) translateY(30px); }
          60% { transform: scale(1.08) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-bounce-in { animation: bounce-in 0.8s ease both; }
        .scene-enter { animation: fadeSceneIn 0.6s ease both; }
        @keyframes fadeSceneIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top progress bar */}
      <div
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}
      >
        <div style={{ height: 4, background: "#1a1a1a", width: "100%" }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #D4AF37, #f59e0b)",
              width: `${progress}%`,
              transition: "width 0.1s linear",
              boxShadow: "0 0 8px #D4AF3780",
            }}
          />
        </div>
      </div>

      {/* Back button */}
      <div style={{ position: "fixed", top: 16, left: 16, zIndex: 50 }}>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          data-ocid="demo.back.button"
          style={{
            background: "#111",
            border: "1px solid #333",
            borderRadius: 20,
            padding: "6px 14px",
            color: "#888",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Scene counter */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 50,
          color: "#555",
          fontSize: 12,
        }}
      >
        {currentScene + 1} / {scenes.length}
      </div>

      {/* Main scene area */}
      <div
        key={currentScene}
        className="scene-enter"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: 480,
          padding: "80px 24px 24px",
          position: "relative",
          minHeight: "70dvh",
        }}
      >
        {/* Scene visual */}
        <div style={{ marginBottom: 32, position: "relative" }}>
          {currentScene === 0 && <Scene1 />}
          {currentScene === 1 && <Scene2 />}
          {currentScene === 2 && <Scene3 />}
          {currentScene === 3 && <Scene4 />}
          {currentScene === 4 && <Scene5 />}
          {currentScene === 5 && <Scene6 />}
          {currentScene === 6 && <Scene7 />}
          {currentScene === 7 && (
            <Scene8 onStart={() => navigate({ to: "/" })} />
          )}
        </div>

        {/* Scene text (not shown for scene 8 which has its own) */}
        {currentScene < 7 && (
          <div style={{ textAlign: "center", maxWidth: 320 }}>
            <div
              style={{
                color: "#D4AF37",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
                opacity: 0.7,
              }}
            >
              {scene.title}
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.4,
                animation: "fadeIn 0.6s 0.3s ease both",
              }}
            >
              {scene.text}
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "16px 24px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Scene dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {scenes.map((_, idx) => (
            <button
              type="button"
              key={scenes[idx].id}
              data-ocid={`demo.scene.${idx + 1}`}
              onClick={() => {
                goToScene(idx);
                setPlaying(true);
              }}
              style={{
                width: idx === currentScene ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  idx === currentScene
                    ? "#D4AF37"
                    : idx < currentScene
                      ? "#D4AF3760"
                      : "#333",
                border: "none",
                cursor: "pointer",
                transition: "width 0.3s, background 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Prev */}
          <button
            type="button"
            onClick={() => {
              goToScene(currentScene - 1);
              setPlaying(true);
            }}
            disabled={currentScene === 0}
            data-ocid="demo.pagination_prev"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "1px solid #333",
              color: currentScene === 0 ? "#333" : "#888",
              cursor: currentScene === 0 ? "not-allowed" : "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            data-ocid="demo.toggle"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: playing ? "#D4AF37" : "#1a1a1a",
              border: "2px solid #D4AF37",
              color: playing ? "#000" : "#D4AF37",
              cursor: "pointer",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: playing ? "0 0 16px #D4AF3760" : "none",
              transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
            }}
          >
            {playing ? "⏸" : "▶"}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={() => {
              goToScene(currentScene + 1);
              setPlaying(true);
            }}
            disabled={currentScene === scenes.length - 1}
            data-ocid="demo.pagination_next"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "1px solid #333",
              color: currentScene === scenes.length - 1 ? "#333" : "#888",
              cursor:
                currentScene === scenes.length - 1 ? "not-allowed" : "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>

        {/* Time remaining */}
        {playing && currentScene < scenes.length - 1 && (
          <div style={{ color: "#444", fontSize: 11 }}>
            Next scene in {timeRemaining}s
          </div>
        )}
      </div>
    </div>
  );
}
