import { Injectable } from '@nestjs/common';
import { RuntimeSnapshot } from './contracts/runtime.contracts';
import { CapabilityRegistryService } from './capabilities/capability-registry.service';
import { RuntimeEventStoreService } from './events/runtime-event-store.service';
import { RuntimeQueueService } from './automation/runtime-queue.service';
import { HumanApprovalService } from './governance/human-approval.service';
import { RuntimeHealthService } from './observability/runtime-health.service';

@Injectable()
export class EnterpriseRuntimeSnapshotService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly events: RuntimeEventStoreService,
    private readonly queue: RuntimeQueueService,
    private readonly approvals: HumanApprovalService,
    private readonly health: RuntimeHealthService,
  ) {}

  create(): RuntimeSnapshot {
    const capabilities = this.registry.list();
    const health = this.health.snapshot();

    return {
      generatedAt: new Date().toISOString(),
      capabilities: {
        total: capabilities.length,
        active: capabilities.filter((item) => item.state === 'active').length,
        degraded: capabilities.filter((item) => item.state === 'degraded').length,
        failed: capabilities.filter((item) => item.state === 'failed').length,
      },
      events: this.events.count(),
      jobs: this.queue.count(),
      approvals: this.approvals.count(),
      health: health.status,
    };
  }
}