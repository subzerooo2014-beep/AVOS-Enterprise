import { Module } from "@nestjs/common";
import { KnowledgeContextBuilderService } from "./knowledge-context-builder.service";
import { KnowledgeRetrievalPipelineService } from "./knowledge-retrieval-pipeline.service";
import { KnowledgeRuntimeCacheService } from "./knowledge-runtime-cache.service";
import { KnowledgeRuntimeController } from "./knowledge-runtime.controller";
import { KnowledgeRuntimeEngineService } from "./knowledge-runtime-engine.service";
import { KnowledgeRuntimeEventsService } from "./knowledge-runtime-events.service";
import { KnowledgeRuntimeHealthService } from "./knowledge-runtime-health.service";
import { KnowledgeRuntimeMetricsService } from "./knowledge-runtime-metrics.service";
import { KnowledgeRuntimePolicyService } from "./knowledge-runtime-policy.service";
import { KnowledgeRuntimeResolverService } from "./knowledge-runtime-resolver.service";
import { KnowledgeRuntimeSessionService } from "./knowledge-runtime-session.service";

@Module({
  controllers: [KnowledgeRuntimeController],
  providers: [
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
    KnowledgeRuntimeCacheService,
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
export class KnowledgeRuntimeModule {}
