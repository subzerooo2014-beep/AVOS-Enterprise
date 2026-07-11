import {
  CodeGenExecutionPlan,
} from "../contracts/codegen-planning.contracts";

export class CodeGenExecutionPlanSerializer {
  serialize(
    plan:
      CodeGenExecutionPlan,
    pretty = true,
  ): string {
    return JSON.stringify(
      plan,
      null,
      pretty
        ? 2
        : undefined,
    );
  }

  deserialize(
    value: string,
  ): CodeGenExecutionPlan {
    return JSON.parse(
      value,
    ) as CodeGenExecutionPlan;
  }
}
