import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack13Service } from "./foundation-completion-pack-13.service";
import { KnowledgeNodeRegistryService } from "./nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "./relationships/knowledge-relationship-registry.service";
import { SemanticKnowledgeSearchService } from "./search/semantic-knowledge-search.service";
import { KnowledgeGraphTraversalService } from "./traversal/knowledge-graph-traversal.service";
import { KnowledgeGraphQualityService } from "./quality/knowledge-graph-quality.service";
import { KnowledgeGraphVersionService } from "./versions/knowledge-graph-version.service";
import { KnowledgeGraphSnapshotService } from "./snapshots/knowledge-graph-snapshot.service";
import { KnowledgeGraphReplayService } from "./replay/knowledge-graph-replay.service";
import { KnowledgeGraphHealthService } from "./health/knowledge-graph-health.service";
import { KnowledgeGraphAuditService } from "./observability/knowledge-graph-audit.service";
import {
  GraphTraversalRequest,
  KnowledgeNodeStatus,
  KnowledgeNodeType,
  KnowledgeRelationshipType,
  SemanticSearchQuery
} from "./foundation-pack-13.types";

@Controller("foundation-completion-v13")
export class FoundationCompletionPack13Controller {
  constructor(
    private readonly pack: FoundationCompletionPack13Service,
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly relationships: KnowledgeRelationshipRegistryService,
    private readonly search: SemanticKnowledgeSearchService,
    private readonly traversal: KnowledgeGraphTraversalService,
    private readonly quality: KnowledgeGraphQualityService,
    private readonly versions: KnowledgeGraphVersionService,
    private readonly snapshots: KnowledgeGraphSnapshotService,
    private readonly replay: KnowledgeGraphReplayService,
    private readonly health: KnowledgeGraphHealthService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("nodes")
  nodeList() {
    return {
      summary: this.nodes.summary(),
      items: this.nodes.list()
    };
  }

  @Get("nodes/:id")
  node(@Param("id") id: string) {
    return this.nodes.get(id);
  }

  @Post("nodes")
  registerNode(
    @Body()
    body: {
      id?: string;
      type: KnowledgeNodeType;
      canonicalName: string;
      displayName: string;
      description: string;
      identityId?: string;
      sourceSystem: string;
      domain: string;
      tags?: string[];
      attributes?: Record<string, unknown>;
      confidence?: number;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.nodes.register(body);
  }

  @Post("nodes/:id/update")
  updateNode(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        displayName?: string;
        description?: string;
        status?: KnowledgeNodeStatus;
        sourceSystem?: string;
        domain?: string;
        tags?: string[];
        attributes?: Record<string, unknown>;
        confidence?: number;
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.nodes.update(
      id,
      body.patch,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("relationships")
  relationshipList() {
    return {
      summary: this.relationships.summary(),
      items: this.relationships.list()
    };
  }

  @Post("relationships")
  registerRelationship(
    @Body()
    body: {
      fromNodeId: string;
      toNodeId: string;
      type: KnowledgeRelationshipType;
      label: string;
      strength?: number;
      confidence?: number;
      bidirectional?: boolean;
      metadata?: Record<string, unknown>;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.relationships.register(body);
  }

  @Get("nodes/:id/neighborhood")
  neighborhood(@Param("id") id: string) {
    return this.relationships.neighborhood(id);
  }

  @Post("search")
  semanticSearch(
    @Body()
    body: {
      query: SemanticSearchQuery;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.search.search(
      body.query,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("traversal")
  traverse(
    @Body()
    body: {
      request: GraphTraversalRequest;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.traversal.traverse(
      body.request,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("path/:fromNodeId/:toNodeId")
  shortestPath(
    @Param("fromNodeId") fromNodeId: string,
    @Param("toNodeId") toNodeId: string
  ) {
    return this.traversal.shortestPath(
      fromNodeId,
      toNodeId
    );
  }

  @Post("quality/validate")
  validateQuality(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.quality.validate(body);
  }

  @Get("quality/findings")
  qualityFindings() {
    return {
      summary: this.quality.summary(),
      items: this.quality.list()
    };
  }

  @Get("versions")
  versionList() {
    return {
      summary: this.versions.summary(),
      items: this.versions.list()
    };
  }

  @Post("versions")
  createVersion(
    @Body()
    body: {
      changeSummary: string;
      createdByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.versions.create(body);
  }

  @Get("snapshots")
  snapshotList() {
    return {
      summary: this.snapshots.summary(),
      items: this.snapshots.list()
    };
  }

  @Post("snapshots")
  createSnapshot(
    @Body()
    body: {
      name: string;
      createdByIdentityId: string;
      correlationId: string;
      changeSummary: string;
    }
  ) {
    return this.snapshots.create(body);
  }

  @Post("snapshots/:id/replay")
  replaySnapshot(
    @Param("id") id: string,
    @Body()
    body: {
      replayedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.replay.replay({
      snapshotId: id,
      ...body
    });
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
