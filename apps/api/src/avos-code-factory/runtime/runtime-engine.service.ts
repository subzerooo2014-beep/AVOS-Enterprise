import { Injectable } from "@nestjs/common";
import {
  FactoryExecutionPlan,
  FactoryExecutionResult,
} from "../contracts/factory.contracts";
import { ExecutionContextService } from "./execution-context.service";
import { ExecutionHistoryService } from "./execution-history.service";
import { StageRunnerService } from "./stage-runner.service";

@Injectable()
export class RuntimeEngineService {
  constructor(
    private readonly contexts: ExecutionContextService,
    private readonly history: ExecutionHistoryService,
    private readonly stageRunner: StageRunnerService,
  ) {}

  async execute(
    plan: FactoryExecutionPlan,
    input: Record<string, unknown> = {},
  ): Promise<FactoryExecutionResult> {
    const context = this.contexts.create(plan.id, plan.objective, input);
    const startedAtMs = Date.now();

    const result: FactoryExecutionResult = {
      executionId: context.executionId,
      planId: plan.id,
      status: "running",
      startedAt: new Date(startedAtMs).toISOString(),
      stageResults: [],
      errors: [],
    };

    this.history.add(result);

    let stageInput = { ...input };

    for (const stage of [...plan.stages].sort((a, b) => a.order - b.order)) {
      if (!stage.enabled) {
        continue;
      }

      const stageResult = await this.stageRunner.run(
        context.executionId,
        stage,
        stageInput,
      );

      result.stageResults.push(stageResult);

      if (stageResult.status === "failed") {
        result.status = "failed";

        if (stageResult.error) {
          result.errors.push(stageResult.error);
        }

        break;
      }

      stageInput = {
        ...stageInput,
        ...(stageResult.output ?? {}),
      };
    }

    if (result.status !== "failed") {
      result.status = "completed";
      result.output = stageInput;
    }

    const completedAtMs = Date.now();

    result.completedAt = new Date(completedAtMs).toISOString();
    result.durationMs = completedAtMs - startedAtMs;

    this.history.update(result.executionId, result);

    return result;
  }
}
