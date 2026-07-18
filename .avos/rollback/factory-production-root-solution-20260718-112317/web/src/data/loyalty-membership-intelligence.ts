export type LoyaltyMember = {
  id: string;
  name: string;
  tier: "silver" | "gold" | "platinum" | "elite";
  points: number;
  annualSpend: number;
  visits: number;
  benefitsUsed: number;
  retentionScore: number;
  upgradeProbability: number;
  status: "active" | "watch" | "expiring";
  lastActivity: string;
  owner: string;
  recommendation: string;
  nextBestActions: string[];
};

export const loyaltyMembers: LoyaltyMember[] = [
  {
    id: "LM-2801",
    name: "عضو Elite — دبي",
    tier: "elite",
    points: 48200,
    annualSpend: 186000,
    visits: 24,
    benefitsUsed: 11,
    retentionScore: 97,
    upgradeProbability: 0,
    status: "active",
    lastActivity: "منذ ساعتين",
    owner: "Premium Loyalty",
    recommendation: "تجديد تلقائي مع مزايا حصرية وخدمة أولوية.",
    nextBestActions: ["تجديد تلقائي", "مزايا حصرية", "دعوة VIP"],
  },
  {
    id: "LM-2802",
    name: "عضو Platinum — أبوظبي",
    tier: "platinum",
    points: 31800,
    annualSpend: 124000,
    visits: 18,
    benefitsUsed: 8,
    retentionScore: 91,
    upgradeProbability: 78,
    status: "active",
    lastActivity: "أمس",
    owner: "Customer Success",
    recommendation: "عرض ترقية إلى Elite مع رصيد إضافي.",
    nextBestActions: ["عرض ترقية", "رصيد إضافي", "حجز أولوية"],
  },
  {
    id: "LM-2803",
    name: "عضو Gold — الشارقة",
    tier: "gold",
    points: 17400,
    annualSpend: 68000,
    visits: 12,
    benefitsUsed: 5,
    retentionScore: 82,
    upgradeProbability: 64,
    status: "watch",
    lastActivity: "منذ 6 أيام",
    owner: "Growth Loyalty",
    recommendation: "تنشيط العضو بعرض صيانة ومضاعفة النقاط.",
    nextBestActions: ["مضاعفة النقاط", "عرض صيانة", "تنبيه مخصص"],
  },
  {
    id: "LM-2804",
    name: "عضو Silver — عجمان",
    tier: "silver",
    points: 6200,
    annualSpend: 29000,
    visits: 6,
    benefitsUsed: 2,
    retentionScore: 66,
    upgradeProbability: 41,
    status: "expiring",
    lastActivity: "منذ 3 أسابيع",
    owner: "Retention Desk",
    recommendation: "حملة إنقاذ قبل انتهاء العضوية.",
    nextBestActions: ["تجديد مخفض", "اتصال استباقي", "هدية نقاط"],
  },
  {
    id: "LM-2805",
    name: "عضو Platinum — دبي",
    tier: "platinum",
    points: 28900,
    annualSpend: 109000,
    visits: 16,
    benefitsUsed: 7,
    retentionScore: 89,
    upgradeProbability: 72,
    status: "active",
    lastActivity: "منذ 5 ساعات",
    owner: "Enterprise Loyalty",
    recommendation: "إضافة مزايا شريك تأمين وتمويل.",
    nextBestActions: ["مزايا تأمين", "مزايا تمويل", "عرض ترقية"],
  },
];

export const loyaltyTierLabels = {
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  elite: "Elite",
} as const;

export const loyaltyStatusLabels = {
  active: "نشط",
  watch: "مراقبة",
  expiring: "قريب الانتهاء",
} as const;
