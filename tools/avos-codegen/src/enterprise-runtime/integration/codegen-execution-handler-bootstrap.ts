import {
  CodeGenDefaultExecutionTaskHandler,
} from "../execution/runtime/codegen-default-execution-task-handler";
import {
  CodeGenExecutionTaskHandlerRegistry,
} from "../execution/runtime/codegen-execution-task-handler-registry";
import {
  CodeGenExecutionTaskType,
} from "../execution/contracts/codegen-execution-task.contracts";

export function registerDefaultExecutionHandlers(
  registry:
    CodeGenExecutionTaskHandlerRegistry,
): CodeGenExecutionTaskHandlerRegistry {
  const types = [
    CodeGenExecutionTaskType.GENERATE,
    CodeGenExecutionTaskType.VALIDATE,
    CodeGenExecutionTaskType.WRITE,
    CodeGenExecutionTaskType.TRANSFORM,
    CodeGenExecutionTaskType.CUSTOM,
  ];

  for (const type of types) {
    registry.register(
      new CodeGenDefaultExecutionTaskHandler(
        type,
      ),
      true,
    );
  }

  return registry;
}
