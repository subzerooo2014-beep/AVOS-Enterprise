import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnterpriseFactoryStore } from './enterprise-factory.store';

@Injectable()
export class EnterpriseFactoryBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(EnterpriseFactoryBootstrapService.name);

  constructor(private readonly store: EnterpriseFactoryStore) {}

  onModuleInit(): void {
    if (this.store.factories.size > 0) {
      this.logger.log(
        `Enterprise Factory bootstrap skipped; ${this.store.factories.size} factor${this.store.factories.size === 1 ? 'y' : 'ies'} already registered.`,
      );
      return;
    }

    const now = new Date().toISOString();

    // Canonical baseline node. It is created only when the registry is truly empty.
    // The broad record shape preserves compatibility with the current Factory model
    // while allowing later packs to enrich the same registry entry.
    const seed = {
      id: 'enterprise-factory:core:primary',
      namespace: 'avos-enterprise-factory-core',
      name: 'AVOS Enterprise Factory Core',
      description:
        'Canonical AVOS enterprise production factory used as the baseline production-network node.',
      status: 'operational',
      type: 'enterprise',
      region: 'global',
      jurisdictions: ['AE', 'GLOBAL'],
      capabilities: [
        'product-compilation',
        'architecture-generation',
        'deployment-generation',
        'quality-assurance',
        'network-coordination',
      ],
      capacity: 10,
      currentLoad: 0,
      healthScore: 100,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      createdAt: now,
      updatedAt: now,
    } as any;

    this.store.factories.set(seed.namespace, seed);

    this.logger.warn(
      'Enterprise Factory registry was empty. Canonical AVOS Enterprise Factory Core seed was registered.',
    );
  }
}