import {
  SystemGenerationArtifact,
  SystemGenerationPlan,
  SystemGenerationRequest,
} from "./contracts";
import {
  SystemGenerationArtifactFactory,
} from "./artifact-factory";

export class SystemGenerationGenerator {
  constructor(
    readonly artifacts:
      SystemGenerationArtifactFactory,
  ) {}

  generate(
    request:
      SystemGenerationRequest,
    plan:
      SystemGenerationPlan,
  ): SystemGenerationArtifact[] {
    const componentOrder =
      plan.steps
        .filter(
          (step) =>
            step.componentKey,
        )
        .map(
          (step) =>
            step.componentKey!,
        );

    const byKey =
      new Map(
        request.components.map(
          (component) => [
            component.key,
            component,
          ],
        ),
      );

    return componentOrder.map(
      (componentKey) => {
        const component =
          byKey.get(
            componentKey,
          );

        if (!component) {
          throw new Error(
            `Generation plan references unknown component: ${componentKey}`,
          );
        }

        return this.artifacts.create(
          component,
          request.variables,
        );
      },
    );
  }
}
