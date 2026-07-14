import { Module } from "@nestjs/common";
import { AiExperienceRuntimeService } from "./ai-experience-runtime.service";
import { AvosProductFinalController } from "./avos-product-final.controller";
import { AvosProductFinalOrchestratorService } from "./avos-product-final-orchestrator.service";
import { CommerceIntegrationsRuntimeService } from "./commerce-integrations-runtime.service";
import { ProductCoreRuntimeService } from "./product-core-runtime.service";
import { ProductReleaseCertificationService } from "./product-release-certification.service";
import { UiAppsDeploymentRuntimeService } from "./ui-apps-deployment-runtime.service";

@Module({
  controllers: [AvosProductFinalController],
  providers: [
    ProductCoreRuntimeService,
    AiExperienceRuntimeService,
    CommerceIntegrationsRuntimeService,
    UiAppsDeploymentRuntimeService,
    ProductReleaseCertificationService,
    AvosProductFinalOrchestratorService,
  ],
  exports: [
    ProductCoreRuntimeService,
    AiExperienceRuntimeService,
    CommerceIntegrationsRuntimeService,
    UiAppsDeploymentRuntimeService,
    ProductReleaseCertificationService,
    AvosProductFinalOrchestratorService,
  ],
})
export class AvosProductFinalModule {}