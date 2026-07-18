export type TemplateStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "archived";

export type TemplateFormat =
  | "typescript"
  | "javascript"
  | "json"
  | "markdown"
  | "text"
  | "configuration";

export interface TemplateVariableDefinition {
  name: string;
  required?: boolean;
  defaultValue?: unknown;
  description?: string;
  sensitive?: boolean;
}

export interface AvosTemplate {
  id: string;
  name: string;
  version: string;
  format: TemplateFormat;
  status: TemplateStatus;
  content: string;
  variables?: TemplateVariableDefinition[];
  partials?: string[];
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
    description?: string;
    tags?: string[];
    humanFinalAuthority?: boolean;
  };
}

export interface TemplateValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: "error" | "warning";
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: TemplateValidationIssue[];
  warnings: TemplateValidationIssue[];
}

export interface TemplateRenderRequest {
  templateId: string;
  version?: string;
  variables?: Record<string, unknown>;
  strict?: boolean;
  requestedBy: string;
  approvedBy?: string;
  humanApproved?: boolean;
  correlationId?: string;
}

export interface TemplateRenderResult {
  success: boolean;
  renderId: string;
  templateId: string;
  templateVersion: string;
  content: string;
  format: TemplateFormat;
  resolvedVariables: Record<string, unknown>;
  unresolvedVariables: string[];
  warnings: string[];
  renderedAt: string;
  durationMs: number;
}

export interface TemplateHistoryRecord {
  id: string;
  action:
    | "registered"
    | "validated"
    | "rendered"
    | "composed"
    | "deprecated"
    | "archived";
  templateId: string;
  templateVersion: string;
  success: boolean;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface TemplateMetricsSnapshot {
  registeredTemplates: number;
  totalVersions: number;
  validationRuns: number;
  successfulValidations: number;
  failedValidations: number;
  renderRuns: number;
  successfulRenders: number;
  failedRenders: number;
  composedTemplates: number;
  unresolvedVariables: number;
  historyRecords: number;
  averageRenderDurationMs: number;
  calculatedAt: string;
}

export interface TemplateCompositionRequest {
  id: string;
  name: string;
  version: string;
  format: TemplateFormat;
  content: string;
  partialTemplateIds: string[];
  variables?: TemplateVariableDefinition[];
  createdBy: string;
}
