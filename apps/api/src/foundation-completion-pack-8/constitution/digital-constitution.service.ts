import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalConstitutionPrinciple } from "../foundation-pack-8.types";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class DigitalConstitutionService {
  private readonly principles =
    new Map<string, DigitalConstitutionPrinciple>([
      [
        "constitution:human-final-authority",
        {
          id: "constitution:human-final-authority",
          name: "Human Final Authority",
          description:
            "Humans retain final authority over high-impact autonomous decisions.",
          priority: 100,
          immutable: true,
          active: true,
          tags: ["human-authority", "autonomy", "trust"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      [
        "constitution:traceability-by-design",
        {
          id: "constitution:traceability-by-design",
          name: "Traceability by Design",
          description:
            "Every material action and decision must remain explainable and traceable.",
          priority: 95,
          immutable: true,
          active: true,
          tags: ["traceability", "audit", "explainability"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      [
        "constitution:foundation-first",
        {
          id: "constitution:foundation-first",
          name: "Foundation First",
          description:
            "Higher capabilities must not bypass foundational architecture and governance.",
          priority: 90,
          immutable: true,
          active: true,
          tags: ["architecture", "foundation", "governance"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    ]);

  constructor(
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.principles.values()).sort(
      (left, right) => right.priority - left.priority
    );
  }

  get(id: string) {
    const principle = this.principles.get(id);

    if (!principle) {
      throw new NotFoundException(
        `Constitution principle not found: ${id}`
      );
    }

    return principle;
  }

  register(
    input: Omit<DigitalConstitutionPrinciple, "createdAt" | "updatedAt">,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const now = new Date().toISOString();

    const principle: DigitalConstitutionPrinciple = {
      ...input,
      tags: Array.from(new Set(input.tags)),
      priority: Math.round(input.priority),
      createdAt: now,
      updatedAt: now
    };

    this.principles.set(principle.id, principle);

    this.audit.record({
      correlationId: context.correlationId,
      category: "constitution",
      action: "principle-registered",
      subjectId: principle.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        immutable: principle.immutable,
        priority: principle.priority
      }
    });

    return principle;
  }

  summary() {
    const principles = this.list();

    return {
      total: principles.length,
      active: principles.filter((item) => item.active).length,
      immutable: principles.filter((item) => item.immutable).length
    };
  }
}
