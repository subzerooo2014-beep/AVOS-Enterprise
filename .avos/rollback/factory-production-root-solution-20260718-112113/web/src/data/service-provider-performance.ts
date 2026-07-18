export type ProviderRisk = "low" | "medium" | "high" | "critical";
export type ProviderStatus =
  | "excellent"
  | "stable"
  | "watch"
  | "restricted";

export type ProviderMetric = {
  id: string;
  providerName: string;
  category: string;
  city: string;
  branches: number;
  activeRequests: number;
  completedToday: number;
  slaCompliance: number;
  firstResponseMinutes: number;
  averageCompletionMinutes: number;
  customerScore: number;
  reworkRate: number;
  cancellationRate: number;
  acceptanceRate: number;
  technicianUtilization: number;
  revenueToday: number;
  projectedMonthlyRevenue: number;
  incidentCount: number;
  openEscalations: number;
  risk: ProviderRisk;
  status: ProviderStatus;
  trend: number;
  aiDecision: string;
  nextAction: string;
};

export type SlaIncident = {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  service: string;
  city: string;
  severity: ProviderRisk;
  createdAt: string;
  breachedMetric: string;
  target: string;
  actual: string;
  elapsedMinutes: number;
  owner: string;
  status: "open" | "investigating" | "mitigating" | "resolved";
  impact: string;
  recommendation: string;
};

export const providerMetrics: ProviderMetric[] = [
  {
    id: "SP-2001",
    providerName: "AVOS Inspection Network",
    category: "فحص المركبات",
    city: "أبوظبي",
    branches: 5,
    activeRequests: 31,
    completedToday: 47,
    slaCompliance: 97,
    firstResponseMinutes: 4,
    averageCompletionMinutes: 68,
    customerScore: 94,
    reworkRate: 1.8,
    cancellationRate: 1.2,
    acceptanceRate: 98,
    technicianUtilization: 86,
    revenueToday: 38200,
    projectedMonthlyRevenue: 1120000,
    incidentCount: 1,
    openEscalations: 0,
    risk: "low",
    status: "excellent",
    trend: 8.4,
    aiDecision:
      "مزود استراتيجي عالي الأداء، مؤهل للحصول على حصة طلبات إضافية.",
    nextAction:
      "زيادة التوزيع الآلي بنسبة 12% مع إبقاء مراقبة الجودة المستمرة.",
  },
  {
    id: "SP-2002",
    providerName: "Rapid Battery UAE",
    category: "بطاريات متنقلة",
    city: "دبي",
    branches: 8,
    activeRequests: 42,
    completedToday: 63,
    slaCompliance: 89,
    firstResponseMinutes: 7,
    averageCompletionMinutes: 51,
    customerScore: 86,
    reworkRate: 3.9,
    cancellationRate: 4.2,
    acceptanceRate: 92,
    technicianUtilization: 93,
    revenueToday: 29400,
    projectedMonthlyRevenue: 875000,
    incidentCount: 4,
    openEscalations: 2,
    risk: "medium",
    status: "watch",
    trend: -3.8,
    aiDecision:
      "الضغط التشغيلي مرتفع وقد يؤدي إلى تجاوزات إضافية خلال ساعات الذروة.",
    nextAction:
      "فتح سعة احتياطية وتخفيض التخصيص في المناطق المزدحمة بنسبة 15%.",
  },
  {
    id: "SP-2003",
    providerName: "Premium Auto Care",
    category: "صيانة متقدمة",
    city: "دبي",
    branches: 3,
    activeRequests: 19,
    completedToday: 29,
    slaCompliance: 94,
    firstResponseMinutes: 6,
    averageCompletionMinutes: 142,
    customerScore: 91,
    reworkRate: 2.4,
    cancellationRate: 2.1,
    acceptanceRate: 95,
    technicianUtilization: 79,
    revenueToday: 51600,
    projectedMonthlyRevenue: 1480000,
    incidentCount: 2,
    openEscalations: 1,
    risk: "low",
    status: "stable",
    trend: 5.1,
    aiDecision:
      "الأداء المالي قوي مع فرصة لتحسين زمن إقرار الأعمال الإضافية.",
    nextAction:
      "تفعيل الموافقة الرقمية المصورة للعملاء لتقليل زمن الانتظار.",
  },
  {
    id: "SP-2004",
    providerName: "EV Tech Emirates",
    category: "مركبات كهربائية",
    city: "الشارقة",
    branches: 2,
    activeRequests: 17,
    completedToday: 18,
    slaCompliance: 72,
    firstResponseMinutes: 13,
    averageCompletionMinutes: 188,
    customerScore: 71,
    reworkRate: 8.6,
    cancellationRate: 6.4,
    acceptanceRate: 81,
    technicianUtilization: 98,
    revenueToday: 24700,
    projectedMonthlyRevenue: 690000,
    incidentCount: 9,
    openEscalations: 5,
    risk: "critical",
    status: "restricted",
    trend: -12.6,
    aiDecision:
      "خطر تشغيلي مرتفع بسبب نقص الفنيين المتخصصين وارتفاع إعادة العمل.",
    nextAction:
      "تقييد الطلبات الجديدة فوراً وتحويل الحالات الحساسة لمزود بديل.",
  },
  {
    id: "SP-2005",
    providerName: "Desert Garage Pro",
    category: "إصلاح ميكانيكي",
    city: "العين",
    branches: 4,
    activeRequests: 24,
    completedToday: 35,
    slaCompliance: 84,
    firstResponseMinutes: 11,
    averageCompletionMinutes: 166,
    customerScore: 79,
    reworkRate: 5.7,
    cancellationRate: 5.1,
    acceptanceRate: 88,
    technicianUtilization: 91,
    revenueToday: 31800,
    projectedMonthlyRevenue: 910000,
    incidentCount: 6,
    openEscalations: 3,
    risk: "high",
    status: "watch",
    trend: -7.2,
    aiDecision:
      "مؤشرات تراجع متزامنة في SLA ورضا العملاء وإعادة العمل.",
    nextAction:
      "بدء خطة تصحيح 14 يوماً مع مراجعة مهارات الفنيين يومياً.",
  },
  {
    id: "SP-2006",
    providerName: "Signature Detailing",
    category: "تلميع وعناية",
    city: "أبوظبي",
    branches: 6,
    activeRequests: 27,
    completedToday: 54,
    slaCompliance: 99,
    firstResponseMinutes: 3,
    averageCompletionMinutes: 84,
    customerScore: 97,
    reworkRate: 0.9,
    cancellationRate: 0.7,
    acceptanceRate: 99,
    technicianUtilization: 88,
    revenueToday: 44600,
    projectedMonthlyRevenue: 1290000,
    incidentCount: 0,
    openEscalations: 0,
    risk: "low",
    status: "excellent",
    trend: 10.3,
    aiDecision:
      "أفضل مزود في تجربة العملاء ويمكن استخدامه كنموذج تشغيلي معياري.",
    nextAction:
      "توسيع التغطية الجغرافية وربط نموذج العمل بمزودي الفئة نفسها.",
  },
];

