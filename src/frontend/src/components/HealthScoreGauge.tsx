import { useEffect, useRef, useState } from "react";

interface Props {
  score: number;
}

export default function HealthScoreGauge({ score }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
      setMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const progress = animatedScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  // Color based on score threshold using OKLCH
  const color =
    score >= 70
      ? "oklch(0.72 0.18 142)"
      : score >= 40
        ? "oklch(0.82 0.18 75)"
        : "oklch(0.62 0.22 25)";

  const label = score >= 70 ? "Excellent" : score >= 40 ? "Fair" : "Needs Care";

  const filterColor =
    score >= 70
      ? "oklch(0.72 0.18 142 / 0.7)"
      : score >= 40
        ? "oklch(0.82 0.18 75 / 0.7)"
        : "oklch(0.62 0.22 25 / 0.7)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-44 h-44" ref={containerRef}>
        {/* Pulsing outer ring */}
        <div
          className="animate-ring-pulse rounded-full absolute inset-[-6px] pointer-events-none"
          style={{ border: `1.5px solid ${color}` }}
        />

        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full opacity-25 blur-xl"
          style={{ backgroundColor: color }}
        />

        <svg
          viewBox="0 0 180 180"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
          style={{
            filter: `drop-shadow(0 0 12px ${filterColor})`,
          }}
        >
          {/* Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="oklch(0.22 0.03 75)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? strokeDashoffset : circumference}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-bold" style={{ color }}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
            Score
          </span>
        </div>
      </div>
      <div
        className="text-sm font-semibold uppercase tracking-widest"
        style={{ color }}
      >
        {label}
      </div>
    </div>
  );
}
