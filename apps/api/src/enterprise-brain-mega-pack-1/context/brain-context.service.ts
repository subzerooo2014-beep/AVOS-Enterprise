import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainContextEntry } from "../enterprise-brain-mega-pack-1.types";
import { BrainSessionService } from "../sessions/brain-session.service";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainContextService {
  private readonly entries =
    new Map<string, BrainContextEntry>();

  constructor(
    private readonly sessions: BrainSessionService,
    private readonly audit: BrainAuditService
  ) {}

  list() {
    return Array.from(this.entries.values());
  }

  get(id: string) {
    const entry = this.entries.get(id);

    if (!entry) {
      throw new NotFoundException(
        `Enterprise Brain context not found: ${id}`
      );
    }

    return entry;
  }

  set(input: {
    scope: BrainContextEntry["scope"];
    scopeId: string;
    key: string;
    value: unknown;
    source: string;
    confidence?: number;
    sensitive?: boolean;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    if (input.scope === "session") {
      this.sessions.get(input.scopeId);
    }

    const existing = this.list().find(
      (entry) =>
        entry.scope === input.scope &&
        entry.scopeId === input.scopeId &&
        entry.key === input.key
    );

    const now = new Date().toISOString();

    const entry: BrainContextEntry = {
      id:
        existing?.id ??
        `brain-context:${Date.now()}:${this.entries.size + 1}`,
      scope: input.scope,
      scopeId: input.scopeId,
      key: input.key,
      value: input.value,
      source: input.source,
      confidence: Math.max(
        0,
        Math.min(100, input.confidence ?? 100)
      ),
      sensitive: input.sensitive ?? false,
      expiresAt: input.expiresAt,
      metadata: input.metadata ?? {},
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };

    this.entries.set(entry.id, entry);

    if (entry.scope === "session") {
      this.sessions.attach(entry.scopeId, {
        contextId: entry.id
      });
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "context",
      action: existing
        ? "enterprise-brain-context-updated"
        : "enterprise-brain-context-created",
      subjectId: entry.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        scope: entry.scope,
        key: entry.key,
        confidence: entry.confidence
      }
    });

    return entry;
  }

  resolve(input: {
    scopes: Array<{
      scope: BrainContextEntry["scope"];
      scopeId: string;
    }>;
    includeSensitive: boolean;
  }) {
    const now = Date.now();

    const items = this.list().filter((entry) => {
      const scopeMatch = input.scopes.some(
        (scope) =>
          scope.scope === entry.scope &&
          scope.scopeId === entry.scopeId
      );

      const notExpired =
        !entry.expiresAt ||
        new Date(entry.expiresAt).getTime() > now;

      const sensitiveAllowed =
        !entry.sensitive ||
        input.includeSensitive;

      return (
        scopeMatch &&
        notExpired &&
        sensitiveAllowed
      );
    });

    const resolved: Record<string, unknown> = {};

    for (const item of items.sort(
      (left, right) =>
        left.confidence - right.confidence
    )) {
      resolved[item.key] = item.value;
    }

    return {
      items,
      resolved,
      resolvedAt: new Date().toISOString()
    };
  }

  delete(input: {
    contextId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.contextId);

    if (
      current.scope === "global" &&
      current.sensitive
    ) {
      throw new ConflictException(
        "Sensitive global context cannot be deleted without a governed lifecycle."
      );
    }

    this.entries.delete(current.id);
    return current;
  }

  summary() {
    const entries = this.list();

    return {
      total: entries.length,
      sensitive: entries.filter((x) => x.sensitive).length,
      session: entries.filter((x) => x.scope === "session").length,
      global: entries.filter((x) => x.scope === "global").length
    };
  }
}
