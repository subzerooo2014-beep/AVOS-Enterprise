import { Injectable } from "@nestjs/common";
import { KnowledgeRuntimeMetrics } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeRuntimeMetricsService {
  private metrics: KnowledgeRuntimeMetrics = {
    sessionsStarted: 0,
    sessionsCompleted: 0,
    sessionsFailed: 0,
    activeSessions: 0,
    queriesExecuted: 0,
    cacheHits: 0,
    cacheMisses: 0,
    policyDenials: 0,
    averageDurationMs: 0,
  };
  private totalDurationMs = 0;

  started(activeSessions: number): void { this.metrics.sessionsStarted += 1; this.metrics.activeSessions = activeSessions; }
  completed(durationMs: number, activeSessions: number, cacheHits: number, cacheMisses: number, policyDenials: number): void {
    this.metrics.sessionsCompleted += 1;
    this.metrics.queriesExecuted += 1;
    this.metrics.activeSessions = activeSessions;
    this.metrics.cacheHits += cacheHits;
    this.metrics.cacheMisses += cacheMisses;
    this.metrics.policyDenials += policyDenials;
    this.totalDurationMs += durationMs;
    this.metrics.averageDurationMs = Number((this.totalDurationMs / this.metrics.queriesExecuted).toFixed(2));
    this.metrics.lastExecutionAt = new Date().toISOString();
  }
  failed(activeSessions: number): void { this.metrics.sessionsFailed += 1; this.metrics.activeSessions = activeSessions; }
  snapshot(): KnowledgeRuntimeMetrics { return structuredClone(this.metrics); }
}
