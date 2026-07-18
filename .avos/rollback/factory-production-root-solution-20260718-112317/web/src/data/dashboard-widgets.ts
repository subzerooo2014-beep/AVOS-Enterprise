export type DashboardWidget = {
  id: string;
  title: string;
  description: string;
  metric: string;
  value: string;
  trend: number;
  status: "healthy" | "watch" | "critical";
  category: "operations" | "revenue" | "quality" | "providers" | "ai";
  size: "small" | "medium" | "large";
  pinned: boolean;
};

export const dashboardWidgets: DashboardWidget[] = [
  { id: "DW-01", title: "الطلبات النشطة", description: "الطلبات قيد التنفيذ حالياً.", metric: "Active Orders", value: "184", trend: 12.4, status: "healthy", category: "operations", size: "small", pinned: true },
  { id: "DW-02", title: "إيراد اليوم", description: "الإيرادات المحققة اليوم.", metric: "Daily Revenue", value: "219K AED", trend: 8.7, status: "healthy", category: "revenue", size: "medium", pinned: true },
  { id: "DW-03", title: "التزام SLA", description: "متوسط التزام شبكة المزودين.", metric: "SLA Compliance", value: "89%", trend: -2.3, status: "watch", category: "providers", size: "small", pinned: true },
  { id: "DW-04", title: "مؤشر تجربة العملاء", description: "تجميع رضا العملاء والمشاعر.", metric: "Customer Experience", value: "84/100", trend: 4.1, status: "healthy", category: "quality", size: "medium", pinned: false },
  { id: "DW-05", title: "قرارات AVOS", description: "القرارات الذكية المنفذة اليوم.", metric: "AI Decisions", value: "1,284", trend: 18.6, status: "healthy", category: "ai", size: "large", pinned: true },
  { id: "DW-06", title: "التصعيدات المفتوحة", description: "حالات تحتاج تدخلاً إدارياً.", metric: "Open Escalations", value: "7", trend: -14.2, status: "critical", category: "operations", size: "small", pinned: false },
];

export const widgetCategoryLabels = {
  operations: "العمليات",
  revenue: "الإيرادات",
  quality: "الجودة",
  providers: "المزودون",
  ai: "الذكاء الاصطناعي",
} as const;
