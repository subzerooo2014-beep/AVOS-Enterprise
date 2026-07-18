import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryPolicyException
} from "./avos-factory-security.contracts";
import {
  AvosFactorySecurityPolicyRegistryService
} from "./avos-factory-security-policy-registry.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryPolicyExceptionService {
  private readonly exceptions: AvosFactoryPolicyException[] = [];

  constructor(
    private readonly policies: AvosFactorySecurityPolicyRegistryService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  request(input: {
    policyId: string;
    subjectId: string;
    reason: string;
    requestedBy: string;
    expiresAt?: string;
  }): AvosFactoryPolicyException {
    const policy = this.policies.get(input.policyId);

    if (!policy) {
      throw new BadRequestException(`Policy not found: ${input.policyId}`);
    }

    const exception: AvosFactoryPolicyException = {
      id: randomUUID(),
      policyId: input.policyId,
      subjectId: input.subjectId,
      reason: input.reason,
      requestedBy: input.requestedBy,
      status: "pending",
      humanApproved: false,
      createdAt: new Date().toISOString(),
      expiresAt: input.expiresAt
    };

    this.exceptions.unshift(exception);
    return structuredClone(exception);
  }

  decide(input: {
    exceptionId: string;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
    decision: "approved" | "rejected";
  }): AvosFactoryPolicyException {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Policy exception decision requires Human Final Authority approval."
      );
    }

    const exception = this.exceptions.find(
      (candidate) => candidate.id === input.exceptionId
    );

    if (!exception) {
      throw new BadRequestException(
        `Policy exception not found: ${input.exceptionId}`
      );
    }

    exception.status = input.decision;
    exception.approvedBy = input.approvedBy;
    exception.humanApproved = true;
    exception.decidedAt = new Date().toISOString();

    this.audit.append({
      category: "governance",
      action: "factory-policy-exception-decided",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: input.decision === "approved",
      resourceId: exception.id,
      details: {
        policyId: exception.policyId,
        decision: input.decision
      }
    });

    return structuredClone(exception);
  }

  list(limit = 100): AvosFactoryPolicyException[] {
    return this.exceptions
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((exception) => structuredClone(exception));
  }
}
