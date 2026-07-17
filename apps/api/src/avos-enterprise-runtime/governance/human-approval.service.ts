import { Injectable } from '@nestjs/common';
import { RuntimeApprovalRequest } from '../contracts/runtime.contracts';
import { createRuntimeId, nowIso } from '../shared/runtime.utils';

@Injectable()
export class HumanApprovalService {
  private readonly requests = new Map<string, RuntimeApprovalRequest>();

  request(
    input: Omit<
      RuntimeApprovalRequest,
      'id' | 'status' | 'createdAt'
    >,
  ): RuntimeApprovalRequest {
    const request: RuntimeApprovalRequest = {
      id: createRuntimeId('approval'),
      status: 'pending',
      createdAt: nowIso(),
      ...input,
    };

    this.requests.set(request.id, request);
    return structuredClone(request);
  }

  resolve(
    id: string,
    resolution: 'approved' | 'rejected',
    resolvedBy: string,
    reason?: string,
  ): RuntimeApprovalRequest {
    const request = this.requests.get(id);
    if (!request) {
      throw new Error(`Approval request not found: ${id}`);
    }

    request.status = resolution;
    request.resolvedAt = nowIso();
    request.resolvedBy = resolvedBy;
    request.reason = reason;

    return structuredClone(request);
  }

  list(
    status?: RuntimeApprovalRequest['status'],
  ): RuntimeApprovalRequest[] {
    return [...this.requests.values()]
      .filter((item) => !status || item.status === status)
      .map((item) => structuredClone(item));
  }

  count(): number {
    return this.requests.size;
  }
}