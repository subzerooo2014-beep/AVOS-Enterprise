import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterpriseWorkOrder } from './enterprise-factory.types';

@Injectable()
export class EnterpriseOrchestratorService {
  constructor(private readonly store: EnterpriseFactoryStore) {}

  createWorkOrder(input: {
    namespace: string;
    portfolioNamespace: string;
    objective: string;
    requestedProducts: string[];
    priority: number;
    requiredCapabilities: string[];
    jurisdictions: string[];
    approvedBy: string;
  }): EnterpriseWorkOrder {
    if (!this.store.portfolios.has(input.portfolioNamespace)) {
      throw new BadRequestException(
        `Portfolio not found: ${input.portfolioNamespace}`,
      );
    }

    if (!input.approvedBy?.startsWith('human:')) {
      throw new BadRequestException('Human approval is required.');
    }

    const candidates = [...this.store.factories.values()]
      .filter((factory) => factory.status === 'ready' || factory.status === 'busy')
      .filter((factory) =>
        input.requiredCapabilities.every((capability) =>
          factory.capabilities.includes(capability),
        ),
      )
      .sort((a, b) => {
        const aLoad = a.activeWorkOrders / a.capacity;
        const bLoad = b.activeWorkOrders / b.capacity;
        return aLoad - bLoad;
      });

    if (!candidates.length) {
      throw new BadRequestException('No compatible enterprise factory is available.');
    }

    const selected = candidates.slice(0, Math.max(1, input.requestedProducts.length));
    const now = new Date().toISOString();

    const workOrder: EnterpriseWorkOrder = {
      id: `enterprise-work-order:${Date.now()}:${randomUUID().slice(0, 8)}`,
      namespace: input.namespace,
      portfolioNamespace: input.portfolioNamespace,
      objective: input.objective,
      requestedProducts: [...new Set(input.requestedProducts)],
      priority: input.priority,
      requiredCapabilities: [...new Set(input.requiredCapabilities)],
      jurisdictions: [...new Set(input.jurisdictions)],
      selectedFactoryIds: selected.map((factory) => factory.id),
      status: 'planned',
      approvedBy: input.approvedBy,
      createdAt: now,
      updatedAt: now,
    };

    this.store.workOrders.set(input.namespace, workOrder);
    return workOrder;
  }

  queue(namespace: string): EnterpriseWorkOrder {
    const workOrder = this.store.workOrders.get(namespace);
    if (!workOrder) throw new BadRequestException(`Work order not found: ${namespace}`);

    workOrder.status = 'queued';
    workOrder.updatedAt = new Date().toISOString();
    return workOrder;
  }

  list(): EnterpriseWorkOrder[] {
    return [...this.store.workOrders.values()];
  }
}