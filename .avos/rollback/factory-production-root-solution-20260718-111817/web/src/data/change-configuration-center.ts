export type ChangeRequest = {
  id: string;
  title: string;
  description: string;
  owner: string;
  environment: "development" | "staging" | "production";
  category: "configuration" | "feature" | "security" | "infrastructure";
  risk: "low" | "medium" | "high" | "critical";
  status: "draft" | "review" | "approved" | "scheduled" | "completed";
  scheduledAt: string;
  affectedServices: string[];
  approvals: number;
  approvalsRequired: number;
  rollbackReady: boolean;
  validationPlan: string;
  businessImpact: string;
};

export const changeRequests: ChangeRequest[] = [
  {
    id: "CHG-2301",
    title: "رفع حد السعة لخدمات دبي",
    description: "زيادة الحد التشغيلي لفنيي المركبات الكهربائية خلال الذروة.",
    owner: "Service Operations",
    environment: "production",
    category: "configuration",
    risk: "high",
    status: "scheduled",
    scheduledAt: "اليوم 11:30",
    affectedServices: ["Capacity Dispatch", "Provider Network"],
    approvals: 3,
    approvalsRequired: 3,
    rollbackReady: true,
    validationPlan: "مراقبة SLA والتحميل لمدة 60 دقيقة.",
    businessImpact: "خفض التأخير وحماية الطلبات النشطة.",
  },
  {
    id: "CHG-2302",
    title: "تفعيل سياسة MFA المحسنة",
    description: "فرض التحقق الإضافي على الأدوار الحساسة.",
    owner: "Security Operations",
    environment: "production",
    category: "security",
    risk: "medium",
    status: "approved",
    scheduledAt: "اليوم 14:00",
    affectedServices: ["Identity", "Policy Control"],
    approvals: 2,
    approvalsRequired: 2,
    rollbackReady: true,
    validationPlan: "اختبار تسجيل الدخول للأدوار الحساسة.",
    businessImpact: "رفع مستوى الحماية وتقليل مخاطر الوصول.",
  },
  {
    id: "CHG-2303",
    title: "تحديث محرك التسعير",
    description: "نشر قواعد تسعير ديناميكي جديدة لخدمات الطوارئ.",
    owner: "Revenue Platform",
    environment: "staging",
    category: "feature",
    risk: "high",
    status: "review",
    scheduledAt: "غداً 09:00",
    affectedServices: ["Pricing Engine", "Revenue Intelligence"],
    approvals: 1,
    approvalsRequired: 3,
    rollbackReady: true,
    validationPlan: "اختبار التحويل والهامش قبل الإنتاج.",
    businessImpact: "فرصة زيادة الإيراد اليومي.",
  },
  {
    id: "CHG-2304",
    title: "توسعة عقدة التحليلات",
    description: "إضافة سعة معالجة لتحليلات الأحداث المباشرة.",
    owner: "Platform Engineering",
    environment: "production",
    category: "infrastructure",
    risk: "medium",
    status: "completed",
    scheduledAt: "أمس 22:00",
    affectedServices: ["Analytics OS", "Event Stream"],
    approvals: 2,
    approvalsRequired: 2,
    rollbackReady: true,
    validationPlan: "مقارنة الأداء قبل وبعد التوسعة.",
    businessImpact: "خفض زمن التحليل وتحسين الاستجابة.",
  },
  {
    id: "CHG-2305",
    title: "تعديل سياسة احتفاظ السجلات",
    description: "زيادة فترة الاحتفاظ بسجلات التدقيق الحساسة.",
    owner: "Compliance Office",
    environment: "production",
    category: "configuration",
    risk: "critical",
    status: "draft",
    scheduledAt: "غير مجدول",
    affectedServices: ["Audit Ledger", "Evidence Vault"],
    approvals: 0,
    approvalsRequired: 4,
    rollbackReady: false,
    validationPlan: "مراجعة الأثر القانوني والتكلفة التخزينية.",
    businessImpact: "تعزيز الامتثال وحفظ الأدلة.",
  },
];

export const changeEnvironmentLabels = {
  development: "التطوير",
  staging: "الاختبار",
  production: "الإنتاج",
} as const;

export const changeStatusLabels = {
  draft: "مسودة",
  review: "قيد المراجعة",
  approved: "معتمد",
  scheduled: "مجدول",
  completed: "مكتمل",
} as const;

export const changeCategoryLabels = {
  configuration: "تهيئة",
  feature: "ميزة",
  security: "أمان",
  infrastructure: "بنية تحتية",
} as const;
