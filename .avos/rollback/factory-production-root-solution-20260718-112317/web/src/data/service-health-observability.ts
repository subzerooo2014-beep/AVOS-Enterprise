export type ServiceHealthRecord = {
  id: string;
  name: string;
  domain: "web" | "api" | "data" | "ai" | "notifications";
  status: "healthy" | "degraded" | "critical" | "maintenance";
  uptime: number;
  latencyMs: number;
  errorRate: number;
  requestsPerMinute: number;
  dependencies: string[];
  owner: string;
  lastIncident: string;
  recommendation: string;
};

export const serviceHealthRecords: ServiceHealthRecord[] = [
  {
    id: "SH-2401",
    name: "AVOS Web Platform",
    domain: "web",
    status: "healthy",
    uptime: 99.98,
    latencyMs: 184,
    errorRate: 0.12,
    requestsPerMinute: 1280,
    dependencies: ["API Gateway", "Identity", "Search"],
    owner: "Digital Experience",
    lastIncident: "منذ 12 يوماً",
    recommendation: "الاستمرار بالمراقبة الحالية.",
  },
  {
    id: "SH-2402",
    name: "Core API Gateway",
    domain: "api",
    status: "healthy",
    uptime: 99.96,
    latencyMs: 92,
    errorRate: 0.18,
    requestsPerMinute: 3420,
    dependencies: ["PostgreSQL", "Redis", "Policy Engine"],
    owner: "Platform Engineering",
    lastIncident: "منذ 5 أيام",
    recommendation: "رفع حدود التنبيه عند الذروة.",
  },
  {
    id: "SH-2403",
    name: "Enterprise Brain",
    domain: "ai",
    status: "degraded",
    uptime: 99.72,
    latencyMs: 860,
    errorRate: 1.8,
    requestsPerMinute: 410,
    dependencies: ["Model Runtime", "Event Bus", "Knowledge Graph"],
    owner: "Enterprise AI",
    lastIncident: "اليوم 07:42",
    recommendation: "توسعة سعة المعالجة وتقليل زمن الانتظار.",
  },
  {
    id: "SH-2404",
    name: "Notification Orchestrator",
    domain: "notifications",
    status: "healthy",
    uptime: 99.91,
    latencyMs: 240,
    errorRate: 0.42,
    requestsPerMinute: 760,
    dependencies: ["WhatsApp", "SMS", "Push"],
    owner: "Communication Platform",
    lastIncident: "منذ يومين",
    recommendation: "اختبار قناة fallback أسبوعياً.",
  },
  {
    id: "SH-2405",
    name: "Analytics Data Pipeline",
    domain: "data",
    status: "critical",
    uptime: 98.84,
    latencyMs: 1420,
    errorRate: 3.4,
    requestsPerMinute: 230,
    dependencies: ["Event Stream", "Warehouse", "Object Storage"],
    owner: "Data Reliability",
    lastIncident: "اليوم 08:11",
    recommendation: "فتح تحقيق فوري وإعادة تشغيل العامل المتعثر.",
  },
];

export const serviceDomainLabels = {
  web: "الويب",
  api: "واجهات API",
  data: "البيانات",
  ai: "الذكاء الاصطناعي",
  notifications: "الإشعارات",
} as const;

export const serviceStatusLabels = {
  healthy: "سليم",
  degraded: "متراجع",
  critical: "حرج",
  maintenance: "صيانة",
} as const;
