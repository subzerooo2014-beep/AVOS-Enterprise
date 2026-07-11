import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenBlueprintDefinition,
} from "../codegen-blueprint.contracts";
import {
  CodeGenBlueprintRuntimeExecution,
  CodeGenBlueprintRuntimeRequest,
} from "./codegen-blueprint-runtime.contracts";

export interface CodeGenBlueprintExecutionContext {
  executionId: string;
  blueprint: CodeGenBlueprintDefinition;
  request: CodeGenBlueprintRuntimeRequest;
  workspaceRoot: string;
  targetRoot: string;
  variables: Record<string, CodeGenJsonValue>;
  metadata: CodeGenMetadata;
  dryRun: boolean;
  strict: boolean;
  startedAt: string;
}

export class CodeGenBlueprintExecutionContextFactory {
  create(
    execution:
      CodeGenBlueprintRuntimeExecution,
    blueprint:
      CodeGenBlueprintDefinition,
  ): CodeGenBlueprintExecutionContext {
    return {
      executionId:
        execution.executionId,
      blueprint:
        structuredClone(
          blueprint,
        ),
      request:
        structuredClone(
          execution.request,
        ),
      workspaceRoot:
        execution.request
          .workspaceRoot,
      targetRoot:
        execution.request
          .targetRoot,
      variables:
        structuredClone(
          execution.request
            .variables,
        ),
      metadata:
        structuredClone(
          execution.request
            .metadata ?? {},
        ),
      dryRun:
        execution.request
          .dryRun,
      strict:
        execution.request
          .strict,
      startedAt:
        new Date().toISOString(),
    };
  }
}
