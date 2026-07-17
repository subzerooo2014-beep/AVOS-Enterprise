import { Injectable } from "@nestjs/common";
import { IntelligenceVerificationResult } from "../contracts/intelligence-fabric.contracts";
import { IntelligenceMetricsService } from "../monitoring/intelligence-metrics.service";
import { IntelligenceOrchestratorService } from "../orchestrator/intelligence-orchestrator.service";
import { IntelligenceRuntimeService } from "../runtime/intelligence-runtime.service";

@Injectable()
export class IntelligenceFoundationVerificationService {
  private latestResult?: IntelligenceVerificationResult;

  constructor(
    private readonly runtime: IntelligenceRuntimeService,
    private readonly orchestrator: IntelligenceOrchestratorService,
    private readonly metrics: IntelligenceMetricsService,
  ) {}

  async run(): Promise<IntelligenceVerificationResult> {
    const decision = await this.orchestrator.execute({
      objective: "Verify AVOS Intelligence Fabric foundation",
      signals: [
        {
          id: `verification-signal:${Date.now()}`,
          type: "system-health",
          source: "if-1-verification",
          value: "healthy",
          confidence: 1,
          observedAt: new Date().toISOString(),
        },
      ],
    });

    const runtime = this.runtime.snapshot();
    const metrics = this.metrics.snapshot();

    const checks = {
      runtimeVersionPresent: runtime.version.length > 0,
      decisionGenerated: decision.id.length > 0,
      insightGenerated: decision.insights.length > 0,
      confidenceValid:
        decision.confidence >= 0 && decision.confidence <= 1,
      metricsOperational: typeof metrics.uptimeMs === "number",
    };

    const findings = Object.entries(checks)
      .filter(([, value]) => !value)
      .map(([name]) => name);

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.values(checks).length) *
        100,
    );

    this.latestResult = {
      id: `intelligence-fabric-if1-verification:${Date.now()}`,
      status: findings.length === 0 ? "passed" : "failed",
      score,
      checks,
      findings,
      verifiedAt: new Date().toISOString(),
    };

    return this.latestResult;
  }

  latest(): IntelligenceVerificationResult | undefined {
    return this.latestResult;
  }
}