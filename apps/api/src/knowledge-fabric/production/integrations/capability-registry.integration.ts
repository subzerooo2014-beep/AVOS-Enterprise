import { Injectable, Logger, Optional } from "@nestjs/common";

interface CapabilityRegistryBridge {
  register?: (capability: Readonly<Record<string, unknown>>) => unknown;
}

@Injectable()
export class CapabilityRegistryIntegration {
  private readonly logger = new Logger(CapabilityRegistryIntegration.name);

  constructor(@Optional() private readonly registry?: CapabilityRegistryBridge) {}

  async registerCapabilities(): Promise<number> {
    if (!this.registry?.register) {
      this.logger.warn(
        "Capability Registry bridge was not injected; local registry remains authoritative.",
      );
      return 0;
    }

    const capabilities = [
      ["knowledge.fabric.runtime", "Knowledge Fabric Runtime"],
      ["knowledge.fabric.orchestration", "Knowledge Fabric Orchestration"],
      ["knowledge.fabric.search", "Unified Knowledge Search"],
      ["knowledge.fabric.monitoring", "Knowledge Fabric Monitoring"],
      ["knowledge.fabric.certification", "Knowledge Fabric Certification"],
    ] as const;

    for (const [id, name] of capabilities) {
      await this.registry.register({
        id,
        name,
        version: "1.0.0",
        owner: "AVOS Knowledge Fabric",
        status: "active",
      });
    }

    return capabilities.length;
  }
}