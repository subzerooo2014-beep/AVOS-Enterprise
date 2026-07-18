import { Injectable } from "@nestjs/common";
import {
  BlueprintMetricsSnapshot,
  BlueprintValidationResult
} from "./blueprint.contracts";
import {
  BlueprintHistoryService
} from "./blueprint-history.service";
import {
  BlueprintRegistryService
} from "./blueprint-registry.service";

@Injectable()
export class BlueprintMetricsService {
  private validationRuns = 0;
  private successfulValidations = 0;
  private failedValidations = 0;
  private plansCreated = 0;
  private plansRequiringApproval = 0;
  private approvedPlans = 0;

  constructor(
    private readonly registry:
      BlueprintRegistryService,
    private readonly history:
      BlueprintHistoryService
  ) {}

  recordValidation(
    result: BlueprintValidationResult
  ): void {
    this.validationRuns += 1;

    if (result.valid) {
      this.successfulValidations += 1;
    } else {
      this.failedValidations += 1;
    }
  }

  recordPlan(
    requiresApproval: boolean,
    approved: boolean
  ): void {
    this.plansCreated += 1;

    if (requiresApproval) {
      this.plansRequiringApproval += 1;
    }

    if (approved) {
      this.approvedPlans += 1;
    }
  }

  getSnapshot():
    BlueprintMetricsSnapshot {
    return {
      registeredBlueprints:
        this.registry.countBlueprints(),
      totalVersions:
        this.registry.countVersions(),
      validationRuns:
        this.validationRuns,
      successfulValidations:
        this.successfulValidations,
      failedValidations:
        this.failedValidations,
      plansCreated:
        this.plansCreated,
      plansRequiringApproval:
        this.plansRequiringApproval,
      approvedPlans:
        this.approvedPlans,
      historyRecords:
        this.history.count(),
      calculatedAt:
        new Date().toISOString()
    };
  }
}
