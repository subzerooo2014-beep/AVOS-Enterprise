import { Injectable } from "@nestjs/common";
import { FoundationIntegrationRegistryService } from "./foundation-integration-registry.service";
import { UnifiedControlPlaneService } from "./unified-control-plane.service";
import { UnifiedCertificationRegistryService } from "./unified-certification-registry.service";

@Injectable()
export class FoundationProductionStatusService {
  constructor(
    private readonly registry: FoundationIntegrationRegistryService,
    private readonly controlPlane: UnifiedControlPlaneService,
    private readonly certifications: UnifiedCertificationRegistryService,
  ) {}

  status(): Record<string, unknown> {
    return {
      name: "AVOS Foundation Production Integration & Unified Control Plane",
      version: "FPI-UCP-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      integrationTargets: this.registry.list().length,
      controlPlane: this.controlPlane.status(),
      latestHealth: this.controlPlane.latestHealth(),
      certificationRegistryEntries: this.certifications.list().length,
      productionReadiness:
        this.certifications.latestProductionReadiness(),
    };
  }
}