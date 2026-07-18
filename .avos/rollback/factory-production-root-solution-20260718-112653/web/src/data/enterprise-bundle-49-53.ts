export type EnterpriseCenterKey = "resilience" | "strategy" | "standards" | "academy" | "sdk";

export type CenterMetric = { label: string; value: string; note: string };
export type CenterRecord = { id: string; title: string; owner: string; status: "healthy" | "watch" | "critical" | "opportunity"; score: number; summary: string; impact: string; action: string };
export type CenterDefinition = { eyebrow: string; title: string; description: string; heroValue: string; heroLabel: string; metrics: CenterMetric[]; records: CenterRecord[]; intelligence: string; primaryAction: string };

export const enterpriseBundleCenters: Record<EnterpriseCenterKey, CenterDefinition> = {
  resilience: {
    eyebrow: "AVOS ENTERPRISE RESILIENCE COMMAND", title: "قيادة مرونة المؤسسة", description: "غرفة قيادة موحدة للاستمرارية والتعافي والجاهزية أمام الاضطرابات التشغيلية والتقنية.", heroValue: "94.7%", heroLabel: "مؤشر المرونة الشامل",
    metrics: [{ label: "خدمات حرجة", value: "38", note: "37 محمية" },{ label: "زمن التعافي", value: "11 د", note: "-24%" },{ label: "سيناريوهات مختبرة", value: "126", note: "هذا الربع" },{ label: "فجوات مفتوحة", value: "3", note: "أولوية عالية" }],
    records: [
      { id: "RES-4901", title: "اختبار تعافي بوابة المعاملات", owner: "Resilience Office", status: "healthy", score: 98, summary: "أثبت الاختبار استعادة البوابة ضمن الهدف المعتمد.", impact: "حماية الإيرادات واستمرارية الخدمة.", action: "اعتماد النتيجة" },
      { id: "RES-4902", title: "اعتماد بديل مزود الهوية", owner: "Identity Continuity", status: "critical", score: 61, summary: "المسار البديل لمزود الهوية لم يكتمل بعد.", impact: "منع توقف تسجيل الدخول المؤسسي.", action: "تفعيل خطة الطوارئ" },
      { id: "RES-4903", title: "محاكاة انقطاع إقليمي", owner: "Crisis Simulation", status: "opportunity", score: 89, summary: "سيناريو جديد لاختبار التحويل بين المناطق.", impact: "خفض زمن الاستعادة المتوقع 32%.", action: "تشغيل المحاكاة" }
    ], intelligence: "الأولوية هي إغلاق فجوة الهوية ثم تنفيذ محاكاة الانقطاع الإقليمي قبل نافذة الإطلاق القادمة.", primaryAction: "تشغيل خطة المرونة"
  },
  strategy: {
    eyebrow: "AVOS AI STRATEGIC PLANNING CENTER", title: "مركز التخطيط الاستراتيجي", description: "تحويل الطموحات إلى محافظ مبادرات وسيناريوهات وقرارات قابلة للقياس والتنفيذ.", heroValue: "88/100", heroLabel: "اتساق الخطة",
    metrics: [{ label: "أهداف نشطة", value: "24", note: "6 استراتيجية" },{ label: "مبادرات", value: "73", note: "81% على المسار" },{ label: "قيمة متوقعة", value: "42.8M", note: "+9.4%" },{ label: "قرارات معلقة", value: "5", note: "تحتاج اعتماد" }],
    records: [
      { id: "STR-5001", title: "تسريع منصة التجارة الذكية", owner: "Growth Strategy", status: "opportunity", score: 93, summary: "سيناريو التوسع يظهر عائداً أعلى مع إطلاق مرحلي.", impact: "رفع القيمة السنوية المتوقعة 8.6M.", action: "اعتماد السيناريو" },
      { id: "STR-5002", title: "إعادة موازنة محفظة المبادرات", owner: "Portfolio Office", status: "watch", score: 76, summary: "ثلاث مبادرات تستهلك موارد أعلى من القيمة المحققة.", impact: "تحرير 14% من القدرة التنفيذية.", action: "إعادة التخصيص" },
      { id: "STR-5003", title: "خطة دخول سوق جديد", owner: "Market Intelligence", status: "healthy", score: 91, summary: "الجاهزية التنظيمية والتجارية ضمن الحدود المستهدفة.", impact: "فتح قناة نمو جديدة منخفضة المخاطر.", action: "بدء المرحلة الأولى" }
    ], intelligence: "أفضل مسار هو اعتماد التوسع المرحلي وإعادة تخصيص الموارد من المبادرات منخفضة العائد.", primaryAction: "إنشاء الخطة التنفيذية"
  },
  standards: {
    eyebrow: "AVOS GLOBAL STANDARDS OBSERVATORY", title: "مرصد المعايير العالمية", description: "رصد مستمر للمعايير واللوائح والتغييرات التنظيمية وتحويلها إلى إجراءات امتثال.", heroValue: "96.2%", heroLabel: "تغطية المعايير",
    metrics: [{ label: "معايير مراقبة", value: "184", note: "23 سوقاً" },{ label: "تغييرات جديدة", value: "17", note: "آخر 30 يوماً" },{ label: "فجوات امتثال", value: "4", note: "2 حرجة" },{ label: "سياسات محدثة", value: "29", note: "تلقائياً" }],
    records: [
      { id: "STD-5101", title: "تحديث متطلبات حوكمة الذكاء الاصطناعي", owner: "Regulatory Intelligence", status: "critical", score: 68, summary: "متطلبات إضافية للتفسير وسجل القرارات عالية التأثير.", impact: "تجنب تأخير الاعتماد التنظيمي.", action: "تحديث السياسة" },
      { id: "STD-5102", title: "مواءمة معيار استمرارية الأعمال", owner: "Standards Mapping", status: "healthy", score: 97, summary: "تمت مواءمة الضوابط مع إطار المرونة المؤسسية.", impact: "جاهزية تدقيق كاملة.", action: "إغلاق الفجوة" },
      { id: "STD-5103", title: "مراقبة معيار أمان سلاسل البرمجيات", owner: "Software Assurance", status: "watch", score: 82, summary: "نسخة محدثة قيد المراجعة قبل التبني.", impact: "تحسين سلامة سلسلة التوريد.", action: "إعداد التقييم" }
    ], intelligence: "يجب تحديث سياسة الذكاء الاصطناعي أولاً ثم إنهاء تقييم معيار سلسلة البرمجيات.", primaryAction: "تشغيل مزامنة المعايير"
  },
  academy: {
    eyebrow: "AVOS ENTERPRISE KNOWLEDGE ACADEMY", title: "أكاديمية المعرفة المؤسسية", description: "منصة قدرات ومسارات وشهادات تربط التعلم بالأدوار والأداء والتحول المؤسسي.", heroValue: "91%", heroLabel: "جاهزية القدرات",
    metrics: [{ label: "مسارات نشطة", value: "46", note: "12 متقدمة" },{ label: "متعلمين", value: "1,284", note: "+18%" },{ label: "شهادات", value: "327", note: "هذا الربع" },{ label: "فجوات مهارية", value: "7", note: "تحت المعالجة" }],
    records: [
      { id: "KNO-5201", title: "مسار قادة الذكاء المؤسسي", owner: "Leadership Academy", status: "healthy", score: 95, summary: "مسار عملي لقيادة القرارات والتحول المعتمد على الذكاء.", impact: "رفع سرعة القرار وجودته.", action: "توسعة التسجيل" },
      { id: "KNO-5202", title: "فجوة هندسة الاعتمادية", owner: "Capability Intelligence", status: "critical", score: 63, summary: "نقص في مهارات الاستجابة للحوادث والمرونة السحابية.", impact: "خفض مخاطر التشغيل الحرجة.", action: "إطلاق معسكر مكثف" },
      { id: "KNO-5203", title: "شهادة AVOS Architecture", owner: "Certification Office", status: "opportunity", score: 90, summary: "برنامج اعتماد معماري موحد للمطورين والشركاء.", impact: "رفع جودة التنفيذ عبر المنظومة.", action: "اعتماد المنهج" }
    ], intelligence: "ابدأ بمعسكر الاعتمادية واعتمد شهادة العمارة لتوحيد جودة التنفيذ داخلياً ومع الشركاء.", primaryAction: "إطلاق خطة القدرات"
  },
  sdk: {
    eyebrow: "AVOS UNIVERSAL SDK CENTER", title: "مركز AVOS Universal SDK", description: "مركز موحد لحزم التكامل والإصدارات والتوافق وتجربة المطورين عبر جميع منتجات AVOS.", heroValue: "99.1%", heroLabel: "سلامة التوافق",
    metrics: [{ label: "حزم SDK", value: "18", note: "9 لغات" },{ label: "تكاملات نشطة", value: "2,460", note: "+11%" },{ label: "توافق الإصدارات", value: "99.1%", note: "آخر إصدار" },{ label: "مشكلات مطورين", value: "8", note: "متوسط 3 ساعات" }],
    records: [
      { id: "SDK-5301", title: "إطلاق TypeScript SDK 4.0", owner: "Developer Platform", status: "healthy", score: 98, summary: "إصدار موحد يدعم التتبع والسياسات والأحداث الموقعة.", impact: "خفض زمن التكامل 41%.", action: "ترقية القنوات" },
      { id: "SDK-5302", title: "توافق Python مع بوابة الأحداث", owner: "Compatibility Lab", status: "watch", score: 79, summary: "اختبار أخير مطلوب لحالات إعادة المحاولة الطويلة.", impact: "منع فقد الرسائل في الأحمال العالية.", action: "تشغيل الاختبار" },
      { id: "SDK-5303", title: "بوابة مطورين للشركاء", owner: "Partner Engineering", status: "opportunity", score: 92, summary: "تجربة موحدة للمفاتيح والتوثيق وبيئات الاختبار.", impact: "تسريع انضمام الشركاء 55%.", action: "فتح النسخة التجريبية" }
    ], intelligence: "أكمل اختبار Python ثم افتح بوابة الشركاء التجريبية مع الترقية التدريجية لـ TypeScript SDK 4.0.", primaryAction: "تشغيل خطة SDK"
  }
};
