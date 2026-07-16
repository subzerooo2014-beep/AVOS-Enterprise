import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  MetadataLineageEdge,
  MetadataRelationType
} from "../foundation-pack-14.types";
import { UnifiedMetadataCatalogService } from "../catalog/unified-metadata-catalog.service";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class MetadataLineageService {
  private readonly edges =
    new Map<string, MetadataLineageEdge>();

  constructor(
    private readonly catalog: UnifiedMetadataCatalogService,
    private readonly audit: MetadataAuditService
  ) {}

  list() {
    return Array.from(this.edges.values());
  }

  link(input: {
    fromMetadataId: string;
    toMetadataId: string;
    relation: MetadataRelationType;
    reason: string;
    actorIdentityId: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }) {
    if (input.fromMetadataId === input.toMetadataId) {
      throw new BadRequestException(
        "Metadata lineage cannot self-reference."
      );
    }

    this.catalog.get(input.fromMetadataId);
    this.catalog.get(input.toMetadataId);

    const duplicate = this.list().find(
      (edge) =>
        edge.fromMetadataId === input.fromMetadataId &&
        edge.toMetadataId === input.toMetadataId &&
        edge.relation === input.relation
    );

    if (duplicate) {
      return duplicate;
    }

    const edge: MetadataLineageEdge = {
      id: `metadata-lineage:${Date.now()}:${
        this.edges.size + 1
      }`,
      fromMetadataId: input.fromMetadataId,
      toMetadataId: input.toMetadataId,
      relation: input.relation,
      reason: input.reason,
      actorIdentityId: input.actorIdentityId,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.edges.set(edge.id, edge);

    this.audit.record({
      correlationId: input.correlationId,
      category: "lineage",
      action: "metadata-lineage-linked",
      subjectId: edge.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        relation: edge.relation,
        fromMetadataId: edge.fromMetadataId,
        toMetadataId: edge.toMetadataId
      }
    });

    return edge;
  }

  lineage(metadataId: string) {
    this.catalog.get(metadataId);

    const visited = new Set<string>();
    const queue = [metadataId];
    const records = [];
    const edges: MetadataLineageEdge[] = [];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current || visited.has(current)) {
        continue;
      }

      visited.add(current);
      records.push(this.catalog.get(current));

      const related = this.list().filter(
        (edge) =>
          edge.fromMetadataId === current ||
          edge.toMetadataId === current
      );

      for (const edge of related) {
        if (!edges.some((item) => item.id === edge.id)) {
          edges.push(edge);
        }

        const next =
          edge.fromMetadataId === current
            ? edge.toMetadataId
            : edge.fromMetadataId;

        if (!visited.has(next)) {
          queue.push(next);
        }
      }
    }

    return {
      rootMetadataId: metadataId,
      records,
      edges
    };
  }

  hasLineage(metadataId: string) {
    return this.list().some(
      (edge) =>
        edge.fromMetadataId === metadataId ||
        edge.toMetadataId === metadataId
    );
  }

  summary() {
    return {
      total: this.edges.size,
      derivedFrom: this.list().filter(
        (edge) => edge.relation === "derived-from"
      ).length,
      ownership: this.list().filter(
        (edge) => edge.relation === "owned-by"
      ).length,
      governance: this.list().filter(
        (edge) => edge.relation === "governed-by"
      ).length
    };
  }
}
