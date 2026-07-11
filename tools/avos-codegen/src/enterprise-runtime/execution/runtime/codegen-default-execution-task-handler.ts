import {
  CodeGenExecutionTaskHandler,
} from "../contracts/codegen-execution-task-handler.contracts";
import {
  CodeGenExecutionTaskContext,
  CodeGenExecutionTaskResult,
  CodeGenExecutionTaskType,
} from "../contracts/codegen-execution-task.contracts";

export class CodeGenDefaultExecutionTaskHandler
  implements CodeGenExecutionTaskHandler {
  constructor(
    readonly type:
      CodeGenExecutionTaskType,
  ) {}

  async execute(
    context:
      CodeGenExecutionTaskContext,
  ): Promise<
    CodeGenExecutionTaskResult
  > {
    const startedAt =
      new Date().toISOString();

    const output =
      context.task.artifact
        ? {
            artifactKey:
              context.task.artifact.key,
            relativePath:
              context.task.artifact.relativePath,
            contentLength:
              context.task.artifact.content.length,
          }
        : {
            taskKey:
              context.task.key,
          };

    const completedAt =
      new Date().toISOString();

    return {
      taskId:
        context.task.id,
      taskKey:
        context.task.key,
      workerId:
        context.workerId,
      success: true,
      skipped: false,
      output,
      startedAt,
      completedAt,
      durationMs:
        Date.parse(
          completedAt,
        ) -
        Date.parse(
          startedAt,
        ),
      metadata: {
        handlerType:
          this.type,
      },
    };
  }
}
