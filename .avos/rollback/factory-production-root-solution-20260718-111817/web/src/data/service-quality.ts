export type QualityCaseStatus =
  | "open"
  | "investigating"
  | "recovery"
  | "resolved"
  | "closed";

export type QualityCaseSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type QualityChannel =
  | "survey"
  | "call"
  | "whatsapp"
  | "marketplace"
  | "provider";

export type QualityCase = {
  id: string;
  requestId: string;
  customerName: string;
  vehicle: string;
  service: string;
  provider: string;
  branch: string;
  city: string;
  channel: QualityChannel;
  severity: QualityCaseSeverity;
  status: QualityCaseStatus;
  owner: string;
  createdAt: string;
  score: number;
  sentiment: number;
  responseMinutes: number;
  targetMinutes: number;
  estimatedRecoveryCost: number;
  customerLifetimeValue: number;
  complaint: string;
  rootCause: string;
  aiRecommendation: string;
  recoveryPlan: string;
};

export type QualitySurvey = {
  id: string;
  requestId: string;
  customerName: string;
  score: number;
  nps: number;
  csat: number;
  effort: number;
  submittedAt: string;
  comment: string;
};

export const qualityCases: QualityCase[] = [
  {
    id: "QC-5101",
    requestId: "SR-24044",
    customerName: "نورة الحمادي",
    vehicle: "Tesla Model Y 2025",
    service: "فحص نظام الشحن",
    provider: "EV Tech Emirates",
    branch: "مركز الشارقة",
    city: "الشارقة",
    channel: "survey",
    severity: "critical",
    status: "recovery",
    owner: "فاطمة النقبي",
    createdAt: "2026-07-12T11:15:00+04:00",
    score: 42,
    sentiment: 18,
    responseMinutes: 28,
    targetMinutes: 20,
    estimatedRecoveryCost: 850,
    customerLifetimeValue: 18400,
    complaint: "تأخر التشخيص وعدم وضوح التحديثات المقدمة للعميلة.",
    rootCause: "ضعف الربط بين فريق الاستقبال والفني المختص.",
    aiRecommendation:
      "اتصال فوري من مدير التجربة، توفير مركبة بديلة، وتحديث كل 30 دقيقة.",
    recoveryPlan:
      "مركبة بديلة مجانية، خصم 25%، وتمديد ضمان الفحص لمدة 12 شهراً.",
  },
  {
    id: "QC-5102",
    requestId: "SR-24042",
    customerName: "مريم الشامسي",
    vehicle: "Nissan Patrol 2023",
    service: "تبديل بطارية متنقل",
    provider: "Rapid Battery UAE",
    branch: "وحدة دبي المتنقلة",
    city: "دبي",
    channel: "whatsapp",
    severity: "high",
    status: "investigating",
    owner: "عبدالله الكتبي",
    createdAt: "2026-07-12T10:42:00+04:00",
    score: 58,
    sentiment: 35,
    responseMinutes: 16,
    targetMinutes: 15,
    estimatedRecoveryCost: 180,
    customerLifetimeValue: 9200,
    complaint: "تجاوز الفني الموعد المتوقع دون إشعار مسبق.",
    rootCause: "ازدحام ميداني وعدم تشغيل مزود احتياطي تلقائياً.",
    aiRecommendation:
      "تفعيل مزود احتياطي وإرسال وقت وصول مؤكد مع قسيمة اعتذار.",
    recoveryPlan: "خصم 15% وفحص بطارية مجاني بعد 90 يوماً.",
  },
  {
    id: "QC-5103",
    requestId: "SR-24043",
    customerName: "راشد المزروعي",
    vehicle: "Mercedes-Benz S 500 2022",
    service: "صيانة دورية متقدمة",
    provider: "Premium Auto Care",
    branch: "مركز القوز",
    city: "دبي",
    channel: "call",
    severity: "medium",
    status: "open",
    owner: "سارة المهيري",
    createdAt: "2026-07-12T09:35:00+04:00",
    score: 67,
    sentiment: 49,
    responseMinutes: 11,
    targetMinutes: 30,
    estimatedRecoveryCost: 240,
    customerLifetimeValue: 26700,
    complaint: "طلب موافقة إضافية على قطع لم تكن ضمن التقدير الأولي.",
    rootCause: "نطاق الفحص الأولي لم يشمل القطع الاستهلاكية الإضافية.",
    aiRecommendation:
      "شرح التقرير الفني بالصور وتقديم خيارين واضحين للسعر.",
    recoveryPlan: "إعفاء رسوم التشخيص وتثبيت سعر العمالة.",
  },
  {
    id: "QC-5104",
    requestId: "SR-24041",
    customerName: "أحمد المنصوري",
    vehicle: "Toyota Land Cruiser 2024",
    service: "فحص شامل قبل السفر",
    provider: "AVOS Inspection Network",
    branch: "فرع أبوظبي الرئيسي",
    city: "أبوظبي",
    channel: "marketplace",
    severity: "low",
    status: "resolved",
    owner: "حمد السويدي",
    createdAt: "2026-07-12T08:50:00+04:00",
    score: 82,
    sentiment: 76,
    responseMinutes: 8,
    targetMinutes: 30,
    estimatedRecoveryCost: 0,
    customerLifetimeValue: 14600,
    complaint: "العميل طلب نسخة أوضح من تقرير الفحص.",
    rootCause: "تنسيق التقرير على الهاتف لم يكن مثالياً.",
    aiRecommendation: "إرسال نسخة محسنة وشرح أهم النتائج.",
    recoveryPlan: "تم إرسال التقرير المحسن وإغلاق الحالة بعد التأكيد.",
  },
  {
    id: "QC-5105",
    requestId: "SR-24045",
    customerName: "سعيد الظاهري",
    vehicle: "Ford F-150 2021",
    service: "إصلاح نظام التبريد",
    provider: "Desert Garage Pro",
    branch: "فرع العين",
    city: "العين",
    channel: "provider",
    severity: "high",
    status: "investigating",
    owner: "مها الشامسي",
    createdAt: "2026-07-12T12:05:00+04:00",
    score: 54,
    sentiment: 31,
    responseMinutes: 34,
    targetMinutes: 20,
    estimatedRecoveryCost: 320,
    customerLifetimeValue: 11800,
    complaint: "عدم تعيين فني مختص بالسرعة المتوقعة.",
    rootCause: "عدم تحديث جدول مهارات الفنيين في الفرع.",
    aiRecommendation:
      "نقل الطلب لفريق متنقل وتحديث مصفوفة مهارات الفنيين.",
    recoveryPlan: "أولوية تنفيذ وخصم 20% على أجور العمل.",
  },
  {
    id: "QC-5106",
    requestId: "SR-24046",
    customerName: "خالد القاسمي",
    vehicle: "BMW X5 2024",
    service: "تنظيف وتلميع فاخر",
    provider: "Signature Detailing",
    branch: "جزيرة المارية",
    city: "أبوظبي",
    channel: "survey",
    severity: "low",
    status: "closed",
    owner: "ريم العامري",
    createdAt: "2026-07-12T10:10:00+04:00",
    score: 96,
    sentiment: 94,
    responseMinutes: 4,
    targetMinutes: 30,
    estimatedRecoveryCost: 0,
    customerLifetimeValue: 22100,
    complaint: "لا توجد شكوى؛ الحالة منشأة لرصد تجربة مميزة.",
    rootCause: "تجربة ناجحة واهتمام استباقي من الفريق.",
    aiRecommendation:
      "طلب تقييم عام واقتراح عضوية حماية شهرية مخصصة.",
    recoveryPlan: "تم تحويل الحالة إلى فرصة ولاء ونمو.",
  },
];

