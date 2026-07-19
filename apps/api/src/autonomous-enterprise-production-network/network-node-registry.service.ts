import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnterpriseFactoryStore } from '../enterprise-factory/enterprise-factory.store';
import { AutonomousProductionNetworkStore } from './autonomous-production-network.store';
import { NetworkNode } from './autonomous-production-network.types';

@Injectable()
export class NetworkNodeRegistryService {
  constructor(
    private readonly enterpriseStore: EnterpriseFactoryStore,
    private readonly networkStore: AutonomousProductionNetworkStore,
  ) {}

  synchronize(): NetworkNode[] {
    const now = new Date().toISOString();

    for (const factory of this.enterpriseStore.factories.values()) {
      const existing = [...this.networkStore.nodes.values()].find(
        (node) => node.factoryNamespace === factory.namespace,
      );

      // FactoryStatus is intentionally normalized through String so this
      // adapter remains type-safe even when the source union expands.
      const factoryStatus = String(factory.status).trim().toLowerCase();

      const networkStatus: NetworkNode['status'] =
        factoryStatus === 'active' ||
        factoryStatus === 'operational' ||
        factoryStatus === 'ready' ||
        factoryStatus === 'healthy'
          ? 'online'
          : factoryStatus === 'degraded' ||
              factoryStatus === 'maintenance' ||
              factoryStatus === 'limited'
            ? 'degraded'
            : 'offline';

      const node: NetworkNode = {
        id:
          existing?.id ??
          `network-node:${Date.now()}:${randomUUID().slice(0, 8)}`,
        factoryNamespace: factory.namespace,
        nodeType: 'factory',
        status: networkStatus,
        region: 'global',
        capabilities: [...factory.capabilities],
        currentLoad: factory.activeWorkOrders,
        capacity: factory.capacity,
        healthScore:
          networkStatus === 'online'
            ? 100
            : networkStatus === 'degraded'
              ? 70
              : 30,
        registeredAt: existing?.registeredAt ?? now,
        updatedAt: now,
      };

      this.networkStore.nodes.set(node.id, node);
    }

    return this.list();
  }

  register(input: {
    factoryNamespace: string;
    nodeType?: NetworkNode['nodeType'];
    region?: string;
    capabilities: string[];
    capacity: number;
  }): NetworkNode {
    if (!input.factoryNamespace || input.capacity < 1) {
      throw new BadRequestException(
        'Valid factoryNamespace and capacity are required.',
      );
    }

    const existing = [...this.networkStore.nodes.values()].find(
      (node) => node.factoryNamespace === input.factoryNamespace,
    );

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const node: NetworkNode = {
      id: `network-node:${Date.now()}:${randomUUID().slice(0, 8)}`,
      factoryNamespace: input.factoryNamespace,
      nodeType: input.nodeType ?? 'factory',
      status: 'online',
      region: input.region ?? 'global',
      capabilities: [...new Set(input.capabilities)],
      currentLoad: 0,
      capacity: input.capacity,
      healthScore: 100,
      registeredAt: now,
      updatedAt: now,
    };

    this.networkStore.nodes.set(node.id, node);
    return node;
  }

  list(): NetworkNode[] {
    return [...this.networkStore.nodes.values()];
  }

  get(nodeId: string): NetworkNode {
    const node = this.networkStore.nodes.get(nodeId);
    if (!node) {
      throw new BadRequestException(`Network node not found: ${nodeId}`);
    }
    return node;
  }
}
