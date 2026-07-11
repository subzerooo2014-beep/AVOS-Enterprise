import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export enum CodeGenQualitySeverity {
  INFORMATIONAL = "informational",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum CodeGenQualityRuleCategory {
  STRUCTURE = "structure",
  NAMING = "naming",
  IMPORTS = "imports",
  NESTJS = "nestjs",
  DTO = "dto",
  PRISMA = "prisma",
  TESTING = "testing",
  DOCUMENTATION = "documentation",
  SECURITY = "security",
  CUSTOM = "custom",
}

export interface CodeGenQualityIssue {
  code: string;
  category: CodeGenQualityRuleCategory;
  severity: CodeGenQualitySeverity;
  message: string;
  artifactKey?: string;
  relativePath?: string;
  line?: number;
  column?: number;
  details?: Record<string, CodeGenJsonValue>;
}

export interface CodeGenQualityRuleContext {
  artifact: CodeGenArtifactDescriptor;
  allArtifacts: readonly CodeGenArtifactDescriptor[];
  metadata: CodeGenMetadata;
}

export interface CodeGenQualityRuleResult {
  ruleKey: string;
  valid: boolean;
  issues: CodeGenQualityIssue[];
  checkedAt: string;
}

export interface CodeGenQualityRuleDescriptor {
  key: string;
  name: string;
  description: string;
  category: CodeGenQualityRuleCategory;
  severity: CodeGenQualitySeverity;
  enabled: boolean;
  priority: number;
  capabilities: readonly string[];
}

export interface CodeGenQualityRule {
  readonly descriptor: CodeGenQualityRuleDescriptor;

  validate(
    context: CodeGenQualityRuleContext,
  ): Promise<CodeGenQualityRuleResult> | CodeGenQualityRuleResult;
}

export interface CodeGenQualityReport {
  success: boolean;
  artifacts: number;
  rules: number;
  passedRules: number;
  failedRules: number;
  issues: CodeGenQualityIssue[];
  errors: number;
  warnings: number;
  informational: number;
  score: number;
  metadata: CodeGenMetadata;
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

