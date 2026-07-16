import {
  CapabilityKind,
  CapabilityLifecycleStage,
  CapabilityOperationalStatus,
} from "./capability-fabric.types";

export const CAPABILITY_FABRIC_VERSION = "1.0.0";

export const CAPABILITY_FABRIC_PILLARS = [
  "CAPABILITY_DIGITAL_DNA",
  "CAPABILITY_IDENTITY",
  "CAPABILITY_MANIFEST",
  "CAPABILITY_METADATA",
  "CAPABILITY_CONTRACTS",
  "CAPABILITY_LIFECYCLE",
  "CAPABILITY_VERSIONING",
  "CAPABILITY_DEPENDENCIES",
  "CAPABILITY_POLICIES",
  "CAPABILITY_PERMISSIONS",
  "CAPABILITY_EVENTS",
  "CAPABILITY_METRICS",
  "CAPABILITY_HEALTH",
  "CAPABILITY_RUNTIME_DESCRIPTOR",
  "CAPABILITY_SECURITY_DESCRIPTOR",
  "CAPABILITY_VALIDATION",
  "CAPABILITY_REGISTRY",
  "CAPABILITY_DEPENDENCY_GRAPH",
] as const;

export const CAPABILITY_KIND_VALUES: CapabilityKind[] = [
  "MODULE",
  "SERVICE",
  "AI_AGENT",
  "WORKFLOW",
  "API",
  "PRODUCT",
  "RULE",
  "DASHBOARD",
  "AUTOMATION",
  "MODEL",
  "INTEGRATION",
  "PLUGIN",
  "DATA_ASSET",
  "PLATFORM_SERVICE",
];

export const CAPABILITY_LIFECYCLE_ORDER: CapabilityLifecycleStage[] = [
  "CONCEPT",
  "PROTOTYPE",
  "SHARED_CAPABILITY",
  "CORE_ENGINE",
  "PLATFORM_SERVICE",
  "STANDALONE_PRODUCT",
  "LEGACY_ASSET",
];

export const CAPABILITY_ALLOWED_STATUS_TRANSITIONS: Record<
  CapabilityOperationalStatus,
  CapabilityOperationalStatus[]
> = {
  DRAFT: ["REGISTERED", "ARCHIVED"],
  REGISTERED: ["ACTIVE", "SUSPENDED", "ARCHIVED"],
  ACTIVE: ["DEGRADED", "SUSPENDED", "DEPRECATED"],
  DEGRADED: ["ACTIVE", "SUSPENDED", "DEPRECATED"],
  SUSPENDED: ["ACTIVE", "DEPRECATED", "ARCHIVED"],
  DEPRECATED: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: [],
};

export const CAPABILITY_FOUNDATION_POLICIES = [
  {
    code: "CF-FOUNDATION-001",
    title: "Unique capability identity",
    rule: "Every capability key must be globally unique.",
    severity: "BLOCKING",
  },
  {
    code: "CF-FOUNDATION-002",
    title: "Digital DNA completeness",
    rule: "Every capability must declare identity, purpose, ownership, lifecycle, runtime, security, and health.",
    severity: "BLOCKING",
  },
  {
    code: "CF-FOUNDATION-003",
    title: "Contract-first interaction",
    rule: "Cross-capability interactions must be represented through versioned contracts.",
    severity: "ERROR",
  },
  {
    code: "CF-FOUNDATION-004",
    title: "Explicit dependencies",
    rule: "Required dependencies must be declared with version ranges and reasons.",
    severity: "ERROR",
  },
  {
    code: "CF-FOUNDATION-005",
    title: "Foundation reuse before duplication",
    rule: "A new capability cannot duplicate an existing active capability without an explicit replacement relationship.",
    severity: "BLOCKING",
  },
  {
    code: "CF-FOUNDATION-006",
    title: "Governed lifecycle evolution",
    rule: "Lifecycle transitions must be recorded with reason and approving authority.",
    severity: "ERROR",
  },
  {
    code: "CF-FOUNDATION-007",
    title: "Observable by design",
    rule: "Production capabilities must define health checks and operational metrics.",
    severity: "ERROR",
  },
  {
    code: "CF-FOUNDATION-008",
    title: "Secure by design",
    rule: "Every capability must declare classification, trust boundary, authentication, and authorization requirements.",
    severity: "BLOCKING",
  },
] as const;