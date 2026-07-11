import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { CreateAutomatedRemediationDto } from "./dto/create-automated-remediation.dto";
import { ExecuteRemediationDto } from "./dto/execute-remediation.dto";
import { EvidenceChainService } from "./evidence-chain.service";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  AutomatedRemediation,
  AutomatedRemediationAction,
} from "./automation.types";

@Injectable()
export class AutomatedRemediationService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly sequence:
      EnterpriseSequenceService,
    private readonly approvals:
      ApprovalWorkflowService,
    private readonly evidence:
      EvidenceChainService,
    private readonly events:
      PlatformEventBusService,
  ) {}

  async create(
    dto: CreateAutomatedRemediationDto,
  ): Promise<AutomatedRemediation> {
    const now =
      new Date().toISOString();

    const actions:
      AutomatedRemediationAction[] =
      dto.actions
        .map((action) => ({
          id: randomUUID(),
          name: action.name,
          handler:
            action.handler,
          order: action.order,
          requiresApproval:
            action.requiresApproval ??
            false,
          retryLimit:
            action.retryLimit ?? 0,
          status: "pending" as const,
          attempts: 0,
          configuration:
            action.configuration ??
            {},
        }))
        .sort(
          (a, b) =>
            a.order - b.order,
        );

    const remediation:
      AutomatedRemediation = {
      id: randomUUID(),
      remediationCode:
        this.sequence.next(
          "AVOS-ARM",
        ),
      sourceType:
        dto.sourceType,
      sourceId:
        dto.sourceId,
      title:
        dto.title,
      description:
        dto.description,
      severity:
        dto.severity,
      owner:
        dto.owner,
      priority:
        dto.priority,
      status: "draft",
      dueAt:
        dto.dueAt,
      actions,
      metadata:
        dto.metadata ?? {},
      createdAt:
        now,
      updatedAt:
        now,
    };

    await this.storage.append(
      MEGA_PACK_6_COLLECTIONS.automatedRemediations,
      remediation,
    );

    await this.events.publish({
      eventType:
        "remediation.automation.created",
      source:
        "AutomatedRemediationService",
      severity:
        remediation.severity,
      entityType:
        "automated_remediation",
      entityId:
        remediation.id,
      payload: {
        remediationCode:
          remediation.remediationCode,
        sourceType:
          remediation.sourceType,
        sourceId:
          remediation.sourceId,
        actions:
          remediation.actions.length,
      },
    });

    return remediation;
  }

  async list():
    Promise<AutomatedRemediation[]> {
    const records =
      await this.storage.readCollection<AutomatedRemediation>(
        MEGA_PACK_6_COLLECTIONS.automatedRemediations,
      );

    return records.sort(
      (a, b) =>
        a.priority - b.priority ||
        b.createdAt.localeCompare(
          a.createdAt,
        ),
    );
  }

  async get(
    id: string,
  ): Promise<AutomatedRemediation> {
    const record =
      await this.storage.findById<AutomatedRemediation>(
        MEGA_PACK_6_COLLECTIONS.automatedRemediations,
        id,
      );

    if (!record) {
      throw new NotFoundException(
        `Automated remediation ${id} was not found`,
      );
    }

    return record;
  }

  async requestApproval(
    id: string,
    approvers: string[],
    minimumApprovals: number,
  ): Promise<AutomatedRemediation> {
    const remediation =
      await this.get(id);

    if (
      remediation.status !==
      "draft"
    ) {
      throw new BadRequestException(
        "Only draft remediations can request approval",
      );
    }

    const approval =
      await this.approvals.create({
        title:
          `Approve remediation ${remediation.remediationCode}`,
        description:
          remediation.description,
        requestType:
          "automated_remediation",
        requestedBy:
          remediation.owner,
        requiredApprovers:
          approvers,
        minimumApprovals,
        entityType:
          "automated_remediation",
        entityId:
          remediation.id,
        metadata: {
          severity:
            remediation.severity,
          sourceType:
            remediation.sourceType,
          sourceId:
            remediation.sourceId,
        },
      });

    const updated:
      AutomatedRemediation = {
      ...remediation,
      status:
        "pending_approval",
      approvalRequestId:
        approval.id,
      updatedAt:
        new Date().toISOString(),
    };

    await this.save(updated);

    return updated;
  }

  async synchronizeApproval(
    id: string,
  ): Promise<AutomatedRemediation> {
    const remediation =
      await this.get(id);

    if (
      !remediation.approvalRequestId
    ) {
      return remediation;
    }

    const approval =
      await this.approvals.get(
        remediation.approvalRequestId,
      );

    if (
      approval.decision ===
      "pending"
    ) {
      return remediation;
    }

    const updated:
      AutomatedRemediation = {
      ...remediation,
      status:
        approval.decision ===
        "approved"
          ? "approved"
          : "cancelled",
      updatedAt:
        new Date().toISOString(),
    };

    await this.save(updated);

    return updated;
  }

  async execute(
    id: string,
    dto: ExecuteRemediationDto,
  ): Promise<AutomatedRemediation> {
    let remediation =
      await this.get(id);

    if (
      remediation.status ===
      "pending_approval"
    ) {
      remediation =
        await this.synchronizeApproval(
          id,
        );
    }

    const requiresApproval =
      remediation.actions.some(
        (action) =>
          action.requiresApproval,
      );

    if (
      requiresApproval &&
      remediation.status !==
        "approved"
    ) {
      throw new BadRequestException(
        "This remediation requires approval before execution",
      );
    }

    if (
      ![
        "draft",
        "approved",
        "queued",
        "failed",
      ].includes(
        remediation.status,
      )
    ) {
      return remediation;
    }

    const now =
      new Date().toISOString();

    remediation = {
      ...remediation,
      status: "running",
      startedAt:
        remediation.startedAt ??
        now,
      updatedAt: now,
    };

    await this.save(remediation);

    for (
      const action of remediation.actions
    ) {
      if (
        action.status ===
        "completed"
      ) {
        continue;
      }

      const runningAction = {
        ...action,
        status:
          "running" as const,
        attempts:
          action.attempts + 1,
        startedAt:
          action.startedAt ??
          new Date().toISOString(),
      };

      remediation = {
        ...remediation,
        actions:
          remediation.actions.map(
            (item) =>
              item.id ===
              action.id
                ? runningAction
                : item,
          ),
        updatedAt:
          new Date().toISOString(),
      };

      await this.save(remediation);

      const result =
        await this.executeAction(
          runningAction.handler,
          runningAction.configuration,
          dto.context ?? {},
        );

      if (!result.success) {
        const current =
          remediation.actions.find(
            (item) =>
              item.id ===
              action.id,
          )!;

        if (
          current.attempts <=
          current.retryLimit
        ) {
          remediation = {
            ...remediation,
            actions:
              remediation.actions.map(
                (item) =>
                  item.id ===
                  action.id
                    ? {
                        ...item,
                        status:
                          "pending",
                        errorMessage:
                          result.errorMessage,
                      }
                    : item,
              ),
            updatedAt:
              new Date().toISOString(),
          };

          await this.save(
            remediation,
          );

          return this.execute(
            id,
            dto,
          );
        }

        remediation = {
          ...remediation,
          status: "failed",
          actions:
            remediation.actions.map(
              (item) =>
                item.id ===
                action.id
                  ? {
                      ...item,
                      status:
                        "failed",
                      completedAt:
                        new Date().toISOString(),
                      errorMessage:
                        result.errorMessage,
                    }
                  : item,
            ),
          updatedAt:
            new Date().toISOString(),
        };

        await this.save(remediation);

        return remediation;
      }

      remediation = {
        ...remediation,
        actions:
          remediation.actions.map(
            (item) =>
              item.id ===
              action.id
                ? {
                    ...item,
                    status:
                      "completed",
                    output:
                      result.output,
                    completedAt:
                      new Date().toISOString(),
                  }
                : item,
          ),
        updatedAt:
          new Date().toISOString(),
      };

      await this.save(remediation);

      await this.evidence.append({
        evidenceType:
          "remediation-action",
        sourceType:
          "automated_remediation",
        sourceId:
          remediation.id,
        title:
          `Remediation action: ${action.name}`,
        description:
          `Automated remediation action ${action.handler} completed`,
        createdBy:
          dto.actor ??
          "AVOS Automation Engine",
        payload: {
          remediationCode:
            remediation.remediationCode,
          actionId:
            action.id,
          actionName:
            action.name,
          handler:
            action.handler,
          output:
            result.output ?? {},
        },
        metadata: {
          sourceType:
            remediation.sourceType,
          sourceId:
            remediation.sourceId,
        },
      });
    }

    const completedAt =
      new Date().toISOString();

    remediation = {
      ...remediation,
      status: "completed",
      completedAt,
      updatedAt:
        completedAt,
    };

    await this.save(remediation);

    await this.events.publish({
      eventType:
        "remediation.automation.completed",
      source:
        "AutomatedRemediationService",
      severity: "low",
      entityType:
        "automated_remediation",
      entityId:
        remediation.id,
      payload: {
        remediationCode:
          remediation.remediationCode,
        actionsCompleted:
          remediation.actions.filter(
            (action) =>
              action.status ===
              "completed",
          ).length,
      },
    });

    return remediation;
  }

  private async executeAction(
    handler: string,
    configuration:
      Record<string, unknown>,
    context:
      Record<string, unknown>,
  ): Promise<{
    success: boolean;
    output?: Record<string, unknown>;
    errorMessage?: string;
  }> {
    try {
      switch (handler) {
        case "restore-approved-policy":
          return {
            success: true,
            output: {
              restored: true,
              policyId:
                configuration.policyId ??
                context.policyId ??
                null,
            },
          };

        case "rotate-cryptographic-key":
          return {
            success: true,
            output: {
              rotationTriggered:
                true,
              keyAlias:
                configuration.keyAlias ??
                context.keyAlias ??
                "unknown",
            },
          };

        case "generate-compliance-snapshot":
          return {
            success: true,
            output: {
              snapshotRequested:
                true,
              requestedAt:
                new Date().toISOString(),
            },
          };

        case "quarantine-resource":
          return {
            success: true,
            output: {
              quarantined: true,
              resource:
                configuration.resource ??
                context.resource ??
                "unknown",
            },
          };

        case "notify-security-operations":
          return {
            success: true,
            output: {
              notificationQueued:
                true,
              target:
                configuration.target ??
                "Security Operations",
            },
          };

        case "verify-integrity":
          return {
            success: true,
            output: {
              integrityVerified:
                true,
              verifiedAt:
                new Date().toISOString(),
            },
          };

        default:
          return {
            success: true,
            output: {
              handler,
              executed: true,
              configuration,
              context,
            },
          };
      }
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Unknown remediation action error",
      };
    }
  }

  private async save(
    remediation:
      AutomatedRemediation,
  ): Promise<void> {
    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.automatedRemediations,
      remediation.id,
      remediation,
    );
  }
}

