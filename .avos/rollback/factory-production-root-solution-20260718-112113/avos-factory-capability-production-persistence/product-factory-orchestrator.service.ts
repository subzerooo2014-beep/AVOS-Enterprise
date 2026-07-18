import { Injectable } from "@nestjs/common";
import {
  ProductFactoryRequest,
  ProductFactoryResult,
  ProductFactoryStageResult
} from "./product-factory.contracts";
import { ProductBlueprintCompilerService } from "./product-blueprint-compiler.service";
import { ProductArchitectureComposerService } from "./product-architecture-composer.service";
import { ProductCapabilityAssemblerService } from "./product-capability-assembler.service";
import { ProductExperienceComposerService } from "./product-experience-composer.service";
import { ProductDataContractEngineService } from "./product-data-contract-engine.service";
import { ProductSecurityGovernanceService } from "./product-security-governance.service";
import { ProductDigitalDnaService } from "./product-digital-dna.service";
import { ProductKnowledgeRegistrationService } from "./product-knowledge-registration.service";
import { ProductGenesisIntegrationService } from "./product-genesis-integration.service";
import { ProductQualityCertificationService } from "./product-quality-certification.service";
import { ProductLaunchReadinessService } from "./product-launch-readiness.service";

@Injectable()
export class ProductFactoryOrchestratorService {
  constructor(
    private readonly blueprint: ProductBlueprintCompilerService,
    private readonly architecture: ProductArchitectureComposerService,
    private readonly capabilities: ProductCapabilityAssemblerService,
    private readonly experience: ProductExperienceComposerService,
    private readonly dataContracts: ProductDataContractEngineService,
    private readonly security: ProductSecurityGovernanceService,
    private readonly digitalDna: ProductDigitalDnaService,
    private readonly knowledge: ProductKnowledgeRegistrationService,
    private readonly genesis: ProductGenesisIntegrationService,
    private readonly quality: ProductQualityCertificationService,
    private readonly launch: ProductLaunchReadinessService
  ) {}

  execute(request: ProductFactoryRequest): ProductFactoryResult {
    if (!request.productName?.trim()) {
      throw new Error("Product name is required.");
    }

    if (!request.capabilities?.length) {
      throw new Error("At least one capability is required.");
    }

    const blueprint = this.blueprint.compile(request);
    const architecture = this.architecture.compose({
      productId: blueprint.productId,
      productType: blueprint.productType,
      capabilities: blueprint.capabilities,
      channels: blueprint.channels
    });
    const capabilities = this.capabilities.assemble(
      blueprint.productId,
      blueprint.capabilities
    );
    const experience = this.experience.compose(
      blueprint.productId,
      blueprint.channels
    );
    const dataContracts = this.dataContracts.create(
      blueprint.productId,
      blueprint.capabilities
    );
    const security = this.security.evaluate({
      productId: blueprint.productId,
      approvedBy: request.approvedBy,
      environment: request.targetEnvironment ?? "development"
    });
    const digitalDna = this.digitalDna.create({
      productId: blueprint.productId,
      purpose: blueprint.description,
      capabilities: blueprint.capabilities,
      architectureId: architecture.architectureId
    });
    const knowledge = this.knowledge.register({
      productId: blueprint.productId,
      architectureId: architecture.architectureId,
      digitalDnaId: digitalDna.digitalDnaId,
      capabilities: blueprint.capabilities
    });
    const genesis = this.genesis.prepare({
      productId: blueprint.productId,
      architectureId: architecture.architectureId,
      capabilities: blueprint.capabilities,
      version: blueprint.version
    });
    const quality = this.quality.certify({
      architectureScore: architecture.score,
      capabilityScore: capabilities.score,
      securityScore: security.score,
      digitalDnaScore: digitalDna.score,
      genesisScore: genesis.score
    });
    const launch = this.launch.evaluate({
      productId: blueprint.productId,
      certified: quality.certified,
      approved: security.allowed,
      environment: request.targetEnvironment ?? "development"
    });

    const stages: ProductFactoryStageResult[] = [
      this.stage("product-blueprint", blueprint.score, blueprint),
      this.stage("architecture-composition", architecture.score, architecture),
      this.stage("capability-assembly", capabilities.score, capabilities),
      this.stage("experience-composition", experience.score, experience),
      this.stage("data-contracts", dataContracts.score, dataContracts),
      this.stage("security-governance", security.score, security),
      this.stage("digital-dna", digitalDna.score, digitalDna),
      this.stage("knowledge-registration", knowledge.score, knowledge),
      this.stage("genesis-integration", genesis.score, genesis),
      this.stage("quality-certification", quality.score, quality),
      this.stage("launch-readiness", launch.score, launch),
      this.stage(
        "human-approval",
        security.allowed ? 100 : 0,
        {
          approved: security.allowed,
          approvedBy: request.approvedBy,
          humanFinalAuthority: true,
          autonomousOverrideAllowed: false
        }
      )
    ];

    const success =
      stages.every((stage) => stage.status === "completed") &&
      launch.ready;

    const overallScore = Math.round(
      stages.reduce((sum, stage) => sum + stage.score, 0) /
        stages.length
    );

    return {
      success,
      productId: blueprint.productId,
      productName: blueprint.productName,
      productType: blueprint.productType,
      version: blueprint.version,
      architectureId: architecture.architectureId,
      digitalDnaId: digitalDna.digitalDnaId,
      releaseCandidateId: launch.releaseCandidateId,
      stages,
      overallScore,
      humanFinalAuthority: true,
      completedAt: new Date().toISOString()
    };
  }

  smoke() {
    const result = this.execute({
      productName: "AVOS Product Factory Smoke",
      productType: "multi-channel-product",
      version: "1.0.0",
      description:
        "End-to-end product generation readiness validation",
      capabilities: [
        "identity",
        "catalog",
        "workflow",
        "analytics",
        "notifications"
      ],
      channels: ["api", "web", "mobile"],
      targetEnvironment: "staging",
      approvedBy: "human:khalifa",
      blueprint: {
        foundationFirst: true,
        capabilityFirst: true,
        livingBlueprint: true
      }
    });

    const checks = {
      executionCompleted: result.success,
      allStagesCompleted:
        result.stages.length === 12 &&
        result.stages.every(
          (stage) => stage.status === "completed"
        ),
      scorePerfect: result.overallScore === 100,
      digitalDnaCreated: result.digitalDnaId.startsWith("dna:"),
      releaseCandidateCreated:
        result.releaseCandidateId.startsWith("rc:"),
      humanFinalAuthority: result.humanFinalAuthority === true
    };

    const success = Object.values(checks).every(Boolean);

    return {
      success,
      score: success ? 100 : 0,
      checks,
      result
    };
  }

  health() {
    return {
      status: "healthy",
      score: 100,
      phase: "product-factory-evolution",
      productBlueprintCompiler: true,
      architectureComposer: true,
      capabilityAssembler: true,
      experienceComposer: true,
      dataContractEngine: true,
      securityGovernance: true,
      digitalDna: true,
      knowledgeRegistration: true,
      genesisIntegration: true,
      qualityCertification: true,
      launchReadiness: true,
      humanFinalAuthority: true
    };
  }

  private stage(
    stage: ProductFactoryStageResult["stage"],
    score: number,
    details: Record<string, unknown>
  ): ProductFactoryStageResult {
    return {
      stage,
      status: score >= 90 ? "completed" : "blocked",
      score,
      details
    };
  }
}
