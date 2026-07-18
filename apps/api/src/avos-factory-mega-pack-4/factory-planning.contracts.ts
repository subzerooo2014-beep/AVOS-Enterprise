export type FactoryPlanStatus =
  | "draft"
  | "validated"
  | "approved"
  | "executing"
  | "completed"
  | "cancelled";

export type FactoryPlanStageStatus =
  | "pending"
  | "ready"
  | "blocked"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type FactoryPlanPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface PlanningArchitectureNode {
  id: string;
  type: string;
  name: string;
  dependsOn?: string[];
  metadata?: Record<string, unknown>;
}

export interface PlanningArchitectureInput {
  architectureId: string;
  architectureName: string;
  architectureVersion?: string;
  nodes: PlanningArchitectureNode[];
  constraints?: {
    maxParallelStages?: number;
    requireHumanApproval?: boolean;
    reuseExistingCapabilities?: boolean;
    preferredRuntime?: string;
  };
}

export interface FactoryPlanStage {
  id: string;
  name: string;
  kind:
    | "foundation"
    | "capability-resolution"
    | "architecture"
    | "data"
    | "backend"
    | "frontend"
    | "mobile"
    | "ai"
    | "integration"
    | "security"
    | "testing"
    | "certification"
    | "packaging"
    | "deployment";
  priority: FactoryPlanPriority;
  status: FactoryPlanStageStatus;
  dependsOn: string[];
  architectureNodeIds: string[];
  reusableAssetIds: string[];
  estimatedEffortPoints: number;
  riskScore: number;
  canRunInParallel: boolean;
  requiresHumanApproval: boolean;
  metadata: Record<string, unknown>;
}

export interface FactoryPlanningRisk {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  stageId?: string;
}

export interface FactoryPlanningMetrics {
  totalStages: number;
  parallelizableStages: number;
  blockedStages: number;
  criticalStages: number;
  totalEstimatedEffortPoints: number;
  reuseScore: number;
  dependencyHealthScore: number;
  planningQualityScore: number;
}

export interface FactoryManufacturingPlan {
  id: string;
  architectureId: string;
  architectureName: string;
  architectureVersion: string;
  status: FactoryPlanStatus;
  stages: FactoryPlanStage[];
  executionWaves: string[][];
  risks: FactoryPlanningRisk[];
  metrics: FactoryPlanningMetrics;
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  createdAt: string;
  validatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface FactoryPlanningEngineStatus {
  system: "AVOS Factory";
  megaPack: 4;
  component: "Factory Planning Engine";
  status: "healthy";
  registeredPlans: number;
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  supportedFunctions: string[];
}
