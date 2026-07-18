export type EnterpriseCenterKey =
  | "finance"
  | "strategy"
  | "growth"
  | "operations"
  | "digitalTwin";

export type CenterMetric = {
  label: string;
  value: string;
  note: string;
};

export type CenterRecord = {
  id: string;
  title: string;
  owner: string;
  status: "healthy" | "watch" | "critical" | "opportunity";
  score: number;
  summary: string;
  impact: string;
  action: string;
};

export type CenterDefinition = {
  eyebrow: string;
  title: string;
  description: string;
  heroValue: string;
  heroLabel: string;
  metrics: CenterMetric[];
  records: CenterRecord[];
  intelligence: string;
  primaryAction: string;
};

export const enterpriseBundleCenters: Record<
  EnterpriseCenterKey,
  CenterDefinition
> = {
  finance: {
    eyebrow: "AVOS ENTERPRISE FINANCE COCKPIT",
    title: "المقصورة المالية المؤسسية",
    description:
      "رؤية تنفيذية للإيرادات والمصروفات والسيولة والربحية والفرص المالية.",
    heroValue: "3.84M AED",
    heroLabel: "صافي التدفق المتوقع",
    metrics: [
      { label: "إيرادات الشهر", value: "8.42M", note: "+14.8%" },
      { label: "هامش الربح", value: "36.4%", note: "+2.1%" },
      { label: "السيولة المتاحة", value: "5.7M", note: "مستقرة" },
      { label: "المصروفات", value: "4.11M", note: "-3.2%" },
    ],
    records: [
      { id: "FIN-2901", title: "تحسين هامش خدمات الطوارئ", owner: "Revenue Finance", status: "opportunity", score: 92, summary: "رفع السعر الديناميكي مع ضبط تكلفة المزود.", impact: "زيادة شهرية متوقعة 180K AED.", action: "تشغيل محاكاة الهامش" },
      { id: "FIN-2902", title: "تراجع تكلفة اكتساب العميل", owner: "Growth Finance", status: "healthy", score: 88, summary: "انخفاض CAC بعد تحسين الاستهداف.", impact: "توفير 74K AED شهرياً.", action: "توسيع النموذج" },
      { id: "FIN-2903", title: "ارتفاع مصروفات مزود", owner: "Cost Control", status: "watch", score: 67, summary: "تكلفة مزود واحد تجاوزت الحد.", impact: "خطر 96K AED.", action: "فتح مراجعة تكلفة" },
    ],
    intelligence: "يمكن رفع الربحية عبر موازنة التسعير والتخصيص وتقليل تكلفة المزودين مرتفعي التكلفة.",
    primaryAction: "اعتماد خطة الربحية",
  },

  strategy: {
    eyebrow: "AVOS EXECUTIVE STRATEGY CENTER",
    title: "مركز الاستراتيجية التنفيذية",
    description:
      "إدارة الأهداف والمبادرات والنتائج الاستراتيجية وربطها بالتنفيذ.",
    heroValue: "82%",
    heroLabel: "تحقق الاستراتيجية",
    metrics: [
      { label: "الأهداف النشطة", value: "12", note: "3 حرجة" },
      { label: "المبادرات", value: "28", note: "21 نشطة" },
      { label: "التقدم الكلي", value: "82%", note: "+6%" },
      { label: "القيمة المحققة", value: "11.6M", note: "AED" },
    ],
    records: [
      { id: "STR-3001", title: "التوسع في خدمات المركبات الكهربائية", owner: "Strategy Office", status: "opportunity", score: 91, summary: "زيادة التغطية في دبي وأبوظبي.", impact: "نمو سنوي متوقع 18%.", action: "اعتماد خارطة التوسع" },
      { id: "STR-3002", title: "توحيد تجربة المزودين", owner: "Provider Strategy", status: "healthy", score: 86, summary: "تطبيق معيار تشغيل موحد.", impact: "خفض إعادة العمل 24%.", action: "توسيع التطبيق" },
      { id: "STR-3003", title: "جاهزية الإطلاق التجاري", owner: "Executive Office", status: "watch", score: 73, summary: "تبقى بعض متطلبات الامتثال والتشغيل.", impact: "خطر تأخير محدود.", action: "إغلاق الفجوات" },
    ],
    intelligence: "التركيز الأعلى يجب أن يكون على التوسع الكهربائي وإغلاق متطلبات الإطلاق التجاري.",
    primaryAction: "تحديث الخطة الاستراتيجية",
  },

  growth: {
    eyebrow: "AVOS AI GROWTH CENTER",
    title: "مركز النمو الذكي",
    description:
      "اكتشاف فرص النمو والحملات والمنتجات والتوسع باستخدام الذكاء الاصطناعي.",
    heroValue: "1.28M AED",
    heroLabel: "فرص نمو مكتشفة",
    metrics: [
      { label: "فرص النمو", value: "17", note: "7 عالية" },
      { label: "الحملات النشطة", value: "9", note: "ROI 4.2x" },
      { label: "التحويل", value: "13.8%", note: "+3.4%" },
      { label: "عملاء محتملون", value: "4,820", note: "+19%" },
    ],
    records: [
      { id: "GRW-3101", title: "حملة صيانة استباقية", owner: "AI Growth", status: "opportunity", score: 95, summary: "استهداف العملاء القريبين من الصيانة.", impact: "180K AED شهرياً.", action: "إطلاق الحملة" },
      { id: "GRW-3102", title: "توسعة سوق لوحات الأرقام", owner: "Marketplace Growth", status: "opportunity", score: 89, summary: "طلب مرتفع على اللوحات المميزة.", impact: "نمو عمولات 22%.", action: "فتح السوق" },
      { id: "GRW-3103", title: "تحسين رحلة التسجيل", owner: "Product Growth", status: "watch", score: 71, summary: "تسرب في خطوة التحقق.", impact: "فقد 540 تسجيلاً شهرياً.", action: "تشغيل تجربة A/B" },
    ],
    intelligence: "أسرع فرصة هي حملة الصيانة الاستباقية، يليها توسيع سوق لوحات الأرقام.",
    primaryAction: "تشغيل خطة النمو",
  },

  operations: {
    eyebrow: "AVOS GLOBAL OPERATIONS CENTER",
    title: "مركز العمليات العالمي",
    description:
      "مراقبة موحدة للمناطق والطلبات والسعة والمزودين والمخاطر التشغيلية.",
    heroValue: "94/100",
    heroLabel: "صحة العمليات",
    metrics: [
      { label: "طلبات نشطة", value: "1,284", note: "+11%" },
      { label: "التزام SLA", value: "93.6%", note: "+1.8%" },
      { label: "مزودون نشطون", value: "216", note: "12 مراقبة" },
      { label: "مناطق تشغيل", value: "7", note: "UAE" },
    ],
    records: [
      { id: "OPS-3201", title: "ضغط سعة في دبي", owner: "Dubai Operations", status: "critical", score: 58, summary: "الطلب أعلى من السعة المتاحة.", impact: "72K AED معرضة.", action: "إعادة توزيع السعة" },
      { id: "OPS-3202", title: "استقرار عمليات أبوظبي", owner: "Abu Dhabi Operations", status: "healthy", score: 96, summary: "جميع المؤشرات ضمن الهدف.", impact: "تشغيل مستقر.", action: "استمرار المراقبة" },
      { id: "OPS-3203", title: "تراجع مزود في الشارقة", owner: "Provider Operations", status: "watch", score: 69, summary: "ارتفاع إعادة العمل والتأخير.", impact: "21 عميلاً متأثراً.", action: "تفعيل خطة تصحيح" },
    ],
    intelligence: "الأولوية الفورية هي إعادة توزيع السعة في دبي وتقييد المزود المتراجع في الشارقة.",
    primaryAction: "تشغيل خطة العمليات",
  },

  digitalTwin: {
    eyebrow: "AVOS ENTERPRISE DIGITAL TWIN",
    title: "التوأم الرقمي المؤسسي",
    description:
      "محاكاة قرارات المؤسسة والسيناريوهات التشغيلية والمالية قبل التنفيذ.",
    heroValue: "12",
    heroLabel: "سيناريوهات نشطة",
    metrics: [
      { label: "محاكاة اليوم", value: "38", note: "96% ناجحة" },
      { label: "قيمة محمية", value: "2.4M", note: "AED" },
      { label: "مخاطر متجنبة", value: "17", note: "هذا الشهر" },
      { label: "دقة التوقع", value: "93%", note: "+4%" },
    ],
    records: [
      { id: "DT-3301", title: "محاكاة توسعة دبي", owner: "Digital Twin Engine", status: "opportunity", score: 94, summary: "إضافة 3 فنيين ومزود احتياطي.", impact: "خفض SLA breaches بنسبة 41%.", action: "اعتماد السيناريو" },
      { id: "DT-3302", title: "محاكاة رفع التسعير", owner: "Revenue Twin", status: "healthy", score: 88, summary: "رفع 7% مع ثبات التحويل.", impact: "زيادة 28K AED يومياً.", action: "نشر القاعدة" },
      { id: "DT-3303", title: "محاكاة فشل مزود رئيسي", owner: "Resilience Twin", status: "watch", score: 74, summary: "الشبكة البديلة تحتاج سعة إضافية.", impact: "خطر تأخير 18 دقيقة.", action: "رفع الجاهزية" },
    ],
    intelligence: "سيناريو توسعة دبي يحقق أفضل توازن بين التكلفة وحماية SLA ويمكن تنفيذه فوراً.",
    primaryAction: "تشغيل محاكاة جديدة",
  },
};
