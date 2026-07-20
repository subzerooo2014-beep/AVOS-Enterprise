export const publicNavigation = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'عن AVOS' },
  { href: '/platforms', label: 'المنصات' },
  { href: '/technology', label: 'التقنية' },
  { href: '/trust', label: 'الثقة والامتثال' },
  { href: '/contact', label: 'تواصل معنا' },
] as const;

export const controlNavigation = [
  { href: '/control-center', label: 'نظرة عامة' },
  { href: '/control-center/capabilities', label: 'القدرات' },
  { href: '/control-center/runtime', label: 'Runtime' },
  { href: '/control-center/service-mesh', label: 'Service Mesh' },
  { href: '/control-center/certification', label: 'الشهادات' },
] as const;

export const portalNavigation = [
  { href: '/portal', label: 'لوحة المستخدم' },
  { href: '/portal/profile', label: 'الملف الشخصي' },
  { href: '/portal/security', label: 'الأمان' },
  { href: '/portal/notifications', label: 'الإشعارات' },
] as const;