import { Injectable } from "@nestjs/common";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";
import { PlatformRuntimeContextService } from "./platform-runtime-context.service";
import { PlatformRuntimeConfigurationService } from "./platform-runtime-configuration.service";
import { PlatformRuntimeSessionService } from "./platform-runtime-session.service";
import { UnifiedPlatformRuntimeService } from "./unified-platform-runtime.service";

@Injectable()
export class PlatformProductionMegaPack1StatusService {
  constructor(
    private readonly registry: PlatformRuntimeRegistryService,
    private readonly contexts: PlatformRuntimeContextService,
    private readonly configurations: PlatformRuntimeConfigurationService,
    private readonly sessions: PlatformRuntimeSessionService,
    private readonly runtime: UnifiedPlatformRuntimeService,
  ) {}

  status(): Record<string, unknown> {
    const components = this.registry.list();

    return {
      name: "AVOS Platform Production Integration — Mega Pack 1",
      version: "PPI-MP1-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      components: {
        unifiedPlatformRuntime: true,
        runtimeRegistry: true,
        runtimeDiscovery: true,
        runtimeLifecycle: true,
        runtimeSessions: true,
        runtimeContext: true,
        runtimeConfiguration: true,
        runtimeBootstrap: true,
        runtimeHealth: true,
        runtimeMetrics: true,
      },
      metrics: {
        registeredRuntimes: components.length,
        runningRuntimes: components.filter((component) =>
          ["running", "certified"].includes(component.status),
        ).length,
        contexts: this.contexts.list().length,
        configurations: this.configurations.list().length,
        sessions: this.sessions.list().length,
        runtimeMetrics: this.runtime.listMetrics().length,
      },
      latestHealth: this.runtime.latestHealth(),
    };
  }
}