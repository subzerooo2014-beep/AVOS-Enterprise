import { Injectable, NotFoundException } from "@nestjs/common";
import {
  GovernanceException,
  GovernanceScope
} from "../foundation-pack-8.types";
import { GovernancePolicyRegistryService } from "../policies/governance-policy-registry.service";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class GovernanceExceptionService {
  private readonly exceptions =
    new Map<string, GovernanceException>();

  constructor(
    private readonly policies: GovernancePolicyRegistryService,
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.exceptions.values());
  }

  get(id: string) {
    const exception = this.exceptions.get(id);

    if (!exception) {
      throw new NotFoundException(
        `Governance exception not found: ${id}`
      );
    }

    return exception;
  }

  request(input: {
    subjectId: string;
    subjectType: GovernanceScope;
    policyId: string;
    requestedByIdentityId: string;
    reason: string;
    compensatingControls?: string[];
    correlationId: string;
    expiresAt?: string;
  }) {
    this.policies.get(input.policyId);

    const exception: GovernanceException = {
      id: `governance-exception:${Date.now()}:${
        this.exceptions.size + 1
      }`,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      policyId: input.policyId,
      requestedByIdentityId: input.requestedByIdentityId,
      reason: input.reason,
      compensatingControls: input.compensatingControls ?? [],
      status: "requested",
      requestedAt: new Date().toISOString(),
      expiresAt: input.expiresAt
    };

    this.exceptions.set(exception.id, exception);

    this.audit.record({
      correlationId: input.correlationId,
      category: "exception",
      action: "exception-requested",
      subjectId: exception.id,
      actorIdentityId: input.requestedByIdentityId,
      outcome: "warning",
      metadata: {
        policyId: exception.policyId
      }
    });

    return exception;
  }

  decide(
    id: string,
    input: {
      approved: boolean;
      approverIdentityId: string;
      decisionNote: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    if (current.status !== "requested") {
      throw new Error(`Exception is not pending: ${id}`);
    }

    const updated: GovernanceException = {
      ...current,
      status: input.approved ? "approved" : "rejected",
      approverIdentityId: input.approverIdentityId,
      decisionNote: input.decisionNote,
      decidedAt: new Date().toISOString()
    };

    this.exceptions.set(id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "exception",
      action: input.approved
        ? "exception-approved"
        : "exception-rejected",
      subjectId: id,
      actorIdentityId: input.approverIdentityId,
      outcome: input.approved ? "success" : "blocked",
      metadata: {
        decisionNote: input.decisionNote
      }
    });

    return updated;
  }

  validFor(subjectId: string, policyId: string) {
    const now = Date.now();

    return this.list().some(
      (exception) =>
        exception.subjectId === subjectId &&
        exception.policyId === policyId &&
        exception.status === "approved" &&
        (!exception.expiresAt ||
          new Date(exception.expiresAt).getTime() > now)
    );
  }

  summary() {
    const exceptions = this.list();

    return {
      total: exceptions.length,
      requested: exceptions.filter(
        (item) => item.status === "requested"
      ).length,
      approved: exceptions.filter(
        (item) => item.status === "approved"
      ).length,
      rejected: exceptions.filter(
        (item) => item.status === "rejected"
      ).length
    };
  }
}
