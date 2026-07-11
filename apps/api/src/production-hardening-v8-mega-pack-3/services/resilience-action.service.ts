import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  JsonValue,
  ResilienceAction,
  ResilienceActionExecution,
} from "../contracts/runtime-resilience.contracts";
import {
  EvidenceEntryType,
  ResilienceActionStatus,
  RuntimeControlMode,
} from "../contracts/runtime-resilience.enums";
import {
  CreateResilienceActionDto,
  ExecuteResilienceActionDto,
} from "../dto";
import { ResilienceActionExecutorRegistry } from "../executors/resilience-action-executor.registry";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
import { RuntimeIncidentService } from "./runtime-incident.service";

@Injectable()
export class ResilienceActionService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
    private readonly executors: ResilienceActionExecutorRegistry,
    private readonly incidents: RuntimeIncidentService,
  ) {}

  create(dto: CreateResilienceActionDto): ResilienceAction {
    if (dto.incidentId) {
      this.incidents.get(dto.incidentId);
    }

    if (
      dto.configurationId &&
      !this.store.getConfiguration(dto.configurationId)
    ) {
      throw new NotFoundException(
        `Configuration ${dto.configurationId} was not found`,
      );
    }

    const idempotencyKey =
      dto.idempotencyKey ??
      `${dto.type}:${dto.target}:${dto.incidentId ?? "none"}`;

    const duplicate = this.store
      .listActions()
      .find(
        (action) =>
          action.idempotencyKey === idempotencyKey &&
          ![
            ResilienceActionStatus.FAILED,
            ResilienceActionStatus.CANCELLED,
            ResilienceActionStatus.ROLLED_BACK,
          ].includes(action.status),
      );

    if (duplicate) {
      throw new ConflictException(
        `Active action already exists for idempotency key ${idempotencyKey}`,
      );
    }

    const now = new Date().toISOString();
    const requiresApproval = dto.requiresApproval ?? true;

    const action: ResilienceAction = {
      id: randomUUID(),
      incidentId: dto.incidentId,
      configurationId: dto.configurationId,
      type: dto.type,
      status: requiresApproval
        ? ResilienceActionStatus.PENDING_APPROVAL
        : ResilienceActionStatus.PLANNED,
      name: dto.name,
      description: dto.description,
      target: dto.target,
      parameters: dto.parameters as Record<
        string,
        JsonValue
      >,
      requiresApproval,
      requestedBy: dto.actor,
      requestedAt: now,
      executions: [],
      idempotencyKey,
      dryRun: dto.dryRun ?? true,
    };

    const saved = this.store.saveAction(action);

    if (saved.incidentId) {
      this.incidents.attachAction(
        saved.incidentId,
        saved.id,
      );
    }

    this.evidence.append({
      type: EvidenceEntryType.ACTION_CREATED,
      aggregateType: "resilience_action",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        actionId: saved.id,
        incidentId: saved.incidentId ?? null,
        configurationId:
          saved.configurationId ?? null,
        type: saved.type,
        status: saved.status,
        target: saved.target,
        requiresApproval: saved.requiresApproval,
        idempotencyKey: saved.idempotencyKey,
        dryRun: saved.dryRun,
      },
    });

    return saved;
  }

  list(): ResilienceAction[] {
    return this.store.listActions();
  }

  get(id: string): ResilienceAction {
    const action = this.store.getAction(id);

    if (!action) {
      throw new NotFoundException(
        `Resilience action ${id} was not found`,
      );
    }

    return action;
  }

  approve(
    id: string,
    dto: ExecuteResilienceActionDto,
  ): ResilienceAction {
    const action = this.get(id);

    if (
      action.status !==
      ResilienceActionStatus.PENDING_APPROVAL
    ) {
      throw new BadRequestException(
        `Action is not pending approval. Current status: ${action.status}`,
      );
    }

    if (dto.approved === false) {
      action.status = ResilienceActionStatus.CANCELLED;
      action.completedAt = new Date().toISOString();
      return this.store.saveAction(action);
    }

    action.status = ResilienceActionStatus.APPROVED;
    action.approvedBy = dto.actor;
    action.approvedAt = new Date().toISOString();

    return this.store.saveAction(action);
  }

  async execute(
    id: string,
    dto: ExecuteResilienceActionDto,
  ): Promise<ResilienceAction> {
    let action = this.get(id);

    if (
      this.store.getControlMode() ===
        RuntimeControlMode.OBSERVE &&
      !action.dryRun
    ) {
      throw new BadRequestException(
        "Non-dry-run actions are blocked in observe mode",
      );
    }

    if (
      action.requiresApproval &&
      action.status ===
        ResilienceActionStatus.PENDING_APPROVAL
    ) {
      if (dto.approved !== true) {
        throw new BadRequestException(
          "Action requires explicit approval",
        );
      }

      action = this.approve(id, dto);
    }

    if (
      ![
        ResilienceActionStatus.PLANNED,
        ResilienceActionStatus.APPROVED,
        ResilienceActionStatus.FAILED,
      ].includes(action.status)
    ) {
      throw new BadRequestException(
        `Action cannot be executed from status ${action.status}`,
      );
    }

    const startedAt = new Date().toISOString();

    action.status = ResilienceActionStatus.RUNNING;
    action.startedAt = startedAt;
    action.error = undefined;

    this.store.saveAction(action);

    const execution: ResilienceActionExecution = {
      id: randomUUID(),
      actionId: action.id,
      attempt: action.executions.length + 1,
      startedAt,
      succeeded: false,
    };

    try {
      const executor = this.executors.resolve(action.type);

      const result = await executor.execute({
        action,
        runtimeContext: (dto.runtimeContext ?? {}) as Record<
          string,
          JsonValue
        >,
      });

      execution.completedAt = new Date().toISOString();
      execution.succeeded = result.succeeded;
      execution.output = result.output;
      execution.error = result.error;

      action.executions.push(execution);
      action.completedAt = execution.completedAt;
      action.status = result.succeeded
        ? ResilienceActionStatus.SUCCEEDED
        : ResilienceActionStatus.FAILED;
      action.error = result.error;

      const saved = this.store.saveAction(action);

      const evidenceEntry = this.evidence.append({
        type: result.succeeded
          ? EvidenceEntryType.ACTION_EXECUTED
          : EvidenceEntryType.ACTION_FAILED,
        aggregateType: "resilience_action",
        aggregateId: saved.id,
        actor: dto.actor,
        payload: {
          actionId: saved.id,
          executionId: execution.id,
          attempt: execution.attempt,
          type: saved.type,
          status: saved.status,
          target: saved.target,
          dryRun: saved.dryRun,
          output: result.output,
          error: result.error ?? null,
        },
      });

      execution.evidenceEntryId = evidenceEntry.id;
      saved.executions[
        saved.executions.length - 1
      ] = execution;

      return this.store.saveAction(saved);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown resilience action failure";

      execution.completedAt = new Date().toISOString();
      execution.succeeded = false;
      execution.error = message;

      action.executions.push(execution);
      action.completedAt = execution.completedAt;
      action.status = ResilienceActionStatus.FAILED;
      action.error = message;

      const failed = this.store.saveAction(action);

      this.evidence.append({
        type: EvidenceEntryType.ACTION_FAILED,
        aggregateType: "resilience_action",
        aggregateId: failed.id,
        actor: dto.actor,
        payload: {
          actionId: failed.id,
          executionId: execution.id,
          attempt: execution.attempt,
          type: failed.type,
          status: failed.status,
          target: failed.target,
          dryRun: failed.dryRun,
          error: message,
        },
      });

      return failed;
    }
  }

  cancel(
    id: string,
    dto: ExecuteResilienceActionDto,
  ): ResilienceAction {
    const action = this.get(id);

    if (
      [
        ResilienceActionStatus.SUCCEEDED,
        ResilienceActionStatus.CANCELLED,
        ResilienceActionStatus.ROLLED_BACK,
      ].includes(action.status)
    ) {
      throw new BadRequestException(
        `Action cannot be cancelled from status ${action.status}`,
      );
    }

    action.status = ResilienceActionStatus.CANCELLED;
    action.completedAt = new Date().toISOString();

    return this.store.saveAction(action);
  }
}
