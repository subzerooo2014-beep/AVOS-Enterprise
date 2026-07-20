import { Injectable } from '@nestjs/common';
import { CapabilityDiscoveryRegistryService } from './capability-discovery-registry.service';
import { CapabilityHealthMonitorService } from './capability-health-monitor.service';
import { CapabilityDependencyGraphService } from './capability-dependency-graph.service';
import { CapabilityServiceMeshService } from './capability-service-mesh.service';
import { CapabilityEventBusService } from './capability-event-bus.service';
import { CapabilityPermissionsService } from './capability-permissions.service';

@Injectable()
export class CapabilityRuntimeOrchestratorService {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
    private readonly health: CapabilityHealthMonitorService,
    private readonly dependencies: CapabilityDependencyGraphService,
    private readonly mesh: CapabilityServiceMeshService,
    private readonly events: CapabilityEventBusService,
    private readonly permissions: CapabilityPermissionsService,
  ) {}

  status() {
    const capabilities = this.discovery.list();
    const health = this.health.summary();
    const dependencyValidation = this.dependencies.validate();

    return {
      name: 'AVOS Capability Runtime & Service Mesh',
      version: 'CRSM-1.0.0',
      status:
        health.unhealthy === 0 && dependencyValidation.valid
          ? 'operational'
          : 'degraded',
      registeredCapabilities: capabilities.length,
      health,
      dependencyValidation,
      components: {
        capabilityDiscoveryRegistry: true,
        capabilityHealthMonitor: true,
        capabilityDependencyGraph: true,
        dynamicCapabilityLoading: true,
        capabilityLifecycleManager: true,
        internalServiceMesh: true,
        unifiedEventBus: true,
        capabilityPermissions: true,
        capabilityVersionManager: true,
        zeroDowntimeCapabilityUpdates: true,
      },
      foundationFirst: true,
      capabilityFirst: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  smoke() {
    const route = this.mesh.route(
      'avos.factory',
      'avos.apcp.production-certification',
      'production.certify',
      { release: 'smoke' },
    );

    const permission = this.permissions.evaluate(
      'avos.factory',
      'capability.execute',
    );

    this.events.publish(
      'capability-runtime.smoke',
      'avos.capability-runtime',
      { passed: route.routed && permission.allowed },
    );

    const status = this.status();

    return {
      status:
        status.status === 'operational' &&
        route.routed &&
        permission.allowed
          ? 'passed'
          : 'failed',
      runtime: status,
      route,
      permission,
      eventCount: this.events.list().length,
    };
  }
}