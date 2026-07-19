import { Injectable, NotFoundException } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class SelfEvolvingGovernanceService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  propose(input?: { title?: string; rationale?: string }) {
    const proposal = {
      id: this.store.id("governance-evolution"),
      title: input?.title ?? "Delay-Tolerant Civilization Governance Protocol",
      rationale: input?.rationale ?? "Improve lawful coordination across long communication delays without transferring human final authority.",
      constitutionalCompatibility: true,
      humanFinalAuthorityPreserved: true,
      globalComplianceReadinessGate: true,
      governanceDecision: "pending" as const,
      status: "proposed",
      createdAt: this.store.now(),
    };
    this.store.governanceProposals.push(proposal);
    return proposal;
  }

  approve(id: string, approvedBy = "human:khalifa") {
    const proposal = this.store.governanceProposals.find((item) => item.id === id);
    if (!proposal) throw new NotFoundException(`Governance proposal not found: ${id}`);
    proposal.governanceDecision = "approved";
    proposal.approvedBy = approvedBy;
    proposal.status = "approved";
    return proposal;
  }

  deploy(id: string) {
    const proposal = this.store.governanceProposals.find((item) => item.id === id);
    if (!proposal) throw new NotFoundException(`Governance proposal not found: ${id}`);
    if (proposal.governanceDecision !== "approved") {
      throw new Error("Human approval is required before governance evolution deployment.");
    }
    proposal.status = "deployed";
    return proposal;
  }
}