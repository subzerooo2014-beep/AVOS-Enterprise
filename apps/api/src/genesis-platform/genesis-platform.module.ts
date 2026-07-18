import { Module } from "@nestjs/common";
import { GenesisPlatformController } from "./genesis-platform.controller";
import { GenesisPlatformService } from "./genesis-platform.service";
import { GenesisBlueprintRegistry } from "./registry/genesis-blueprint.registry";
import { GenesisArtifactRegistry } from "./registry/genesis-artifact.registry";
import { GenesisSessionRegistry } from "./registry/genesis-session.registry";
import { BlueprintLoaderService } from "./blueprint/blueprint-loader.service";
import { BlueprintValidatorService } from "./blueprint/blueprint-validator.service";
import { BlueprintCompilerService } from "./blueprint/blueprint-compiler.service";
import { BlueprintDependencyResolverService } from "./blueprint/blueprint-dependency-resolver.service";
import { GenerationPlannerService } from "./planning/generation-planner.service";
import { ExecutionPlannerService } from "./planning/execution-planner.service";
import { ArtifactGeneratorService } from "./runtime/artifact-generator.service";
import { GenerationPipelineService } from "./runtime/generation-pipeline.service";
import { RollbackManagerService } from "./runtime/rollback-manager.service";
import { GenesisRuntimeService } from "./runtime/genesis-runtime.service";
import { HumanApprovalService } from "./governance/human-approval.service";
import { GenesisPolicyEngineService } from "./governance/policy-engine.service";
import { GenesisExplainabilityService } from "./governance/explainability.service";
import { IntelligenceFoundationIntegration } from "./integration/intelligence-foundation.integration";
import { CapabilityFabricIntegration } from "./integration/capability-fabric.integration";
import { GenesisPlatformVerificationService } from "./verification/genesis-platform-verification.service";

@Module({
  controllers: [GenesisPlatformController],
  providers: [
    GenesisPlatformService,
    GenesisBlueprintRegistry,
    GenesisArtifactRegistry,
    GenesisSessionRegistry,
    BlueprintLoaderService,
    BlueprintValidatorService,
    BlueprintCompilerService,
    BlueprintDependencyResolverService,
    GenerationPlannerService,
    ExecutionPlannerService,
    ArtifactGeneratorService,
    GenerationPipelineService,
    RollbackManagerService,
    GenesisRuntimeService,
    HumanApprovalService,
    GenesisPolicyEngineService,
    GenesisExplainabilityService,
    IntelligenceFoundationIntegration,
    CapabilityFabricIntegration,
    GenesisPlatformVerificationService,
  ],
  exports: [
    GenesisPlatformService,
    GenesisBlueprintRegistry,
    GenesisArtifactRegistry,
    GenesisSessionRegistry,
    GenesisRuntimeService,
  ],
})
export class GenesisPlatformModule {}
