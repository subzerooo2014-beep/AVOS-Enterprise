import { Injectable } from "@nestjs/common";
import { EventsService } from "../events/events.service";
import { CoreFlowOutboxService } from "./core-flow-outbox.service";

@Injectable()
export class CoreFlowWorkerService {
  constructor(
    private readonly outbox: CoreFlowOutboxService,
    private readonly events: EventsService,
  ) {}

  async processNext() {
    const operation = this.outbox.claimNext();
    if (!operation) {
      return { processed: false, reason: "queue-empty" };
    }

    try {
      const result = {
        acknowledged: true,
        flow: operation.flow,
        aggregateType: operation.aggregateType,
        aggregateId: operation.aggregateId,
        payload: operation.payload,
        processedAt: new Date().toISOString(),
      };

      const completed = this.outbox.complete(operation.id, result);
      const event = this.events.create({
        type: "CoreFlowOperationCompleted",
        aggregateType: operation.aggregateType,
        aggregateId: operation.aggregateId,
        payload: {
          operationId: operation.id,
          flow: operation.flow,
          correlationId: operation.correlationId,
        },
      });

      return { processed: true, operation: completed, event };
    } catch (error) {
      return {
        processed: false,
        operation: this.outbox.fail(operation.id, error),
      };
    }
  }

  async processBatch(limit = 20) {
    const safeLimit = Math.min(Math.max(Number(limit || 20), 1), 100);
    const results = [];
    for (let index = 0; index < safeLimit; index += 1) {
      const result = await this.processNext();
      results.push(result);
      if (!result.processed && result.reason === "queue-empty") break;
    }

    return {
      requested: safeLimit,
      processed: results.filter((result) => result.processed).length,
      results,
      executedAt: new Date().toISOString(),
    };
  }
}
