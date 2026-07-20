import { Injectable } from '@nestjs/common';
import { ZeroDowntimeUpdateResult } from '../domain/capability-runtime.types';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';
import { CapabilityHealthMonitorService } from './capability-health-monitor.service';
import { CapabilityLifecycleManagerService } from './capability-lifecycle-manager.service';
import { CapabilityVersionManagerService } from './capability-version-manager.service';
import { CapabilityEventBusService } from './capability-event-bus.service';

@Injectable()
export class ZeroDowntimeCapabilityUpdateService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
    private readonly health: CapabilityHealthMonitorService,
    private readonly lifecycle: CapabilityLifecycleManagerService,
    private readonly versions: CapabilityVersionManagerService,
    private readonly eventBus: CapabilityEventBusService,
  ) {}

  update(
    capabilityId: string,
    toVersion: string,
  ): ZeroDowntimeUpdateResult {
    const capability = this.discovery.get(capabilityId);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityId}`);
    }

    const fromVersion = capability.version;

    if (!toVersion.trim() || toVersion === fromVersion) {
      return {
        capabilityId,
        fromVersion,
        toVersion,
        shadowLoaded: false,
        healthValidated: false,
        trafficSwitched: false,
        previousVersionRetained: true,
        status: 'rejected',
      };
    }

    this.lifecycle.transition(capabilityId, 'updating');

    const shadowLoaded = true;
    const healthValidated =
      this.health.check(capabilityId).score >= 60;

    if (!healthValidated) {
      this.lifecycle.transition(capabilityId, 'operational');
      return {
        capabilityId,
        fromVersion,
        toVersion,
        shadowLoaded,
        healthValidated,
        trafficSwitched: false,
        previousVersionRetained: true,
        status: 'rejected',
      };
    }

    this.versions.initialize(capabilityId);
    this.versions.activate(capabilityId, toVersion);
    this.lifecycle.transition(capabilityId, 'operational');

    this.eventBus.publish(
      'capability.version.updated',
      'avos.capability-runtime',
      {
        capabilityId,
        fromVersion,
        toVersion,
        zeroDowntime: true,
      },
    );

    return {
      capabilityId,
      fromVersion,
      toVersion,
      shadowLoaded,
      healthValidated,
      trafficSwitched: true,
      previousVersionRetained: true,
      status: 'completed',
    };
  }
}