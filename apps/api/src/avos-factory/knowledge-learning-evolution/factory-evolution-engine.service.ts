import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { FactoryEvolutionProposal } from "./factory-knowledge.contracts";

@Injectable()
export class FactoryEvolutionEngineService {
  private readonly proposals = new Map<string, FactoryEvolutionProposal>();

  propose(input: Omit<
    FactoryEvolutionProposal,
    "id" | "status" | "approvedBy" | "createdAt"
  >): FactoryEvolutionProposal {
    const proposal: FactoryEvolutionProposal = {
      id: randomUUID(),
      ...input,
      expectedImpact: Math.max(0, Math.min(100, input.expectedImpact)),
      riskScore: Math.max(0, Math.min(100, input.riskScore)),
      status: "proposed",
      createdAt: new Date().toISOString(),
    };

    this.proposals.set(proposal.id, proposal);
    return structuredClone(proposal);
  }

  approve(id: string, approvedBy: string): FactoryEvolutionProposal {
    const proposal = this.proposals.get(id);
    if (!proposal) {
      throw new BadRequestException(`Evolution proposal ${id} was not found.`);
    }
    if (!approvedBy?.trim()) {
      throw new BadRequestException(
        "Human approval is required for factory evolution.",
      );
    }

    proposal.approvedBy = approvedBy.trim();
    proposal.status = "approved";
    return structuredClone(proposal);
  }

  all(): FactoryEvolutionProposal[] {
    return structuredClone([...this.proposals.values()]);
  }

  count(): number {
    return this.proposals.size;
  }
}
