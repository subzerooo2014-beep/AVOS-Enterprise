import {
  AutonomousArtifactKind,
  AutonomousGenerationPlan,
  AutonomousGenerationPlanStep,
  AutonomousGenerationRequest,
} from "./contracts";

export class AutonomousCodeGenerationPlanner {
  plan(
    request: AutonomousGenerationRequest,
  ): AutonomousGenerationPlan {
    const steps: AutonomousGenerationPlanStep[] = [
      {
        key: "analyze-requirements",
        order: 10,
        description:
          "Analyze generation requirements and dependency constraints.",
        dependencies: [],
        artifactKinds: [],
      },
      {
        key: "generate-models",
        order: 20,
        description:
          "Generate persistence models and domain contracts.",
        dependencies: [
          "analyze-requirements",
        ],
        artifactKinds: [
          AutonomousArtifactKind.MODEL,
          AutonomousArtifactKind.DTO,
        ],
      },
      {
        key: "generate-runtime",
        order: 30,
        description:
          "Generate modules, services, and controllers.",
        dependencies: [
          "generate-models",
        ],
        artifactKinds: [
          AutonomousArtifactKind.MODULE,
          AutonomousArtifactKind.SERVICE,
          AutonomousArtifactKind.CONTROLLER,
        ],
      },
      {
        key: "generate-tests",
        order: 40,
        description:
          "Generate unit and integration test artifacts.",
        dependencies: [
          "generate-runtime",
        ],
        artifactKinds: [
          AutonomousArtifactKind.TEST,
        ],
      },
      {
        key: "generate-documentation",
        order: 50,
        description:
          "Generate architecture and usage documentation.",
        dependencies: [
          "generate-tests",
        ],
        artifactKinds: [
          AutonomousArtifactKind.DOCUMENTATION,
          AutonomousArtifactKind.CONFIGURATION,
        ],
      },
    ];

    return {
      requestId: request.id,
      steps,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
