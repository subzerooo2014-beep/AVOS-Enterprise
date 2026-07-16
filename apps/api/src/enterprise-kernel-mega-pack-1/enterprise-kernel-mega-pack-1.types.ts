export type KernelRuntimeStatus =
  | "created"
  | "bootstrapping"
  | "starting"
  | "running"
  | "degraded"
  | "stopping"
  | "stopped"
  | "failed";

export type KernelLifecycleStage =
  | "registered"
  | "installed"
  | "initialized"
  | "active"
  | "suspended"
  | "inactive"
  | "removed"
  | "failed";

export type KernelModuleCriticality =
  | "optional"
  | "standard"
  | "important"
  | "critical";

export type KernelLifecycleAction =
  | "install"
  | "initialize"
  | "activate"
  | "suspend"
  | "resume"
  | "deactivate"
  | "remove"
  | "fail"
  | "recover";

export interface KernelIdentity {
  id: string;
  name: string;
  version: string;
  instanceId: string;
  environment: string;
  organizationIdentityId: string;
  createdAt: string;
}

export interface KernelRuntimeContext {
  id: string;
  kernelIdentityId: string;
  environment: string;
  region: string;
  nodeName: string;
  processId: number;
  startedByIdentityId: string;
  correlationId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelRuntimeState {
  id: string;
  status: KernelRuntimeStatus;
  bootCount: number;
  startupStartedAt?: string;
  startedAt?: string;
  shutdownStartedAt?: string;
  stoppedAt?: string;
  lastFailure?: {
    code: string;
    message: string;
    occurredAt: string;
  };
  activeModuleIds: string[];
  suspendedModuleIds: string[];
  failedModuleIds: string[];
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface KernelModuleManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  providerModule: string;
  capabilityIds: string[];
  criticality: KernelModuleCriticality;
  dependencies: string[];
  optionalDependencies: string[];
  lifecycleHooks: KernelLifecycleAction[];
  autoActivate: boolean;
  removable: boolean;
  metadata: Record<string, unknown>;
}

export interface KernelModuleRecord {
  id: string;
  manifest: KernelModuleManifest;
  stage: KernelLifecycleStage;
  installedAt?: string;
  initializedAt?: string;
  activatedAt?: string;
  suspendedAt?: string;
  deactivatedAt?: string;
  removedAt?: string;
  lastTransitionAt: string;
  transitionCount: number;
  failureReason?: string;
  metadata: Record<string, unknown>;
}

export interface KernelLifecycleTransition {
  id: string;
  moduleId: string;
  action: KernelLifecycleAction;
  fromStage: KernelLifecycleStage;
  toStage: KernelLifecycleStage;
  actorIdentityId: string;
  correlationId: string;
  reason: string;
  successful: boolean;
  details: Record<string, unknown>;
  occurredAt: string;
}

export interface KernelPipelineStep {
  id: string;
  name: string;
  order: number;
  required: boolean;
  status:
    | "pending"
    | "running"
    | "completed"
    | "failed"
    | "skipped";
  startedAt?: string;
  completedAt?: string;
  failureReason?: string;
  details: Record<string, unknown>;
}

export interface KernelPipelineExecution {
  id: string;
  type: "startup" | "shutdown";
  status: "pending" | "running" | "completed" | "failed";
  actorIdentityId: string;
  correlationId: string;
  steps: KernelPipelineStep[];
  startedAt: string;
  completedAt?: string;
}

export interface KernelReadinessAssessment {
  id: string;
  ready: boolean;
  score: number;
  blockers: string[];
  warnings: string[];
  requiredModules: number;
  activeRequiredModules: number;
  runtimeStatus: KernelRuntimeStatus;
  assessedAt: string;
}

export interface KernelHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    runtimeScore: number;
    lifecycleScore: number;
    moduleCoverageScore: number;
    readinessScore: number;
    failureScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface KernelAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "identity"
    | "context"
    | "runtime"
    | "module"
    | "lifecycle"
    | "pipeline"
    | "readiness"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
