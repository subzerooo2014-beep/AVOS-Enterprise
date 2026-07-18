import { Injectable } from "@nestjs/common";
import { PlatformRegistryService } from "../../platform-control-plane/services/platform-registry.service";
import {
  PlatformValidationFinding,
  PlatformValidationReport
} from "../contracts/platform-dependency.contracts";
import { PlatformDependencyGraphService } from "./platform-dependency-graph.service";
import { PlatformDependencyIdService } from "./platform-dependency-id.service";
import { PlatformDependencyRegistryService } from "./platform-dependency-registry.service";

@Injectable()
export class PlatformDependencyValidationService {
  constructor(
    private readonly ids: PlatformDependencyIdService,
    private readonly platformRegistry: PlatformRegistryService,
    private readonly dependencies: PlatformDependencyRegistryService,
    private readonly graph: PlatformDependencyGraphService
  ) {}

  validate(): PlatformValidationReport {
    const findings: PlatformValidationFinding[] = [];
    const resources = this.platformRegistry.list();
    const resourceIds = new Set(resources.map((item) => item.id));

    for (const dependency of this.dependencies.list()) {
      if (!resourceIds.has(dependency.sourceServiceId)) {
        findings.push({
          code: "MISSING_SOURCE",
          severity: "error",
          message: `Missing source service: ${dependency.sourceServiceId}`,
          dependencyId: dependency.id,
          serviceId: dependency.sourceServiceId
        });
      }

      if (!resourceIds.has(dependency.targetServiceId)) {
        findings.push({
          code: "MISSING_TARGET",
          severity: "error",
          message: `Missing dependency target: ${dependency.targetServiceId}`,
          dependencyId: dependency.id,
          serviceId: dependency.targetServiceId
        });
      }

      if (dependency.status === "disabled" && dependency.type === "required") {
        findings.push({
          code: "REQUIRED_DEPENDENCY_DISABLED",
          severity: "warning",
          message: `Required dependency is disabled: ${dependency.id}`,
          dependencyId: dependency.id,
          serviceId: dependency.sourceServiceId
        });
      }
    }

    for (const cycle of this.graph.detectCycles()) {
      findings.push({
        code: "CIRCULAR_DEPENDENCY",
        severity: "error",
        message: `Circular dependency detected: ${cycle.join(" -> ")}`,
        details: { cycle }
      });
    }

    const errorCount = findings.filter((item) => item.severity === "error").length;
    const warningCount = findings.filter((item) => item.severity === "warning").length;
    const score = Math.max(0, 100 - errorCount * 25 - warningCount * 5);

    return {
      id: this.ids.create("platform-dependency-validation"),
      status: errorCount === 0 ? "passed" : "failed",
      score,
      findings,
      validatedAt: new Date().toISOString()
    };
  }
}