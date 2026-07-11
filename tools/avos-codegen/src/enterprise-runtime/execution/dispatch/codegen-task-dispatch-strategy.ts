import {
  CodeGenExecutionTask,
} from "../contracts/codegen-execution-task.contracts";

export interface CodeGenTaskDispatchStrategy {
  sort(
    tasks:
      readonly CodeGenExecutionTask[],
  ): CodeGenExecutionTask[];
}

export class CodeGenPriorityWeightDispatchStrategy
  implements CodeGenTaskDispatchStrategy {
  sort(
    tasks:
      readonly CodeGenExecutionTask[],
  ): CodeGenExecutionTask[] {
    return [...tasks]
      .sort(
        (left, right) =>
          right.priority -
            left.priority ||
          right.weight -
            left.weight ||
          left.createdAt.localeCompare(
            right.createdAt,
          ),
      );
  }
}
