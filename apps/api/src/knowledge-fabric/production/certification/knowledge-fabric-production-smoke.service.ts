import { Injectable } from "@nestjs/common";
import { KnowledgeFabricOrchestratorService } from "../orchestrator/knowledge-fabric-orchestrator.service";
import { UnifiedKnowledgeRegistryService } from "../registry/unified-knowledge-registry.service";
import { KnowledgeFabricRuntimeService } from "../runtime/knowledge-fabric-runtime.service";

@Injectable()
export class KnowledgeFabricProductionSmokeService {
  constructor(
    private readonly runtime: KnowledgeFabricRuntimeService,
    private readonly registry: UnifiedKnowledgeRegistryService,
    private readonly orchestrator: KnowledgeFabricOrchestratorService,
  ) {}

  async run(): Promise<Record<string, unknown>> {
    const runtime = await this.runtime.start();
    const result = await this.orchestrator.search({
      query: "knowledge fabric runtime",
      limit: 5,
      correlationId: `kf-smoke:${Date.now()}`,
    });

    const checks = {
      runtimeRunning: runtime.status === "running",
      registryPopulated: this.registry.count() >= 5,
      searchCompleted: typeof result.durationMs === "number",
      correlationCreated: result.correlationId.length > 0,
    };

    const passed = Object.values(checks).every(Boolean);
    return {
      id: `knowledge-fabric-production-smoke:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score: Math.round(
        (Object.values(checks).filter(Boolean).length /
          Object.values(checks).length) *
          100,
      ),
      checks,
      resultPreview: result.evidence.slice(0, 3),
      testedAt: new Date().toISOString(),
    };
  }
}