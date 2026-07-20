import {
  Module,
  OnModuleInit,
} from "@nestjs/common";
import { AgpProductionPlatformCertificationService } from "./certification/agp-production-platform-certification.service";
import { AgpConnectorSdkService } from "./external/agp-connector-sdk.service";
import { AgpProductionPlatformHealthService } from "./health/agp-production-platform-health.service";
import { AgpEnterprisePlatformIntegrationService } from "./internal/agp-enterprise-platform-integration.service";
import { AgpIntegrationRegistryService } from "./registry/agp-integration-registry.service";
import { AgpRuntimeDeploymentOperationsService } from "./runtime/agp-runtime-deployment-operations.service";
import { AgpProductionIntegrationSmokeService } from "./smoke/agp-production-integration-smoke.service";
import { AgpProductionIntegrationVerificationService } from "./verification/agp-production-integration-verification.service";
import { AgpProductionIntegrationMegaPack1315Controller } from "./agp-production-integration-mega-pack-13-15.controller";

@Module({
  controllers: [
    AgpProductionIntegrationMegaPack1315Controller,
  ],
  providers: [
    AgpIntegrationRegistryService,
    AgpEnterprisePlatformIntegrationService,
    AgpConnectorSdkService,
    AgpRuntimeDeploymentOperationsService,
    AgpProductionPlatformHealthService,
    AgpProductionIntegrationVerificationService,
    AgpProductionIntegrationSmokeService,
    AgpProductionPlatformCertificationService,
  ],
  exports: [
    AgpIntegrationRegistryService,
    AgpEnterprisePlatformIntegrationService,
    AgpConnectorSdkService,
    AgpRuntimeDeploymentOperationsService,
    AgpProductionPlatformHealthService,
    AgpProductionIntegrationVerificationService,
    AgpProductionIntegrationSmokeService,
    AgpProductionPlatformCertificationService,
  ],
})
export class AgpProductionIntegrationMegaPack1315Module
  implements OnModuleInit
{
  constructor(
    private readonly internal:
      AgpEnterprisePlatformIntegrationService,
    private readonly external:
      AgpConnectorSdkService,
    private readonly runtime:
      AgpRuntimeDeploymentOperationsService,
  ) {}

  onModuleInit() {
    this.internal.bootstrap();
    this.external.bootstrap();
    this.runtime.bootstrap();
  }
}