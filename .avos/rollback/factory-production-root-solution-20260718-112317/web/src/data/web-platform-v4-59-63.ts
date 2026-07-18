export type WebPlatformV4CenterKey =
  | "strategicPlanner"
  | "resilienceLab"
  | "enterpriseCoach"
  | "knowledgeAcademy"
  | "legacyModernization";

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

export const webPlatformV4Centers: Record<WebPlatformV4CenterKey, CenterDefinition> = {
  strategicPlanner: {
    eyebrow: "AVOS AI STRATEGIC PLANNER",
    title: "قيادة المخطط الاستراتيجي",
    description: "تحويل الرؤية المؤسسية إلى خطط مترابطة تربط الأهداف والموارد والمخاطر والنتائج.",
    heroValue: "91.7%",
    heroLabel: "اكتمال الخطة الاستراتيجية",
    metrics: [
      { label: "أهداف استراتيجية", value: "48", note: "12 أولوية" },
      { label: "مبادرات نشطة", value: "126", note: "18 حرجة" },
      { label: "تبعيات", value: "384", note: "موثقة" },
      { label: "فجوات تنفيذ", value: "7", note: "تحتاج تدخل" }
    ],
    records: [
      { id: "STR-5901", title: "التوسع في سوق إقليمي جديد", owner: "Strategy Office", status: "healthy", score: 96, summary: "خطة مترابطة تربط الاستثمار والامتثال والتشغيل والإيرادات.", impact: "رفع سرعة الدخول وخفض مخاطر التنفيذ.", action: "اعتماد الخطة" },
      { id: "STR-5902", title: "إعادة توزيع ميزانية الابتكار", owner: "Portfolio Council", status: "watch", score: 81, summary: "تحتاج الخطة إلى تحديث افتراضات العائد لبعض المبادرات.", impact: "تحسين تخصيص رأس المال.", action: "تحديث الافتراضات" },
      { id: "STR-5903", title: "خطة استقلالية الذكاء المؤسسي", owner: "Enterprise Brain", status: "opportunity", score: 93, summary: "مسار تدريجي لزيادة الاعتماد على الذكاء الداخلي الآمن.", impact: "رفع السيادة والقدرة التنافسية.", action: "تشغيل المسار" }
    ],
    intelligence: "ابدأ بتحديث افتراضات العائد ثم فعّل مسار استقلالية الذكاء المؤسسي ضمن نافذة تنفيذ مرحلية.",
    primaryAction: "تشغيل دورة التخطيط"
  },
  resilienceLab: {
    eyebrow: "AVOS ENTERPRISE RESILIENCE LABORATORY",
    title: "مختبر المرونة المؤسسية",
    description: "محاكاة الصدمات واختبار نقاط الفشل وبناء خطط الاستجابة والتعافي واستمرارية الأعمال.",
    heroValue: "88.9%",
    heroLabel: "مؤشر الجاهزية للصدمات",
    metrics: [
      { label: "سيناريوهات نشطة", value: "36", note: "9 عالية الأثر" },
      { label: "خطط تعافي", value: "24", note: "6 قيد التحسين" },
      { label: "اختبارات ناجحة", value: "118", note: "آخر 90 يومًا" },
      { label: "نقاط ضعف", value: "8", note: "تحت المعالجة" }
    ],
    records: [
      { id: "RES-6001", title: "انقطاع مزود سحابي رئيسي", owner: "Resilience Office", status: "healthy", score: 95, summary: "نجحت خطة التحويل التلقائي والاستعادة ضمن الزمن المستهدف.", impact: "خفض توقف الخدمات الحرجة.", action: "اعتماد السيناريو" },
      { id: "RES-6002", title: "ضغط مفاجئ على قنوات العملاء", owner: "Customer Operations", status: "critical", score: 69, summary: "قدرة الاستجابة الحالية أقل من سيناريو الذروة المتوقع.", impact: "منع تدهور الخدمة والسمعة.", action: "رفع السعة" },
      { id: "RES-6003", title: "اختبار تعافي سلسلة التوريد", owner: "Supply Network", status: "opportunity", score: 90, summary: "فرصة لاختبار بدائل موردين ومسارات لوجستية متعددة.", impact: "زيادة استمرارية الإمداد.", action: "تشغيل المحاكاة" }
    ],
    intelligence: "الأولوية القصوى هي رفع سعة قنوات العملاء ثم تنفيذ محاكاة سلسلة التوريد متعددة البدائل.",
    primaryAction: "تشغيل اختبار المرونة"
  },
  enterpriseCoach: {
    eyebrow: "AVOS AI ENTERPRISE COACH",
    title: "مركز المدرب المؤسسي الذكي",
    description: "إرشاد الفرق والقيادات باستخدام بيانات الأداء والسلوك والمعرفة المؤسسية.",
    heroValue: "92.4%",
    heroLabel: "مؤشر التقدم القيادي",
    metrics: [
      { label: "خطط تطوير", value: "214", note: "نشطة" },
      { label: "فرق مغطاة", value: "42", note: "9 قطاعات" },
      { label: "توصيات منفذة", value: "1,840", note: "+18%" },
      { label: "فجوات قيادية", value: "11", note: "تحتاج متابعة" }
    ],
    records: [
      { id: "COA-6101", title: "رفع جودة القرارات التشغيلية", owner: "Leadership Intelligence", status: "healthy", score: 94, summary: "برنامج توجيه يربط القرارات اليومية بالأدلة والنتائج.", impact: "خفض التكرار وتحسين جودة القرار.", action: "توسيع البرنامج" },
      { id: "COA-6102", title: "تحسين التنسيق بين الفرق", owner: "Organization Development", status: "watch", score: 80, summary: "توجد فجوات في تسليم المسؤوليات بين وحدات متداخلة.", impact: "تقليل التأخير وسوء الفهم.", action: "تفعيل التدريب" },
      { id: "COA-6103", title: "مسار إعداد قادة الذكاء الاصطناعي", owner: "AI Leadership Academy", status: "opportunity", score: 96, summary: "مسار متقدم لبناء قادة قادرين على إدارة التحول الذكي.", impact: "تسريع التحول المؤسسي.", action: "إطلاق المسار" }
    ],
    intelligence: "فعّل تدريب التنسيق بين الفرق بالتوازي مع إطلاق مسار قادة الذكاء الاصطناعي.",
    primaryAction: "تشغيل جلسة التوجيه"
  },
  knowledgeAcademy: {
    eyebrow: "AVOS ENTERPRISE KNOWLEDGE ACADEMY",
    title: "قيادة أكاديمية المعرفة",
    description: "إدارة المسارات التعليمية والشهادات ونقل الخبرات والمعرفة الحرجة بين الفرق.",
    heroValue: "94.6%",
    heroLabel: "مؤشر انتشار المعرفة",
    metrics: [
      { label: "مسارات تعليمية", value: "84", note: "22 متقدمة" },
      { label: "متعلمين نشطين", value: "2,460", note: "+14%" },
      { label: "شهادات", value: "1,180", note: "معتمدة" },
      { label: "معرفة حرجة", value: "17", note: "تحتاج نقل" }
    ],
    records: [
      { id: "KNO-6201", title: "مسار هندسة AVOS المؤسسية", owner: "Knowledge Academy", status: "healthy", score: 97, summary: "مسار متكامل يغطي المعمارية والأمن والبيانات والذكاء.", impact: "توحيد معايير البناء والتطوير.", action: "توسيع التسجيل" },
      { id: "KNO-6202", title: "نقل خبرة نظام الفوترة", owner: "Critical Knowledge Office", status: "critical", score: 67, summary: "المعرفة مركزة لدى عدد محدود من الخبراء.", impact: "منع فقد المعرفة وتعطل التشغيل.", action: "بدء النقل" },
      { id: "KNO-6203", title: "أكاديمية وكلاء الذكاء", owner: "AI Learning Studio", status: "opportunity", score: 92, summary: "برنامج لتصميم وتشغيل ومراقبة وكلاء الذكاء المؤسسي.", impact: "رفع جاهزية الفرق للجيل القادم.", action: "إطلاق الأكاديمية" }
    ],
    intelligence: "ابدأ فورًا بنقل خبرة نظام الفوترة ثم أطلق أكاديمية وكلاء الذكاء كمسار استراتيجي.",
    primaryAction: "تشغيل دورة المعرفة"
  },
  legacyModernization: {
    eyebrow: "AVOS LEGACY MODERNIZATION COMMAND",
    title: "قيادة تحديث الأنظمة القديمة",
    description: "تحويل الأنظمة القديمة إلى منصات حديثة قابلة للتوسع دون فقد المعرفة أو الاستقرار.",
    heroValue: "87.3%",
    heroLabel: "مؤشر تقدم التحديث",
    metrics: [
      { label: "أنظمة ضمن الخطة", value: "73", note: "26 حرجة" },
      { label: "خدمات مفككة", value: "312", note: "موثقة" },
      { label: "رحلات ترحيل", value: "29", note: "11 نشطة" },
      { label: "مخاطر انتقال", value: "9", note: "تحت السيطرة" }
    ],
    records: [
      { id: "MOD-6301", title: "تفكيك نظام إدارة الطلبات", owner: "Modernization Office", status: "healthy", score: 93, summary: "تم تحديد حدود الخدمات وخطة الانتقال المرحلي.", impact: "رفع المرونة وتقليل الاعتماد الأحادي.", action: "بدء التنفيذ" },
      { id: "MOD-6302", title: "تحديث قاعدة بيانات العملاء", owner: "Data Modernization", status: "watch", score: 78, summary: "تحتاج خطة الترحيل إلى اختبار إضافي للتوافق التاريخي.", impact: "منع فقد البيانات أو انقطاع الخدمة.", action: "تشغيل الاختبار" },
      { id: "MOD-6303", title: "تحويل واجهات التكامل إلى منصة موحدة", owner: "Integration Platform", status: "opportunity", score: 91, summary: "توحيد واجهات التكامل القديمة في بوابة مؤسسية حديثة.", impact: "خفض التكلفة وتسريع التكامل.", action: "اعتماد المنصة" }
    ],
    intelligence: "اختبر توافق بيانات العملاء أولًا ثم ابدأ تفكيك نظام الطلبات وتوحيد واجهات التكامل.",
    primaryAction: "تشغيل خطة التحديث"
  }
};
