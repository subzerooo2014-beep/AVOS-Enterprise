export type BlueprintStatus =
  | "draft"
  | "validated"
  | "approved"
  | "planned"
  | "executing"
  | "completed"
  | "failed"
  | "archived";

export type BlueprintStepType =
  | "generator"
  | "template"
  | "file"
  | "command"
  | "approval"
  | "verification";

export interface BlueprintMetadata {
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  description?: string;
  humanFinalAuthority?: boolean;
  correlationId?: string;
  source?: string;
}

export interface BlueprintVariable {
  name: string;
  value: unknown;
  required?: boolean;
  description?: string;
}

export interface BlueprintStep {
  id: string;
  name: string;
  type: BlueprintStepType;
  pluginId?: string;
  target?: string;
  templateId?: string;
  outputPath?: string;
  input?: Record<string, unknown>;
  dependsOn?: string[];
  enabled?: boolean;
  requiresApproval?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AvosBlueprint {
  id: string;
  name: string;
  version: string;
  status: BlueprintStatus;
  metadata: BlueprintMetadata;
  variables?: BlueprintVariable[];
  steps: BlueprintStep[];
}

export interface BlueprintValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: "error" | "warning";
}

export interface BlueprintValidationResult {
  valid: boolean;
  errors: BlueprintValidationIssue[];
  warnings: BlueprintValidationIssue[];
}

export interface ParsedBlueprint {
  blueprint: AvosBlueprint;
  sourceType: "object" | "json";
  parsedAt: string;
}

export interface BlueprintPlanStep {
  order: number;
  stepId: string;
  name: string;
  type: BlueprintStepType;
  pluginId?: string;
  target?: string;
  templateId?: string;
  outputPath?: string;
  input: Record<string, unknown>;
  dependsOn: string[];
  requiresApproval: boolean;
  executable: boolean;
}

export interface BlueprintExecutionPlan {
  id: string;
  blueprintId: string;
  blueprintVersion: string;
  createdAt: string;
  requiresHumanApproval: boolean;
  approved: boolean;
  steps: BlueprintPlanStep[];
  warnings: string[];
}

export interface BlueprintHistoryRecord {
  id: string;
  action:
    | "registered"
    | "validated"
    | "parsed"
    | "planned"
    | "approved"
    | "rejected"
    | "archived";
  blueprintId: string;
  blueprintVersion: string;
  success: boolean;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface BlueprintMetricsSnapshot {
  registeredBlueprints: number;
  totalVersions: number;
  validationRuns: number;
  successfulValidations: number;
  failedValidations: number;
  plansCreated: number;
  plansRequiringApproval: number;
  approvedPlans: number;
  historyRecords: number;
  calculatedAt: string;
}

export interface BlueprintCreatePlanRequest {
  blueprint: AvosBlueprint | string;
  approvedBy?: string;
  approve?: boolean;
}

export interface BlueprintCreatePlanResult {
  success: boolean;
  blueprint: AvosBlueprint;
  validation: BlueprintValidationResult;
  plan: BlueprintExecutionPlan;
}
