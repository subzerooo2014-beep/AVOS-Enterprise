import { Injectable } from "@nestjs/common";
import { UrpResourceManagerService } from "./urp-resource-manager.service";
import { UrpRuntimeContextService } from "./urp-runtime-context.service";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

@Injectable()
export class UrpHealthCenterService {
  constructor(
    private readonly context: UrpRuntimeContextService,
    private readonly registry: UrpRuntimeRegistryService,
    private readonly resources: UrpResourceManagerService,
  ) {}

  evaluate() {
    const registry = this.registry.snapshot();
    const dependencies = this.registry.validateDependencies();
    const pressure = this.resources.pressure();

    const healthy =
      dependencies.valid &&
      registry.failed === 0 &&
      registry.degraded === 0 &&
      pressure.level !== "critical";

    return {
      name: "AVOS Unified Runtime Platform",
      version: "URP-1.0.0",
      status: healthy ? "operational" : "degraded",
      runtime: this.context.status(),
      registry,
      dependencies,
      resources: pressure,
      controls: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
      },
      checkedAt: new Date().toISOString(),
    };
  }
}