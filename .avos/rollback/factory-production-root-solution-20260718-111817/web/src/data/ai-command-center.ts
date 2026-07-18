export type CommandKpi = {
  id: string;
  label: string;
  value: string;
  trend: number;
  status: "healthy" | "watch" | "critical";
};

export type AiRecommendation = {
  id: string;
  title: string;
  summary: string;
  priority: "medium" | "high" | "critical";
  confidence: number;
  owner: string;
  impact: string;
  status: "new" | "review" | "approved";
};

export type CommandAlert = {
  id: string;
  title: string;
  source: string;
  severity: "warning" | "high" | "critical";
  createdAt: string;
};

export type AgendaItem = {
  id: string;
  time: string;
  title: string;
  owner: string;
  type: "meeting" | "approval" | "review";
};

export const commandKpis: CommandKpi[] = [
  { id: "KPI-01", label: "إيراد اليوم", value: "247K AED", trend: 11.4, status: "healthy" },
  { id: "KPI-02", label: "الطلبات النشطة", value: "196", trend: 8.2, status: "healthy" },
  { id: "KPI-03", label: "التزام SLA", value: "91%", trend: 2.7, status: "healthy" },
  { id: "KPI-04", label: "المخاطر الحرجة", value: "3", trend: -18.5, status: "watch" },
];

export const aiRecommendations: AiRecommendation[] = [
  {
    id: "REC-1801",
    title: "إعادة توزيع فنيي المركبات الكهربائية",
    summary: "الطلب في دبي والشارقة أعلى من السعة المتاحة خلال الساعات الأربع المقبلة.",
    priority: "critical",
    confidence: 95,
    owner: "القوى العاملة",
    impact: "حماية 72K AED وخفض تجاوزات SLA بنسبة 39%.",
    status: "new",
  },
  {
    id: "REC-1802",
    title: "رفع السعر الديناميكي لخدمات الطوارئ",
    summary: "الطلب أعلى من المتوسط مع استقرار معدل التحويل.",
    priority: "high",
    confidence: 89,
    owner: "الإيرادات",
    impact: "زيادة متوقعة 28K AED اليوم.",
    status: "review",
  },
  {
    id: "REC-1803",
    title: "تقييد مزود تحت المراقبة",
    summary: "ارتفاع متزامن في إعادة العمل والتأخير والشكاوى.",
    priority: "critical",
    confidence: 97,
    owner: "إدارة المزودين",
    impact: "خفض مخاطر التعويضات وحماية تجربة العملاء.",
    status: "approved",
  },
  {
    id: "REC-1804",
    title: "تشغيل حملة استباقية للصيانة",
    summary: "شريحة من العملاء تقترب مركباتهم من موعد الصيانة الدورية.",
    priority: "medium",
    confidence: 86,
    owner: "النمو",
    impact: "فرصة إيراد شهرية 180K AED.",
    status: "new",
  },
];

export const commandAlerts: CommandAlert[] = [
  { id: "ALT-1801", title: "مزود يقترب من تجاوز SLA", source: "Provider Intelligence", severity: "critical", createdAt: "08:24" },
  { id: "ALT-1802", title: "ضغط مرتفع على السعة في دبي", source: "Operations", severity: "high", createdAt: "08:19" },
  { id: "ALT-1803", title: "انخفاض مؤقت في Push delivery", source: "Notification OS", severity: "warning", createdAt: "08:11" },
];

export const agendaItems: AgendaItem[] = [
  { id: "AG-1801", time: "09:00", title: "مراجعة مخاطر المزودين", owner: "مركز العمليات", type: "review" },
  { id: "AG-1802", time: "10:30", title: "اعتماد التسعير الديناميكي", owner: "مدير الإيرادات", type: "approval" },
  { id: "AG-1803", time: "12:00", title: "اجتماع الأداء التنفيذي", owner: "الإدارة العليا", type: "meeting" },
  { id: "AG-1804", time: "14:00", title: "مراجعة خطة التوسع", owner: "فريق النمو", type: "review" },
];

export const organizationOverview = [
  { id: "ORG-A", name: "أبوظبي", health: 97, revenue: "102K", active: 74 },
  { id: "ORG-D", name: "دبي", health: 92, revenue: "118K", active: 83 },
  { id: "ORG-S", name: "الشارقة", health: 84, revenue: "27K", active: 39 },
];
