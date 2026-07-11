import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenPipelineExecutionResult,
  CodeGenPipelineStep,
  CodeGenPipelineStepContext,
} from "./codegen-pipeline.contracts";

export class CodeGenPipelineExecutor {
  async execute(
    steps: readonly CodeGenPipelineStep[],
    context: Omit<
      CodeGenPipelineStepContext,
      "executionId"
    >,
  ): Promise<CodeGenPipelineExecutionResult> {
    const executionId = randomUUID();
    const startedAt =
      new Date().toISOString();

    const ordered = [...steps]
      .filter((step) => step.enabled)
      .sort(
        (a, b) => a.order - b.order,
      );

    const results = [];

    for (const step of ordered) {
      const result =
        await step.execute({
          ...context,
          executionId,
        });

      results.push(result);

      if (
        result.status === "failed"
      ) {
        break;
      }
    }

    const completedAt =
      new Date().toISOString();

    return {
      executionId,
      success: results.every(
        (result) =>
          result.status === "succeeded" ||
          result.status === "skipped",
      ),
      steps: results,
      startedAt,
      completedAt,
    };
  }
}
