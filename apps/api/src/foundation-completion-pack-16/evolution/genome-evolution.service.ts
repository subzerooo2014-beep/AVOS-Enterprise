import { Injectable } from "@nestjs/common";
import {
  EnterpriseDigitalGenome,
  GenomeEvolutionRecord,
  GenomeLayer
} from "../foundation-pack-16.types";
import { EnterpriseDigitalGenomeRegistryService } from "../genome/enterprise-digital-genome-registry.service";
import { GenomeSnapshotService } from "../snapshots/genome-snapshot.service";
import { GenomeAuditService } from "../observability/genome-audit.service";

@Injectable()
export class GenomeEvolutionService {
  private readonly records =
    new Map<string, GenomeEvolutionRecord>();

  constructor(
    private readonly registry: EnterpriseDigitalGenomeRegistryService,
    private readonly snapshots: GenomeSnapshotService,
    private readonly audit: GenomeAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  evolve(input: {
    genomeId: string;
    toVersion: string;
    changeSummary: string;
    affectedLayers: GenomeLayer[];
    compatibility:
      | "compatible"
      | "conditionally-compatible"
      | "breaking";
    approvedByIdentityId?: string;
    evolvedByIdentityId: string;
    correlationId: string;
    patch: {
      description?: string;
      status?: EnterpriseDigitalGenome["status"];
      layers?: EnterpriseDigitalGenome["layers"];
      crossLayerRelations?: EnterpriseDigitalGenome["crossLayerRelations"];
      metadata?: Record<string, unknown>;
    };
  }) {
    const current = this.registry.get(input.genomeId);

    if (
      input.compatibility === "breaking" &&
      !input.approvedByIdentityId
    ) {
      throw new Error(
        "Breaking genome evolution requires explicit human approval."
      );
    }

    this.snapshots.create({
      genomeId: current.id,
      createdByIdentityId:
        input.evolvedByIdentityId,
      reason: `Before evolution: ${input.changeSummary}`,
      correlationId: input.correlationId
    });

    const updated = this.registry.update(
      current.id,
      {
        ...input.patch,
        version: input.toVersion,
        status:
          input.patch.status ?? "active"
      },
      {
        actorIdentityId: input.evolvedByIdentityId,
        correlationId: input.correlationId
      }
    );

    const record: GenomeEvolutionRecord = {
      id: `genome-evolution:${Date.now()}:${
        this.records.size + 1
      }`,
      genomeId: current.id,
      fromVersion: current.version,
      toVersion: input.toVersion,
      changeSummary: input.changeSummary,
      affectedLayers: Array.from(
        new Set(input.affectedLayers)
      ),
      compatibility: input.compatibility,
      approvedByIdentityId:
        input.approvedByIdentityId,
      evolvedByIdentityId:
        input.evolvedByIdentityId,
      evolvedAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.snapshots.create({
      genomeId: updated.id,
      createdByIdentityId:
        input.evolvedByIdentityId,
      reason: `After evolution: ${input.changeSummary}`,
      correlationId: input.correlationId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "evolution",
      action: "enterprise-genome-evolved",
      subjectId: record.id,
      actorIdentityId: input.evolvedByIdentityId,
      outcome:
        input.compatibility === "breaking"
          ? "warning"
          : "success",
      metadata: {
        genomeId: current.id,
        fromVersion: current.version,
        toVersion: input.toVersion,
        compatibility: input.compatibility
      }
    });

    return {
      evolution: record,
      genome: updated
    };
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      compatible: records.filter(
        (record) =>
          record.compatibility === "compatible"
      ).length,
      conditional: records.filter(
        (record) =>
          record.compatibility ===
          "conditionally-compatible"
      ).length,
      breaking: records.filter(
        (record) =>
          record.compatibility === "breaking"
      ).length
    };
  }
}
