import { Injectable } from '@nestjs/common';
import { IntegrationSnapshot } from './contracts/integration.contracts';
import { EnterpriseKernelBridgeService } from './kernel/enterprise-kernel-bridge.service';
import { RuntimeEventBridgeService } from './events/runtime-event-bridge.service';
import { RuntimePersistenceService } from './persistence/runtime-persistence.service';
import { IntegrationHealthAggregatorService } from './observability/integration-health-aggregator.service';
import { RuntimeIntegrationBootstrapService } from './runtime-integration-bootstrap.service';

@Injectable()
export class RuntimeIntegrationSnapshotService {
  constructor(
    private readonly kernel: EnterpriseKernelBridgeService,
    private readonly events: RuntimeEventBridgeService,
    private readonly persistence: RuntimePersistenceService,
    private readonly health: IntegrationHealthAggregatorService,
    private readonly bootstrap: RuntimeIntegrationBootstrapService,
  ) {}

  async create(): Promise<IntegrationSnapshot> {
    const health = await this.health.snapshot();
    const persistence = await this.persistence.health();
    const bootstrap = this.bootstrap.status();

    return {
      generatedAt: new Date().toISOString(),
      ready: bootstrap.initialized && health.healthy,
      mode:
        persistence.mode === 'database' ? 'native' : 'fallback',
      components: health.components,
      kernelRegistrations: this.kernel.count(),
      persistentRecords: await this.persistence.count(),
      bridgeEvents: this.events.count(),
      validationErrors: bootstrap.validationErrors,
    };
  }
}