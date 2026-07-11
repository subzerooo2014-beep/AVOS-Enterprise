import { Injectable } from "@nestjs/common";
import { RuntimeControlMode } from "../contracts/runtime-resilience.enums";
import { ChangeRuntimeControlModeDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
import { EvidenceEntryType } from "../contracts/runtime-resilience.enums";

@Injectable()
export class RuntimeControlModeService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
  ) {}

  get(): {
    controlMode: RuntimeControlMode;
    observedAt: string;
  } {
    return {
      controlMode: this.store.getControlMode(),
      observedAt: new Date().toISOString(),
    };
  }

  change(dto: ChangeRuntimeControlModeDto): {
    previousControlMode: RuntimeControlMode;
    controlMode: RuntimeControlMode;
    changedAt: string;
  } {
    const previousControlMode = this.store.getControlMode();

    this.store.setControlMode(dto.controlMode);

    const changedAt = new Date().toISOString();

    this.evidence.append({
      type: EvidenceEntryType.CONTROL_MODE_CHANGED,
      aggregateType: "runtime_control_plane",
      aggregateId: "global",
      actor: dto.actor,
      payload: {
        previousControlMode,
        controlMode: dto.controlMode,
        reason: dto.reason,
        changedAt,
      },
    });

    return {
      previousControlMode,
      controlMode: dto.controlMode,
      changedAt,
    };
  }
}
