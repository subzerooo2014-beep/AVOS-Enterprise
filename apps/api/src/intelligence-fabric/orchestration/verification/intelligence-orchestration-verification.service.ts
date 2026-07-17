import { Injectable } from "@nestjs/common";
import {
  IntelligenceOrchestrationVerificationResult,
} from "../contracts/unified-intelligence-orchestration.contracts";
import { UnifiedIntelligenceHealthService } from "../health/unified-intelligence-health.service";
import { UnifiedIntelligenceOrchestratorService } from "../orchestrator/unified-intelligence-orchestrator.service";
import { UnifiedIntelligenceEngineRegistryService } from "../registry/unified-intelligence-engine-registry.service";

@Injectable()
export class IntelligenceOrchestrationVerificationService {
  private latestResult?: IntelligenceOrchestrationVerificationResult;

  constructor(
    private readonly registry: UnifiedIntelligenceEngineRegistryService,
    private readonly orchestrator: UnifiedIntelligenceOrchestratorService,
    private readonly health: UnifiedIntelligenceHealthService,
  ) {}

  async run(): Promise<IntelligenceOrchestrationVerificationResult> {
    const decision = await this.orchestrator.execute({
      objective: "Verify unified intelligence orchestration",
      domain: "knowledge",
      capability: "evidence-analysis",
      requireHumanApproval: true,
      evidence: [
        {
          id: `if2-verification-evidence:${Date.now()}`,
          source: "if2-verification",
          title: "IF-2 Verification Evidence",
          content: "Unified orchestration verification evidence.",
          trustScore: 1,
        },
      ],
    });

    const health = this.health.snapshot();
    const registryHealth = this.registry.health();

    const checks = {
      registryInitialized: registryHealth.total >= 6,
      healthyEnginesPresent: registryHealth.healthy > 0,
      multiEngineRouting: decision.selectedEngines.length > 0,
      decisionGenerated: decision.id.length > 0,
      correlationGenerated: decision.correlationId.length > 0,
      evidenceUsed: decision.engineResults.some(
        (result) => result.evidenceIds.length > 0,
      ),
      healthOperational: health.status === "healthy",
    };

    const findings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.values(checks).length) *
        100,
    );

    this.latestResult = {
      id: `intelligence-fabric-if2-verification:${Date.now()}`,
      status: findings.length === 0 ? "passed" : "failed",
      score,
      checks,
      findings,
      verifiedAt: new Date().toISOString(),
    };

    return this.latestResult;
  }

  latest(): IntelligenceOrchestrationVerificationResult | undefined {
    return this.latestResult;
  }
}