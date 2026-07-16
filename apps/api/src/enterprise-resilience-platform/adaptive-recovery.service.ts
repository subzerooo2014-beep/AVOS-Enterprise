import { Injectable } from "@nestjs/common";
import { CircuitBreakerCenterService } from "./circuit-breaker-center.service";
import { FailoverRouterService } from "./failover-router.service";
import { RetryFrameworkService } from "./retry-framework.service";
import { TimeoutManagerService } from "./timeout-manager.service";

@Injectable()
export class AdaptiveRecoveryService {
  constructor(
    private readonly circuits: CircuitBreakerCenterService,
    private readonly retries: RetryFrameworkService,
    private readonly timeouts: TimeoutManagerService,
    private readonly failover: FailoverRouterService,
  ) {}

  async execute<T>(
    operationKey: string,
    retryPolicyId: string,
    timeoutPolicyId: string,
    handler: () => Promise<T>,
    failoverGroup?: string,
  ) {
    if (!this.circuits.canExecute(operationKey)) {
      return {
        success: false,
        mode: "CIRCUIT_OPEN",
        failoverTarget: failoverGroup
          ? this.failover.resolve(failoverGroup)
          : undefined,
      };
    }

    try {
      const execution = await this.retries.execute(
        retryPolicyId,
        () => this.timeouts.execute(timeoutPolicyId, handler),
      );

      this.circuits.success(operationKey);

      return {
        success: true,
        mode: "PRIMARY",
        attempts: execution.attempts,
        result: execution.result,
      };
    } catch (error) {
      this.circuits.failure(operationKey);

      return {
        success: false,
        mode: failoverGroup ? "FAILOVER" : "FAILED",
        error: error instanceof Error ? error.message : String(error),
        failoverTarget: failoverGroup
          ? this.failover.resolve(failoverGroup)
          : undefined,
      };
    }
  }
}
