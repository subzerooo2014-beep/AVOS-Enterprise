import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  ArchitectureEvolutionRequest,
  EvolutionRequestStatus
} from "../foundation-pack-11.types";
import { EvolutionAuditService } from "../observability/evolution-audit.service";
import { EvolutionHistoryService } from "../history/evolution-history.service";

@Injectable()
export class ArchitectureEvolutionRequestService {
  private readonly requests =
    new Map<string, ArchitectureEvolutionRequest>();

  constructor(
    private readonly audit: EvolutionAuditService,
    private readonly history: EvolutionHistoryService
  ) {}

  list() {
    return Array.from(this.requests.values());
  }

  get(id: string) {
    const request = this.requests.get(id);

    if (!request) {
      throw new NotFoundException(
        `Evolution request not found: ${id}`
      );
    }

    return request;
  }

  create(input: Omit<
    ArchitectureEvolutionRequest,
    | "id"
    | "status"
    | "requiresHumanApproval"
    | "createdAt"
    | "updatedAt"
  >) {
    const now = new Date().toISOString();

    const request: ArchitectureEvolutionRequest = {
      ...input,
      id: `evolution-request:${Date.now()}:${
        this.requests.size + 1
      }`,
      status: "draft",
      changes: input.changes.map((change) => ({
        ...change,
        dependenciesAffected: Array.from(
          new Set(change.dependenciesAffected)
        ),
        contractsAffected: Array.from(
          new Set(change.contractsAffected)
        )
      })),
      constraints: Array.from(new Set(input.constraints)),
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now
    };

    this.requests.set(request.id, request);

    this.audit.record({
      correlationId: request.correlationId,
      category: "request",
      action: "evolution-request-created",
      subjectId: request.id,
      actorIdentityId: request.requestedByIdentityId,
      outcome: "success",
      metadata: {
        blueprintId: request.blueprintId,
        changes: request.changes.length
      }
    });

    this.history.record({
      requestId: request.id,
      blueprintId: request.blueprintId,
      action: "request-created",
      actorIdentityId: request.requestedByIdentityId,
      nextStatus: request.status,
      metadata: {}
    });

    return request;
  }

  updateStatus(
    id: string,
    status: EvolutionRequestStatus,
    actorIdentityId: string
  ) {
    const current = this.get(id);

    const updated: ArchitectureEvolutionRequest = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.requests.set(id, updated);

    this.audit.record({
      correlationId: updated.correlationId,
      category: "request",
      action: `request-status:${status}`,
      subjectId: updated.id,
      actorIdentityId,
      outcome:
        status === "failed" || status === "rejected"
          ? "blocked"
          : "success",
      metadata: {
        previousStatus: current.status
      }
    });

    this.history.record({
      requestId: updated.id,
      blueprintId: updated.blueprintId,
      action: "request-status-changed",
      actorIdentityId,
      previousStatus: current.status,
      nextStatus: status,
      metadata: {}
    });

    return updated;
  }

  summary() {
    const requests = this.list();

    return {
      total: requests.length,
      draft: requests.filter(
        (request) => request.status === "draft"
      ).length,
      underAnalysis: requests.filter(
        (request) => request.status === "under-analysis"
      ).length,
      approved: requests.filter(
        (request) => request.status === "approved"
      ).length,
      executing: requests.filter(
        (request) => request.status === "executing"
      ).length,
      completed: requests.filter(
        (request) => request.status === "completed"
      ).length,
      failed: requests.filter(
        (request) => request.status === "failed"
      ).length
    };
  }
}
