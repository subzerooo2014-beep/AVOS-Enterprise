export const CAPABILITY_FABRIC_REVIEW_VERSION = "1.0.0";

export const CAPABILITY_FABRIC_REVIEW_PILLARS = [
  "LAYER_COMPLETENESS_REVIEW",
  "MODULE_BOUNDARY_REVIEW",
  "DEPENDENCY_DIRECTION_REVIEW",
  "CONTRACT_CONSISTENCY_REVIEW",
  "FOUNDATION_FIRST_VALIDATION",
  "DUPLICATION_ANALYSIS",
  "RUNTIME_ALIGNMENT_REVIEW",
  "ORCHESTRATION_ALIGNMENT_REVIEW",
  "INTELLIGENCE_ALIGNMENT_REVIEW",
  "ENTERPRISE_GOVERNANCE_REVIEW",
  "PUBLIC_API_REVIEW",
  "DOCUMENTATION_REVIEW",
  "CONSOLIDATION_DECISIONS",
  "READINESS_SCORING",
  "KNOWLEDGE_FABRIC_GATE",
] as const;

export const CAPABILITY_FABRIC_LAYER_DEFINITIONS = [
  {
    layer: "CF-1",
    module: "CapabilityFabricModule",
    path: "apps/api/src/capability-fabric",
    requiredExports: [
      "CapabilityRegistryService",
      "CapabilityFoundationValidatorService",
      "CapabilityDependencyGraphService",
    ],
  },
  {
    layer: "CF-2",
    module: "CapabilityRuntimeModule",
    path: "apps/api/src/capability-runtime",
    requiredExports: [
      "CapabilityRuntimeService",
      "CapabilityRuntimeResolverService",
      "CapabilityRuntimeObservabilityService",
    ],
  },
  {
    layer: "CF-3",
    module: "CapabilityOrchestrationModule",
    path: "apps/api/src/capability-orchestration",
    requiredExports: [
      "CapabilityOrchestrationService",
      "CapabilityOrchestrationRegistryService",
      "CapabilityDiscoveryService",
      "CapabilityRoutingService",
    ],
  },
  {
    layer: "CF-4",
    module: "CapabilityIntelligenceModule",
    path: "apps/api/src/capability-intelligence",
    requiredExports: [
      "CapabilityIntelligenceService",
      "CapabilityKnowledgeService",
      "CapabilityMemoryService",
      "CapabilityScoringService",
    ],
  },
  {
    layer: "CF-5",
    module: "CapabilityEnterpriseModule",
    path: "apps/api/src/capability-enterprise",
    requiredExports: [
      "CapabilityEnterpriseService",
      "CapabilityApprovalService",
      "CapabilityComplianceService",
      "CapabilityCertificationService",
    ],
  },
] as const;