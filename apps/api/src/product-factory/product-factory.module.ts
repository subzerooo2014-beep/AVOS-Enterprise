import { Module } from '@nestjs/common';
import { ProductFactoryController } from './product-factory.controller';
import { ProductFactoryService } from './product-factory.service';
import { FactoryRegistryService } from './factory-registry.service';
import { FactoryTemplateCatalogService } from './factory-template-catalog.service';
import { FactoryBlueprintService } from './factory-blueprint.service';
import { FactoryPipelineService } from './factory-pipeline.service';
import { ProductGeneratorService } from './product-generator.service';
import { BackendGeneratorService } from './backend-generator.service';
import { WebGeneratorService } from './web-generator.service';
import { MobileGeneratorService } from './mobile-generator.service';
import { DatabaseGeneratorService } from './database-generator.service';
import { ApiGeneratorService } from './api-generator.service';
import { UiGeneratorService } from './ui-generator.service';
import { WorkflowGeneratorService } from './workflow-generator.service';
import { DocumentationGeneratorService } from './documentation-generator.service';
import { DeploymentGeneratorService } from './deployment-generator.service';
import { TestingGeneratorService } from './testing-generator.service';
import { ConfigurationGeneratorService } from './configuration-generator.service';
import { ObservabilityGeneratorService } from './observability-generator.service';
import { FactoryVerificationService } from './factory-verification.service';
import { FactorySmokeService } from './factory-smoke.service';
import { FactoryCertificationService } from './factory-certification.service';
import { FactoryOrchestratorService } from './factory-orchestrator.service';
import { FactoryIntegrationHubService } from './factory-integration-hub.service';
import { CapabilityFabricIntegrationService } from './capability-fabric-integration.service';
import { KnowledgeFabricIntegrationService } from './knowledge-fabric-integration.service';
import { IntelligenceFabricIntegrationService } from './intelligence-fabric-integration.service';
import { MarketplaceIntegrationService } from './marketplace-integration.service';
import { ProductTemplatesIntegrationService } from './product-templates-integration.service';
import { EnterpriseKernelIntegrationService } from './enterprise-kernel-integration.service';
import { FactoryAuditService } from './factory-audit.service';
import { FactoryIdService } from './factory-id.service';
import { FactoryClockService } from './factory-clock.service';
import { FactoryHealthService } from './factory-health.service';
import { FactoryMetricsService } from './factory-metrics.service';

@Module({
  controllers: [ProductFactoryController],
  providers: [
    ProductFactoryService,
    FactoryRegistryService,
    FactoryTemplateCatalogService,
    FactoryBlueprintService,
    FactoryPipelineService,
    ProductGeneratorService,
    BackendGeneratorService,
    WebGeneratorService,
    MobileGeneratorService,
    DatabaseGeneratorService,
    ApiGeneratorService,
    UiGeneratorService,
    WorkflowGeneratorService,
    DocumentationGeneratorService,
    DeploymentGeneratorService,
    TestingGeneratorService,
    ConfigurationGeneratorService,
    ObservabilityGeneratorService,
    FactoryVerificationService,
    FactorySmokeService,
    FactoryCertificationService,
    FactoryOrchestratorService,
    FactoryIntegrationHubService,
    CapabilityFabricIntegrationService,
    KnowledgeFabricIntegrationService,
    IntelligenceFabricIntegrationService,
    MarketplaceIntegrationService,
    ProductTemplatesIntegrationService,
    EnterpriseKernelIntegrationService,
    FactoryAuditService,
    FactoryIdService,
    FactoryClockService,
    FactoryHealthService,
    FactoryMetricsService,
  ],
  exports: [
    ProductFactoryService,
    FactoryRegistryService,
    FactoryTemplateCatalogService,
    FactoryOrchestratorService,
    FactoryIntegrationHubService,
  ],
})
export class ProductFactoryModule {}