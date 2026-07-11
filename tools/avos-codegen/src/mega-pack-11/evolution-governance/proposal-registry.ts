import { randomUUID } from "node:crypto";
import {
  EvolutionProposal,
  EvolutionProposalStatus,
} from "./contracts";

export class EvolutionProposalRegistry {
  private readonly proposals =
    new Map<string, EvolutionProposal>();

  create(
    input: Omit<
      EvolutionProposal,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): EvolutionProposal {
    const now = new Date().toISOString();

    const proposal: EvolutionProposal = {
      ...structuredClone(input),
      id: randomUUID(),
      status: EvolutionProposalStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    };

    this.proposals.set(
      proposal.id,
      structuredClone(proposal),
    );

    return structuredClone(proposal);
  }

  save(
    proposal: EvolutionProposal,
  ): EvolutionProposal {
    const updated: EvolutionProposal = {
      ...structuredClone(proposal),
      updatedAt: new Date().toISOString(),
    };

    this.proposals.set(
      updated.id,
      updated,
    );

    return structuredClone(updated);
  }

  get(
    proposalId: string,
  ): EvolutionProposal {
    const proposal =
      this.proposals.get(proposalId);

    if (!proposal) {
      throw new Error(
        `Evolution proposal was not found: ${proposalId}`,
      );
    }

    return structuredClone(proposal);
  }

  find(
    proposalId: string,
  ): EvolutionProposal | undefined {
    const proposal =
      this.proposals.get(proposalId);

    return proposal
      ? structuredClone(proposal)
      : undefined;
  }

  list(): EvolutionProposal[] {
    return Array.from(
      this.proposals.values(),
    )
      .map((proposal) =>
        structuredClone(proposal),
      )
      .sort((left, right) =>
        right.createdAt.localeCompare(
          left.createdAt,
        ),
      );
  }

  transition(
    proposalId: string,
    status: EvolutionProposalStatus,
  ): EvolutionProposal {
    const proposal = this.get(proposalId);

    this.assertTransition(
      proposal.status,
      status,
    );

    proposal.status = status;

    return this.save(proposal);
  }

  remove(
    proposalId: string,
  ): EvolutionProposal {
    const proposal =
      this.get(proposalId);

    this.proposals.delete(
      proposalId,
    );

    return proposal;
  }

  clear(): void {
    this.proposals.clear();
  }

  private assertTransition(
    from: EvolutionProposalStatus,
    to: EvolutionProposalStatus,
  ): void {
    const allowed: Record<
      EvolutionProposalStatus,
      readonly EvolutionProposalStatus[]
    > = {
      [EvolutionProposalStatus.DRAFT]: [
        EvolutionProposalStatus.SUBMITTED,
        EvolutionProposalStatus.REJECTED,
      ],
      [EvolutionProposalStatus.SUBMITTED]: [
        EvolutionProposalStatus.ANALYZING,
        EvolutionProposalStatus.REJECTED,
      ],
      [EvolutionProposalStatus.ANALYZING]: [
        EvolutionProposalStatus.APPROVED,
        EvolutionProposalStatus.REJECTED,
      ],
      [EvolutionProposalStatus.APPROVED]: [
        EvolutionProposalStatus.SCHEDULED,
        EvolutionProposalStatus.REJECTED,
      ],
      [EvolutionProposalStatus.REJECTED]: [],
      [EvolutionProposalStatus.SCHEDULED]: [
        EvolutionProposalStatus.EXECUTING,
      ],
      [EvolutionProposalStatus.EXECUTING]: [
        EvolutionProposalStatus.COMPLETED,
        EvolutionProposalStatus.FAILED,
        EvolutionProposalStatus.ROLLED_BACK,
      ],
      [EvolutionProposalStatus.COMPLETED]: [],
      [EvolutionProposalStatus.FAILED]: [
        EvolutionProposalStatus.ROLLED_BACK,
      ],
      [EvolutionProposalStatus.ROLLED_BACK]: [],
    };

    if (!allowed[from].includes(to)) {
      throw new Error(
        `Invalid evolution proposal transition: ${from} -> ${to}`,
      );
    }
  }
}
