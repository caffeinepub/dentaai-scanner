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
    {
      condition: "Optimal Enamel",
      recommendation:
        "Tooth enamel is in excellent condition. Maintain routine dental hygiene.",
    },
    {
      condition: "No Detectable Issues",
      recommendation:
        "No signs of disease. Continue with regular 6-month check-ups.",
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
    {
      condition: "Dental Hypersensitivity",
      recommendation:
        "Use desensitizing toothpaste. Avoid very hot or cold foods. Consult dentist.",
    },
    {
      condition: "Calculus (Tartar) Deposit",
      recommendation:
        "Professional scaling required. Improve daily flossing and brushing habits.",
    },
    {
      condition: "Bruxism Signs",
      recommendation:
        "Signs of teeth grinding detected. Ask your dentist about a night guard.",
    },
    {
      condition: "Periodontal Pocket Risk",
      recommendation:
        "Early periodontal pocketing suspected. Deep cleaning and monitoring advised.",
    },
    {
      condition: "Interproximal Staining",
      recommendation:
        "Staining between teeth detected. Improve interdental brushing or flossing.",
    },
    {
      condition: "Mild Tooth Discoloration",
      recommendation:
        "Surface stains detected. Consider professional whitening and avoid staining foods.",
    },
    {
      condition: "Dry Socket Risk",
      recommendation:
        "Reduced saliva flow signs. Stay hydrated and consult a dentist if discomfort persists.",
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
    {
      condition: "Interproximal Cavity",
      recommendation:
        "Cavity between teeth detected. Prompt dental visit required before spreading.",
    },
    {
      condition: "Secondary Caries",
      recommendation:
        "Decay around an existing filling detected. Replacement filling needed urgently.",
    },
    {
      condition: "Cervical Caries",
      recommendation:
        "Decay at the gum line detected. Dental treatment required to prevent bone loss.",
    },
    {
      condition: "Pulpitis (Pulp Inflammation)",
      recommendation:
        "Tooth pulp may be inflamed. Seek immediate dental care to avoid abscess.",
    },
    {
      condition: "Periapical Abscess Risk",
      recommendation:
        "Signs of infection at root tip. Urgent dental assessment and possible antibiotics needed.",
    },
    {
      condition: "Tooth Fracture with Decay",
      recommendation:
        "Cracked tooth with decay detected. Immediate dental evaluation for possible crown or extraction.",
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
