import { Injectable, NotFoundException } from "@nestjs/common";
import type { DecisionCaseV2 } from "./enterprise-decision-intelligence-v2.types";

@Injectable()
export class DecisionCaseRegistryV2Service {
  private readonly decisions = new Map<string, DecisionCaseV2>();

  upsert(
    input: Omit<DecisionCaseV2, "createdAt" | "updatedAt">,
  ): DecisionCaseV2 {
    const existing = this.decisions.get(input.id);
    const now = new Date().toISOString();

    const decision: DecisionCaseV2 = {
      ...input,
      options: [...input.options],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.decisions.set(decision.id, decision);
    return this.clone(decision);
  }

  approve(
    id: string,
    selectedOption: string,
    confidence: number,
    rationale: string,
  ): DecisionCaseV2 {
    const decision = this.requireDecision(id);
    decision.status = "APPROVED";
    decision.selectedOption = selectedOption;
    decision.confidence = confidence;
    decision.rationale = rationale;
    decision.updatedAt = new Date().toISOString();
    return this.clone(decision);
  }

  reject(id: string, rationale: string): DecisionCaseV2 {
    const decision = this.requireDecision(id);
    decision.status = "REJECTED";
    decision.rationale = rationale;
    decision.updatedAt = new Date().toISOString();
    return this.clone(decision);
  }

  get(id: string): DecisionCaseV2 {
    return this.clone(this.requireDecision(id));
  }

  list(): DecisionCaseV2[] {
    return Array.from(this.decisions.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.decisions.size;
  }

  approvedCount(): number {
    return this.list().filter((item) => item.status === "APPROVED").length;
  }

  rejectedCount(): number {
    return this.list().filter((item) => item.status === "REJECTED").length;
  }

  private requireDecision(id: string): DecisionCaseV2 {
    const decision = this.decisions.get(id);
    if (!decision) {
      throw new NotFoundException(`Decision '${id}' was not found.`);
    }
    return decision;
  }

  private clone(decision: DecisionCaseV2): DecisionCaseV2 {
    return { ...decision, options: [...decision.options] };
  }
}
