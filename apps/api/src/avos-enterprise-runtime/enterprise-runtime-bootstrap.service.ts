import { Injectable, OnModuleInit } from '@nestjs/common';
import { CapabilityDiscoveryService } from './capabilities/capability-discovery.service';
import { CapabilityLifecycleService } from './capabilities/capability-lifecycle.service';
import { CapabilityRegistryService } from './capabilities/capability-registry.service';
import { DependencyGraphService } from './capabilities/dependency-graph.service';
import { RuntimeEventBusService } from './events/runtime-event-bus.service';
import { RuntimeMetricsService } from './observability/runtime-metrics.service';

@Injectable()
export class EnterpriseRuntimeBootstrapService implements OnModuleInit {
  private booted = false;
  private bootedAt?: string;

  constructor(
    private readonly discovery: CapabilityDiscoveryService,
    private readonly registry: CapabilityRegistryService,
    private readonly dependencies: DependencyGraphService,
    private readonly lifecycle: CapabilityLifecycleService,
    private readonly events: RuntimeEventBusService,
    private readonly metrics: RuntimeMetricsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.boot();
  }

  async boot() {
    if (this.booted) {
      return this.status();
    }

    const startedAt = Date.now();
    this.events.publish({
      type: 'runtime.boot.started',
      source: 'enterprise-runtime-bootstrap',
      payload: {},
    });

    this.discovery.discoverFromManifest();
    const capabilities = this.registry.list();
    const order = this.dependencies.topologicalSort(capabilities);
    const activated = await this.lifecycle.activateAll(order);

    this.booted = true;
    this.bootedAt = new Date().toISOString();

    this.metrics.record({
      name: 'runtime.boot.duration',
      value: Date.now() - startedAt,
      unit: 'ms',
      tags: {
        runtime: 'avos-enterprise-runtime',
      },
    });

    this.events.publish({
      type: 'runtime.boot.completed',
      source: 'enterprise-runtime-bootstrap',
      payload: {
        capabilities: activated.length,
      },
    });

    return this.status();
  }

  status() {
    return {
      booted: this.booted,
      bootedAt: this.bootedAt,
      capabilities: this.registry.count(),
    };
  }
}