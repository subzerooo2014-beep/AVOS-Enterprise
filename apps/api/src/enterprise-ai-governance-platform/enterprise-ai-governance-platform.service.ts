import { Injectable } from "@nestjs/common";
import { AiAuditCenterService } from "./ai-audit-center.service";
import { AiComplianceService } from "./ai-compliance.service";
import { AiModelGovernanceRegistryService } from "./ai-model-governance-registry.service";
import { AiModelEvaluationService } from "./ai-model-evaluation.service";
import { AiPolicyRegistryService } from "./ai-policy-registry.service";
import { AiRiskCenterService } from "./ai-risk-center.service";
import { PromptGovernanceService } from "./prompt-governance.service";
import type {
  AiGovernanceHealth,
  AiGovernanceMetrics,
} from "./enterprise-ai-governance.types";

@Injectable()
export class EnterpriseAiGovernancePlatformService {
  constructor(
    private readonly policies: AiPolicyRegistryService,
    private readonly models: AiModelGovernanceRegistryService,
    private readonly prompts: PromptGovernanceService,
    private readonly evaluations: AiModelEvaluationService,
    private readonly risks: AiRiskCenterService,
    private readonly audits: AiAuditCenterService,
    private readonly compliance: AiComplianceService,
  ) {}

  metrics(): AiGovernanceMetrics {
    return {
      policies: this.policies.count(),
      models: this.models.count(),
      approvedModels: this.models.approvedCount(),
      prompts: this.prompts.count(),
      approvedPrompts: this.prompts.approvedCount(),
      evaluations: this.evaluations.count(),
      failedEvaluations: this.evaluations.failedCount(),
      riskAssessments: this.risks.count(),
      highRiskItems: this.risks.highRiskCount(),
      audits: this.audits.count(),
    };
  }

  health(): AiGovernanceHealth {
    const metrics = this.metrics();
    const compliance = this.compliance.validate();

    return {
      success: true,
      system: "AVOS Enterprise AI Governance Platform",
      version: "1.0.0",
      status:
        compliance.compliant &&
        metrics.failedEvaluations === 0 &&
        metrics.highRiskItems === 0
          ? "READY"
          : "DEGRADED",
      metrics,
      components: {
        aiPolicyRegistry: "READY",
        aiModelRegistry: "READY",
        promptGovernance: "READY",
        modelEvaluation: "READY",
        aiAudit: "READY",
        aiRiskCenter: "READY",
        aiCompliance: compliance.compliant ? "READY" : "DEGRADED",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      policies: this.policies.list(),
      models: this.models.list(),
      prompts: this.prompts.list(),
      evaluations: this.evaluations.list(),
      risks: this.risks.list(),
      audits: this.audits.list(),
      compliance: this.compliance.validate(),
    };
  }
}
