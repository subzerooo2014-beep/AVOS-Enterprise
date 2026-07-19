import { Injectable, OnModuleInit } from '@nestjs/common';
import { FactoryRegistryService } from './factory-registry.service';
import { FactoryTemplate } from './product-factory.types';

@Injectable()
export class FactoryTemplatesService implements OnModuleInit {
  constructor(private readonly registry: FactoryRegistryService) {}

  onModuleInit() {
    const template: FactoryTemplate = {
      id: 'factory-template:enterprise-product',
      name: 'AVOS Enterprise Product',
      family: 'Enterprise Product Factory',
      version: '1.0.0',
      description:
        'Governed multi-surface AVOS product template for API, web, mobile, database, documentation, deployment and tests.',
      supportedSurfaces: [
        'api',
        'web',
        'mobile',
        'database',
        'worker',
        'documentation',
        'deployment',
        'tests',
      ],
      defaultCapabilities: [
        'Identity',
        'Governance',
        'Audit',
        'Observability',
        'Global Compliance Readiness',
      ],
      defaultEntities: ['ProductRecord'],
      policies: [
        'Foundation First',
        'Capability First',
        'Blueprint Driven',
        'Human Final Authority',
        'Global Compliance Readiness Gate',
      ],
      governance: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
        approvedBy: 'human:khalifa',
      },
      createdAt: new Date().toISOString(),
    };
    this.registry.saveTemplate(template);
  }

  list() {
    return this.registry.listTemplates();
  }

  get(id: string) {
    return this.registry.getTemplate(id);
  }
}