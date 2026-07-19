import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterpriseFactoryRegistration } from './enterprise-factory.types';

@Injectable()
export class EnterpriseFactoryFoundationService {
  constructor(private readonly store: EnterpriseFactoryStore) {}

  register(input: {
    namespace: string;
    name: string;
    type: EnterpriseFactoryRegistration['type'];
    capabilities: string[];
    capacity: number;
    jurisdictions: string[];
  }): EnterpriseFactoryRegistration {
    if (!input.namespace?.match(/^[a-z][a-z0-9-]+$/)) {
      throw new BadRequestException('Factory namespace must be lowercase kebab-case.');
    }

    if (input.capacity < 1) {
      throw new BadRequestException('Factory capacity must be at least 1.');
    }

    const factory: EnterpriseFactoryRegistration = {
      id: `enterprise-factory-registration:${Date.now()}:${randomUUID().slice(0, 8)}`,
      namespace: input.namespace,
      name: input.name,
      type: input.type,
      status: 'ready',
      capabilities: [...new Set(input.capabilities)],
      capacity: input.capacity,
      activeWorkOrders: 0,
      jurisdictions: [...new Set(input.jurisdictions)],
      registeredAt: new Date().toISOString(),
    };

    this.store.factories.set(input.namespace, factory);
    return factory;
  }

  ensureProductFactory(): EnterpriseFactoryRegistration {
    const existing = this.store.factories.get('avos-product-factory');
    if (existing) return existing;

    return this.register({
      namespace: 'avos-product-factory',
      name: 'AVOS Product Factory',
      type: 'product-factory',
      capabilities: [
        'product-compilation',
        'architecture-generation',
        'backend-generation',
        'database-api-compilation',
        'frontend-generation',
        'test-repair',
        'deployment-generation',
        'product-certification',
      ],
      capacity: 8,
      jurisdictions: ['GLOBAL', 'AE'],
    });
  }

  list(): EnterpriseFactoryRegistration[] {
    return [...this.store.factories.values()];
  }
}