import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CapabilityBlueprint,
  CapabilityDependencyPlan,
  CapabilityGeneratedArtifact,
  CapabilityGovernanceReport
} from "./capability-production.contracts";

@Injectable()
export class CapabilityGovernanceValidatorService {
  private readonly items = new Map<string, CapabilityGovernanceReport>();

  validate(
    blueprint: CapabilityBlueprint,
    dependencyPlan: CapabilityDependencyPlan,
    artifacts: CapabilityGeneratedArtifact[]
  ): CapabilityGovernanceReport {
    const checks = {
      blueprintIdentity: blueprint.name.trim().length > 0,
      semanticVersion: /^\d+\.\d+\.\d+$/.test(blueprint.version),
      ownerAssigned: blueprint.owners.length > 0,
      dependencyResolution:
        dependencyPlan.unresolvedDependencies.length === 0 &&
        !dependencyPlan.hasCycle,
      contractGenerated: artifacts.some((item) => item.kind === "contract"),
      codeGenerated: artifacts.some((item) => item.kind === "code"),
      testGenerated: artifacts.some((item) => item.kind === "test"),
      humanFinalAuthority: blueprint.qualityTargets.requireHumanApproval
    };

    const passedCount = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passedCount / Object.keys(checks).length) * 100);
    const findings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const item: CapabilityGovernanceReport = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      score,
      passed:
        findings.length === 0 &&
        score >= blueprint.qualityTargets.minimumScore,
      checks,
      findings,
      humanApprovalRequired:
        blueprint.qualityTargets.requireHumanApproval,
      generatedAt: new Date().toISOString()
    };

    this.items.set(item.id, item);
    return item;
  }

  list(limit = 100): CapabilityGovernanceReport[] {
    return [...this.items.values()].slice(-Math.max(1, limit)).reverse();
  }
}
