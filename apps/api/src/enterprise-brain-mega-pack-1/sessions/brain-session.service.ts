import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainSession } from "../enterprise-brain-mega-pack-1.types";
import { BrainRuntimeService } from "../runtime/brain-runtime.service";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainSessionService {
  private readonly sessions =
    new Map<string, BrainSession>();

  constructor(
    private readonly runtime: BrainRuntimeService,
    private readonly audit: BrainAuditService
  ) {}

  list() {
    return Array.from(this.sessions.values());
  }

  get(id: string) {
    const session = this.sessions.get(id);

    if (!session) {
      throw new NotFoundException(
        `Enterprise Brain session not found: ${id}`
      );
    }

    return session;
  }

  create(input: {
    ownerIdentityId: string;
    organizationId?: string;
    title: string;
    metadata?: Record<string, unknown>;
    correlationId: string;
  }) {
    const runtime = this.runtime.getState();

    if (runtime.status !== "ready") {
      throw new Error(
        `Enterprise Brain runtime is not ready: ${runtime.status}`
      );
    }

    const now = new Date().toISOString();

    const session: BrainSession = {
      id: `brain-session:${Date.now()}:${this.sessions.size + 1}`,
      ownerIdentityId: input.ownerIdentityId,
      organizationId: input.organizationId,
      title: input.title,
      status: "active",
      contextIds: [],
      intentIds: [],
      goalIds: [],
      decisionIds: [],
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.sessions.set(session.id, session);

    this.runtime.updateCounters({
      activeSessions:
        this.list().filter((x) => x.status === "active").length
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "session",
      action: "enterprise-brain-session-created",
      subjectId: session.id,
      actorIdentityId: input.ownerIdentityId,
      outcome: "success",
      metadata: {
        title: session.title
      }
    });

    return session;
  }

  attach(
    sessionId: string,
    patch: {
      contextId?: string;
      intentId?: string;
      goalId?: string;
      decisionId?: string;
    }
  ) {
    const current = this.get(sessionId);

    const updated: BrainSession = {
      ...current,
      contextIds: patch.contextId
        ? Array.from(new Set([
            ...current.contextIds,
            patch.contextId
          ]))
        : current.contextIds,
      intentIds: patch.intentId
        ? Array.from(new Set([
            ...current.intentIds,
            patch.intentId
          ]))
        : current.intentIds,
      goalIds: patch.goalId
        ? Array.from(new Set([
            ...current.goalIds,
            patch.goalId
          ]))
        : current.goalIds,
      decisionIds: patch.decisionId
        ? Array.from(new Set([
            ...current.decisionIds,
            patch.decisionId
          ]))
        : current.decisionIds,
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(updated.id, updated);
    return updated;
  }

  complete(input: {
    sessionId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.sessionId);

    const updated: BrainSession = {
      ...current,
      status: "completed",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(updated.id, updated);

    this.runtime.updateCounters({
      activeSessions:
        this.list().filter((x) => x.status === "active").length
    });

    return updated;
  }

  summary() {
    const sessions = this.list();

    return {
      total: sessions.length,
      active: sessions.filter((x) => x.status === "active").length,
      completed: sessions.filter((x) => x.status === "completed").length,
      failed: sessions.filter((x) => x.status === "failed").length
    };
  }
}
