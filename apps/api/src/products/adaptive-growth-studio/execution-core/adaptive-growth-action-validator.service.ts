import { Injectable } from "@nestjs/common";
import {
  AgsCreateActionInput,
  AgsValidationResult,
} from "./adaptive-growth-execution.contracts";
import { AdaptiveGrowthActionRegistryService } from "./adaptive-growth-action-registry.service";

@Injectable()
export class AdaptiveGrowthActionValidatorService {
  constructor(
    private readonly registry:
      AdaptiveGrowthActionRegistryService,
  ) {}

  validate(
    input: AgsCreateActionInput,
  ): AgsValidationResult {
    const definition = this.registry.get(
      input.definitionKey,
    );

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!definition.enabled) {
      errors.push("Action definition is disabled.");
    }

    if (!input.title?.trim()) {
      errors.push("Action title is required.");
    }

    if (!input.objective?.trim()) {
      errors.push("Action objective is required.");
    }

    if (
      definition.riskLevel === "critical"
    ) {
      warnings.push(
        "Critical action requires explicit human approval in Mega Pack 2B.",
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      requiresApproval:
        definition.requiresApproval,
      riskLevel: definition.riskLevel,
    };
  }
}