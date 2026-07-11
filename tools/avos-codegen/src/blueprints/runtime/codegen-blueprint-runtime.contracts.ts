import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenRenderedTemplate,
} from "../../templates/codegen-template.contracts";

export enum CodeGenBlueprintRuntimeStatus {
  CREATED = "created",
  VALIDATING = "validating",
  READY = "ready",
  RENDERING = "rendering",
  PLANNING = "planning",
  EXECUTING = "executing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface CodeGenBlueprintRuntimeRequest {
  blueprintKey: string;
  workspaceRoot: string;
  targetRoot: string;
  variables: Record<string, CodeGenJsonValue>;
  dryRun: boolean;
  strict: boolean;
  metadata?: CodeGenMetadata;
}

export interface CodeGenBlueprintTemplateExecution {
  templateKey: string;
  order: number;
  variables: Record<string, CodeGenJsonValue>;
  rendered?: CodeGenRenderedTemplate;
  artifact?: CodeGenArtifactDescriptor;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CodeGenBlueprintRuntimeExecution {
  executionId: string;
  blueprintKey: string;
  status: CodeGenBlueprintRuntimeStatus;
  request: CodeGenBlueprintRuntimeRequest;
  templates: CodeGenBlueprintTemplateExecution[];
  artifacts: CodeGenArtifactDescriptor[];
  warnings: string[];
  errors: string[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CodeGenBlueprintRuntimeResult {
  success: boolean;
  execution: CodeGenBlueprintRuntimeExecution;
  artifacts: CodeGenArtifactDescriptor[];
  renderedTemplates: CodeGenRenderedTemplate[];
  warnings: string[];
  errors: string[];
}
