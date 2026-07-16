import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  EnterpriseDigitalGenome,
  GenomeSnapshot
} from "../foundation-pack-16.types";
import { EnterpriseDigitalGenomeRegistryService } from "../genome/enterprise-digital-genome-registry.service";
import { GenomeAuditService } from "../observability/genome-audit.service";

@Injectable()
export class GenomeSnapshotService {
  private readonly snapshots =
    new Map<string, GenomeSnapshot>();

  constructor(
    private readonly registry: EnterpriseDigitalGenomeRegistryService,
    private readonly audit: GenomeAuditService
  ) {}

  list() {
    return Array.from(this.snapshots.values());
  }

  get(id: string) {
    const snapshot = this.snapshots.get(id);

    if (!snapshot) {
      throw new NotFoundException(
        `Genome snapshot not found: ${id}`
      );
    }

    return snapshot;
  }

  byGenome(genomeId: string) {
    return this.list()
      .filter(
        (snapshot) => snapshot.genomeId === genomeId
      )
      .sort((left, right) =>
        left.createdAt.localeCompare(right.createdAt)
      );
  }

  create(input: {
    genomeId: string;
    createdByIdentityId: string;
    reason: string;
    correlationId: string;
  }) {
    const genome = this.registry.get(input.genomeId);

    const snapshot =
      JSON.parse(
        JSON.stringify(genome)
      ) as EnterpriseDigitalGenome;

    const record: GenomeSnapshot = {
      id: `genome-snapshot:${Date.now()}:${
        this.snapshots.size + 1
      }`,
      genomeId: genome.id,
      version: genome.version,
      snapshot,
      createdByIdentityId:
        input.createdByIdentityId,
      reason: input.reason,
      createdAt: new Date().toISOString()
    };

    this.snapshots.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "snapshot",
      action: "genome-snapshot-created",
      subjectId: record.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        genomeId: genome.id,
        version: genome.version
      }
    });

    return record;
  }

  getVersion(
    genomeId: string,
    version: string
  ) {
    const snapshot = this.byGenome(genomeId).find(
      (item) => item.version === version
    );

    if (!snapshot) {
      throw new NotFoundException(
        `Genome ${genomeId} version ${version} not found.`
      );
    }

    return snapshot;
  }

  summary() {
    return {
      total: this.snapshots.size,
      genomesSnapshotted: new Set(
        this.list().map(
          (snapshot) => snapshot.genomeId
        )
      ).size
    };
  }
}
