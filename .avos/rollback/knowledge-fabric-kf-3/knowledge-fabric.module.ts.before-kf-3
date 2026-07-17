import { KnowledgeContextBuilderService } from "./runtime/knowledge-context-builder.service";
import { KnowledgeRetrievalPipelineService } from "./runtime/knowledge-retrieval-pipeline.service";
import { KnowledgeRuntimeCacheService } from "./runtime/knowledge-runtime-cache.service";
import { KnowledgeRuntimeController } from "./runtime/knowledge-runtime.controller";
import { KnowledgeRuntimeEngineService } from "./runtime/knowledge-runtime-engine.service";
import { KnowledgeRuntimeEventsService } from "./runtime/knowledge-runtime-events.service";
import { KnowledgeRuntimeHealthService } from "./runtime/knowledge-runtime-health.service";
import { KnowledgeRuntimeMetricsService } from "./runtime/knowledge-runtime-metrics.service";
import { KnowledgeRuntimePolicyService } from "./runtime/knowledge-runtime-policy.service";
import { KnowledgeRuntimeResolverService } from "./runtime/knowledge-runtime-resolver.service";
import { KnowledgeRuntimeSessionService } from "./runtime/knowledge-runtime-session.service";
import { Module } from "@nestjs/common";
import { KnowledgeChecksumService } from "./knowledge-checksum.service";
import { KnowledgeFabricController } from "./knowledge-fabric.controller";
import { KnowledgeFoundationService } from "./knowledge-foundation.service";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { KnowledgeRegistryService } from "./knowledge-registry.service";
import { KnowledgeValidatorService } from "./knowledge-validator.service";

@Module({
  controllers: [KnowledgeFabricController, KnowledgeRuntimeController],
  providers: [
    KnowledgeChecksumService,
    KnowledgeValidatorService,
    KnowledgeRegistryService,
    KnowledgeGraphService,
    KnowledgeFoundationService,
    KnowledgeRuntimeCacheService,
    KnowledgeRuntimePolicyService,
    KnowledgeRuntimeSessionService,
    KnowledgeRuntimeResolverService,
    KnowledgeRetrievalPipelineService,
    KnowledgeContextBuilderService,
    KnowledgeRuntimeEventsService,
    KnowledgeRuntimeMetricsService,
    KnowledgeRuntimeEngineService,
    KnowledgeRuntimeHealthService,
  ],
  exports: [
    KnowledgeChecksumService,
    KnowledgeValidatorService,
    KnowledgeRegistryService,
    KnowledgeGraphService,
    KnowledgeFoundationService,
    KnowledgeRuntimeCacheService,
    KnowledgeRuntimePolicyService,
    KnowledgeRuntimeSessionService,
    KnowledgeRuntimeResolverService,
    KnowledgeRetrievalPipelineService,
    KnowledgeContextBuilderService,
    KnowledgeRuntimeEventsService,
    KnowledgeRuntimeMetricsService,
    KnowledgeRuntimeEngineService,
    KnowledgeRuntimeHealthService,
  ],
})
export class KnowledgeFabricModule {}