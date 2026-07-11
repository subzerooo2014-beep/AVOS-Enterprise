import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenPlanner,
} from "../contracts/codegen-planner.contracts";

export class CodeGenPlanningRegistry {
  private readonly planners =
    new Map<
      string,
      CodeGenPlanner
    >();

  register(
    planner: CodeGenPlanner,
    replace = false,
  ): CodeGenPlanner {
    const key =
      planner.descriptor.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Planner key is required",
      );
    }

    if (
      this.planners.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Planner already exists: ${key}`,
      );
    }

    this.planners.set(
      key,
      planner,
    );

    return planner;
  }

  get(
    key: string,
  ): CodeGenPlanner {
    const planner =
      this.planners.get(key);

    if (!planner) {
      throw new CodeGenValidationError(
        `Planner was not found: ${key}`,
      );
    }

    return planner;
  }

  list():
    readonly CodeGenPlanner[] {
    return Array.from(
      this.planners.values(),
    )
      .filter(
        (planner) =>
          planner.descriptor.enabled,
      )
      .sort(
        (left, right) =>
          left.descriptor.priority -
          right.descriptor.priority,
      );
  }

  remove(
    key: string,
  ): CodeGenPlanner {
    const planner =
      this.get(key);

    this.planners.delete(key);

    return planner;
  }

  clear(): void {
    this.planners.clear();
  }
}
