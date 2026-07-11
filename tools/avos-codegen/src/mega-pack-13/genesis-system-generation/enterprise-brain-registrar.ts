import { randomUUID } from "node:crypto";
import {
  GenesisArchitectureValidation,
  GenesisBlueprintComposition,
  GenesisCapabilityGraph,
  GenesisJsonValue,
  GenesisKnowledgeRecord,
  GenesisSystemSpecification,
} from "./contracts";

export class GenesisEnterpriseBrainRegistrar {
  private readonly records:
    GenesisKnowledgeRecord[] = [];

  registerSystem(
    specification:
      GenesisSystemSpecification,
    composition:
      GenesisBlueprintComposition,
    graph:
      GenesisCapabilityGraph,
    validation:
      GenesisArchitectureValidation,
  ): GenesisKnowledgeRecord[] {
    const records = [
      this.record(
        specification.id,
        "genesis.system",
        `Generated system ${specification.name} (${specification.version}).`,
        {
          key: specification.key,
          objectives:
            specification.objectives,
          environments:
            specification.environments,
        },
      ),
      this.record(
        specification.id,
        "genesis.blueprints",
        `Resolved ${composition.selectedBlueprints.length} blueprint(s).`,
        {
          blueprints:
            composition.selectedBlueprints.map(
              (item) =>
                `${item.key}@${item.version}`,
            ),
          successful:
            composition.successful,
        },
      ),
      this.record(
        specification.id,
        "genesis.architecture",
        `Architecture validation score: ${validation.score}.`,
        {
          valid:
            validation.valid,
          score:
            validation.score,
          capabilities:
            graph.nodes.length,
          dependencyEdges:
            graph.edges.length,
          cycles:
            graph.cycles.length,
        },
      ),
    ];

    this.records.push(
      ...records,
    );

    return records.map((record) =>
      structuredClone(record),
    );
  }

  list(
    systemId?: string,
  ): GenesisKnowledgeRecord[] {
    return this.records
      .filter((record) =>
        systemId
          ? record.systemId === systemId
          : true,
      )
      .map((record) =>
        structuredClone(record),
      );
  }

  private record(
    systemId: string,
    topic: string,
    summary: string,
    facts:
      Record<string, GenesisJsonValue>,
  ): GenesisKnowledgeRecord {
    return {
      id: randomUUID(),
      systemId,
      topic,
      summary,
      facts:
        structuredClone(facts),
      createdAt:
        new Date().toISOString(),
    };
  }
}
