import { Injectable, NotFoundException } from "@nestjs/common";
import { ComplianceControl } from "../foundation-pack-8.types";
import { GovernanceStandardRegistryService } from "../standards/governance-standard-registry.service";
import { GovernancePolicyRegistryService } from "../policies/governance-policy-registry.service";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class ComplianceControlRegistryService {
  private readonly controls = new Map<string, ComplianceControl>();

  constructor(
    private readonly standards: GovernanceStandardRegistryService,
    private readonly policies: GovernancePolicyRegistryService,
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.controls.values());
  }

  get(id: string) {
    const control = this.controls.get(id);

    if (!control) {
      throw new NotFoundException(
        `Compliance control not found: ${id}`
      );
    }

    return control;
  }

  register(
    input: Omit<ComplianceControl, "createdAt" | "updatedAt">,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    this.standards.get(input.standardId);

    for (const policyId of input.policyIds) {
      this.policies.get(policyId);
    }

    const now = new Date().toISOString();

    const control: ComplianceControl = {
      ...input,
      policyIds: Array.from(new Set(input.policyIds)),
      evidenceRequirements: Array.from(
        new Set(input.evidenceRequirements)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.controls.set(control.id, control);

    this.standards.attachControl(
      control.standardId,
      control.id,
      context
    );

    this.audit.record({
      correlationId: context.correlationId,
      category: "compliance",
      action: "control-registered",
      subjectId: control.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        severity: control.severity,
        automated: control.automated
      }
    });

    return control;
  }

  summary() {
    const controls = this.list();

    return {
      total: controls.length,
      active: controls.filter((item) => item.active).length,
      automated: controls.filter((item) => item.automated).length,
      critical: controls.filter(
        (item) => item.severity === "critical"
      ).length
    };
  }
}
