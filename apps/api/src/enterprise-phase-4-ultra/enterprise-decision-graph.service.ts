import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DecisionNode } from "./enterprise-phase-4-ultra.types";

@Injectable()
export class EnterpriseDecisionGraphService {
  private readonly decisions: DecisionNode[] = [];

  register(name: string, rationale: string, confidence = 90): DecisionNode {
    const decision: DecisionNode = {
      id: randomUUID(),
      name,
      rationale,
      confidence: Math.min(100, Math.max(0, Math.round(confidence))),
      approved: confidence >= 60,
      createdAt: new Date().toISOString(),
    };

    this.decisions.push(decision);
    return decision;
  }

  count(): number {
    return this.decisions.length;
  }
}