export type ReleaseRecord = {
  id: string;
  version: string;
  title: string;
  environment: "development" | "staging" | "production";
  status: "planned" | "deploying" | "healthy" | "failed" | "rolled_back";
  owner: string;
  createdAt: string;
  deployedAt: string;
  healthScore: number;
  changedFiles: number;
  testsPassed: number;
  testsTotal: number;
  risk: "low" | "medium" | "high";
  rollbackReady: boolean;
  summary: string;
};

export const releaseRecords: ReleaseRecord[] = [
  {
    id: "REL-2201",
    version: "3.22.0",
    title: "Release & Deployment Center",
    environment: "production",
    status: "healthy",
    owner: "Web Platform Team",
    createdAt: "اليوم 08:30",
    deployedAt: "اليوم 09:12",
    healthScore: 100,
    changedFiles: 8,
    testsPassed: 12,
    testsTotal: 12,
    risk: "low",
    rollbackReady: true,
    summary: "إطلاق مركز إدارة الإصدارات والنشر.",
  },
  {
    id: "REL-2202",
    version: "3.21.0",
    title: "Recovery & Resilience Center",
    environment: "production",
    status: "healthy",
    owner: "Reliability Team",
    createdAt: "أمس",
    deployedAt: "أمس 16:40",
    healthScore: 99,
    changedFiles: 8,
    testsPassed: 10,
    testsTotal: 10,
    risk: "low",
    rollbackReady: true,
    summary: "إضافة سيناريوهات التعافي وRTO/RPO.",
  },
  {
    id: "REL-2203",
    version: "3.20.0",
    title: "Incident Response Center",
    environment: "staging",
    status: "deploying",
    owner: "Operations Platform",
    createdAt: "أمس",
    deployedAt: "قيد النشر",
    healthScore: 86,
    changedFiles: 8,
    testsPassed: 9,
    testsTotal: 10,
    risk: "medium",
    rollbackReady: true,
    summary: "تحسين إدارة الحوادث وغرف الاستجابة.",
  },
  {
    id: "REL-2204",
    version: "3.19.0",
    title: "Priority Focus Center",
    environment: "production",
    status: "healthy",
    owner: "Executive Experience",
    createdAt: "منذ يومين",
    deployedAt: "منذ يومين",
    healthScore: 98,
    changedFiles: 8,
    testsPassed: 11,
    testsTotal: 11,
    risk: "low",
    rollbackReady: true,
    summary: "إضافة مركز الأولويات والتركيز التنفيذي.",
  },
  {
    id: "REL-2205",
    version: "3.18.0",
    title: "AI Command Center",
    environment: "production",
    status: "healthy",
    owner: "Enterprise AI",
    createdAt: "منذ 3 أيام",
    deployedAt: "منذ 3 أيام",
    healthScore: 97,
    changedFiles: 8,
    testsPassed: 14,
    testsTotal: 14,
    risk: "medium",
    rollbackReady: true,
    summary: "إطلاق مركز القيادة التنفيذي الذكي.",
  },
];

export const environmentLabels = {
  development: "التطوير",
  staging: "الاختبار",
  production: "الإنتاج",
} as const;

export const releaseStatusLabels = {
  planned: "مخطط",
  deploying: "قيد النشر",
  healthy: "سليم",
  failed: "فشل",
  rolled_back: "تم التراجع",
} as const;
