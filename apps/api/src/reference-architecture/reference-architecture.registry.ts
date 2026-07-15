import {
  ArchitectureLayer,
  ArchitectureStandard,
} from "./reference-architecture.types";

export const AVOS_REFERENCE_LAYERS: ArchitectureLayer[] = [
  "EXPERIENCE",
  "APPLICATION",
  "DOMAIN",
  "PLATFORM",
  "DATA",
  "AI",
  "INTEGRATION",
  "SECURITY",
  "OPERATIONS",
];

export const AVOS_ARCHITECTURE_STANDARDS: ArchitectureStandard[] = [
  {
    code: "ARCH-001",
    title: "Modular architecture",
    layer: "APPLICATION",
    mandatory: true,
    description:
      "Every AVOS capability must be implemented as a bounded and registered module.",
  },
  {
    code: "ARCH-002",
    title: "API-first contracts",
    layer: "INTEGRATION",
    mandatory: true,
    description:
      "External and internal integrations must expose explicit API contracts.",
  },
  {
    code: "ARCH-003",
    title: "Event-driven integration",
    layer: "PLATFORM",
    mandatory: true,
    description:
      "Cross-domain communication should prefer registered platform events.",
  },
  {
    code: "ARCH-004",
    title: "Multi-tenant isolation",
    layer: "DATA",
    mandatory: true,
    description:
      "Tenant ownership and isolation must be explicit in all tenant-scoped domains.",
  },
  {
    code: "ARCH-005",
    title: "Security by default",
    layer: "SECURITY",
    mandatory: true,
    description:
      "Identity, authorization, auditability, and data protection are mandatory.",
  },
  {
    code: "ARCH-006",
    title: "Observability by default",
    layer: "OPERATIONS",
    mandatory: true,
    description:
      "Services must expose operational state, health, logs, metrics, and trace context.",
  },
  {
    code: "ARCH-007",
    title: "Platform reuse first",
    layer: "PLATFORM",
    mandatory: true,
    description:
      "Existing platform capabilities must be reused before creating new components.",
  },
  {
    code: "ARCH-008",
    title: "Design system inheritance",
    layer: "EXPERIENCE",
    mandatory: true,
    description:
      "Web and mobile experiences must inherit the official AVOS design system.",
  },
  {
    code: "ARCH-009",
    title: "AI governance",
    layer: "AI",
    mandatory: true,
    description:
      "AI models, agents, decisions, and recommendations must be explainable and governed.",
  },
  {
    code: "ARCH-010",
    title: "Domain ownership",
    layer: "DOMAIN",
    mandatory: true,
    description:
      "Each business capability must have an explicit owner and domain boundary.",
  },
  {
    code: "ARCH-011",
    title: "Versioned evolution",
    layer: "APPLICATION",
    mandatory: true,
    description:
      "Modules, APIs, events, and registries must support versioned evolution.",
  },
  {
    code: "ARCH-012",
    title: "Production readiness",
    layer: "OPERATIONS",
    mandatory: true,
    description:
      "Every component must pass the official AVOS production readiness gates.",
  },
];

export const AVOS_REGISTRY_RULES = [
  "Every capability must have a unique code",
  "Every module must declare an owner",
  "Every dependency must reference a registered entry",
  "Every API route must belong to a registered module",
  "Every event must have a registered producer",
  "Every industry pack must declare platform dependencies",
  "Every component must declare architecture layer",
  "Every active entry must include a semantic version",
] as const;