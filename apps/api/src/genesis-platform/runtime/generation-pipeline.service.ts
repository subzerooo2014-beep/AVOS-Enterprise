import { Injectable } from "@nestjs/common";
import {
  GenesisArtifactRecord,
  GenesisBlueprint,
  GenesisGenerationPlan,
} from "../types/genesis-platform.types";
import { ArtifactGeneratorService } from "./artifact-generator.service";
import { GenesisArtifactRegistry } from "../registry/genesis-artifact.registry";

@Injectable()
export class GenerationPipelineService {
  constructor(
    private readonly artifactGenerator: ArtifactGeneratorService,
    private readonly artifactRegistry: GenesisArtifactRegistry,
  ) {}

  execute(
    blueprint: GenesisBlueprint,
    plan: GenesisGenerationPlan,
  ): GenesisArtifactRecord[] {
    const definitions = new Map(
      blueprint.artifacts.map((artifact) => [artifact.id, artifact]),
    );
    const records: GenesisArtifactRecord[] = [];

    for (const step of [...plan.steps].sort((a, b) => a.sequence - b.sequence)) {
      for (const artifactId of step.artifactIds) {
        const definition = definitions.get(artifactId);
        if (!definition) continue;

        const record = this.artifactGenerator.generate(
          blueprint.id,
          definition,
        );
        this.artifactRegistry.register(record);
        records.push(record);
      }
    }

    return records;
  }
}
