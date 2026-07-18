import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  GenesisBlueprint,
  GenesisGenerationPlan,
  GenesisPlanStep,
} from "../types/genesis-platform.types";
import { BlueprintDependencyResolverService } from "../blueprint/blueprint-dependency-resolver.service";

@Injectable()
export class GenerationPlannerService {
  constructor(
    private readonly dependencyResolver: BlueprintDependencyResolverService,
  ) {}

  createPlan(blueprint: GenesisBlueprint): GenesisGenerationPlan {
    const dependencyResult = this.dependencyResolver.resolve(blueprint);
    const artifactById = new Map(
      blueprint.artifacts.map((artifact) => [artifact.id, artifact]),
    );

    const steps: GenesisPlanStep[] =
      dependencyResult.orderedArtifactIds.map((artifactId, index) => {
        const artifact = artifactById.get(artifactId);
        return {
          id: `step:${artifactId}`,
          sequence: index + 1,
          name: `Generate ${artifact?.type ?? "artifact"} ${artifactId}`,
          action: "generate-artifact",
          artifactIds: [artifactId],
          dependsOn: artifact?.dependencies.map((id) => `step:${id}`) ?? [],
          reversible: true,
        };
      });

    const riskScore = Math.min(
      100,
      blueprint.artifacts.length * 2 +
        dependencyResult.unresolvedDependencies.length * 25 +
        (dependencyResult.cycleDetected ? 50 : 0),
    );

    return {
      id: `genesis-plan:${randomUUID()}`,
      blueprintId: blueprint.id,
      createdAt: new Date().toISOString(),
      steps,
      requiredCapabilities: blueprint.requestedCapabilities,
      approvalState: "awaiting-human-approval",
      riskScore,
      explanation: [
        `Plan created from blueprint ${blueprint.id}.`,
        `${steps.length} reversible generation steps prepared.`,
        "Execution is blocked until an explicit human approval is recorded.",
      ],
    };
  }
}
