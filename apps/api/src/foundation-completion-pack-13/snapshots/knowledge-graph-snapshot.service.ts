import { createHash } from "crypto";
import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KnowledgeGraphSnapshot,
  KnowledgeNode,
  KnowledgeRelationship
} from "../foundation-pack-13.types";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "../relationships/knowledge-relationship-registry.service";
import { KnowledgeGraphVersionService } from "../versions/knowledge-graph-version.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeGraphSnapshotService {
  private readonly snapshots =
    new Map<string, KnowledgeGraphSnapshot>();

  constructor(
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly relationships: KnowledgeRelationshipRegistryService,
    private readonly versions: KnowledgeGraphVersionService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  list() {
    return Array.from(this.snapshots.values());
  }

  get(id: string) {
    const snapshot = this.snapshots.get(id);

    if (!snapshot) {
      throw new NotFoundException(
        `Knowledge graph snapshot not found: ${id}`
      );
    }

    return snapshot;
  }

  create(input: {
    name: string;
    createdByIdentityId: string;
    correlationId: string;
    changeSummary: string;
  }) {
    const version = this.versions.create({
      changeSummary: input.changeSummary,
      createdByIdentityId: input.createdByIdentityId,
      correlationId: input.correlationId
    });

    const nodes =
      JSON.parse(
        JSON.stringify(this.nodes.list())
      ) as KnowledgeNode[];

    const relationships =
      JSON.parse(
        JSON.stringify(this.relationships.list())
      ) as KnowledgeRelationship[];

    const checksum = createHash("sha256")
      .update(
        JSON.stringify({
          nodes,
          relationships,
          version: version.version
        })
      )
      .digest("hex");

    const snapshot: KnowledgeGraphSnapshot = {
      id: `knowledge-graph-snapshot:${Date.now()}:${
        this.snapshots.size + 1
      }`,
      name: input.name,
      version: version.version,
      nodes,
      relationships,
      checksum,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.snapshots.set(snapshot.id, snapshot);

    this.audit.record({
      correlationId: input.correlationId,
      category: "snapshot",
      action: "knowledge-graph-snapshot-created",
      subjectId: snapshot.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        version: snapshot.version,
        nodes: snapshot.nodes.length,
        relationships: snapshot.relationships.length
      }
    });

    return snapshot;
  }

  summary() {
    return {
      total: this.snapshots.size,
      latestVersion:
        this.list().sort(
          (left, right) => right.version - left.version
        )[0]?.version ?? 0
    };
  }
}
