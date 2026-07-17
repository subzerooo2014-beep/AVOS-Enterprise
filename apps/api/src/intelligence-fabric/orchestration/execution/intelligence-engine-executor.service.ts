import { Injectable } from "@nestjs/common";
import {
  IntelligenceEngineDescriptor,
  IntelligenceEngineResult,
  UnifiedIntelligenceRequest,
} from "../contracts/unified-intelligence-orchestration.contracts";

@Injectable()
export class IntelligenceEngineExecutorService {
  async execute(
    engine: IntelligenceEngineDescriptor,
    request: UnifiedIntelligenceRequest,
  ): Promise<IntelligenceEngineResult> {
    const startedAt = Date.now();
    const evidence = request.evidence ?? [];
    const trustedEvidence = evidence.filter(
      (item) => item.trustScore >= 0.6,
    );

    const confidence = this.calculateConfidence(
      engine,
      request,
      trustedEvidence.length,
    );

    return {
      engineId: engine.id,
      recommendation: this.recommend(engine, request, trustedEvidence.length),
      confidence,
      rationale: [
        `Engine domain: ${engine.domain}.`,
        `Engine capabilities: ${engine.capabilities.join(", ")}.`,
        `Trusted evidence items: ${trustedEvidence.length}.`,
        `Objective analyzed: ${request.objective}.`,
      ],
      evidenceIds: trustedEvidence.map((item) => item.id),
      durationMs: Math.max(1, Date.now() - startedAt),
      generatedAt: new Date().toISOString(),
    };
  }

  private calculateConfidence(
    engine: IntelligenceEngineDescriptor,
    request: UnifiedIntelligenceRequest,
    trustedEvidenceCount: number,
  ): number {
    let confidence = 0.55;

    if (request.domain === engine.domain) confidence += 0.15;
    if (
      request.capability &&
      engine.capabilities.includes(request.capability)
    ) {
      confidence += 0.15;
    }

    confidence += Math.min(trustedEvidenceCount * 0.03, 0.12);

    if (engine.health === "healthy") confidence += 0.03;
    if (engine.health === "degraded") confidence -= 0.1;

    return Number(Math.min(Math.max(confidence, 0), 1).toFixed(4));
  }

  private recommend(
    engine: IntelligenceEngineDescriptor,
    request: UnifiedIntelligenceRequest,
    trustedEvidenceCount: number,
  ): string {
    return `${engine.name} recommends a controlled action for "${request.objective}" using ${trustedEvidenceCount} trusted evidence item(s), with validation before production execution.`;
  }
}