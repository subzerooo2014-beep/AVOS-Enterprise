import {
  CodeGenJsonValue,
  CodeGenMetadata,
  CodeGenVersion,
} from "../core/codegen.contracts";

export enum CodeGenBlueprintStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  DISABLED = "disabled",
  ARCHIVED = "archived",
}

export interface CodeGenBlueprintTemplateBinding {
  templateKey: string;
  order: number;
  enabled: boolean;
  variables: Record<string, CodeGenJsonValue>;
}

export interface CodeGenBlueprintDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: CodeGenVersion;
  status: CodeGenBlueprintStatus;
  category: string;
  templateBindings: CodeGenBlueprintTemplateBinding[];
  dependencies: string[];
  capabilities: string[];
  tags: string[];
  metadata: CodeGenMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CodeGenBlueprintExecutionInput {
  blueprintKey: string;
  variables: Record<string, CodeGenJsonValue>;
  dryRun: boolean;
}

export interface CodeGenBlueprintExecutionPlan {
  blueprintKey: string;
  templates: CodeGenBlueprintTemplateBinding[];
  variables: Record<string, CodeGenJsonValue>;
  dryRun: boolean;
  createdAt: string;
}
