export type EnterpriseCenterKey =
  | "sovereign"
  | "autonomous"
  | "digitalTwin"
  | "innovation"
  | "ecosystem";

export type CenterMetric = { label: string; value: string; note: string };
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

export const enterpriseBundleCenters: Record<EnterpriseCenterKey, CenterDefinition> = {
  sovereign: {
    eyebrow: "AVOS SOVEREIGN INTELLIGENCE CENTER",
    title: "مركز الذكاء السيادي",
    description: "حوكمة البيانات السيادية والقرارات الحساسة والسياسات الوطنية والتشغيل الموثوق.",
    heroValue: "97/100",
    heroLabel: "مؤشر السيادة الرقمية",
    metrics: [
      { label: "بيانات محلية", value: "99.6%", note: "+1.8%" },
      { label: "قرارات محكومة", value: "14.8K", note: "آخر 30 يوماً" },
      { label: "سياسات فعالة", value: "126", note: "100% متوافقة" },
      { label: "مخاطر سيادية", value: "2", note: "قيد المعالجة" },
    ],
    records: [
      { id: "SVG-4401", title: "توطين سجل القرارات الحساسة", owner: "Sovereign Data Office", status: "healthy", score: 98, summary: "جميع سجلات القرار الحساسة داخل النطاق المحلي.", impact: "امتثال وسيادة كاملة.", action: "اعتماد الإغلاق" },
      { id: "SVG-4402", title: "مراجعة وصول مزود خارجي", owner: "Trust Governance", status: "critical", score: 64, summary: "صلاحية قديمة لمزود تكامل خارجي.", impact: "خفض مخاطر تسرب البيانات.", action: "سحب الصلاحية" },
      { id: "SVG-4403", title: "توسعة سياسات التصنيف", owner: "Data Classification", status: "opportunity", score: 92, summary: "إضافة تصنيف تلقائي للوثائق والعقود.", impact: "تقليل المراجعة اليدوية 46%.", action: "تشغيل المصنف" },
    ],
    intelligence: "الأولوية هي سحب صلاحية المزود القديم ثم تعميم التصنيف السيادي التلقائي.",
    primaryAction: "تشغيل خطة السيادة",
  },
  autonomous: {
    eyebrow: "AVOS AUTONOMOUS OPERATIONS CENTER",
    title: "مركز العمليات الذاتية",
    description: "تشغيل المهام والوكلاء والإصلاحات الذاتية مع ضوابط الموافقة والتراجع.",
    heroValue: "86%",
    heroLabel: "نسبة الأتمتة الذاتية",
    metrics: [
      { label: "مهام ذاتية", value: "8,420", note: "+19%" },
      { label: "إصلاحات تلقائية", value: "386", note: "98% ناجحة" },
      { label: "زمن القرار", value: "1.8s", note: "-31%" },
      { label: "تدخلات بشرية", value: "14%", note: "-6%" },
    ],
    records: [
      { id: "AUT-4501", title: "إعادة موازنة سعة دبي", owner: "Autonomous Dispatch", status: "healthy", score: 96, summary: "إعادة توزيع تلقائية للسعة قبل الذروة.", impact: "حماية 184 طلباً.", action: "اعتماد السياسة" },
      { id: "AUT-4502", title: "وكيل معالجة المطالبات", owner: "Claims Automation", status: "watch", score: 78, summary: "ارتفاع حالات التحويل للمراجعة البشرية.", impact: "تأخير متوسط 11 دقيقة.", action: "إعادة تدريب القواعد" },
      { id: "AUT-4503", title: "الإصلاح الذاتي للإشعارات", owner: "Platform Autonomy", status: "opportunity", score: 93, summary: "مسار بديل ينجح تلقائياً عند تراجع Push.", impact: "خفض الفشل 72%.", action: "تفعيل الإنتاج" },
    ],
    intelligence: "أفضل مكسب فوري هو تفعيل الإصلاح الذاتي للإشعارات وتحسين قواعد وكيل المطالبات.",
    primaryAction: "تشغيل العمليات الذاتية",
  },
  digitalTwin: {
    eyebrow: "AVOS DIGITAL TWIN COMMAND",
    title: "قيادة التوأم الرقمي",
    description: "محاكاة المؤسسة والأسواق والسعة والمخاطر قبل تنفيذ القرارات الحقيقية.",
    heroValue: "93%",
    heroLabel: "دقة المحاكاة",
    metrics: [
      { label: "نماذج نشطة", value: "42", note: "+8" },
      { label: "سيناريوهات اليوم", value: "164", note: "12 حرجة" },
      { label: "قرارات متجنبة", value: "27", note: "مخاطر مرتفعة" },
      { label: "قيمة محمية", value: "4.2M", note: "AED" },
    ],
    records: [
      { id: "TWN-4601", title: "محاكاة توسع أبوظبي الغربية", owner: "Enterprise Twin", status: "opportunity", score: 95, summary: "ثلاثة نماذج تشغيلية تم اختبارها.", impact: "تحديد نموذج بعائد 31%.", action: "اعتماد السيناريو" },
      { id: "TWN-4602", title: "ضغط مزاد المركبات", owner: "Marketplace Twin", status: "watch", score: 81, summary: "زيادة متوقعة في العروض المتزامنة.", impact: "احتمال بطء 9%.", action: "رفع السعة" },
      { id: "TWN-4603", title: "تعطل بوابة دفع", owner: "Resilience Twin", status: "healthy", score: 97, summary: "اختبار التحويل التلقائي نجح.", impact: "استمرارية دون فقد معاملات.", action: "توثيق النتيجة" },
    ],
    intelligence: "سيناريو التوسع جاهز للاعتماد، مع ضرورة رفع سعة المزاد قبل الحملة القادمة.",
    primaryAction: "تشغيل المحاكاة الشاملة",
  },
  innovation: {
    eyebrow: "AVOS INNOVATION & VENTURE LAB",
    title: "مختبر الابتكار والمشاريع",
    description: "إدارة الأفكار والتجارب والمنتجات المستقبلية والاستثمارات الداخلية.",
    heroValue: "28",
    heroLabel: "فرصة ابتكار نشطة",
    metrics: [
      { label: "تجارب جارية", value: "18", note: "6 واعدة" },
      { label: "منتجات مرشحة", value: "9", note: "+3" },
      { label: "قيمة مستقبلية", value: "22M", note: "AED" },
      { label: "زمن التجربة", value: "12d", note: "-34%" },
    ],
    records: [
      { id: "INV-4701", title: "سوق قطع ذكي بالصور", owner: "Venture Studio", status: "opportunity", score: 96, summary: "التعرف على القطعة وربطها بالمورد فورياً.", impact: "عمولات وسوق جديد.", action: "إطلاق MVP" },
      { id: "INV-4702", title: "تأمين لحظي حسب الاستخدام", owner: "InsurTech Lab", status: "watch", score: 79, summary: "النموذج التجاري قوي ويحتاج شريكاً مرخصاً.", impact: "إيراد إحالة متكرر.", action: "بدء تفاوض الشريك" },
      { id: "INV-4703", title: "مساعد عزم المرئي", owner: "AI Experience Lab", status: "healthy", score: 91, summary: "تجربة رفع صورة وتوليد رحلة خدمة كاملة.", impact: "خفض خطوات المستخدم 63%.", action: "توسيع الاختبار" },
    ],
    intelligence: "سوق القطع الذكي هو أعلى فرصة قريبة، يليه مساعد عزم المرئي متعدد الخدمات.",
    primaryAction: "إطلاق مسار الابتكار",
  },
  ecosystem: {
    eyebrow: "AVOS ECOSYSTEM ECONOMY CENTER",
    title: "مركز اقتصاد المنظومة",
    description: "قياس قيمة الشبكة والعمولات والشركاء وتدفقات الاقتصاد داخل AVOS.",
    heroValue: "12.8M",
    heroLabel: "قيمة المنظومة الشهرية",
    metrics: [
      { label: "شركاء نشطون", value: "486", note: "+41" },
      { label: "عمولات", value: "1.46M", note: "+17%" },
      { label: "معاملات", value: "38.2K", note: "+22%" },
      { label: "احتفاظ الشركاء", value: "94%", note: "+4%" },
    ],
    records: [
      { id: "ECO-4801", title: "شبكة مزودي الفحص", owner: "Partner Economy", status: "healthy", score: 94, summary: "نمو متوازن في الطلب والتغطية.", impact: "زيادة عمولات 18%.", action: "توسيع الشبكة" },
      { id: "ECO-4802", title: "قناة شحن التصدير", owner: "Export Economy", status: "opportunity", score: 97, summary: "طلب خارجي مرتفع وشركاء جاهزون.", impact: "2.4M AED سنوياً.", action: "تشغيل القناة" },
      { id: "ECO-4803", title: "اختلال عمولة فئة واحدة", owner: "Marketplace Economics", status: "critical", score: 66, summary: "الهامش أقل من تكلفة الخدمة.", impact: "تآكل ربحية شهري.", action: "إعادة تسعير العمولة" },
    ],
    intelligence: "قناة شحن التصدير تستحق الإطلاق الفوري مع إعادة تسعير الفئة منخفضة الهامش.",
    primaryAction: "تشغيل اقتصاد المنظومة",
  },
};
