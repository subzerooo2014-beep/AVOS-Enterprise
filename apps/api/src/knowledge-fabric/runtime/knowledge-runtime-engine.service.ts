import { Injectable } from "@nestjs/common";
import { ExecuteKnowledgeRuntimeInput } from "./knowledge-runtime.contracts";
import { KnowledgeContextBuilderService } from "./knowledge-context-builder.service";
import { KnowledgeRetrievalPipelineService } from "./knowledge-retrieval-pipeline.service";
import { KnowledgeRuntimeEventsService } from "./knowledge-runtime-events.service";
import { KnowledgeRuntimeMetricsService } from "./knowledge-runtime-metrics.service";
import { KnowledgeRuntimeResolverService } from "./knowledge-runtime-resolver.service";
import { KnowledgeRuntimeSessionService } from "./knowledge-runtime-session.service";
import { KnowledgeRuntimeDiagnostics, KnowledgeRuntimeResult } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeRuntimeEngineService {
  constructor(
    private readonly sessions: KnowledgeRuntimeSessionService,
    private readonly resolver: KnowledgeRuntimeResolverService,
    private readonly retrieval: KnowledgeRetrievalPipelineService,
    private readonly contexts: KnowledgeContextBuilderService,
    private readonly events: KnowledgeRuntimeEventsService,
    private readonly metrics: KnowledgeRuntimeMetricsService,
  ) {}

  execute(input: ExecuteKnowledgeRuntimeInput): KnowledgeRuntimeResult {
    const startedAt = Date.now();
    const session = this.sessions.create({ request: input });
    this.metrics.started(this.sessions.activeCount());
    this.events.emit("knowledge.runtime.started", { operation: input.operation, query: input.query }, session.id, session.correlationId);

    const diagnostics: KnowledgeRuntimeDiagnostics = {
      durationMs: 0, candidates: 0, resolved: 0, cacheHits: 0, cacheMisses: 0,
      policyDenied: 0, dependencyExpansions: 0, warnings: [],
    };

    try {
      const records = this.resolver.resolve(input);
      diagnostics.candidates = records.length;
      const items = this.retrieval.retrieve(records, input, diagnostics);
      diagnostics.resolved = items.length;
      const context = this.contexts.build(session.id, input.query, items);
      diagnostics.durationMs = Date.now() - startedAt;
      this.sessions.complete(session.id, context);
      this.metrics.completed(diagnostics.durationMs, this.sessions.activeCount(), diagnostics.cacheHits, diagnostics.cacheMisses, diagnostics.policyDenied);
      this.events.emit("knowledge.runtime.completed", { resolved: items.length, durationMs: diagnostics.durationMs }, session.id, session.correlationId);
      return { success: true, sessionId: session.id, correlationId: session.correlationId, operation: input.operation, context, diagnostics };
    } catch (error) {
      this.sessions.fail(session.id, error);
      this.metrics.failed(this.sessions.activeCount());
      this.events.emit("knowledge.runtime.failed", { error: error instanceof Error ? error.message : String(error) }, session.id, session.correlationId);
      throw error;
    }
  }
}
