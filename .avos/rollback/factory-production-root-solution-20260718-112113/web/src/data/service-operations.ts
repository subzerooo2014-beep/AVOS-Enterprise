export type ServiceRequestStatus =
  | "new"
  | "assigned"
  | "in-progress"
  | "waiting-customer"
  | "completed"
  | "escalated";

export type ServiceRequestPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type ServiceChannel =
  | "marketplace"
  | "provider"
  | "vehicle"
  | "phone"
  | "assistant";

export type ServiceRequest = {
  id: string;
  customerName: string;
  vehicle: string;
  service: string;
  provider: string;
  branch: string;
  city: string;
  channel: ServiceChannel;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  createdAt: string;
  promisedAt: string;
  progress: number;
  slaMinutes: number;
  elapsedMinutes: number;
  assignee: string;
  estimatedValue: number;
  aiRiskScore: number;
  nextBestAction: string;
};

export const serviceRequests: ServiceRequest[] = [
  {
    id: "SR-24041",
    customerName: "أحمد المنصوري",
    vehicle: "Toyota Land Cruiser 2024",
    service: "فحص شامل قبل السفر",
    provider: "AVOS Inspection Network",
    branch: "فرع أبوظبي الرئيسي",
    city: "أبوظبي",
    channel: "marketplace",
    priority: "high",
    status: "in-progress",
    createdAt: "2026-07-12T08:15:00+04:00",
    promisedAt: "2026-07-12T12:15:00+04:00",
    progress: 68,
    slaMinutes: 240,
    elapsedMinutes: 191,
    assignee: "سالم الكعبي",
    estimatedValue: 690,
    aiRiskScore: 41,
    nextBestAction: "إرسال تحديث مرحلي للعميل خلال 15 دقيقة.",
  },
  {
    id: "SR-24042",
    customerName: "مريم الشامسي",
    vehicle: "Nissan Patrol 2023",
    service: "تبديل بطارية متنقل",
    provider: "Rapid Battery UAE",
    branch: "وحدة دبي المتنقلة",
    city: "دبي",
    channel: "assistant",
    priority: "critical",
    status: "assigned",
    createdAt: "2026-07-12T09:25:00+04:00",
    promisedAt: "2026-07-12T10:25:00+04:00",
    progress: 32,
    slaMinutes: 60,
    elapsedMinutes: 47,
    assignee: "خالد السويدي",
    estimatedValue: 430,
    aiRiskScore: 78,
    nextBestAction: "تأكيد وصول الفني وإتاحة مزود احتياطي فوراً.",
  },
  {
    id: "SR-24043",
    customerName: "راشد المزروعي",
    vehicle: "Mercedes-Benz S 500 2022",
    service: "صيانة دورية متقدمة",
    provider: "Premium Auto Care",
    branch: "مركز القوز",
    city: "دبي",
    channel: "provider",
    priority: "normal",
    status: "waiting-customer",
    createdAt: "2026-07-12T07:40:00+04:00",
    promisedAt: "2026-07-12T15:40:00+04:00",
    progress: 54,
    slaMinutes: 480,
    elapsedMinutes: 229,
    assignee: "يوسف المهيري",
    estimatedValue: 2850,
    aiRiskScore: 29,
    nextBestAction: "طلب موافقة العميل على القطع الإضافية.",
  },
  {
    id: "SR-24044",
    customerName: "نورة الحمادي",
    vehicle: "Tesla Model Y 2025",
    service: "فحص نظام الشحن",
    provider: "EV Tech Emirates",
    branch: "مركز الشارقة",
    city: "الشارقة",
    channel: "vehicle",
    priority: "high",
    status: "escalated",
    createdAt: "2026-07-12T06:55:00+04:00",
    promisedAt: "2026-07-12T10:55:00+04:00",
    progress: 46,
    slaMinutes: 240,
    elapsedMinutes: 252,
    assignee: "علي النقبي",
    estimatedValue: 1100,
    aiRiskScore: 91,
    nextBestAction: "تصعيد لمدير العمليات وتوفير مركبة بديلة.",
  },
  {
    id: "SR-24045",
    customerName: "سعيد الظاهري",
    vehicle: "Ford F-150 2021",
    service: "إصلاح نظام التبريد",
    provider: "Desert Garage Pro",
    branch: "فرع العين",
    city: "العين",
    channel: "phone",
    priority: "normal",
    status: "new",
    createdAt: "2026-07-12T10:05:00+04:00",
    promisedAt: "2026-07-12T16:05:00+04:00",
    progress: 10,
    slaMinutes: 360,
    elapsedMinutes: 22,
    assignee: "غير معيّن",
    estimatedValue: 1600,
    aiRiskScore: 18,
    nextBestAction: "تعيين فني تبريد متاح في فرع العين.",
  },
  {
    id: "SR-24046",
    customerName: "خالد القاسمي",
    vehicle: "BMW X5 2024",
    service: "تنظيف وتلميع فاخر",
    provider: "Signature Detailing",
    branch: "جزيرة المارية",
    city: "أبوظبي",
    channel: "marketplace",
    priority: "low",
    status: "completed",
    createdAt: "2026-07-12T05:30:00+04:00",
    promisedAt: "2026-07-12T09:30:00+04:00",
    progress: 100,
    slaMinutes: 240,
    elapsedMinutes: 201,
    assignee: "ماجد العامري",
    estimatedValue: 780,
    aiRiskScore: 4,
    nextBestAction: "طلب تقييم الخدمة واقتراح باقة حماية شهرية.",
  },
];

export const serviceOperationsInsights = [
  {
    id: "INS-401",
    title: "خطر تجاوز SLA",
    detail: "طلبان يحتاجان تدخلاً خلال أقل من 20 دقيقة.",
    severity: "critical",
  },
  {
    id: "INS-402",
    title: "فرصة تحسين السعة",
    detail: "يمكن نقل طلب العين إلى فريق متنقل متاح لتقليل وقت الانتظار.",
    severity: "opportunity",
  },
  {
    id: "INS-403",
    title: "فرصة إيراد",
    detail: "ثلاثة عملاء مؤهلون لباقات صيانة أو حماية متكررة.",
    severity: "growth",
  },
] as const;

export const serviceStatusLabels: Record<ServiceRequestStatus, string> = {
  new: "جديد",
  assigned: "تم التعيين",
  "in-progress": "قيد التنفيذ",
  "waiting-customer": "بانتظار العميل",
  completed: "مكتمل",
  escalated: "مصعّد",
};

export const servicePriorityLabels: Record<ServiceRequestPriority, string> = {
  low: "منخفضة",
  normal: "عادية",
  high: "عالية",
  critical: "حرجة",
};
