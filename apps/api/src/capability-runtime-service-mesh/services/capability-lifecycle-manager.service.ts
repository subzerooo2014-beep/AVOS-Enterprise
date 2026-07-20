import { Injectable } from '@nestjs/common';
import { CapabilityState } from '../domain/capability-runtime.types';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';
import { CapabilityEventBusService } from './capability-event-bus.service';

@Injectable()
export class CapabilityLifecycleManagerService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
    private readonly eventBus: CapabilityEventBusService,
  ) {}

  transition(capabilityId: string, state: CapabilityState) {
    const updated = this.discovery.update(capabilityId, { state });

    this.eventBus.publish(
      'capability.lifecycle.changed',
      'avos.capability-runtime',
      {
        capabilityId,
        state,
      },
    );

    return updated;
  }

  start(capabilityId: string) {
    return this.transition(capabilityId, 'operational');
  }

  stop(capabilityId: string) {
    return this.transition(capabilityId, 'stopped');
  }
}