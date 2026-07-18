export type ResilienceScenario = {
  id: string;
  title: string;
  service: string;
  owner: string;
  severity: "medium" | "high" | "critical";
  status: "ready" | "testing" | "degraded" | "recovered";
  recoveryTarget: string;
  currentRto: string;
  currentRpo: string;
  readiness: number;
  lastTest: string;
  impact: string;
  nextAction: string;
};

export const resilienceScenarios: ResilienceScenario[] = [
  {
    id: "RR-2101",
    title: "تعطل بوابة الإشعارات",
    service: "Notification OS",
    owner: "Platform Reliability",
    severity: "high",
    status: "ready",
    recoveryTarget: "15 دقيقة",
    currentRto: "9 دقائق",
    currentRpo: "0 دقيقة",
    readiness: 96,
    lastTest: "منذ 3 أيام",
    impact: "تحويل القنوات تلقائياً دون فقدان الرسائل.",
    nextAction: "اختبار مسار WhatsApp إلى SMS.",
  },
  {
    id: "RR-2102",
    title: "انقطاع خدمة التسعير",
    service: "Pricing Engine",
    owner: "Revenue Platform",
    severity: "critical",
    status: "testing",
    recoveryTarget: "10 دقائق",
    currentRto: "12 دقيقة",
    currentRpo: "2 دقيقة",
    readiness: 84,
    lastTest: "اليوم",
    impact: "العودة إلى آخر تسعير معتمد.",
    nextAction: "تقليل RTO بمقدار دقيقتين.",
  },
  {
    id: "RR-2103",
    title: "فقدان اتصال مزود خارجي",
    service: "Provider Network",
    owner: "Provider Operations",
    severity: "high",
    status: "degraded",
    recoveryTarget: "20 دقيقة",
    currentRto: "18 دقيقة",
    currentRpo: "5 دقائق",
    readiness: 78,
    lastTest: "منذ أسبوع",
    impact: "إعادة توجيه الطلبات إلى شبكة احتياطية.",
    nextAction: "رفع سعة المزود البديل.",
  },
  {
    id: "RR-2104",
    title: "توقف خدمة البحث",
    service: "Search Platform",
    owner: "Digital Experience",
    severity: "medium",
    status: "recovered",
    recoveryTarget: "30 دقيقة",
    currentRto: "11 دقيقة",
    currentRpo: "1 دقيقة",
    readiness: 92,
    lastTest: "أمس",
    impact: "استخدام فهرس احتياطي مع بيانات شبه لحظية.",
    nextAction: "توثيق التحسينات بعد الاختبار.",
  },
  {
    id: "RR-2105",
    title: "فشل عقدة قاعدة البيانات",
    service: "Core Data Platform",
    owner: "Data Reliability",
    severity: "critical",
    status: "ready",
    recoveryTarget: "5 دقائق",
    currentRto: "4 دقائق",
    currentRpo: "0 دقيقة",
    readiness: 99,
    lastTest: "منذ يومين",
    impact: "Failover تلقائي إلى العقدة الثانوية.",
    nextAction: "تجربة failback تحت حمل مرتفع.",
  },
];

export const resilienceStatusLabels = {
  ready: "جاهزة",
  testing: "قيد الاختبار",
  degraded: "متراجعة",
  recovered: "تم التعافي",
} as const;

export const resilienceSeverityLabels = {
  medium: "متوسطة",
  high: "عالية",
  critical: "حرجة",
} as const;
