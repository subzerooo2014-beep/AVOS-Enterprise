import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelGovernanceBinding } from "../enterprise-kernel-mega-pack-3.types";
import { KernelPolicyRegistryService } from "../policies/kernel-policy-registry.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelGovernanceIntegrationService {
  private readonly bindings =
    new Map<string, KernelGovernanceBinding>();

  constructor(
    private readonly policies: KernelPolicyRegistryService,
    private readonly audit: KernelSecurityAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.bindings.values());
  }

  get(id: string) {
    const binding = this.bindings.get(id);

    if (!binding) {
      throw new NotFoundException(
        `Kernel governance binding not found: ${id}`
      );
    }

    return binding;
  }

  register(
    input: Omit<KernelGovernanceBinding, "createdAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.policies.get(input.policyId);

    if (this.bindings.has(input.id)) {
      throw new ConflictException(
        `Kernel governance binding already exists: ${input.id}`
      );
    }

    const binding: KernelGovernanceBinding = {
      ...input,
      controlIds: Array.from(
        new Set(input.controlIds)
      ),
      createdAt: new Date().toISOString()
    };

    this.bindings.set(binding.id, binding);

    this.audit.record({
      correlationId: context.correlationId,
      category: "governance",
      action: "kernel-governance-binding-registered",
      subjectId: binding.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        policyId: binding.policyId,
        governanceDomain:
          binding.governanceDomain,
        mandatory: binding.mandatory
      }
    });

    return binding;
  }

  byPolicy(policyId: string) {
    this.policies.get(policyId);

    return this.list().filter(
      (binding) =>
        binding.policyId === policyId &&
        binding.active
    );
  }

  summary() {
    const bindings = this.list();

    return {
      total: bindings.length,
      active: bindings.filter(
        (binding) => binding.active
      ).length,
      mandatory: bindings.filter(
        (binding) => binding.mandatory
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const bindings: KernelGovernanceBinding[] = [
      {
        id: "kernel-governance:critical-approval",
        policyId:
          "kernel-policy:critical-human-approval",
        governanceDomain:
          "human-final-authority",
        controlIds: [
          "control:approval-required",
          "control:audit-required"
        ],
        mandatory: true,
        active: true,
        metadata: {},
        createdAt: now
      },
      {
        id: "kernel-governance:high-risk",
        policyId:
          "kernel-policy:high-risk-controlled",
        governanceDomain:
          "controlled-execution",
        controlIds: [
          "control:reversible-execution",
          "control:traceability"
        ],
        mandatory: true,
        active: true,
        metadata: {},
        createdAt: now
      }
    ];

    for (const binding of bindings) {
      this.bindings.set(binding.id, binding);
    }
  }
}
