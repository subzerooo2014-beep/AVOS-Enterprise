import { Injectable } from "@nestjs/common";
import {
  OntologyValidationFinding
} from "../foundation-pack-19.types";
import { EnterpriseOntologyRegistryService } from "../ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "../terms/ontology-term-registry.service";
import { OntologyRelationRegistryService } from "../relations/ontology-relation-registry.service";
import { OntologyConstraintRegistryService } from "../constraints/ontology-constraint-registry.service";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class OntologyValidatorService {
  private readonly findings:
    OntologyValidationFinding[] = [];

  constructor(
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly terms: OntologyTermRegistryService,
    private readonly relations: OntologyRelationRegistryService,
    private readonly constraints: OntologyConstraintRegistryService,
    private readonly audit: OntologyAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    const ontologies = this.ontologies.list();
    const terms = this.terms.list();

    for (const ontology of ontologies) {
      if (!/^\d+\.\d+\.\d+$/.test(ontology.version)) {
        this.add(
          ontology.id,
          "error",
          "version-invalid",
          ontology.id,
          `Ontology version is invalid: ${ontology.version}.`,
          []
        );
      }

      const conflicts = ontologies.filter(
        (candidate) =>
          candidate.id !== ontology.id &&
          candidate.namespace === ontology.namespace
      );

      if (conflicts.length > 0) {
        this.add(
          ontology.id,
          "critical",
          "namespace-conflict",
          ontology.id,
          `Ontology namespace conflict: ${ontology.namespace}.`,
          conflicts.map((item) => item.id)
        );
      }
    }

    for (const term of terms) {
      if (!term.definition.trim()) {
        this.add(
          term.ontologyId,
          "error",
          "missing-definition",
          term.id,
          "Ontology term definition is missing.",
          []
        );
      }

      const duplicates = terms.filter(
        (candidate) =>
          candidate.id !== term.id &&
          candidate.ontologyId === term.ontologyId &&
          candidate.canonicalName.toLowerCase() ===
            term.canonicalName.toLowerCase()
      );

      if (duplicates.length > 0) {
        this.add(
          term.ontologyId,
          "error",
          "duplicate-term",
          term.id,
          `Duplicate ontology term: ${term.canonicalName}.`,
          duplicates.map((item) => item.id)
        );
      }

      for (const parentId of term.parentTermIds) {
        try {
          this.terms.get(parentId);
        }
        catch {
          this.add(
            term.ontologyId,
            "critical",
            "missing-parent",
            term.id,
            `Parent ontology term not found: ${parentId}.`,
            [parentId]
          );
        }
      }

      if (
        term.parentTermIds.length === 0 &&
        term.id !== "ontology-term:entity"
      ) {
        this.add(
          term.ontologyId,
          "info",
          "orphan-term",
          term.id,
          "Ontology term has no parent.",
          []
        );
      }
    }

    for (const relation of this.relations.list()) {
      try {
        this.terms.get(relation.fromTermId);
        this.terms.get(relation.toTermId);
      }
      catch {
        this.add(
          relation.ontologyId,
          "critical",
          "invalid-relation",
          relation.id,
          "Ontology relation references a missing term.",
          [
            relation.fromTermId,
            relation.toTermId
          ]
        );
      }
    }

    for (const constraint of this.constraints.list()) {
      if (!constraint.field.trim()) {
        this.add(
          constraint.ontologyId,
          "error",
          "invalid-constraint",
          constraint.id,
          "Ontology constraint field is missing.",
          [constraint.termId]
        );
      }
    }

    for (const cycle of this.detectCycles()) {
      this.add(
        "avos-enterprise-ontology",
        "critical",
        "circular-inheritance",
        cycle[0] ?? "ontology",
        `Circular ontology inheritance detected: ${cycle.join(" -> ")}.`,
        cycle
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "enterprise-ontology-validated",
      subjectId: "enterprise-ontology",
      actorIdentityId: input.actorIdentityId,
      outcome:
        this.findings.some(
          (finding) =>
            finding.severity === "critical" ||
            finding.severity === "error"
        )
          ? "failure"
          : this.findings.length > 0
            ? "warning"
            : "success",
      metadata: {
        findings: this.findings.length
      }
    });

    return {
      valid: !this.findings.some(
        (finding) =>
          finding.severity === "critical" ||
          finding.severity === "error"
      ),
      findings: [...this.findings],
      checkedAt: new Date().toISOString()
    };
  }

  list() {
    return [...this.findings];
  }

  summary() {
    return {
      total: this.findings.length,
      critical: this.findings.filter(
        (finding) => finding.severity === "critical"
      ).length,
      errors: this.findings.filter(
        (finding) => finding.severity === "error"
      ).length,
      warnings: this.findings.filter(
        (finding) => finding.severity === "warning"
      ).length
    };
  }

  private detectCycles() {
    const graph = new Map(
      this.terms.list().map((term) => [
        term.id,
        term.parentTermIds
      ])
    );

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[][] = [];

    const visit = (id: string, path: string[]) => {
      if (visiting.has(id)) {
        const index = path.indexOf(id);
        cycles.push([...path.slice(index), id]);
        return;
      }

      if (visited.has(id)) {
        return;
      }

      visiting.add(id);

      for (const next of graph.get(id) ?? []) {
        if (graph.has(next)) {
          visit(next, [...path, id]);
        }
      }

      visiting.delete(id);
      visited.add(id);
    };

    for (const id of graph.keys()) {
      visit(id, []);
    }

    return cycles;
  }

  private add(
    ontologyId: string,
    severity: OntologyValidationFinding["severity"],
    code: OntologyValidationFinding["code"],
    subjectId: string,
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `ontology-validation:${Date.now()}:${
        this.findings.length + 1
      }`,
      ontologyId,
      severity,
      code,
      subjectId,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
