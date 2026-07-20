import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import {
  AgsAction,
  AgsCreateActionInput,
  AgsExecutionState,
} from "./adaptive-growth-execution.contracts";
import { AdaptiveGrowthActionRegistryService } from "./adaptive-growth-action-registry.service";
import { AdaptiveGrowthActionValidatorService } from "./adaptive-growth-action-validator.service";
import { AdaptiveGrowthExecutionHistoryService } from "./adaptive-growth-execution-history.service";
import { AdaptiveGrowthExecutionIdService } from "./adaptive-growth-execution-id.service";
import { AdaptiveGrowthExecutionStateMachineService } from "./adaptive-growth-execution-state-machine.service";
import { AdaptiveGrowthExecutionStoreService } from "./adaptive-growth-execution-store.service";

@Injectable()
export class AdaptiveGrowthActionService {
  constructor(
    private readonly registry:
      AdaptiveGrowthActionRegistryService,
    private readonly validator:
      AdaptiveGrowthActionValidatorService,
    private readonly stateMachine:
      AdaptiveGrowthExecutionStateMachineService,
    private readonly history:
      AdaptiveGrowthExecutionHistoryService,
    private readonly ids:
      AdaptiveGrowthExecutionIdService,
    private readonly store:
      AdaptiveGrowthExecutionStoreService,
  ) {}

  create(input: AgsCreateActionInput): AgsAction {
    const validation =
      this.validator.validate(input);

    if (!validation.valid) {
      throw new BadRequestException({
        message: "Action validation failed.",
        errors: validation.errors,
        warnings: validation.warnings,
      });
    }

    const definition = this.registry.get(
      input.definitionKey,
    );

    const initialState: AgsExecutionState =
      definition.requiresApproval
        ? "pending-approval"
        : "approved";

    const now = new Date().toISOString();

    const action: AgsAction = {
      id: this.ids.create("ags-action"),
      definitionKey: definition.key,
      title: input.title.trim(),
      objective: input.objective.trim(),
      sourceType:
        input.sourceType ?? "manual",
      sourceId: input.sourceId,
      requestedBy:
        input.requestedBy ?? "human:khalifa",
      payload: input.payload ?? {},
      metadata: input.metadata ?? {},
      state: initialState,
      riskLevel: definition.riskLevel,
      requiresApproval:
        definition.requiresApproval,
      supportsRollback:
        definition.supportsRollback,
      createdAt: now,
      updatedAt: now,
    };

    this.store.saveAction(action);

    this.history.record({
      actionId: action.id,
      eventType: "action-created",
      toState: action.state,
      actor: action.requestedBy,
      evidence: {
        definitionKey:
          action.definitionKey,
        riskLevel: action.riskLevel,
      },
    });

    if (action.requiresApproval) {
      this.history.record({
        actionId: action.id,
        eventType: "approval-required",
        fromState: "draft",
        toState: "pending-approval",
        actor: "system:ags",
        evidence: {
          approvalGovernance:
            "reserved-for-mega-pack-2b",
          humanFinalAuthority: true,
        },
      });
    }

    return action;
  }

  validate(input: AgsCreateActionInput) {
    return this.validator.validate(input);
  }

  list(): AgsAction[] {
    return this.store.listActions();
  }

  get(id: string): AgsAction {
    return this.store.getAction(id);
  }

  transition(
    id: string,
    toState: AgsExecutionState,
    actor: string,
    reason?: string,
  ): AgsAction {
    const action = this.store.getAction(id);

    this.stateMachine.assertTransition(
      action.state,
      toState,
    );

    const fromState = action.state;
    const updated: AgsAction = {
      ...action,
      state: toState,
      updatedAt: new Date().toISOString(),
    };

    this.store.saveAction(updated);

    this.history.record({
      actionId: updated.id,
      eventType:
        toState === "approved"
          ? "execution-approved"
          : toState === "cancelled"
            ? "execution-cancelled"
            : "action-validated",
      fromState,
      toState,
      actor,
      reason,
      evidence: {
        humanFinalAuthority:
          toState === "approved",
      },
    });

    return updated;
  }
}