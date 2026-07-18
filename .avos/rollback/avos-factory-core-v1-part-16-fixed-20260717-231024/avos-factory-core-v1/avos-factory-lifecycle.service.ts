import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  AvosFactoryLifecycleSnapshot,
  AvosFactoryLifecycleState
} from "./avos-factory-operations.contracts";
import { AvosFactoryAuditService } from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryLifecycleService {
  private snapshot: AvosFactoryLifecycleSnapshot = {
    system: "AVOS Factory Core V1",
    state: "running",
    changedBy: "system:factory-bootstrap",
    humanApproved: true,
    changedAt: new Date().toISOString()
  };

  constructor(
    private readonly audit: AvosFactoryAuditService
  ) {}

  current(): AvosFactoryLifecycleSnapshot {
    return structuredClone(this.snapshot);
  }

  transition(input: {
    targetState: AvosFactoryLifecycleState;
    reason?: string;
    actor: string;
    approvedBy?: string;
    humanApproved: boolean;
  }): AvosFactoryLifecycleSnapshot {
    const protectedState = [
      "suspended",
      "maintenance",
      "stopping",
      "stopped",
      "failed"
    ].includes(input.targetState);

    if (
      protectedState &&
      (
        input.humanApproved !== true ||
        !input.approvedBy?.trim()
      )
    ) {
      throw new BadRequestException(
        "Lifecycle transition requires Human Final Authority approval."
      );
    }

    const previousState = this.snapshot.state;

    this.snapshot = {
      system: "AVOS Factory Core V1",
      state: input.targetState,
      previousState,
      reason: input.reason,
      changedBy: input.actor,
      approvedBy: input.approvedBy,
      humanApproved: input.humanApproved,
      changedAt: new Date().toISOString()
    };

    this.audit.append({
      category: "operations",
      action: "factory-lifecycle-transition",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: "AVOS Factory Core V1",
      details: {
        previousState,
        currentState: input.targetState,
        reason: input.reason
      }
    });

    return this.current();
  }

  assertOperational(): void {
    if (this.snapshot.state !== "running") {
      throw new BadRequestException(
        `AVOS Factory is not operational. Current state: ${this.snapshot.state}`
      );
    }
  }
}
