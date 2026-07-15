import { FoundationDomain, LifecycleStage } from "./foundation-mega-bundle.types";

export const FOUNDATION_DOMAINS: FoundationDomain[] = [
  "VISION",
  "BRAND",
  "DESIGN_SYSTEM",
  "CONSTITUTION",
  "STRATEGY",
  "PLATFORM",
  "ARCHITECTURE",
  "PRODUCT",
  "PRODUCTION",
];

export const PRODUCT_LIFECYCLE_ORDER: LifecycleStage[] = [
  "DISCOVERY",
  "FOUNDATION",
  "ARCHITECTURE",
  "BUILD",
  "VALIDATION",
  "RELEASE",
  "OPERATIONS",
  "EVOLUTION",
];

export const AVOS_QUALITY_GATES = [
  "typescript",
  "build",
  "flutterAnalyze",
  "smokeTests",
  "integrationTests",
  "verification",
  "gitWorkingTreeClean",
] as const;

export const AVOS_FOUNDATION_STANDARDS = [
  "Vision before product scope",
  "Brand inheritance is mandatory",
  "Design system reuse is mandatory",
  "Constitutional compliance is mandatory",
  "Strategic alignment is mandatory",
  "Platform reuse before duplication",
  "Reference architecture conformance",
  "Architecture decisions must be recorded",
  "Production gates must pass before release",
  "Every product must support continuous evolution",
] as const;