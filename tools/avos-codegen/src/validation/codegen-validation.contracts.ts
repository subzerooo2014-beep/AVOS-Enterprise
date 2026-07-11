import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../core/codegen.contracts";

export enum CodeGenValidationSeverity {
  INFORMATIONAL = "informational",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface CodeGenValidationIssue {
  code: string;
  message: string;
  severity: CodeGenValidationSeverity;
  path?: string;
  metadata: CodeGenMetadata;
}

export interface CodeGenValidationResult {
  validatorKey: string;
  valid: boolean;
  issues: CodeGenValidationIssue[];
  checkedAt: string;
}

export interface CodeGenValidationContext {
  targetType: string;
  targetKey: string;
  value: CodeGenJsonValue;
  metadata: CodeGenMetadata;
}

export interface CodeGenValidator {
  readonly key: string;
  readonly name: string;
  readonly priority: number;
  validate(
    context: CodeGenValidationContext,
  ): Promise<CodeGenValidationResult> |
    CodeGenValidationResult;
}

export interface CodeGenValidationPipelineResult {
  valid: boolean;
  results: CodeGenValidationResult[];
  issueCount: number;
  checkedAt: string;
}
