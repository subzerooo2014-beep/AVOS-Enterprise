import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseValueOpportunity } from "./enterprise-e10.types";

@Injectable()
export class EnterpriseValueOpportunityService {
  private readonly opportunities = new Map<
    string,
    EnterpriseValueOpportunity
  >();

  create(input: {
    name?: string;
    domain?: string;
    expectedValue?: number;
    confidence?: number;
    timeToValueDays?: number;
    riskScore?: number;
  }): EnterpriseValueOpportunity {
    const opportunity: EnterpriseValueOpportunity = {
      id: randomUUID(),
      name: input.name?.trim() || "AVOS enterprise value opportunity",
      domain: input.domain?.trim() || "enterprise-platform",
      expectedValue: Math.max(0, input.expectedValue ?? 100000),
      confidence: this.clamp(input.confidence ?? 88),
      timeToValueDays: Math.max(1, Math.round(input.timeToValueDays ?? 30)),
      riskScore: this.clamp(input.riskScore ?? 20),
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };

    this.opportunities.set(opportunity.id, opportunity);
    return opportunity;
  }

  markRealizing(id: string) {
    const opportunity = this.get(id);
    opportunity.status = "REALIZING";
    return opportunity;
  }

  markRealized(id: string) {
    const opportunity = this.get(id);
    opportunity.status = "REALIZED";
    return opportunity;
  }

  markAtRisk(id: string) {
    const opportunity = this.get(id);
    opportunity.status = "AT_RISK";
    return opportunity;
  }

  get(id: string): EnterpriseValueOpportunity {
    const opportunity = this.opportunities.get(id);
    if (!opportunity) {
      throw new Error(`Value opportunity not found: ${id}`);
    }

    return opportunity;
  }

  list(): EnterpriseValueOpportunity[] {
    return [...this.opportunities.values()];
  }

  count(): number {
    return this.opportunities.size;
  }

  atRiskCount(): number {
    return this.list().filter((item) => item.status === "AT_RISK").length;
  }

  totalExpectedValue(): number {
    return this.list().reduce((sum, item) => sum + item.expectedValue, 0);
  }

  private clamp(value: number): number {
    return Math.min(100, Math.max(0, Math.round(value)));
  }
}