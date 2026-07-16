import { Injectable, NotFoundException } from "@nestjs/common";
import type { AutomationDefinitionRecord } from "./enterprise-automation-digital-workforce.types";

@Injectable()
export class AutomationRegistryService {
  private readonly automations = new Map<string, AutomationDefinitionRecord>();

  register(
    input: Omit<AutomationDefinitionRecord, "createdAt" | "updatedAt">,
  ): AutomationDefinitionRecord {
    const existing = this.automations.get(input.id);
    const now = new Date().toISOString();

    const automation: AutomationDefinitionRecord = {
      ...input,
      steps: [...input.steps],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.automations.set(automation.id, automation);
    return this.clone(automation);
  }

  get(id: string): AutomationDefinitionRecord {
    const automation = this.automations.get(id);

    if (!automation) {
      throw new NotFoundException(`Automation '${id}' was not found.`);
    }

    return this.clone(automation);
  }

  list(): AutomationDefinitionRecord[] {
    return Array.from(this.automations.values()).map((automation) =>
      this.clone(automation),
    );
  }

  count(): number {
    return this.automations.size;
  }

  enabledCount(): number {
    return this.list().filter((automation) => automation.enabled).length;
  }

  private clone(
    automation: AutomationDefinitionRecord,
  ): AutomationDefinitionRecord {
    return {
      ...automation,
      steps: [...automation.steps],
    };
  }
}
