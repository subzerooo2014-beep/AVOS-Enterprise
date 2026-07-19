import { Injectable } from "@nestjs/common";
import { AutomationRule, EventEnvelope } from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";
import { WorkflowIntegrationService } from "./workflow-integration.service";
import { DistributedCoordinationService } from "./distributed-coordination.service";

@Injectable()
export class PlatformAutomationService {
  constructor(
    private readonly store: EventMeshFileStoreService,
    private readonly workflows: WorkflowIntegrationService,
    private readonly coordination: DistributedCoordinationService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.listRules().length > 0) {
      return;
    }

    this.registerRule({
      name: "Runtime Health Automation",
      triggerEventType: "platform.runtime.health.updated",
      action: "evaluate-runtime-health",
      active: true,
    });

    this.registerRule({
      name: "Incident Coordination Automation",
      triggerEventType: "platform.operations.incident.opened",
      action: "start-incident-coordination",
      active: true,
    });
  }

  registerRule(
    input: Omit<AutomationRule, "id" | "createdAt">,
  ): AutomationRule {
    const existing = this.listRules().find(
      (rule) =>
        rule.name === input.name &&
        rule.triggerEventType === input.triggerEventType,
    );

    if (existing) {
      return existing;
    }

    const rule: AutomationRule = {
      ...input,
      id: this.id("automation-rule"),
      createdAt: this.now(),
    };

    this.store.writeJson(`automation/${rule.id}.json`, rule);
    return rule;
  }

  listRules(): AutomationRule[] {
    return this.store.listJson<AutomationRule>("automation");
  }

  execute(envelope: EventEnvelope): Record<string, unknown> {
    const workflows = this.workflows.trigger(envelope);
    const rules = this.listRules().filter(
      (rule) =>
        rule.active &&
        rule.triggerEventType === envelope.eventType,
    );

    const executions = rules.map((rule) => {
      const lease = this.coordination.acquire(
        `automation:${rule.id}:${envelope.correlationId}`,
        "platform-automation",
        10000,
      );

      const result = {
        ruleId: rule.id,
        action: rule.action,
        status: "completed",
      };

      this.coordination.release(lease.id, "platform-automation");
      return result;
    });

    return {
      workflows,
      executions,
      completed: true,
    };
  }
}