import { Injectable } from "@nestjs/common";
import { UrpBootstrapService } from "./urp-bootstrap.service";
import { UrpDiagnosticsService } from "./urp-diagnostics.service";
import { UrpFeatureFlagsService } from "./urp-feature-flags.service";
import { UrpHealthCenterService } from "./urp-health-center.service";
import { UrpRouterService } from "./urp-router.service";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";
import { UrpVersionManagerService } from "./urp-version-manager.service";

@Injectable()
export class UrpVerificationService {
  constructor(
    private readonly bootstrap: UrpBootstrapService,
    private readonly registry: UrpRuntimeRegistryService,
    private readonly router: UrpRouterService,
    private readonly health: UrpHealthCenterService,
    private readonly diagnostics: UrpDiagnosticsService,
    private readonly flags: UrpFeatureFlagsService,
    private readonly versions: UrpVersionManagerService,
  ) {}

  async run() {
    const boot = await this.bootstrap.boot();

    const event = this.router.publish({
      topic: "avos.runtime.verification",
      type: "urp.verification.started",
      source: "enterprise-kernel",
      payload: { release: "URP-1.0.0" },
    });

    const command = await this.router.command({
      name: "runtime.health.evaluate",
      target: "enterprise-kernel",
      payload: { verification: true },
      requestedBy: "human:khalifa",
      correlationId: event.correlationId,
    });

    const diagnostics = this.diagnostics.run();
    const health = this.health.evaluate();
    const inventory = this.versions.inventory();

    const checks = {
      unitsRegistered: this.registry.list().length >= 9,
      allUnitsOperational:
        this.registry.list().every((unit) => unit.status === "operational"),
      dependenciesValid: this.registry.validateDependencies().valid,
      unifiedBootPassed: boot.status === "operational",
      eventRouterOperational: Boolean(event.id),
      commandRouterOperational: Boolean(command),
      healthCenterOperational: health.status === "operational",
      diagnosticsPassed: diagnostics.status === "passed",
      versionInventoryOperational: inventory.length >= 9,
      featureFlagsOperational: this.flags.enabled("unified-routing"),
      foundationFirst: health.controls.foundationFirst,
      capabilityFirst: health.controls.capabilityFirst,
      blueprintDriven: health.controls.blueprintDriven,
      humanFinalAuthority: health.controls.humanFinalAuthority,
      globalComplianceReadinessGate:
        health.controls.globalComplianceReadinessGate,
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const score = Math.round((passed / total) * 100);

    return {
      id: "urp-verification:" + String(Date.now()),
      name: "AVOS Unified Runtime Platform Verification",
      version: "URP-1.0.0",
      status: score === 100 ? "passed" : "failed",
      score,
      checks,
      health,
      diagnostics,
      verifiedAt: new Date().toISOString(),
    };
  }
}