import { Injectable } from '@nestjs/common';
import { ProductDigitalTwin } from './product-factory-enterprise.types';
import { ProductFactoryEnterpriseStore } from './product-factory-enterprise.store';

@Injectable()
export class ProductDigitalTwinService {
  constructor(private readonly store: ProductFactoryEnterpriseStore) {}

  synchronize(namespace: string): ProductDigitalTwin {
    const runtime = this.store.latest(namespace);
    const signals = this.store.signals.filter(
      (signal) => signal.namespace === namespace,
    );
    const proposals = this.store.proposals.filter(
      (proposal) => proposal.namespace === namespace,
    );

    const criticalSignals = signals.filter(
      (signal) => signal.severity === 'critical',
    ).length;
    const highSignals = signals.filter(
      (signal) => signal.severity === 'high',
    ).length;

    const twin: ProductDigitalTwin = {
      namespace,
      productDNA: {
        identity: namespace,
        version: runtime?.version ?? 'unknown',
        purpose: 'AVOS generated product',
        governance: runtime?.governance ?? null,
      },
      productGenome: {
        lifecycle: runtime?.state ?? 'draft',
        environment: runtime?.environment ?? null,
        jurisdiction: runtime?.jurisdiction ?? null,
        evolutionProposals: proposals.length,
      },
      dependencyGraph: {
        nodes: ['Enterprise Kernel', 'Capability Fabric', 'Knowledge Fabric', 'Intelligence Fabric'],
        edges: [
          ['Product', 'Enterprise Kernel'],
          ['Product', 'Capability Fabric'],
          ['Product', 'Knowledge Fabric'],
          ['Product', 'Intelligence Fabric'],
        ],
      },
      runtimeGraph: {
        state: runtime?.state ?? 'draft',
        port: runtime?.port ?? null,
        health: runtime?.health ?? 'unknown',
        readiness: runtime?.readiness ?? false,
      },
      capabilityGraph: {
        sharedCapabilities: ['Identity', 'Governance', 'Audit', 'Compliance'],
      },
      knowledgeGraph: {
        telemetrySignals: signals.length,
        evolutionKnowledge: proposals.length,
      },
      scores: {
        trust: runtime?.governance.humanFinalAuthority ? 100 : 50,
        health: runtime?.health === 'healthy' ? 100 : 60,
        maturity: Math.min(100, 70 + proposals.length * 5),
        compliance: runtime?.governance.globalComplianceReadinessGate ? 100 : 0,
      },
      updatedAt: new Date().toISOString(),
    };

    twin.scores.health = Math.max(
      0,
      twin.scores.health - criticalSignals * 25 - highSignals * 10,
    );

    this.store.twins.set(namespace, twin);
    return twin;
  }

  get(namespace: string): ProductDigitalTwin {
    return this.store.twins.get(namespace) ?? this.synchronize(namespace);
  }

  impact(namespace: string, change: string) {
    const twin = this.get(namespace);
    return {
      namespace,
      change,
      impactedLayers: [
        'Product DNA',
        'Runtime Graph',
        'Capability Graph',
        'Knowledge Graph',
        'Compliance Gate',
      ],
      risk:
        twin.scores.health < 70 || twin.scores.compliance < 100
          ? 'high'
          : twin.scores.maturity < 80
            ? 'medium'
            : 'low',
      requiresHumanApproval: true,
      twinUpdatedAt: twin.updatedAt,
    };
  }
}