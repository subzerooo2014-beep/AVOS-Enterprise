import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeIntelligenceMetricsService {
  private analyses = 0; private failures = 0; private totalMs = 0; private conflicts = 0; private gaps = 0; private insights = 0;
  completed(durationMs: number, counts: { conflicts: number; gaps: number; insights: number }) { this.analyses += 1; this.totalMs += durationMs; this.conflicts += counts.conflicts; this.gaps += counts.gaps; this.insights += counts.insights; }
  failed() { this.failures += 1; }
  snapshot() { return { analyses: this.analyses, failures: this.failures, averageProcessingTimeMs: this.analyses ? Number((this.totalMs / this.analyses).toFixed(2)) : 0, conflictsDetected: this.conflicts, gapsDetected: this.gaps, insightsGenerated: this.insights, capturedAt: new Date().toISOString() }; }
}