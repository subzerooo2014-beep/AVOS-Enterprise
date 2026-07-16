import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationConfigurationV1Service } from "./foundation-configuration-v1.service";
import { FoundationControlAutomationPlatformV1Service } from "./foundation-control-automation-platform-v1.service";
import { FoundationEventBusV1Service } from "./foundation-event-bus-v1.service";
import { FoundationIamV1Service } from "./foundation-iam-v1.service";
import { FoundationNotificationsV1Service } from "./foundation-notifications-v1.service";
import { FoundationPolicyEngineV1Service } from "./foundation-policy-engine-v1.service";
import { FoundationRulesEngineV1Service } from "./foundation-rules-engine-v1.service";
import { FoundationSchedulerV1Service } from "./foundation-scheduler-v1.service";
import { FoundationSecretsV1Service } from "./foundation-secrets-v1.service";
import { FoundationWorkflowEngineV1Service } from "./foundation-workflow-engine-v1.service";
import type {
  FoundationIdentityV1,
  FoundationPolicyV1,
  FoundationRuleV1,
  FoundationScheduledJobV1,
} from "./foundation-control-automation-v1.types";

@Controller("foundation-control-automation-platform-v1")
export class FoundationControlAutomationPlatformV1Controller {
  constructor(
    private readonly platform: FoundationControlAutomationPlatformV1Service,
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

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("events")
  publishEvent(
    @Body() body: { topic: string; payload: Record<string, unknown>; version?: number },
  ) {
    return { success: true, event: this.events.publish(body.topic, body.payload, body.version) };
  }

  @Post("workflows")
  createWorkflow(
    @Body() body: { name: string; steps: string[]; context?: Record<string, unknown> },
  ) {
    return { success: true, workflow: this.workflows.create(body.name, body.steps, body.context) };
  }

  @Post("workflows/:id/start")
  startWorkflow(@Param("id") id: string) {
    return { success: true, workflow: this.workflows.start(id) };
  }

  @Post("rules")
  upsertRule(
    @Body() body: Omit<FoundationRuleV1, "version" | "createdAt" | "updatedAt">,
  ) {
    return { success: true, rule: this.rules.upsert(body) };
  }

  @Post("policies")
  upsertPolicy(
    @Body() body: Omit<FoundationPolicyV1, "version" | "createdAt" | "updatedAt">,
  ) {
    return { success: true, policy: this.policies.upsert(body) };
  }

  @Post("identities")
  upsertIdentity(
    @Body() body: Omit<FoundationIdentityV1, "createdAt" | "updatedAt">,
  ) {
    return { success: true, identity: this.iam.upsert(body) };
  }

  @Post("configuration")
  setConfiguration(
    @Body() body: { key: string; value: unknown; environment: string },
  ) {
    return {
      success: true,
      configuration: this.configuration.set(body.key, body.value, body.environment),
    };
  }

  @Post("secrets")
  storeSecret(@Body() body: { key: string; value: string }) {
    return { success: true, secret: this.secrets.store(body.key, body.value) };
  }

  @Post("jobs")
  upsertJob(
    @Body() body: Omit<FoundationScheduledJobV1, "lastRunAt" | "updatedAt">,
  ) {
    return { success: true, job: this.scheduler.upsert(body) };
  }

  @Post("notifications")
  queueNotification(
    @Body()
    body: {
      channel: "EMAIL" | "SMS" | "PUSH" | "IN_APP" | "WEBHOOK";
      recipient: string;
      subject: string;
      message: string;
    },
  ) {
    return {
      success: true,
      notification: this.notifications.queue(
        body.channel,
        body.recipient,
        body.subject,
        body.message,
      ),
    };
  }
}
