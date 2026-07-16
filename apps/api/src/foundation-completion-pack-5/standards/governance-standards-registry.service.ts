import { Injectable, NotFoundException } from "@nestjs/common";
import { GovernanceStandard } from "../foundation-pack-5.types";

@Injectable()
export class GovernanceStandardsRegistryService {
  private readonly standards = new Map<string, GovernanceStandard>([
    [
      "standard:foundation-conformance:1.0.0",
      {
        id: "standard:foundation-conformance:1.0.0",
        code: "AVOS-FOUNDATION-CONFORMANCE",
        name: "Foundation Conformance Standard",
        description:
          "Defines the minimum conformance requirements for AVOS foundation assets.",
        version: "1.0.0",
        status: "active",
        domain: "foundation",
        requirements: [
          "TypeScript type check must pass.",
          "NestJS production build must pass.",
          "Human authority must be preserved.",
          "Auditability and traceability must be available."
        ],
        policyIds: [
          "policy:foundation-first:1.0.0",
          "policy:human-authority:1.0.0"
        ],
        owners: {
          businessOwner: "AVOS Foundation",
          technicalOwner: "AVOS Platform Engineering",
          governanceOwner: "AVOS Governance OS",
          approverIdentityIds: ["identity:avos-platform"]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  list() {
    return Array.from(this.standards.values());
  }

  get(id: string) {
    const standard = this.standards.get(id);

    if (!standard) {
      throw new NotFoundException(`Governance standard not found: ${id}`);
    }

    return standard;
  }

  register(input: Omit<GovernanceStandard, "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();

    const standard: GovernanceStandard = {
      ...input,
      requirements: Array.from(new Set(input.requirements)),
      policyIds: Array.from(new Set(input.policyIds)),
      owners: {
        ...input.owners,
        approverIdentityIds: Array.from(
          new Set(input.owners.approverIdentityIds)
        )
      },
      createdAt: now,
      updatedAt: now
    };

    this.standards.set(standard.id, standard);
    return standard;
  }

  summary() {
    const standards = this.list();

    return {
      total: standards.length,
      active: standards.filter((standard) => standard.status === "active")
        .length,
      domains: Array.from(new Set(standards.map((standard) => standard.domain)))
    };
  }
}
