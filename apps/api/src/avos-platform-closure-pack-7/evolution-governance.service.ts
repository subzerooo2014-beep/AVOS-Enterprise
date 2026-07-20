import { Injectable, NotFoundException } from '@nestjs/common';
import { LivingVisionGovernanceService } from '../avos-platform-closure-pack-0-5/living-vision-governance.service';
import { EvolutionImpactService } from './evolution-impact.service';
import {
  EvolutionAuditRecord,
  EvolutionProposal,
  EvolutionProposalInput,
  UpgradePlan,
} from './evolution-runtime.types';

@Injectable()
export class EvolutionGovernanceService {
  private readonly proposals = new Map<string, EvolutionProposal>();
  private readonly plans = new Map<string, UpgradePlan>();
  private readonly audit: EvolutionAuditRecord[] = [];

  constructor(
    private readonly impact: EvolutionImpactService,
    private readonly livingVision: LivingVisionGovernanceService,
  ) {}

  create(input: EvolutionProposalInput): EvolutionProposal {
    if (!this.livingVision.isLinked(input.projectId, input.livingVisionId)) {
      throw new Error('Evolution proposal requires an active Living Vision link.');
    }

    const analysis = this.impact.analyze(input);
    const now = new Date().toISOString();

    const proposal: EvolutionProposal = {
      id: `evolution-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...input,
      status: 'awaiting-approval',
      impactScore: analysis.impactScore,
      riskScore: analysis.riskScore,
      requiresRecertification: analysis.requiresRecertification,
      createdAt: now,
      updatedAt: now,
    };

    this.proposals.set(proposal.id, proposal);
    this.record(proposal.id, 'proposal-created', input.proposedBy, proposal.title);

    return this.cloneProposal(proposal);
  }

  approve(
    id: string,
    input: { approvedBy: string; action: 'approved' | 'rejected' },
  ): EvolutionProposal {
    const proposal = this.requireProposal(id);

    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Evolution approval requires Human Final Authority.');
    }

    proposal.status = input.action === 'approved' ? 'approved' : 'rejected';
    proposal.approvedBy = input.approvedBy;
    proposal.updatedAt = new Date().toISOString();

    this.record(
      proposal.id,
      `proposal-${input.action}`,
      input.approvedBy,
      proposal.title,
    );

    return this.cloneProposal(proposal);
  }

  createPlan(
    proposalId: string,
    input: {
      steps: string[];
      rollbackPlan: string[];
      validationChecks: string[];
      createdBy: string;
    },
  ): UpgradePlan {
    const proposal = this.requireProposal(proposalId);

    if (proposal.status !== 'approved') {
      throw new Error('Only approved proposals may create upgrade plans.');
    }

    if (input.rollbackPlan.length === 0) {
      throw new Error('Upgrade plan requires a rollback plan.');
    }

    if (input.validationChecks.length === 0) {
      throw new Error('Upgrade plan requires validation checks.');
    }

    const now = new Date().toISOString();

    const plan: UpgradePlan = {
      id: `upgrade-plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      proposalId,
      steps: input.steps,
      rollbackPlan: input.rollbackPlan,
      validationChecks: input.validationChecks,
      status: 'created',
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    proposal.implementationPlanId = plan.id;
    proposal.status = 'scheduled';
    proposal.updatedAt = now;

    this.record(
      proposal.id,
      'upgrade-plan-created',
      input.createdBy,
      plan.id,
    );

    return this.clonePlan(plan);
  }

  approvePlan(id: string, approvedBy: string): UpgradePlan {
    const plan = this.requirePlan(id);

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Upgrade plan approval requires Human Final Authority.');
    }

    plan.status = 'approved';
    plan.approvedBy = approvedBy;
    plan.updatedAt = new Date().toISOString();

    this.record(
      plan.proposalId,
      'upgrade-plan-approved',
      approvedBy,
      plan.id,
    );

    return this.clonePlan(plan);
  }

  completePlan(id: string, completedBy: string): UpgradePlan {
    const plan = this.requirePlan(id);
    const proposal = this.requireProposal(plan.proposalId);

    if (plan.status !== 'approved') {
      throw new Error('Only approved upgrade plans may be completed.');
    }

    plan.status = 'completed';
    plan.updatedAt = new Date().toISOString();
    proposal.status = 'implemented';
    proposal.updatedAt = plan.updatedAt;

    this.record(
      proposal.id,
      'evolution-implemented',
      completedBy,
      plan.id,
    );

    return this.clonePlan(plan);
  }

  rollbackProposal(id: string, approvedBy: string): EvolutionProposal {
    const proposal = this.requireProposal(id);

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Evolution rollback requires Human Final Authority.');
    }

    proposal.status = 'rolled-back';
    proposal.updatedAt = new Date().toISOString();

    this.record(
      proposal.id,
      'evolution-rolled-back',
      approvedBy,
      proposal.title,
    );

    return this.cloneProposal(proposal);
  }

  listProposals(): EvolutionProposal[] {
    return [...this.proposals.values()].map((proposal) =>
      this.cloneProposal(proposal),
    );
  }

  listPlans(): UpgradePlan[] {
    return [...this.plans.values()].map((plan) => this.clonePlan(plan));
  }

  listAudit(): EvolutionAuditRecord[] {
    return this.audit.map((record) =>
      JSON.parse(JSON.stringify(record)) as EvolutionAuditRecord,
    );
  }

  private record(
    proposalId: string,
    action: string,
    performedBy: string,
    details: string,
  ): void {
    this.audit.push({
      id: `evolution-audit-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      proposalId,
      action,
      performedBy,
      details,
      createdAt: new Date().toISOString(),
    });
  }

  private requireProposal(id: string): EvolutionProposal {
    const proposal = this.proposals.get(id);

    if (!proposal) {
      throw new NotFoundException(`Evolution proposal ${id} was not found.`);
    }

    return proposal;
  }

  private requirePlan(id: string): UpgradePlan {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Upgrade plan ${id} was not found.`);
    }

    return plan;
  }

  private cloneProposal(proposal: EvolutionProposal): EvolutionProposal {
    return JSON.parse(JSON.stringify(proposal)) as EvolutionProposal;
  }

  private clonePlan(plan: UpgradePlan): UpgradePlan {
    return JSON.parse(JSON.stringify(plan)) as UpgradePlan;
  }
}