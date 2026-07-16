import { Injectable, NotFoundException } from "@nestjs/common";
import { GovernanceStandard } from "../foundation-pack-8.types";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class GovernanceStandardRegistryService {
  private readonly standards = new Map<string, GovernanceStandard>([
    [
      "standard:avos-architecture",
      {
        id: "standard:avos-architecture",
        name: "AVOS Architecture Standard",
        description:
          "Mandatory architecture controls for AVOS platform assets.",
        category: "architecture",
        version: "1.0.0",
        mandatory: true,
        controlIds: [],
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "standard:avos-trust",
      {
        id: "standard:avos-trust",
        name: "AVOS Trust Standard",
        description:
          "Trust, traceability, provenance, and human authority controls.",
        category: "ai",
        version: "1.0.0",
        mandatory: true,
        controlIds: [],
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  constructor(
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.standards.values());
  }

  get(id: string) {
    const standard = this.standards.get(id);

    if (!standard) {
      throw new NotFoundException(
        `Governance standard not found: ${id}`
      );
    }

    return standard;
  }

  register(
    input: Omit<GovernanceStandard, "createdAt" | "updatedAt">,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const now = new Date().toISOString();

    const standard: GovernanceStandard = {
      ...input,
      controlIds: Array.from(new Set(input.controlIds)),
      createdAt: now,
      updatedAt: now
    };

    this.standards.set(standard.id, standard);

    this.audit.record({
      correlationId: context.correlationId,
      category: "standard",
      action: "standard-registered",
      subjectId: standard.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        category: standard.category,
        mandatory: standard.mandatory
      }
    });

    return standard;
  }

  attachControl(
    standardId: string,
    controlId: string,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const current = this.get(standardId);

    const updated: GovernanceStandard = {
      ...current,
      controlIds: Array.from(
        new Set([...current.controlIds, controlId])
      ),
      updatedAt: new Date().toISOString()
    };

    this.standards.set(standardId, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "standard",
      action: "control-attached",
      subjectId: standardId,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: { controlId }
    });

    return updated;
  }

  summary() {
    const standards = this.list();

    return {
      total: standards.length,
      active: standards.filter((item) => item.active).length,
      mandatory: standards.filter((item) => item.mandatory).length
    };
  }
}
