import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationEvolutionProposalV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationEvolutionEngineV1Service {
  private readonly proposals = new Map<string, FoundationEvolutionProposalV1>();

  propose(
    title: string,
    category: string,
    score: number,
    dependencies: string[],
    rationale: string,
  ): FoundationEvolutionProposalV1 {
    const now = new Date().toISOString();

    const proposal: FoundationEvolutionProposalV1 = {
      id: `evolution-proposal-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title,
      category,
      status: "PROPOSED",
      score,
      dependencies: [...dependencies],
      rationale,
      createdAt: now,
      updatedAt: now,
    };

    this.proposals.set(proposal.id, proposal);
    return this.clone(proposal);
  }

  transition(
    id: string,
    status: FoundationEvolutionProposalV1["status"],
  ): FoundationEvolutionProposalV1 {
    const proposal = this.proposals.get(id);

    if (!proposal) {
      throw new NotFoundException(`Evolution proposal '${id}' was not found.`);
    }

    proposal.status = status;
    proposal.updatedAt = new Date().toISOString();
    return this.clone(proposal);
  }

  list(): FoundationEvolutionProposalV1[] {
    return Array.from(this.proposals.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.proposals.size;
  }

  private clone(
    item: FoundationEvolutionProposalV1,
  ): FoundationEvolutionProposalV1 {
    return { ...item, dependencies: [...item.dependencies] };
  }
}
