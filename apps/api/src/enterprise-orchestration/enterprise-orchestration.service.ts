import { Injectable } from "@nestjs/common";

import { SagaCoordinator } from "./engines/saga-coordinator";
import { CompensationEngine } from "./engines/compensation-engine";
import { RetryOrchestrator } from "./engines/retry-orchestrator";
import { EventDispatcher } from "./engines/event-dispatcher";

@Injectable()
export class EnterpriseOrchestrationService {
  constructor(
    private readonly saga: SagaCoordinator,
    private readonly compensation: CompensationEngine,
    private readonly retry: RetryOrchestrator,
    private readonly dispatcher: EventDispatcher,
  ) {}

  orchestrate(input: Record<string, any>) {
    const saga = this.saga.startSaga(input);
    const event = this.dispatcher.dispatch(saga);

    return {
      success: true,
      saga,
      event,
    };
  }

  compensate(input: Record<string, any>) {
    return this.compensation.compensate(input);
  }

  retryWorkflow(input: Record<string, any>) {
    return this.retry.retry(input);
  }

  status() {
    return {
      system: "AVOS Enterprise Orchestration",
      version: "E1.4",
      status: "running",
    };
  }
}
