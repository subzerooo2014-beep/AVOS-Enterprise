import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelModeTransition,
  KernelOperationalMode
} from "../enterprise-kernel-mega-pack-4.types";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelOperationalModeService {
  private mode: KernelOperationalMode = "normal";
  private readonly transitions: KernelModeTransition[] = [];

  constructor(
    private readonly audit: KernelResilienceAuditService
  ) {}

  current() {
    return {
      mode: this.mode,
      lastTransition:
        this.transitions.length === 0
          ? undefined
          : this.transitions[this.transitions.length - 1]
    };
  }

  listTransitions() {
    return [...this.transitions];
  }

  transition(input: {
    toMode: KernelOperationalMode;
    reason: string;
    actorIdentityId: string;
    correlationId: string;
    humanApproved: boolean;
  }) {
    if (
      ["safe", "emergency", "maintenance"].includes(input.toMode) &&
      !input.humanApproved
    ) {
      throw new ConflictException(
        `Kernel mode ${input.toMode} requires human approval.`
      );
    }

    const transition: KernelModeTransition = {
      id: `kernel-mode-transition:${Date.now()}:${this.transitions.length + 1}`,
      fromMode: this.mode,
      toMode: input.toMode,
      reason: input.reason,
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId,
      humanApproved: input.humanApproved,
      occurredAt: new Date().toISOString()
    };

    this.mode = input.toMode;
    this.transitions.push(transition);

    this.audit.record({
      correlationId: input.correlationId,
      category: "mode",
      action: `kernel-mode:${input.toMode}`,
      subjectId: transition.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        input.toMode === "emergency"
          ? "failure"
          : input.toMode === "degraded" || input.toMode === "safe"
            ? "warning"
            : "success",
      metadata: {
        fromMode: transition.fromMode,
        toMode: transition.toMode,
        humanApproved: transition.humanApproved
      }
    });

    return transition;
  }

  summary() {
    return {
      currentMode: this.mode,
      transitions: this.transitions.length,
      safeModeEntries: this.transitions.filter((x) => x.toMode === "safe").length,
      degradedModeEntries: this.transitions.filter((x) => x.toMode === "degraded").length,
      emergencyEntries: this.transitions.filter((x) => x.toMode === "emergency").length
    };
  }
}
