import {
  CodeGenArtifactGraph,
} from "../../artifacts/graph/codegen-artifact-graph";
import {
  CodeGenArtifactDependencyResolver,
} from "../../artifacts/resolution/codegen-artifact-dependency-resolver";
import {
  CodeGenArtifactDescriptor,
  CodeGenResolvedArtifactPlan,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";

export class CodeGenGenerationPlanner {
  constructor(
    readonly resolver =
      new CodeGenArtifactDependencyResolver(),
  ) {}

  createPlan(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
  ): CodeGenResolvedArtifactPlan {
    const graph =
      new CodeGenArtifactGraph();

    graph.addMany(artifacts);

    const plan =
      this.resolver.resolve(graph);

    if (!plan.valid) {
      const missing =
        plan.unresolvedDependencies
          .map(
            (item) =>
              `${item.artifactKey}->${item.dependencyKey}`,
          )
          .join(", ");

      const cycles =
        plan.circularDependencies
          .map(
            (cycle) =>
              cycle.join(" -> "),
          )
          .join("; ");

      throw new CodeGenValidationError(
        [
          "Artifact plan is invalid.",
          missing
            ? `Missing: ${missing}.`
            : "",
          cycles
            ? `Cycles: ${cycles}.`
            : "",
        ]
          .filter(Boolean)
          .join(" "),
      );
    }

    return plan;
  }
}
