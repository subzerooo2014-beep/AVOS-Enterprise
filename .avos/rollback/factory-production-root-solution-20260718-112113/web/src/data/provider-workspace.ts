export type BranchStatus = "open" | "busy" | "closed";

export interface ProviderBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  status: BranchStatus;
  waitMinutes: number;
  capacity: number;
  bookedToday: number;
  openingHours: string;
}

export interface ProviderStaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  branchId: string;
  rating: number;
  completedJobs: number;
  utilization: number;
  available: boolean;
}

export interface ProviderBooking {
  id: string;
  customer: string;
  service: string;
  vehicle: string;
  branchId: string;
  staffId?: string;
  date: string;
  time: string;
  status: "confirmed" | "waiting" | "in-progress" | "completed" | "cancelled";
  value: number;
}

export const providerBranches: readonly ProviderBranch[] = [
  { id: "branch-dubai", name: "فرع دبي الرئيسي", city: "دبي", address: "القوز الصناعية 3", status: "open", waitMinutes: 18, capacity: 28, bookedToday: 21, openingHours: "08:00 - 22:00" },
  { id: "branch-abu-dhabi", name: "فرع أبوظبي", city: "أبوظبي", address: "مصفح الصناعية", status: "busy", waitMinutes: 42, capacity: 20, bookedToday: 19, openingHours: "08:00 - 21:00" },
  { id: "branch-sharjah", name: "فرع الشارقة", city: "الشارقة", address: "المنطقة الصناعية 4", status: "open", waitMinutes: 12, capacity: 16, bookedToday: 9, openingHours: "09:00 - 20:00" },
];

export const providerStaff: readonly ProviderStaffMember[] = [
  { id: "staff-001", name: "أحمد المنصوري", role: "مشرف فني", specialty: "فحص شامل", branchId: "branch-dubai", rating: 4.9, completedJobs: 1280, utilization: 84, available: true },
  { id: "staff-002", name: "سالم الكتبي", role: "فني أول", specialty: "ميكانيكا وكهرباء", branchId: "branch-dubai", rating: 4.8, completedJobs: 940, utilization: 91, available: false },
  { id: "staff-003", name: "يوسف الحمادي", role: "فني تشخيص", specialty: "أنظمة إلكترونية", branchId: "branch-abu-dhabi", rating: 4.7, completedJobs: 760, utilization: 88, available: true },
  { id: "staff-004", name: "ماجد السويدي", role: "فني عناية", specialty: "تلميع وحماية", branchId: "branch-sharjah", rating: 4.9, completedJobs: 610, utilization: 67, available: true },
];

export const providerBookings: readonly ProviderBooking[] = [
  { id: "PB-1024", customer: "خالد محمد", service: "فحص AVOS الشامل", vehicle: "Range Rover Sport 2025", branchId: "branch-dubai", staffId: "staff-001", date: "2026-07-13", time: "10:30", status: "confirmed", value: 499 },
  { id: "PB-1025", customer: "نورة علي", service: "صيانة دورية", vehicle: "Tesla Model Y 2024", branchId: "branch-dubai", date: "2026-07-13", time: "11:15", status: "waiting", value: 650 },
  { id: "PB-1026", customer: "راشد سعيد", service: "حماية سيراميك", vehicle: "BMW X5 2023", branchId: "branch-abu-dhabi", staffId: "staff-004", date: "2026-07-13", time: "13:00", status: "in-progress", value: 2400 },
  { id: "PB-1027", customer: "مريم حسن", service: "فحص كمبيوتر", vehicle: "Mercedes GLE 2022", branchId: "branch-sharjah", staffId: "staff-003", date: "2026-07-13", time: "15:30", status: "confirmed", value: 280 },
];

export const providerAiInsights = [
  { title: "ذروة متوقعة", value: "17:00 - 20:00", detail: "ارفع الطاقة الاستيعابية في فرع دبي بنسبة 18%." },
  { title: "فرصة تسعير", value: "+7%", detail: "خدمة الفحص الشامل أقل من متوسط السوق مع الحفاظ على تقييم 4.9." },
  { title: "احتياج فني", value: "2 فنيين", detail: "فرع أبوظبي يحتاج دعمًا إضافيًا خلال عطلة نهاية الأسبوع." },
  { title: "نمو الحجوزات", value: "+24%", detail: "الحجز الفوري والخدمات المتنقلة يقودان النمو هذا الأسبوع." },
] as const;
