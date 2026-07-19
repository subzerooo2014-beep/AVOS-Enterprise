import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterprisePortfolio, EnterpriseResource } from './enterprise-factory.types';

@Injectable()
export class EnterprisePortfolioResourceManagerService {
  constructor(private readonly store: EnterpriseFactoryStore) {}

  createPortfolio(input: {
    namespace: string;
    name: string;
    strategy: string;
    owner: string;
    priority?: number;
  }): EnterprisePortfolio {
    if (!input.owner?.startsWith('human:')) {
      throw new BadRequestException('A human portfolio owner is required.');
    }

    const portfolio: EnterprisePortfolio = {
      id: `portfolio:${Date.now()}:${randomUUID().slice(0, 8)}`,
      namespace: input.namespace,
      name: input.name,
      strategy: input.strategy,
      products: [],
      programs: [],
      initiatives: [],
      priority: input.priority ?? 50,
      owner: input.owner,
      createdAt: new Date().toISOString(),
    };

    this.store.portfolios.set(input.namespace, portfolio);
    return portfolio;
  }

  registerResource(input: {
    type: EnterpriseResource['type'];
    name: string;
    capacity: number;
    tags: string[];
  }): EnterpriseResource {
    const resource: EnterpriseResource = {
      id: `resource:${Date.now()}:${randomUUID().slice(0, 8)}`,
      type: input.type,
      name: input.name,
      capacity: input.capacity,
      allocated: 0,
      tags: [...new Set(input.tags)],
      status: input.capacity > 0 ? 'available' : 'unavailable',
      updatedAt: new Date().toISOString(),
    };

    this.store.resources.set(resource.id, resource);
    return resource;
  }

  allocate(resourceId: string, amount: number): EnterpriseResource {
    const resource = this.store.resources.get(resourceId);
    if (!resource) throw new BadRequestException(`Resource not found: ${resourceId}`);

    if (resource.allocated + amount > resource.capacity) {
      throw new BadRequestException(`Resource capacity exceeded: ${resource.name}`);
    }

    resource.allocated += amount;
    resource.status =
      resource.allocated >= resource.capacity ? 'constrained' : 'available';
    resource.updatedAt = new Date().toISOString();
    return resource;
  }

  listPortfolios(): EnterprisePortfolio[] {
    return [...this.store.portfolios.values()];
  }

  listResources(): EnterpriseResource[] {
    return [...this.store.resources.values()];
  }
}