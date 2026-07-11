import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenBlueprintRuntimeExecution,
  CodeGenBlueprintRuntimeRequest,
  CodeGenBlueprintRuntimeStatus,
} from "./codegen-blueprint-runtime.contracts";

export class CodeGenBlueprintRuntimeStore {
  private readonly executions =
    new Map<
      string,
      CodeGenBlueprintRuntimeExecution
    >();

  create(
    request:
      CodeGenBlueprintRuntimeRequest,
  ): CodeGenBlueprintRuntimeExecution {
    const now =
      new Date().toISOString();

    const execution:
      CodeGenBlueprintRuntimeExecution = {
      executionId:
        randomUUID(),
      blueprintKey:
        request.blueprintKey,
      status:
        CodeGenBlueprintRuntimeStatus.CREATED,
      request:
        structuredClone(request),
      templates: [],
      artifacts: [],
      warnings: [],
      errors: [],
      createdAt: now,
      updatedAt: now,
    };

    this.executions.set(
      execution.executionId,
      execution,
    );

    return structuredClone(
      execution,
    );
  }

  get(
    executionId: string,
  ): CodeGenBlueprintRuntimeExecution {
    const execution =
      this.executions.get(
        executionId,
      );

    if (!execution) {
      throw new CodeGenValidationError(
        `Blueprint runtime execution was not found: ${executionId}`,
      );
    }

    return structuredClone(
      execution,
    );
  }

  find(
    executionId: string,
  ):
    CodeGenBlueprintRuntimeExecution |
    undefined {
    const execution =
      this.executions.get(
        executionId,
      );

    return execution
      ? structuredClone(
          execution,
        )
      : undefined;
  }

  mutate(
    executionId: string,
    mutation: (
      execution:
        CodeGenBlueprintRuntimeExecution,
    ) => void,
  ): CodeGenBlueprintRuntimeExecution {
    const execution =
      this.executions.get(
        executionId,
      );

    if (!execution) {
      throw new CodeGenValidationError(
        `Blueprint runtime execution was not found: ${executionId}`,
      );
    }

    mutation(execution);

    execution.updatedAt =
      new Date().toISOString();

    return structuredClone(
      execution,
    );
  }

  setStatus(
    executionId: string,
    status:
      CodeGenBlueprintRuntimeStatus,
  ): CodeGenBlueprintRuntimeExecution {
    return this.mutate(
      executionId,
      (execution) => {
        execution.status =
          status;

        if (
          status ===
          CodeGenBlueprintRuntimeStatus.EXECUTING &&
          !execution.startedAt
        ) {
          execution.startedAt =
            new Date().toISOString();
        }

        if (
          [
            CodeGenBlueprintRuntimeStatus.COMPLETED,
            CodeGenBlueprintRuntimeStatus.FAILED,
          ].includes(status)
        ) {
          execution.completedAt =
            new Date().toISOString();
        }
      },
    );
  }

  addWarning(
    executionId: string,
    warning: string,
  ): CodeGenBlueprintRuntimeExecution {
    return this.mutate(
      executionId,
      (execution) => {
        execution.warnings.push(
          warning,
        );
      },
    );
  }

  addError(
    executionId: string,
    error: string,
  ): CodeGenBlueprintRuntimeExecution {
    return this.mutate(
      executionId,
      (execution) => {
        execution.errors.push(
          error,
        );
      },
    );
  }

  list():
    CodeGenBlueprintRuntimeExecution[] {
    return Array.from(
      this.executions.values(),
    )
      .map((execution) =>
        structuredClone(
          execution,
        ),
      )
      .sort((left, right) =>
        left.createdAt.localeCompare(
          right.createdAt,
        ),
      );
  }

  remove(
    executionId: string,
  ): CodeGenBlueprintRuntimeExecution {
    const execution =
      this.get(executionId);

    this.executions.delete(
      executionId,
    );

    return execution;
  }

  clear(): void {
    this.executions.clear();
  }
}
