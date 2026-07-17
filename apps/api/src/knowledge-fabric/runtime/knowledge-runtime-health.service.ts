import { Injectable } from "@nestjs/common";
import { KnowledgeRuntimeCacheService } from "./knowledge-runtime-cache.service";
import { KnowledgeRuntimeMetricsService } from "./knowledge-runtime-metrics.service";
import { KnowledgeRuntimeSessionService } from "./knowledge-runtime-session.service";

@Injectable()
export class KnowledgeRuntimeHealthService {
  constructor(
    private readonly sessions: KnowledgeRuntimeSessionService,
    private readonly cache: KnowledgeRuntimeCacheService,
    private readonly metrics: KnowledgeRuntimeMetricsService,
  ) {}

  status() {
    return {
      success: true,
      system: "AVOS Knowledge Fabric",
      pack: "KF-2 Knowledge Runtime",
      status: "operational",
      foundationFirst: true,
      runtime: {
        engine: "operational",
        sessions: this.sessions.list().length,
        activeSessions: this.sessions.activeCount(),
        cache: this.cache.stats(),
        metrics: this.metrics.snapshot(),
      },
      checkedAt: new Date().toISOString(),
    };
  }
}
