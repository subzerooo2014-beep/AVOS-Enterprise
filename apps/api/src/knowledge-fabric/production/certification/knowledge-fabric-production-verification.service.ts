import { Injectable } from "@nestjs/common";
import { KnowledgeFabricVerificationResult } from "../contracts/knowledge-fabric-production.contracts";
import { KnowledgeFabricHealthService } from "../health/knowledge-fabric-health.service";
import { UnifiedKnowledgeRegistryService } from "../registry/unified-knowledge-registry.service";
import { KnowledgeFabricRuntimeService } from "../runtime/knowledge-fabric-runtime.service";

@Injectable()
export class KnowledgeFabricProductionVerificationService {
  private lastResult?: KnowledgeFabricVerificationResult;

  constructor(
    private readonly runtime: KnowledgeFabricRuntimeService,
    private readonly registry: UnifiedKnowledgeRegistryService,
    private readonly healthService: KnowledgeFabricHealthService,
  ) {}

  async run(): Promise<KnowledgeFabricVerificationResult> {
    const runtime = this.runtime.snapshot();
    const registryHealth = this.registry.health();
    const health = await this.healthService.health();

    const checks = {
      runtimeOperational:
        runtime.status === "running" || runtime.status === "degraded",
      registryInitialized: registryHealth.total >= 5,
      noUnavailableRegistryEntries: registryHealth.unavailable === 0,
      healthEndpointOperational: health.status === "healthy",
      runtimeVersionPresent: runtime.version.length > 0,
    };

    const failed = Object.entries(checks)
      .filter(([, value]) => !value)
      .map(([name]) => name);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.values(checks).length) *
        100,
    );

    this.lastResult = {
      id: `knowledge-fabric-production-verification:${Date.now()}`,
      status: failed.length === 0 ? "passed" : "failed",
      score,
      checks,
      findings: failed,
      verifiedAt: new Date().toISOString(),
    };

    return this.lastResult;
  }

  latest(): KnowledgeFabricVerificationResult | undefined {
    return this.lastResult;
  }
}