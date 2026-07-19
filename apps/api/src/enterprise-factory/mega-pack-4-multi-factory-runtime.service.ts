import { BadRequestException, Injectable } from '@nestjs/common';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterpriseWorkOrder } from './enterprise-factory.types';

@Injectable()
export class MultiFactoryRuntimeService {
  constructor(private readonly store: EnterpriseFactoryStore) {}

  start(namespace: string): EnterpriseWorkOrder {
    const workOrder = this.store.workOrders.get(namespace);
    if (!workOrder) throw new BadRequestException(`Work order not found: ${namespace}`);

    if (!['queued', 'planned'].includes(workOrder.status)) {
      throw new BadRequestException(`Work order cannot start from ${workOrder.status}.`);
    }

    const selectedFactories = [...this.store.factories.values()].filter((factory) =>
      workOrder.selectedFactoryIds.includes(factory.id),
    );

    for (const factory of selectedFactories) {
      if (factory.activeWorkOrders >= factory.capacity) {
        throw new BadRequestException(`Factory capacity exhausted: ${factory.namespace}`);
      }
      factory.activeWorkOrders += 1;
      factory.status =
        factory.activeWorkOrders >= factory.capacity ? 'busy' : 'ready';
    }

    workOrder.status = 'running';
    workOrder.updatedAt = new Date().toISOString();
    return workOrder;
  }

  complete(namespace: string): EnterpriseWorkOrder {
    const workOrder = this.store.workOrders.get(namespace);
    if (!workOrder) throw new BadRequestException(`Work order not found: ${namespace}`);

    const selectedFactories = [...this.store.factories.values()].filter((factory) =>
      workOrder.selectedFactoryIds.includes(factory.id),
    );

    for (const factory of selectedFactories) {
      factory.activeWorkOrders = Math.max(0, factory.activeWorkOrders - 1);
      factory.status = 'ready';
    }

    workOrder.status = 'awaiting-human-approval';
    workOrder.updatedAt = new Date().toISOString();
    return workOrder;
  }

  runtimeStatus() {
    return {
      totalFactories: this.store.factories.size,
      readyFactories: [...this.store.factories.values()].filter(
        (factory) => factory.status === 'ready',
      ).length,
      runningWorkOrders: [...this.store.workOrders.values()].filter(
        (workOrder) => workOrder.status === 'running',
      ).length,
      queuedWorkOrders: [...this.store.workOrders.values()].filter(
        (workOrder) => workOrder.status === 'queued',
      ).length,
      capacity: [...this.store.factories.values()].reduce(
        (total, factory) => total + factory.capacity,
        0,
      ),
      activeLoad: [...this.store.factories.values()].reduce(
        (total, factory) => total + factory.activeWorkOrders,
        0,
      ),
    };
  }
}