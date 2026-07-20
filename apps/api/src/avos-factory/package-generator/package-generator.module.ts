import { Module } from '@nestjs/common';
import { PackageGeneratorCertificationService } from './certification/package-generator-certification.service';
import { PackageGeneratorCommandRunnerService } from './execution/package-generator-command-runner.service';
import { PackageGeneratorBuildPipelineService } from './execution/package-generator-build-pipeline.service';
import { PackageGeneratorFilesystemService } from './filesystem/package-generator-filesystem.service';
import { PackageGeneratorEngineService } from './generator/package-generator-engine.service';
import { PackageGeneratorController } from './package-generator.controller';
import { PackageGeneratorOrchestratorService } from './package-generator-orchestrator.service';
import { NestModuleRegistrationService } from './registration/nest-module-registration.service';
import { PackageGeneratorRegistryService } from './registry/package-generator-registry.service';
import { PackageGeneratorRollbackService } from './rollback/package-generator-rollback.service';
import { AeosMegaPack2BlueprintService } from './templates/aeos-mega-pack-2-blueprint.service';
import { PackageGeneratorInputValidatorService } from './validation/package-generator-input-validator.service';
import { TypescriptSourceValidatorService } from './validation/typescript-source-validator.service';

@Module({
  controllers: [PackageGeneratorController],
  providers: [PackageGeneratorInputValidatorService, TypescriptSourceValidatorService, PackageGeneratorFilesystemService, PackageGeneratorRollbackService, NestModuleRegistrationService, PackageGeneratorCommandRunnerService, PackageGeneratorBuildPipelineService, PackageGeneratorRegistryService, PackageGeneratorEngineService, PackageGeneratorCertificationService, AeosMegaPack2BlueprintService, PackageGeneratorOrchestratorService],
  exports: [PackageGeneratorOrchestratorService, PackageGeneratorEngineService],
})
export class PackageGeneratorModule {}
