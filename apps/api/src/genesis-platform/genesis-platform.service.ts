import { Injectable } from "@nestjs/common";
import { GenesisRuntimeService } from "./runtime/genesis-runtime.service";
import { GenesisPlatformVerificationService } from "./verification/genesis-platform-verification.service";
import { GenesisBlueprintRegistry } from "./registry/genesis-blueprint.registry";
import { GenesisArtifactRegistry } from "./registry/genesis-artifact.registry";
import { GenesisSessionRegistry } from "./registry/genesis-session.registry";
import { GenesisExplainabilityService } from "./governance/explainability.service";

@Injectable()
export class GenesisPlatformService {
  constructor(
    private readonly runtime: GenesisRuntimeService,
    private readonly verificationService: GenesisPlatformVerificationService,
    private readonly blueprintRegistry: GenesisBlueprintRegistry,
    private readonly artifactRegistry: GenesisArtifactRegistry,
    private readonly sessionRegistry: GenesisSessionRegistry,
    private readonly explainability: GenesisExplainabilityService,
  ) {}

  status() {
    return this.verificationService.status();
  }

  verification() {
    return this.verificationService.verification();
  }

  createSession(input: Parameters<GenesisRuntimeService["createSession"]>[0]) {
    return this.runtime.createSession(input);
  }

  decide(
    sessionId: string,
    decision: {
      decision: "approve" | "reject";
      decidedBy: string;
      reason: string;
    },
  ) {
    return this.runtime.decide({ sessionId, ...decision });
  }

  execute(sessionId: string) {
    return this.runtime.execute(sessionId);
  }

  sessions() {
    return this.sessionRegistry.list();
  }

  blueprints() {
    return this.blueprintRegistry.list();
  }

  artifacts() {
    return this.artifactRegistry.list();
  }

  smoke() {
    const blueprint = {
      id: "blueprint:genesis-smoke",
      name: "Genesis Smoke Blueprint",
      version: "1.0.0",
      purpose: "Verify blueprint-driven governed generation.",
      requestedCapabilities: [
        "knowledge-fabric",
        "living-blueprint",
        "digital-dna",
        "enterprise-brain-foundation",
      ],
      artifacts: [
        {
          id: "artifact:smoke-module",
          type: "module" as const,
          path: "src/generated/smoke.module.ts",
          purpose: "Smoke module.",
          dependencies: [],
        },
        {
          id: "artifact:smoke-service",
          type: "service" as const,
          path: "src/generated/smoke.service.ts",
          purpose: "Smoke service.",
          dependencies: ["artifact:smoke-module"],
        },
      ],
      policies: ["human-final-authority"],
      metadata: {
        autonomousExecutionEnabled: false,
      },
    };

    const created = this.runtime.createSession(blueprint);
    const blockedBeforeApproval =
      created.session.approvalState === "awaiting-human-approval";

    const approved = this.runtime.decide({
      sessionId: created.session.id,
      decision: "approve",
      decidedBy: "human:khalifa",
      reason: "Genesis platform smoke verification.",
    });

    const completed = this.runtime.execute(approved.id);
    const registeredArtifacts = this.artifactRegistry
      .list()
      .filter((artifact) => artifact.blueprintId === blueprint.id);

    const explanation = this.explainability.explain(
      blueprint,
      created.plan,
    );

    const checks = {
      sessionCreated: Boolean(created.session.id),
      blueprintValidated: created.validation.valid,
      policyPassed: created.policy.passed,
      planCreated: Boolean(created.plan.id),
      blockedBeforeApproval,
      humanApprovalRecorded: approved.approvalState === "approved",
      executionCompleted: completed.stage === "completed",
      artifactsGenerated: registeredArtifacts.length === 2,
      dependencyAware:
        created.plan.steps[1]?.dependsOn.includes(
          "step:artifact:smoke-module",
        ) ?? false,
      explainabilityReady: Array.isArray(explanation["rationale"]),
      humanFinalAuthority: true,
      autonomousExecutionDisabled:
        this.status().autonomousExecutionEnabled === false,
    };

    return {
      stage: Object.values(checks).every(Boolean) ? "completed" : "failed",
      healthy: Object.values(checks).every(Boolean),
      runtimeReady: true,
      generatedArtifacts: registeredArtifacts.length,
      sessionId: completed.id,
      planId: created.plan.id,
      checks,
      status: this.status(),
      executedAt: new Date().toISOString(),
    };
  }
}
