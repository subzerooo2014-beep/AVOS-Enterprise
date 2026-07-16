import { Injectable } from "@nestjs/common";
import {
  FoundationConsistencyResult,
  FoundationValidationFinding
} from "../foundation-pack-18.types";
import { FoundationComponentRegistryService } from "../registry/foundation-component-registry.service";
import { FoundationValidationAuditService } from "../observability/foundation-validation-audit.service";

@Injectable()
export class FoundationConsistencyService {
  constructor(
    private readonly registry: FoundationComponentRegistryService,
    private readonly audit: FoundationValidationAuditService
  ) {}

  check(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const findings: FoundationValidationFinding[] = [];
    const components = this.registry.list();
    const cycles = this.detectCycles();
    const orphanComponents = components
      .filter(
        (component) =>
          component.dependencies.length === 0 &&
          component.id !== "foundation:control-plane"
      )
      .map((component) => component.id);

    const versionMismatches = components
      .filter(
        (component) =>
          !/^\d+\.\d+\.\d+$/.test(
            component.minimumVersion
          )
      )
      .map((component) => component.id);

    const routeGroups = new Map<string, string[]>();

    for (const component of components) {
      const group =
        routeGroups.get(component.expectedRoute) ?? [];

      group.push(component.id);
      routeGroups.set(component.expectedRoute, group);
    }

    const routeConflicts = Array.from(
      routeGroups.entries()
    )
      .filter(([, ids]) => ids.length > 1)
      .map(([route, ids]) =>
        `${route}: ${ids.join(", ")}`
      );

    for (const cycle of cycles) {
      findings.push(
        this.finding(
          "critical",
          "dependency-cycle",
          cycle[0] ?? "foundation",
          `Foundation dependency cycle detected: ${cycle.join(" -> ")}.`,
          cycle
        )
      );
    }

    for (const orphan of orphanComponents) {
      findings.push(
        this.finding(
          "warning",
          "cross-foundation-inconsistency",
          orphan,
          "Foundation component is disconnected from the foundation dependency chain.",
          []
        )
      );
    }

    for (const conflict of routeConflicts) {
      findings.push(
        this.finding(
          "error",
          "cross-foundation-inconsistency",
          "foundation",
          `Foundation route conflict detected: ${conflict}.`,
          []
        )
      );
    }

    const result: FoundationConsistencyResult = {
      id: `foundation-consistency:${Date.now()}`,
      consistent: !findings.some(
        (finding) =>
          finding.severity === "critical" ||
          finding.severity === "error"
      ),
      checkedComponents: components.length,
      dependencyCycles: cycles,
      orphanComponents,
      versionMismatches,
      routeConflicts,
      findings,
      checkedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "consistency",
      action: "foundation-consistency-checked",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome: result.consistent
        ? "success"
        : "failure",
      metadata: {
        checkedComponents: result.checkedComponents,
        cycles: cycles.length,
        routeConflicts: routeConflicts.length
      }
    });

    return result;
  }

  private detectCycles() {
    const graph = new Map(
      this.registry.list().map((component) => [
        component.id,
        component.dependencies
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

  private finding(
    severity: FoundationValidationFinding["severity"],
    code: FoundationValidationFinding["code"],
    componentId: string,
    message: string,
    relatedIds: string[]
  ): FoundationValidationFinding {
    return {
      id: `foundation-consistency-finding:${Date.now()}:${Math.random()}`,
      severity,
      code,
      componentId,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    };
  }
}
