import {
  CodeGenExecutionSchedule,
} from "../scheduling/codegen-scheduling.contracts";

export class CodeGenExecutionScheduleSerializer {
  serialize(
    schedule:
      CodeGenExecutionSchedule,
    pretty = true,
  ): string {
    return JSON.stringify(
      schedule,
      null,
      pretty
        ? 2
        : undefined,
    );
  }

  deserialize(
    value: string,
  ): CodeGenExecutionSchedule {
    return JSON.parse(
      value,
    ) as CodeGenExecutionSchedule;
  }
}
