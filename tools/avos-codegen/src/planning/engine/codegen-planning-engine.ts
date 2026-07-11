import {
  CodeGenPlanningContext,
  CodeGenPlanningResult,
} from "../contracts/codegen-planning.contracts";
import {
  CodeGenPlanningRegistry,
} from "../registry/codegen-planning-registry";
import {
  CodeGenDefaultPlanner,
} from "./codegen-default-planner";

export class CodeGenPlanningEngine {
  constructor(
    readonly registry =
      new CodeGenPlanningRegistry(),
  ) {
    if (
      this.registry.list()
        .length === 0
    ) {
      this.registry.register(
        new CodeGenDefaultPlanner(),
      );
    }
  }

  async execute(
    plannerKey: string,
    context:
      CodeGenPlanningContext,
  ): Promise<
    CodeGenPlanningResult
  > {
    const planner =
      this.registry.get(
        plannerKey,
      );

    return planner.plan(
      context,
    );
  }

  async executeDefault(
    context:
      CodeGenPlanningContext,
  ): Promise<
    CodeGenPlanningResult
  > {
    return this.execute(
      "default-planner",
      context,
    );
  }
}
