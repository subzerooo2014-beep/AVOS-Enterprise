import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactorySecuritySmokeReport
} from "./avos-factory-security.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactorySecurityPolicyRegistryService
} from "./avos-factory-security-policy-registry.service";
import {
  AvosFactoryPolicyEvaluationService
} from "./avos-factory-policy-evaluation.service";
import {
  AvosFactorySecurityAssessmentService
} from "./avos-factory-security-assessment.service";
import {
  AvosFactoryPolicyExceptionService
} from "./avos-factory-policy-exception.service";

@Injectable()
export class AvosFactorySecuritySmokeService {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly policies: AvosFactorySecurityPolicyRegistryService,
    private readonly evaluation: AvosFactoryPolicyEvaluationService,
    private readonly assessment: AvosFactorySecurityAssessmentService,
    private readonly exceptions: AvosFactoryPolicyExceptionService
  ) {}

  run(): AvosFactorySecuritySmokeReport {
    const subjectId = `part-15-smoke:${Date.now()}`;

    this.analyzer.analyze({
      subjectId,
      actor: "system:part-15-smoke",
      source: "smoke",
      success: true,
      durationMs: 800,
      filesGenerated: 8,
      warnings: [],
      failures: [],
      reusedCapabilities: [
        "capability:factory-security",
        "capability:factory-policy"
      ],
      templateId: "template:security-smoke",
      blueprintId: "blueprint:security-smoke",
      quality: {
        architecture: 95,
        maintainability: 92,
        scalability: 91,
        security: 98,
        documentation: 90,
        reliability: 94,
        reuse: 93
      }
    });

    const validationDecision = this.evaluation.evaluate({
      actor: "system:part-15-smoke",
      resourceType: "factory-project",
      resourceId: subjectId,
      action: "validate",
      environment: "test"
    });

    const productionDecision = this.evaluation.evaluate({
      actor: "system:part-15-smoke",
      resourceType: "factory-project",
      resourceId: subjectId,
      action: "generate",
      environment: "production"
    });

    const securityAssessment = this.assessment.assess({
      subjectId,
      actor: "system:part-15-smoke",
      secretsDetected: 0,
      vulnerableDependencies: 0,
      insecureConfigurations: 0,
      privilegedOperations: 0,
      governanceScore: 100
    });

    const policy = this.policies.list(true).find(
      (item) => item.effect === "require-approval"
    );

    const exception = policy
      ? this.exceptions.request({
          policyId: policy.id,
          subjectId,
          reason: "Smoke verification only.",
          requestedBy: "system:part-15-smoke"
        })
      : undefined;

    const checks = {
      policyRegistry: this.policies.list(true).length >= 4,
      policyEvaluationAllow: validationDecision.allowed,
      productionApprovalRequired:
        productionDecision.effect === "require-approval" &&
        productionDecision.requiresHumanApproval,
      securityAssessment: securityAssessment.passed,
      zeroCriticalFindings: securityAssessment.criticalFindings === 0,
      exceptionWorkflow: exception?.status === "pending",
      humanFinalAuthority:
        exception?.humanApproved === false &&
        exception?.approvedBy === undefined
    };

    const blockingFindings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      id: randomUUID(),
      success: score === 100 && blockingFindings.length === 0,
      score,
      checks,
      blockingFindings,
      generatedAt: new Date().toISOString()
    };
  }
}
