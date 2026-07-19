import { Module } from '@nestjs/common';
import { ArchitectureGeneratorService } from './architecture-generator.service';
import { BackendCodeGeneratorService } from './backend-code-generator.service';
import { DatabaseApiCompilerService } from './database-api-compiler.service';
import { DeploymentFactoryService } from './deployment-factory.service';
import { FilesystemWriterService } from './filesystem-writer.service';
import { FrontendGeneratorService } from './frontend-generator.service';
import { ProductCompilerCoreService } from './product-compiler-core.service';
import { ProductGenerationController } from './product-generation.controller';
import { ProductGenerationOrchestratorService } from './product-generation-orchestrator.service';
import { ProductGenerationStore } from './product-generation.store';
import { RuntimeIntegrationCertificationService } from './runtime-integration-certification.service';
import { TestRepairEngineService } from './test-repair-engine.service';

@Module({
  controllers: [ProductGenerationController],
  providers: [
    ProductGenerationStore,
    FilesystemWriterService,
    ProductCompilerCoreService,
    ArchitectureGeneratorService,
    BackendCodeGeneratorService,
    DatabaseApiCompilerService,
    FrontendGeneratorService,
    TestRepairEngineService,
    DeploymentFactoryService,
    RuntimeIntegrationCertificationService,
    ProductGenerationOrchestratorService,
  ],
  exports: [
    ProductCompilerCoreService,
    ArchitectureGeneratorService,
    BackendCodeGeneratorService,
    DatabaseApiCompilerService,
    FrontendGeneratorService,
    TestRepairEngineService,
    DeploymentFactoryService,
    RuntimeIntegrationCertificationService,
    ProductGenerationOrchestratorService,
  ],
})
export class ProductGenerationModule {}