import { Injectable } from "@nestjs/common";
import { StateConflict } from "../enterprise-nervous-system-mega-pack-6.types";
import { LiveCoordinationAuditService } from "../observability/live-coordination-audit.service";

@Injectable()
export class StateConflictService {
  private readonly conflicts = new Map<string, StateConflict>();

  constructor(
    private readonly audit: LiveCoordinationAuditService
  ) {}

  create(input: Omit<StateConflict, "id" | "status" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();

    const conflict: StateConflict = {
      ...input,
      id: `state-conflict:${Date.now()}:${this.conflicts.size + 1}`,
      status: "open",
      createdAt: now,
      updatedAt: now
    };

    this.conflicts.set(conflict.id, conflict);

    this.audit.record({
      correlationId: input.correlationId,
      category: "conflict",
      action: "state-conflict-created",
      subjectId: conflict.id,
      actorIdentityId: "system:state-sync",
      outcome:
        conflict.severity === "critical"
          ? "failure"
          : "warning",
      metadata: {
        namespace: conflict.namespace,
        key: conflict.key,
        severity: conflict.severity
      }
    });

    return conflict;
  }

  get(id: string) {
    const conflict = this.conflicts.get(id);

    if (!conflict) {
      throw new Error(`State conflict not found: ${id}`);
    }

    return conflict;
  }

  resolve(
    id: string,
    resolution: string,
    identityId: string
  ) {
    const current = this.get(id);

    const updated: StateConflict = {
      ...current,
      resolution,
      resolvedByIdentityId: identityId,
      status: "resolved",
      updatedAt: new Date().toISOString()
    };

    this.conflicts.set(updated.id, updated);
    return updated;
  }

  list() {
    return Array.from(this.conflicts.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      open: items.filter((x) => x.status === "open").length,
      resolved: items.filter((x) => x.status === "resolved").length,
      escalated: items.filter((x) => x.status === "escalated").length,
      critical: items.filter((x) => x.severity === "critical").length
    };
  }
}
