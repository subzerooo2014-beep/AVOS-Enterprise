import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export enum CodeGenValidationSeverity {
  INFORMATIONAL = "informational",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum CodeGenValidationCategory {
  BLUEPRINT = "blueprint",
  TEMPLATE = "template",
  VARIABLES = "variables",
  DEPENDENCY = "dependency",
  COMPATIBILITY = "compatibility",
  POLICY = "policy",
  SECURITY = "security",
  COMPLIANCE = "compliance",
  HEALTH = "health",
}

export interface CodeGenValidationIssue {
  code: string;
  category: CodeGenValidationCategory;
  severity: CodeGenValidationSeverity;
  message: string;
  path?: string;
  artifactKey?: string;
  details?: Record<string, CodeGenJsonValue>;
}

export interface CodeGenValidationContext {
  workspaceRoot: string;
  targetRoot: string;
  blueprintKey?: string;
  templateKeys: string[];
  variables: Record<string, CodeGenJsonValue>;
  artifacts: CodeGenArtifactDescriptor[];
  featureFlags: Record<string, boolean>;
  metadata: CodeGenMetadata;
}

export interface CodeGenValidationRuleDescriptor {
  key: string;
  name: string;
  description: string;
  category: CodeGenValidationCategory;
  severity: CodeGenValidationSeverity;
  enabled: boolean;
  priority: number;
  capabilities: readonly string[];
}

export interface CodeGenValidationRuleResult {
  ruleKey: string;
  valid: boolean;
  issues: CodeGenValidationIssue[];
  checkedAt: string;
}

export interface CodeGenValidationRule {
  readonly descriptor: CodeGenValidationRuleDescriptor;

  validate(
    context: CodeGenValidationContext,
  ):
    Promise<CodeGenValidationRuleResult> |
    CodeGenValidationRuleResult;
}

export interface CodeGenValidationReport {
  success: boolean;
  rules: number;
  passed: number;
  failed: number;
  issues: CodeGenValidationIssue[];
  errors: number;
  warnings: number;
  critical: number;
  score: number;
  metadata: CodeGenMetadata;
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface CodeGenCompatibilityRequest {
  sourceVersion: string;
  targetVersion: string;
  requiredCapabilities: string[];
  availableCapabilities: string[];
}

export interface CodeGenCompatibilityResult {
  compatible: boolean;
  missingCapabilities: string[];
  versionCompatible: boolean;
  warnings: string[];
  checkedAt: string;
}
