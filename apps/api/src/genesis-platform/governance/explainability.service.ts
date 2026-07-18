import { Injectable } from "@nestjs/common";
import {
  GenesisBlueprint,
  GenesisGenerationPlan,
} from "../types/genesis-platform.types";

@Injectable()
export class GenesisExplainabilityService {
  explain(
    blueprint: GenesisBlueprint,
    plan: GenesisGenerationPlan,
  ): Record<string, unknown> {
    return {
      blueprintId: blueprint.id,
      planId: plan.id,
      rationale: [
        "The blueprint defines the desired architecture and artifacts.",
        "Dependencies determine the generation order.",
        "Every generated artifact is registered and traceable.",
        "Execution requires an explicit human approval.",
      ],
      requestedCapabilities: blueprint.requestedCapabilities,
      artifactCount: blueprint.artifacts.length,
      riskScore: plan.riskScore,
      humanFinalAuthority: true,
    };
  }
}
