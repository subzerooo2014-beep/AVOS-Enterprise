import { Module } from "@nestjs/common";
import { FactoryEventsModule } from "../events/events.module";
import { FactoryGenerationModule } from "../generation/generation.module";
import { AutonomousSoftwareFactoryService } from "./autonomous-factory.service";
import { FactoryArchitectureGeneratorService } from "./architecture-generator.service";
import { FactoryBlueprintCompilerService } from "./blueprint-compiler.service";
import { FactoryCapabilityComposerService } from "./capability-composer.service";
import { FactoryCodeQualityEngineService } from "./code-quality-engine.service";
import { FactoryDependencyResolverService } from "./dependency-resolver.service";
import { FactoryProductionCertificationService } from "./production-certification.service";
import { FactoryTemplateIntelligenceService } from "./template-intelligence.service";

@Module({
  imports: [
    FactoryGenerationModule,
    FactoryEventsModule,
  ],
  providers: [
    AutonomousSoftwareFactoryService,
    FactoryArchitectureGeneratorService,
    FactoryBlueprintCompilerService,
    FactoryCapabilityComposerService,
    FactoryCodeQualityEngineService,
    FactoryDependencyResolverService,
    FactoryProductionCertificationService,
    FactoryTemplateIntelligenceService,
  ],
  exports: [
    AutonomousSoftwareFactoryService,
    FactoryArchitectureGeneratorService,
    FactoryBlueprintCompilerService,
    FactoryCapabilityComposerService,
    FactoryCodeQualityEngineService,
    FactoryDependencyResolverService,
    FactoryProductionCertificationService,
    FactoryTemplateIntelligenceService,
  ],
})
export class FactoryAutonomousModule {}
