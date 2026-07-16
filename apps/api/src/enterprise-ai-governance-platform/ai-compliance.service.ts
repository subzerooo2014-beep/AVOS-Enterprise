import { Injectable } from "@nestjs/common";
import { AiModelGovernanceRegistryService } from "./ai-model-governance-registry.service";
import { AiModelEvaluationService } from "./ai-model-evaluation.service";
import { AiPolicyRegistryService } from "./ai-policy-registry.service";
import { AiRiskCenterService } from "./ai-risk-center.service";
import { PromptGovernanceService } from "./prompt-governance.service";
import type { AiComplianceReport } from "./enterprise-ai-governance.types";

@Injectable()
export class AiComplianceService {
  constructor(
    private readonly policies: AiPolicyRegistryService,
    private readonly models: AiModelGovernanceRegistryService,
    private readonly prompts: PromptGovernanceService,
    private readonly evaluations: AiModelEvaluationService,
    private readonly risks: AiRiskCenterService,
  ) {}

  validate(): AiComplianceReport {
    const violations: AiComplianceReport["violations"] = [];

    for (const policy of this.policies.list()) {
      if (!policy.version) {
        violations.push({
          code: "AI_POLICY_VERSION_MISSING",
          component: policy.id,
          message: "AI governance policy version is missing.",
        });
      }
    }

    for (const model of this.models.list()) {
      if (model.status === "ACTIVE" && !model.approved) {
        violations.push({
          code: "AI_MODEL_ACTIVE_NOT_APPROVED",
          component: model.id,
          message: "Active AI model is not approved.",
        });
      }
    }

    for (const prompt of this.prompts.list()) {
      if (prompt.status === "APPROVED" && !prompt.version) {
        violations.push({
          code: "AI_PROMPT_VERSION_MISSING",
          component: prompt.id,
          message: "Approved AI prompt version is missing.",
        });
      }
    }

    for (const evaluation of this.evaluations.list()) {
      if (!evaluation.passed) {
        violations.push({
          code: "AI_MODEL_EVALUATION_FAILED",
          component: evaluation.id,
          message: "AI evaluation did not meet governance thresholds.",
        });
      }
    }

    for (const risk of this.risks.list()) {
      if (
        (risk.level === "HIGH" || risk.level === "CRITICAL") &&
        risk.mitigations.length === 0
      ) {
        violations.push({
          code: "AI_HIGH_RISK_WITHOUT_MITIGATION",
          component: risk.id,
          message: "High-risk AI item has no recorded mitigation.",
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 5),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}
