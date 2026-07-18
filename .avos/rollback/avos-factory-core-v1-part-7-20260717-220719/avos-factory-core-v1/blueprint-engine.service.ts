import { Injectable } from "@nestjs/common";
import {
  AvosBlueprint,
  BlueprintCreatePlanRequest,
  BlueprintCreatePlanResult,
  BlueprintExecutionPlan,
  BlueprintValidationResult
} from "./blueprint.contracts";
import {
  BlueprintHistoryService
} from "./blueprint-history.service";
import {
  BlueprintMetricsService
} from "./blueprint-metrics.service";
import {
  BlueprintParserService
} from "./blueprint-parser.service";
import {
  BlueprintPlannerService
} from "./blueprint-planner.service";
import {
  BlueprintRegistryService
} from "./blueprint-registry.service";
import {
  BlueprintValidationService
} from "./blueprint-validation.service";

@Injectable()
export class BlueprintEngineService {
  constructor(
    private readonly parser:
      BlueprintParserService,
    private readonly validation:
      BlueprintValidationService,
    private readonly registry:
      BlueprintRegistryService,
    private readonly planner:
      BlueprintPlannerService,
    private readonly history:
      BlueprintHistoryService,
    private readonly metrics:
      BlueprintMetricsService
  ) {}

  validate(
    source: AvosBlueprint | string
  ): BlueprintValidationResult {
    const parsed =
      this.parser.parse(source);

    const result =
      this.validation.validate(
        parsed.blueprint
      );

    this.metrics.recordValidation(result);

    this.history.record({
      action: "validated",
      blueprintId:
        parsed.blueprint.id ??
        "unknown",
      blueprintVersion:
        parsed.blueprint.version ??
        "unknown",
      success: result.valid,
      details: {
        errors: result.errors,
        warnings: result.warnings,
        sourceType:
          parsed.sourceType
      }
    });

    return result;
  }

  register(
    source: AvosBlueprint | string
  ): AvosBlueprint {
    const parsed =
      this.parser.parse(source);

    this.history.record({
      action: "parsed",
      blueprintId:
        parsed.blueprint.id ??
        "unknown",
      blueprintVersion:
        parsed.blueprint.version ??
        "unknown",
      success: true,
      details: {
        sourceType:
          parsed.sourceType
      }
    });

    const validation =
      this.validation.validate(
        parsed.blueprint
      );

    this.metrics.recordValidation(
      validation
    );

    this.validation.assertValid(
      validation
    );

    const registered =
      this.registry.register(
        parsed.blueprint
      );

    this.history.record({
      action: "registered",
      blueprintId:
        registered.id,
      blueprintVersion:
        registered.version,
      success: true,
      details: {
        status:
          registered.status,
        stepCount:
          registered.steps.length
      }
    });

    return registered;
  }

  createPlan(
    request: BlueprintCreatePlanRequest
  ): BlueprintCreatePlanResult {
    const blueprint =
      this.register(
        request.blueprint
      );

    const validation =
      this.validation.validate(
        blueprint
      );

    const plan =
      this.planner.createPlan(
        blueprint,
        request.approve === true
      );

    this.metrics.recordPlan(
      plan.requiresHumanApproval,
      plan.approved
    );

    this.history.record({
      action: "planned",
      blueprintId:
        blueprint.id,
      blueprintVersion:
        blueprint.version,
      success: true,
      details: {
        planId: plan.id,
        stepCount:
          plan.steps.length,
        approved:
          plan.approved,
        approvedBy:
          request.approvedBy,
        requiresHumanApproval:
          plan.requiresHumanApproval
      }
    });

    if (
      plan.approved &&
      request.approvedBy
    ) {
      this.history.record({
        action: "approved",
        blueprintId:
          blueprint.id,
        blueprintVersion:
          blueprint.version,
        success: true,
        details: {
          planId: plan.id,
          approvedBy:
            request.approvedBy
        }
      });
    }

    return {
      success: true,
      blueprint,
      validation,
      plan
    };
  }

  getBlueprint(
    blueprintId: string,
    version?: string
  ): AvosBlueprint {
    return this.registry.get(
      blueprintId,
      version
    );
  }

  listBlueprints():
    AvosBlueprint[] {
    return this.registry.list();
  }

  archiveBlueprint(
    blueprintId: string,
    version?: string
  ): AvosBlueprint {
    const archived =
      this.registry.archive(
        blueprintId,
        version
      );

    this.history.record({
      action: "archived",
      blueprintId:
        archived.id,
      blueprintVersion:
        archived.version,
      success: true,
      details: {
        status:
          archived.status
      }
    });

    return archived;
  }

  approvePlan(
    plan: BlueprintExecutionPlan,
    approvedBy: string
  ): BlueprintExecutionPlan {
    const approvedPlan:
      BlueprintExecutionPlan = {
      ...structuredClone(plan),
      approved: true,
      warnings:
        plan.warnings.filter(
          (warning) =>
            warning !==
            "Execution plan requires human approval."
        )
    };

    this.history.record({
      action: "approved",
      blueprintId:
        approvedPlan.blueprintId,
      blueprintVersion:
        approvedPlan.blueprintVersion,
      success: true,
      details: {
        planId:
          approvedPlan.id,
        approvedBy
      }
    });

    return approvedPlan;
  }
}
