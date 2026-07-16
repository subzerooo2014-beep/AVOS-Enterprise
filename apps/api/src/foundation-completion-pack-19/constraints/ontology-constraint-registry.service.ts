import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  OntologyConstraint,
  OntologyConstraintOperator
} from "../foundation-pack-19.types";
import { EnterpriseOntologyRegistryService } from "../ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "../terms/ontology-term-registry.service";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class OntologyConstraintRegistryService {
  private readonly constraints =
    new Map<string, OntologyConstraint>();

  constructor(
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly terms: OntologyTermRegistryService,
    private readonly audit: OntologyAuditService
  ) {}

  list() {
    return Array.from(this.constraints.values());
  }

  get(id: string) {
    const constraint = this.constraints.get(id);

    if (!constraint) {
      throw new NotFoundException(
        `Ontology constraint not found: ${id}`
      );
    }

    return constraint;
  }

  register(input: {
    id?: string;
    ontologyId: string;
    termId: string;
    field: string;
    operator: OntologyConstraintOperator;
    value?: unknown;
    message: string;
    severity: OntologyConstraint["severity"];
    active?: boolean;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.ontologies.get(input.ontologyId);
    this.terms.get(input.termId);

    const now = new Date().toISOString();

    const constraint: OntologyConstraint = {
      id:
        input.id ??
        `ontology-constraint:${Date.now()}:${
          this.constraints.size + 1
        }`,
      ontologyId: input.ontologyId,
      termId: input.termId,
      field: input.field,
      operator: input.operator,
      value: input.value,
      message: input.message,
      severity: input.severity,
      active: input.active ?? true,
      createdAt: now,
      updatedAt: now
    };

    this.constraints.set(
      constraint.id,
      constraint
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "constraint",
      action: "ontology-constraint-registered",
      subjectId: constraint.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        termId: constraint.termId,
        operator: constraint.operator
      }
    });

    return constraint;
  }

  byTerm(termId: string) {
    this.terms.get(termId);

    return this.list().filter(
      (constraint) => constraint.termId === termId
    );
  }

  evaluate(
    constraintId: string,
    payload: Record<string, unknown>
  ) {
    const constraint = this.get(constraintId);
    const value = this.resolveField(
      payload,
      constraint.field
    );

    let passed = true;

    switch (constraint.operator) {
      case "required":
        passed = value !== undefined && value !== null;
        break;
      case "min":
        passed =
          typeof value === "number" &&
          value >= Number(constraint.value);
        break;
      case "max":
        passed =
          typeof value === "number" &&
          value <= Number(constraint.value);
        break;
      case "equals":
        passed = value === constraint.value;
        break;
      case "contains":
        passed = Array.isArray(value)
          ? value.includes(constraint.value)
          : String(value ?? "").includes(
              String(constraint.value ?? "")
            );
        break;
      case "one-of":
        passed = Array.isArray(constraint.value)
          ? constraint.value.includes(value)
          : false;
        break;
      case "pattern":
        passed = new RegExp(
          String(constraint.value ?? "")
        ).test(String(value ?? ""));
        break;
      case "unique":
        passed =
          Array.isArray(value) &&
          new Set(value).size === value.length;
        break;
    }

    return {
      constraintId,
      passed,
      message: passed ? "passed" : constraint.message
    };
  }

  summary() {
    const constraints = this.list();

    return {
      total: constraints.length,
      active: constraints.filter(
        (constraint) => constraint.active
      ).length,
      critical: constraints.filter(
        (constraint) =>
          constraint.severity === "critical"
      ).length
    };
  }

  private resolveField(
    source: Record<string, unknown>,
    path: string
  ) {
    const segments = path.split(".");
    let current: unknown = source;

    for (const segment of segments) {
      if (
        typeof current !== "object" ||
        current === null
      ) {
        return undefined;
      }

      current =
        (current as Record<string, unknown>)[segment];
    }

    return current;
  }
}
