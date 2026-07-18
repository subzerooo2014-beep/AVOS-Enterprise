export type CustomerValueRecord = {
  id: string;
  name: string;
  segment: "vip" | "high_value" | "growth" | "at_risk";
  lifetimeValue: number;
  monthlyRevenue: number;
  retentionScore: number;
  churnRisk: number;
  satisfactionScore: number;
  lastActivity: string;
  servicesUsed: number;
  owner: string;
  recommendation: string;
  nextBestActions: string[];
};

export const customerValueRecords: CustomerValueRecord[] = [
  {
    id: "CV-2701",
    name: "عميل VIP — دبي",
    segment: "vip",
    lifetimeValue: 184000,
    monthlyRevenue: 14800,
    retentionScore: 96,
    churnRisk: 7,
    satisfactionScore: 94,
    lastActivity: "منذ ساعتين",
    servicesUsed: 7,
    owner: "Premium Care",
    recommendation: "تقديم مدير حساب شخصي وباقة صيانة سنوية.",
    nextBestActions: ["تفعيل مدير حساب", "عرض باقة سنوية", "دعوة لخدمة VIP"],
  },
  {
    id: "CV-2702",
    name: "عميل مرتفع القيمة — أبوظبي",
    segment: "high_value",
    lifetimeValue: 126000,
    monthlyRevenue: 9200,
    retentionScore: 88,
    churnRisk: 18,
    satisfactionScore: 86,
    lastActivity: "أمس",
    servicesUsed: 5,
    owner: "Customer Success",
    recommendation: "إطلاق عرض مخصص قبل انتهاء عقد الصيانة.",
    nextBestActions: ["تجديد مبكر", "خصم مخصص", "اتصال استباقي"],
  },
  {
    id: "CV-2703",
    name: "عميل نمو — الشارقة",
    segment: "growth",
    lifetimeValue: 64000,
    monthlyRevenue: 6100,
    retentionScore: 79,
    churnRisk: 22,
    satisfactionScore: 82,
    lastActivity: "منذ 3 أيام",
    servicesUsed: 4,
    owner: "Growth Team",
    recommendation: "تفعيل Cross-sell لخدمات الفحص والتأمين.",
    nextBestActions: ["Cross-sell", "حملة مخصصة", "تذكير صيانة"],
  },
  {
    id: "CV-2704",
    name: "عميل معرض للفقد — دبي",
    segment: "at_risk",
    lifetimeValue: 98000,
    monthlyRevenue: 3200,
    retentionScore: 54,
    churnRisk: 72,
    satisfactionScore: 61,
    lastActivity: "منذ أسبوعين",
    servicesUsed: 6,
    owner: "Retention Desk",
    recommendation: "فتح خطة استرداد فورية وتعويض مخصص.",
    nextBestActions: ["اتصال عاجل", "تعويض مخصص", "مراجعة تجربة"],
  },
  {
    id: "CV-2705",
    name: "عميل مرتفع القيمة — العين",
    segment: "high_value",
    lifetimeValue: 111000,
    monthlyRevenue: 7800,
    retentionScore: 91,
    churnRisk: 12,
    satisfactionScore: 90,
    lastActivity: "منذ 5 ساعات",
    servicesUsed: 5,
    owner: "Enterprise Care",
    recommendation: "ترقية العميل إلى برنامج الولاء المتقدم.",
    nextBestActions: ["ترقية الولاء", "عرض حصري", "حجز أولوية"],
  },
];

export const customerSegmentLabels = {
  vip: "VIP",
  high_value: "مرتفع القيمة",
  growth: "نمو",
  at_risk: "معرض للفقد",
} as const;
