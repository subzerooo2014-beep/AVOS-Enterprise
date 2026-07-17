import { Injectable } from "@nestjs/common";
import { CapabilityRegistryIntegration } from "../integrations/capability-registry.integration";
import { EnterpriseKernelIntegration } from "../integrations/enterprise-kernel.integration";
import { UnifiedKnowledgeRegistryService } from "../registry/unified-knowledge-registry.service";
import { KnowledgeFabricRuntimeService } from "../runtime/knowledge-fabric-runtime.service";

@Injectable()
export class KnowledgeFabricHealthService {
  constructor(
    private readonly runtime: KnowledgeFabricRuntimeService,
    private readonly registry: UnifiedKnowledgeRegistryService,
    private readonly kernel: EnterpriseKernelIntegration,
    private readonly capabilities: CapabilityRegistryIntegration,
  ) {}

  async initializeIntegrations(): Promise<{
    kernelRegistered: boolean;
    capabilitiesRegistered: number;
  }> {
    const kernelRegistered = await this.kernel.register();
    const capabilitiesRegistered =
      await this.capabilities.registerCapabilities();
    return { kernelRegistered, capabilitiesRegistered };
  }

  async health(): Promise<Record<string, unknown>> {
    const runtime = this.runtime.snapshot();
    const registry = this.registry.health();
    const healthy =
      (runtime.status === "running" || runtime.status === "degraded") &&
      registry.unavailable === 0;

    const report = {
      status: healthy ? "healthy" : "degraded",
      runtime,
      registry,
      checkedAt: new Date().toISOString(),
    };

    await this.kernel.reportHealth(report);
    return report;
  }
}