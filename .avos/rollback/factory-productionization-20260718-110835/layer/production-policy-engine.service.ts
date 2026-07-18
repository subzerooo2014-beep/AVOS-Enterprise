import { Injectable } from "@nestjs/common";
import { FactoryEvolutionRequest } from "./factory-evolution.contracts";

@Injectable()
export class ProductionPolicyEngineService {
  evaluate(request: FactoryEvolutionRequest) {
    const violations: string[] = [];

    if (!request.capabilityName?.trim()) {
      violations.push("capability-name-required");
    }

    if (!request.approvedBy?.startsWith("human:")) {
      violations.push("human-final-authority-required");
    }

    if (
      request.targetEnvironment === "production" &&
      !request.version?.trim()
    ) {
      violations.push("production-version-required");
    }

    return {
      allowed: violations.length === 0,
      violations,
      foundationFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      score: violations.length === 0 ? 100 : 0
    };
  }
}