export const slaIncidents: SlaIncident[] = [
  {
    id: "SI-9001",
    requestId: "SR-24044",
    providerId: "SP-2004",
    providerName: "EV Tech Emirates",
    service: "فحص نظام الشحن",
    city: "الشارقة",
    severity: "critical",
    createdAt: "2026-07-12T11:36:00+04:00",
    breachedMetric: "تحديث العميل",
    target: "كل 30 دقيقة",
    actual: "لا تحديث لمدة 94 دقيقة",
    elapsedMinutes: 94,
    owner: "فاطمة النقبي",
    status: "mitigating",
    impact: "خطر فقدان عميلة ذات قيمة عالية وتصعيد تجربة.",
    recommendation:
      "تحويل الحالة لمدير التجربة وتوفير مركبة بديلة فوراً.",
  },
  {
    id: "SI-9002",
    requestId: "SR-24045",
    providerId: "SP-2005",
    providerName: "Desert Garage Pro",
    service: "إصلاح نظام التبريد",
    city: "العين",
    severity: "high",
    createdAt: "2026-07-12T12:15:00+04:00",
    breachedMetric: "تعيين فني",
    target: "20 دقيقة",
    actual: "34 دقيقة",
    elapsedMinutes: 34,
    owner: "مها الشامسي",
    status: "investigating",
    impact: "تأخر بدء الخدمة واحتمال تجاوز موعد التسليم.",
    recommendation:
      "تفعيل فريق متنقل وتحديث مصفوفة مهارات الفرع.",
  },
  {
    id: "SI-9003",
    requestId: "SR-24042",
    providerId: "SP-2002",
    providerName: "Rapid Battery UAE",
    service: "تبديل بطارية متنقل",
    city: "دبي",
    severity: "medium",
    createdAt: "2026-07-12T10:58:00+04:00",
    breachedMetric: "وقت الوصول",
    target: "45 دقيقة",
    actual: "58 دقيقة",
    elapsedMinutes: 58,
    owner: "عبدالله الكتبي",
    status: "open",
    impact: "تراجع رضا العميل وزيادة احتمالية الإلغاء.",
    recommendation:
      "تفعيل مزود احتياطي تلقائياً عند توقع التجاوز.",
  },
  {
    id: "SI-9004",
    requestId: "SR-24039",
    providerId: "SP-2004",
    providerName: "EV Tech Emirates",
    service: "تشخيص بطارية الجهد العالي",
    city: "الشارقة",
    severity: "high",
    createdAt: "2026-07-12T09:20:00+04:00",
    breachedMetric: "الإغلاق من المرة الأولى",
    target: "95%",
    actual: "إعادة فتح الحالة",
    elapsedMinutes: 210,
    owner: "سالم الكعبي",
    status: "resolved",
    impact: "تكلفة إعادة عمل واحتجاز مركبة العميل.",
    recommendation:
      "مراجعة فنية إلزامية قبل تسليم المركبات الكهربائية.",
  },
];

export const providerStatusLabels: Record<ProviderStatus, string> = {
  excellent: "ممتاز",
  stable: "مستقر",
  watch: "تحت المراقبة",
  restricted: "مقيّد",
};

export const providerRiskLabels: Record<ProviderRisk, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
  critical: "حرج",
};
