import { Module } from "@nestjs/common";
import { EnterpriseDecisionController } from "./enterprise-decision.controller";
import { EnterpriseDecisionService } from "./enterprise-decision.service";
import { DecisionPipeline } from "./engines/decision-pipeline";
import { PolicyEngine } from "./engines/policy-engine";
import { ApprovalEngine } from "./engines/approval-engine";
import { DecisionAudit } from "./engines/decision-audit";

@Module({
  controllers: [EnterpriseDecisionController],
  providers: [
    EnterpriseDecisionService,
    DecisionPipeline,
    PolicyEngine,
    ApprovalEngine,
    DecisionAudit,
  ],
  exports: [
    EnterpriseDecisionService,
    DecisionPipeline,
    PolicyEngine,
    ApprovalEngine,
    DecisionAudit,
  ],
})
export class EnterpriseDecisionModule {}
