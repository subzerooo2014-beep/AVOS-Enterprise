import { Module } from "@nestjs/common";
import { CodeGenerationOsService } from "./code-generation-os.service";
import { CodeGenerationOsController } from "./code-generation-os.controller";
import { TemplateRegistry } from "./registry/template.registry";
import { GeneratorRegistry } from "./registry/generator.registry";
import { CodeArtifactRegistry } from "./registry/code-artifact.registry";
import { CodeGenerationSessionRegistry } from "./registry/code-generation-session.registry";
import { TemplateEngineService } from "./template/template-engine.service";
import { TemplateCompilerService } from "./template/template-compiler.service";
import { TemplateResolverService } from "./template/template-resolver.service";
import { DefaultTemplatesService } from "./template/default-templates.service";
import { ModuleGeneratorService } from "./generators/module-generator.service";
import { ControllerGeneratorService } from "./generators/controller-generator.service";
import { ServiceGeneratorService } from "./generators/service-generator.service";
import { DtoGeneratorService } from "./generators/dto-generator.service";
import { InterfaceGeneratorService } from "./generators/interface-generator.service";
import { RepositoryGeneratorService } from "./generators/repository-generator.service";
import { ValidatorGeneratorService } from "./generators/validator-generator.service";
import { GuardGeneratorService } from "./generators/guard-generator.service";
import { InterceptorGeneratorService } from "./generators/interceptor-generator.service";
import { PrismaModelGeneratorService } from "./generators/prisma-model-generator.service";
import { TestGeneratorService } from "./generators/test-generator.service";
import { DocumentationGeneratorService } from "./generators/documentation-generator.service";
import { DeploymentGeneratorService } from "./generators/deployment-generator.service";
import { NamingQualityService } from "./quality/naming-quality.service";
import { DependencyQualityService } from "./quality/dependency-quality.service";
import { DuplicateQualityService } from "./quality/duplicate-quality.service";
import { CodeQualityEngineService } from "./quality/code-quality-engine.service";
import { CodeGenerationPolicyService } from "./governance/code-generation-policy.service";
import { CodeGenerationApprovalService } from "./governance/code-generation-approval.service";
import { GenesisPlatformIntegration } from "./integration/genesis-platform.integration";
import { CodeGenerationCapabilityFabricIntegration } from "./integration/capability-fabric.integration";
import { CodeGenerationIntelligenceIntegration } from "./integration/intelligence-foundation.integration";
import { ChecksumService } from "./runtime/checksum.service";
import { CodeArtifactFactoryService } from "./runtime/code-artifact-factory.service";
import { CodeGenerationPipelineService } from "./runtime/code-generation-pipeline.service";
import { CodeGenerationOsVerificationService } from "./verification/code-generation-os-verification.service";

@Module({
  controllers: [CodeGenerationOsController],
  providers: [
    CodeGenerationOsService,
    TemplateRegistry,
    GeneratorRegistry,
    CodeArtifactRegistry,
    CodeGenerationSessionRegistry,
    TemplateEngineService,
    TemplateCompilerService,
    TemplateResolverService,
    DefaultTemplatesService,
    ModuleGeneratorService,
    ControllerGeneratorService,
    ServiceGeneratorService,
    DtoGeneratorService,
    InterfaceGeneratorService,
    RepositoryGeneratorService,
    ValidatorGeneratorService,
    GuardGeneratorService,
    InterceptorGeneratorService,
    PrismaModelGeneratorService,
    TestGeneratorService,
    DocumentationGeneratorService,
    DeploymentGeneratorService,
    NamingQualityService,
    DependencyQualityService,
    DuplicateQualityService,
    CodeQualityEngineService,
    CodeGenerationPolicyService,
    CodeGenerationApprovalService,
    GenesisPlatformIntegration,
    CodeGenerationCapabilityFabricIntegration,
    CodeGenerationIntelligenceIntegration,
    ChecksumService,
    CodeArtifactFactoryService,
    CodeGenerationPipelineService,
    CodeGenerationOsVerificationService
  ],
  exports: [CodeGenerationOsService],
})
export class CodeGenerationOsModule {}
