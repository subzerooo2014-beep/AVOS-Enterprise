import { Injectable } from "@nestjs/common";
import {
  GovernanceJsonValue,
  RuntimeRunbookStepDefinition,
} from "../contracts";

@Injectable()
export class RuntimeRunbookStepExecutor {
  async execute(input: {
    step:
      RuntimeRunbookStepDefinition;
    dryRun:
      boolean;
    runtimeContext:
      Record<
        string,
        GovernanceJsonValue
      >;
  }): Promise<{
    succeeded: boolean;
    output:
      Record<
        string,
        GovernanceJsonValue
      >;
    error?: string;
  }> {
    if (
      input.step.parameters
        .forceFailure === true
    ) {
      return {
        succeeded:
          false,
        output: {
          stepType:
            input.step.type,
          dryRun:
            input.dryRun,
        },
        error:
          "Forced runbook step failure",
      };
    }

    return {
      succeeded:
        true,
      output: {
        stepType:
          input.step.type,
        dryRun:
          input.dryRun,
        parameters:
          input.step.parameters,
        runtimeContext:
          input.runtimeContext,
        executedAt:
          new Date().toISOString(),
      },
    };
  }
}
