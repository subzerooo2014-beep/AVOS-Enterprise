import { Module } from "@nestjs/common";
import { FoundationConfigurationV1Service } from "./foundation-configuration-v1.service";
import { FoundationControlAutomationPlatformV1Controller } from "./foundation-control-automation-platform-v1.controller";
import { FoundationControlAutomationPlatformV1Service } from "./foundation-control-automation-platform-v1.service";
import { FoundationEventBusV1Service } from "./foundation-event-bus-v1.service";
import { FoundationIamV1Service } from "./foundation-iam-v1.service";
import { FoundationNotificationsV1Service } from "./foundation-notifications-v1.service";
import { FoundationPolicyEngineV1Service } from "./foundation-policy-engine-v1.service";
import { FoundationRulesEngineV1Service } from "./foundation-rules-engine-v1.service";
import { FoundationSchedulerV1Service } from "./foundation-scheduler-v1.service";
import { FoundationSecretsV1Service } from "./foundation-secrets-v1.service";
import { FoundationWorkflowEngineV1Service } from "./foundation-workflow-engine-v1.service";

@Module({
  controllers: [FoundationControlAutomationPlatformV1Controller],
  providers: [
    FoundationConfigurationV1Service,
    FoundationControlAutomationPlatformV1Service,
    FoundationEventBusV1Service,
    FoundationIamV1Service,
    FoundationNotificationsV1Service,
    FoundationPolicyEngineV1Service,
    FoundationRulesEngineV1Service,
    FoundationSchedulerV1Service,
    FoundationSecretsV1Service,
    FoundationWorkflowEngineV1Service,
  ],
  exports: [
    FoundationConfigurationV1Service,
    FoundationControlAutomationPlatformV1Service,
    FoundationEventBusV1Service,
    FoundationIamV1Service,
    FoundationNotificationsV1Service,
    FoundationPolicyEngineV1Service,
    FoundationRulesEngineV1Service,
    FoundationSchedulerV1Service,
    FoundationSecretsV1Service,
    FoundationWorkflowEngineV1Service,
  ],
})
export class FoundationControlAutomationPlatformV1Module {}
