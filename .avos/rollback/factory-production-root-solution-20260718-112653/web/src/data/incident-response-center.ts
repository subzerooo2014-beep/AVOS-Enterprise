export type IncidentRecord = {
  id: string;
  title: string;
  description: string;
  owner: string;
  service: string;
  severity: "medium" | "high" | "critical";
  status: "open" | "investigating" | "mitigated" | "resolved";
  startedAt: string;
  elapsedMinutes: number;
  affectedUsers: number;
  businessImpact: string;
  nextAction: string;
  playbook: string;
};

export const incidentRecords: IncidentRecord[] = [
  {
    id: "INC-2001",
    title: "انخفاض تسليم إشعارات Push",
    description: "تراجع مؤقت في تسليم الإشعارات لبعض أجهزة Android.",
    owner: "Notification Operations",
    service: "Notification OS",
    severity: "high",
    status: "investigating",
    startedAt: "08:14",
    elapsedMinutes: 42,
    affectedUsers: 186,
    businessImpact: "تأخر تحديثات العملاء للحالات النشطة.",
    nextAction: "تحويل القناة إلى SMS للحالات الحرجة.",
    playbook: "PB-NOTIFICATION-FAILOVER",
  },
  {
    id: "INC-2002",
    title: "ضغط مرتفع على السعة في دبي",
    description: "ارتفاع طلبات المركبات الكهربائية فوق السعة المتوقعة.",
    owner: "Service Operations",
    service: "Capacity Dispatch",
    severity: "critical",
    status: "open",
    startedAt: "08:21",
    elapsedMinutes: 35,
    affectedUsers: 74,
    businessImpact: "خطر تجاوز SLA وخسارة حجوزات.",
    nextAction: "نقل 3 فنيين وتفعيل مزود احتياطي.",
    playbook: "PB-CAPACITY-SURGE",
  },
  {
    id: "INC-2003",
    title: "ارتفاع إعادة العمل لدى مزود",
    description: "تجاوز المزود الحد المسموح لإعادة العمل خلال 24 ساعة.",
    owner: "Provider Governance",
    service: "Provider Network",
    severity: "high",
    status: "mitigated",
    startedAt: "07:48",
    elapsedMinutes: 68,
    affectedUsers: 21,
    businessImpact: "ارتفاع تكاليف التعويض وانخفاض رضا العملاء.",
    nextAction: "استكمال خطة التصحيح ومراجعة الأداء.",
    playbook: "PB-PROVIDER-QUALITY",
  },
  {
    id: "INC-2004",
    title: "فشل مؤقت في مزامنة التسعير",
    description: "تعارض إصدار منع نشر تحديث تسعير واحد.",
    owner: "Revenue Platform",
    service: "Pricing Engine",
    severity: "medium",
    status: "resolved",
    startedAt: "07:10",
    elapsedMinutes: 29,
    affectedUsers: 0,
    businessImpact: "تأخر نشر قاعدة تسعير واحدة.",
    nextAction: "توثيق السبب الجذري وإغلاق الحادث.",
    playbook: "PB-PRICING-ROLLBACK",
  },
  {
    id: "INC-2005",
    title: "محاولة وصول غير مصرح",
    description: "محاولة تعديل سياسة حساسة من جلسة غير موثوقة.",
    owner: "Security Operations",
    service: "Policy Control",
    severity: "critical",
    status: "resolved",
    startedAt: "06:57",
    elapsedMinutes: 18,
    affectedUsers: 0,
    businessImpact: "لم يحدث اختراق؛ تم الحظر تلقائياً.",
    nextAction: "مراجعة سلسلة التدقيق وتحديث قاعدة الحظر.",
    playbook: "PB-UNAUTHORIZED-ACCESS",
  },
];

export const incidentSeverityLabels = {
  medium: "متوسطة",
  high: "عالية",
  critical: "حرجة",
} as const;

export const incidentStatusLabels = {
  open: "مفتوح",
  investigating: "قيد التحقيق",
  mitigated: "تم الاحتواء",
  resolved: "مغلق",
} as const;
