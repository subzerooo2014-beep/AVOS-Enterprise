import { Injectable } from "@nestjs/common";
import {
  GovernanceAuditEventType,
  GovernanceControlMode,
} from "../contracts";
import {
  ChangeGovernanceControlModeDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeGovernanceControlModeService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  get(): {
    controlMode: GovernanceControlMode;
    observedAt: string;
  } {
    return {
      controlMode:
        this.store.getControlMode(),
      observedAt:
        new Date().toISOString(),
    };
  }

  change(
    dto:
      ChangeGovernanceControlModeDto,
  ): {
    previousControlMode:
      GovernanceControlMode;
    controlMode:
      GovernanceControlMode;
    changedAt: string;
  } {
    const previousControlMode =
      this.store.getControlMode();

    this.store.setControlMode(
      dto.controlMode,
    );

    const changedAt =
      new Date().toISOString();

    this.audit.append({
      type:
        GovernanceAuditEventType
          .CONTROL_MODE_CHANGED,
      aggregateType:
        "runtime_governance",
      aggregateId: "global",
      actor: dto.actor,
      payload: {
        previousControlMode,
        controlMode:
          dto.controlMode,
        reason: dto.reason,
        changedAt,
      },
    });

    return {
      previousControlMode,
      controlMode:
        dto.controlMode,
      changedAt,
    };
  }
}
