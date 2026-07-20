import { Injectable } from "@nestjs/common";
import { UltraSuiteAdapterRegistryService } from "../adapters/ultra-suite-adapter-registry.service";
import { DistributedTaskRuntimeService } from "../distributed/distributed-task-runtime.service";
import { RuntimeNodeRegistryService } from "../distributed/runtime-node-registry.service";
import { IdempotentInboxService } from "../messaging/idempotent-inbox.service";
import { TransactionalOutboxService } from "../messaging/transactional-outbox.service";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";

@Injectable()
export class ProductionPlatformRuntimeService {
  constructor(
    private readonly persistence: ProductionPersistenceService,
    private readonly adapters: UltraSuiteAdapterRegistryService,
    private readonly nodes: RuntimeNodeRegistryService,
    private readonly tasks: DistributedTaskRuntimeService,
    private readonly outbox: TransactionalOutboxService,
    private readonly inbox: IdempotentInboxService
  ) {}

  async boot() {
    await this.persistence.initialize();
    const node = await this.nodes.heartbeat();
    const adapters = await this.adapters.refreshAll();
    const recovery = await this.tasks.recoverExpiredLeases();
    return {
      name: "AVOS Unified Platform Production Runtime",
      version: "UPS-MP2-1.0.0",
      status: "operational",
      persistence: this.persistence.status(),
      node,
      adapters,
      recovery,
      foundationFirst: true,
      capabilityFirst: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      bootedAt: new Date().toISOString()
    };
  }

  async status() {
    return {
      name: "AVOS Unified Platform Production Runtime",
      version: "UPS-MP2-1.0.0",
      status: "operational",
      persistence: this.persistence.status(),
      nodes: await this.nodes.listActive(),
      adapters: await this.adapters.healthAll(),
      tasks: await this.tasks.metrics(),
      outbox: await this.outbox.metrics(),
      inbox: await this.inbox.metrics(),
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      checkedAt: new Date().toISOString()
    };
  }
}