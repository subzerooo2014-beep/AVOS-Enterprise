import { Injectable } from '@nestjs/common';
import { RuntimeHealthService } from '../../avos-enterprise-runtime/observability/runtime-health.service';
import { RuntimePersistenceService } from '../persistence/runtime-persistence.service';
import { EnterpriseKernelBridgeService } from '../kernel/enterprise-kernel-bridge.service';
import { RuntimeEventBridgeService } from '../events/runtime-event-bridge.service';
import { IntegrationComponentStatus } from '../contracts/integration.contracts';

@Injectable()
export class IntegrationHealthAggregatorService {
  constructor(
    private readonly runtimeHealth: RuntimeHealthService,
    private readonly persistence: RuntimePersistenceService,
    private readonly kernel: EnterpriseKernelBridgeService,
    private readonly eventBridge: RuntimeEventBridgeService,
  ) {}

  async snapshot(): Promise<{
    healthy: boolean;
    components: IntegrationComponentStatus[];
  }> {
    const checkedAt = new Date().toISOString();
    const runtime = this.runtimeHealth.snapshot();
    const persistence = await this.persistence.health();

    const components: IntegrationComponentStatus[] = [
      {
        component: 'enterprise-runtime',
        mode: 'native',
        connected: true,
        healthy: runtime.status !== 'unhealthy',
        details: runtime,
        checkedAt,
      },
      {
        component: 'persistence',
        mode:
          persistence.mode === 'database' ? 'native' : 'fallback',
        connected: true,
        healthy: persistence.healthy,
        details: persistence.details,
        checkedAt,
      },
      {
        component: 'enterprise-kernel',
        mode: this.kernel.mode(),
        connected: this.kernel.count() > 0,
        healthy: this.kernel.count() > 0,
        details: {
          registrations: this.kernel.count(),
        },
        checkedAt,
      },
      {
        component: 'event-bridge',
        mode: this.eventBridge.mode(),
        connected: true,
        healthy: true,
        details: {
          bridgedEvents: this.eventBridge.count(),
        },
        checkedAt,
      },
    ];

    return {
      healthy: components.every((component) => component.healthy),
      components,
    };
  }
}