import { Injectable } from "@nestjs/common";
import {
  EnterpriseDigitalGenome,
  GenomeComparisonResult
} from "../foundation-pack-16.types";
import { GenomeSnapshotService } from "../snapshots/genome-snapshot.service";
import { GenomeAuditService } from "../observability/genome-audit.service";

@Injectable()
export class GenomeComparisonService {
  constructor(
    private readonly snapshots: GenomeSnapshotService,
    private readonly audit: GenomeAuditService
  ) {}

  compare(input: {
    genomeId: string;
    fromVersion: string;
    toVersion: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const from = this.snapshots.getVersion(
      input.genomeId,
      input.fromVersion
    ).snapshot;

    const to = this.snapshots.getVersion(
      input.genomeId,
      input.toVersion
    ).snapshot;

    const fromDna = this.dnaMap(from);
    const toDna = this.dnaMap(to);

    const addedDnaIds = Array.from(toDna.keys()).filter(
      (id) => !fromDna.has(id)
    );

    const removedDnaIds = Array.from(fromDna.keys()).filter(
      (id) => !toDna.has(id)
    );

    const changedDnaIds = Array.from(toDna.keys()).filter(
      (id) =>
        fromDna.has(id) &&
        JSON.stringify(fromDna.get(id)) !==
          JSON.stringify(toDna.get(id))
    );

    const fromRelations = new Set(
      from.crossLayerRelations.map((relation) =>
        this.relationKey(relation)
      )
    );

    const toRelations = new Set(
      to.crossLayerRelations.map((relation) =>
        this.relationKey(relation)
      )
    );

    const addedRelations = Array.from(
      toRelations
    ).filter((key) => !fromRelations.has(key));

    const removedRelations = Array.from(
      fromRelations
    ).filter((key) => !toRelations.has(key));

    const breakingChanges: string[] = [];

    for (const id of removedDnaIds) {
      breakingChanges.push(
        `Digital DNA removed from genome: ${id}.`
      );
    }

    for (const relation of removedRelations) {
      breakingChanges.push(
        `Cross-layer relation removed: ${relation}.`
      );
    }

    const result: GenomeComparisonResult = {
      id: `genome-comparison:${Date.now()}`,
      genomeId: input.genomeId,
      fromVersion: input.fromVersion,
      toVersion: input.toVersion,
      addedDnaIds,
      removedDnaIds,
      changedDnaIds,
      addedRelations,
      removedRelations,
      breakingChanges,
      comparedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "comparison",
      action: "genome-versions-compared",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        breakingChanges.length > 0
          ? "warning"
          : "success",
      metadata: {
        addedDnaIds,
        removedDnaIds,
        changedDnaIds,
        breakingChanges
      }
    });

    return result;
  }

  private dnaMap(genome: EnterpriseDigitalGenome) {
    return new Map(
      genome.layers.flatMap((layer) =>
        layer.dnaReferences.map((reference) => [
          reference.dnaId,
          reference
        ] as const)
      )
    );
  }

  private relationKey(
    relation: EnterpriseDigitalGenome["crossLayerRelations"][number]
  ) {
    return [
      relation.fromDnaId,
      relation.relation,
      relation.toDnaId,
      relation.criticality
    ].join("|");
  }
}
