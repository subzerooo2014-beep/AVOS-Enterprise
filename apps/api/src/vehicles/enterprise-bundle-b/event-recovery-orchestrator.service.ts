import { Injectable } from "@nestjs/common";
import { RetryPolicyEngineService } from "./retry-policy-engine.service";
import { DeadLetterQueueService } from "./dead-letter-queue.service";

@Injectable()
export class EventRecoveryOrchestratorService {
  constructor(
    private readonly retryPolicy: RetryPolicyEngineService,
    private readonly deadLetterQueue: DeadLetterQueueService,
  ) {}

  recover(input: {
    eventId: string;
    attempts: number;
    maxAttempts: number;
    severity: number;
    error: string;
  }) {
    const policy = this.retryPolicy.evaluate(input);

    if (policy.retryAllowed) {
      return {
        action: "RETRY",
        nextDelayMs: policy.nextDelayMs,
      };
    }

    const record = this.deadLetterQueue.add(input);

    return {
      action: "DEAD_LETTER",
      record,
    };
  }
}
