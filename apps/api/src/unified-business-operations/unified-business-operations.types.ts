export type WorkflowStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface WorkflowStep {
  key: string;
  name: string;
  module: string;
  action: string;
  requiresApproval: boolean;
  slaMinutes?: number;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  version: number;
  steps: WorkflowStep[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  tenantId: string;
  workflowId: string;
  referenceType: string;
  referenceId: string;
  currentStep: number;
  status: WorkflowStatus;
  context: Record<string, unknown>;
  timeline: Array<{
    stepKey: string;
    status: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  eventName: string;
  condition: Record<string, unknown>;
  action: string;
  targetModule: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessEvent {
  id: string;
  tenantId: string;
  name: string;
  sourceModule: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface IntegrationLink {
  id: string;
  tenantId: string;
  sourceModule: string;
  targetModule: string;
  eventName: string;
  action: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperationAlert {
  id: string;
  tenantId: string;
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  source: string;
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface AiOperationInsight {
  id: string;
  tenantId: string;
  category:
    | "WORKFLOW"
    | "BOTTLENECK"
    | "PREDICTION"
    | "OPTIMIZATION"
    | "EXECUTIVE";
  title: string;
  recommendation: string;
  confidence: number;
  humanReviewRequired: boolean;
  createdAt: string;
}