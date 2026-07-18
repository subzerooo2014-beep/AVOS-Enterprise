export type CapacityDemandRecord = {
  id: string;
  region: string;
  service: string;
  demandNow: number;
  capacityNow: number;
  forecastDemand: number;
  utilization: number;
  status: "balanced" | "watch" | "overloaded" | "underused";
  owner: string;
  peakWindow: string;
  revenueAtRisk: number;
  recommendation: string;
  actions: string[];
};

export const capacityDemandRecords: CapacityDemandRecord[] = [
  {
    id: "CD-2501",
    region: "دبي",
    service: "المركبات الكهربائية",
    demandNow: 94,
    capacityNow: 78,
    forecastDemand: 112,
    utilization: 96,
    status: "overloaded",
    owner: "Service Operations",
    peakWindow: "10:00 - 14:00",
    revenueAtRisk: 72000,
    recommendation: "نقل 3 فنيين وتفعيل مزود احتياطي.",
    actions: ["إعادة توزيع السعة", "تفعيل مزود بديل", "رفع أولوية الطلبات"],
  },
  {
    id: "CD-2502",
    region: "أبوظبي",
    service: "الفحص الشامل",
    demandNow: 71,
    capacityNow: 84,
    forecastDemand: 79,
    utilization: 84,
    status: "balanced",
    owner: "Inspection Network",
    peakWindow: "11:00 - 15:00",
    revenueAtRisk: 12000,
    recommendation: "الحفاظ على التوزيع الحالي مع مراقبة الذروة.",
    actions: ["مراقبة الطلب", "تأكيد الجاهزية"],
  },
  {
    id: "CD-2503",
    region: "الشارقة",
    service: "الصيانة المتنقلة",
    demandNow: 62,
    capacityNow: 58,
    forecastDemand: 83,
    utilization: 91,
    status: "watch",
    owner: "Mobile Service Team",
    peakWindow: "12:00 - 17:00",
    revenueAtRisk: 31000,
    recommendation: "زيادة نافذة العمل ساعتين وتحويل بعض الطلبات.",
    actions: ["تمديد ساعات العمل", "إعادة توجيه الطلبات"],
  },
  {
    id: "CD-2504",
    region: "العين",
    service: "الطوارئ",
    demandNow: 38,
    capacityNow: 65,
    forecastDemand: 44,
    utilization: 58,
    status: "underused",
    owner: "Emergency Services",
    peakWindow: "17:00 - 21:00",
    revenueAtRisk: 0,
    recommendation: "تحويل جزء من السعة إلى أبوظبي مؤقتاً.",
    actions: ["نقل السعة", "إعادة جدولة الورديات"],
  },
  {
    id: "CD-2505",
    region: "عجمان",
    service: "التفصيل والعناية",
    demandNow: 49,
    capacityNow: 52,
    forecastDemand: 61,
    utilization: 88,
    status: "watch",
    owner: "Care Services",
    peakWindow: "15:00 - 20:00",
    revenueAtRisk: 18500,
    recommendation: "فتح نافذة حجوزات إضافية في المساء.",
    actions: ["فتح مواعيد إضافية", "تحفيز مزودين"],
  },
];

export const capacityStatusLabels = {
  balanced: "متوازن",
  watch: "مراقبة",
  overloaded: "ضغط مرتفع",
  underused: "سعة فائضة",
} as const;
