import { Injectable } from "@nestjs/common";
import { InspectionRule } from "./inspection-certification.types";

@Injectable()
export class InspectionRegistryService {
  private readonly rules = new Map<string, InspectionRule>();

  register(rule: InspectionRule): InspectionRule {
    if (this.rules.has(rule.id)) {
      throw new Error(`Inspection rule already exists: ${rule.id}`);
    }

    this.rules.set(rule.id, Object.freeze({ ...rule }));
    return rule;
  }

  upsert(rule: InspectionRule): InspectionRule {
    this.rules.set(rule.id, Object.freeze({ ...rule }));
    return rule;
  }

  get(ruleId: string): InspectionRule | undefined {
    return this.rules.get(ruleId);
  }

  list(): InspectionRule[] {
    return [...this.rules.values()];
  }

  clear(): void {
    this.rules.clear();
  }
}
