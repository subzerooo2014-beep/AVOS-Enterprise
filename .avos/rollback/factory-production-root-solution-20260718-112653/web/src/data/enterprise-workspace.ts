export type WorkspaceModule = {
  id: string;
  name: string;
  description: string;
  route: string;
  category: string;
  favorite: boolean;
  recentRank: number;
};

export type WorkspaceNotification = {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "critical";
  unread: boolean;
};

export type WorkspaceActivity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
};

export const workspaceModules: WorkspaceModule[] = [
  { id: "WS-01", name: "مركز القيادة المؤسسي", description: "الرؤية الموحدة لجميع أنظمة AVOS.", route: "/enterprise-command-center", category: "القيادة", favorite: true, recentRank: 1 },
  { id: "WS-02", name: "عمليات الخدمات", description: "إدارة الطلبات والتنفيذ والتصعيد.", route: "/service-operations", category: "الخدمات", favorite: true, recentRank: 2 },
  { id: "WS-03", name: "جودة الخدمات", description: "رضا العملاء واسترداد التجربة.", route: "/service-quality", category: "الجودة", favorite: false, recentRank: 4 },
  { id: "WS-04", name: "أداء المزودين", description: "SLA والمخاطر والإيرادات.", route: "/service-provider-performance", category: "المزودون", favorite: true, recentRank: 3 },
  { id: "WS-05", name: "المركبات", description: "إدارة المركبات والفحص والنشر.", route: "/vehicles", category: "المركبات", favorite: false, recentRank: 5 },
  { id: "WS-06", name: "Enterprise Brain", description: "القرارات الذكية والتوصيات.", route: "/enterprise-brain", category: "الذكاء", favorite: true, recentRank: 6 },
];

export const workspaceNotifications: WorkspaceNotification[] = [
  { id: "NOT-01", title: "تجاوز محتمل في SLA", description: "ثلاث حالات تحتاج تدخلاً خلال 15 دقيقة.", type: "critical", unread: true },
  { id: "NOT-02", title: "اكتمل تحديث مزود", description: "تم اعتماد خطة التصحيح.", type: "success", unread: true },
  { id: "NOT-03", title: "فرصة رفع الإيرادات", description: "ارتفاع الطلب على خدمات الطوارئ.", type: "warning", unread: false },
  { id: "NOT-04", title: "تقرير الجودة جاهز", description: "تم نشر التقرير اليومي.", type: "info", unread: false },
];

export const workspaceActivities: WorkspaceActivity[] = [
  { id: "ACT-01", actor: "AVOS Brain", action: "اقترح إعادة توزيع السعة", target: "دبي والشارقة", createdAt: "منذ 5 دقائق" },
  { id: "ACT-02", actor: "فاطمة النقبي", action: "بدأت خطة استرداد", target: "QC-5101", createdAt: "منذ 18 دقيقة" },
  { id: "ACT-03", actor: "مركز العمليات", action: "صعّد حالة SLA", target: "SI-9001", createdAt: "منذ 27 دقيقة" },
  { id: "ACT-04", actor: "النظام", action: "أكمل مزامنة البيانات", target: "شبكة المزودين", createdAt: "منذ 42 دقيقة" },
];
