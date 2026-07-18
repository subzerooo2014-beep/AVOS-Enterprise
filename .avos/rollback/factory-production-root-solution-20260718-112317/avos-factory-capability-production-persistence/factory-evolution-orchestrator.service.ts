import { Injectable } from "@nestjs/common";
import {
  FactoryEvolutionRequest,
  FactoryEvolutionResult,
  FactoryEvolutionStageResult
} from "./factory-evolution.contracts";
import { BlueprintCompilerService } from "./blueprint-compiler.service";
import { PipelineTemplateRegistryService } from "./pipeline-template-registry.service";
import { ProductionPolicyEngineService } from "./production-policy-engine.service";
import { ArchitectureValidationEngineService } from "./architecture-validation-engine.service";
import { DependencyPlanEngineService } from "./dependency-plan-engine.service";
import { QualityGateEngineService } from "./quality-gate-engine.service";
import { TestStrategyPlannerService } from "./test-strategy-planner.service";
import { DocumentationComposerService } from "./documentation-composer.service";
import { ReleaseManifestEngineService } from "./release-manifest-engine.service";
import { DeploymentReadinessEngineService } from "./deployment-readiness-engine.service";
import { RollbackStrategyEngineService } from "./rollback-strategy-engine.service";
import { HumanApprovalGateService } from "./human-approval-gate.service";

@Injectable()
export class FactoryEvolutionOrchestratorService {
  constructor(
    private readonly blueprintCompiler: BlueprintCompilerService,
    private readonly templates: PipelineTemplateRegistryService,
    private readonly policies: ProductionPolicyEngineService,
    private readonly architecture:
      ArchitectureValidationEngineService,
    private readonly dependencyPlanner:
      DependencyPlanEngineService,
    private readonly quality: QualityGateEngineService,
    private readonly tests: TestStrategyPlannerService,
    private readonly documentation: DocumentationComposerService,
    private readonly releaseManifest:
      ReleaseManifestEngineService,
    private readonly deployment:
      DeploymentReadinessEngineService,
    private readonly rollback:
      RollbackStrategyEngineService,
    private readonly approvals: HumanApprovalGateService
  ) {}

  execute(
    request: FactoryEvolutionRequest
  ): FactoryEvolutionResult {
    if (!request.capabilityName?.trim()) {
      throw new Error("Capability name is required.");
    }

    const capabilityName = request.capabilityName.trim();
    const version = request.version?.trim() || "1.0.0";
    const environment =
      request.targetEnvironment ?? "development";
    const dependencies = request.dependencies ?? [];

    const blueprint = this.blueprintCompiler.compile(request);
    const template = this.templates.resolve();
    const policy = this.policies.evaluate(request);
    const architecture = this.architecture.validate({
      capabilityName,
      dependencies
    });
    const dependencyPlan = this.dependencyPlanner.plan(
      capabilityName,
      architecture.normalizedDependencies
    );
    const quality = this.quality.evaluate({
      architectureScore: architecture.score,
      policyScore: policy.score,
      blueprintScore: blueprint.score
    });
    const testStrategy = this.tests.create(capabilityName);
    const documentation = this.documentation.compose({
      capabilityName,
      version,
      dependencies:
        architecture.normalizedDependencies
    });
    const releaseManifest = this.releaseManifest.create({
      capabilityName,
      version,
      environment
    });
    const rollback = this.rollback.create(
      capabilityName,
      version
    );
    const approval = this.approvals.verify(
      request.approvedBy
    );
    const deployment = this.deployment.evaluate({
      qualityPassed: quality.passed,
      policyAllowed: policy.allowed && approval.approved,
      architectureValid: architecture.valid
    });

    const stages: FactoryEvolutionStageResult[] = [
      this.stage("blueprint-compilation", blueprint.score, blueprint),
      this.stage("pipeline-planning", 100, template),
      this.stage("policy-evaluation", policy.score, policy),
      this.stage("architecture-validation", architecture.score, architecture),
      this.stage("dependency-planning", dependencyPlan.score, dependencyPlan),
      this.stage("quality-gates", quality.score, quality),
      this.stage("test-strategy", testStrategy.score, testStrategy),
      this.stage("documentation", documentation.score, documentation),
      this.stage("release-manifest", releaseManifest.score, releaseManifest),
      this.stage("deployment-readiness", deployment.score, deployment),
      this.stage("rollback-strategy", rollback.score, rollback),
      this.stage("human-approval", approval.score, approval)
    ];

    const success =
      stages.every((stage) => stage.status === "completed") &&
      deployment.ready &&
      approval.approved;

    const overallScore = Math.round(
      stages.reduce((total, stage) => total + stage.score, 0) /
        stages.length
    );

    return {
      success,
      id: `factory-evolution:${Date.now()}`,
      capabilityName,
      version,
      targetEnvironment: environment,
      stages,
      overallScore,
      humanFinalAuthority: true,
      completedAt: new Date().toISOString()
    };
  }

  smoke() {
    const result = this.execute({
      capabilityName: "factory-ultra-smoke",
      version: "1.0.0",
      description:
        "Unified Mega Packs 3, 4 and 5 smoke capability",
      blueprint: {
        capabilityFirst: true,
        foundationFirst: true
      },
      dependencies: [
        "capability-production-persistence"
      ],
      targetEnvironment: "staging",
      approvedBy: "human:khalifa"
    });

    const checks = {
      executionCompleted: result.success,
      allStagesCompleted:
        result.stages.length === 12 &&
        result.stages.every(
          (stage) => stage.status === "completed"
        ),
      scorePerfect: result.overallScore === 100,
      humanFinalAuthority:
        result.humanFinalAuthority === true,
      releaseReady:
        result.stages.some(
          (stage) =>
            stage.stage === "deployment-readiness" &&
            stage.score === 100
        )
    };

    const success =
      Object.values(checks).every(Boolean);

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
      megaPack3: true,
      megaPack4: true,
      megaPack5: true,
      blueprintCompilation: true,
      architectureIntelligence: true,
      qualityGovernance: true,
      releaseOrchestration: true,
      deploymentReadiness: true,
      rollbackStrategy: true,
      humanFinalAuthority: true
    };
  }

  private stage(
    stage: FactoryEvolutionStageResult["stage"],
    score: number,
    details: Record<string, unknown>
  ): FactoryEvolutionStageResult {
    return {
      stage,
      status: score >= 90 ? "completed" : "blocked",
      score,
      details
    };
  }
}
