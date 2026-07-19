import { Body, Controller, Get, Post } from "@nestjs/common";
import { FoundationIntegrationRegistryService } from "./foundation-integration-registry.service";
import { UnifiedControlPlaneService } from "./unified-control-plane.service";
import { UnifiedCertificationRegistryService } from "./unified-certification-registry.service";
import { FoundationProductionStatusService } from "./foundation-production-status.service";
import { FoundationProductionAssuranceService } from "./foundation-production-assurance.service";

@Controller("avos/foundation/production")
export class FoundationProductionController {
  constructor(
    private readonly registry: FoundationIntegrationRegistryService,
    private readonly controlPlane: UnifiedControlPlaneService,
    private readonly certifications: UnifiedCertificationRegistryService,
    private readonly statusService: FoundationProductionStatusService,
    private readonly assurance: FoundationProductionAssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("integrations")
  integrations() {
    return this.registry.list();
  }

  @Get("control-plane/status")
  controlPlaneStatus() {
    return this.controlPlane.status();
  }

  @Get("control-plane/commands")
  commands() {
    return this.controlPlane.listCommands();
  }

  @Post("control-plane/execute")
  execute(
    @Body()
    body: {
      command:
        | "discover"
        | "synchronize"
        | "health-check"
        | "verify"
        | "certify"
        | "reconcile";
      requestedBy: string;
      targetIds?: string[];
      approvedBy?: string;
    },
  ) {
    return this.controlPlane.execute(
      body.command,
      body.requestedBy,
      body.targetIds,
      body.approvedBy,
    );
  }

  @Post("control-plane/health/run")
  health() {
    return this.controlPlane.healthSnapshot();
  }

  @Get("control-plane/health/status")
  latestHealth() {
    return this.controlPlane.latestHealth();
  }

  @Post("certification-registry/synchronize")
  synchronizeCertifications() {
    return this.certifications.synchronizeKnownCertifications();
  }

  @Get("certification-registry")
  certificationRegistry() {
    return this.certifications.list();
  }

  @Post("production-readiness/run")
  productionReadiness() {
    return this.certifications.productionReadiness();
  }

  @Get("production-readiness/status")
  productionReadinessStatus() {
    return this.certifications.latestProductionReadiness();
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}