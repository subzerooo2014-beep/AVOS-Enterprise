import {
  CodeGenValidationError,
} from "../../../core/codegen.errors";
import {
  CodeGenExecutionTaskHandler,
} from "../contracts/codegen-execution-task-handler.contracts";
import {
  CodeGenExecutionTaskType,
} from "../contracts/codegen-execution-task.contracts";

export class CodeGenExecutionTaskHandlerRegistry {
  private readonly handlers =
    new Map<
      CodeGenExecutionTaskType,
      CodeGenExecutionTaskHandler
    >();

  register(
    handler:
      CodeGenExecutionTaskHandler,
    replace = false,
  ): CodeGenExecutionTaskHandler {
    if (
      this.handlers.has(
        handler.type,
      ) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Execution task handler already exists: ${handler.type}`,
      );
    }

    this.handlers.set(
      handler.type,
      handler,
    );

    return handler;
  }

  get(
    type:
      CodeGenExecutionTaskType,
  ): CodeGenExecutionTaskHandler {
    const handler =
      this.handlers.get(type);

    if (!handler) {
      throw new CodeGenValidationError(
        `Execution task handler was not found: ${type}`,
      );
    }

    return handler;
  }

  list():
    readonly CodeGenExecutionTaskHandler[] {
    return Array.from(
      this.handlers.values(),
    );
  }

  clear(): void {
    this.handlers.clear();
  }
}
