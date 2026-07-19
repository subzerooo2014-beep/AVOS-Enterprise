import { Injectable, NotFoundException } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class AutonomousInfrastructureExpansionService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  propose(input: {
    targetNodeId: string;
    capability: string;
    reason?: string;
    projectedCapacityGain?: number;
  }) {
    const node = this.store.nodes.find((item) => item.id === input.targetNodeId);
    if (!node) throw new NotFoundException(`Interplanetary node not found: ${input.targetNodeId}`);

    const expansion = {
      id: this.store.id("infrastructure-expansion"),
      targetNodeId: input.targetNodeId,
      capability: input.capability,
      reason: input.reason ?? "Increase civilization-scale resilience and production continuity.",
      projectedCapacityGain: input.projectedCapacityGain ?? 150,
      riskLevel: "medium" as const,
      governanceDecision: "pending" as const,
      status: "proposed",
      createdAt: this.store.now(),
    };
    this.store.expansions.push(expansion);
    return expansion;
  }

  approve(id: string, approvedBy = "human:khalifa") {
    const expansion = this.store.expansions.find((item) => item.id === id);
    if (!expansion) throw new NotFoundException(`Infrastructure expansion not found: ${id}`);
    expansion.governanceDecision = "approved";
    expansion.approvedBy = approvedBy;
    expansion.status = "approved";
    return expansion;
  }

  deploy(id: string) {
    const expansion = this.store.expansions.find((item) => item.id === id);
    if (!expansion) throw new NotFoundException(`Infrastructure expansion not found: ${id}`);
    if (expansion.governanceDecision !== "approved") {
      throw new Error("Human approval is required before autonomous infrastructure deployment.");
    }
    const node = this.store.nodes.find((item) => item.id === expansion.targetNodeId);
    if (node) {
      node.availableCapacity += expansion.projectedCapacityGain;
      if (!node.supportedCapabilities.includes(expansion.capability)) {
        node.supportedCapabilities.push(expansion.capability);
      }
    }
    expansion.status = "deployed";
    return expansion;
  }
}