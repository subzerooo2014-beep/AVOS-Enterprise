export type FocusPriority = {
  id: string;
  title: string;
  description: string;
  owner: string;
  category: "operations" | "revenue" | "quality" | "risk" | "growth";
  urgency: "medium" | "high" | "critical";
  status: "planned" | "active" | "blocked" | "completed";
  progress: number;
  dueAt: string;
  impact: string;
  nextAction: string;
};

export const focusPriorities: FocusPriority[] = [
  {
    id: "FP-1901",
    title: "حماية SLA في دبي والشارقة",
    description: "إعادة توزيع السعة ورفع التغطية في فترة الذروة.",
    owner: "مركز العمليات",
    category: "operations",
    urgency: "critical",
    status: "active",
    progress: 68,
    dueAt: "اليوم 11:00",
    impact: "خفض تجاوزات SLA بنسبة 41%.",
    nextAction: "اعتماد نقل 3 فنيين.",
  },
  {
    id: "FP-1902",
    title: "تحسين هامش خدمات الطوارئ",
    description: "مراجعة السعر الديناميكي ومعدل التحويل.",
    owner: "إدارة الإيرادات",
    category: "revenue",
    urgency: "high",
    status: "planned",
    progress: 34,
    dueAt: "اليوم 13:00",
    impact: "زيادة متوقعة 29K AED.",
    nextAction: "اعتماد تعديل السعر بنسبة 7%.",
  },
  {
    id: "FP-1903",
    title: "إغلاق حالات استرداد التجربة",
    description: "إكمال الحالات المفتوحة للعملاء مرتفعي القيمة.",
    owner: "إدارة الجودة",
    category: "quality",
    urgency: "high",
    status: "active",
    progress: 76,
    dueAt: "اليوم 15:00",
    impact: "رفع الاحتفاظ وتحسين NPS.",
    nextAction: "إغلاق آخر حالتين.",
  },
  {
    id: "FP-1904",
    title: "احتواء مخاطر مزود متراجع",
    description: "تطبيق خطة تصحيح وتقييد التخصيص مؤقتاً.",
    owner: "إدارة المزودين",
    category: "risk",
    urgency: "critical",
    status: "blocked",
    progress: 52,
    dueAt: "اليوم 10:30",
    impact: "حماية 83K AED من التعويضات.",
    nextAction: "انتظار اعتماد مدير العمليات.",
  },
  {
    id: "FP-1905",
    title: "إطلاق حملة الصيانة الاستباقية",
    description: "استهداف العملاء القريبين من موعد الصيانة.",
    owner: "فريق النمو",
    category: "growth",
    urgency: "medium",
    status: "planned",
    progress: 21,
    dueAt: "غداً 09:00",
    impact: "فرصة إيراد شهرية 180K AED.",
    nextAction: "اعتماد الشريحة والرسائل.",
  },
];

export const focusCategoryLabels = {
  operations: "العمليات",
  revenue: "الإيرادات",
  quality: "الجودة",
  risk: "المخاطر",
  growth: "النمو",
} as const;

export const focusStatusLabels = {
  planned: "مخططة",
  active: "نشطة",
  blocked: "متوقفة",
  completed: "مكتملة",
} as const;
