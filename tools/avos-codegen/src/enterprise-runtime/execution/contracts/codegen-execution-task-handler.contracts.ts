import {
  CodeGenExecutionTaskContext,
  CodeGenExecutionTaskResult,
  CodeGenExecutionTaskType,
} from "./codegen-execution-task.contracts";

export interface CodeGenExecutionTaskHandler {
  readonly type: CodeGenExecutionTaskType;

  execute(
    context: CodeGenExecutionTaskContext,
  ):
    Promise<CodeGenExecutionTaskResult>;
}
