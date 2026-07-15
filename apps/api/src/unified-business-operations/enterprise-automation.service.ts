import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AutomationRule,
  BusinessEvent,
  IntegrationLink,
} from "./unified-business-operations.types";

@Injectable()
export class EnterpriseAutomationService {
  private readonly rules = new Map<string, AutomationRule>();
  private readonly events = new Map<string, BusinessEvent>();
  private readonly links = new Map<string, IntegrationLink>();

  createRule(
    input: Omit<AutomationRule, "id" | "createdAt" | "updatedAt">,
  ): AutomationRule {
    const now = new Date().toISOString();
    const rule: AutomationRule = {
      ...input,
      id: randomUUID(),
      condition: { ...input.condition },
      createdAt: now,
      updatedAt: now,
    };

    this.rules.set(rule.id, rule);
    return this.cloneRule(rule);
  }

  createIntegration(
    input: Omit<IntegrationLink, "id" | "createdAt" | "updatedAt">,
  ): IntegrationLink {
    const now = new Date().toISOString();
    const link: IntegrationLink = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.links.set(link.id, link);
    return { ...link };
  }

  emit(
    input: Omit<BusinessEvent, "id" | "createdAt">,
  ) {
    const event: BusinessEvent = {
      ...input,
      id: randomUUID(),
      payload: { ...input.payload },
      createdAt: new Date().toISOString(),
    };

    this.events.set(event.id, event);

    const matchedRules = Array.from(this.rules.values()).filter(
      (rule) =>
        rule.active &&
        rule.tenantId === event.tenantId &&
        rule.eventName === event.name,
    );

    const matchedLinks = Array.from(this.links.values()).filter(
      (link) =>
        link.active &&
        link.tenantId === event.tenantId &&
        link.sourceModule === event.sourceModule &&
        link.eventName === event.name,
    );

    return {
      event: {
        ...event,
        payload: { ...event.payload },
      },
      actions: matchedRules.map((rule) => ({
        ruleId: rule.id,
        targetModule: rule.targetModule,
        action: rule.action,
      })),
      integrations: matchedLinks.map((link) => ({
        integrationId: link.id,
        targetModule: link.targetModule,
        action: link.action,
      })),
    };
  }

  dashboard() {
    return {
      rules: this.rules.size,
      events: this.events.size,
      integrations: this.links.size,
      activeRules: Array.from(this.rules.values()).filter(
        (item) => item.active,
      ).length,
      activeIntegrations: Array.from(this.links.values()).filter(
        (item) => item.active,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private cloneRule(rule: AutomationRule): AutomationRule {
    return {
      ...rule,
      condition: { ...rule.condition },
    };
  }
}