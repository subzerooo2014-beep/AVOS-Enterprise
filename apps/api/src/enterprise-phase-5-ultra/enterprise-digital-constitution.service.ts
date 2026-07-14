import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ConstitutionRule } from "./enterprise-phase-5-ultra.types";
@Injectable()
export class EnterpriseDigitalConstitutionService {
  private readonly rules: ConstitutionRule[] = [];
  register(name: string, principle: string): ConstitutionRule {
    const rule = { id: randomUUID(), name, principle, active: true }; this.rules.push(rule); return rule;
  }
  evaluate() {
    const activeRules = this.rules.filter((r) => r.active).length;
    return { activeRules, compliant: activeRules > 0, constitutionScore: activeRules > 0 ? 100 : 0, evaluatedAt: new Date().toISOString() };
  }
  count(): number { return this.rules.length; }
}