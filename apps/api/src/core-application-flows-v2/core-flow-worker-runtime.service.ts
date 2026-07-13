import { Injectable } from "@nestjs/common";
import { CoreFlowDurableRuntimeService } from "./core-flow-durable-runtime.service";
import { CoreFlowWorkerRegistryService } from "./core-flow-worker-registry.service";
import { CoreFlowDurableMessagingService } from "./core-flow-durable-messaging.service";

@Injectable()
export class CoreFlowWorkerRuntimeService {
  constructor(
    private readonly runtime: CoreFlowDurableRuntimeService,
    private readonly workers: CoreFlowWorkerRegistryService,
    private readonly messaging: CoreFlowDurableMessagingService,
  ) {}

  async claimAndProcess(workerId: string, executionId: string) {
    await this.workers.heartbeat(workerId);
    const lease = await this.runtime.acquire(executionId, workerId, 60_000);
    if (!lease.acquired) {
      return { acquired: false, executionId, workerId };
    }

    await this.runtime.checkpoint(executionId, "worker-claimed", { workerId });
    await this.messaging.enqueueOutbox("core-flow.execution.claimed", {
      executionId,
      workerId,
    });

    return {
      acquired: true,
      execution: lease.execution,
      workerId,
      claimedAt: new Date().toISOString(),
    };
  }

  async dashboard() {
    return {
      workers: await this.workers.findAll(),
      runtime: await this.runtime.dashboard(),
      messaging: await this.messaging.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
