import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  ProductGenerationRequest,
  ProductSpecification,
} from './product-generation.types';
import { ProductGenerationStore } from './product-generation.store';

@Injectable()
export class ProductCompilerCoreService {
  constructor(private readonly store: ProductGenerationStore) {}

  compile(request: ProductGenerationRequest): ProductSpecification {
    if (!request.namespace?.match(/^[a-z][a-z0-9-]+$/)) {
      throw new BadRequestException('namespace must be lowercase kebab-case.');
    }
    if (!request.approvedBy?.startsWith('human:')) {
      throw new BadRequestException('Human Final Authority approval is required.');
    }
    if (!request.jurisdictions?.length) {
      throw new BadRequestException('At least one jurisdiction is required.');
    }

    const actors = [...new Set(['administrator', 'operator', ...request.targetUsers])];
    const normalizedFeatures = [...new Set(request.features.map((item) => item.trim()).filter(Boolean))];
    const useCases = normalizedFeatures.map((feature) => `Manage ${feature}`);

    const capabilities = [
      'Identity',
      'Authorization',
      'Audit',
      'Observability',
      'Compliance',
      'Knowledge',
      'Intelligence',
      ...normalizedFeatures.map((feature) => `${feature} Capability`),
    ];

    const specification: ProductSpecification = {
      id: `product-spec:${Date.now()}:${randomUUID().slice(0, 8)}`,
      namespace: request.namespace,
      name: request.name,
      description: request.description,
      requirements: [
        ...normalizedFeatures.map((feature) => `The product shall support ${feature}.`),
        `The product shall support ${request.tenancy}.`,
        `The product shall operate across ${request.jurisdictions.join(', ')}.`,
        'The product shall preserve Human Final Authority.',
        'The product shall pass the Global Compliance Readiness Gate.',
      ],
      actors,
      useCases,
      capabilities,
      nonFunctionalRequirements: [
        'Secure by design',
        'Audit by design',
        'Observable by design',
        'Recoverable deployment',
        'API documentation',
        'Automated tests',
      ],
      channels: request.channels,
      jurisdictions: request.jurisdictions,
      tenancy: request.tenancy,
      approvedBy: request.approvedBy,
      createdAt: new Date().toISOString(),
    };

    this.store.specifications.set(request.namespace, specification);
    return specification;
  }

  get(namespace: string): ProductSpecification | undefined {
    return this.store.specifications.get(namespace);
  }

  list(): ProductSpecification[] {
    return [...this.store.specifications.values()];
  }
}