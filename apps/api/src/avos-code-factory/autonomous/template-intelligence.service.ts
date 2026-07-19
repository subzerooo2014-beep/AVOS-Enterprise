import { Injectable } from "@nestjs/common";
import {
  AutonomousTargetFramework,
  CompiledCapability,
} from "../contracts/autonomous-factory.contracts";

@Injectable()
export class FactoryTemplateIntelligenceService {
  selectForCapability(
    capability: CompiledCapability,
    framework: AutonomousTargetFramework,
  ) {
    return {
      framework,
      pattern:
        framework === "nestjs"
          ? "nestjs-capability-module"
          : framework === "nextjs"
            ? "nextjs-feature-module"
            : framework === "flutter"
              ? "flutter-feature-package"
              : "generic-capability-package",
      includeController:
        framework === "nestjs" && capability.exposeApi,
      includePersistence:
        capability.persistence,
      includeHumanApproval:
        capability.humanApprovalRequired,
      selectedAt: new Date().toISOString(),
    };
  }
}
