import { Injectable } from "@nestjs/common";
import { FoundationConfigurationV1Service } from "./foundation-configuration-v1.service";
import { FoundationEventBusV1Service } from "./foundation-event-bus-v1.service";
import { FoundationIamV1Service } from "./foundation-iam-v1.service";
import { FoundationNotificationsV1Service } from "./foundation-notifications-v1.service";
import { FoundationPolicyEngineV1Service } from "./foundation-policy-engine-v1.service";
import { FoundationRulesEngineV1Service } from "./foundation-rules-engine-v1.service";
import { FoundationSchedulerV1Service } from "./foundation-scheduler-v1.service";
import { FoundationSecretsV1Service } from "./foundation-secrets-v1.service";
import { FoundationWorkflowEngineV1Service } from "./foundation-workflow-engine-v1.service";
import type {
  FoundationControlMetricsV1,
  FoundationControlStatusV1,
} from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationControlAutomationPlatformV1Service {
  constructor(
    private readonly events: FoundationEventBusV1Service,
    private readonly workflows: FoundationWorkflowEngineV1Service,
    private readonly rules: FoundationRulesEngineV1Service,
    private readonly policies: FoundationPolicyEngineV1Service,
    private readonly iam: FoundationIamV1Service,
    private readonly configuration: FoundationConfigurationV1Service,
    private readonly secrets: FoundationSecretsV1Service,
    private readonly scheduler: FoundationSchedulerV1Service,
    private readonly notifications: FoundationNotificationsV1Service,
  ) {}

  metrics(): FoundationControlMetricsV1 {
    return {
      events: this.events.count(),
      deadLetters: this.events.deadLetterCount(),
      workflows: this.workflows.count(),
      runningWorkflows: this.workflows.runningCount(),
      rules: this.rules.count(),
      policies: this.policies.count(),
      identities: this.iam.count(),
      configurations: this.configuration.count(),
      secrets: this.secrets.count(),
      jobs: this.scheduler.count(),
      notifications: this.notifications.count(),
    };
  }

  status(): FoundationControlStatusV1 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Foundation Control & Automation Platform V1",
      version: "1.0.0",
      status:
        metrics.deadLetters > 0 || metrics.runningWorkflows > 100
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        eventBus: "READY",
        asyncMessaging: "READY",
        workflowEngine: "READY",
        rulesEngine: "READY",
        policyEngine: "READY",
        iam: "READY",
        configuration: "READY",
        secrets: "READY",
        scheduler: "READY",
        notifications: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      events: this.events.list(),
      workflows: this.workflows.list(),
      rules: this.rules.list(),
      policies: this.policies.list(),
      identities: this.iam.list(),
      configurations: this.configuration.list(),
      secrets: this.secrets.listMetadata(),
      jobs: this.scheduler.list(),
      notifications: this.notifications.list(),
    };
  }
}
