import { Module } from "@nestjs/common";
import { EnterpriseBrainMegaPack1Controller } from "./enterprise-brain-mega-pack-1.controller";
import { EnterpriseBrainMegaPack1Service } from "./enterprise-brain-mega-pack-1.service";
import { BrainAuditService } from "./observability/brain-audit.service";
import { BrainRuntimeService } from "./runtime/brain-runtime.service";
import { BrainSessionService } from "./sessions/brain-session.service";
import { BrainContextService } from "./context/brain-context.service";
import { BrainIntentService } from "./intent/brain-intent.service";
import { BrainGoalService } from "./goals/brain-goal.service";
import { BrainDecisionService } from "./decisions/brain-decision.service";
import { BrainRegistryService } from "./registry/brain-registry.service";
import { BrainHealthService } from "./health/brain-health.service";

@Module({
  controllers: [EnterpriseBrainMegaPack1Controller],
  providers: [
    EnterpriseBrainMegaPack1Service,
    BrainAuditService,
    BrainRuntimeService,
    BrainSessionService,
    BrainContextService,
    BrainIntentService,
    BrainGoalService,
    BrainDecisionService,
    BrainRegistryService,
    BrainHealthService
  ],
  exports: [
    EnterpriseBrainMegaPack1Service,
    BrainAuditService,
    BrainRuntimeService,
    BrainSessionService,
    BrainContextService,
    BrainIntentService,
    BrainGoalService,
    BrainDecisionService,
    BrainRegistryService,
    BrainHealthService
  ]
})
export class EnterpriseBrainMegaPack1Module {}
