import { Injectable } from '@nestjs/common';
import { CapabilityRegistryService } from './capability-registry.service';
import { RuntimeEventBusService } from '../events/runtime-event-bus.service';

@Injectable()
export class CapabilityLifecycleService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly events: RuntimeEventBusService,
  ) {}

  async activateAll(order: string[]): Promise<string[]> {
    const activated: string[] = [];

    for (const id of order) {
      this.registry.updateState(id, 'initializing');
      this.events.publish({
        type: 'capability.initializing',
        source: 'capability-lifecycle',
        payload: { capabilityId: id },
      });

      this.registry.updateState(id, 'active');
      this.registry.updateHealth(id, 'healthy');

      this.events.publish({
        type: 'capability.activated',
        source: 'capability-lifecycle',
        payload: { capabilityId: id },
      });

      activated.push(id);
    }

    return activated;
  }

  suspend(id: string): void {
    this.registry.updateState(id, 'suspended');
    this.events.publish({
      type: 'capability.suspended',
      source: 'capability-lifecycle',
      payload: { capabilityId: id },
    });
  }

  retire(id: string): void {
    this.registry.updateState(id, 'retired');
    this.events.publish({
      type: 'capability.retired',
      source: 'capability-lifecycle',
      payload: { capabilityId: id },
    });
  }
}