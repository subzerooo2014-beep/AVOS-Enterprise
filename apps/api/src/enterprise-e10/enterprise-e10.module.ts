import { Module } from "@nestjs/common";
import { EnterpriseE10Controller } from "./enterprise-e10.controller";
import { EnterpriseE10OrchestratorService } from "./enterprise-e10-orchestrator.service";
import { EnterpriseValueActionService } from "./enterprise-value-action.service";
import { EnterpriseValueGovernanceService } from "./enterprise-value-governance.service";
import { EnterpriseValueLeakageService } from "./enterprise-value-leakage.service";
import { EnterpriseValueOpportunityService } from "./enterprise-value-opportunity.service";
import { EnterpriseValueOrchestratorService } from "./enterprise-value-orchestrator.service";
import { EnterpriseValueOutcomeService } from "./enterprise-value-outcome.service";

@Module({
  controllers: [EnterpriseE10Controller],
  providers: [
    EnterpriseValueOpportunityService,
    EnterpriseValueOutcomeService,
    EnterpriseValueLeakageService,
    EnterpriseValueActionService,
    EnterpriseValueGovernanceService,
    EnterpriseValueOrchestratorService,
    EnterpriseE10OrchestratorService,
  ],
  exports: [
    EnterpriseValueOpportunityService,
    EnterpriseValueOutcomeService,
    EnterpriseValueLeakageService,
    EnterpriseValueActionService,
    EnterpriseValueGovernanceService,
    EnterpriseValueOrchestratorService,
    EnterpriseE10OrchestratorService,
  ],
})
export class EnterpriseE10Module {}