export const qualitySurveys: QualitySurvey[] = [
  {
    id: "QS-8101",
    requestId: "SR-24041",
    customerName: "أحمد المنصوري",
    score: 88,
    nps: 9,
    csat: 92,
    effort: 89,
    submittedAt: "2026-07-12T12:30:00+04:00",
    comment: "الفحص ممتاز والتقرير واضح بعد التحديث.",
  },
  {
    id: "QS-8102",
    requestId: "SR-24042",
    customerName: "مريم الشامسي",
    score: 58,
    nps: 4,
    csat: 55,
    effort: 51,
    submittedAt: "2026-07-12T11:50:00+04:00",
    comment: "الخدمة جيدة لكن وقت الوصول لم يكن دقيقاً.",
  },
  {
    id: "QS-8103",
    requestId: "SR-24044",
    customerName: "نورة الحمادي",
    score: 42,
    nps: 2,
    csat: 39,
    effort: 35,
    submittedAt: "2026-07-12T11:10:00+04:00",
    comment: "احتجت للتواصل أكثر من مرة للحصول على تحديث.",
  },
  {
    id: "QS-8104",
    requestId: "SR-24046",
    customerName: "خالد القاسمي",
    score: 96,
    nps: 10,
    csat: 98,
    effort: 95,
    submittedAt: "2026-07-12T10:05:00+04:00",
    comment: "تجربة ممتازة وسريعة من البداية للنهاية.",
  },
];

export const qualityStatusLabels: Record<QualityCaseStatus, string> = {
  open: "مفتوحة",
  investigating: "قيد التحقيق",
  recovery: "استرداد التجربة",
  resolved: "تم الحل",
  closed: "مغلقة",
};

export const qualitySeverityLabels: Record<QualityCaseSeverity, string> = {
  low: "منخفضة",
  medium: "متوسطة",
  high: "عالية",
  critical: "حرجة",
};
