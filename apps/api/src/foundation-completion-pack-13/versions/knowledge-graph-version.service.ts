import { Injectable } from "@nestjs/common";
import {
  KnowledgeGraphVersion
} from "../foundation-pack-13.types";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "../relationships/knowledge-relationship-registry.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeGraphVersionService {
  private readonly versions =
    new Map<string, KnowledgeGraphVersion>();

  constructor(
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly relationships: KnowledgeRelationshipRegistryService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  list() {
    return Array.from(this.versions.values());
  }

  create(input: {
    changeSummary: string;
    createdByIdentityId: string;
    correlationId: string;
  }) {
    const versionNumber = this.versions.size + 1;

    const version: KnowledgeGraphVersion = {
      id: `knowledge-graph-version:${versionNumber}`,
      version: versionNumber,
      nodeIds: this.nodes.list().map((node) => node.id),
      relationshipIds: this.relationships
        .list()
        .map((relationship) => relationship.id),
      changeSummary: input.changeSummary,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.versions.set(version.id, version);

    this.audit.record({
      correlationId: input.correlationId,
      category: "version",
      action: "knowledge-graph-version-created",
      subjectId: version.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        version: version.version,
        nodes: version.nodeIds.length,
        relationships: version.relationshipIds.length
      }
    });

    return version;
  }

  summary() {
    return {
      total: this.versions.size,
      latestVersion:
        this.versions.size === 0
          ? 0
          : this.versions.size
    };
  }
}
