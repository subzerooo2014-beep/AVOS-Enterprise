import { Injectable } from "@nestjs/common";
import { KnowledgeIntelligenceEngineService } from "./knowledge-intelligence-engine.service";
import { KnowledgeIntelligenceMetricsService } from "./knowledge-intelligence-metrics.service";

@Injectable()
export class KnowledgeIntelligenceHealthService {
  constructor(private readonly engine: KnowledgeIntelligenceEngineService, private readonly metrics: KnowledgeIntelligenceMetricsService) {}
  health() { return { success: true, system: "AVOS Knowledge Fabric", pack: "KF-3 Knowledge Intelligence", status: "operational", catalogSize: this.engine.list().length, metrics: this.metrics.snapshot(), checkedAt: new Date().toISOString() }; }
}