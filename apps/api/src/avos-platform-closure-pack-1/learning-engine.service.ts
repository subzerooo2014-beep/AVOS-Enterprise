import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LearningProposal,
  LearningProposalInput,
} from './learning-memory.types';
import { LearningGovernanceBridgeService } from './learning-governance-bridge.service';
import { LivingMemoryService } from './living-memory.service';

@Injectable()
export class LearningEngineService {
  private readonly proposals = new Map<string, LearningProposal>();

  constructor(
    private readonly memory: LivingMemoryService,
    private readonly governanceBridge: LearningGovernanceBridgeService,
  ) {}

  propose(input: LearningProposalInput): LearningProposal {
    this.governanceBridge.validateLivingVision(
      input.projectId,
      input.livingVisionId,
    );

    for (const memoryId of input.evidenceMemoryIds) {
      const evidence = this.memory.get(memoryId);

      if (evidence.status !== 'approved') {
        throw new Error(
          `Evidence memory ${memoryId} is not approved and cannot drive learning.`,
        );
      }
    }

    const now = new Date().toISOString();
    const proposal: LearningProposal = {
      id: `learning-proposal-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      title: input.title,
      hypothesis: input.hypothesis,
      evidenceMemoryIds: input.evidenceMemoryIds,
      expectedImpact: input.expectedImpact,
      riskLevel: input.riskLevel ?? 'medium',
      requestedBy: input.requestedBy,
      status: 'under-review',
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now,
    };

    const governanceDecision = this.governanceBridge.createGovernanceDecision({
      projectId: proposal.projectId,
      livingVisionId: proposal.livingVisionId,
      title: `Learning proposal: ${proposal.title}`,
      requestedBy: proposal.requestedBy,
      riskLevel: proposal.riskLevel,
      description: `${proposal.hypothesis}\nExpected impact: ${proposal.expectedImpact}`,
    });

    proposal.governanceDecisionId = governanceDecision.id;

    if (governanceDecision.status === 'blocked') {
      proposal.status = 'blocked';
    }

    this.proposals.set(proposal.id, proposal);

    return this.clone(proposal);
  }

  approve(
    id: string,
    input: {
      approvedBy: string;
      action: 'approved' | 'rejected';
    },
  ): LearningProposal {
    const proposal = this.proposals.get(id);

    if (!proposal) {
      throw new NotFoundException(`Learning proposal ${id} was not found.`);
    }

    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Learning activation requires Human Final Authority.');
    }

    if (proposal.status === 'blocked' && input.action === 'approved') {
      throw new Error('Blocked learning proposals must be revised first.');
    }

    proposal.status = input.action;
    proposal.updatedAt = new Date().toISOString();

    return this.clone(proposal);
  }

  get(id: string): LearningProposal {
    const proposal = this.proposals.get(id);

    if (!proposal) {
      throw new NotFoundException(`Learning proposal ${id} was not found.`);
    }

    return this.clone(proposal);
  }

  list(): LearningProposal[] {
    return [...this.proposals.values()].map((proposal) =>
      this.clone(proposal),
    );
  }

  private clone(proposal: LearningProposal): LearningProposal {
    return JSON.parse(JSON.stringify(proposal)) as LearningProposal;
  }
}