export type EnterpriseCenterKey =
  | "compliance"
  | "partners"
  | "workforce"
  | "knowledge"
  | "innovation";

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
  compliance: {
    eyebrow: "AVOS COMPLIANCE & GOVERNANCE CENTER",
    title: "مركز الامتثال والحوكمة",
    description: "إدارة السياسات والضوابط والامتثال والمخاطر والاعتمادات المؤسسية.",
    heroValue: "96%",
    heroLabel: "درجة الامتثال",
    metrics: [
      { label: "السياسات النشطة", value: "148", note: "12 محدثة" },
      { label: "الضوابط", value: "324", note: "98% فعالة" },
      { label: "المخاطر المفتوحة", value: "7", note: "2 حرجة" },
      { label: "حزم الأدلة", value: "42", note: "متحققة" },
    ],
    records: [
      { id: "CMP-3401", title: "مراجعة سياسة الاحتفاظ بالسجلات", owner: "Compliance Office", status: "watch", score: 78, summary: "تحديث فترة الاحتفاظ وفق متطلبات التشغيل.", impact: "تعزيز الامتثال وتقليل المخاطر.", action: "اعتماد السياسة" },
      { id: "CMP-3402", title: "إغلاق فجوة MFA", owner: "Security Governance", status: "healthy", score: 94, summary: "تطبيق MFA على الأدوار الحساسة.", impact: "خفض مخاطر الوصول.", action: "توسيع التطبيق" },
      { id: "CMP-3403", title: "اعتماد سجل الأدلة", owner: "Audit Office", status: "opportunity", score: 89, summary: "ربط الأدلة تلقائياً بالقرارات.", impact: "تقليل زمن التدقيق 35%.", action: "تشغيل التكامل" },
    ],
    intelligence: "الأولوية الحالية هي إغلاق فجوة الاحتفاظ بالسجلات وتوسيع التحقق متعدد العوامل.",
    primaryAction: "تشغيل مراجعة الامتثال",
  },

  partners: {
    eyebrow: "AVOS PARTNER ECOSYSTEM CENTER",
    title: "مركز منظومة الشركاء",
    description: "إدارة المزودين والشركاء والعقود والأداء وفرص التوسع.",
    heroValue: "216",
    heroLabel: "شريك نشط",
    metrics: [
      { label: "شركاء مميزون", value: "42", note: "19%" },
      { label: "SLA العام", value: "93.8%", note: "+1.9%" },
      { label: "عقود نشطة", value: "184", note: "12 تجديد" },
      { label: "فرص توسع", value: "28", note: "قيمة 2.1M" },
    ],
    records: [
      { id: "PRT-3501", title: "ترقية مزود إلى الشريحة المميزة", owner: "Partner Success", status: "opportunity", score: 91, summary: "أداء مرتفع واستقرار في SLA.", impact: "زيادة السعة 14%.", action: "اعتماد الترقية" },
      { id: "PRT-3502", title: "خطة تصحيح مزود متراجع", owner: "Provider Governance", status: "critical", score: 54, summary: "ارتفاع التأخير وإعادة العمل.", impact: "83K AED معرضة.", action: "تفعيل التقييد" },
      { id: "PRT-3503", title: "تجديد عقد شريك استراتيجي", owner: "Commercial Partnerships", status: "watch", score: 76, summary: "العقد ينتهي خلال 21 يوماً.", impact: "استمرارية 18% من السعة.", action: "بدء التفاوض" },
    ],
    intelligence: "أفضل قرار هو ترقية المزود الأعلى أداءً مع تقييد المزود المتراجع فوراً.",
    primaryAction: "تشغيل خطة الشركاء",
  },

  workforce: {
    eyebrow: "AVOS WORKFORCE & TALENT CENTER",
    title: "مركز القوى العاملة والمواهب",
    description: "مراقبة السعة والمهارات والتوزيع والتطوير والاحتفاظ بالمواهب.",
    heroValue: "92%",
    heroLabel: "جاهزية القوى العاملة",
    metrics: [
      { label: "الموظفون النشطون", value: "642", note: "+28 هذا الربع" },
      { label: "تغطية المهارات", value: "88%", note: "+5%" },
      { label: "وظائف حرجة", value: "14", note: "4 مفتوحة" },
      { label: "معدل الاحتفاظ", value: "91%", note: "مستقر" },
    ],
    records: [
      { id: "WRK-3601", title: "نقص فنيي المركبات الكهربائية", owner: "Workforce Planning", status: "critical", score: 58, summary: "الطلب يتجاوز السعة الحالية في دبي.", impact: "خطر تجاوز SLA.", action: "فتح توظيف عاجل" },
      { id: "WRK-3602", title: "برنامج تطوير قادة العمليات", owner: "Talent Development", status: "opportunity", score: 87, summary: "مسار جاهز لـ 18 قائداً.", impact: "رفع الجاهزية القيادية.", action: "إطلاق البرنامج" },
      { id: "WRK-3603", title: "إعادة توزيع فرق الدعم", owner: "Workforce Operations", status: "healthy", score: 93, summary: "توازن أفضل بين أبوظبي ودبي.", impact: "خفض زمن الانتظار 16%.", action: "تثبيت التوزيع" },
    ],
    intelligence: "الفجوة الأكبر في فنيي المركبات الكهربائية ويجب معالجتها بالتوظيف والنقل المؤقت.",
    primaryAction: "تشغيل خطة القوى العاملة",
  },

  knowledge: {
    eyebrow: "AVOS ENTERPRISE KNOWLEDGE INTELLIGENCE",
    title: "مركز المعرفة المؤسسية",
    description: "إدارة الوثائق والقرارات والدروس والرؤى والمعرفة القابلة لإعادة الاستخدام.",
    heroValue: "12.8K",
    heroLabel: "أصل معرفي",
    metrics: [
      { label: "وثائق نشطة", value: "8,420", note: "96% مفهرسة" },
      { label: "قرارات موثقة", value: "2,184", note: "+142" },
      { label: "دروس مستفادة", value: "684", note: "هذا العام" },
      { label: "استخدام المعرفة", value: "74%", note: "+11%" },
    ],
    records: [
      { id: "KNW-3701", title: "توثيق قرارات التوسع", owner: "Knowledge Office", status: "opportunity", score: 88, summary: "ربط القرارات بالأثر والنتائج.", impact: "رفع قابلية إعادة الاستخدام.", action: "إنشاء Knowledge Pack" },
      { id: "KNW-3702", title: "فجوة توثيق Runbooks", owner: "Operations Knowledge", status: "watch", score: 69, summary: "8 Runbooks تحتاج تحديثاً.", impact: "خطر بطء الاستجابة.", action: "بدء التحديث" },
      { id: "KNW-3703", title: "استخراج دروس الحوادث", owner: "Incident Learning", status: "healthy", score: 91, summary: "تحويل الحوادث إلى قواعد وقائية.", impact: "خفض التكرار 23%.", action: "تعميم الدروس" },
    ],
    intelligence: "تحديث Runbooks وربط القرارات بالدروس سيعزز التعلم المؤسسي ويقلل تكرار الأخطاء.",
    primaryAction: "تشغيل دورة المعرفة",
  },

  innovation: {
    eyebrow: "AVOS ENTERPRISE INNOVATION LAB",
    title: "مختبر الابتكار المؤسسي",
    description: "إدارة الأفكار والتجارب والنماذج الأولية والمنتجات المستقبلية.",
    heroValue: "47",
    heroLabel: "تجربة نشطة",
    metrics: [
      { label: "أفكار جديدة", value: "126", note: "هذا الربع" },
      { label: "نماذج أولية", value: "18", note: "7 جاهزة" },
      { label: "تجارب ناجحة", value: "64%", note: "+9%" },
      { label: "قيمة متوقعة", value: "6.4M", note: "AED" },
    ],
    records: [
      { id: "INV-3801", title: "مساعد صوتي إماراتي", owner: "Voice OS Lab", status: "opportunity", score: 96, summary: "تجربة صوتية باللهجة الإماراتية.", impact: "رفع التفاعل وتسهيل الاستخدام.", action: "توسيع النموذج" },
      { id: "INV-3802", title: "مزادات دولية ذكية", owner: "Auction OS Lab", status: "opportunity", score: 92, summary: "ربط مزادات محلية ودولية.", impact: "نمو عمولات وتوسع عالمي.", action: "إطلاق Pilot" },
      { id: "INV-3803", title: "Digital Human للمنصة", owner: "AI Experience Lab", status: "watch", score: 74, summary: "تجربة شخصية رقمية تفاعلية.", impact: "تمييز قوي للمنصة.", action: "تحسين الأداء" },
    ],
    intelligence: "المساعد الصوتي والمزادات الدولية هما أعلى فرص الابتكار من حيث الأثر وسرعة التنفيذ.",
    primaryAction: "تشغيل محفظة الابتكار",
  },
};
