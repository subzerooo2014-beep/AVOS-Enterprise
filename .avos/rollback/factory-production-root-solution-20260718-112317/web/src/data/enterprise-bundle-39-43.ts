export type EnterpriseCenterKey =
  | "security"
  | "experience"
  | "sustainability"
  | "expansion"
  | "launch";

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
  security: {
    eyebrow: "AVOS SECURITY THREAT CENTER",
    title: "مركز التهديدات والأمن",
    description: "مراقبة التهديدات ومحاولات الوصول والمخاطر والاستجابة الأمنية.",
    heroValue: "98/100",
    heroLabel: "مؤشر الأمان",
    metrics: [
      { label: "تهديدات محظورة", value: "1,284", note: "آخر 24 ساعة" },
      { label: "جلسات مشبوهة", value: "7", note: "2 حرجة" },
      { label: "زمن الاستجابة", value: "4.2m", note: "-18%" },
      { label: "تغطية MFA", value: "96%", note: "+3%" },
    ],
    records: [
      { id: "SEC-3901", title: "محاولة وصول لسياسة حساسة", owner: "Security Operations", status: "critical", score: 58, summary: "جلسة غير موثوقة حاولت تعديل سياسة.", impact: "تم الحظر دون اختراق.", action: "فتح تحقيق أمني" },
      { id: "SEC-3902", title: "توسعة قاعدة الحظر الذكي", owner: "Threat Intelligence", status: "opportunity", score: 91, summary: "أنماط جديدة قابلة للتحويل إلى قواعد.", impact: "خفض المحاولات المتكررة 34%.", action: "نشر القواعد" },
      { id: "SEC-3903", title: "تغطية MFA للأدوار الحساسة", owner: "Identity Security", status: "healthy", score: 96, summary: "معظم الحسابات الحساسة محمية.", impact: "خفض مخاطر الاستيلاء.", action: "إغلاق الحسابات المتبقية" },
    ],
    intelligence: "الأولوية هي التحقيق في محاولة الوصول وتوسيع قواعد الحظر إلى جميع البيئات.",
    primaryAction: "تشغيل الاستجابة الأمنية",
  },

  experience: {
    eyebrow: "AVOS CUSTOMER EXPERIENCE COMMAND",
    title: "قيادة تجربة العميل",
    description: "رؤية موحدة لرحلة العميل والرضا والشكاوى والاسترداد والولاء.",
    heroValue: "91%",
    heroLabel: "رضا العملاء",
    metrics: [
      { label: "NPS", value: "68", note: "+7" },
      { label: "شكاوى مفتوحة", value: "23", note: "-14%" },
      { label: "زمن الاستجابة", value: "6.8m", note: "-21%" },
      { label: "حالات استرداد", value: "8", note: "6 مكتملة" },
    ],
    records: [
      { id: "CEX-4001", title: "تحسين رحلة الحجز", owner: "Digital Experience", status: "opportunity", score: 93, summary: "خطوة واحدة تسبب تسرباً في التحويل.", impact: "رفع التحويل 8%.", action: "إطلاق تجربة A/B" },
      { id: "CEX-4002", title: "شكاوى مزود متكررة", owner: "Customer Care", status: "critical", score: 61, summary: "ارتفاع الشكاوى لدى مزود واحد.", impact: "21 عميلاً متأثراً.", action: "فتح خطة استرداد" },
      { id: "CEX-4003", title: "تحسن رضا عملاء VIP", owner: "Premium Care", status: "healthy", score: 95, summary: "الخدمة الشخصية رفعت الرضا.", impact: "زيادة الاحتفاظ 12%.", action: "توسيع النموذج" },
    ],
    intelligence: "أفضل أثر سريع هو إصلاح خطوة الحجز واحتواء شكاوى المزود المتكرر.",
    primaryAction: "تشغيل خطة تجربة العميل",
  },

  sustainability: {
    eyebrow: "AVOS SUSTAINABILITY & IMPACT CENTER",
    title: "مركز الاستدامة والأثر",
    description: "قياس الانبعاثات والكفاءة والطاقة والاستدامة التشغيلية.",
    heroValue: "-18%",
    heroLabel: "خفض الانبعاثات",
    metrics: [
      { label: "رحلات محسنة", value: "14.2K", note: "هذا الشهر" },
      { label: "وقود موفر", value: "82K L", note: "+11%" },
      { label: "خدمات EV", value: "28%", note: "+6%" },
      { label: "نفايات معاد تدويرها", value: "71%", note: "+9%" },
    ],
    records: [
      { id: "SUS-4101", title: "تحسين مسارات الفنيين", owner: "Green Operations", status: "opportunity", score: 94, summary: "إعادة ترتيب المسارات لتقليل المسافة.", impact: "خفض 42 طن CO2 سنوياً.", action: "تطبيق المسارات" },
      { id: "SUS-4102", title: "رفع اعتماد المركبات الكهربائية", owner: "EV Strategy", status: "healthy", score: 89, summary: "زيادة نسبة الخدمات الكهربائية.", impact: "خفض الوقود والانبعاثات.", action: "توسيع الأسطول" },
      { id: "SUS-4103", title: "فجوة تدوير قطع الغيار", owner: "Parts Sustainability", status: "watch", score: 72, summary: "بعض المواقع أقل من الهدف.", impact: "زيادة نفايات قابلة للتدوير.", action: "تفعيل برنامج التدوير" },
    ],
    intelligence: "تحسين المسارات وتوسيع الأسطول الكهربائي يحققان أعلى أثر بيئي وتشغيلي.",
    primaryAction: "تشغيل خطة الاستدامة",
  },

  expansion: {
    eyebrow: "AVOS MARKET EXPANSION CENTER",
    title: "مركز التوسع والأسواق",
    description: "تحليل الأسواق والمناطق والشراكات وفرص التوسع المحلي والدولي.",
    heroValue: "7",
    heroLabel: "أسواق ذات أولوية",
    metrics: [
      { label: "فرص توسع", value: "24", note: "8 عالية" },
      { label: "قيمة متوقعة", value: "18.4M", note: "AED" },
      { label: "شركاء محتملون", value: "36", note: "+12" },
      { label: "جاهزية التوسع", value: "84%", note: "+5%" },
    ],
    records: [
      { id: "EXP-4201", title: "التوسع في أبوظبي الغربية", owner: "Market Strategy", status: "opportunity", score: 92, summary: "طلب مرتفع وتغطية منخفضة.", impact: "إيراد سنوي 2.8M AED.", action: "إطلاق Pilot" },
      { id: "EXP-4202", title: "دخول سوق سلطنة عمان", owner: "Regional Expansion", status: "watch", score: 77, summary: "فرصة قوية مع متطلبات شراكة محلية.", impact: "نمو إقليمي جديد.", action: "بدء دراسة الشريك" },
      { id: "EXP-4203", title: "سوق تصدير المركبات", owner: "Export Marketplace", status: "opportunity", score: 95, summary: "طلب خارجي مرتفع على مركبات الإمارات.", impact: "عمولات وشحن وتأمين.", action: "فتح قناة التصدير" },
    ],
    intelligence: "قناة تصدير المركبات هي أعلى فرصة، يليها Pilot أبوظبي الغربية.",
    primaryAction: "تشغيل خطة التوسع",
  },

  launch: {
    eyebrow: "AVOS COMMERCIAL LAUNCH READINESS",
    title: "جاهزية الإطلاق التجاري",
    description: "متابعة الجاهزية التقنية والتشغيلية والقانونية والتجارية قبل الإطلاق.",
    heroValue: "87%",
    heroLabel: "الجاهزية العامة",
    metrics: [
      { label: "التقنية", value: "94%", note: "مستقرة" },
      { label: "التشغيل", value: "88%", note: "3 فجوات" },
      { label: "القانوني", value: "79%", note: "قيد الإغلاق" },
      { label: "التجاري", value: "86%", note: "+8%" },
    ],
    records: [
      { id: "LCH-4301", title: "إغلاق متطلبات الترخيص", owner: "Legal & Compliance", status: "critical", score: 68, summary: "بعض الإجراءات القانونية لم تكتمل.", impact: "خطر تأخير الإطلاق.", action: "إغلاق المتطلبات" },
      { id: "LCH-4302", title: "اختبار خطة الدعم", owner: "Customer Operations", status: "watch", score: 81, summary: "خطة الدعم تحتاج تمريناً نهائياً.", impact: "جاهزية أفضل ليوم الإطلاق.", action: "تشغيل المحاكاة" },
      { id: "LCH-4303", title: "جاهزية البنية التقنية", owner: "Platform Engineering", status: "healthy", score: 96, summary: "البنية اجتازت اختبارات الحمل.", impact: "قدرة تشغيلية مستقرة.", action: "تجميد الإصدار" },
    ],
    intelligence: "المسار الحرج هو إغلاق المتطلبات القانونية وتشغيل تمرين الدعم النهائي.",
    primaryAction: "تشغيل خطة الإطلاق",
  },
};
