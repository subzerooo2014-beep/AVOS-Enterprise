import { Injectable } from "@nestjs/common";
import {
  KnowledgeFabricQuery,
  KnowledgeSearchResult,
} from "../contracts/knowledge-fabric-production.contracts";
import { KnowledgeFabricEventBusAdapter } from "../integrations/knowledge-fabric-event-bus.adapter";
import { KnowledgeFabricMetricsService } from "../monitoring/knowledge-fabric-metrics.service";
import { UnifiedSearchPipelineService } from "../pipeline/unified-search-pipeline.service";
import { KnowledgeFabricRuntimeService } from "../runtime/knowledge-fabric-runtime.service";

@Injectable()
export class KnowledgeFabricOrchestratorService {
  constructor(
    private readonly runtime: KnowledgeFabricRuntimeService,
    private readonly pipeline: UnifiedSearchPipelineService,
    private readonly metrics: KnowledgeFabricMetricsService,
    private readonly events: KnowledgeFabricEventBusAdapter,
  ) {}

  async search(input: KnowledgeFabricQuery): Promise<KnowledgeSearchResult> {
    const started = Date.now();
    const settle = this.runtime.beginRequest();

    try {
      await this.events.publish("knowledge.fabric.search.started", {
        query: input.query,
        correlationId: input.correlationId ?? null,
      });

      const result = await this.pipeline.execute(input);
      this.metrics.recordLatency(result.durationMs);

      await this.events.publish("knowledge.fabric.search.completed", {
        correlationId: result.correlationId,
        resultCount: result.total,
        durationMs: result.durationMs,
      });

      return result;
    } catch (error) {
      this.runtime.recordFailure();
      await this.events.publish("knowledge.fabric.search.failed", {
        query: input.query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      this.metrics.recordLatency(Date.now() - started);
      settle();
    }
  }
}