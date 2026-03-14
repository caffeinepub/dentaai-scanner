import type { ScanResult, ToothRecord, ToothStatus } from "@/types";

const CONDITION_MAP: Record<
  ToothStatus,
  Array<{ condition: string; recommendation: string }>
> = {
  healthy: [
    {
      condition: "Healthy",
      recommendation: "Excellent! Keep brushing twice daily and flossing.",
    },
  ],
  risk: [
    {
      condition: "Early Plaque Buildup",
      recommendation:
        "Professional cleaning recommended within 3 months. Improve brushing technique.",
    },
    {
      condition: "Gingivitis Risk",
      recommendation:
        "Increase flossing frequency. Consider antibacterial mouthwash.",
    },
    {
      condition: "Enamel Erosion",
      recommendation:
        "Reduce acidic food intake. Use fluoride toothpaste. Consult dentist.",
    },
    {
      condition: "Tooth Crack Risk",
      recommendation:
        "Avoid hard foods and ice. A dental checkup within 1 month is advised.",
    },
    {
      condition: "Gum Recession",
      recommendation:
        "Use a soft-bristle toothbrush. Schedule a periodontal screening.",
    },
  ],
  cavity: [
    {
      condition: "Surface Cavity",
      recommendation:
        "Schedule a dental appointment within 2 weeks for a filling.",
    },
    {
      condition: "Deep Cavity",
      recommendation:
        "Urgent dental care needed. Risk of nerve involvement if untreated.",
    },
    {
      condition: "Root Canal Risk",
      recommendation:
        "Immediate dental consultation required. May need endodontic treatment.",
    },
  ],
};

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateScanResult(imageCount = 5): ScanResult {
  const seed = (Date.now() + imageCount * 7919) & 0x7fffffff;
  const rng = seededRng(seed);

  const teeth: ToothRecord[] = [];

  for (let i = 0; i < 32; i++) {
    const r = rng();
    let status: ToothStatus;
    if (r < 0.6) {
      status = "healthy";
    } else if (r < 0.85) {
      status = "risk";
    } else {
      status = "cavity";
    }

    const options = CONDITION_MAP[status];
    const optionIndex = Math.floor(rng() * options.length);
    const { condition, recommendation } = options[optionIndex];

    teeth.push({
      number: BigInt(i + 1),
      status,
      condition,
      recommendation,
    });
  }

  const issueTeeth = teeth.filter((t) => t.status !== "healthy");
  const cavityCount = teeth.filter((t) => t.status === "cavity").length;
  const riskCount = teeth.filter((t) => t.status === "risk").length;
  const overallScore = Math.max(
    0,
    Math.min(100, 100 - cavityCount * 8 - riskCount * 3),
  );

  void issueTeeth;

  return {
    teeth,
    overallScore: BigInt(overallScore),
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  };
}
