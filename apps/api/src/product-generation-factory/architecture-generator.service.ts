import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ArchitectureBlueprint } from './product-generation.types';
import { ProductGenerationStore } from './product-generation.store';

@Injectable()
export class ArchitectureGeneratorService {
  constructor(private readonly store: ProductGenerationStore) {}

  generate(namespace: string): ArchitectureBlueprint {
    const specification = this.store.specifications.get(namespace);
    if (!specification) {
      throw new BadRequestException(`Product specification not found: ${namespace}`);
    }

    const featureNames = specification.useCases.map((useCase) =>
      useCase.replace(/^Manage /, '').trim(),
    );

    const modules = [
      'identity',
      'governance',
      'audit',
      'health',
      ...featureNames.map((feature) => this.slug(feature)),
    ];

    const entities = [
      {
        name: 'GeneratedUser',
        fields: [
          { name: 'email', type: 'String', required: true },
          { name: 'displayName', type: 'String', required: true },
          { name: 'role', type: 'String', required: true },
        ],
      },
      {
        name: 'GeneratedAuditRecord',
        fields: [
          { name: 'action', type: 'String', required: true },
          { name: 'actor', type: 'String', required: true },
          { name: 'payload', type: 'Json', required: true },
        ],
      },
      ...featureNames.map((feature) => ({
        name: this.pascal(feature),
        fields: [
          { name: 'name', type: 'String', required: true },
          { name: 'status', type: 'String', required: true },
          { name: 'metadata', type: 'Json', required: false },
        ],
      })),
    ];

    const blueprint: ArchitectureBlueprint = {
      id: `architecture:${Date.now()}:${randomUUID().slice(0, 8)}`,
      productSpecificationId: specification.id,
      namespace,
      stack: {
        backend: 'NestJS',
        frontend: 'Next.js',
        mobile: specification.channels.includes('mobile') ? 'Flutter' : undefined,
        database: 'PostgreSQL',
        orm: 'Prisma',
      },
      modules,
      entities,
      apiResources: modules,
      pages: ['dashboard', 'settings', ...featureNames.map((feature) => this.slug(feature))],
      workflows: ['onboarding', 'approval', 'operation', 'incident-response'],
      capabilities: specification.capabilities,
      policies: [
        'human-final-authority',
        'global-compliance-readiness',
        'least-privilege',
        'audit-required',
      ],
      createdAt: new Date().toISOString(),
    };

    this.store.architectures.set(namespace, blueprint);
    return blueprint;
  }

  private slug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private pascal(value: string): string {
    return value
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}