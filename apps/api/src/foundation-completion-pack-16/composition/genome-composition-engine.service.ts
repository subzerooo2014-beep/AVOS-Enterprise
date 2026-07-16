import { Injectable } from "@nestjs/common";
import {
  EnterpriseDigitalGenome,
  GenomeLayer,
  GenomeLayerComposition
} from "../foundation-pack-16.types";
import { EnterpriseDigitalGenomeRegistryService } from "../genome/enterprise-digital-genome-registry.service";
import { GenomeAuditService } from "../observability/genome-audit.service";

@Injectable()
export class GenomeCompositionEngineService {
  constructor(
    private readonly registry: EnterpriseDigitalGenomeRegistryService,
    private readonly audit: GenomeAuditService
  ) {}

  compose(input: {
    genomeId: string;
    references: Array<
      GenomeLayerComposition["dnaReferences"][number]
    >;
    layerMapping: Record<string, GenomeLayer>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const genome = this.registry.get(input.genomeId);
    const layers = genome.layers.map((layer) => ({
      ...layer,
      dnaReferences: [...layer.dnaReferences]
    }));

    for (const reference of input.references) {
      const targetLayer =
        input.layerMapping[reference.assetType] ??
        reference.layer;

      const layer = layers.find(
        (item) => item.layer === targetLayer
      );

      if (!layer) {
        continue;
      }

      const exists = layer.dnaReferences.some(
        (item) => item.dnaId === reference.dnaId
      );

      if (!exists) {
        layer.dnaReferences.push({
          ...reference,
          layer: targetLayer
        });
      }
    }

    for (const layer of layers) {
      layer.completenessScore =
        this.completeness(layer.dnaReferences);
      layer.healthScore =
        this.health(layer.dnaReferences);
    }

    const updated = this.registry.update(
      genome.id,
      {
        layers,
        status: "active"
      },
      {
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      }
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "composition",
      action: "enterprise-genome-composed",
      subjectId: updated.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        references: input.references.length,
        activeLayers: updated.layers.filter(
          (layer) => layer.dnaReferences.length > 0
        ).length
      }
    });

    return updated;
  }

  calculateBalance(genomeId: string) {
    const genome = this.registry.get(genomeId);
    const active = genome.layers.filter(
      (layer) => layer.dnaReferences.length > 0
    );

    if (active.length === 0) {
      return {
        score: 0,
        balanced: false,
        distribution: {}
      };
    }

    const counts = active.map(
      (layer) => layer.dnaReferences.length
    );

    const average =
      counts.reduce((sum, count) => sum + count, 0) /
      counts.length;

    const deviation =
      counts.reduce(
        (sum, count) =>
          sum + Math.abs(count - average),
        0
      ) / counts.length;

    const score = Math.max(
      0,
      Math.min(
        100,
        Number(
          (
            100 -
            (
              deviation /
              Math.max(1, average)
            ) *
              100
          ).toFixed(2)
        )
      )
    );

    return {
      score,
      balanced: score >= 70,
      distribution: Object.fromEntries(
        genome.layers.map((layer) => [
          layer.layer,
          layer.dnaReferences.length
        ])
      )
    };
  }

  private completeness(
    references: GenomeLayerComposition["dnaReferences"]
  ) {
    if (references.length === 0) {
      return 0;
    }

    return Number(
      (
        references.filter(
          (reference) =>
            reference.identityId.trim().length > 0 &&
            reference.ownerIdentityId.trim().length > 0 &&
            reference.version.trim().length > 0 &&
            reference.checksum.trim().length > 0
        ).length /
        references.length *
        100
      ).toFixed(2)
    );
  }

  private health(
    references: GenomeLayerComposition["dnaReferences"]
  ) {
    if (references.length === 0) {
      return 0;
    }

    return Number(
      (
        references.filter(
          (reference) =>
            reference.status === "active"
        ).length /
        references.length *
        100
      ).toFixed(2)
    );
  }
}
