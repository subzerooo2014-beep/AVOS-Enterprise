import {
  ConflictException,
  Injectable
} from "@nestjs/common";
import { BrainRuntimeState } from "../enterprise-brain-mega-pack-1.types";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainRuntimeService {
  private state: BrainRuntimeState = {
    id: "enterprise-brain:runtime",
    status: "stopped",
    version: "1.0.0",
    activeSessions: 0,
    activeGoals: 0,
    pendingDecisions: 0,
    safeMode: false,
    degradedReasons: [],
    updatedAt: new Date().toISOString()
  };

  constructor(
    private readonly audit: BrainAuditService
  ) {}

  getState() {
    return { ...this.state };
  }

  start(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    if (
      this.state.status === "ready" ||
      this.state.status === "starting"
    ) {
      return this.getState();
    }

    this.state = {
      ...this.state,
      status: "starting",
      startedAt: new Date().toISOString(),
      stoppedAt: undefined,
      updatedAt: new Date().toISOString()
    };

    this.state = {
      ...this.state,
      status: "ready",
      updatedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "runtime",
      action: "enterprise-brain-runtime-started",
      subjectId: this.state.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        version: this.state.version
      }
    });

    return this.getState();
  }

  stop(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    if (this.state.activeSessions > 0) {
      throw new ConflictException(
        "Enterprise Brain runtime cannot stop while active sessions exist."
      );
    }

    this.state = {
      ...this.state,
      status: "stopped",
      stoppedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "runtime",
      action: "enterprise-brain-runtime-stopped",
      subjectId: this.state.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {}
    });

    return this.getState();
  }

  enterSafeMode(input: {
    actorIdentityId: string;
    correlationId: string;
    reason: string;
    humanApproved: boolean;
  }) {
    if (!input.humanApproved) {
      throw new ConflictException(
        "Enterprise Brain safe mode requires human approval."
      );
    }

    this.state = {
      ...this.state,
      status: "safe",
      safeMode: true,
      degradedReasons: Array.from(
        new Set([
          ...this.state.degradedReasons,
          input.reason
        ])
      ),
      updatedAt: new Date().toISOString()
    };

    return this.getState();
  }

  exitSafeMode(input: {
    actorIdentityId: string;
    correlationId: string;
    humanApproved: boolean;
  }) {
    if (!input.humanApproved) {
      throw new ConflictException(
        "Enterprise Brain safe mode exit requires human approval."
      );
    }

    this.state = {
      ...this.state,
      status: "ready",
      safeMode: false,
      degradedReasons: [],
      updatedAt: new Date().toISOString()
    };

    return this.getState();
  }

  updateCounters(input: {
    activeSessions?: number;
    activeGoals?: number;
    pendingDecisions?: number;
  }) {
    this.state = {
      ...this.state,
      activeSessions:
        input.activeSessions ??
        this.state.activeSessions,
      activeGoals:
        input.activeGoals ??
        this.state.activeGoals,
      pendingDecisions:
        input.pendingDecisions ??
        this.state.pendingDecisions,
      updatedAt: new Date().toISOString()
    };

    return this.getState();
  }

  summary() {
    return this.getState();
  }
}
