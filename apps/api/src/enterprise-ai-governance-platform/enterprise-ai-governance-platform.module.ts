import { Module } from "@nestjs/common";
import { AiAuditCenterService } from "./ai-audit-center.service";
import { AiComplianceService } from "./ai-compliance.service";
import { AiModelGovernanceRegistryService } from "./ai-model-governance-registry.service";
import { AiModelEvaluationService } from "./ai-model-evaluation.service";
import { AiPolicyRegistryService } from "./ai-policy-registry.service";
import { AiRiskCenterService } from "./ai-risk-center.service";
import { EnterpriseAiGovernancePlatformController } from "./enterprise-ai-governance-platform.controller";
import { EnterpriseAiGovernancePlatformService } from "./enterprise-ai-governance-platform.service";
import { PromptGovernanceService } from "./prompt-governance.service";

@Module({
  controllers: [EnterpriseAiGovernancePlatformController],
  providers: [
    AiAuditCenterService,
    AiComplianceService,
    AiModelGovernanceRegistryService,
    AiModelEvaluationService,
    AiPolicyRegistryService,
    AiRiskCenterService,
    EnterpriseAiGovernancePlatformService,
    PromptGovernanceService,
  ],
  exports: [
    AiAuditCenterService,
    AiComplianceService,
    AiModelGovernanceRegistryService,
    AiModelEvaluationService,
    AiPolicyRegistryService,
    AiRiskCenterService,
    EnterpriseAiGovernancePlatformService,
    PromptGovernanceService,
  ],
})
export class EnterpriseAiGovernancePlatformModule {}
