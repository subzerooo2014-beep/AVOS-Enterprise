import { Injectable } from '@nestjs/common';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';
import { CapabilityPermissionsService } from './capability-permissions.service';
import { CapabilityEventBusService } from './capability-event-bus.service';
import { CapabilityHealthMonitorService } from './capability-health-monitor.service';

@Injectable()
export class CapabilityServiceMeshService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
    private readonly permissions: CapabilityPermissionsService,
    private readonly eventBus: CapabilityEventBusService,
    private readonly health: CapabilityHealthMonitorService,
  ) {}

  route(
    sourceCapabilityId: string,
    targetCapabilityId: string,
    action: string,
    payload: unknown,
  ) {
    const source = this.discovery.get(sourceCapabilityId);
    const target = this.discovery.get(targetCapabilityId);

    if (!source || !target) {
      return {
        routed: false,
        reason: 'source-or-target-not-found',
      };
    }

    const permission = this.permissions.evaluate(
      sourceCapabilityId,
      'capability.execute',
    );

    const targetHealth = this.health.check(targetCapabilityId);

    if (!permission.allowed) {
      return {
        routed: false,
        reason: permission.reason,
        permission,
        targetHealth,
      };
    }

    if (targetHealth.state === 'unhealthy') {
      return {
        routed: false,
        reason: 'target-unhealthy',
        permission,
        targetHealth,
      };
    }

    const event = this.eventBus.publish(
      'service-mesh.request',
      sourceCapabilityId,
      {
        targetCapabilityId,
        action,
        payload,
      },
    );

    return {
      routed: true,
      route: `${sourceCapabilityId}->${targetCapabilityId}`,
      action,
      eventId: event.id,
      targetHealth,
    };
  }
}