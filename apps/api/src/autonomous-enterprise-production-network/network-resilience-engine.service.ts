import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AutonomousProductionNetworkStore } from './autonomous-production-network.store';
import { ResilienceEvent } from './autonomous-production-network.types';

@Injectable()
export class NetworkResilienceEngineService {
  constructor(private readonly store: AutonomousProductionNetworkStore) {}

  degrade(
    nodeId: string,
    severity: ResilienceEvent['severity'],
  ): ResilienceEvent {
    const node = this.store.nodes.get(nodeId);
    if (!node) {
      throw new BadRequestException(`Network node not found: ${nodeId}`);
    }

    node.status = severity === 'critical' ? 'offline' : 'degraded';
    node.healthScore =
      severity === 'critical' ? 20 : severity === 'high' ? 50 : 70;
    node.updatedAt = new Date().toISOString();

    const affectedWorkloads = [...this.store.workloads.values()]
      .filter((workload) => workload.assignedNodes.includes(nodeId))
      .map((workload) => workload.id);

    const event: ResilienceEvent = {
      id: `resilience-event:${Date.now()}:${randomUUID().slice(0, 8)}`,
      nodeId,
      eventType: severity === 'critical' ? 'failure' : 'degradation',
      severity,
      actionTaken:
        severity === 'critical'
          ? 'Node isolated and workloads marked for rerouting'
          : 'Node load reduced and resilience monitoring activated',
      affectedWorkloads,
      rollbackReady: true,
      createdAt: new Date().toISOString(),
    };

    this.store.resilienceEvents.push(event);
    return event;
  }

  recover(nodeId: string): ResilienceEvent {
    const node = this.store.nodes.get(nodeId);
    if (!node) {
      throw new BadRequestException(`Network node not found: ${nodeId}`);
    }

    node.status = 'online';
    node.healthScore = 100;
    node.updatedAt = new Date().toISOString();

    const event: ResilienceEvent = {
      id: `resilience-event:${Date.now()}:${randomUUID().slice(0, 8)}`,
      nodeId,
      eventType: 'recovery',
      severity: 'low',
      actionTaken: 'Node restored to active network service',
      affectedWorkloads: [],
      rollbackReady: true,
      createdAt: new Date().toISOString(),
    };

    this.store.resilienceEvents.push(event);
    return event;
  }

  events(): ResilienceEvent[] {
    return [...this.store.resilienceEvents];
  }
}
