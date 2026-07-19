import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  EvolutionProposal,
  EvolutionSignal,
} from './product-factory-enterprise.types';
import { ProductFactoryEnterpriseStore } from './product-factory-enterprise.store';

@Injectable()
export class ProductEvolutionService {
  constructor(private readonly store: ProductFactoryEnterpriseStore) {}

  ingestSignal(
    input: Omit<EvolutionSignal, 'id' | 'createdAt'>,
  ): EvolutionSignal {
    const signal: EvolutionSignal = {
      ...input,
      id: `evolution-signal:${Date.now()}:${randomUUID().slice(0, 10)}`,
      createdAt: new Date().toISOString(),
    };
    this.store.signals.push(signal);
    return signal;
  }

  analyze(namespace: string): EvolutionProposal {
    const signals = this.store.signals.filter(
      (signal) => signal.namespace === namespace,
    );

    const changes = [...new Set(signals.map((signal) => {
      switch (signal.category) {
        case 'performance':
          return 'Optimize runtime performance and resource allocation.';
        case 'security':
          return 'Apply security hardening and dependency upgrades.';
        case 'cost':
          return 'Reduce infrastructure and execution cost.';
        case 'architecture-drift':
          return 'Realign implementation with the Living Blueprint.';
        case 'technical-debt':
          return 'Resolve detected technical debt.';
        case 'crash':
          return 'Correct crash root causes and add regression coverage.';
        default:
          return 'Improve product experience using observed usage evidence.';
      }
    }))];

    const proposal: EvolutionProposal = {
      id: `evolution-proposal:${Date.now()}:${randomUUID().slice(0, 10)}`,
      namespace,
      targetVersion: this.nextVersion(namespace),
      title: `Autonomous evolution proposal for ${namespace}`,
      rationale:
        signals.length > 0
          ? signals.map((signal) => `${signal.severity}: ${signal.summary}`)
          : ['No telemetry exists; establish baseline observability first.'],
      changes:
        changes.length > 0
          ? changes
          : ['Add telemetry, health metrics, usage analytics, and architecture drift monitoring.'],
      risk: signals.some((signal) => signal.severity === 'critical')
        ? 'high'
        : signals.some((signal) => signal.severity === 'high')
          ? 'medium'
          : 'low',
      requiresHumanApproval: true,
      status: 'proposed',
      createdAt: new Date().toISOString(),
    };

    this.store.proposals.push(proposal);
    return proposal;
  }

  approve(id: string, approvedBy: string): EvolutionProposal {
    if (!approvedBy.startsWith('human:')) {
      throw new Error('Human approval is required.');
    }

    const proposal = this.store.proposals.find((item) => item.id === id);
    if (!proposal) {
      throw new NotFoundException(`Evolution proposal not found: ${id}`);
    }

    proposal.approvedBy = approvedBy;
    proposal.status = 'approved';
    return proposal;
  }

  list(namespace?: string): EvolutionProposal[] {
    return namespace
      ? this.store.proposals.filter((item) => item.namespace === namespace)
      : this.store.proposals;
  }

  private nextVersion(namespace: string): string {
    const latest = this.store.latest(namespace)?.version ?? '0.0.0';
    const parts = latest.split('.').map((item) => Number(item));
    return `${parts[0] || 0}.${parts[1] || 0}.${(parts[2] || 0) + 1}`;
  }
}