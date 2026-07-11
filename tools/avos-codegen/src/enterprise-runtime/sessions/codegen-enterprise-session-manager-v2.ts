import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenEnterpriseGenerationRequest,
  CodeGenEnterpriseGenerationSession,
  CodeGenEnterpriseSessionStatus,
} from "../contracts/codegen-enterprise-runtime.contracts";
import {
  CodeGenEnterpriseSessionStore,
} from "./codegen-enterprise-session-store";

export class CodeGenEnterpriseSessionManagerV2 {
  constructor(
    readonly store =
      new CodeGenEnterpriseSessionStore(),
  ) {}

  create(
    request:
      CodeGenEnterpriseGenerationRequest,
  ): CodeGenEnterpriseGenerationSession {
    const now =
      new Date().toISOString();

    const session:
      CodeGenEnterpriseGenerationSession = {
      id:
        randomUUID(),
      request:
        structuredClone(request),
      status:
        CodeGenEnterpriseSessionStatus.CREATED,
      artifacts:
        structuredClone(
          request.artifacts,
        ),
      warnings: [],
      errors: [],
      timeline: [
        {
          status:
            CodeGenEnterpriseSessionStatus.CREATED,
          message:
            "Enterprise generation session created",
          metadata: {},
          occurredAt:
            now,
        },
      ],
      metrics: {
        artifacts:
          request.artifacts.length,
        generated: 0,
        skipped: 0,
        failed: 0,
        cacheHits: 0,
        cacheMisses: 0,
      },
      createdAt:
        now,
      updatedAt:
        now,
    };

    return this.store.save(
      session,
    );
  }

  transition(
    sessionId: string,
    status:
      CodeGenEnterpriseSessionStatus,
    message: string,
    metadata:
      Record<
        string,
        string | number | boolean
      > = {},
  ): CodeGenEnterpriseGenerationSession {
    const session =
      this.store.get(
        sessionId,
      );

    this.assertTransition(
      session.status,
      status,
    );

    const now =
      new Date().toISOString();

    session.status =
      status;

    session.timeline.push({
      status,
      message,
      metadata:
        structuredClone(metadata),
      occurredAt:
        now,
    });

    session.updatedAt =
      now;

    if (
      status ===
        CodeGenEnterpriseSessionStatus.EXECUTING &&
      !session.startedAt
    ) {
      session.startedAt =
        now;
    }

    if (
      [
        CodeGenEnterpriseSessionStatus.COMPLETED,
        CodeGenEnterpriseSessionStatus.FAILED,
        CodeGenEnterpriseSessionStatus.CANCELLED,
        CodeGenEnterpriseSessionStatus.ROLLED_BACK,
      ].includes(status)
    ) {
      session.completedAt =
        now;
    }

    return this.store.save(
      session,
    );
  }

  addWarning(
    sessionId: string,
    warning: string,
  ): CodeGenEnterpriseGenerationSession {
    const session =
      this.store.get(
        sessionId,
      );

    session.warnings.push(
      warning,
    );

    session.updatedAt =
      new Date().toISOString();

    return this.store.save(
      session,
    );
  }

  addError(
    sessionId: string,
    error: string,
  ): CodeGenEnterpriseGenerationSession {
    const session =
      this.store.get(
        sessionId,
      );

    session.errors.push(
      error,
    );

    session.metrics.failed +=
      1;

    session.updatedAt =
      new Date().toISOString();

    return this.store.save(
      session,
    );
  }

  updateMetrics(
    sessionId: string,
    input: Partial<
      CodeGenEnterpriseGenerationSession["metrics"]
    >,
  ): CodeGenEnterpriseGenerationSession {
    const session =
      this.store.get(
        sessionId,
      );

    session.metrics = {
      ...session.metrics,
      ...input,
    };

    session.updatedAt =
      new Date().toISOString();

    return this.store.save(
      session,
    );
  }

  cancel(
    sessionId: string,
    reason = "Session cancelled",
  ): CodeGenEnterpriseGenerationSession {
    return this.transition(
      sessionId,
      CodeGenEnterpriseSessionStatus.CANCELLED,
      reason,
    );
  }

  private assertTransition(
    from:
      CodeGenEnterpriseSessionStatus,
    to:
      CodeGenEnterpriseSessionStatus,
  ): void {
    const allowed:
      Record<
        CodeGenEnterpriseSessionStatus,
        readonly CodeGenEnterpriseSessionStatus[]
      > = {
      [CodeGenEnterpriseSessionStatus.CREATED]: [
        CodeGenEnterpriseSessionStatus.INITIALIZING,
        CodeGenEnterpriseSessionStatus.CANCELLED,
        CodeGenEnterpriseSessionStatus.FAILED,
      ],
      [CodeGenEnterpriseSessionStatus.INITIALIZING]: [
        CodeGenEnterpriseSessionStatus.READY,
        CodeGenEnterpriseSessionStatus.FAILED,
        CodeGenEnterpriseSessionStatus.CANCELLED,
      ],
      [CodeGenEnterpriseSessionStatus.READY]: [
        CodeGenEnterpriseSessionStatus.PLANNING,
        CodeGenEnterpriseSessionStatus.CANCELLED,
        CodeGenEnterpriseSessionStatus.FAILED,
      ],
      [CodeGenEnterpriseSessionStatus.PLANNING]: [
        CodeGenEnterpriseSessionStatus.SCHEDULING,
        CodeGenEnterpriseSessionStatus.FAILED,
      ],
      [CodeGenEnterpriseSessionStatus.SCHEDULING]: [
        CodeGenEnterpriseSessionStatus.EXECUTING,
        CodeGenEnterpriseSessionStatus.FAILED,
      ],
      [CodeGenEnterpriseSessionStatus.EXECUTING]: [
        CodeGenEnterpriseSessionStatus.VALIDATING,
        CodeGenEnterpriseSessionStatus.FAILED,
        CodeGenEnterpriseSessionStatus.ROLLING_BACK,
      ],
      [CodeGenEnterpriseSessionStatus.VALIDATING]: [
        CodeGenEnterpriseSessionStatus.COMMITTING,
        CodeGenEnterpriseSessionStatus.FAILED,
        CodeGenEnterpriseSessionStatus.ROLLING_BACK,
      ],
      [CodeGenEnterpriseSessionStatus.COMMITTING]: [
        CodeGenEnterpriseSessionStatus.COMPLETED,
        CodeGenEnterpriseSessionStatus.FAILED,
        CodeGenEnterpriseSessionStatus.ROLLING_BACK,
      ],
      [CodeGenEnterpriseSessionStatus.COMPLETED]: [],
      [CodeGenEnterpriseSessionStatus.FAILED]: [
        CodeGenEnterpriseSessionStatus.ROLLING_BACK,
      ],
      [CodeGenEnterpriseSessionStatus.CANCELLED]: [],
      [CodeGenEnterpriseSessionStatus.ROLLING_BACK]: [
        CodeGenEnterpriseSessionStatus.ROLLED_BACK,
        CodeGenEnterpriseSessionStatus.FAILED,
      ],
      [CodeGenEnterpriseSessionStatus.ROLLED_BACK]: [],
    };

    if (
      !allowed[from].includes(to)
    ) {
      throw new CodeGenValidationError(
        `Invalid enterprise session transition: ${from} -> ${to}`,
      );
    }
  }
}
