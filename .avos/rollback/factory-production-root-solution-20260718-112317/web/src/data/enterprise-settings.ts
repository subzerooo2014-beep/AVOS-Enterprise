export type SettingItem = {
  id: string;
  title: string;
  description: string;
  category: "organization" | "security" | "notifications" | "appearance" | "ai";
  enabled: boolean;
  value: string;
};

export const enterpriseSettings: SettingItem[] = [
  { id: "SET-01", title: "الوضع المؤسسي الموحد", description: "تطبيق إعدادات موحدة على جميع الوحدات.", category: "organization", enabled: true, value: "مفعّل" },
  { id: "SET-02", title: "المصادقة متعددة العوامل", description: "فرض MFA على المستخدمين الحساسين.", category: "security", enabled: true, value: "إلزامي" },
  { id: "SET-03", title: "ملخص الإشعارات الذكي", description: "تجميع التنبيهات منخفضة الأولوية.", category: "notifications", enabled: true, value: "كل 30 دقيقة" },
  { id: "SET-04", title: "الوضع الداكن التلقائي", description: "تغيير المظهر حسب وقت النظام.", category: "appearance", enabled: false, value: "يدوي" },
  { id: "SET-05", title: "اقتراحات AVOS التلقائية", description: "عرض توصيات تنفيذية داخل الواجهات.", category: "ai", enabled: true, value: "نشطة" },
  { id: "SET-06", title: "تسجيل الأنشطة الحساسة", description: "حفظ جميع تغييرات السياسات والإعدادات.", category: "security", enabled: true, value: "دائم" },
];

export const settingCategoryLabels = {
  organization: "المؤسسة",
  security: "الأمان",
  notifications: "الإشعارات",
  appearance: "المظهر",
  ai: "الذكاء الاصطناعي",
} as const;
