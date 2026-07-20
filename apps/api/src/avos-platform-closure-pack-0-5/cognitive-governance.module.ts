import { Module } from '@nestjs/common';
import { AICouncilService } from './ai-council.service';
import { CognitiveGovernanceController } from './cognitive-governance.controller';
import { CognitiveGovernanceService } from './cognitive-governance.service';
import { EnterprisePolicyIntelligenceService } from './enterprise-policy-intelligence.service';
import { HumanApprovalGateService } from './human-approval-gate.service';
import { LivingVisionGovernanceService } from './living-vision-governance.service';
import { OrganizationReadinessService } from './organization-readiness.service';
import { ThinkingConstitutionService } from './thinking-constitution.service';

@Module({
  controllers: [CognitiveGovernanceController],
  providers: [
    ThinkingConstitutionService,
    LivingVisionGovernanceService,
    OrganizationReadinessService,
    EnterprisePolicyIntelligenceService,
    AICouncilService,
    HumanApprovalGateService,
    CognitiveGovernanceService,
  ],
  exports: [
    CognitiveGovernanceService,
    ThinkingConstitutionService,
    LivingVisionGovernanceService,
    OrganizationReadinessService,
  ],
})
export class CognitiveGovernanceModule {}