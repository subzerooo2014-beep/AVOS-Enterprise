import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  JsonValue,
  ResilienceConfiguration,
  RuntimeActor,
} from "../contracts/runtime-resilience.contracts";
import {
  ApprovalDecision,
  EvidenceEntryType,
  ResilienceConfigurationStatus,
  RuntimeControlMode,
  RuntimeEnvironment,
} from "../contracts/runtime-resilience.enums";
import {
  ApproveResilienceConfigurationDto,
  CreateResilienceConfigurationDto,
  RollbackResilienceConfigurationDto,
  SubmitResilienceConfigurationDto,
} from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { cloneJson } from "../utils/canonical-json.util";
import { sha256Json } from "../utils/runtime-hash.util";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";

@Injectable()
export class ResilienceConfigurationService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
  ) {}

  create(
    dto: CreateResilienceConfigurationDto,
  ): ResilienceConfiguration {
    const existingVersions = this.store.findConfigurationsByKey(dto.key);
    const version =
      existingVersions.length === 0
        ? 1
        : Math.max(...existingVersions.map((item) => item.version)) + 1;

    const previousConfiguration = existingVersions.find(
      (item) =>
        item.status === ResilienceConfigurationStatus.ACTIVE ||
        item.status === ResilienceConfigurationStatus.APPROVED,
    );

    const now = new Date().toISOString();

    const requiresApproval =
      dto.requiresApproval ??
      dto.environment === RuntimeEnvironment.PRODUCTION;

    const minimumApprovals = Math.max(
      0,
      dto.minimumApprovals ??
        (dto.environment === "production" ? 2 : 1),
    );

    const payload = cloneJson(
      dto.payload as Record<string, JsonValue>,
    );

    const configuration: ResilienceConfiguration = {
      id: randomUUID(),
      key: dto.key,
      name: dto.name,
      description: dto.description,
      environment: dto.environment,
      namespace: dto.namespace,
      version,
      status: ResilienceConfigurationStatus.DRAFT,
      controlMode: dto.controlMode,
      changeType: dto.changeType,
      payload,
      payloadHash: sha256Json(payload),
      tags: dto.tags ?? [],
      requiresApproval,
      minimumApprovals,
      approvals: [],
      previousConfigurationId: previousConfiguration?.id,
      createdBy: dto.actor,
      createdAt: now,
      updatedAt: now,
    };

    const saved = this.store.saveConfiguration(configuration);

    this.evidence.append({
      type: EvidenceEntryType.CONFIGURATION_CREATED,
      aggregateType: "resilience_configuration",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        configurationId: saved.id,
        key: saved.key,
        version: saved.version,
        environment: saved.environment,
        namespace: saved.namespace,
        status: saved.status,
        payloadHash: saved.payloadHash,
        requiresApproval: saved.requiresApproval,
        minimumApprovals: saved.minimumApprovals,
      },
    });

    return saved;
  }

  list(): ResilienceConfiguration[] {
    return this.store.listConfigurations();
  }

  get(id: string): ResilienceConfiguration {
    const item = this.store.getConfiguration(id);

    if (!item) {
      throw new NotFoundException(
        `Resilience configuration ${id} was not found`,
      );
    }

    return item;
  }

  submit(
    id: string,
    dto: SubmitResilienceConfigurationDto,
  ): ResilienceConfiguration {
    const configuration = this.get(id);

    if (
      configuration.status !== ResilienceConfigurationStatus.DRAFT
    ) {
      throw new BadRequestException(
        `Only draft configurations can be submitted. Current status: ${configuration.status}`,
      );
    }

    const now = new Date().toISOString();

    configuration.status = configuration.requiresApproval
      ? ResilienceConfigurationStatus.PENDING_APPROVAL
      : ResilienceConfigurationStatus.APPROVED;

    configuration.submittedAt = now;
    configuration.updatedAt = now;

    const saved = this.store.saveConfiguration(configuration);

    this.evidence.append({
      type: EvidenceEntryType.CONFIGURATION_SUBMITTED,
      aggregateType: "resilience_configuration",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        configurationId: saved.id,
        status: saved.status,
        reason: dto.reason ?? null,
        context: (dto.context ?? {}) as Record<string, JsonValue>,
      },
    });

    return saved;
  }

  approve(
    id: string,
    dto: ApproveResilienceConfigurationDto,
  ): ResilienceConfiguration {
    const configuration = this.get(id);

    if (
      configuration.status !==
      ResilienceConfigurationStatus.PENDING_APPROVAL
    ) {
      throw new BadRequestException(
        `Configuration is not pending approval. Current status: ${configuration.status}`,
      );
    }

    const duplicateDecision = configuration.approvals.find(
      (approval) => approval.actor.id === dto.actor.id,
    );

    if (duplicateDecision) {
      throw new ConflictException(
        `Actor ${dto.actor.id} already submitted a decision`,
      );
    }

    const now = new Date().toISOString();

    configuration.approvals.push({
      id: randomUUID(),
      configurationId: configuration.id,
      decision: dto.decision,
      actor: dto.actor,
      reason: dto.reason,
      decidedAt: now,
    });

    if (dto.decision === ApprovalDecision.REJECTED) {
      configuration.status =
        ResilienceConfigurationStatus.REJECTED;
      configuration.rejectionReason = dto.reason;
      configuration.rejectedAt = now;
      configuration.updatedAt = now;

      const rejected = this.store.saveConfiguration(configuration);

      this.evidence.append({
        type: EvidenceEntryType.CONFIGURATION_REJECTED,
        aggregateType: "resilience_configuration",
        aggregateId: rejected.id,
        actor: dto.actor,
        payload: {
          configurationId: rejected.id,
          reason: dto.reason,
          approvals: rejected.approvals.length,
        },
      });

      return rejected;
    }

    const approvedCount = configuration.approvals.filter(
      (approval) =>
        approval.decision === ApprovalDecision.APPROVED,
    ).length;

    if (approvedCount >= configuration.minimumApprovals) {
      configuration.status =
        ResilienceConfigurationStatus.APPROVED;
    }

    configuration.updatedAt = now;

    const approved = this.store.saveConfiguration(configuration);

    this.evidence.append({
      type: EvidenceEntryType.CONFIGURATION_APPROVED,
      aggregateType: "resilience_configuration",
      aggregateId: approved.id,
      actor: dto.actor,
      payload: {
        configurationId: approved.id,
        status: approved.status,
        approvedCount,
        minimumApprovals: approved.minimumApprovals,
        reason: dto.reason,
      },
    });

    return approved;
  }

  activate(
    id: string,
    actor: RuntimeActor,
  ): ResilienceConfiguration {
    const configuration = this.get(id);

    if (
      configuration.status !==
        ResilienceConfigurationStatus.APPROVED &&
      !(
        configuration.status ===
          ResilienceConfigurationStatus.DRAFT &&
        configuration.requiresApproval === false
      )
    ) {
      throw new BadRequestException(
        `Configuration must be approved before activation. Current status: ${configuration.status}`,
      );
    }

    if (
      this.store.getControlMode() === RuntimeControlMode.LOCKDOWN
    ) {
      throw new BadRequestException(
        "Runtime control plane is in lockdown mode",
      );
    }

    const activeVersions = this.store
      .findConfigurationsByKey(configuration.key)
      .filter(
        (item) =>
          item.status === ResilienceConfigurationStatus.ACTIVE &&
          item.id !== configuration.id,
      );

    const now = new Date().toISOString();

    for (const active of activeVersions) {
      active.status = ResilienceConfigurationStatus.SUPERSEDED;
      active.updatedAt = now;
      this.store.saveConfiguration(active);
    }

    configuration.status = ResilienceConfigurationStatus.ACTIVE;
    configuration.activatedAt = now;
    configuration.updatedAt = now;

    const saved = this.store.saveConfiguration(configuration);

    this.evidence.append({
      type: EvidenceEntryType.CONFIGURATION_ACTIVATED,
      aggregateType: "resilience_configuration",
      aggregateId: saved.id,
      actor,
      payload: {
        configurationId: saved.id,
        key: saved.key,
        version: saved.version,
        payloadHash: saved.payloadHash,
        supersededConfigurationIds: activeVersions.map(
          (item) => item.id,
        ),
      },
    });

    return saved;
  }

  rollback(
    id: string,
    dto: RollbackResilienceConfigurationDto,
  ): ResilienceConfiguration {
    const current = this.get(id);

    if (
      current.status !== ResilienceConfigurationStatus.ACTIVE
    ) {
      throw new BadRequestException(
        `Only active configurations can be rolled back. Current status: ${current.status}`,
      );
    }

    let target: ResilienceConfiguration | undefined;

    if (dto.targetConfigurationId) {
      target = this.store.getConfiguration(
        dto.targetConfigurationId,
      );
    } else if (current.previousConfigurationId) {
      target = this.store.getConfiguration(
        current.previousConfigurationId,
      );
    }

    if (!target) {
      throw new NotFoundException(
        "Rollback target configuration was not found",
      );
    }

    if (
      target.key !== current.key ||
      target.environment !== current.environment ||
      target.namespace !== current.namespace
    ) {
      throw new BadRequestException(
        "Rollback target does not belong to the same configuration scope",
      );
    }

    const now = new Date().toISOString();

    current.status = ResilienceConfigurationStatus.ROLLED_BACK;
    current.rolledBackAt = now;
    current.updatedAt = now;
    current.rollbackTarget = {
      configurationId: target.id,
      configurationVersion: target.version,
      baselineId: dto.baselineId,
      reason: dto.reason,
    };

    target.status = ResilienceConfigurationStatus.ACTIVE;
    target.activatedAt = now;
    target.updatedAt = now;

    this.store.saveConfiguration(current);
    const restored = this.store.saveConfiguration(target);

    this.evidence.append({
      type: EvidenceEntryType.CONFIGURATION_ROLLED_BACK,
      aggregateType: "resilience_configuration",
      aggregateId: current.id,
      actor: dto.actor,
      payload: {
        rolledBackConfigurationId: current.id,
        restoredConfigurationId: restored.id,
        restoredVersion: restored.version,
        baselineId: dto.baselineId ?? null,
        reason: dto.reason,
      },
    });

    return restored;
  }
}



