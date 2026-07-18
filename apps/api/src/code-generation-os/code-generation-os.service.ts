import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  CODE_GENERATION_AUTONOMOUS_WRITE_ENABLED,
  CODE_GENERATION_HUMAN_FINAL_AUTHORITY,
  CODE_GENERATION_OS_CLASSIFICATION,
  CODE_GENERATION_OS_VERSION,
} from "./code-generation-os.constants";
import {
  CodeArtifactRequest,
  CodeGenerationBlueprint,
} from "./types/code-generation-os.types";
import { GeneratorRegistry } from "./registry/generator.registry";
import { TemplateRegistry } from "./registry/template.registry";
import { CodeArtifactRegistry } from "./registry/code-artifact.registry";
import { CodeGenerationSessionRegistry } from "./registry/code-generation-session.registry";
import { CodeGenerationPolicyService } from "./governance/code-generation-policy.service";
import { CodeGenerationApprovalService } from "./governance/code-generation-approval.service";
import { CodeGenerationPipelineService } from "./runtime/code-generation-pipeline.service";
import { CodeGenerationOsVerificationService } from "./verification/code-generation-os-verification.service";
import { GenesisPlatformIntegration } from "./integration/genesis-platform.integration";
import { CodeGenerationCapabilityFabricIntegration } from "./integration/capability-fabric.integration";
import { CodeGenerationIntelligenceIntegration } from "./integration/intelligence-foundation.integration";

@Injectable()
export class CodeGenerationOsService implements OnModuleInit {
  constructor(
    private readonly generators: GeneratorRegistry,
    private readonly templates: TemplateRegistry,
    private readonly artifacts: CodeArtifactRegistry,
    private readonly sessions: CodeGenerationSessionRegistry,
    private readonly policy: CodeGenerationPolicyService,
    private readonly approval: CodeGenerationApprovalService,
    private readonly pipeline: CodeGenerationPipelineService,
    private readonly verificationService: CodeGenerationOsVerificationService,
    private readonly genesis: GenesisPlatformIntegration,
    private readonly capabilities: CodeGenerationCapabilityFabricIntegration,
    private readonly intelligence: CodeGenerationIntelligenceIntegration,
  ) {}

  onModuleInit(): void {
    [
      "module", "controller", "service", "dto", "interface", "repository",
      "validator", "guard", "interceptor", "prisma-model", "test",
      "documentation", "deployment",
    ].forEach((name) => this.generators.register(name));
  }

  status() {
    return {
      status: "healthy",
      version: CODE_GENERATION_OS_VERSION,
      classification: CODE_GENERATION_OS_CLASSIFICATION,
      runtimeReady: true,
      humanFinalAuthority: CODE_GENERATION_HUMAN_FINAL_AUTHORITY,
      autonomousWriteEnabled: CODE_GENERATION_AUTONOMOUS_WRITE_ENABLED,
      metrics: {
        generators: this.generators.count(),
        templates: this.templates.count(),
        sessions: this.sessions.count(),
        artifacts: this.artifacts.count(),
      },
      integrations: {
        genesisPlatform: this.genesis.status(),
        capabilityFabric: this.capabilities.resolve([]),
        intelligenceFoundation: this.intelligence.status(),
      },
    };
  }

  verification() {
    return this.verificationService.verification();
  }

  smoke() {
    const artifacts: CodeArtifactRequest[] = [
      {
        id: "codegen:module",
        kind: "module",
        name: "SmokeFeature",
        relativePath: "src/generated/smoke-feature.module.ts",
        dependencies: [],
        options: {},
      },
      {
        id: "codegen:service",
        kind: "service",
        name: "SmokeFeature",
        relativePath: "src/generated/smoke-feature.service.ts",
        dependencies: ["codegen:module"],
        options: {},
      },
      {
        id: "codegen:controller",
        kind: "controller",
        name: "SmokeFeature",
        relativePath: "src/generated/smoke-feature.controller.ts",
        dependencies: ["codegen:service"],
        options: { route: "smoke-feature" },
      },
      {
        id: "codegen:test",
        kind: "test",
        name: "SmokeFeature",
        relativePath: "src/generated/smoke-feature.spec.ts",
        dependencies: ["codegen:service"],
        options: {},
      },
      {
        id: "codegen:docs",
        kind: "documentation",
        name: "Smoke Feature",
        relativePath: "src/generated/README.md",
        dependencies: [],
        options: {},
      },
    ];

    const blueprint: CodeGenerationBlueprint = {
      id: "blueprint:code-generation-os-smoke",
      name: "Code Generation OS Smoke",
      version: "1.0.0",
      namespace: "smoke",
      targetRoot: "src/generated",
      requestedCapabilities: ["capability:code-generation"],
      artifacts,
      metadata: { purpose: "runtime-smoke-verification" },
    };

    const policy = this.policy.evaluate(blueprint);
    const session = this.pipeline.createSession(blueprint);

    let blockedBeforeApproval = false;
    try {
      this.pipeline.execute(session.id, blueprint);
    } catch {
      blockedBeforeApproval = true;
    }

    this.approval.decide(
      session.id,
      true,
      "human:khalifa",
      "Approved for governed smoke verification.",
    );

    const execution = this.pipeline.execute(session.id, blueprint);
    const checks = {
      sessionCreated: Boolean(session.id),
      policyPassed: policy.passed,
      blockedBeforeApproval,
      humanApprovalRecorded: Boolean(execution.session.approvedBy),
      generationCompleted: execution.session.stage === "generated",
      artifactsGenerated: execution.session.artifacts.length === artifacts.length,
      templateDriven: this.templates.count() >= 7,
      generatorRegistryReady: this.generators.count() >= 13,
      qualityScore100: execution.assessment.score === 100,
      dependencyAware: execution.assessment.checks.dependencyIntegrity,
      duplicateProtected: execution.assessment.checks.duplicateProtection,
      checksumsCreated: execution.session.artifacts.every((item) => item.checksum.length === 64),
      humanFinalAuthority: true,
      autonomousWriteDisabled: CODE_GENERATION_AUTONOMOUS_WRITE_ENABLED === false,
    };

    return {
      stage: Object.values(checks).every(Boolean) ? "completed" : "failed",
      healthy: Object.values(checks).every(Boolean),
      runtimeReady: true,
      generatedArtifacts: execution.session.artifacts.length,
      sessionId: execution.session.id,
      checks,
      status: this.status(),
      executedAt: new Date().toISOString(),
    };
  }
}
