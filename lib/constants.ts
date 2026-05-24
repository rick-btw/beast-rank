export const RANK_BUCKETS = ["S", "A", "B", "C", "D", "F", "HAVENT_TRIED"] as const;
export const TIER_BUCKETS = ["S", "A", "B", "C", "D", "F"] as const;

export type RankBucket = (typeof RANK_BUCKETS)[number];

export const BUCKET_META: Record<
  RankBucket,
  {
    label: string;
    title: string;
    tone: string;
    border: string;
  }
> = {
  S: {
    label: "S",
    title: "Apex",
    tone: "from-acid/25 via-cyan/15 to-transparent",
    border: "border-acid/45"
  },
  A: {
    label: "A",
    title: "Elite",
    tone: "from-cyan/22 via-acid/10 to-transparent",
    border: "border-cyan/40"
  },
  B: {
    label: "B",
    title: "Loaded",
    tone: "from-magenta/20 via-cyan/10 to-transparent",
    border: "border-magenta/35"
  },
  C: {
    label: "C",
    title: "Solid",
    tone: "from-amber/18 via-white/5 to-transparent",
    border: "border-amber/35"
  },
  D: {
    label: "D",
    title: "Niche",
    tone: "from-white/10 via-cyan/5 to-transparent",
    border: "border-white/20"
  },
  F: {
    label: "F",
    title: "Crash",
    tone: "from-red-500/20 via-magenta/8 to-transparent",
    border: "border-red-400/35"
  },
  HAVENT_TRIED: {
    label: "?",
    title: "Haven't Tried Yet",
    tone: "from-white/8 via-cyan/8 to-transparent",
    border: "border-white/15"
  }
};

export const CATEGORY_ORDER = [
  "Original",
  "Ultra",
  "Juice/Punch",
  "Rehab",
  "Java",
  "Nitro",
  "Reserve",
  "Hydro",
  "Tea",
  "Limited/Regional"
] as const;

export const AUTH_COOKIE = "beast_rank_session";
