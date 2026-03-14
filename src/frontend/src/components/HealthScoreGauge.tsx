import { useEffect, useState } from "react";

interface Props {
  score: number;
}

export default function HealthScoreGauge({ score }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const progress = animatedScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Fair" : "Needs Care";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-44 h-44">
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ backgroundColor: color }}
        />
        <svg
          viewBox="0 0 180 180"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="oklch(0.22 0.03 252)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease",
              filter: `drop-shadow(0 0 8px ${color}88)`,
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
