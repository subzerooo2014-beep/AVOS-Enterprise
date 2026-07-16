import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack12Service } from "./foundation-completion-pack-12.service";
import { EnterpriseMemoryRegistryService } from "./memory/enterprise-memory-registry.service";
import { MemoryLineageGraphService } from "./lineage/memory-lineage-graph.service";
import { MemoryRetrievalEngineService } from "./retrieval/memory-retrieval-engine.service";
import { ContextAssemblyEngineService } from "./contexts/context-assembly-engine.service";
import { MemoryRetentionPolicyService } from "./retention/memory-retention-policy.service";
import { MemoryVersionManagerService } from "./versions/memory-version-manager.service";
import { MemoryReplayService } from "./replay/memory-replay.service";
import { KnowledgeContinuityService } from "./continuity/knowledge-continuity.service";
import { MemoryIntegrityValidatorService } from "./integrity/memory-integrity-validator.service";
import { MemoryHealthIndexService } from "./health/memory-health-index.service";
import { MemoryAuditService } from "./observability/memory-audit.service";
import {
  EnterpriseMemorySensitivity,
  EnterpriseMemoryType,
  MemoryRelationType,
  MemoryRetrievalQuery,
  RetentionAction
} from "./foundation-pack-12.types";

@Controller("foundation-completion-v12")
export class FoundationCompletionPack12Controller {
  constructor(
    private readonly pack: FoundationCompletionPack12Service,
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly lineage: MemoryLineageGraphService,
    private readonly retrieval: MemoryRetrievalEngineService,
    private readonly contexts: ContextAssemblyEngineService,
    private readonly retention: MemoryRetentionPolicyService,
    private readonly versions: MemoryVersionManagerService,
    private readonly replay: MemoryReplayService,
    private readonly continuity: KnowledgeContinuityService,
    private readonly integrity: MemoryIntegrityValidatorService,
    private readonly health: MemoryHealthIndexService,
    private readonly audit: MemoryAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("memories")
  memoryList() {
    return {
      summary: this.memories.summary(),
      items: this.memories.list()
    };
  }

  @Get("memories/:id")
  memory(@Param("id") id: string) {
    return this.memories.get(id);
  }

  @Post("memories")
  createMemory(
    @Body()
    body: {
      type: EnterpriseMemoryType;
      title: string;
      description: string;
      subjectId: string;
      subjectType: string;
      correlationId: string;
      sourceIdentityId: string;
      ownerIdentityId: string;
      sensitivity: EnterpriseMemorySensitivity;
      content: Record<string, unknown>;
      summary: string;
      tags?: string[];
      parentMemoryId?: string;
      retentionPolicyId?: string;
      expiresAt?: string;
    }
  ) {
    return this.memories.create(body);
  }

  @Post("memories/:id/update")
  updateMemory(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        title?: string;
        description?: string;
        content?: Record<string, unknown>;
        summary?: string;
        tags?: string[];
        sensitivity?: EnterpriseMemorySensitivity;
        retentionPolicyId?: string;
        expiresAt?: string;
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.memories.update(
      id,
      body.patch,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("relations")
  createRelation(
    @Body()
    body: {
      fromMemoryId: string;
      toMemoryId: string;
      relation: MemoryRelationType;
      strength?: number;
      reason: string;
      metadata?: Record<string, unknown>;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.lineage.link(body);
  }

  @Get("lineage/:memoryId")
  lineageByMemory(
    @Param("memoryId") memoryId: string
  ) {
    return this.lineage.lineage(memoryId);
  }

  @Post("retrieval/search")
  searchMemory(
    @Body()
    body: {
      query: MemoryRetrievalQuery;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.retrieval.search(
      body.query,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("contexts")
  contextList() {
    return {
      summary: this.contexts.summary(),
      items: this.contexts.list()
    };
  }

  @Post("contexts")
  assembleContext(
    @Body()
    body: {
      name: string;
      purpose: string;
      correlationId: string;
      assembledByIdentityId: string;
      memoryIds?: string[];
      retrievalQuery?: MemoryRetrievalQuery;
      tokenBudget?: number;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.contexts.assemble(body);
  }

  @Get("retention/policies")
  retentionPolicies() {
    return {
      summary: this.retention.summary(),
      items: this.retention.list()
    };
  }

  @Post("retention/policies")
  registerRetentionPolicy(
    @Body()
    body: {
      id: string;
      name: string;
      description: string;
      memoryTypes: EnterpriseMemoryType[];
      sensitivityLevels: EnterpriseMemorySensitivity[];
      retentionDays: number;
      archiveAfterDays?: number;
      actionAfterRetention: RetentionAction;
      legalHold: boolean;
      active: boolean;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.retention.register(body);
  }

  @Post("retention/evaluate")
  evaluateRetention(
    @Body()
    body: {
      asOf?: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.retention.evaluate(body);
  }

  @Get("memories/:id/versions")
  memoryVersions(@Param("id") id: string) {
    return {
      memoryId: id,
      items: this.versions.byMemory(id)
    };
  }

  @Post("memories/:id/versions")
  snapshotMemory(
    @Param("id") id: string,
    @Body()
    body: {
      changeSummary: string;
      changedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.versions.snapshot({
      memoryId: id,
      ...body
    });
  }

  @Post("memories/:id/replay")
  replayMemory(
    @Param("id") id: string,
    @Body()
    body: {
      replayedByIdentityId: string;
      correlationId: string;
      overrideContent?: Record<string, unknown>;
    }
  ) {
    return this.replay.replay({
      sourceMemoryId: id,
      ...body
    });
  }

  @Get("continuity/snapshots")
  continuitySnapshots() {
    return {
      summary: this.continuity.summary(),
      items: this.continuity.list()
    };
  }

  @Post("continuity/snapshots")
  createContinuitySnapshot(
    @Body()
    body: {
      name: string;
      memoryIds?: string[];
      contextIds?: string[];
      createdByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.continuity.createSnapshot(body);
  }

  @Post("integrity/validate")
  validateIntegrity(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.integrity.validate(body);
  }

  @Get("integrity/findings")
  integrityFindings() {
    return {
      summary: this.integrity.summary(),
      items: this.integrity.list()
    };
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
