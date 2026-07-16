import { Injectable } from "@nestjs/common";
import {
  KernelAuthorizationDecision,
  KernelExecutionRequest
} from "../enterprise-kernel-mega-pack-3.types";
import { KernelTrustIntegrationService } from "../trust/kernel-trust-integration.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelExecutionGuardService {
  constructor(
    private readonly trust: KernelTrustIntegrationService,
    private readonly audit: KernelSecurityAuditService
  ) {}

  evaluate(input: {
    request: KernelExecutionRequest;
    authorization: KernelAuthorizationDecision;
  }) {
    const trustAssessment = this.trust.assess({
      principalId: input.request.principalId,
      resource: input.request.resource,
      action: input.request.action,
      risk: input.request.risk,
      correlationId:
        input.request.correlationId
    });

    const blockers: string[] = [];
    const obligations =
      input.authorization.obligations;

    if (
      input.authorization.decision === "deny"
    ) {
      blockers.push(
        "Authorization decision denied the execution."
      );
    }

    if (
      obligations.includes(
        "require-reversible-execution"
      ) &&
      !input.request.reversible
    ) {
      blockers.push(
        "Execution must be reversible."
      );
    }

    if (
      input.request.risk === "critical" &&
      trustAssessment.trustScore < 70
    ) {
      blockers.push(
        "Trust score is insufficient for critical execution."
      );
    }

    const allowed = blockers.length === 0;

    this.audit.record({
      correlationId:
        input.request.correlationId,
      category: "execution",
      action: "kernel-execution-guard-evaluated",
      subjectId: input.request.id,
      actorIdentityId:
        input.request.principalId,
      outcome: allowed
        ? "success"
        : "blocked",
      metadata: {
        blockers,
        trustScore:
          trustAssessment.trustScore
      }
    });

    return {
      allowed,
      blockers,
      obligations,
      trustAssessment
    };
  }
}
