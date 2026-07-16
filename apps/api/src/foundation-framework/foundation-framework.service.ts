import { Injectable } from "@nestjs/common";
import {
  FOUNDATION_CAPABILITIES,
  FOUNDATION_CONTRACTS,
  FOUNDATION_DEPENDENCIES,
  FOUNDATION_POLICIES,
  FOUNDATION_SCHEMAS,
} from "./foundation-framework.seed";
import {
  CapabilityDefinition,
  FoundationComplianceReport,
  FoundationViolation,
} from "./foundation-framework.types";

@Injectable()
export class FoundationFrameworkService {
  listCapabilities(): CapabilityDefinition[] {
    return FOUNDATION_CAPABILITIES.map((item) => ({
      ...item,
      dependencies: [...item.dependencies],
      events: [...item.events],
      apis: [...item.apis],
      tags: [...item.tags],
    }));
  }

  getCapability(id: string): CapabilityDefinition | undefined {
    return this.listCapabilities().find((item) => item.id === id);
  }

  listDependencies() {
    return FOUNDATION_DEPENDENCIES.map((item) => ({ ...item }));
  }

  listContracts() {
    return FOUNDATION_CONTRACTS.map((item) => ({ ...item }));
  }

  listPolicies() {
    return FOUNDATION_POLICIES.map((item) => ({ ...item }));
  }

  listSchemas() {
    return FOUNDATION_SCHEMAS.map((item) => ({ ...item }));
  }

  validate(): FoundationComplianceReport {
    const violations: FoundationViolation[] = [];
    const ids = new Set(FOUNDATION_CAPABILITIES.map((item) => item.id));

    for (const capability of FOUNDATION_CAPABILITIES) {
      if (!capability.id || !capability.name || !capability.owner) {
        violations.push({
          code: "FOUNDATION_CAPABILITY_METADATA_MISSING",
          severity: "ERROR",
          component: capability.id || "unknown",
          message: "Mandatory capability metadata is missing.",
          remediation: "Provide id, name and owner.",
        });
      }

      for (const dependency of capability.dependencies) {
        if (!ids.has(dependency)) {
          violations.push({
            code: "FOUNDATION_DEPENDENCY_MISSING",
            severity: "CRITICAL",
            component: capability.id,
            message: `Dependency '${dependency}' is not registered.`,
            remediation: "Register the missing dependency or remove the reference.",
          });
        }
      }
    }

    const circular = this.detectCircularDependencies();
    for (const cycle of circular) {
      violations.push({
        code: "FOUNDATION_CIRCULAR_DEPENDENCY",
        severity: "CRITICAL",
        component: cycle[0] ?? "unknown",
        message: `Circular dependency detected: ${cycle.join(" -> ")}`,
        remediation: "Break the cycle by introducing a contract or orchestration boundary.",
      });
    }

    if (FOUNDATION_POLICIES.some((item) => !item.enabled && item.enforcement === "BLOCKING")) {
      violations.push({
        code: "FOUNDATION_BLOCKING_POLICY_DISABLED",
        severity: "CRITICAL",
        component: "enterprise-policy-registry",
        message: "A blocking policy is disabled.",
        remediation: "Enable all blocking foundation policies.",
      });
    }

    const deduction = violations.reduce((total, violation) => {
      if (violation.severity === "CRITICAL") return total + 25;
      if (violation.severity === "ERROR") return total + 10;
      if (violation.severity === "WARNING") return total + 3;
      return total;
    }, 0);

    return {
      compliant: violations.every(
        (item) => item.severity !== "CRITICAL" && item.severity !== "ERROR",
      ),
      score: Math.max(0, 100 - deduction),
      checkedAt: new Date().toISOString(),
      violations,
      metrics: {
        capabilities: FOUNDATION_CAPABILITIES.length,
        dependencies: FOUNDATION_DEPENDENCIES.length,
        contracts: FOUNDATION_CONTRACTS.length,
        policies: FOUNDATION_POLICIES.length,
        schemas: FOUNDATION_SCHEMAS.length,
      },
    };
  }

  status() {
    const compliance = this.validate();

    return {
      success: true,
      system: "AVOS Foundation Framework",
      version: "1.0.0",
      layer: "FOUNDATION_LAYER_0",
      status: compliance.compliant ? "COMPLIANT" : "NON_COMPLIANT",
      architectureScore: compliance.score,
      lifecycle: "PRODUCTION",
      mandatoryForFutureBundles: true,
      compliance,
      capabilities: this.listCapabilities().map((item) => ({
        id: item.id,
        name: item.name,
        lifecycle: item.lifecycle,
      })),
    };
  }

  private detectCircularDependencies(): string[][] {
    const graph = new Map<string, string[]>();
    for (const capability of FOUNDATION_CAPABILITIES) {
      graph.set(capability.id, [...capability.dependencies]);
    }

    const visited = new Set<string>();
    const visiting = new Set<string>();
    const path: string[] = [];
    const cycles: string[][] = [];

    const walk = (node: string) => {
      if (visiting.has(node)) {
        const start = path.indexOf(node);
        cycles.push([...path.slice(start), node]);
        return;
      }

      if (visited.has(node)) return;

      visiting.add(node);
      path.push(node);

      for (const next of graph.get(node) ?? []) {
        walk(next);
      }

      path.pop();
      visiting.delete(node);
      visited.add(node);
    };

    for (const node of graph.keys()) {
      walk(node);
    }

    return cycles;
  }
}
