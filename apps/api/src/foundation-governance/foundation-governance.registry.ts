import {
  FoundationPolicy,
  FoundationStage,
} from "./foundation-governance.types";

export const FOUNDATION_STAGE_ORDER: FoundationStage[] = [
  "VISION",
  "BRAND_IDENTITY",
  "BRAND_DNA",
  "DESIGN_SYSTEM",
  "CONSTITUTIONAL_FOUNDATION",
  "STRATEGIC_FOUNDATION",
  "PLATFORM_FOUNDATION",
  "PRODUCT_ARCHITECTURE",
  "PRODUCT_DEVELOPMENT",
];

export const FOUNDATION_POLICIES: FoundationPolicy[] = [
  {
    code: "FOUNDATION-001",
    title: "Mandatory stage order",
    description:
      "Every AVOS product must follow the official foundation stage order without skipping stages.",
    severity: "CRITICAL",
    mandatory: true,
  },
  {
    code: "FOUNDATION-002",
    title: "Official brand inheritance",
    description:
      "Every AVOS product must inherit AVOS Enterprise brand identity and brand DNA.",
    severity: "CRITICAL",
    mandatory: true,
  },
  {
    code: "FOUNDATION-003",
    title: "Design system conformance",
    description:
      "All web and mobile interfaces must use official AVOS design tokens and shared components.",
    severity: "CRITICAL",
    mandatory: true,
  },
  {
    code: "FOUNDATION-004",
    title: "Constitutional compliance",
    description:
      "Architecture, policy, authority, security, and governance rules must conform to the AVOS constitution.",
    severity: "CRITICAL",
    mandatory: true,
  },
  {
    code: "FOUNDATION-005",
    title: "Strategic alignment",
    description:
      "Each product must declare how it supports AVOS strategic objectives and ecosystem direction.",
    severity: "WARNING",
    mandatory: true,
  },
  {
    code: "FOUNDATION-006",
    title: "Platform reuse first",
    description:
      "Products must reuse platform capabilities, registries, engines, APIs, and shared services before creating duplicates.",
    severity: "CRITICAL",
    mandatory: true,
  },
  {
    code: "FOUNDATION-007",
    title: "Architecture evidence",
    description:
      "Each completed stage requires verifiable evidence before the next stage can begin.",
    severity: "CRITICAL",
    mandatory: true,
  },
  {
    code: "FOUNDATION-008",
    title: "Production readiness",
    description:
      "Product development cannot be considered complete without all mandatory quality gates.",
    severity: "CRITICAL",
    mandatory: true,
  },
];

export const FOUNDATION_QUALITY_GATES = [
  "TypeScript",
  "Build",
  "Flutter Analyze",
  "Smoke Tests",
  "Integration Tests",
  "Verification",
  "Git Working Tree Clean",
] as const;