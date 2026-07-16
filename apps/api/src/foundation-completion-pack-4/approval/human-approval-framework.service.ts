import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  HumanApprovalRequest,
  HumanApprovalStatus
} from "../foundation-pack-4.types";

@Injectable()
export class HumanApprovalFrameworkService {
  private readonly requests = new Map<string, HumanApprovalRequest>();

  list() {
    return Array.from(this.requests.values());
  }

  get(id: string) {
    const request = this.requests.get(id);

    if (!request) {
      throw new NotFoundException(`Human approval request not found: ${id}`);
    }

    return request;
  }

  create(
    input: Omit<
      HumanApprovalRequest,
      "id" | "status" | "createdAt" | "resolvedAt"
    >
  ) {
    const id = `approval:${Date.now()}`;

    const request: HumanApprovalRequest = {
      ...input,
      id,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    this.requests.set(id, request);
    return request;
  }

  resolve(
    id: string,
    input: {
      status: Extract<
        HumanApprovalStatus,
        "approved" | "rejected" | "escalated" | "executed"
      >;
      approverIdentityId: string;
    }
  ) {
    const request = this.get(id);

    if (request.status !== "pending" && request.status !== "escalated") {
      throw new BadRequestException(
        `Approval request cannot be resolved from status: ${request.status}`
      );
    }

    const updated: HumanApprovalRequest = {
      ...request,
      status: input.status,
      approverIdentityId: input.approverIdentityId,
      resolvedAt: new Date().toISOString()
    };

    this.requests.set(id, updated);
    return updated;
  }

  summary() {
    const requests = this.list();

    return {
      total: requests.length,
      pending: requests.filter((request) => request.status === "pending")
        .length,
      approved: requests.filter((request) => request.status === "approved")
        .length,
      rejected: requests.filter((request) => request.status === "rejected")
        .length,
      escalated: requests.filter((request) => request.status === "escalated")
        .length
    };
  }
}
