import { Injectable, NotFoundException } from "@nestjs/common";
import type { ApprovalRequest } from "./enterprise-workflow.types";

@Injectable()
export class ApprovalGateService {
  private readonly requests = new Map<string, ApprovalRequest>();

  create(workflowExecutionId: string, stepId: string): ApprovalRequest {
    const request: ApprovalRequest = {
      id: `approval-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      workflowExecutionId,
      stepId,
      status: "PENDING",
      requestedAt: new Date().toISOString(),
    };

    this.requests.set(request.id, request);
    return { ...request };
  }

  approve(id: string, decidedBy: string, reason?: string): ApprovalRequest {
    return this.decide(id, "APPROVED", decidedBy, reason);
  }

  reject(id: string, decidedBy: string, reason?: string): ApprovalRequest {
    return this.decide(id, "REJECTED", decidedBy, reason);
  }

  get(id: string): ApprovalRequest {
    const request = this.requests.get(id);
    if (!request) throw new NotFoundException(`Approval '${id}' was not found.`);
    return { ...request };
  }

  list(): ApprovalRequest[] {
    return Array.from(this.requests.values())
      .map((item) => ({ ...item }))
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }

  pendingCount(): number {
    return this.list().filter((item) => item.status === "PENDING").length;
  }

  private decide(
    id: string,
    status: "APPROVED" | "REJECTED",
    decidedBy: string,
    reason?: string,
  ): ApprovalRequest {
    const request = this.get(id);
    const updated: ApprovalRequest = {
      ...request,
      status,
      decidedBy,
      reason,
      decidedAt: new Date().toISOString(),
    };
    this.requests.set(id, updated);
    return { ...updated };
  }
}
