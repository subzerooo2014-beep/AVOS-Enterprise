import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { EvolutionProposal } from "./global-production-os.types";

@Injectable()
export class ProductionEvolutionEngineService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  propose(
    title: string,
    rationale: string,
    expectedImpact: number,
    riskLevel: EvolutionProposal["riskLevel"]
  ): EvolutionProposal {
    const proposal: EvolutionProposal = {
      id: this.store.nextId("production-evolution"),
      title,
      rationale,
      expectedImpact,
      riskLevel,
      status: "proposed",
      createdAt: this.store.now()
    };
    this.store.evolutionProposals.set(proposal.id, proposal);
    return proposal;
  }

  decide(id: string, approved: boolean, approvedBy: string): EvolutionProposal {
    const proposal = this.store.evolutionProposals.get(id);
    if (!proposal) throw new Error(`Evolution proposal not found: ${id}`);
    proposal.status = approved ? "approved" : "rejected";
    proposal.approvedBy = approvedBy;
    this.store.evolutionProposals.set(proposal.id, proposal);
    return proposal;
  }

  deploy(id: string): EvolutionProposal {
    const proposal = this.store.evolutionProposals.get(id);
    if (!proposal) throw new Error(`Evolution proposal not found: ${id}`);
    if (proposal.status !== "approved") {
      throw new Error("Human approval is required before deployment.");
    }
    proposal.status = "deployed";
    this.store.evolutionProposals.set(proposal.id, proposal);
    return proposal;
  }
}