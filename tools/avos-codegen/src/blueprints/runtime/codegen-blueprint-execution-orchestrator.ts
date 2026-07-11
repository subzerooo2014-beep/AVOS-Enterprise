import {
  CodeGenGenerationCoordinator,
} from "../../generation/codegen-generation-coordinator";
import {
  CodeGenConflictPolicy,
} from "../../output/codegen-output.contracts";
import {
  CodeGenOutputCoordinator,
} from "../../output/codegen-output-coordinator";
import {
  CodeGenBlueprintRuntimeExecutor,
} from "./codegen-blueprint-runtime-executor";
import {
  CodeGenBlueprintRuntimeResultBuilder,
} from "./codegen-blueprint-runtime-result-builder";
import {
  CodeGenBlueprintRuntimeRequest,
  CodeGenBlueprintRuntimeStatus,
} from "./codegen-blueprint-runtime.contracts";

export class CodeGenBlueprintExecutionOrchestrator {
  constructor(
    readonly runtime =
      new CodeGenBlueprintRuntimeExecutor(),
    readonly generations =
      new CodeGenGenerationCoordinator(),
    readonly output =
      new CodeGenOutputCoordinator(),
    readonly results =
      new CodeGenBlueprintRuntimeResultBuilder(),
  ) {}

  async execute(
    request:
      CodeGenBlueprintRuntimeRequest & {
        conflictPolicy?:
          CodeGenConflictPolicy;
      },
  ) {
    const runtimeExecution =
      await this.runtime.execute(
        request,
      );

    if (
      runtimeExecution.status !==
      CodeGenBlueprintRuntimeStatus.COMPLETED
    ) {
      return {
        success: false,
        runtime:
          this.results.build(
            runtimeExecution,
          ),
        generation:
          undefined,
        output:
          undefined,
      };
    }

    const generation =
      await this.generations.execute({
        workspaceRoot:
          request.workspaceRoot,
        targetRoot:
          request.targetRoot,
        dryRun:
          request.dryRun,
        variables:
          request.variables,
        ...(request.metadata
          ? {
              metadata:
                request.metadata,
            }
          : {}),
        artifacts:
          runtimeExecution.artifacts,
      });

    const output =
      await this.output.execute({
        sessionId:
          generation.session.id,
        workspaceRoot:
          request.workspaceRoot,
        targetRoot:
          request.targetRoot,
        artifacts:
          runtimeExecution.artifacts,
        dryRun:
          request.dryRun,
        conflictPolicy:
          request.conflictPolicy ??
          CodeGenConflictPolicy.ERROR,
      });

    return {
      success:
        output.report.success,
      runtime:
        this.results.build(
          runtimeExecution,
        ),
      generation,
      output,
    };
  }
}

