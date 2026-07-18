export type CommandModule = {
  id: string;
  name: string;
  description: string;
  status: "healthy" | "watch" | "critical";
  score: number;
  metric: string;
  value: string;
  route: string;
};

export type CommandAlert = {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  owner: string;
  createdAt: string;
};

export const commandModules: CommandModule[] = [
  {
    id: "MOD-01",
    name: "عمليات الخدمات",
    description: "إدارة الطلبات، التنفيذ، السعة، وسير العمليات.",
    status: "healthy",
    score: 96,
    metric: "الطلبات النشطة",
    value: "184",
    route: "/service-operations",
  },
  {
    id: "MOD-02",
    name: "جودة الخدمات",
    description: "مراقبة رضا العملاء وحالات استرداد التجربة.",
    status: "watch",
    score: 84,
    metric: "مؤشر التجربة",
    value: "71/100",
    route: "/service-quality",
  },
  {
    id: "MOD-03",
    name: "أداء المزودين",
    description: "SLA والمخاطر والإيرادات والتصعيدات.",
    status: "healthy",
    score: 91,
    metric: "التزام SLA",
    value: "89%",
    route: "/service-provider-performance",
  },
  {
    id: "MOD-04",
    name: "أتمتة الخدمات",
    description: "قواعد التشغيل والقرارات والإجراءات الآلية.",
    status: "healthy",
    score: 94,
    metric: "عمليات مؤتمتة",
    value: "73%",
    route: "/service-automation-center",
  },
  {
    id: "MOD-05",
    name: "السعة والطلب",
    description: "التنبؤ بالطلب وتوزيع الموارد والقدرات.",
    status: "watch",
    score: 82,
    metric: "استخدام السعة",
    value: "87%",
    route: "/service-capacity-dispatch",
  },
  {
    id: "MOD-06",
    name: "المخاطر والامتثال",
    description: "الرقابة المستمرة والضوابط والتنبيهات.",
    status: "healthy",
    score: 93,
    metric: "الضوابط الفعالة",
    value: "148",
    route: "/service-risk-resilience",
  },
  {
    id: "MOD-07",
    name: "التسعير والإيرادات",
    description: "تسعير ديناميكي ونمو الإيرادات والهوامش.",
    status: "healthy",
    score: 90,
    metric: "إيراد اليوم",
    value: "219K AED",
    route: "/service-pricing-revenue",
  },
  {
    id: "MOD-08",
    name: "القوى العاملة",
    description: "الفنيون والمهارات والتوزيع الذكي.",
    status: "critical",
    score: 68,
    metric: "الاستفادة",
    value: "94%",
    route: "/service-workforce",
  },
];

export const commandAlerts: CommandAlert[] = [
  {
    id: "ALT-01",
    title: "ضغط مرتفع على فنيي المركبات الكهربائية",
    description: "الاستخدام تجاوز 96% في الشارقة ودبي.",
    severity: "critical",
    owner: "مركز العمليات",
    createdAt: "2026-07-13T00:18:00+04:00",
  },
  {
    id: "ALT-02",
    title: "خطر تجاوز SLA لمزود ميداني",
    description: "ثلاث طلبات قريبة من حد الاستجابة.",
    severity: "high",
    owner: "إدارة المزودين",
    createdAt: "2026-07-13T00:10:00+04:00",
  },
  {
    id: "ALT-03",
    title: "فرصة رفع التسعير في خدمات الطوارئ",
    description: "الطلب أعلى من المتوسط بنسبة 22%.",
    severity: "medium",
    owner: "إدارة الإيرادات",
    createdAt: "2026-07-12T23:58:00+04:00",
  },
];
