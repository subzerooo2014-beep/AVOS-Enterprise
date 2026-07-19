import { Injectable, OnModuleInit } from '@nestjs/common';
import { FactoryRegistryService } from './factory-registry.service';
import { FactoryTemplate } from './product-factory.types';

@Injectable()
export class FactoryTemplateCatalogService implements OnModuleInit {
  constructor(private readonly registry: FactoryRegistryService) {}

  onModuleInit() {
    const templates: FactoryTemplate[] = [
      {
        id: 'factory-template:enterprise-product',
        name: 'AVOS Enterprise Product',
        family: 'Enterprise Product Factory',
        version: '1.0.0',
        description: 'Governed multi-surface enterprise product template.',
        supportedSurfaces: ['api','web','mobile','database','worker','documentation','deployment','tests'],
        defaultCapabilities: ['Identity','Governance','Audit','Observability','Global Compliance Readiness'],
        defaultEntities: ['ProductRecord'],
        policies: ['Foundation First','Capability First','Blueprint Driven','Human Final Authority','Global Compliance Readiness Gate'],
        governance: {
          foundationFirst: true,
          capabilityFirst: true,
          blueprintDriven: true,
          humanFinalAuthority: true,
          globalComplianceReadinessGate: true,
          approvedBy: 'human:khalifa',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'factory-template:marketplace-product',
        name: 'AVOS Marketplace Product',
        family: 'Marketplace Product Factory',
        version: '1.0.0',
        description: 'Marketplace-connected AVOS product template.',
        supportedSurfaces: ['api','web','database','documentation','deployment','tests'],
        defaultCapabilities: ['Catalog','Marketplace','Installation','Versioning','Compatibility'],
        defaultEntities: ['CatalogItem','ProductVersion'],
        policies: ['Foundation First','Capability First','Human Final Authority'],
        governance: {
          foundationFirst: true,
          capabilityFirst: true,
          blueprintDriven: true,
          humanFinalAuthority: true,
          globalComplianceReadinessGate: true,
          approvedBy: 'human:khalifa',
        },
        createdAt: new Date().toISOString(),
      },
    ];

    for (const template of templates) this.registry.saveTemplate(template);
  }

  list() {
    return this.registry.listTemplates();
  }

  get(id: string) {
    return this.registry.getTemplate(id);
  }
}