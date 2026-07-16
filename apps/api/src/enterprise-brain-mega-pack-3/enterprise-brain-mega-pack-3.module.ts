import { Module } from "@nestjs/common";
import { EnterpriseBrainMegaPack3Controller } from "./enterprise-brain-mega-pack-3.controller";
import { EnterpriseBrainMegaPack3Service } from "./enterprise-brain-mega-pack-3.service";
import { BrainReasoningAuditService } from "./observability/brain-reasoning-audit.service";
import { BrainRuleRegistryService } from "./reasoning/brain-rule-registry.service";
import { BrainConstraintEngineService } from "./constraints/brain-constraint-engine.service";
import { BrainCausalGraphService } from "./causal/brain-causal-graph.service";
import { BrainDecisionGraphService } from "./decision-graph/brain-decision-graph.service";
import { BrainReasoningEngineService } from "./reasoning/brain-reasoning-engine.service";
import { BrainPlanningEngineService } from "./planning/brain-planning-engine.service";
import { BrainRecoveryPlannerService } from "./recovery/brain-recovery-planner.service";
import { BrainReasoningPlanningHealthService } from "./health/brain-reasoning-planning-health.service";

@Module({
  controllers: [EnterpriseBrainMegaPack3Controller],
  providers: [
    EnterpriseBrainMegaPack3Service,
    BrainReasoningAuditService,
    BrainRuleRegistryService,
    BrainConstraintEngineService,
    BrainCausalGraphService,
    BrainDecisionGraphService,
    BrainReasoningEngineService,
    BrainPlanningEngineService,
    BrainRecoveryPlannerService,
    BrainReasoningPlanningHealthService
  ],
  exports: [
    EnterpriseBrainMegaPack3Service,
    BrainReasoningAuditService,
    BrainRuleRegistryService,
    BrainConstraintEngineService,
    BrainCausalGraphService,
    BrainDecisionGraphService,
    BrainReasoningEngineService,
    BrainPlanningEngineService,
    BrainRecoveryPlannerService,
    BrainReasoningPlanningHealthService
  ]
})
export class EnterpriseBrainMegaPack3Module {}
