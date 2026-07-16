import { Module } from "@nestjs/common";
import { FoundationCompletionPack6Controller } from "./foundation-completion-pack-6.controller";
import { FoundationCompletionPack6Service } from "./foundation-completion-pack-6.service";
import { EventContractRegistryService } from "./contracts/event-contract-registry.service";
import { EnterpriseEventBackboneService } from "./events/enterprise-event-backbone.service";
import { EventSubscriptionRegistryService } from "./subscriptions/event-subscription-registry.service";
import { EnterpriseEventRouterService } from "./routing/enterprise-event-router.service";
import { AutonomousOrchestrationPlanService } from "./orchestration/autonomous-orchestration-plan.service";
import { AutonomousOrchestrationRuntimeService } from "./execution/autonomous-orchestration-runtime.service";
import { HumanApprovalGateService } from "./approval/human-approval-gate.service";
import { DeadLetterQueueService } from "./recovery/dead-letter-queue.service";
import { NervousSystemTraceService } from "./observability/nervous-system-trace.service";

@Module({
  controllers: [FoundationCompletionPack6Controller],
  providers: [
    FoundationCompletionPack6Service,
    EventContractRegistryService,
    EnterpriseEventBackboneService,
    EventSubscriptionRegistryService,
    EnterpriseEventRouterService,
    AutonomousOrchestrationPlanService,
    AutonomousOrchestrationRuntimeService,
    HumanApprovalGateService,
    DeadLetterQueueService,
    NervousSystemTraceService
  ],
  exports: [
    FoundationCompletionPack6Service,
    EventContractRegistryService,
    EnterpriseEventBackboneService,
    EventSubscriptionRegistryService,
    EnterpriseEventRouterService,
    AutonomousOrchestrationPlanService,
    AutonomousOrchestrationRuntimeService,
    HumanApprovalGateService,
    DeadLetterQueueService,
    NervousSystemTraceService
  ]
})
export class FoundationCompletionPack6Module {}
