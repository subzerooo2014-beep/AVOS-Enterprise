export type RevenueMarginRecord = {
  id: string;
  service: string;
  region: string;
  revenue: number;
  grossMargin: number;
  targetMargin: number;
  conversionRate: number;
  demandIndex: number;
  pricingMode: "fixed" | "dynamic" | "promotional";
  status: "healthy" | "watch" | "opportunity" | "critical";
  owner: string;
  opportunityValue: number;
  recommendation: string;
  actions: string[];
};

export const revenueMarginRecords: RevenueMarginRecord[] = [
  {
    id: "RM-2601",
    service: "خدمات الطوارئ",
    region: "دبي",
    revenue: 248000,
    grossMargin: 31,
    targetMargin: 36,
    conversionRate: 68,
    demandIndex: 92,
    pricingMode: "dynamic",
    status: "opportunity",
    owner: "Revenue Operations",
    opportunityValue: 28500,
    recommendation: "رفع السعر الديناميكي بنسبة 7% لمدة 4 ساعات.",
    actions: ["رفع السعر", "مراقبة التحويل", "إعادة التقييم بعد ساعتين"],
  },
  {
    id: "RM-2602",
    service: "الفحص الشامل",
    region: "أبوظبي",
    revenue: 184000,
    grossMargin: 42,
    targetMargin: 40,
    conversionRate: 73,
    demandIndex: 78,
    pricingMode: "fixed",
    status: "healthy",
    owner: "Inspection Revenue",
    opportunityValue: 9000,
    recommendation: "الحفاظ على السعر الحالي ورفع السعة تدريجياً.",
    actions: ["مراقبة الطلب", "زيادة السعة"],
  },
  {
    id: "RM-2603",
    service: "الصيانة المتنقلة",
    region: "الشارقة",
    revenue: 126000,
    grossMargin: 24,
    targetMargin: 34,
    conversionRate: 61,
    demandIndex: 84,
    pricingMode: "promotional",
    status: "critical",
    owner: "Mobile Services",
    opportunityValue: 41000,
    recommendation: "إيقاف الخصم العام واستهداف شرائح محددة فقط.",
    actions: ["إيقاف الخصم", "إعادة تسعير", "تقليل تكلفة التوصيل"],
  },
  {
    id: "RM-2604",
    service: "التفصيل والعناية",
    region: "عجمان",
    revenue: 97000,
    grossMargin: 38,
    targetMargin: 39,
    conversionRate: 76,
    demandIndex: 71,
    pricingMode: "fixed",
    status: "watch",
    owner: "Care Revenue",
    opportunityValue: 12500,
    recommendation: "إطلاق باقات مرتفعة الهامش بدلاً من الخصومات.",
    actions: ["إنشاء باقات", "اختبار Upsell"],
  },
  {
    id: "RM-2605",
    service: "خدمات المركبات الكهربائية",
    region: "دبي",
    revenue: 312000,
    grossMargin: 29,
    targetMargin: 35,
    conversionRate: 81,
    demandIndex: 96,
    pricingMode: "dynamic",
    status: "opportunity",
    owner: "EV Revenue",
    opportunityValue: 56000,
    recommendation: "رفع السعر وتقليل الاعتماد على المزود الأعلى تكلفة.",
    actions: ["تحسين التخصيص", "تعديل السعر", "مراجعة تكلفة المزود"],
  },
];

export const revenueStatusLabels = {
  healthy: "سليم",
  watch: "مراقبة",
  opportunity: "فرصة",
  critical: "حرج",
} as const;

export const pricingModeLabels = {
  fixed: "ثابت",
  dynamic: "ديناميكي",
  promotional: "ترويجي",
} as const;
