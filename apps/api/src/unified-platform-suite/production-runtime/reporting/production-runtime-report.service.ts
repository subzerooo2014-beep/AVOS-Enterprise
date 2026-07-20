import { Injectable } from "@nestjs/common";
import { UltraSuiteAdapterRegistryService } from "../adapters/ultra-suite-adapter-registry.service";
import { ProductionRuntimeCertificationService } from "../certification/production-runtime-certification.service";
import { DistributedTaskRuntimeService } from "../distributed/distributed-task-runtime.service";
import { RuntimeNodeRegistryService } from "../distributed/runtime-node-registry.service";
import { IdempotentInboxService } from "../messaging/idempotent-inbox.service";
import { TransactionalOutboxService } from "../messaging/transactional-outbox.service";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";

@Injectable()
export class ProductionRuntimeReportService {
  constructor(
    private readonly persistence: ProductionPersistenceService,
    private readonly adapters: UltraSuiteAdapterRegistryService,
    private readonly nodes: RuntimeNodeRegistryService,
    private readonly tasks: DistributedTaskRuntimeService,
    private readonly outbox: TransactionalOutboxService,
    private readonly inbox: IdempotentInboxService,
    private readonly certification: ProductionRuntimeCertificationService
  ) {}

  async generate() {
    const adapterHealth = await this.adapters.healthAll();
    const connectedAdapters = adapterHealth.filter(
      (item) => (item as { connected?: boolean }).connected === true
    ).length;
    return {
      name: "AVOS Unified Platform Production Runtime Report",
      version: "UPS-MP2-1.0.0",
      persistence: this.persistence.status(),
      adapters: {
        registered: this.adapters.list().length,
        connected: connectedAdapters,
        health: adapterHealth
      },
      distributedRuntime: {
        activeNodes: (await this.nodes.listActive()).length,
        tasks: await this.tasks.metrics()
      },
      durableMessaging: {
        outbox: await this.outbox.metrics(),
        inbox: await this.inbox.metrics()
      },
      certification: this.certification.status(),
      productionCapabilities: [
        "Durable Platform Persistence",
        "Transactional Outbox",
        "Idempotent Inbox",
        "Real Ultra-Suite Adapter Contracts",
        "Distributed Node Registry",
        "Distributed Task Leasing",
        "Lease Recovery",
        "Workflow Checkpoints",
        "Dead Letter Handling",
        "Production Runtime Certification"
      ],
      recommendations: [
        "Set suite-specific base URLs when Ultra Suites run as separate deployments.",
        "Replace durable JSON driver with PostgreSQL/Prisma for multi-node writes.",
        "Connect outbox dispatch to Kafka, NATS, RabbitMQ, or the approved AVOS event infrastructure.",
        "Add mTLS and workload identity before external network deployment."
      ],
      generatedAt: new Date().toISOString()
    };
  }
}