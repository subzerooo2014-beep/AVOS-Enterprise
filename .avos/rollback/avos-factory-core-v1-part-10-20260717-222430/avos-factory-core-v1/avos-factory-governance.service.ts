import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  FactoryOperationalPolicy
} from "./avos-factory-operational.contracts";

@Injectable()
export class AvosFactoryGovernanceService {
  private readonly policy: FactoryOperationalPolicy = {
    maxConcurrentExecutions: 5,
    maxExecutionsPerActorPerHour: 50,
    idempotencyRetentionMinutes: 60,
    lockTimeoutSeconds: 300,
    auditRetention: 5000,
    requireHumanApprovalForOverwrite: true,
    requireHumanApprovalForRollback: true,
    requireHumanApprovalForCertification: true
  };

  getPolicy(): FactoryOperationalPolicy {
    return structuredClone(this.policy);
  }

  assertHumanApproval(input: {
    operation: string;
    humanApproved?: boolean;
    approvedBy?: string;
  }): void {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        `${input.operation} requires Human Final Authority approval.`
      );
    }
  }

  assertExecutionAllowed(input: {
    actor: string;
    activeExecutions: number;
    actorExecutionsLastHour: number;
  }): void {
    if (!input.actor?.trim()) {
      throw new BadRequestException(
        "Execution actor is required."
      );
    }

    if (
      input.activeExecutions >=
      this.policy.maxConcurrentExecutions
    ) {
      throw new BadRequestException(
        "AVOS Factory concurrent execution limit reached."
      );
    }

    if (
      input.actorExecutionsLastHour >=
      this.policy.maxExecutionsPerActorPerHour
    ) {
      throw new BadRequestException(
        "AVOS Factory actor execution quota reached."
      );
    }
  }
}
