import { Module } from "@nestjs/common";
import { FoundationCompletionPack12Controller } from "./foundation-completion-pack-12.controller";
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

@Module({
  controllers: [FoundationCompletionPack12Controller],
  providers: [
    FoundationCompletionPack12Service,
    EnterpriseMemoryRegistryService,
    MemoryLineageGraphService,
    MemoryRetrievalEngineService,
    ContextAssemblyEngineService,
    MemoryRetentionPolicyService,
    MemoryVersionManagerService,
    MemoryReplayService,
    KnowledgeContinuityService,
    MemoryIntegrityValidatorService,
    MemoryHealthIndexService,
    MemoryAuditService
  ],
  exports: [
    FoundationCompletionPack12Service,
    EnterpriseMemoryRegistryService,
    MemoryLineageGraphService,
    MemoryRetrievalEngineService,
    ContextAssemblyEngineService,
    MemoryRetentionPolicyService,
    MemoryVersionManagerService,
    MemoryReplayService,
    KnowledgeContinuityService,
    MemoryIntegrityValidatorService,
    MemoryHealthIndexService,
    MemoryAuditService
  ]
})
export class FoundationCompletionPack12Module {}
