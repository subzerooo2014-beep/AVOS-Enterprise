export type EnterpriseUser = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "invited" | "suspended";
  accessScore: number;
  lastActive: string;
  mfaEnabled: boolean;
  permissions: string[];
};

export const enterpriseUsers: EnterpriseUser[] = [
  {
    id: "USR-1501",
    name: "فاطمة النقبي",
    email: "fatima@avos.ae",
    department: "الجودة",
    role: "Quality Manager",
    status: "active",
    accessScore: 94,
    lastActive: "منذ 4 دقائق",
    mfaEnabled: true,
    permissions: ["quality.read", "quality.write", "recovery.approve"],
  },
  {
    id: "USR-1502",
    name: "عبدالله الكتبي",
    email: "abdullah@avos.ae",
    department: "العمليات",
    role: "Operations Lead",
    status: "active",
    accessScore: 97,
    lastActive: "منذ 7 دقائق",
    mfaEnabled: true,
    permissions: ["operations.read", "operations.write", "sla.escalate"],
  },
  {
    id: "USR-1503",
    name: "سارة المهيري",
    email: "sara@avos.ae",
    department: "الإيرادات",
    role: "Revenue Analyst",
    status: "invited",
    accessScore: 72,
    lastActive: "لم تسجل الدخول",
    mfaEnabled: false,
    permissions: ["revenue.read", "pricing.review"],
  },
  {
    id: "USR-1504",
    name: "حمد السويدي",
    email: "hamad@avos.ae",
    department: "المزودون",
    role: "Provider Manager",
    status: "active",
    accessScore: 91,
    lastActive: "منذ 12 دقيقة",
    mfaEnabled: true,
    permissions: ["providers.read", "providers.write", "providers.restrict"],
  },
  {
    id: "USR-1505",
    name: "مها الشامسي",
    email: "maha@avos.ae",
    department: "الأمان",
    role: "Security Auditor",
    status: "suspended",
    accessScore: 58,
    lastActive: "منذ يومين",
    mfaEnabled: true,
    permissions: ["audit.read", "security.review"],
  },
];

export const userStatusLabels = {
  active: "نشط",
  invited: "مدعو",
  suspended: "موقوف",
} as const;
